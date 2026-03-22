<template>
	<div ref="el" data-component="image-asset-static">
		<picture>
			<source :srcset="props.desktop" :media="`(min-width: ${breakpoints.large}px)`" :type="getImageType(props.desktop)" />
			<source :srcset="props.tablet || props.desktop" :media="`(min-width: ${breakpoints.xsmall}px)`" :type="getImageType(props.tablet || props.desktop)" />
			<img :src="props.mobile || props.tablet || props.desktop" :alt="props.alt || ''" loading="lazy" decoding="async" :width="width" :height="height" />
		</picture>
	</div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { breakpoints } from '~/config'

const props = defineProps({
	desktop: { type: String, required: true },
	tablet: { type: String, default: '' },
	mobile: { type: String, default: '' },
	width: { type: [Boolean, Number], default: false },
	height: { type: [Boolean, Number], default: false },
	alt: { type: String, default: '' },
})

const el = ref(null)
const context = inject('pageContext')

const getImageType = (url) => {
	const extension = url.split('.').pop().toLowerCase()
	const types = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		webp: 'image/webp',
		avif: 'image/avif',
	}
	return types[extension] || 'image/jpeg'
}

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {})
</script>

<style lang="scss" scoped>
[data-component='image-asset-static'] {
	position: relative;
	width: 100%;
	height: 100%;

	picture {
		width: 100%;
		height: 100%;
		display: block;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}
</style>
