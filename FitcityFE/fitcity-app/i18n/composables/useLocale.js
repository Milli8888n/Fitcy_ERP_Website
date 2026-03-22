import { useRoute } from '#app'
import { getPathLocale } from '../helpers.js'
import { computed } from 'vue'

export function useLocale() {
	const route = useRoute()
	const locale = computed(() => getPathLocale(route.path))

	return locale
}
