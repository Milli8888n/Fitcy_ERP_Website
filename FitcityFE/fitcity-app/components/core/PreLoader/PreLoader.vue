<template>
	<div ref="el" data-component="loading">
		<div class="rotator" ref="rotator"></div>
		<span class="-h1 title" ref="titleEl">{{ title }}</span>
	</div>
</template>

<script setup>
import { getActiveContext } from '~/components/core/Page/context.js'
import { gsap } from 'gsap'

const props = defineProps({
	title: { type: String, default: 'Fitcity' },
	color: { type: String, default: '#ffffff' },
})

const el = ref(null)
const rotator = ref(null)
const titleEl = ref(null)
const scroller = inject('$scroller')
const curtain = inject('$curtain')

onMounted(() => {
	const context = getActiveContext()
	context.loader.loaded.then(() => {
		document.querySelector(':root').style.setProperty('--body-backgroundColor', `#004225`)
		scroller.value?.reset()
		el.value.classList.add('loaded')

		// Animation Sequence
		const tl = gsap.timeline({ delay: 0.1 }) // Slight delay to let browser settle after scroller reset

		// 1. Rotate 90 degrees (Left/Right -> Top/Bottom)
		tl.to(rotator.value, {
			rotation: 90,
			duration: 1.2,
			ease: 'power4.inOut',
			force3D: true // Force GPU acceleration
		})

		// 2. Hand-off (Trigger Curtain sequence)
		tl.to(rotator.value, {
			opacity: 0, 
			duration: 0.1, 
			onComplete: () => {
				// Trigger the Curtain's sequence
				// curtain.enter() resolves after 0.9s (Down + Pause), exactly when Slide-Left starts
				curtain.value.enter().then(() => {
					// 3. Slide Title left with the orange block and Slide 1
					gsap.to(titleEl.value, {
						xPercent: -100,
						opacity: 0,
						duration: 1.2,
						ease: 'power4.inOut',
						force3D: true
					})

					context.loader.dispatch('ready')
					context.loader.dispatch('transition-ready')
					
					// Cleanup Preloader after the 1.2s slide-left animation finishes
					setTimeout(() => {
						if(el.value) el.value.style.display = 'none';
					}, 1200);
				})
			}
		})
	})
})
</script>


<style lang="scss" scoped>
[data-component='loading'] {
	position: fixed;
	top: 0;
	left: 0;
	width: 100svw;
	height: 100svh;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10000;
	pointer-events: none;
	overflow: hidden; 

	.rotator {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 150vmax;
		height: 150vmax;
		transform: translate(-50%, -50%);
		z-index: 0;

		// Optimization: Use gradient instead of multiple divs
		background: linear-gradient(to right, var(--color-yellow) 50%, var(--color-darkBrown) 50%);
		
		// Optimization: Rounding avoids painting edges that are off-screen
		border-radius: 50%; 

		// Performance: Hint to browser for composite layer
		will-change: transform;
		backface-visibility: hidden;
	}

	.title {
		position: relative;
		z-index: 1; 
		color: #ffffff; 

		font-size: rs(120);
		font-weight: 800;
		letter-spacing: -0.05em;
		white-space: nowrap;
		line-height: 1;
		text-transform: uppercase;
	}
}
</style>

