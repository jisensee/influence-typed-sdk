import {
  Process,
  Product,
  Building,
  Lot,
  Entity,
  Ship,
  Station,
  Permission,
} from '@influenceth/sdk'
import { ZodObject, type ZodRawShape, z } from 'zod'
import { activitySchema } from './activity-schema'

export const idsSchema = z.object({
  id: z.number(),
  label: z.number(),
  uuid: z.string().nullish(),
})

const expandLocations = (locations: EntityIds[]) => {
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

const locationsSchema = z.array(idsSchema).transform(expandLocations)
export const timestamp = z.number().transform((v) => new Date(v * 1000))

const controlSchema = z.object({
  controller: idsSchema,
})

const nameSchema = z
  .object({
    name: z.string(),
  })
  .nullish()
  .transform((v) => v?.name)

const nftSchema = z.object({
  owner: z.string().nullish(),
  chain: z.string(),
  owners: z.object({
    ethereum: z.string().nullish(),
    starknet: z.string().nullish(),
  }),
})

const productSchema = z.number().transform((v) => Product.getType(v))

const productAmountSchema = z.object({
  product: productSchema,
  amount: z.number(),
})

export type ProductAmount = z.infer<typeof productAmountSchema>

const inventorySchema = z.object({
  contents: z.array(productAmountSchema),
  inventoryType: z.number(),
  mass: z.number(),
  volume: z.number(),
  reservedMass: z.number(),
  reservedVolume: z.number(),
  status: z.number(),
  slot: z.number(),
})

const locationSchema = z
  .object({
    location: idsSchema.transform((ids) => expandLocations([ids])),
    locations: locationsSchema,
  })
  .nullish()

const processorSchema = z.object({
  destinationSlot: z.number(),
  finishTime: timestamp,
  outputProduct: z.number().transform((v) => Product.getType(v)),
  processorType: z.number(),
  recipes: z.number(),
  runningProcess: z.number().transform((v) => Process.getType(v)),
  secondaryEff: z.number().transform((v) => (v > 1 ? v - 1 : v)),
  slot: z.number(),
  status: z.number(),
  destination: idsSchema.nullish(),
})

const crewSchema = z.object({
  actionTarget: idsSchema.nullish(),
  actionRound: z.number(),
  actionStrategy: z.number(),
  actionType: z.number(),
  actionWeight: z.number(),
  delegatedTo: z.string(),
  lastFed: timestamp,
  readyAt: timestamp,
  roster: z.array(z.number()),
})

const extractorSchema = z.object({
  destination: idsSchema.nullish(),
  extractorType: z.number(),
  finishTime: timestamp,
  yield: z.number(),
  outputProduct: z.number().transform((v) => Product.getType(v)),
})

const buildingSchema = z.object({
  buildingType: z.number().transform((v) => Building.getType(v)),
  finishTime: timestamp,
  status: z.number(),
})

const celestialSchema = z.object({
  celestialType: z.number(),
  bonuses: z.number(),
  radius: z.number(),
  scanStatus: z.number(),
})

const shipSchema = z.object({
  emergencyAt: z.number(),
  readyAt: timestamp,
  shipType: z.number().transform(Ship.getType),
  status: z.number(),
  transitArrival: z.number(),
  transitDeparture: z.number(),
})

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
  stationType: z.number().transform((v) => Station.getType(v)),
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

export const entitySchema = z.object({
  id: z.number(),
  label: z.number(),
  uuid: z.string().nullish(),
  Control: controlSchema.nullish(),
  Celestial: celestialSchema.nullish(),
  Name: nameSchema,
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
  WhitelistAccountAgreements: whitelistAccountAgreements.nullish(),
  WhitelistAgreements: whitelistAgreements.nullish(),
})

export const orderSchema = z.object({
  amount: z.number(),
  entity: idsSchema,
  crew: idsSchema,
  makerFee: z.number(),
  orderType: z.number(),
  product: z.number().transform(Product.getType),
  price: z.number(),
  storage: idsSchema,
  storageSlot: z.number(),
  status: z.number(),
  validTime: timestamp,
  initialCaller: z.string(),
  initialAmount: z.number().nullish(),
  locations: locationsSchema,
})

export const searchResponseSchema = <Entity extends ZodRawShape>(
  entitySchema: ZodObject<Entity>
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
