import { Lot, Entity } from '@influenceth/sdk'
import { ZodObject, type ZodRawShape, z } from 'zod'

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
  chain: z.string().nullish(),
  price: z.number().nullish(),
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

export const locationSchema = z
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

export const crewSchema = z
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
  abundances: z.string().nullish(),
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
    transitOrigin: idsSchema.nullish(),
    transitDestination: idsSchema.nullish(),
    variant: z.number(),
  })
  .transform((o) => ({
    ...o,
    readyAtTimestamp: timestamp(o.readyAt),
    transitArrivalTimestamp: optionalTimestamp(o.transitArrival),
    transitDepartureTimestamp: optionalTimestamp(o.transitDeparture),
  }))

export const crewmateSchema = z.object({
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

const publicPolicies = z.array(
  z.object({
    permission: z.number(),
    public: z.boolean(),
  })
)

export const orderSchema = z.object({
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
  validTime: z.number().transform(timestamp),
  initialCaller: z.string(),
  initialAmount: z.number().nullish(),
  locations: z.array(idsSchema).transform(resolveLocations),
})

const privateSaleSchema = z.object({
  amount: z.number(),
  status: z.number(),
})

const depositSchema = z
  .object({
    finishTime: z.number(),
    /** total yield of this deposit in grams */
    initialYield: z.number(),
    /** yield that is still available for extraction in grams */
    remainingYield: z.number(),
    resource: z.number(),
    status: z.number(),
    yieldEff: z.number(),
  })
  .transform((o) => ({
    ...o,
    finishTimestamp: timestamp(o.finishTime),
  }))

export const orbitSchema = z.object({
  a: z.number(),
  argp: z.number(),
  ecc: z.number(),
  inc: z.number(),
  m: z.number(),
  raan: z.number(),
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
          _score: z.number().nullish(),
          sort: z.array(z.number()).nullish(),
        })
      ),
    }),
  })

export const entitySchema = z.object({
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
  PublicPolicies: publicPolicies.default([]),
  PrivateSale: privateSaleSchema.nullish(),
  Deposit: depositSchema.nullish(),
  Orbit: orbitSchema.nullish(),
})

const entityWithUuidSchema = {
  label: z.number(),
  id: z.number(),
  uuid: z.string(),
}
const idLabelSchema = z.object({
  id: z.number(),
  label: z.number(),
})
const resolvedTimestampSchema = z.number().transform(timestamp)

const crewDataSchema = z.object({
  ...entityWithUuidSchema,
  Crew: crewSchema,
  Location: locationSchema,
})
const crewmatesDataSchema = z.array(
  z.object({
    ...entityWithUuidSchema,
    Crewmate: crewmateSchema,
  })
)
const stationDataSchema = z.object({
  entity: z.object(entityWithUuidSchema),
  population: z.number(),
  stationType: z.number(),
})
const baseEventSchema = {
  logIndex: z.number(),
  timestamp: resolvedTimestampSchema,
  transactionIndex: z.number(),
  transactionHash: z.string(),
  version: z.number(),
}
const baseReturnValuesSchema = {
  callerCrew: idLabelSchema,
  caller: z.string(),
}

