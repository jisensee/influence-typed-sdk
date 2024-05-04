import { z } from 'zod'
import type { RawRequest } from './raw-request'
import { type EntityIds, entitySchema } from './types'

export type EntityMatch = {
  path: string
  value: string | number
}
export type EntityArgsWithMatch = {
  match: EntityMatch
}
export type EntityArgsWithId = {
  id: number | number[]
  label: number
}
export type EntitiesArgs = (EntityArgsWithMatch | EntityArgsWithId) & {
  components?: string[]
}
export const makeEntities =
  (rawRequest: RawRequest) => (args: EntitiesArgs) => {
    const queryParams = new URLSearchParams()

    if ('id' in args) {
      queryParams.append(
        'id',
        typeof args.id === 'number' ? args.id.toString() : args.id.join(',')
      )
      queryParams.append('label', args.label.toString())
    } else {
      const matchValue =
        typeof args.match.value === 'string'
          ? `"${args.match.value}"`
          : args.match.value

      queryParams.append('match', `${args.match.path}:${matchValue}`)
    }

    if (args.components) {
      queryParams.append('components', args.components.join(','))
    }

    return rawRequest(`v2/entities?${queryParams.toString()}`, {
      responseSchema: z.array(entitySchema),
    })
  }

export type EntityArgs = Omit<EntityIds, 'uuid'> & {
  components?: string[]
}
export const makeEntity = (rawRequest: RawRequest) => (args: EntityArgs) =>
  makeEntities(rawRequest)(args).then((entities) => entities[0])
