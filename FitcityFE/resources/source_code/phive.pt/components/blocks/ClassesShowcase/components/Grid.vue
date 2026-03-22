<template>
	<div ref="el" data-component="grid">
		<div v-for="(item, i) in gridRef" :key="i" class="class-container">
			<ClassCard v-if="item" v-bind="item" class="card" />
		</div>
	</div>
</template>

<script setup>
import { ClassCard } from '~/components/fragments'
import { useParallax } from '~/composables/core'

const props = defineProps({
	list: { type: [Boolean, Array], default: false },
})

const el = ref(null)
const context = inject('pageContext')
const parallaxArr = []

const gridRef = ref([])

const setup = () => {}
const init = () => {
	el.value.querySelectorAll('.card').forEach((elem, i) => {
		elem.style.opacity = 1
		const friction = i % 2 === 0 ? 1 : 2
		const aux = useParallax({
			element: elem,
			trigger: elem,
			endTrigger: el.value,
			friction,
			start: 'top bottom',
			end: 'bottom top',
		})
		aux.setup()
		parallaxArr.push(aux)
	})
}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	const randomIndex = Math.floor(Math.random() * props.list.length)

	if (props.list.length > 4) gridRef.value = props.list.slice(randomIndex, randomIndex + 4)
	else gridRef.value = props.list

	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='grid'] {
	position: relative;

	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	grid-template-rows: repeat(2, minmax(0, 1fr));
	gap: rs(16);

	height: 100%;
	width: 100%;

	@include max-screen($small) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		grid-template-rows: repeat(4, minmax(0, 1fr));
	}

	@include max-screen($xsmall) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		grid-template-rows: repeat(2, minmax(0, 1fr));
		row-gap: rs(84, 44);
	}

	.class-container {
		display: flex;
		justify-content: center;

		&:nth-child(1) {
			grid-row: 1;
			grid-column: 1;
			align-items: flex-end;
		}
		&:nth-child(2) {
			grid-row: 2;
			grid-column: 4;
			align-items: flex-start;

			@include max-screen($small) {
				grid-row: 2;
				grid-column: 3;
			}
			@include max-screen($xsmall) {
				grid-row: 1;
				grid-column: 2;
				align-items: flex-start;
			}
		}
		&:nth-child(3) {
			grid-row: 3;
			grid-column: 1;
			align-items: flex-end;

			@include max-screen($small) {
				grid-row: 3;
				grid-column: 1;
			}
			@include max-screen($xsmall) {
				grid-row: 2;
				grid-column: 1;
			}
		}
		&:nth-child(4) {
			grid-row: 4;
			grid-column: 3;
			align-items: flex-start;

			@include max-screen($small) {
				grid-row: 4;
				grid-column: 3;
			}
			@include max-screen($xsmall) {
				grid-row: 2;
				grid-column: 2;
			}
		}

		@include max-screen($xsmall) {
			&:nth-child(1),
			&:nth-child(2),
			&:nth-child(3),
			&:nth-child(4) {
				align-items: center;
			}
		}
	}
}
</style>
