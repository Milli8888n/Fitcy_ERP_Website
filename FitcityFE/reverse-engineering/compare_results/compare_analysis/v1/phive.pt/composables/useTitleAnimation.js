import { onBeforeUnmount, onMounted, inject, nextTick } from '#imports'
import { gsap, SplitText, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText) && gsap.registerPlugin(ScrollTrigger)

import { useScreen } from 'vue-screen'

import { getActiveContext } from '~/components/core/Page/context'
import { useEnterAnimation } from '~/composables/core'

export const useTitleAnimation = (element, fullWidthFont = false, delay = 0, instant = false, onDemand = false) => {
	const tl = gsap.timeline({ paused: true })
	const enterAnimation = useEnterAnimation()
	const screen = useScreen()

	let fontCtx
	let animationCtx
	let splitTitleFirst
	let splitTitleLast

	watch(
		() => screen.width,
		() => calculateFontWdth(),
	)

	onBeforeUnmount(() => kill())

	onMounted(() => {
		const context = getActiveContext()
		context.loader.loaded.then(() => setup())
		context.loader.transitionReady.then(() => init())
	})

	const calculateFontWdth = () => {
		fontCtx?.revert()

		nextTick(() => {
			fontCtx = gsap.context(() => {
				if (element.value === null) return

				const firstTitle = element.value.querySelector('.first')
				const lastTitle = element.value.querySelector('.last')
				const allLetters = element.value.querySelectorAll('.first .char')
				const parentBounding = element.value.closest('[data-component]').getBoundingClientRect()

				let typeWidth = [...allLetters].reduce((sum, letter) => sum + letter.getBoundingClientRect().width, 0)
				let iterations = 0
				let wdthValue = 0 // Starting value for wdth
				const increment = 1 // Increment value for wdth

				// // Iterate to adjust wdth value
				while (typeWidth <= parentBounding.width && iterations < 200) {
					wdthValue += increment
					iterations++
					typeWidth = Math.round([...allLetters].reduce((sum, letter) => sum + letter.getBoundingClientRect().width, 0))

					gsap.set([firstTitle, lastTitle], { fontVariationSettings: `'wdth' ${wdthValue}, 'wght' 460` })
				}
				gsap.set([firstTitle, lastTitle], { marginLeft: '-0.035em', letterSpacing: '-0.035em' })
			})
		})
	}

	const setup = () => {
		if (!element.value) return
		animationCtx?.revert()

		animationCtx = gsap.context(() => {
			const content = element.value.innerHTML
			const titleFirst = document.createElement('span')
			const titleLast = document.createElement('span')

			titleFirst.innerText = content
			titleLast.innerText = content
			titleFirst.classList.add('first')
			titleLast.classList.add('last')

			element.value.innerText = ''
			element.value.appendChild(titleFirst)
			element.value.appendChild(titleLast)

			splitTitleFirst = new SplitText(titleFirst, { type: 'words, chars', wordsClass: 'word', charsClass: 'char', tag: 'div' })
			splitTitleLast = new SplitText(titleLast, { type: 'words, chars', wordsClass: 'word', charsClass: 'char', tag: 'div' })

			nextTick(() => {
				gsap.set(element.value, {
					display: 'grid',
					whiteSpace: 'wrap',
					lineHeight: '1em',
					textAlign: 'center',
					opacity: 0,
				})
				gsap.set([titleFirst, titleLast, element.value.querySelectorAll('.char'), element.value.querySelectorAll('.word')], {
					fontFamily: 'inherit',
					fontSize: 'inherit',
					letterSpacing: 'inherit',
					lineHeight: 'inherit',
					fontVariationSettings: 'inherit',
					gridRow: '1',
					gridColumn: '1',
				})

				gsap.set([titleFirst, titleLast], {
					position: 'relative',
					display: 'inline-block !important',
				})

				tl.set(element.value, { opacity: 1 }, 0)
				tl.set(splitTitleFirst.chars, { opacity: 0 }, 0)
				tl.set(splitTitleLast.chars, { opacity: 0 }, 0)

				tl.fromTo(
					splitTitleFirst.chars,
					{
						scaleY: 0,
						opacity: 1,
						transformOrigin: 'top',
					},
					{
						scaleY: 1,
						stagger: {
							from: 'left',
							each: 0.1,
						},
						ease: 'power2.in',
						duration: 1,
					},
					0,
				)

				tl.fromTo(
					splitTitleFirst.chars,
					{
						scaleY: 1,
						opacity: 1,
						transformOrigin: 'bottom',
					},
					{
						scaleY: 0,
						delay: 1,
						stagger: {
							from: 'left',
							each: 0.1,
						},
						ease: 'power2.out',
						duration: 1,
					},
					0,
				)

				tl.fromTo(
					splitTitleLast.chars,
					{
						scaleY: 0,
						opacity: 1,
						transformOrigin: 'top',
					},
					{
						scaleY: 1,
						delay: 1,
						stagger: {
							from: 'left',
							each: 0.1,
						},
						ease: 'power2.out',
						duration: 1,
					},
					0,
				)

				tl.fromTo(
					splitTitleFirst.chars,
					{
						scaleY: 1,
						opacity: 1,
						transformOrigin: 'bottom',
					},
					{
						scaleY: 0,
						delay: 1,
						stagger: {
							from: 'left',
							each: 0.1,
						},
						ease: 'power2.inOut',
						duration: 1,
					},
					3,
				)

				tl.fromTo(
					splitTitleLast.chars,
					{
						scaleY: 0,
						opacity: 1,
						transformOrigin: 'top',
					},
					{
						scaleY: 1,
						delay: 1,
						stagger: {
							from: 'left',
							each: 0.1,
						},
						ease: 'power2.inOut',
						duration: 1,
					},
					3,
				)
			})
		})
	}

	const init = () => {
		if (onDemand) return

		nextTick(() => {
			fullWidthFont && calculateFontWdth()

			if (!instant) {
				setTimeout(() => {
					enterAnimation.init({
						trigger: element.value,
						timeline: tl,
						start: 'bottom bottom',
					})
				}, delay)
			} else {
				tl.play()
			}
		})
	}
	const kill = () => {}

	return { tl }
}
