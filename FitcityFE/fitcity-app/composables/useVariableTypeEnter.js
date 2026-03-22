import { onBeforeUnmount, onMounted, inject, nextTick } from '#imports'

import { gsap, SplitText, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText) && gsap.registerPlugin(ScrollTrigger)
import { getActiveContext } from '../components/core/Page/context.js'

export const useVariableTypeEnter = ({ element, from = 'center', scrub = true, initialVariation = '"wdth" 0, "wght" 350', endVariation = '"wdth" 40, "wght" 800' }) => {
	const tl = gsap.timeline({ paused: true })
	let animationCtx
	let observer

	onBeforeUnmount(() => {
		animationCtx?.revert()
		observer?.kill()
	})

	onMounted(() => {
		const context = getActiveContext()

		context.loader.loaded.then(() => setup())
		context.loader.ready.then(() => init())
	})

	const setup = () => {
		if (!element.value) return

		animationCtx = gsap.context(() => {
			new SplitText(element.value, {
				type: 'chars',
				charsClass: 'split-block',
				tag: 'div',
			})

			nextTick(() => {
				gsap.set(element.value.querySelectorAll('.split-block'), {
					position: 'relative',
					display: 'inline-block',
					fontFamily: 'inherit',
					fontSize: 'inherit',
					letterSpacing: 'inherit',
					lineHeight: 'inherit',
					fontVariationSettings: initialVariation,
					opacity: 0,
				})
			})
		})
	}

	const init = () => {
		tl.set(element.value.querySelectorAll('.split-block'), { opacity: 1 })

		tl.fromTo(
			element.value.querySelectorAll('.split-block'),
			{
				fontVariationSettings: initialVariation,
				// opacity: 0,
				scaleY: 0.6,
			},
			{
				duration: 0.75,
				scaleY: 1,
				stagger: {
					each: 0.025,
					from: from,
				},
				opacity: 1,
				ease: 'circ.inOut',
				fontVariationSettings: endVariation,
			},
			0
		)

		observer = ScrollTrigger.create({
			trigger: element.value,
			start: 'bottom bottom',
			end: 'bottom center',
			onUpdate: ({ progress }) => scrub && tl.progress(progress),
			onEnter: () => !scrub && tl.play(),
		})
	}
}
