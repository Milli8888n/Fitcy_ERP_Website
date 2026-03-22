
import * as sanityRuntime$utnZrKi1Zq6lcjAZdUYJkgv4w3HlgRwMFmgnqUQbzZ0 from '/vercel/path0/phive-website/node_modules/@nuxt/image/dist/runtime/providers/sanity'
import * as ipxRuntime$pf0sT4qQdLfeNCrfR_45DSC51y_IGT_45e5mQn5foRiRf6o from '/vercel/path0/phive-website/node_modules/@nuxt/image/dist/runtime/providers/ipx'

export const imageOptions = {
  "screens": {
    "xs": 320,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "xxl": 1536,
    "2xl": 1536,
    "xsmall": 700,
    "medium": 1100,
    "xlarge": 1699
  },
  "presets": {},
  "provider": "ipx",
  "domains": [
    "phive.pt",
    "cdn.sanity.io"
  ],
  "alias": {},
  "densities": [
    1,
    2
  ],
  "format": [
    "webp"
  ]
}

imageOptions.providers = {
  ['sanity']: { provider: sanityRuntime$utnZrKi1Zq6lcjAZdUYJkgv4w3HlgRwMFmgnqUQbzZ0, defaults: {"projectId":"z6ex5ahr"} },
  ['ipx']: { provider: ipxRuntime$pf0sT4qQdLfeNCrfR_45DSC51y_IGT_45e5mQn5foRiRf6o, defaults: {} }
}
        