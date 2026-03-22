<template>
	<section ref="el" data-component="classes-showcase" data-section-intersect="light" :class="page" data-three-sticky="end">
		<div class="row align-center align-middle title-row">
			<div class="xxlarge-9 col small-16">
				<RollingTitle :label="title" :trigger-element="el" :repeat="repeatNumber" />
				<p class="-subhead-2 -uppercase description">{{ description }}</p>

				<div v-if="ctaList" class="ctas-list-container">
					<ButtonRoundVariable v-for="(item, i) in ctaList" :key="i" v-bind="item" :type="i % 2 === 0 ? 'primary' : 'secondary'" class="btn" />
				</div>
			</div>
		</div>

		<div class="classes-cards-container">
			<Grid :list="list" />
		</div>
	</section>
</template>

<script setup>
import { RollingTitle, ButtonRoundVariable } from '~/components/primitives/'

import Grid from './components/Grid.vue'

import { useScreen } from 'vue-screen'
import { breakpoints } from '~/config'

const props = defineProps({
	title: { type: String, default: '' },
	description: { type: String, default: '' },
	list: { type: Array, default: () => [] },
	ctaList: { type: Array, default: () => [] },
	page: { type: String, default: 'inner' },
})

const screen = useScreen()
const el = ref(null)
const context = inject('pageContext')
const repeatNumber = ref(3)

watch(screen, () => (repeatNumber.value = screen.width >= breakpoints.small ? 3 : 1))
const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	repeatNumber.value = screen.width >= breakpoints.small ? 3 : 1
})
</script>

<style lang="scss" scoped>
[data-component='classes-showcase'] {
	position: relative;
	padding: rs(64) 0;

	background-color: var(--color-darkBrown);
	color: var(--color-yellow);
	width: 100%;

	height: 300vh;

	z-index: 10;

	@include max-screen($small) {
		height: 150vh;
	}

	&.main {
		margin-top: -100vh;

		@include max-screen($small) {
			margin-top: 0;
		}
	}

	.title-row {
		position: sticky;
		inset: 0;

		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;

		.col {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: rs(40);
		}
	}

	.description {
		width: n_grid_columns(6);
		text-align: center;

		@include max-screen($xsmall) {
			width: n_grid_columns(14);
		}
	}

	.classes-cards-container {
		position: relative;
		top: -20%;
		width: 100%;
		height: 100%;

		padding: 0 56px; // grid-padding (40px) + grid-gutter (16px)

		pointer-events: none;

		:deep([data-component='grid']) {
			@include max-screen($xsmall) {
				margin-top: -50vh;
			}
			.card {
				pointer-events: visible;
			}

			.class-container {
				@include max-screen($xsmall) {
					&:nth-child(2),
					&:nth-child(3) {
						display: none;
					}
				}
			}
		}
	}

	.ctas-list-container {
		position: relative;

		display: flex;
		gap: rs(12);
	}

	:deep([data-component="rolling-title"]) {
		width: 100%;
		margin: 0 !important;
		display: grid !important;
		justify-items: center; 
		align-items: center;

		.label {
			font-size: 10vw;
			line-height: 0.9;
			letter-spacing: -0.02em;
			font-family: 'Be Vietnam Pro', sans-serif; // Premium Vietnamese font
			font-weight: 900;
			text-transform: uppercase;
			
			// Ensure they stack perfectly
			grid-column: 1;
			grid-row: 1;
			text-align: center;
		}
	}
}
</style>
