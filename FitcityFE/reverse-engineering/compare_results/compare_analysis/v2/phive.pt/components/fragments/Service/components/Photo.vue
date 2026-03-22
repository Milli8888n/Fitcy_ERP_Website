<template>
	<div ref="el" data-component="photo" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
		<span class="bg" />
		<div class="wrapper">
			<ImageAsset v-if="photo" :asset="photo" class="photo" sizes="xsmall:100px medium:200px xlarge:200px" />
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { ImageAsset } from '~/components/core'

const props = defineProps({
	photo: { type: [Boolean, Object], default: false },
})

const el = ref(null)
const context = inject('pageContext')
let canHover = false

// Handler for mouse move: calculate offset from center and animate the photo accordingly
const handleMouseMove = (e) => {
	if (!canHover) return

	gsap.killTweensOf(el.value.querySelector('.photo'))

	const rect = el.value.getBoundingClientRect()
	// Calculate the distance from the center of the container
	const offsetX = e.clientX - (rect.left + rect.width / 2)
	const offsetY = e.clientY - (rect.top + rect.height / 2)
	// Apply a reduced factor to create a subtle parallax effect
	const factor = 0.1
	gsap.to(el.value.querySelector('.photo'), {
		x: offsetX * factor,
		y: offsetY * factor,
		scale: 1.2,
		duration: 1,
		ease: 'power3.out',
	})
}

// Handler for mouse leave: reset the photo position with a bounce effect
const handleMouseLeave = () => {
	if (!canHover) return

	gsap.killTweensOf(el.value.querySelector('.photo'))

	gsap.to(el.value.querySelector('.photo'), {
		x: 0,
		y: 0,
		scale: 1,
		duration: 0.5,
		// ease: 'bounce.out',
		ease: 'expo.out',
	})
}

const setup = () => {
	gsap.set(el.value.querySelector('.photo'), { scale: 0, rotation: 25 * getRandom(-1, 1), opacity: 1 })
}
const init = () => {
	setTimeout(() => {
		gsap.fromTo(
			el.value.querySelector('.bg'),
			{
				scale: 0,
			},
			{
				scale: 1,
				xPercent: 0,
				ease: 'expo.out',
				duration: 1,
				scrollTrigger: {
					trigger: el.value,
					start: 'bottom bottom',
					onEnter: () => {
						canHover = true
						el.value &&
							gsap.to(el.value.querySelector('.photo'), {
								scale: 1,
								duration: 0.75,
								xPercent: 0,
								rotation: 0,
								delay: 0.25,
								ease: 'expo.out',
							})
					},
				},
			},
		)
	}, 100)
}
const kill = () => {
	gsap.killTweensOf([el.value.querySelector('.bg'), el.value.querySelector('.photo')])
}

onBeforeUnmount(() => kill())
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='photo'] {
	position: relative;

	height: 100%;
	width: 100%;
	border-radius: 100%;

	.bg {
		position: absolute;
		inset: 0;

		display: block;

		background-color: var(--color-black);

		border-radius: 100%;
	}

	.wrapper {
		position: relative;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 100%;
	}

	.photo {
		position: relative;
		opacity: 0;
	}
}
</style>
