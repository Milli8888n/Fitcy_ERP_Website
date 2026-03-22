<template>
	<div ref="el" data-component="legal-notice">
		<h3 class="-label-1 -uppercase title">{{ title }}</h3>

		<div class="choice-container">
			<label class="-label-2 -uppercase radio" @click="setOption">
				<input type="radio" name="choice" value="yes" />
				<span class="custom-radio"></span>
				Sim
			</label>
			<label class="-label-2 -uppercase radio" @click="setOption">
				<input type="radio" name="choice" value="no" />
				<span class="custom-radio"></span>
				Não
			</label>
		</div>
		<RichText v-if="description" :blocks="description" class="description" />
	</div>
</template>

<script setup>
import { RichText } from '~/components/primitives'

const props = defineProps({
	title: { type: String, default: '' },
	description: { type: [Boolean, Array], default: false },
})

const el = ref(null)
const option = ref(false)

const setOption = (e) => (option.value = e.target.closest('.radio').querySelector('input').value)
const getOption = () => option

defineExpose({ getOption })
</script>

<style lang="scss" scoped>
[data-component='legal-notice'] {
	position: relative;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: rs(16);

	.choice-container {
		position: relative;
		margin-top: rs(8);

		display: flex;
		gap: rs(24);
		align-items: center;

		.radio input[type='radio'] {
			display: none;
		}

		.custom-radio {
			position: relative;
			width: rs(16, 16);
			height: rs(16, 16);
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid var(--color-darkBrown);

			cursor: pointer;
			transition: all 0.3s ease;
		}

		.custom-radio::before {
			content: '';
			position: relative;

			width: rs(10, 10);
			height: rs(10, 10);
			background-color: var(--color-darkBrown);
			transform: scale(0);
			transition: transform 0.3s ease;
		}

		.radio input[type='radio']:checked + .custom-radio::before {
			transform: scale(1);
		}

		.radio:hover .custom-radio {
			border-color: var(--color-darkBrown);
		}

		.radio input[type='radio']:checked + .custom-radio {
			border-color: var(--color-darkBrown);
		}

		.radio {
			display: flex;
			align-items: center;
			gap: rs(10, 10);
			cursor: pointer;
		}
	}

	.description {
		:deep(p) {
			position: relative;
			margin-bottom: 0.5em;

			@include body-1;

			color: rgb(from var(--color-darkBrown) r g b / 0.4);
		}

		:deep(a) {
			text-decoration: underline;
		}
	}
}
</style>
