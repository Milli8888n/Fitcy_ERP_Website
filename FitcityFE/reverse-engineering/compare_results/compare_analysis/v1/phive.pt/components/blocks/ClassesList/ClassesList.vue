<template>
	<section ref="el" data-component="classes-list" data-section-intersect="light">
		<ClassesGrid ref="classesRef" :list="list" class="classes-grid" />
	</section>
</template>

<script setup>
import ClassesGrid from '~/components/fragments/ClassesGrid/ClassesGrid.vue'

const props = defineProps({
	list: { type: Array, default: () => [] },
})

const context = inject('pageContext')
const el = ref(null)
const classesRef = ref(null)

const setup = () => {
	classesRef.value.setupEnterAnimation()
}
const init = () => {
	setTimeout(() => classesRef.value.enterAnimation(), 1000)
}
const kill = () => {}

onBeforeUnmount(() => kill())
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.transitionReady.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='classes-list'] {
	position: relative;
	padding-bottom: rs(140, 54);

	width: 100%;

	background-color: var(--color-darkBrown);
}
</style>
