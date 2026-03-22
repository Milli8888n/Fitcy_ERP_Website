<template>
	<component
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

import { ImageAsset, VideoAsset } from '~/components/core'

const props = defineProps({
	media: { type: [Boolean, Array], default: false },
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

// const AsyncImageAsset = defineAsyncComponent(() => import('~/components/core/ImageAsset/ImageAsset.vue'))
// const AsyncVideoAsset = defineAsyncComponent(() => import('~/components/core/VideoAsset/VideoAsset.vue'))

const backgroundType = computed(() => {
	let type = 'image'

	props.media.every((el) => {
		if (el.type === 'video') {
			type = 'video'
			return false
		}

		return true
	})

	return type === 'image' ? ImageAsset : VideoAsset
})

const selectedBackground = computed(() => {
	let bg = props.media[0]
	let type = 'image'

	props.media.every((el) => {
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
