import { gsap } from 'gsap'

// TODO: Ideas for folding animation
// -> https://gsap.com/community/forums/topic/19550-paper-fold-effect-with-gsap/
// -> https://codepen.io/GreenSock/pen/eZprNG
//
export const useMotion = (el, type) => {
	const animation = gsap.timeline({ paused: true })

	const setupAnimation = () => {
		switch (type) {
			case 'rotate':
				rotate()
				break

			default:
				rotate()
				break
		}
	}

	const rotate = () => {
		animation.set(el.value, { opacity: 1 })
		animation.fromTo(
			el.value,
			{
				transformOrigin: 'bottom',
				rotationX: 90,
			},
			{
				y: 0,
				rotationX: 0,
				duration: 1,
				ease: 'expo.out',
			},
			0
		)

		animation.fromTo(
			[el.value.querySelector('.languages-container'), el.value.querySelector('.main-container')],
			{
				y: -200,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 1,
				ease: 'expo.out',
			},
			0
		)
	}
	return { animation, setupAnimation }
}
