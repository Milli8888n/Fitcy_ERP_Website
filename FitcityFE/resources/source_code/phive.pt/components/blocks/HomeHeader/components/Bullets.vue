<template>
	<ul ref="el" data-component="bullets">
		<li v-for="(_, i) in slidesNumber" :key="i" :data-index="i" class="bullet" @click="handleClick">
			<span class="progress" />
		</li>
	</ul>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
	slidesNumber: { type: Number, default: 0 },
	openFunc: { type: Function, default: () => {} },
	closeFunc: { type: Function, default: () => {} },
	clickFunc: { type: Function, default: () => {} },
})

const el = ref(null)
const context = inject('pageContext')
const startTls = []
const stopTls = []
const SLIDE_DURATION = 10000
let activeType = 'start'
let canClick = true

const setup = () => {
	startAnimations()
	stopAnimations()
}
const init = () => {}
const kill = () => {}

const handleClick = (e) => {
	if (!canClick) return
	canClick = false
	setTimeout(() => {
		canClick = true
	}, 1000)

	const index = Number(e.target.closest('.bullet').dataset.index)
	props.clickFunc(index)
}

const enter = () => enterAnimation()

const start = (slide) => {
	activeType = 'start'
	startTls[slide].restart()
}

const stop = (slide) => {
	activeType = 'stop'
	startTls[slide].pause()
	stopTls[slide].restart()
}

const play = (slide) => {
	activeType === 'start' ? startTls[slide].play() : stopTls[slide].play()
}

const pause = (slide) => {
	activeType === 'start' ? startTls[slide].pause() : stopTls[slide].pause()
}

const startAnimations = () => {
	const progressBars = el.value.querySelectorAll('.progress')

	progressBars.forEach((elem) => {
		const tl = gsap.timeline({ paused: true })

		tl.set(elem, { clearProps: 'all' }, 0)
		tl.add(() => {
			handleInactiveBullets('none')
		})
		tl.add(() => {
			props.openFunc()
		}, SLIDE_DURATION / 4000)
		tl.add(() => {
			handleInactiveBullets('visible')
		}, SLIDE_DURATION / 4000 + 1)
		tl.fromTo(
			elem,
			{
				transformOrigin: 'left',
				scaleX: 0,
			},
			{
				scaleX: 1,
				duration: SLIDE_DURATION / 1000,
				ease: 'none',
			},
			0
		)
		tl.add(() => {
			props.closeFunc()
			handleInactiveBullets('none')
		})

		startTls.push(tl)
	})
}

const stopAnimations = () => {
	const progressBars = el.value.querySelectorAll('.progress')

	progressBars.forEach((elem) => {
		const tl = gsap.timeline({ paused: true })

		tl.set(elem, { clearProps: 'all' }, 0)
		tl.fromTo(
			elem,
			{
				transformOrigin: 'right',
			},
			{
				scaleX: 0,
				duration: 0.5,
				ease: 'power4.out',
			},
			0
		)

		stopTls.push(tl)
	})
}

const enterAnimation = () => {
	return new Promise((resolve) => {
		gsap.fromTo(
			el.value,
			{
				autoAlpha: 0,
				y: 20,
			},
			{
				autoAlpha: 1,
				y: 0,
				ease: 'power4.out',
				duration: 2,
				onComplete: () => resolve(),
			}
		)
	})
}

const handleInactiveBullets = (type) => gsap.set(el.value.querySelectorAll('.bullet'), { pointerEvents: type })

onBeforeUnmount(() => {
	stopTls.forEach((el) => el.kill())
	startTls.forEach((el) => el.kill())
})
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})

defineExpose({ enter, start, stop, play, pause })
</script>

<style lang="scss" scoped>
[data-component='bullets'] {
	position: relative;

	display: flex;
	gap: rs(12);

	opacity: 0;
	visibility: hidden;

	.bullet {
		position: relative;

		display: block;
		width: rs(80);
		height: rs(2);

		background-color: rgb(from var(--color-white) r g b / 0.4);

		@include extend_hitbox(20);
		cursor: pointer;
		pointer-events: visible;

		.progress {
			position: relative;

			display: block;
			width: 100%;
			height: 100%;

			background-color: var(--color-white);

			transform: scale(0, 1);
			transform-origin: left;
		}
	}
}
</style>
