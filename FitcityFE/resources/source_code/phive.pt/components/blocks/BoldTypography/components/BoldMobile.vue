<template>
	<div ref="el" data-component="bold-mobile">
		<div class="words-container">
			<div class="first-word-container">
				<span class="word -uppercase">{{ firstWord }}</span>
			</div>

			<div class="second-word-container">
				<span class="word second-word -uppercase">{{ secondWord }}</span>
			</div>
		</div>
		<div class="media-container">
			<MediaAsset :media="background" class="media" />
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

import { MediaAsset } from '~/components/core'

const props = defineProps({
	firstWord: { type: String, default: '' },
	secondWord: { type: String, default: '' },
	background: { type: [Boolean, Array], default: false },
	parallaxElements: { type: [Boolean, Array], default: false },
})

const el = ref(null)
const scaleValues = {}

const context = inject('pageContext')

const setup = () => {
	if (!el.value?.querySelector('.words-container')) return

	const wordsContainer = el.value.querySelector('.words-container')
	const firstWord = el.value.querySelector('.first-word-container .word')
	const secondWord = el.value.querySelector('.second-word-container .word')

	scaleValues.first = (1 * (wordsContainer.getBoundingClientRect().height - secondWord.getBoundingClientRect().height - 80)) / firstWord.getBoundingClientRect().height
	scaleValues.second = (1 * (wordsContainer.getBoundingClientRect().height - firstWord.getBoundingClientRect().height - 80)) / secondWord.getBoundingClientRect().height
}

const init = () => {
	if (!el.value?.querySelector('.words-container')) return

	const wordsContainer = el.value.querySelector('.words-container')
	const firstWord = el.value.querySelector('.first-word-container .word')
	const secondWord = el.value.querySelector('.second-word-container .word')

	gsap.fromTo(
		firstWord,
		{
			scaleY: scaleValues.first,
			transformOrigin: 'top',
		},
		{
			scaleY: 1,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
			},
		}
	)
	gsap.fromTo(
		secondWord,
		{
			scaleY: 1,
			transformOrigin: 'bottom',
		},
		{
			scaleY: scaleValues.second,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top bottom',
				end: 'bottom top',
				scrub: true,
			},
		}
	)
}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='bold-mobile'] {
	position: relative;

	.words-container {
		.word {
			font-family: 'PPFormula';
			font-size: rs(500, 110);
			letter-spacing: -0.02em;
			line-height: 0.81em;

			@include split_text_inherit();
			font-variation-settings: 'wdth' 30, 'wght' 600;

			user-select: none;
			text-align: center;
		}

		.first-word-container {
			position: relative;
			padding: 30px 0;

			height: 35vh;

			z-index: 1;

			display: flex;
			align-items: flex-start;
			justify-content: center;

			.word {
				position: relative;

				transform-origin: top;

				font-variation-settings: 'wdth' 30, 'wght' 100;
			}
		}

		.second-word-container {
			position: relative;
			padding: 30px 0;

			display: flex;
			justify-content: center;
			align-items: flex-end;
			height: 35vh;

			z-index: 1;

			.word {
				position: relative;

				font-variation-settings: 'wdth' 30, 'wght' 600;
			}
		}
	}

	.media-container {
		position: relative;

		height: 50vh;

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
