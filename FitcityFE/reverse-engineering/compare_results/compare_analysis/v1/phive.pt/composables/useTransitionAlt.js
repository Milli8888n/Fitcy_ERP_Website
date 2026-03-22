import { gsap } from 'gsap'
import { getContext, getAllContexts } from '~/components/core/Page/context'
import { useEmitter } from '~/composables/core'

export function useTransitionAlt() {
	function onEnter(node, f) {
		const context = getContext(node.dataset.slug)
		const emitter = useEmitter()

		context.loader.dispatch('transition-ready')

		gsap.fromTo(
			node,
			{
				width: '100%',
				height: '100vh',
				overflow: 'hidden',
				scaleY: 2,
				transformOrigin: 'top',
				y: window.innerHeight,
				opacity: 1,
				zIndex: 3,
				willChange: 'transform',
			},
			{
				scaleY: 1,

				opacity: 1,
				y: 0,
				ease: 'expo.inOut',
				duration: 1.25,
				onComplete: () => {
					f && f()
					gsap.set(node, { clearProps: 'all' })
					emitter.emit('scroller-reset')

					setTimeout(() => {
						emitter.emit('scroller-unlock')
						context.loader.dispatch('ready')
					}, 100)
				},
			}
		)
	}

	function onLeave(node, currScroll) {
		gsap.set(node.querySelector('.inner'), {
			position: 'relative',
			top: currScroll * -1,
		})
		gsap.fromTo(
			node,
			{
				scaleY: 1,

				position: 'fixed',
				yPercent: 0,
				width: '100%',
				height: '100vh',
				overflow: 'hidden',
				transformOrigin: 'top',
				zIndex: 2,
				willChange: 'transform',
			},
			{
				yPercent: -100,
				scaleY: 2,
				duration: 0.625,
				ease: 'expo.in',
				onComplete: () => {
					gsap.to(node, {
						scaleY: 0,
						yPercent: 0,
						duration: 0.625,
						ease: 'expo.out',
					})
				},
			}
		)
	}

	return {
		onEnter,
		onLeave,
	}
}
