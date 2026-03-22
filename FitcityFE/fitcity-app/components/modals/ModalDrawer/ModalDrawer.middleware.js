import { defineNuxtRouteMiddleware, abortNavigation } from '#imports'
import { useModal } from '~/composables/core/useModal'
import { testModalUrl } from './ModalDrawer.data'

export const modalDrawerMiddleware = defineNuxtRouteMiddleware((to, from) => {
	if (to.href === from.href) return
	const { openModal, closeModal } = useModal()
	if (testModalUrl(to.fullPath)) {
		openModal(to, from)
		return abortNavigation()
	} else {
		setTimeout(() => {
			closeModal('routeChange')
		}, 500)
	}
})
