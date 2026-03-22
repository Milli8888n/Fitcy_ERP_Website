<template>
	<div ref="el" data-component="bold-desktop">
		<div class="words-container">
			<div class="first-word-container">
				<span class="word -uppercase">{{ firstWord }}</span>
				<span class="subtitle-container">
					<p ref="subtitleFirstWordEl" class="-manuscript-2 -uppercase subtitle">Go</p>
				</span>
			</div>

			<div class="second-word-container">
				<div class="mask-container">
					<svg viewBox="0 0 1569 417" preserveAspectRatio="xMidYMid slice" class="svg-mask word">
						<defs>
							<mask id="mask" x="0" y="0" width="100%" height="100%">
								<rect x="0" y="0" width="100%" height="100%" />
								<text class="-uppercase word-svg" x="4" y="395">{{ secondWord }}</text>
							</mask>
						</defs>
						<rect x="0" y="0" width="100%" height="100%" />
					</svg>

					<span class="subtitle-container">
						<p ref="subtitleSecondWordEl" class="-manuscript-2 -uppercase subtitle second">Get</p>
					</span>
				</div>

				<div class="media-container">
					<MediaAsset :media="background" class="media" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { useScreen } from 'vue-screen'

import { MediaAsset } from '~/components/core'

const props = defineProps({
	firstWord: { type: String, default: '' },
	secondWord: { type: String, default: '' },
	background: { type: [Boolean, Array], default: false },
	parallaxElements: { type: [Boolean, Array], default: false },
})

const screen = useScreen()
const el = ref(null)
const subtitleFirstWordEl = ref(null)
const subtitleSecondWordEl = ref(null)
const context = inject('pageContext')

const scaleValues = {}

const subtitleFirstWordElTl = gsap.timeline({ paused: true })
const subtitleSecondWordElTl = gsap.timeline({ paused: true })
let subtitleFirstSt
let subtitleSecondSt

watch(screen, () => {
	resize()
	setup()
	nextTick(() => init())
})

const setup = () => {
	if (!el.value.querySelector('.words-container')) return

	const firstWord = el.value.querySelector('.first-word-container .word')
	const secondWord = el.value.querySelector('.second-word-container .word')

	scaleValues.first = (window.innerHeight - 60) / firstWord.getBoundingClientRect().height
	scaleValues.second = (window.innerHeight - 0) / secondWord.getBoundingClientRect().height
}
const init = () => {
	if (!el.value.querySelector('.words-container')) return

	const wordsContainer = el.value.querySelector('.words-container')
	const firstWord = el.value.querySelector('.first-word-container .word')
	const secondWord = el.value.querySelector('.second-word-container .word')
	const maskContainer = el.value.querySelector('.second-word-container .mask-container')
	const svgMask = el.value.querySelector('.second-word-container .mask-container svg')
	const mediaContainer = el.value.querySelector('.media-container')

	subtitleFirstWordElTl.fromTo(
		subtitleFirstWordEl.value,
		{
			y: screen.height / 2,
		},
		{
			y: -screen.height / 2,
			ease: 'none',
		},
	)

	subtitleFirstSt = ScrollTrigger.create({
		trigger: wordsContainer,
		start: () => `top+=${screen.height / 2}px bottom`,
		end: () => `top+=${screen.height * 1.5}px bottom`,
		onUpdate: ({ progress }) => {
			subtitleFirstWordElTl.progress(progress)
		},
	})

	subtitleSecondWordElTl.fromTo(
		subtitleSecondWordEl.value,
		{
			y: screen.height,
		},
		{
			y: -screen.height / 2,
			ease: 'none',
		},
	)

	subtitleSecondSt = ScrollTrigger.create({
		trigger: wordsContainer,
		start: () => `top+=${screen.height * 1}px bottom`,
		end: () => `top+=${screen.height * 2}px bottom`,
		onUpdate: ({ progress }) => {
			subtitleSecondWordElTl.progress(progress)
		},
	})

	gsap.fromTo(
		firstWord,
		{
			scaleY: 0,
			transformOrigin: 'top',
		},
		{
			scaleY: scaleValues.first,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top bottom',
				end: 'top top',
				scrub: true,
			},
		},
	)
	gsap.fromTo(
		firstWord,
		{
			scaleY: scaleValues.first,
			transformOrigin: 'top',
		},
		{
			scaleY: 0,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top top',
				end: 'bottom bottom',
				scrub: true,
			},
		},
	)

	gsap.fromTo(
		secondWord,
		{
			y: '50vh',
			scaleY: 1,
			transformOrigin: 'top',
		},
		{
			y: '-50vh',
			scaleY: scaleValues.second,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top top',
				end: 'bottom bottom',
				scrub: true,
				onUpdate: ({ progress }) => {
					subtitleSecondWordElTl.progress(progress)
				},
			},
		},
	)

	gsap.fromTo(
		maskContainer,
		{
			scale: 1,
		},
		{
			scale: 70,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: () => `bottom bottom`,
				end: () => `bottom+=${window.innerHeight * 6}px bottom`,
				scrub: true,
			},
		},
	)

	gsap.fromTo(
		svgMask,
		{
			opacity: 1,
		},
		{
			opacity: 0,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: () => `bottom+=${window.innerHeight}px bottom`,
				end: () => `bottom+=${window.innerHeight * 2}px bottom`,
				scrub: true,
			},
		},
	)

	gsap.to(secondWord, {
		backgroundColor: 'transparent',
		ease: 'none',
		scrollTrigger: {
			trigger: wordsContainer,
			start: 'bottom bottom',
			end: () => `bottom+=${window.innerHeight / 2}px bottom`,
			scrub: true,
		},
	})

	gsap.fromTo(
		mediaContainer,
		{
			opacity: 0,
		},
		{
			opacity: 1,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: () => `bottom bottom`,
				end: () => `bottom+=${window.innerHeight / 2}px bottom`,
				scrub: true,
			},
		},
	)
}
const resize = () => {
	const wordsContainer = el.value.querySelector('.words-container')
	const firstWord = el.value.querySelector('.first-word-container .word')
	const secondWord = el.value.querySelector('.second-word-container .word')
	const maskContainer = el.value.querySelector('.second-word-container .mask-container')
	const mediaContainer = el.value.querySelector('.media-container')

	gsap.killTweensOf([wordsContainer, firstWord, maskContainer, secondWord, mediaContainer])

	gsap.set([wordsContainer, firstWord, maskContainer, secondWord, mediaContainer], { clearProps: 'all' })

	subtitleSecondSt.kill()
	subtitleFirstSt.kill()
}

