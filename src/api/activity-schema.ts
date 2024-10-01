import { Product } from '@influenceth/sdk'
import { z } from 'zod'
import { crewSchema, crewmateSchema, idsSchema, locationSchema } from './types'

const timestamp = z.number().transform((v) => new Date(v * 1000))
const entitySchema = z.object({
  label: z.number(),
  id: z.number(),
})
const entityWithUuidSchema = {
  label: z.number(),
  id: z.number(),
  uuid: z.string(),
}
const productAmountSchema = z.object({
  product: z.number(),
  amount: z.number(),
})

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
  timestamp,
  transactionIndex: z.number(),
  transactionHash: z.string(),
  version: z.number(),
}
const baseReturnValuesSchema = {
  callerCrew: entitySchema,
  caller: z.string(),
}

export const activitySchema = z.object({
  id: z.string(),
  unresolvedFor: z.array(idsSchema),
  entities: z.array(idsSchema),
  createdAt: z.string().transform((v) => new Date(v)),
  updatedAt: z.string().transform((v) => new Date(v)),
  hash: z.string(),
  addresses: z.array(z.string()),
  data: z.object({
    crew: crewDataSchema,
    crewmates: crewmatesDataSchema,
    station: stationDataSchema,
  }),
  event: z.discriminatedUnion('name', [
    z.object({
      name: z.literal('MaterialProcessingFinished'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        callerCrew: z.object({ id: z.number() }),
        processor: z.object({ id: z.number() }),
        processorSlot: z.number(),
      }),
    }),
    z.object({
      name: z.literal('SellOrderFilled'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        sellerCrew: z.object({ id: z.number() }),
        product: z.number().transform(Product.getType),
        amount: z.number(),
        price: z.number(),
      }),
    }),
    z.object({
      name: z.literal('PublicPolicyAssigned'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('SurfaceScanStarted'),
      ...baseEventSchema,
    }),
    z.object({
      name: z.literal('ConstructionStarted'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        building: entitySchema,
        finishTime: timestamp,
      }),
    }),
    z.object({
      name: z.literal('MaterialProcessingStarted'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        processor: entitySchema,
        processorSlot: z.number(),
        process: z.number(),
        origin: entitySchema,
        originSlot: z.number(),
        inputs: z.array(productAmountSchema),
        outputs: z.array(productAmountSchema),
        destination: entitySchema,
        destinationSlot: z.number(),
      }),
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
      name: z.literal('SamplingDepositStarted'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        deposit: entitySchema,
        lot: entitySchema,
        resource: z.number(),
        improving: z.boolean(),
        origin: entitySchema,
        originSlot: z.number(),
      }),
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
      name: z.literal('ResourceExtractionStarted'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        deposit: entitySchema,
        resource: z.number(),
        yield: z.number(),
        extractor: entitySchema,
        extractorSlot: z.number(),
        destination: entitySchema,
        destinationSlot: z.number(),
        finishTime: timestamp,
      }),
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
      name: z.literal('ShipAssemblyStarted'),
      ...baseEventSchema,
      returnValues: z.object({
        ...baseReturnValuesSchema,
        ship: entitySchema,
        shipType: z.number(),
        dryDock: entitySchema,
        dryDockSlot: z.number(),
        finishTime: timestamp,
      }),
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
