<template>
	<div data-component="grid" :data-show="show" class="row">
		<div v-for="(col, index) in new Array(grid.col_number)" :key="index" :class="`col xxlarge-1`" />
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { grid } from '~/config/grid'

const keys = []
const show = ref(false)

function onWindowKeyDown({ keyCode }) {
	keys[keyCode] = true

	if (keys[17] && keys[71]) {
		show.value = !show.value
	}
}
function onWindowKeyUp({ keyCode }) {
	keys[keyCode] = false
}

onMounted(() => {
	window.addEventListener('keydown', onWindowKeyDown)
	window.addEventListener('keyup', onWindowKeyUp)
})

onUnmounted(() => {
	window.removeEventListener('keydown', onWindowKeyDown)
	window.removeEventListener('keyup', onWindowKeyUp)
})
</script>

<style lang="scss" scoped>
[data-component='grid'] {
	position: fixed;
	width: var(--computed-100vw);
	height: 100vh;
	left: 0;
	top: 0;

	opacity: 0;
	z-index: 999;

	pointer-events: none;

	&[data-show='true'] {
		opacity: 1;
	}

	.col:after {
		content: '';
		position: relative;
		display: block;
		width: 100%;
		height: 100%;

		background-color: rgba(255, 0, 0, 0.25);
		border: 1px solid rgba(255, 0, 0, 0.5);
		border-top: none;
		border-bottom: none;
	}
}
</style>