const kill = () => {
	subtitleSecondSt.kill()
	subtitleFirstSt.kill()
}

onBeforeUnmount(() => kill())
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='bold-desktop'] {
	position: relative;

	display: block;
	height: 600vh;
	width: 100%;

	background-color: var(--color-yellow);

	.word {
		font-family: 'PPFormula';
		font-size: rs(470, 110);
		letter-spacing: -0.02em;
		line-height: 0.81em;

		@include split_text_inherit();
		font-variation-settings:
			'wdth' 30,
			'wght' 600;

		user-select: none;
	}

	.words-container {
		position: sticky;
		top: 0;

		display: block;
		height: 200vh;
		width: 100%;

		overflow: hidden;

		.subtitle-container {
			position: absolute;
			inset: 0;

			display: flex;
			align-items: center;
			justify-content: center;

			z-index: 1;

			.subtitle {
				position: relative;

				color: var(--color-white);
				opacity: 0.9;

				z-index: 10;

				font-size: rs(240);
			}
		}

		.first-word-container {
			position: relative;
			padding: 30px 0;

			height: 50vh;

			display: flex;
			align-items: flex-start;
			justify-content: center;

			z-index: 3;

			.word {
				position: relative;

				display: inline-flex;
				align-items: center;
				justify-content: center;

				transform-origin: top;
				text-align: center;

				font-variation-settings:
					'wdth' 34,
					'wght' 100;
			}
		}

		.second-word-container {
			position: relative;

			display: flex;
			justify-content: center;
			align-items: flex-end;
			height: 50vh;

			z-index: 2;

			background-color: var(--color-yellow);

			.mask-container {
				position: absolute;
				inset: 0;
				z-index: 2;
				transform-origin: 50% 0%;
			}

			.word {
				position: relative;

				display: inline-flex;
				align-items: center;
				justify-content: center;

				font-variation-settings:
					'wdth' 30,
					'wght' 600;
				background-color: var(--color-yellow);
			}

			.svg-mask {
				position: absolute;
				top: rs(-40);
				left: 0;
				right: 0;
				margin: 0 auto;

				background-color: var(--color-darkBrown);

				z-index: 1;

				max-height: rs(417);

				aspect-ratio: 1669 / 417;

				> rect {
					-webkit-mask: url(#mask);
					mask: url(#mask);
					fill: var(--color-yellow);
				}

				mask {
					rect {
						fill: white;
					}
				}

				.word-svg {
					font-family: 'PPFormula';
					font-size: 420px;
					letter-spacing: -0.02em;
					line-height: 0.81em;

					@include split_text_inherit();
					font-variation-settings:
						'wdth' 42,
						'wght' 600;
				}
			}
		}
	}

	.media-container {
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;

		opacity: 0;

		.media {
			position: relative;
			top: 0;

			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>
