@ -1,103 +0,0 @@
<template>
	<video
		ref="video"
		:type="asset.mediaType"
		:width="asset.width"
		:height="asset.height"
		:autoplay="autoplay"
		:controls="controls"
		:loop="loop"
		:muted="muted"
		:playsinline="playsinline"
		:preload="preload"
	/>
</template>

<script>
function assetValidator(asset) {
	if (!Object.hasOwn(asset, 'sources') || !Array.isArray(asset.sources)) {
		console.error(`[primitives/VideoAsset] Missing required 'sources' array in 'asset' prop.`)
		return false
	}

	const defaultSourceIndex = asset.source.findIndex(({ breakpoint }) => breakpoint === 'default')
	if (defaultSourceIndex < 0) {
		console.error(`[primitives/VideoAsset] Missing required source item with 'default' breakpoint.`)
		return false
	}

	return true
}

function preloadValidator(preload) {
	return ['auto', 'metadata', 'none'].includes(preload)
}
</script>

<script setup>
import { ref } from 'vue'
import { useClientOnlyComputed } from '~/composables/core'
import { useScreen } from 'vue-screen'

import { useInViewport } from '~/composables/core'

const props = defineProps({
	asset: { type: Object, required: true, validation: assetValidator },
	autoplay: { type: Boolean, default: false },
	controls: { type: Boolean, default: false },
	loop: { type: Boolean, default: true },
	muted: { type: Boolean, default: true },
	playsinline: { type: Boolean, default: true },
	paused: { type: Boolean, default: false },
	preload: { type: String, default: 'metadata', validator: preloadValidator },
	lazy: { type: Boolean, default: false },
})

const screen = useScreen()
const video = ref(null)
const { viewport } = useInViewport(video)

function calculateDifference(videoWidth, screenWidth) {
	let diff = screenWidth - videoWidth

	// multiply difference when video-width is big than screen-width
	// it results in a slight bias toward displaying a smaller video
	if (diff < 0) {
		diff *= 3
	}

	return Math.abs(diff)
}

function computeOptimalSource(sources, viewportWidth) {
	if (sources.length === 1) {
		return sources[0]
	}

	const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1
	const nonRetinaWidth = pixelRatio * viewportWidth

	const source = sources.sort((a, b) => {
		return calculateDifference(a.width, nonRetinaWidth) - calculateDifference(b.width, nonRetinaWidth)
	})[0]

	return source
}

const src = useClientOnlyComputed(
	props.asset.sources[0],
	() => {
		const screenWidth = screen.width
		return computeOptimalSource(props.asset.sources, screenWidth)
	},
	screen
)

const playVideo = () => {
	if (!video.value) return

	video.value.pause()
	video.value.currentTime = 0
	video.value.play()
}

const pauseVideo = () => {
	if (!video.value) return

	video.value.pause()
	video.value.currentTime = 0
}

onMounted(() => {
	if (props.lazy) {
		watch(viewport, (value) => {
			if (value.inViewport) {
				video.value.setAttribute('src', src.value.url)
				video.value.load()
			}
		})
	} else {
		video.value.setAttribute('src', src.value.url)
		video.value.load()
	}
})
defineExpose({ playVideo, pauseVideo })
</script>
