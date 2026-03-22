<template>
	<section ref="el" data-component="services-list">
		<div v-for="(item, i) in list" :key="i" class="service-container">
			<Service v-bind="item" :index="i" :class="`card ${i + 1 === list.length ? 'last-card' : ''}`" hydrate-on-idle />
		</div>
	</section>
</template>

<script setup>
import { gsap } from 'gsap'

import { Service } from '~/components/fragments'

const props = defineProps({
	list: { type: Array, default: () => [] },
})

const el = ref(null)
const context = inject('pageContext')

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {})
</script>

<style lang="scss" scoped>
[data-component='services-list'] {
	position: relative;

	background-color: var(--color-darkBrown);
	width: 100%;

	.service-container {
		position: sticky;
		top: 0;

		perspective: 1000px;
		width: 100%;
		overflow: hidden;

		.card {
			&:first-child {
				margin-top: 0;
			}
		}

		&:last-child {
			position: relative;

			:deep(.service-inner) {
				padding-bottom: calc(var(--menu-gap));
			}
		}
	}
}
</style>
