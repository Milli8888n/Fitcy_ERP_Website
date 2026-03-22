export const IS_DEV = process.env.NODE_ENV !== 'production'
export const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:3000'
export const SERVER = IS_DEV ? 'http://localhost:3000' : BASE_URL
export const SITE_NAME = 'Phive'
export const SITE_DESCRIPTION = 'Não é só fitness. É viver plenamente'
export const SITE_SOCIAL_IMAGE = '/social-preview.jpg'
export const SITE_THEME_COLOR = '#ffe000'
export const ALLOW_ROBOTS = process.env.ALLOW_ROBOTS === 'true' ?? true
export const PASSWORD_PROTECT = process.env.PASSWORD_PROTECT === 'true'
export const SSR_BUILD = process.env.SSR_BUILD || true
export const STORYBOOK = process.env.STORYBOOK === 'true'
export const PURGE_CSS = process.env.PURGE_CSS === 'true' && !DEVELOPMENT && !STORYBOOK
