import { z } from 'zod'
import type { RawRequest } from './raw-request'
import type { ActivityEvent } from './types'
import { activitySchema } from './activity-schema'

export type ActivityArgs = {
  uuid?: string
  page?: number
  pageSize?: number
  unresolved?: boolean
  types?: ActivityEvent[]
}

export const makeActivities =
  (rawRequest: RawRequest) => async (args: ActivityArgs) => {
    const params = new URLSearchParams({
      page: args.page?.toString() ?? '1',
      pageSize: args.pageSize?.toString() ?? '25',
    })
    if (args.types) {
      params.append('types', args.types.join(','))
    }
    if (args.unresolved !== undefined) {
      params.append('unresolved', args.unresolved.toString())
    }

    return rawRequest(
      `v2/entities/${args.uuid}/activity?${params.toString()}`,
      {
        responseSchema: z.array(activitySchema),
      }
    )
  }
