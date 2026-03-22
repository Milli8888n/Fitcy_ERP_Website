<template>
	<div ref="el" data-component="photos-slideshow" :class="enterAnimation ? 'with-animation' : ''" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
		<div class="photos-container">
			<div class="inner-photos">
				<div v-for="(item, i) in photos" :key="i" :class="`photo-wrapper ${i === 0 ? 'active' : ''}`">
					<ImageAsset :asset="item.photo" class="photo" sizes="xsmall:800px medium:1200px xlarge:1700px" />

					<div v-if="item.title || item.description" class="content-container">
						<h2 v-if="item.title" class="-title-6 -uppercase title">{{ item.title }}</h2>
						<p v-if="item.description" class="-body-1 description">{{ item.description }}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="photos-bullets-container">
			<ul class="bullets">
				<li v-for="(, i) in photos" :key="i" :class="`bullet ${i === 0 ? 'active' : ''}`" :data-index="i" @click="jumpToSlide(i)">
					<div class="wrapper">
						<span class="bg" />
						<span class="progress" />
					</div>
				</li>
			</ul>
		</div>

		<div v-if="hasArrows" class="arrows-container">
			<CircleBtn ref="leftBtn" class="left-btn" slug="arrow-left" size="medium" @click="jumpToSlide(computeIndex(-1), -1)" />
			<CircleBtn ref="rightBtn" class="right-btn" slug="arrow-right" size="medium" @click="jumpToSlide(computeIndex(1), 1)" />
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { ImageAsset } from '~/components/core'
import { CircleBtn } from '~/components/primitives'

import { useSwipeDetection } from '~/composables/core'
import { breakpoints } from '~/config'

const props = defineProps({
	photos: { type: Array, default: () => [] },
	hasArrows: { type: Boolean, default: false },
	enterAnimation: { type: Boolean, default: false },
	duration: { type: Number, default: 5 },
	loadedCallback: { type: Function, default: () => {} },
})

const context = inject('pageContext')

const el = ref(null)
const leftBtn = ref(null)
const rightBtn = ref(null)
const activeSlide = ref(-1)

let canChange = true
const timeline = gsap.timeline({ repeat: -1, paused: true })
let observer
let direction = 1
let isFirst = true

const onSwipe = (direction) => {
	direction === 'left' ? jumpToSlide(computeIndex(1), 1) : jumpToSlide(computeIndex(-1), -1)
}
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeDetection(onSwipe)

const setup = () => setupTimeline()
const init = () => {
	window.addEventListener('keydown', handleKey)
	window.addEventListener('blur', pauseSlider)
	window.addEventListener('focus', resumeSlider)

	props.enterAnimation && enterAnimationFn()
}

const kill = () => {
	observer?.kill()
	timeline?.kill()
	window.removeEventListener('keydown', handleKey)
	window.removeEventListener('blur', pauseSlider)
	window.removeEventListener('focus', resumeSlider)
}

function handleKey(e) {
	if (e.key === 'ArrowRight') jumpToSlide(computeIndex(1), 1)
	if (e.key === 'ArrowLeft') jumpToSlide(computeIndex(-1), -1)
}

const enterAnimationFn = () => {
	const imgLoad = imgLoaded(el.value.querySelector('img'))
	const firstPhoto = el.value.querySelector('.photo-wrapper')
	const bullets = el.value.querySelector('.bullets')
	const arrows = el.value.querySelector('.arrows-container')

	leftBtn.value.animateIn()
	rightBtn.value.animateIn()

	gsap.set(firstPhoto, {
		yPercent: 4,
		autoAlpha: 0,
		scale: 0.96,
		zIndex: 1,
	})

	gsap.set([bullets, arrows], {
		y: 10,
		autoAlpha: 0,
		scale: 1.2,
	})

	imgLoad.then(() => {
		props.loadedCallback()

		gsap.set(el.value, { opacity: 1, ease: 'power4.out', duration: 1 })

		gsap.to([bullets, arrows], {
			y: 10,
			autoAlpha: 1,
			scale: 1,
			stagger: 0.05,
			duration: 1,
			ease: 'expo.out',
		})

		gsap.to(firstPhoto, {
			yPercent: 0,
			autoAlpha: 1,
			scale: 1,
			zIndex: 1,
			ease: 'power4.out',
			duration: 1,
			onComplete: () => resumeSlider(),
		})
	})
}

const computeIndex = (value) => (activeSlide.value + value + props.photos.length) % props.photos.length

const changeSlide = (prev, next) => {
	canChange = false
	const currentPhoto = prev === -1 ? false : el.value.querySelectorAll('.photo-wrapper')[prev]
	const nextPhoto = el.value.querySelectorAll('.photo-wrapper')[next]
	const slideDistance = currentPhoto.getBoundingClientRect().width

	currentPhoto &&
		gsap.fromTo(
			currentPhoto,
			{
				z: 0,
				rotationY: 0,
				x: 0,
				scaleX: 1,
				autoAlpha: 1,
				zIndex: 1,
				transformOrigin: direction === -1 ? '0' : '100%',
			},
			{
				z: -20,
				x: slideDistance * direction * -1,
				scaleX: 0,
				rotationY: 20 * direction,
				autoAlpha: 0.8,
				ease: 'power4.inOut',
				duration: 1.5,
			},
		)

	gsap.fromTo(
		nextPhoto,
		{
			opacity: 1,
			rotationY: 20 * direction,
			autoAlpha: 0.8,
			x: slideDistance * direction * 1.1,
			scaleX: 3,
			zIndex: 2,
			transformOrigin: direction === -1 ? '100%' : '0',
		},
		{
			z: 0,
			autoAlpha: 1,
			rotationY: 0,
			x: 0,
			scaleX: 1,
			ease: 'power4.inOut',
			duration: 1.5,
			onComplete: () => {
				gsap.set(nextPhoto, { clearProps: 'zIndex' })
				canChange = true
			},
		},
	)
}

