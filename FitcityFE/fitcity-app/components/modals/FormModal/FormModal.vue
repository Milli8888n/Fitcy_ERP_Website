<template>
	<div ref="el" data-component="form-modal">
		<span class="bg" />

		<FormHeader v-if="formHeader" v-bind="formHeader" />
		<FormClubs v-if="formClubs" v-bind="formClubs" :enter-animation="false" />
		<FormInputs v-if="formInputs" v-bind="formInputs" />
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

// import { FormHeader, FormClubs, FormInputs } from '~/components/blocks'

import FormHeader from '~/components/blocks/FormHeader/FormHeader.vue'
import FormClubs from '~/components/blocks/FormClubs/FormClubs.vue'
import FormInputs from '~/components/blocks/FormInputs/FormInputs.vue'

import { getActiveContext } from '~/components/core/Page/context.js'

const props = defineProps({
	formHeader: { type: [Boolean, Object], default: false },
	formClubs: { type: [Boolean, Object], default: false },
	formInputs: { type: [Boolean, Object], default: false },
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
[data-component='form-modal'] {
	position: relative;

	width: var(--modal-width, #{rs(1100)});
	min-height: 100dvh;

	.bg {
		position: absolute;
		inset: 0;

		background-color: var(--color-yellow);
	}
}
</style>
