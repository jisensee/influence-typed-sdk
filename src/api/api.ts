import { type ApiConfig, makeRawRequest } from './raw-request'
import { makeSearch } from './search'
import { makeEntities, makeEntity } from './entity'
import { makeUtils } from './util'
import { makeActivities } from './activity'

export const makeInfluenceApi = (config: ApiConfig) => {
  const rawRequest = makeRawRequest(config)
  return {
    rawRequest,
    search: makeSearch(rawRequest),
    entity: makeEntity(rawRequest),
    entities: makeEntities(rawRequest),
    activities: makeActivities(rawRequest),
    util: makeUtils(rawRequest),
  }
}

export type InfluenceApi = ReturnType<typeof makeInfluenceApi>

export const preReleaseInfluenceApiUrl = 'https://api-prerelease.influenceth.io'
export const influenceApiUrl = 'https://api.influenceth.io'
