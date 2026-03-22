<template>
	<div ref="el" data-component="background">
		<MediaAsset v-if="media" :media="media" class="media" :autoplay="false" fetchpriority="low" :lazy="true" />
		<div class="content-media-wrapper">
			<MediaAsset v-if="contentMedia || media" :media="contentMedia || media" class="content-media" />
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'
import { ImageAsset, MediaAsset, VideoAsset } from '~/components/core'

const props = defineProps({
	media: { type: [Boolean, Array], default: false },
	contentMedia: { type: [Boolean, Array], default: false },
	priority: { type: [Boolean], default: false },
})

const el = ref(null)
const context = inject('pageContext')
const openCloseTl = gsap.timeline({ paused: true })
const openCloseMediaTl = gsap.timeline({ paused: true })

const setup = () => {}
const init = () => {
	openCloseAnimation()
}
const kill = () => {}

const play = () => {
	const video = el.value.querySelector('video')
	video && video.play()
}

const pause = () => {
	const video = el.value.querySelector('video')
	video && video.pause()
}

const open = () => {
	return openCloseTl.play()
}

const close = () => {
	openCloseMediaTl.seek(0).play()
	return openCloseTl.reverse()
}

const start = () => {
	el.value.classList.add('active')
}

const enter = () => enterAnimation()

const cleanup = () => {
	const background = el.value.querySelector('.media')
	const contentBackground = el.value.querySelector('.content-media-wrapper')

	el.value.classList.remove('active')

	gsap.set([background, contentBackground], {
		clearProps: 'all',
	})
}

const enterNext = (progress) => {
	openCloseTl.seek(0).pause()
}

const openCloseAnimation = () => {
	const contentBackground = el.value.querySelector('.content-media-wrapper')
	const background = el.value.querySelector('.media')

	openCloseMediaTl.fromTo(
		background,
		{
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
		},
		{
			clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
			ease: 'expo.inOut',
			duration: 1,
			immediateRender: false,
		}
	)

	if (contentBackground)
		openCloseTl.fromTo(
			contentBackground,
			{
				clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
			},
			{
				clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
				ease: 'expo.inOut',
				duration: 1,
				immediateRender: false,
			}
		)
}

const enterAnimation = () => {
	return new Promise((resolve) => {
		gsap.fromTo(
			el.value,
			{
				autoAlpha: 0,
				scale: 1.2,
			},
			{
				scale: 1,
				autoAlpha: 1,
				ease: 'power4.inOut',
				duration: 1,
			}
		)
	})
}

onBeforeUnmount(() => {
	openCloseMediaTl.kill()
	openCloseTl.kill()
})
onMounted(() => {
	context.$page.loader.ready.then(() => init())
})

defineExpose({ play, pause, enter, open, close, start, enterNext, cleanup })
</script>

<style lang="scss" scoped>
[data-component='background'] {
	position: relative;

	display: grid;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	opacity: 0;
	visibility: hidden;

	overflow: hidden;

	&.active {
		opacity: 1;
		visibility: visible;
	}

	.media,
	.content-media-wrapper,
	.content-media {
		position: relative;
		grid-row: 1;
		grid-column: 1;

		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.content-media-wrapper {
		position: relative;
		clip-path: polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%);

		&:after {
			content: '';
			position: absolute;
			inset: 0;

			display: block;
			background-color: rgb(from var(--ribbon-backgroundColor, black) r g b / 0.3);
			z-index: 1;
			mix-blend-mode: multiply;
		}
	}
}
</style>
