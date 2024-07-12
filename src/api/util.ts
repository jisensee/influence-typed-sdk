import { z } from 'zod'

import esb from 'elastic-builder'
import { Address, Asteroid, Building, Entity, Ship } from '@influenceth/sdk'
import type { RawRequest } from './raw-request'
import { makeSearch } from './search'
import { makeEntities } from './entity'
import { entitySchema, searchResponseSchema } from './types'

export const makeUtils = (rawRequest: RawRequest) => ({
  floorPrices: makeFloorPrices(rawRequest),
  asteroidNames: makeAsteroidNames(rawRequest),
  buildingNames: makeBuildingNames(rawRequest),
  crews: makeCrews(rawRequest),
  warehouses: makeWarehouses(rawRequest),
  ships: makeShips(rawRequest),
  buildings: makeBuildings(rawRequest),
  asteroidPage: makeAsteroidPage(rawRequest),
})

const makeFloorPrices =
  (rawRequest: RawRequest) => async (productIds: number[]) => {
    const request = esb
      .requestBodySearch()
      .size(0)
      .query(
        esb
          .boolQuery()
          .must([
            esb.matchQuery('orderType', '2'),
            esb.matchQuery('status', '1'),
            esb.termsQuery('product', productIds),
          ])
      )
      .agg(
        esb
          .termsAggregation('products', 'product')
          .size(9999)
          .agg(esb.minAggregation('floorPrice', 'price'))
      )
      .toJSON()

    const { aggregations } = await makeSearch(rawRequest)({
      index: 'order',
      options: {
        responseSchema: z.object({
          aggregations: z.object({
            products: z.object({
              buckets: z.array(
                z.object({
                  key: z.number(),
                  floorPrice: z.object({
                    value: z.number(),
                  }),
                })
              ),
            }),
          }),
        }),
      },
      request,
    })

    const floorPrices = new Map<number, number>()
    aggregations.products.buckets.forEach((bucket) => {
      floorPrices.set(bucket.key, bucket.floorPrice.value)
    })
    return floorPrices
  }

const makeAsteroidNames =
  (rawRequest: RawRequest) => async (asteroidIds: number[]) => {
    const entities = makeEntities(rawRequest)
    const asteroids = await entities({
      id: asteroidIds,
      label: Entity.IDS.ASTEROID,
      components: ['Name', 'Celestial'],
    })

    return new Map(
      asteroids.map(
        (e) =>
          [
            e.id,
            e.Name?.name ??
              Asteroid.getBaseName(e.id, e.Celestial?.celestialType ?? 0),
          ] as const
      )
    )
  }

const makeBuildingNames =
  (rawRequest: RawRequest) => async (buildingIds: number[]) => {
    const entities = makeEntities(rawRequest)
    const buildings = await entities({
      id: buildingIds,
      label: Entity.IDS.BUILDING,
      components: ['Name'],
    })
    return new Map(buildings.map((e) => [e.id, e.nameWithDefault] as const))
  }

const makeCrews = (rawRequest: RawRequest) => async (walletAddress: string) =>
  makeEntities(rawRequest)({
    match: {
      path: 'Crew.delegatedTo',
      value: Address.toStandard(walletAddress),
    },
    label: 1,
  })

const makeBuildings =
  (rawRequest: RawRequest) => async (walletAddress: string) => {
    const crewUuids = (await makeCrews(rawRequest)(walletAddress)).map((c) =>
      Entity.packEntity({ id: c.id, label: Entity.IDS.CREW })
    )
    return makeSearch(rawRequest)({
      index: 'building',
      request: esb
        .requestBodySearch()
        .size(9999)
        .query(esb.termsQuery('Control.controller.uuid', crewUuids))
        .toJSON(),
      options: {
        responseSchema: searchResponseSchema(entitySchema),
      },
    }).then((r) => r.hits.hits.map((h) => h._source))
  }

export type AsteroidPageArgs = {
  size: number
  searchAfter?: number[]
}

const makeAsteroidPage =
  (rawRequest: RawRequest) =>
  ({ size, searchAfter }: AsteroidPageArgs) => {
    const request = esb
      .requestBodySearch()
      .size(size)
      .sort(new esb.Sort('id').order('asc'))
      .trackTotalHits(true)
      .query(esb.boolQuery().filter(esb.existsQuery('Nft.owner')))

    return makeSearch(rawRequest)({
      options: {
        responseSchema: searchResponseSchema(entitySchema),
      },
      index: 'asteroid',
      request: (searchAfter
        ? request.searchAfter(searchAfter)
        : request
      ).toJSON(),
    }).then(({ hits: { hits, total } }) => {
      const asteroids = hits.map((h) => h._source)
      const nextSearchAfter =
        hits.length > 0 ? hits[hits.length - 1]?.sort : undefined

      return { asteroids, nextSearchAfter, totalCount: total.value }
    })
  }

const makeWarehouses =
  (rawRequest: RawRequest) =>
  async (walletAddress: string, asteroidId?: number) => {
    const crews = await makeCrews(rawRequest)(walletAddress)
    const crewIds = crews.map((c) => c.id)
    const request = esb
      .requestBodySearch()
      .size(9999)
      .query(
        esb
          .boolQuery()
          .must([
            esb.termQuery('Building.buildingType', Building.IDS.WAREHOUSE),
            esb.termQuery(
              'Building.status',
              Building.CONSTRUCTION_STATUSES.OPERATIONAL
            ),
            esb.termsQuery('Control.controller.id', crewIds),
            ...(asteroidId ? [asteroidLocation(asteroidId)] : []),
          ])
      )

    return makeSearch(rawRequest)({
      index: 'building',
      request,
      options: {
        responseSchema: searchResponseSchema(entitySchema),
      },
    }).then((r) => r.hits.hits.map((h) => h._source))
  }

const makeShips =
  (rawRequest: RawRequest) =>
  async (walletAddress: string, asteroidId?: number) => {
    const crews = await makeCrews(rawRequest)(walletAddress)
    const crewIds = crews.map((c) => c.id)
    const request = esb
      .requestBodySearch()
      .size(9999)
      .query(
        esb
          .boolQuery()
          .must([
            esb.termQuery('Ship.status', Ship.STATUSES.AVAILABLE),
            esb.termsQuery('Control.controller.id', crewIds),
            ...(asteroidId ? [asteroidLocation(asteroidId)] : []),
          ])
      )

    return makeSearch(rawRequest)({
      index: 'ship',
      request,
      options: {
        responseSchema: searchResponseSchema(entitySchema),
      },
    }).then((r) => r.hits.hits.map((h) => h._source))
  }

const asteroidLocation = (asteroidId: number) =>
  esb.nestedQuery(
    esb
      .boolQuery()
      .must([
        esb.termQuery('Location.locations.label', Entity.IDS.ASTEROID),
        esb.termQuery('Location.locations.id', asteroidId),
      ]),
    'Location.locations'
  )
