import { Lot, Entity, Building, Ship } from '@influenceth/sdk'
import { ZodObject, type ZodRawShape, z, ZodEffects } from 'zod'
import { activitySchema } from './activity-schema'

export const idsSchema = z.object({
  id: z.number(),
  label: z.number(),
  uuid: z.string().nullish(),
})

const resolveLocations = (locations: EntityIds[]) => {
  const asteroid = locations.find((l) => l.label === Entity.IDS.ASTEROID)
  const lot = locations.find((l) => l.label === Entity.IDS.LOT)
  const building = locations.find((l) => l.label === Entity.IDS.BUILDING)
  const ship = locations.find((l) => l.label === Entity.IDS.SHIP)

  return {
    asteroid: asteroid
      ? {
          ...asteroid,
        }
      : undefined,
    lot: lot
      ? {
          ...lot,
          lotIndex: Lot.toIndex(lot.id),
        }
      : undefined,
    building,
    ship,
  }
}

const timestamp = (value: number) => new Date(value * 1000)
const optionalTimestamp = (value?: number | null) =>
  value !== undefined && value !== null ? timestamp(value) : value

const controlSchema = z.object({
  controller: idsSchema,
})

const nftSchema = z.object({
  owner: z.string().nullish(),
  chain: z.string(),
  owners: z.object({
    ethereum: z.string().nullish(),
    starknet: z.string().nullish(),
  }),
})

const productAmountSchema = z.object({
  product: z.number(),
  /** amount of the product in KG or pieces */
  amount: z.number(),
})

export type ProductAmount = z.infer<typeof productAmountSchema>

const inventorySchema = z.object({
  contents: z.array(productAmountSchema),
  inventoryType: z.number(),
  /** total mass of goods in this inventory in grams */
  mass: z.number(),
  /** total volume of goods in this inventory in mililiters */
  volume: z.number(),
  /** mass of incoming goods in grams */
  reservedMass: z.number(),
  /** volume of incoming goods in mililiters */
  reservedVolume: z.number(),
  status: z.number(),
  slot: z.number(),
})

const locationSchema = z
  .object({
    location: idsSchema,
    locations: z.array(idsSchema),
  })
  .nullish()
  .transform((o) =>
    o
      ? {
          ...o,
          resolvedLocation: resolveLocations([o.location]),
          resolvedLocations: resolveLocations(o.locations),
        }
      : o
  )

const processorSchema = z
  .object({
    destinationSlot: z.number(),
    finishTime: z.number(),
    outputProduct: z.number(),
    processorType: z.number(),
    recipes: z.number(),
    runningProcess: z.number(),
    secondaryEff: z.number().transform((v) => (v > 1 ? v - 1 : v)),
    slot: z.number(),
    status: z.number(),
    destination: idsSchema.nullish(),
  })
  .transform((o) => ({
    ...o,
    finishTimestamp: timestamp(o.finishTime),
  }))

const crewSchema = z
  .object({
    actionTarget: idsSchema.nullish(),
    actionRound: z.number(),
    actionStrategy: z.number().nullish(),
    actionType: z.number(),
    actionWeight: z.number().nullish(),
    delegatedTo: z.string(),
    lastFed: z.number(),
    readyAt: z.number(),
    roster: z.array(z.number()),
  })
  .transform((o) => ({
    ...o,
    lastFedTimestamp: timestamp(o.lastFed),
    readyAtTimestamp: timestamp(o.readyAt),
  }))

const extractorSchema = z
  .object({
    destination: idsSchema.nullish(),
    extractorType: z.number(),
    finishTime: z.number(),
    /** yield of the extracted raw material in KG */
    yield: z.number(),
    outputProduct: z.number(),
  })
  .transform((o) => ({
    ...o,
    finishTimestamp: timestamp(o.finishTime),
  }))

const buildingSchema = z
  .object({
    buildingType: z.number(),
    finishTime: z.number(),
    status: z.number(),
  })
  .transform((o) => ({
    ...o,
    finishTimestamp: timestamp(o.finishTime),
  }))

const celestialSchema = z.object({
  celestialType: z.number(),
  bonuses: z.number(),
  /** radius of the celestial in meters */
  radius: z.number(),
  scanStatus: z.number(),
})

const shipSchema = z
  .object({
    emergencyAt: z.number().nullish(),
    readyAt: z.number(),
    shipType: z.number(),
    status: z.number(),
    transitArrival: z.number().nullish(),
    transitDeparture: z.number().nullish(),
  })
  .transform((o) => ({
    ...o,
    readyAtTimestamp: timestamp(o.readyAt),
    transitArrivalTimestamp: optionalTimestamp(o.transitArrival),
    transitDepartureTimestamp: optionalTimestamp(o.transitDeparture),
  }))

const crewmateSchema = z.object({
  appearance: z.string(),
  class: z.number(),
  coll: z.number(),
  cosmetic: z.array(z.number()),
  impactful: z.array(z.number()),
  status: z.number(),
  title: z.number(),
})

export const stationSchema = z.object({
  population: z.number(),
  stationType: z.number(),
})

