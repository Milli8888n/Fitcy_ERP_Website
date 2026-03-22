import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'

import { useScreen } from 'vue-screen'

import.meta.client && gsap.registerPlugin(ScrollTrigger)

export const useMotion = (el, photosSlideshowRef) => {
	const context = inject('pageContext')
	const screen = useScreen()
	let animationCtx
	let observer

	const init = () => {
		animationCtx = gsap.context(() => {
			if (!el.value.classList.contains('last-card')) {
				gsap.to(el.value, {
					yPercent: -40,
					rotationX: 25,
					z: -200,
					opacity: 0,
					scrollTrigger: {
						trigger: el.value,
						start: 'top top',
						end: `bottom+=${screen.height / 4}px top`,
						scrub: true,
					},
				})

				// gsap.from(el.value.querySelector('.photos-container .inner-photos'), {
				// 	scale: 1.4,
				// 	scrollTrigger: {
				// 		trigger: el.value,
				// 		start: 'top bottom',
				// 		end: 'bottom top',
				// 		scrub: true,
				// 	},
				// })
			}

			observer = ScrollTrigger.create({
				trigger: el.value,
				onUpdate: ({ progress }) => {
					progress > 0.45 && progress < 0.55 ? photosSlideshowRef.value.resumeSlider() : photosSlideshowRef.value.pauseSlider()
				},
			})
		})
	}
	const kill = () => {
		// animationCtx?.revert()
		observer?.kill()
	}

	onBeforeUnmount(() => kill())
	onMounted(() => context.$page.loader.ready.then(() => init()))
}
