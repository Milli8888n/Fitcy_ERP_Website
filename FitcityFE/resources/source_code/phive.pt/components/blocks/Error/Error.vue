<template>
	<div ref="el" data-component="error" data-section-intersect="light">
		<div class="container">
			<h1 ref="titleEl" class="-title-1 title"><span class="thin">4</span>0<span class="thin">4</span></h1>
			<div class="description-container">
				<p class="-subhead-2 description">the page you’re looking for is no longer available</p>

				<nuxt-link to="/"><p ref="subtitleEl" class="-manuscript-3 subtitle">Homepage</p></nuxt-link>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useFullWidthFontSize } from '~/composables/useFullWidthFontSize'
import { useScreen } from 'vue-screen'

const props = defineProps({})

const el = ref(null)
const context = inject('pageContext')
const titleEl = ref(null)
const screen = useScreen()

watch(screen, () => resizeFont())

const { resizeFont } = useFullWidthFontSize({ element: titleEl })

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
watch(
	() => screen.width,
	() => {
		resizeFont()
	},
)

onMounted(() => {
	resizeFont()
})
</script>

<style lang="scss" scoped>
[data-component='error'] {
	position: relative;
	width: 100dvw;
	height: 100dvh;
	overflow: hidden;

	background-color: var(--color-darkBrown);

	.container {
		position: relative;
		padding: 0 n_grid_columns(2);

		display: grid;
		width: 100%;
		height: 100%;
		align-items: center;
		justify-items: center;

		user-select: none;
	}

	.title {
		color: var(--color-yellow);
		grid-row: 1;
		grid-column: 1;
		font-variation-settings:
			'wdth' 60,
			'wght' 300;

		.thin {
			font-family: 'PPFormula';
			letter-spacing: 0.1em;
			line-height: 1em;
			font-variation-settings:
				'wdth' 20,
				'wght' 500;

			&:first-of-type {
				font-style: italic;

				font-variation-settings:
					'wdth' 0,
					'wght' 300;
			}
		}
	}

	.description-container {
		grid-row: 1;
		grid-column: 1;

		text-align: center;
		color: var(--color-white);
	}

	.description {
		color: var(--color-white);
	}
}
</style>
