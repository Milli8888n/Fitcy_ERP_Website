<template>
	<div ref="el" data-component="variable-label" :data-hover="hoverState">
		<span class="-callout -uppercase label-spacing">{{ label }}</span>

		<div class="inner">
			<span class="-callout -uppercase label">{{ label }}</span>
		</div>
	</div>
</template>

<script setup>
import { gsap, SplitText } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText)

import { getActiveContext } from '~/components/core/Page/context.js'

const props = defineProps({
	label: { type: String, default: '' },
	forceHover: { type: Boolean, default: false },
})

const el = ref(null)
const hoverState = ref(false)
let split

const setForceHover = (val) => (hoverState.value = val)

const setup = () => {
	nextTick(() => {
		const label = el.value.querySelector('.label')

		split = new SplitText(label, {
			type: 'chars',
			charsClass: 'char',
			tag: 'span',
			preserveWhitespace: true,
		})
	})
}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()

	// setup()
	context && context.loader.ready.then(() => init())
})

defineExpose({ setForceHover })
</script>

<style lang="scss" scoped>
[data-component='variable-label'] {
	position: relative;

	display: inline-flex;
	align-items: center;
	justify-content: center;

	&[data-hover='true'] {
		.label {
			font-variation-settings: 'wdth' 10, 'wght' 600;
			letter-spacing: -0.01em;
		}
	}

	.label-spacing {
		position: relative;

		opacity: 0;
		visibility: hidden;
	}

	.inner {
		position: absolute;
		left: 0;

		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		white-space: nowrap;
	}

	.label {
		white-space: nowrap;
		transition: color 0.5s ease(out-expo);
		@include split_text_inherit();

		transition: font-variation-settings 0.75s ease(out-circ), letter-spacing 0.75s ease(out-circ);

		:deep(.char) {
			display: inline-block !important;
		}
	}
}
</style>
