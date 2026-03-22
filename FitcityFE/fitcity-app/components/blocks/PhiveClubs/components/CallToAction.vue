<template>
	<div ref="el" data-component="call-to-action">
		<div class="title-container">
			<RollingTitle :label="title" :trigger-element="parentElement" :repeat="2" class="-title-1 -uppercase title" />
			<p v-if="subtitle" ref="subtitleEl" class="-manuscript-3 subtitle">{{ subtitle }}</p>
		</div>

		<div v-if="ctaList" class="ctas-list-container">
			<ButtonRoundVariable v-for="(item, i) in ctaList" :key="i" v-bind="item" :type="i % 2 === 0 ? 'primary' : 'secondary'" class="btn" />
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

import { RollingTitle } from '~/components/primitives'
import ButtonRoundVariable from '~/components/primitives/ButtonRoundVariable/ButtonRoundVariable.vue'

import { useTypeWrite } from '~/composables/useTypeWrite'

const props = defineProps({
	title: { type: String, default: '' },
	subtitle: { type: String, default: '' },
	ctaList: { type: [Boolean, Array], default: false },
	parentElement: { type: Object, default: null },
})

const el = ref(null)
// const titleEl = ref(null)
const subtitleEl = ref(null)
const context = inject('pageContext')
let animationCtx
let ctasTimeline = gsap.timeline({ paused: true })

const { animateChars } = useTypeWrite({
	element: subtitleEl,
	types: 'chars',
	paused: true,
})

const setup = () => {
	animationCtx = gsap.context(() => {
		ctasTimeline.from(el.value.querySelectorAll('.btn'), { autoAlpha: 0, y: 20, stagger: 0.1 })
	})
}
const init = () => {}
const kill = () => {
	animationCtx?.revert()
}

const enterAnimation = () => {
	animateChars()
}

const setTimeline = (progress) => ctasTimeline.progress(progress)

onBeforeUnmount(() => kill())
onMounted(() => {
	context.$page.loader.ready.then(() => setup())
})

defineExpose({ enterAnimation, setTimeline })
</script>

<style lang="scss" scoped>
[data-component='call-to-action'] {
	position: relative;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: rs(24);
	height: 100%;
	width: 100%;

	.title-container {
		position: relative;
		padding-top: rs(54);

		display: grid;
		justify-content: center;
		align-items: center;
		width: 100%;
		overflow: hidden;
	}

	.ctas-list-container {
		position: relative;

		display: flex;
		gap: rs(12);
		margin-top: rs(40); // Move button down
	}

	.title {
		grid-row: 1;
		grid-column: 1;
		z-index: 1;

		font-weight: 400; // Thinner
		transform: scale(0.75, 1.8); // Narrower width, Even Taller height
		transform-origin: center;
		white-space: nowrap;
		letter-spacing: -0.05em; // Reduce gap between letters
	}

	.subtitle {
		position: relative;
		text-align: center;

		color: var(--color-white);
		display: inline-block;
		transform: rotate(-6deg);
		grid-row: 1;
		grid-column: 1;

		opacity: 0.9;
		z-index: 2;
		pointer-events: none;
		opacity: 0.9;
		z-index: 2;
		pointer-events: none;
		scale: 1.5 2.2; // Taller
		white-space: nowrap;
		text-transform: uppercase;
		font-weight: 700; // Bold
	}
}
</style>
