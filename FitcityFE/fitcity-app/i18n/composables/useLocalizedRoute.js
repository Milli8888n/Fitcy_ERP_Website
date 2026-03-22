import { useRoute } from '#app'
import { getUnlocalizedPath, getLocalizedPath } from '../helpers.js'
import { useLocale } from './useLocale.js'
import { computed } from 'vue'

export function useLocalizedRoute() {
	const route = useRoute()
	const locale = useLocale()
	const path = computed(() => getUnlocalizedPath(route.path))

	function toLocale(_locale) {
		return getLocalizedPath(_locale, path.value)
	}

	return { path, locale, toLocale, route }
}
