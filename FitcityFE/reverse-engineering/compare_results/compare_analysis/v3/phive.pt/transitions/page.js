import { getContext } from '../components/core/Page/context'
import { useRoute } from '#app'
import { useEmitter } from '~/composables/core'

export const pageTransition = {
	name: 'default',
	mode: 'in-out',
	css: false,
	onLeave: (node, done) => {
		const slug = node.getAttribute('data-slug')
		const emitter = useEmitter()

		if (window) {
			window.prevSlug = slug
			window.done = done
		}

		emitter.emit('scroller-lock')

		console.log(`⚙︎ [${slug}]  leave from dom`)
	},
	onEnter: (nextNode) => {
		const emitter = useEmitter()
		const lastNode = document.querySelector('[data-slug]')
		const slug = nextNode.getAttribute('data-slug')
		const prevContext = getContext(window.prevSlug || 'page')
		const context = getContext(slug)
		const currentScroll = prevContext.scroller.value.getScrollerInstance().value.animatedScroll

		emitter.emit('curtain-transitionIn')

		nextNode.style.cssText = `position:absolute; top: ${prevContext.scroller.value.getScrollerInstance().value.animatedScroll}px; z-index: 0; width: 100%; overflow: hidden; opacity: 0;`

		document.querySelector(':root').style.setProperty('--initial-100vh', `${window.innerHeight}px`)

		const mountedPromise = context.loader.mounted
		const loadedPromise = context.loader.loaded

		Promise.all([mountedPromise, loadedPromise]).then(() => {
			console.log(`⚙︎ [${slug}] all critical assets loaded, animating.`)

			setTimeout(() => {
				prevContext.methods.transitionLeave(lastNode, currentScroll)
				context.methods.transitionEnter(nextNode, window?.done)
			}, 100)
		})
	},
}

export default pageTransition