const setupTimeline = () => {
	const bullets = el.value.querySelectorAll('.photos-bullets-container .bullet')

	bullets.forEach((bullet, i) => {
		// Add a label for each slide
		timeline.addLabel(`slide-${i}`, i * props.duration)

		// Animate the progress bar of each bullet
		timeline
			.to(
				bullet.querySelector('.progress'),
				{
					scaleX: 1, // full progress
					duration: props.duration,
					ease: 'linear',
					transformOrigin: 'left',
					onStart: () => {
						// Mark the bullet as active
						!isFirst && changeSlide(activeSlide.value, i)
						isFirst = false

						direction = 1
						bullets.forEach((b) => b.classList.remove('active'))
						bullet.classList.add('active')
						activeSlide.value = i
					},
				},
				`slide-${i}`,
			)
			.to(bullet.querySelector('.progress'), {
				scaleX: 0,
				transformOrigin: 'right',
			})
	})
}

// Allow clicking on a bullet to jump to the corresponding slide label.
const jumpToSlide = (index, dir) => {
	if (timeline && canChange) {
		canChange = false
		setTimeout(() => (canChange = true), 1500)
		direction = dir ? dir : 1
		timeline.pause()
		timeline.play(`slide-${index}`)
	}
}

const pauseSlider = () => timeline.pause()
const resumeSlider = () => timeline.play()

onBeforeUnmount(() => kill())
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})

defineExpose({ pauseSlider, resumeSlider })
</script>

<style lang="scss" scoped>
[data-component='photos-slideshow'] {
	position: relative;

	display: grid;
	width: 100%;
	height: 100%;

	color: var(--color-white);

	&.with-animation {
		opacity: 0;

		.arrows-container {
			opacity: 0;
		}
	}

	.photos-container {
		position: relative;

		grid-row: 1;
		grid-column: 1;
		display: inline-grid;
		width: 100%;
		height: 100%;

		overflow: hidden;

		pointer-events: none;

		.inner-photos {
			display: grid;
			width: 100%;
			height: 100%;
			min-height: 0;

			perspective: 1000px;
		}

		.photo-wrapper {
			grid-row: 1;
			grid-column: 1;

			width: 100%;
			height: 100%;

			opacity: 0;
			visibility: hidden;

			background-color: var(--color-darkBrown);

			// border-radius: rs(12);
			overflow: hidden;

			backface-visibility: hidden;

			&:after {
				content: '';
				position: absolute;
				inset: 0;

				display: block;
				background-color: rgba(0, 0, 0, 0.4);
				z-index: 2;
			}

			&:first-of-type {
				opacity: 1;
				visibility: visible;
			}

			@include max-screen($xsmall) {
				border-radius: 0;
			}

			.photo {
				position: relative;
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: rs(12);
			}
		}

		.content-container {
			position: absolute;
			bottom: calc(var(--grid-padding) + #{rs(54)});
			left: calc(var(--grid-padding) + #{rs(54)});

			display: flex;
			flex-direction: column;
			gap: rs(12);
			width: n_grid_columns(6);

			z-index: 10;
		}
	}

	.arrows-container {
		--circleBtn-backgroundColor: var(--color-white);

		position: absolute;
		bottom: rs(56);
		right: rs(40);

		display: flex;
		gap: rs(12);

		z-index: 2;

		@include max-screen($small) {
			display: none;
		}
	}

	.photos-bullets-container {
		grid-row: 1;
		grid-column: 1;

		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding-bottom: rs(24);

		z-index: 4;

		pointer-events: none;

		.bullets {
			position: relative;

			display: flex;
			gap: rs(8);

			pointer-events: visible;
		}

		.bullet {
			position: relative;

			display: block;
			width: rs(10);
			height: rs(4);

			@include extend_hitbox(10);

			cursor: pointer;

			transition: width 0.5s ease(out-expo);

			&.active {
				width: rs(34);
			}

			@media (hover: hover) {
				&:hover {
					width: rs(34);
				}
			}

			.wrapper {
				position: relative;

				display: block;
				width: 100%;
				height: rs(4);
				overflow: hidden;
				border-radius: rs(12);
			}

			.bg {
				position: absolute;
				top: 0;
				left: 0;

				display: block;
				width: 100%;
				height: 100%;

				background-color: var(--color-white);
				opacity: 0.5;
			}

			.progress {
				position: absolute;
				top: 0;
				left: 0;

				display: block;
				width: 100%;
				height: 100%;
				background-color: var(--color-white);

				transform: scaleX(0);
				transform-origin: left;
				border-radius: rs(12);
			}
		}
	}
}
</style>
