<template>
	<div ref="el" data-component="loading">
		<span class="-h1 title">{{ title }}</span>
	</div>
</template>

<script setup>
import { getActiveContext } from '~/components/core/Page/context'

const props = defineProps({
	title: { type: String, default: 'Buro Preload' },
})

const el = ref(null)
const scroller = inject('$scroller')
const curtain = inject('$curtain')

onMounted(() => {
	const context = getActiveContext()
	context.loader.loaded.then(() => {
		document.querySelector(':root').style.setProperty('--body-backgroundColor', `#161003`)
		scroller.value?.reset()
		el.value.classList.add('loaded')
		el.value.remove()
		curtain.value.enter().then(() => {
			setTimeout(() => {
				context.loader.dispatch('ready')
				context.loader.dispatch('transition-ready')
			}, 100)
		})
	})
})
</script>

<style lang="scss" scoped>
[data-component='loading'] {
	position: fixed;
	top: 0;
	left: 0;

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100svw;
	height: 200svh;

	background-color: var(--preload-color, var(--color-black));
	color: var(--preload-color, var(--color-black));

	z-index: 10000;

	pointer-events: none;

	&.loaded {
		display: none;
		width: 0;
		height: 0;
		visibility: hidden;
	}

	.title {
		font-size: 500px;
	}
}
</style>
