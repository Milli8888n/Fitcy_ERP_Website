<template>
	<component
		v-if="selectedBackground"
		ref="el"
		data-component="media-asset"
		:is="backgroundType"
		:asset="selectedBackground"
		:autoplay="autoplay"
		:playsinline="playsinline"
		:muted="muted"
		:sizes="sizes"
		:fetchpriority="fetchpriority"
		class="media"
	/>
</template>

<script setup>
// import { defineAsyncComponent } from 'vue'

import ImageAsset from '../ImageAsset/ImageAsset.vue'
import VideoAsset from '../VideoAsset/VideoAsset.vue'

const props = defineProps({
	media: { type: [Boolean, Array, Object], default: false },
	autoplay: { type: [Boolean], default: true },
	muted: { type: [Boolean], default: true },
	playsinline: { type: [Boolean], default: true },
	sizes: {
		type: [Object, String],
		default: 'sizes="xsmall:400px medium:1200px xlarge:1700px"',
	},
	fetchpriority: { type: String, default: '' },
})
const el = ref(null)

// Convert media to array if it's an object
const mediaArray = computed(() => {
	if (!props.media || props.media === false) return []
	if (Array.isArray(props.media)) return props.media
	// If it's an object, wrap it in an array
	return [props.media]
})

// const AsyncImageAsset = defineAsyncComponent(() => import('~/components/core/ImageAsset/ImageAsset.vue'))
// const AsyncVideoAsset = defineAsyncComponent(() => import('~/components/core/VideoAsset/VideoAsset.vue'))

const backgroundType = computed(() => {
	let type = 'image'

	mediaArray.value.every((el) => {
		if (el.type === 'video') {
			type = 'video'
			return false
		}

		return true
	})

	return type === 'image' ? ImageAsset : VideoAsset
})

const selectedBackground = computed(() => {
	if (mediaArray.value.length === 0) {
		return null
	}

	let bg = mediaArray.value[0]
	let type = 'image'

	mediaArray.value.every((el) => {
		if (el.type === 'video') {
			bg = el
			type = 'video'
			return false
		}

		return true
	})

	return bg
})

// defineExpose({ play: el.value?.play(), pause: el.value?.pause() })
</script>

<style lang="scss" scoped>
[data-component='media-asset'] {
	position: relative;
}
</style>
