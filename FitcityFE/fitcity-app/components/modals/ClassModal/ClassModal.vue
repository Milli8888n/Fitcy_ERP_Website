<template>
	<div ref="el" data-component="class-modal">
		<span class="bg" />

		<ClassHeader v-bind="header" />
		<ClassBody v-bind="body" />
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

// import { ClassHeader, ClassBody } from '~/components/blocks'

import ClassHeader from '~/components/blocks/ClassHeader/ClassHeader.vue'
import ClassBody from '~/components/blocks/ClassBody/ClassBody.vue'

import { getActiveContext } from '~/components/core/Page/context.js'

const props = defineProps({
	header: { type: [Boolean, Object], default: false },
	body: { type: [Boolean, Object], default: false },
})

const el = ref(null)
const enterTl = gsap.timeline({ paused: true })

const setup = () => {
	enterTl.fromTo(
		el.value,
		{
			xPercent: 10,
			opacity: 0,
			transformOrigin: 'top right',
		},
		{
			xPercent: 0,
			opacity: 1,
			ease: 'expo.out',
			duration: 1,
		}
	)
}
const init = () => {
	enterAnimation()
}
const kill = () => {}

const enterAnimation = () => enterTl.timeScale(1).play()
const exitAnimation = () => enterTl.timeScale(2).reverse()

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()

	setup()
	context.loader.ready.then(() => init())
})

defineExpose({ enterAnimation, exitAnimation })
</script>

<style lang="scss" scoped>
[data-component='class-modal'] {
	position: relative;

	width: var(--modal-width);
	min-height: 100dvh;

	.bg {
		position: absolute;
		inset: 0;

		background-color: var(--color-yellow);
	}
}
</style>