const whitelistAccountAgreements = z.array(
  z.object({
    permission: z.number(),
    permitted: z.string(),
    whitelisted: z.boolean(),
  })
)

const whitelistAgreements = z.array(
  z.object({
    permission: z.number(),
    permitted: idsSchema,
    whitelisted: z.boolean(),
  })
)

const prepaidAgreements = z.array(
  z
    .object({
      permission: z.number(),
      permitted: idsSchema,
      /** duration of the initial agreement in seconds */
      initialTerm: z.number(),
      /** notice period in seconds */
      noticePeriod: z.number(),
      noticeTime: z.number(),
      /** price of the agreement in sway per second */
      rate: z.number(),
      startTime: z.number(),
      endTime: z.number(),
    })
    .transform((o) => ({
      ...o,
      startTimestamp: timestamp(o.startTime),
      endTimestamp: timestamp(o.endTime),
    }))
)

const prepaidPolicies = z.array(
  z.object({
    permission: z.number(),
    /** duration of the initial agreement in seconds */
    initialTerm: z.number(),
    /** notice period in seconds */
    noticePeriod: z.number(),
    rate: z.number(),
  })
)

export const orderSchema = z
  .object({
    amount: z.number(),
    entity: idsSchema,
    crew: idsSchema,
    makerFee: z.number(),
    orderType: z.number(),
    product: z.number(),
    /** price per KG/piece in sway */
    price: z.number(),
    storage: idsSchema,
    storageSlot: z.number(),
    status: z.number(),
    validTime: z.number(),
    initialCaller: z.string(),
    initialAmount: z.number().nullish(),
    locations: z.array(idsSchema),
  })
  .transform((o) => ({
    ...o,
    validTimestamp: timestamp(o.validTime),
    resolvedLocations: resolveLocations(o.locations),
  }))

export const searchResponseSchema = <Entity extends ZodRawShape>(
  entitySchema: ZodObject<Entity> | ZodEffects<ZodObject<Entity>>
) =>
  z.object({
    hits: z.object({
      total: z.object({
        value: z.number(),
      }),
      hits: z.array(
        z.object({
          _source: entitySchema,
          sort: z.array(z.number()).nullish(),
        })
      ),
    }),
  })

export const entitySchema = z
  .object({
    id: z.number(),
    label: z.number(),
    uuid: z.string().nullish(),
    Control: controlSchema.nullish(),
    Celestial: celestialSchema.nullish(),
    Name: z
      .object({
        name: z.string(),
      })
      .nullish(),
    Nft: nftSchema.nullish(),
    Inventories: z.array(inventorySchema).default([]),
    Location: locationSchema.nullish(),
    Processors: z.array(processorSchema).default([]),
    Crew: crewSchema.nullish(),
    Crewmate: crewmateSchema.nullish(),
    Extractors: z.array(extractorSchema).default([]),
    Building: buildingSchema.nullish(),
    Ship: shipSchema.nullish(),
    Station: stationSchema.nullish(),
    WhitelistAccountAgreements: whitelistAccountAgreements.default([]),
    WhitelistAgreements: whitelistAgreements.default([]),
    PrepaidAgreements: prepaidAgreements.default([]),
    PrepaidPolicies: prepaidPolicies.default([]),
  })
  .transform((o) => {
    const getBaseName = () => {
      if (o.Name?.name) return o.Name.name

      if (o.Ship) {
        return `${Ship.getType(o.Ship.shipType).name}#${o.id}`
      }
      if (o.Building) {
        return `${Building.getType(o.Building.buildingType).name}#${o.id}`
      }
      if (o.Crew) {
        return `Crew#${o.id}`
      }
      return (
        Object.entries(Entity.IDS).find((e) => o.label === e[1])?.[0] ??
        'Unknown'
      )
    }
    return {
      ...o,
      nameWithDefault: getBaseName(),
    }
  })

export const entityResponseSchema = z.array(entitySchema)

export type EntityResponse = z.infer<typeof entityResponseSchema>
export type InfluenceEntity = z.infer<typeof entitySchema>
export type EntityControl = z.infer<typeof controlSchema>
export type EntityNft = z.infer<typeof nftSchema>
export type EntityInventory = z.infer<typeof inventorySchema>
export type EntityLocation = z.infer<typeof locationSchema>
export type EntityProcessor = z.infer<typeof processorSchema>
export type EntityCrew = z.infer<typeof crewSchema>
export type EntityExtractor = z.infer<typeof extractorSchema>
export type EntityBuilding = z.infer<typeof buildingSchema>
export type EntityCelestial = z.infer<typeof celestialSchema>
export type EntityShip = z.infer<typeof shipSchema>
export type EntityCrewmate = z.infer<typeof crewmateSchema>
export type EntityStation = z.infer<typeof stationSchema>
export type EntityIds = z.infer<typeof idsSchema>
export type Activity = z.infer<typeof activitySchema>
export type EntityOrder = z.infer<typeof orderSchema>
export type ActivityEvent = Activity['event']['name']
