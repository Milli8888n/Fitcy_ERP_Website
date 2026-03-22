<template>
	<div class="container">
		<canvas ref="canvas"></canvas>
	</div>
</template>

<script setup>
import Scene from './Scene.js'
import { Three } from '@buro/gl'
import { useEmitter } from '~/composables/core'
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

const canvas = ref()
const three = ref()
const canvasScrollTrigger = ref()
const containerScrollTrigger = ref()
const emitter = useEmitter()

const init = () => {
	try {
		three.value = Three.createApp(canvas.value, {
			gl: {
				alpha: true,
				webGPU: true,
				// forceWebGL: true,
			},
			camera: {
				fov: 45,
				position: [0, 0, 12],
			},
			observe: false,
			frameloop: 'none',
		})

		three.value.render((state, hooks) => {
			containerScrollTrigger.value = ScrollTrigger.create({
				trigger: '[data-component="bold-typography"]',
				start: 'top-=400 bottom',
				endTrigger: '[data-component="classes-showcase"]',
				end: 'top+=400 top',
				scrub: true,
				// markers: true,
				onEnter: () => {
					state.scene.visible = true
					state.frameloop = 'always'
				},
				onEnterBack: () => {
					state.scene.visible = true
					state.frameloop = 'always'
				},
				onLeave: () => {
					state.scene.visible = false
					state.frameloop = 'none'
					state.gl.clearColor(0.0, 0.0, 0.0, 1.0)
					state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT)
					state.gl.render(state.scene, state.camera)
				},
				onLeaveBack: () => {
					state.scene.visible = false
					state.frameloop = 'none'
					state.gl.clearColor(0.0, 0.0, 0.0, 1.0)
					state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT)
					state.gl.render(state.scene, state.camera)
				},
				onUpdate: ({ progress }) => {
					three.value.proxy({ type: 'scroll', progress })
				},
			})

			hooks.useResize(() => {
				containerScrollTrigger.value?.refresh()
			})

			Scene(emitter)
		})
	} catch (error) {
		emitter.emit('webgl-error')
		console.error('error setting up webgl:', error)
	}
}

onMounted(() => {
	init()
})

onBeforeUnmount(() => {
	canvasScrollTrigger.value?.kill()
	containerScrollTrigger.value?.kill()
})

onUnmounted(() => {
	three.value?.dispose()
})
</script>

<style lang="scss" scoped>
.container {
	pointer-events: none;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100lvh;
	z-index: 10;
	canvas {
		width: 100%;
		height: 100%;
	}
}
</style>
