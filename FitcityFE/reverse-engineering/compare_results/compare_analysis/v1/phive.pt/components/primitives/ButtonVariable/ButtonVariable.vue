<template>
	<component ref="el" :is="computedElement" :to="href || link" :data-size="size" :aria-label="label" data-component="button-variable" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
		<span class="bg" />
		<VariableLabel ref="rollHoverLabelRef" :label="label" class="rollhover-label" />
	</component>
</template>

<script setup>
import { gsap, SplitText } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText)

import { HyperLink } from '~/components/core'
import { getActiveContext } from '~/components/core/Page/context'
import { VariableLabel } from '~/components/primitives'

const props = defineProps({
	label: { type: [Boolean, String], default: false },
	href: { type: [Boolean, Object], default: false },
	link: { type: [Boolean, Object], default: false },
	size: { type: String, default: 'medium' },
	hover: { type: Boolean, default: false },
	clickFunc: { type: Function, default: () => {} },
	as: { type: [Boolean, String], default: false },
})

const el = ref(null)
const rollHoverLabelRef = ref(null)
let split

const computedElement = computed(() => (props.as ? props.as : props.href || props.link ? HyperLink : 'button'))

const handleMouseEnter = () => rollHoverLabelRef.value.setForceHover(true)
const handleMouseLeave = (e) => rollHoverLabelRef.value.setForceHover(false)

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()

	context?.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='button-variable'] {
	position: relative;
	padding: 0 rs(24);

	display: inline-flex;
	align-items: center;
	justify-content: center;

	height: rs(54, 48);

	color: var(--buttonVariable-accentColor, var(--color-lightYellow));

	cursor: pointer;

	@media (hover: hover) {
		&:hover {
			color: var(--buttonVariable-backgroundColor, var(--color-darkBrown));

			.bg {
				background-color: var(--buttonVariable-color, var(--color-yellow));
				border-color: var(--buttonVariable-color, var(--color-yellow));
				transform: scale(1.05);
			}
		}
	}

	&[data-size='large'] {
		height: rs(46, 40);

		@media (hover: hover) {
			:deep(.label),
			:deep(.label-spacing) {
				letter-spacing: 0.01em;
			}
		}
		:deep(.label),
		:deep(.label-spacing) {
			font-size: rs(28, 24);
			letter-spacing: -0.028em;
		}
	}

	.bg {
		position: absolute;
		inset: 0;

		display: block;

		border: 1px solid var(--buttonVariable-accentColor, var(--color-lightYellow));
		background-color: transparent;

		transition: transform 0.75s ease(out-circ), background-color 0.75s ease(out-circ), border-color 0.25s ease(out-circ);
	}
}
</style>