export const activitySchema = z.object({
  id: z.string(),
  unresolvedFor: z.array(idsSchema).default([]),
  entities: z.array(idsSchema),
  createdAt: z.string().transform((v) => new Date(v)),
  updatedAt: z.string().transform((v) => new Date(v)),
  hash: z.string().nullish(),
  addresses: z.array(z.string()),
  data: z
    .object({
      crew: crewDataSchema,
      crewmates: crewmatesDataSchema,
      station: stationDataSchema,
    })
    .nullish(),
  event: z.discriminatedUnion('name', [
    z.object({
      name: z.literal('MaterialProcessingFinished'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        processor: idLabelSchema,
        processorSlot: z.number(),
      }),
    }),
    z.object({
      name: z.literal('SellOrderFilled'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        sellerCrew: z.object({ id: z.number() }),
        product: z.number(),
        amount: z.number(),
        price: z.number(),
      }),
    }),
    z.object({
      name: z.literal('ConstructionStarted'),
      ...baseEventSchema,
      returnValues: z
        .object({
          ...baseReturnValuesSchema,
          building: idLabelSchema,
          finishTime: z.number(),
        })
        .transform((o) => ({
          ...o,
          finishTimestamp: timestamp(o.finishTime),
        })),
    }),
    z.object({
      name: z.literal('MaterialProcessingStarted'),
      ...baseEventSchema,
      returnValues: z
        .object({
          ...baseReturnValuesSchema,
          processor: idLabelSchema,
          processorSlot: z.number(),
          process: z.number(),
          origin: idLabelSchema,
          originSlot: z.number(),
          inputs: z.array(productAmountSchema),
          outputs: z.array(productAmountSchema),
          destination: idLabelSchema,
          finishTime: z.number(),
          destinationSlot: z.number(),
        })
        .transform((o) => ({
          ...o,
          finishTimestamp: timestamp(o.finishTime),
        })),
    }),
    z.object({
      name: z.literal('SamplingDepositStarted'),
      ...baseEventSchema,
      returnValues: z
        .object({
          ...baseReturnValuesSchema,
          deposit: idLabelSchema,
          lot: idLabelSchema,
          resource: z.number(),
          improving: z.boolean(),
          origin: idLabelSchema,
          originSlot: z.number(),
          finishTime: z.number(),
        })
        .transform((o) => ({
          ...o,
          finishTimestamp: timestamp(o.finishTime),
        })),
    }),
    z.object({
      name: z.literal('ShipAssemblyStarted'),
      ...baseEventSchema,
      returnValues: z
        .object({
          ...baseReturnValuesSchema,
          ship: idLabelSchema,
          shipType: z.number(),
          dryDock: idLabelSchema,
          dryDockSlot: z.number(),
          finishTime: z.number(),
        })
        .transform((o) => ({
          ...o,
          finishTimestamp: timestamp(o.finishTime),
        })),
    }),
    z.object({
      name: z.literal('ResourceExtractionStarted'),
      ...baseEventSchema,
      returnValues: z
        .object({
          ...baseReturnValuesSchema,
          deposit: idLabelSchema,
          resource: z.number(),
          yield: z.number(),
          extractor: idLabelSchema,
          extractorSlot: z.number(),
          destination: idLabelSchema,
          destinationSlot: z.number(),
          finishTime: z.number(),
        })
        .transform((o) => ({
          ...o,
          finishTimestamp: timestamp(o.finishTime),
        })),
    }),
    z.object({
      name: z.literal('SurfaceScanStarted'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('PublicPolicyAssigned'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('PrepaidAgreementAccepted'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('PrepaidAgreementExtended'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('RemovedFromWhitelist'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('SellOrderCreated'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('AsteroidManaged'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('AsteroidPurchased'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('AsteroidScanned'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('BuildingRepossessed'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('BuyOrderFilled'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('BuyOrderCreated'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ConstructionPlanned'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ConstructionAbandoned'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ConstructionFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ConstructionDeconstructed'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewDelegated'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewFormed'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewmatePurchased'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewmateRecruited'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewmatesArranged'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewmatesExchanged'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewEjected'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('CrewStationed'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('DeliveryFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('AddedToWhitelist'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('DeliverySent'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('DeliveryReceived'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('EmergencyActivated'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('EmergencyDeactivated'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('EmergencyPropellantCollected'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('FoodSupplied'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ArrivalRewardClaimed'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('PrepareForLaunchRewardClaimed'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('NameChanged'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('RandomEventResolved'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ResourceExtractionFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ResourceScanFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('SamplingDepositFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ShipAssemblyFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ShipDocked'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ShipUndocked'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('SurfaceScanFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('Transfer'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('TransitStarted'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('TransitFinished'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ShipCommandeered'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('DepositListedForSale'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('DepositUnlistedForSale'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('DepositPurchased'),
      ...baseEventSchema,
    }),
  ]),
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
export type EntityPrivateSale = z.infer<typeof privateSaleSchema>
export type EntityDeposit = z.infer<typeof depositSchema>
export type EntityOrbit = z.infer<typeof orbitSchema>
export type EntityIds = z.infer<typeof idsSchema>
export type Activity = z.infer<typeof activitySchema>
export type EntityOrder = z.infer<typeof orderSchema>
export type ActivityEvent = Activity['event']['name']
