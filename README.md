# influence-typed-sdk

A typesafe wrapper around the official Influence API.
I reverse engineered the API so you don't have to!
Also ships with typescript definitions for the official sdk

## Gettting started

Make sure to have the following peer dependencies installed:
* @influenceth/sdk
* zod
* typescript

Then install the package using your package manager of choice.
```bash
npm i -S influence-typed-sdk
bun i influence-typed-sdk
yarn add influence-typed-sdk
```

Then you are ready to go:
```typescript
import {
  makeInfluenceApi,
  preReleaseInfluenceApiUrl,
} from 'influence-typed-sdk'

const api = makeInfluenceApi({
  baseUrl: preReleaseInfluenceApiUrl,
  accessToken: 'your access token',
})

api.utils.warehouses('0x1234...')
```

## Warning

This package is still in development.
There might be breaking changes intentionally or unintentionally.
Use at your own risk.
I recommend pinning the version in your package.json and upgrade manually.
