import {
  Assets,
  type BuildingType,
  type ProductType,
  type ShipType,
} from '@influenceth/sdk'

const defaultCloudfrontBucket = 'unstoppablegames'
const defaultCloudfrontImageHost = 'd2xo5vocah3zyk.cloudfront.net'
const defaultApiImagesUrl = 'https://images.influenceth.io/v2'

export type ImageSize = {
  w?: number
  h?: number
  f?: 'cover' | 'contain' | 'scale'
}

const getSlug = (assetName: string) => {
  return (assetName || '').replace(/[^a-z]/gi, '')
}

const defaultImageUrlsConfig = {
  cloudfrontImageHost: defaultCloudfrontImageHost,
  cloudfrontBucket: defaultCloudfrontBucket,
  apiImagesUrl: defaultApiImagesUrl,
}

export type ImageUrlsConfig = typeof defaultImageUrlsConfig

export type CrewmateImageOptions = {
  bustOnly?: boolean
  width?: number
  format?: 'png' | 'svg'
}

export type AsteroidImageOptions = {
  width?: number
  format?: 'png' | 'svg'
}

export const makeInfluenceImageUrls = (config = defaultImageUrlsConfig) => {
  const getCloudfrontUrl = (rawSlug: string, { w, h, f }: ImageSize = {}) => {
    const slug =
      w || h
        ? btoa(
            JSON.stringify({
              key: rawSlug,
              bucket: config.cloudfrontBucket,
              edits: {
                resize: {
                  width: w,
                  height: h,
                  fit: f,
                },
              },
            })
          )
        : rawSlug
    return `https://${config.cloudfrontImageHost}/${slug}`
  }
  const getIconUrl = (
    type: string,
    assetName: string,
    iconVersion: number,
    { append, w, h, f }: ImageSize & { append?: string } = {}
  ) =>
    getCloudfrontUrl(
      `influence/production/images/icons/${type}/${getSlug(assetName)}${append || ''}.v${iconVersion || '1'}.png`,
      { w, h, f }
    )

  return {
    product: (product: ProductType, size: ImageSize) =>
      getIconUrl(
        'resources',
        product.name,
        Assets.Product[product.i]?.iconVersion ?? 0,
        size
      ),

    building: (building: BuildingType, size: ImageSize, isHologram = false) =>
      getIconUrl(
        'buildings',
        building.name,
        Assets.Building[building.i]?.iconVersion ?? 0,
        { ...size, append: isHologram ? '_Site' : undefined }
      ),

    ship: (ship: ShipType, size: ImageSize, isHologram = false) =>
      getIconUrl('ships', ship.name, Assets.Ship[ship.i]?.iconVersion ?? 0, {
        ...size,
        append: isHologram ? '_Holo' : undefined,
      }),

    crewmate: (crewmateId: number, options?: CrewmateImageOptions) => {
      const params = new URLSearchParams()
      if (options?.bustOnly) params.append('bustOnly', 'true')
      if (options?.width) params.append('width', options.width.toString())
      const format = options?.format ?? 'png'

      return `${config.apiImagesUrl}/crewmates/${crewmateId}/image.${format}?${params.toString()}`
    },

    asteroid: (asteroidId: number, options?: AsteroidImageOptions) => {
      const params = new URLSearchParams()
      if (options?.width) params.append('width', options.width.toString())

      const format = options?.format ?? 'png'

      return `${config.apiImagesUrl}/asteroids/${asteroidId}/image.${format}?${params.toString()}`
    },
  }
}
