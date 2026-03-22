import { removeLeadingSlash, removeTrailingSlash } from '../utils/routing.js'
import { LOCALES } from './config'

export function isValidLocale(locale) {
	return LOCALES.find((l) => l.locale === locale)
}

export function getPathLocale(path) {
	if (typeof path === 'string') {
		const fragments = path.split('/')
		const localFragment = fragments[0] === '' ? fragments[1] : fragments[0]

		return isValidLocale(localFragment) ? localFragment : LOCALES[0].locale
	} else {
		return LOCALES[0].locale
	}
}

export function getUnlocalizedPath(path) {
	const locale = getPathLocale(path)
	const baseLocale = LOCALES.find((el) => el.default)

	if (!path.includes(locale) || baseLocale.locale === locale) {
		return path
	}

	path = removeLeadingSlash(path).replace(locale, '')

	if (path.charAt(0) !== '/') {
		path = '/' + path
	}

	return path
}

export function getLocalizedPath(locale, path) {
	let unlocalized = getUnlocalizedPath(path)

	unlocalized = removeLeadingSlash(unlocalized)

	if (unlocalized === '/') {
		unlocalized = ''
	}

	return removeTrailingSlash(locale === LOCALES[0].locale ? `/${unlocalized}` : `/${locale}${unlocalized}`)
}
