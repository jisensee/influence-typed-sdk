import {
  Asteroid,
  Building,
  Entity,
  Process,
  Processor,
  Ship,
  type InfluenceEntity,
} from '@influenceth/sdk'
import * as R from 'remeda'
import type { ProductAmount } from './types'

export const getInOutputs = (inOrOutputs: Record<number, number>) =>
  Object.keys(inOrOutputs).map((i) => parseInt(i, 10))

export const getOutputAmounts = (
  processId: number,
  outputProductId: number,
  recipes: number,
  secondaryEff: number
): ProductAmount[] =>
  Object.entries(Process.getType(processId).outputs ?? {}).map(
    ([productId, amount]) => ({
      product: parseInt(productId, 10),
      amount:
        amount *
        recipes *
        (productId === outputProductId.toString() ? 1 : secondaryEff),
    })
  )

/**
 * Sum up all amounts of the same products in the given array. Returns each product only once.
 */
export const reduceProductAmounts = (
  amounts: ProductAmount[]
): ProductAmount[] => {
  const grouped = R.groupBy(amounts, (a) => a.product)
  return R.entries(grouped).map(([productId, amounts]) => ({
    product: parseInt(productId),
    amount: amounts.reduce((acc, a) => acc + a.amount, 0),
  }))
}

export const processorToBuilding = (processorType: number) => {
  switch (processorType) {
    case Processor.IDS.REFINERY:
      return Building.getType(Building.IDS.REFINERY)
    case Processor.IDS.FACTORY:
      return Building.getType(Building.IDS.FACTORY)
    case Processor.IDS.SHIPYARD:
      return Building.getType(Building.IDS.SHIPYARD)
    case Processor.IDS.BIOREACTOR:
    default:
      return Building.getType(Building.IDS.BIOREACTOR)
  }
}

export const getEntityName = (entity: InfluenceEntity) => {
  if (entity.Name?.name) return entity.Name.name

  if (entity.Ship) {
    return `${Ship.getType(entity.Ship.shipType).name}#${entity.id}`
  }
  if (entity.Building) {
    return `${Building.getType(entity.Building.buildingType).name}#${entity.id}`
  }
  if (entity.Crew) {
    return `Crew#${entity.id}`
  }
  if (entity.Celestial) {
    return Asteroid.getBaseName(entity.id, entity.Celestial.celestialType)
  }
  return (
    Object.entries(Entity.IDS).find((e) => entity.label === e[1])?.[0] ??
    'Unknown'
  )
}
