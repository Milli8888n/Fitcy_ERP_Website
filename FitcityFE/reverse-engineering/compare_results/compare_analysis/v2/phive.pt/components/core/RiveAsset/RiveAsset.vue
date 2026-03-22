<template>
	<div ref="el" data-component="rive-asset" :class="`${riveUrl ? 'canvas' : 'image'}`">
		<canvas v-if="riveUrl" :data-file="riveUrl" :width="`${width ? width : ''}`" :height="`${height ? height : ''}`" />
		<ImageAsset v-else-if="asset.fallbackImage" :asset="asset.fallbackImage" />
	</div>
</template>

<script setup>
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas'

import { ImageAsset } from '~/components/core'

import { getActiveContext } from '~/components/core/Page/context'

const props = defineProps({
	asset: { type: [Boolean, Object], default: false },
	autoplay: { type: Boolean, default: false },
	layout: { type: String, default: 'contain' },
	stateMachine: { type: [Boolean, String], default: false },
	artboard: { type: [Boolean, String], default: false },
	width: { type: [Boolean, Number], default: false },
	height: { type: [Boolean, Number], default: false },
})

const el = ref(null)
let animation
let animationName = ''
let inputs
let loadPromise
let resolveLoad

// Utility function to check if a file exists using a HEAD request
const fileExists = async (url) => {
	try {
		const response = await fetch(url, { method: 'HEAD' })

		if (response.ok) {
			// Check for a fallback content-type or content-length if applicable
			const contentType = response.headers.get('content-type')
			if (contentType && contentType.includes('text/html')) {
				// This might indicate that a fallback HTML is being served
				return false
			}
			return true
		}
		return false
	} catch (error) {
		console.error('Error checking file existence:', error)
		return false
	}
}

const riveUrl = ref(false)

// Create a new promise
const createLoadPromise = () => {
	loadPromise = new Promise((resolve) => {
		resolveLoad = resolve
	})
}

const init = () => {
	const canvas = el.value.querySelector('canvas')
	if (!canvas) return

	const file = canvas.dataset.file

	const fitType = props.layout === 'cover' ? Fit.Cover : Fit.Contain
	const fitAlignment = props.layout === 'cover' ? Alignment.Center : Alignment.Center
	const layout = props.layout ? new Layout({ fit: fitType, alignment: fitAlignment }) : null

	animation = new Rive({
		src: file,
		canvas,
		autoplay: props.autoplay,
		layout,
		stateMachines: props.stateMachine,
		artboard: props.artboard,
		onLoad: () => {
			if (!props.width || !props.height) animation.resizeDrawingSurfaceToCanvas()

			animationName = animation.animationNames[0]
			inputs = animation?.stateMachineInputs(props.stateMachine)

			// Resolve the promise when loaded
			nextTick(() => resolveLoad())
		},
	})
}

const play = () => {
	animation?.reset()
	animation?.play(props.stateMachine)
}

const scrub = (value) => animation?.scrub(animationName, value)
const getInput = (name) => inputs && inputs.find((input) => input.name === name)
const getInputs = () => inputs

const kill = () => {
	if (animation) {
		animation.cleanup()
		animation = null
	}
}

watch(
	() => screen.width,
	() => {
		kill()
		nextTick(() => init())
	},
)

onBeforeUnmount(() => kill())

onMounted(() => {
	createLoadPromise()

	// // Check if asset.localFile exists; if not, fallback to asset.file
	// if (props.asset && props.asset.localFile) {
	// 	const exists = await fileExists(props.asset.localFile)
	// 	riveUrl.value = exists ? props.asset.localFile : props.asset.file
	// } else {
	// 	riveUrl.value = props.asset?.file
	// }

	riveUrl.value = props.asset?.localFile ? props.asset?.localFile : props.asset?.file

	const context = getActiveContext()
	context.loader.ready.then(() => init())
})

defineExpose({ play, pause: () => animation?.pause(), reset: () => animation?.reset(), getAnimation: () => animation, scrub: scrub, getInput, getInputs, kill: kill, loaded: () => loadPromise })
</script>

<style lang="scss" scoped>
[data-component='rive-asset'] {
	position: relative;

	&.canvas {
		width: 100%;
		height: 100%;
	}

	canvas {
		width: 100%;
		height: 100%;

		object-fit: cover;
	}

	img {
		width: 100%;
	}
}
</style>
