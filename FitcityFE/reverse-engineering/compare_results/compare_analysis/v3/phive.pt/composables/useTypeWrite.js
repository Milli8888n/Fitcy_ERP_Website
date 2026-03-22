import { onBeforeUnmount, onMounted, inject, nextTick } from '#imports'
import { gsap, SplitText, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText) && gsap.registerPlugin(ScrollTrigger)

export const useTypeWrite = ({ element, types = 'chars', paused = false, scrub = false, delay = 1 }) => {
	const context = inject('pageContext')
	let animationCtx
	let observer
	let tl = gsap.timeline({ paused: true })

	onBeforeUnmount(() => {
		// animationCtx?.revert()
		observer?.kill()
	})

	onMounted(() => {
		context.$page.loader.loaded.then(() => setup())
		context.$page.loader.ready.then(() => init())
	})

	const setup = () => {
		if (!element.value) return

		animationCtx = gsap.context(() => {
			new SplitText(element.value, {
				type: types === 'chars' ? 'chars, words' : types,
				charsClass: 'split-char',
				wordsClass: 'split-block',
				tag: 'div',
			})

			nextTick(() => {
				gsap.set(element.value.querySelectorAll('.split-block'), {
					position: 'relative',
					display: 'inline-block',
					fontFamily: 'inherit',
					letterSpacing: '-0.03em',
					opacity: types === 'chars' ? 1 : 0,
				})

				gsap.set(element.value.querySelectorAll('.split-char'), {
					position: 'relative',
					display: 'inline-block',
					fontFamily: 'inherit',
					opacity: 0,
				})
			})
		})
	}

	const init = () => {
		if (!paused)
			observer = ScrollTrigger.create({
				trigger: element.value,
				onEnter: () => (types === 'chars' ? animateChars() : animateWords()),
			})
	}

	const animateChars = () => {
		if (!element.value) return

		tl.fromTo(
			[element.value.querySelectorAll('.split-char')],
			{
				opacity: 0,
				scale: 3,
				rotation: () => randomRotation(-10, 10, 2),
			},
			{
				opacity: 1,
				scale: 1,
				y: 0,
				rotation: 0,
				stagger: 0.025,
				duration: 0.5,
				ease: 'expo.out',
				delay: delay,
			}
		)

		if (!scrub) tl.play()
	}

	const animateWords = () => {
		if (!element.value) return

		tl.fromTo(
			element.value.querySelectorAll('.split-block'),
			{
				opacity: 0,
				scale: 2,
				rotation: () => randomRotation(),
			},
			{
				opacity: 1,
				scale: 1,
				rotation: 0,
				stagger: 0.25,
				duration: 0.5,
				ease: 'power4.in',
			}
		)

		if (!scrub) tl.play()
	}

	const seekTl = (progress) => {
		tl.progress(progress)
	}

	const randomRotation = (minR = -45, maxR = 45, stepR = 10) => {
		if (!element.value) return

		const min = minR
		const max = maxR
		const step = stepR

		// Calculate the number of steps
		const numberOfSteps = (max - min) / step + 1

		// Generate a random step index
		const randomIndex = Math.floor(Math.random() * numberOfSteps)

		// Calculate the random number based on the step index
		return min + randomIndex * step
	}

	return {
		animateChars,
		animateWords,
		seekTl,
	}
}
