<template>
	<component :is="computedElement" ref="el" :to="link" data-component="content-button">
		<span class="-footnote-1 -uppercase label">{{ label }}</span>
	</component>
</template>

<script setup>
import { gsap } from 'gsap'

import { HyperLink } from '~/components/core'

const props = defineProps({
	label: { type: String, default: '' },
	link: { type: [Boolean, Object], default: false },
})

const el = ref(null)
const context = inject('pageContext')
const computedElement = computed(() => (props.link ? HyperLink : 'button'))

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {})
</script>

<style lang="scss" scoped>
[data-component='content-button'] {
	position: relative;

	display: flex;
	justify-content: center;
	padding: rs(12) rs(24, 14);
	border: 1px solid var(--contentButton-color, var(--color-darkBrown));
	border-radius: 100%;
	min-width: rs(120, 100);
	@include extend_hitbox(20);

	color: var(--contentButton-color, var(--color-darkBrown));
	background-color: var(--contentButton-backgroundColor, var(--color-yellow));

	transition: color 0.25s ease(out-expo), background-color 0.25s ease(out-expo);

	@media (hover: hover) {
		&:hover {
			background-color: var(--contentButton-color, var(--color-darkBrown));
			color: var(--contentButton-backgroundColor, var(--color-yellow));
		}
	}

	.label {
		position: relative;
		text-align: center;
		white-space: normal;
	}
}
</style>
