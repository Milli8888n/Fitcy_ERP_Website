<template>
	<div ref="el" data-component="input-wrapper" :class="computedType">
		<label class="-label-2 -uppercase label" for="input">{{ label }}</label>
		<Input :class="`input ${type}`" ref="input" :type="type" :required="required" :name="name" />
		<span class="underline" />
	</div>
</template>

<script setup>
import { getActiveContext, Input } from '~/components/core'

import { useScreen } from 'vue-screen'

const props = defineProps({
	label: { type: String, default: '' },
	type: { type: String, default: 'text' },
	// name: { type: [Boolean, Object], default: false },
	name: { type: String, default: '' },
	required: { type: Boolean, default: false },
})

const el = ref(null)
const input = ref(null)
const computedType = computed(() => props.type.split('.')[1])
const screen = useScreen()

watch(
	() => screen.width,
	() => {
		const width = el.value.offsetWidth
		el.value.style.setProperty('--iti-custom-width', `${width}px`)
	}
)

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()
	context.loader.ready.then(() => {
		const width = el.value.offsetWidth
		el.value.style.setProperty('--iti-custom-width', `${width}px`)

		if (props.type === 'input.tel') el.value.setAttribute('data-lenis-prevent', '')
	})
})

defineExpose({ checkField: () => input.value.checkField(), input })
</script>

<style lang="scss" scoped>
[data-component='input-wrapper'] {
	--duration: 0.25s;
	--ease: #{ease(in-out-quart)};

	position: relative;

	display: block;

	&.error {
		.underline {
			background-color: red;
		}
	}

	.underline {
		position: absolute;
		bottom: 0;
		left: 0;

		display: block;
		width: 100%;
		height: 1px;

		background-color: var(--color-lightGray);
	}

	.label {
		position: relative;

		display: block;
		opacity: 0.4;
	}
	.input {
		grid-row: 1;
		grid-column: 1;

		width: 100%;
		min-height: rs(48, 48);

		@include body-1;
		line-height: rs(49);

		background-color: var(--color-white);
		padding: 0 rs(16) !important;

		cursor: text;
	}
}
</style>
