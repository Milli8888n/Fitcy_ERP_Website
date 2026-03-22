import { useRuntimeConfig } from '#app'
import { useLocale } from './useLocale.js'

export function useStringTranslation() {
	const runtime = useRuntimeConfig()
	const locale = useLocale()

	const { stringTranslations } = runtime.public

	return function (key, fallback) {
		if (Object.hasOwn(stringTranslations, locale.value) && Object.hasOwn(stringTranslations[locale.value], key)) {
			return stringTranslations[locale.value][key]
		}

		return fallback ?? key
	}
}
