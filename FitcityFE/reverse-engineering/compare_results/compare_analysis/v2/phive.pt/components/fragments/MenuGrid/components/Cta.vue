<template>
	<div ref="el" data-component="cta">
		<div class="inner">
			<client-only>
				<ButtonVariable v-if="buttonCtaRef" v-bind="buttonCtaRef" class="cta-btn" />
			</client-only>
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

import { ButtonVariable } from '~/components/primitives'

import { getActiveContext } from '~/components/core'

const props = defineProps({
	buttonCta: { type: [Boolean, Object], default: false },
})

const el = ref(null)
const buttonCtaRef = ref(props.buttonCta)

const setup = () => {
	gsap.set(el.value.querySelector('.inner'), {
		transformOrigin: 'bottom',
		rotationX: 120,
	})

	watch(
		() => props.buttonCta,
		(newValue) => {
			if (newValue) {
				buttonCtaRef.value = newValue
				nextTick(() => enter())
			} else {
				leave().then(() => (buttonCtaRef.value = newValue))
			}
		},
		{ immediate: true }
	)
}

const enter = () => {
	if (!buttonCtaRef) return
	nextTick(() => {
		gsap.to(el.value.querySelector('.inner'), {
			rotationX: 0,
			duration: 1,
			ease: 'expo.out',
			delay: 4,
		})
	})
}
const leave = () => {
	return new Promise((resolve) => {
		gsap.to(el.value.querySelector('.inner'), {
			rotationX: 95,
			duration: 1,
			ease: 'expo.out',
			onComplete: () => resolve(),
		})
	})
}

const kill = () => leave()

onBeforeUnmount(() => kill())
onMounted(() => {
	const context = getActiveContext()

	context.loader.loaded.then(() => setup())
	context.loader.ready.then(() => enter())
})
</script>

<style lang="scss" scoped>
[data-component='cta'] {
	position: relative;
	pointer-events: visible;

	perspective: 1000px;
	width: 100%;

	.inner {
		backface-visibility: hidden;
		height: 100%;

		.cta-btn {
			width: 100%;
		}
	}
}
</style>
