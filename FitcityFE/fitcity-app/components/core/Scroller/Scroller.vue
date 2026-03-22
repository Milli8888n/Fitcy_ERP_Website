<template>
	<div ref="el" data-component="scroller" :class="`${main ? 'main' : 'inner'}`">
		<slot v-if="main" />

		<div v-else ref="scrollContainer" class="scroller-container">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useEmitter } from '~/composables/core'

import { easeInOutCubic } from '~/utils/easing'

const props = defineProps({
	main: { type: Boolean, default: false },
})

const lenisRef = ref(null)

let lenis = null
const el = ref(null)
const scrollContainer = ref(null)
const emitter = useEmitter()

function raf(time) {
	lenis.raf(time * 1000)
}
function destroy() {
	lenis.destroy()
	gsap.ticker.remove(raf)
}

onUnmounted(() => {
	destroy()
})

onMounted(() => {
	const wrapper = el.value
	const container = scrollContainer.value
	const options = props.main ? {} : { wrapper: wrapper, content: container }

	lenis = new Lenis(options)
	lenis.on('scroll', () => ScrollTrigger.update())
	lenisRef.value = lenis

	gsap.ticker.add(raf)
	gsap.ticker.lagSmoothing(0)
	ScrollTrigger.clearScrollMemory('manual')

	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual'
	}

	!props.main && lenis.stop()

	emitter.on('scroller-resize', () => resize())
	emitter.on('scroller-destroy', () => destroy())
	emitter.on('scroller-lock', () => stop())
	emitter.on('scroller-unlock', () => start())
	emitter.on('scroller-reset', () => reset())
	emitter.on('scroller-scrollTo', (args) => {
		const _args = {
			href: args.href,
			duration: args.duration || 1,
			immediate: args.immediate || false,
		}
		scrollTo(_args.href, _args.duration, _args.immediate)
	})
})

const reset = () => {
	// window.scrollY = 0
	// window.scrollTop = 0

	lenis.scrollTo(0, { immediate: true, force: true, lock: true })
}
const start = () => lenis.start()
const stop = () => lenis.stop()
const resize = () => {
	lenis.resize()
	ScrollTrigger.refresh()
}
const scrollTo = (value, duration = 1, immediate = false) =>
	lenis.scrollTo(value, {
		immediate,
		duration,
		force: true,
		lock: true,
		easing: easeInOutCubic,
	})

defineExpose({ getScrollerInstance: () => lenisRef, start, stop, resize, reset, scrollTo })
</script>

<style lang="scss" scoped>
[data-component='scroller'] {
    position: relative;
    width: 100%;
    height: auto;
    max-height: 100%;
    overflow-x: clip; // Prevent horizontal overflow globally at the root scroller level

	overscroll-behavior: contain;

	&.inner {
		overflow-y: scroll;
	}

	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}

	.scroller-container {
		width: 100%;
	}
}
</style>
