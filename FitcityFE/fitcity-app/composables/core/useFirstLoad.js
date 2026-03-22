import { ref } from '#imports'

const firstLoad = ref(true)

export const useFirstLoad = () => {
	return {
		firstLoad,
	}
}
