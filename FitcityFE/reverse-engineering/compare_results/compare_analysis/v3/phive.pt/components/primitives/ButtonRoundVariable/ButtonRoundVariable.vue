<template>
	<component
		ref="el"
		:is="computedElement"
		:to="href || link"
		:data-type="type"
		:data-size="size"
		:data-disabled="disabled"
		data-component="button-round-variable"
		:aria-label="label"
		@mouseenter="handleMouseEnter"
		@mouseleave="handleMouseLeave"
	>
		<span class="bg" />
		<VariableLabel ref="rollHoverLabelRef" :label="label" class="rollhover-label" />
	</component>
</template>

<script setup>
import { HyperLink } from '~/components/core'
import { getActiveContext } from '~/components/core/Page/context'
import { VariableLabel } from '~/components/primitives'

const props = defineProps({
	type: { type: String, default: 'secondary' },
	size: { type: String, default: 'medium' },
	label: { type: [Boolean, String], default: false },
	href: { type: [Boolean, Object], default: false },
	link: { type: [Boolean, Object], default: false },
	hover: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	clickFunc: { type: Function, default: () => {} },
	as: { type: [Boolean, String], default: false },
})

const el = ref(null)
const rollHoverLabelRef = ref(null)

const computedElement = computed(() => (props.as ? props.as : props.href || props.link ? HyperLink : 'button'))

const handleMouseEnter = () => rollHoverLabelRef.value.setForceHover(true)
const handleMouseLeave = (e) => rollHoverLabelRef.value.setForceHover(false)

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()

	setup()
	context.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='button-round-variable'] {
	position: relative;
	padding: 0 rs(24);

	display: inline-flex;
	align-items: center;
	height: rs(42, 42);

	color: var(--roundButton-color, var(--color-darkBrown));

	@media (hover: hover) {
		&:hover {
			&[data-type='secondary'] {
				color: var(--roundButton-color, var(--color-darkBrown));

				.bg {
					background-color: var(--roundButton-backgroundColor, var(--color-yellow));
				}
			}

			.bg {
				background-color: var(--color-subduedYellow);
				transform: scale(1.05);
			}
		}
	}

	&[data-type='secondary'] {
		color: var(--roundButton-color, var(--color-yellow));

		.bg {
			background-color: var(--roundButton-backgroundColor, transparent);
			border-color: var(--roundButton-color, var(--roundButton-color, var(--color-yellow)));
		}
	}

	&[data-disabled='true'] {
		opacity: 0.5;
		pointer-events: none;

		.bg,
		.label {
			pointer-events: none;
		}
	}

	&[data-size='large'] {
		height: rs(46, 40);

		.rollhover-label {
			:deep(.label),
			:deep(.label-spacing) {
				font-size: rs(14, 12);
			}
		}
	}

	.bg {
		position: absolute;
		inset: 0;

		display: block;

		background-color: var(--roundButton-color, var(--color-yellow));
		border-radius: rs(38);
		border: 1px solid var(--roundButton-backgroundColor, transparent);

		transition: background-color 0.75s ease(out-circ), transform 0.75s ease(out-circ);
	}

	.rollhover-label {
		&[data-hover='true'] {
			:deep(.label) {
				font-variation-settings: 'wdth' 40, 'wght' 700;
				letter-spacing: -0em;
			}
		}

		:deep(.label),
		:deep(.label-spacing) {
			@include label-1;
		}
	}
}
</style>
