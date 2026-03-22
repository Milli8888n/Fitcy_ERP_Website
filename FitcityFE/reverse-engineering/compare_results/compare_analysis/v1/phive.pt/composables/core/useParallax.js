import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

export const useParallax = (args) => {
	const element = args.element
	const trigger = args.trigger || element
	const endTrigger = args.endTrigger || trigger
	const friction = args.friction
	const start = args.start
	const end = args.end
	const markers = args.markers || false
	let ctx

	const setup = () => {
		ctx = gsap.context(() => {
			gsap.fromTo(
				element,
				{
					yPercent: 0,
				},
				{
					yPercent: -100 * friction,
					ease: 'none',
					scrollTrigger: {
						trigger: trigger,
						endTrigger: endTrigger,
						markers,
						start,
						end,
						scrub: true,
					},
				}
			)
		})
	}

	const kill = () => {
		ctx.revert()
	}

	return { setup, kill }
}
