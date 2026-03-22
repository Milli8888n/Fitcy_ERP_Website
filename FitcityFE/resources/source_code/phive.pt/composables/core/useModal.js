import { ref } from 'vue'

const open = ref(false)
const close = ref(false)

export function useModal(el) {
	const registerActions = (openFn, closeFn) => {
		open.value = openFn
		close.value = closeFn
	}

	const openModal = (to, from) => {
		open.value && open.value(to, from)
	}
	const closeModal = (type) => close.value && close.value(type)

	return {
		registerActions,
		openModal,
		closeModal,
	}
}
