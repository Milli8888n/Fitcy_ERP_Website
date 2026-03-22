<template>
	<video
		ref="video"
		data-component="video-asset"
		:src="asset.url"
		:autoplay="autoplay"
		:muted="muted"
		:loop="loop"
		:playsinline="playsinline"
		:poster="asset.poster ? asset.poster.url : ''"
		@loadedmetadata="onMetadataLoaded"
		@canplay="onCanPlay"
		style="object-fit: cover; width: 100%; height: 100%;"
	></video>
</template>

<script setup>
const props = defineProps({
	asset: { type: Object, required: true },
	autoplay: { type: Boolean, default: true },
	muted: { type: Boolean, default: true },
	loop: { type: Boolean, default: true },
	playsinline: { type: Boolean, default: true },
	onLoad: { type: Function, default: () => {} },
})

const video = ref(null)

const onMetadataLoaded = () => {
	// console.log('Video metadata loaded')
}

const onCanPlay = () => {
    if (props.autoplay && video.value) {
        video.value.play().catch(e => {
            // Autoplay might be blocked
            console.warn('Autoplay blocked:', e)
        })
    }
	props.onLoad()
}

defineExpose({
	play: () => video.value?.play(),
	pause: () => video.value?.pause(),
	video: video,
})
</script>

<style lang="scss" scoped>
[data-component='video-asset'] {
	display: block;
}
</style>
