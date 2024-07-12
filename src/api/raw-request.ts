import { type ZodTypeAny, z } from 'zod'

export type ApiConfig = {
  accessToken: string
  baseUrl: string
}

export type BaseRequestOptions = {
  logRequest?: boolean
  requestInit?: RequestInit
}

export type RequestOptions<Schema extends ZodTypeAny> = {
  responseSchema: Schema
} & BaseRequestOptions

export const makeRawRequest =
  ({ accessToken, baseUrl }: ApiConfig) =>
  async <Schema extends ZodTypeAny>(
    path: string,
    options: RequestOptions<Schema>
  ) => {
    const init = {
      cache: 'no-cache',
      ...options.requestInit,
      headers: {
        ...(options.requestInit?.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
      },
    } as RequestInit
    const url = `${baseUrl}/${path}`

    if (options?.logRequest) {
      console.log(options.requestInit?.method ?? 'GET', url, init.body ?? '')
    }
    const response = await fetch(url, init)
    if (!response.ok) {
      return Promise.reject({
        code: response.status,
        message: response.statusText,
      })
    }
    const data = await response.json()
    if (options?.logRequest) {
      console.log(JSON.stringify(data, null, 2))
    }
    const result = options.responseSchema.safeParse(data)
    if (!result.success) {
      return Promise.reject(result.error)
    }
    return result.data as z.infer<Schema>
  }

export type RawRequest = ReturnType<typeof makeRawRequest>
