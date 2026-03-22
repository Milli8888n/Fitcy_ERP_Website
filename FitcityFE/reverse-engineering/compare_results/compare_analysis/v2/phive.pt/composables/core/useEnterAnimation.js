import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
process.client && gsap.registerPlugin(ScrollTrigger)

export const useEnterAnimation = () => {
	let ctx

	const init = (args = {}) => {
		ctx = gsap.context(() => {
			ScrollTrigger.create({
				markers: args.markers || false,
				trigger: args.trigger || document.querySelector('body'),
				endTrigger: args.endTrigger || false,
				start: args.start || 'top bottom',
				end: args.end || 'bottom top',
				onUpdate: ({ progress }) => {
					args.scrub && args.timeline.progress(progress)
				},
				onEnter: () => !args.scrub && args.timeline.play(),
				onLeave: () => args.repeat && args.timeline.progress(0).pause(),
				onEnterBack: () => args.repeat && args.timeline.play(),
				onLeaveBack: () => args.repeat && args.timeline.progress(0).pause(),
			})
		})
	}

	const kill = () => ctx && ctx.revert()

	onBeforeUnmount(() => kill())

	return { init, kill }
}
