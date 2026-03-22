<template>
	<nuxt-img
		v-if="asset.extension !== 'svg'"
		data-component="image-asset"
		:src="asset.url"
		:width="Math.round(dimensions.width)"
		:height="Math.round(dimensions.height)"
		:format="format"
		:provider_="provider"
		:quality="quality"
		:loading="loading"
		:alt="alt || asset.alt || 'Image'"
		:title="alt || asset.alt || 'Image'"
		:modifiers="modifiers"
		:preload="preload"
		:sizes="sizes"
		:fetchpriority="fetchpriority"
		@load="onImageLoad"
	/>
	<nuxt-img
		v-else
		data-component="image-asset"
		:src="asset.url"
		:width="Math.round(dimensions.width)"
		:height="Math.round(dimensions.height)"
		:provider_="provider"
		:alt="alt || asset.alt || 'Image'"
		:title="alt || asset.alt || 'Image'"
		:preload="preload"
		@load="onImageLoad"
	/>
</template>

<script>
function assetValidator(asset) {
	if (!Object.hasOwn(asset, 'url')) {
		console.error(`[primitives/ImageAsset] Missing required 'url' key in 'asset' prop.`)
		return false
	}
	return true
}

function validateDimension(value) {
	if (isNaN(value) || !value) {
		return undefined
	}
	return value
}
</script>

<script setup>
const props = defineProps({
	asset: { type: Object, required: true, validator: assetValidator },
	provider: { type: String, default: 'ipx' },
	format: { type: String, default: 'webp' },
	width: { type: [String, Number], default: undefined },
	height: { type: [String, Number], default: undefined },
	quality: { type: [Number, String], default: undefined },
	sizes: { type: [Object, String], default: 'xsmall:400px medium:1200px xlarge:1700px"' },
	modifiers: { type: Object, default: undefined },
	preload: { type: Boolean, default: undefined },
	loading: { type: String, default: undefined },
	alt: { type: String, default: undefined },
	build: { type: Function, default: undefined },
	onLoad: { type: Function, default: () => {} },
	fetchpriority: { type: String, default: '' },
})

const dimensions = computed(() => {
	let width = Number(props.asset.width)
	let height = Number(props.asset.height)

	const propWidth = Number(props.width)
	const propHeight = Number(props.height)

	if (propWidth && propHeight) {
		return {
			width: validateDimension(propWidth),
			height: validateDimension(propHeight),
		}
	}

	if (propWidth && !propHeight) {
		height = (propWidth * height) / width
		width = propWidth
	}

	if (!propWidth && propHeight) {
		width = (propHeight * width) / height
		height = propHeight
	}

	return {
		width: validateDimension(width),
		height: validateDimension(height),
	}
})

const onImageLoad = ({ target }) => {
	if (!target) return
	const wrapper = target.closest('.-lazy-figure') ?? target.closest('[data-lazy-figure]')

	if (wrapper) {
		wrapper.classList.remove('-lazy-figure')
		wrapper.removeAttribute('data-lazy-figure')
		target.classList.add('transition-enter')

		setTimeout(() => target.classList.add('enter'), 10)
		setTimeout(() => {
			target.classList.remove('transition-enter')
			target.classList.remove('enter')
		}, 250)
	}

	props.onLoad()
}
</script>

<style lang="scss" scoped></style>
