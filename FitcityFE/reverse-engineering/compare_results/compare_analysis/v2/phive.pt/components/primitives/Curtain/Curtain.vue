<template>
	<div ref="el" data-component="curtain">
		<span class="top" :data-transition="transitionType" />
		<span class="line"><span class="inner" /></span>
		<span class="bottom" :data-transition="transitionType" />
		<span class="full" :data-state="state" />
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

import { useEmitter } from '~/composables/core'

const props = defineProps({})
const el = ref(null)
const transitionType = ref('') // 'in' or 'out'
const state = ref('')

const enterTl = gsap.timeline({ paused: true })
const transitionInFadeTl = gsap.timeline({ paused: true })
const transitionOutFadeTl = gsap.timeline({ paused: true })
const transitionInTl = gsap.timeline({ paused: true })
const transitionOutTl = gsap.timeline({ paused: true })

const emitter = useEmitter()

const setup = () => {
	enterTl.fromTo(
		el.value.querySelector('.line .inner'),
		{
			scaleX: 0,
		},
		{
			scaleX: 1,
			ease: 'expo.inOut',
			duration: 1,
			onComplete: () => gsap.set(el.value.querySelector('.line'), { opacity: 0 }),
		}
	)
	enterTl.fromTo(
		el.value.querySelector('.top'),
		{
			scaleY: 1,
			transformOrigin: 'top',
		},
		{
			scaleY: 0,
			ease: 'expo.inOut',
			duration: 1,
			onComplete: () => gsap.set(el.value.querySelector('.top'), { clearProps: 'all' }),
		},
		1
	)
	enterTl.fromTo(
		el.value.querySelector('.bottom'),
		{
			scaleY: 1,
			transformOrigin: 'bottom',
		},
		{
			scaleY: 0,
			ease: 'expo.inOut',
			duration: 1,
			onComplete: () => gsap.set(el.value.querySelector('.bottom'), { clearProps: 'all' }),
		},
		1
	)

	transitionInTl.fromTo(
		el.value.querySelector('.line .inner'),
		{
			scaleX: 0,
		},
		{
			scaleX: 1,
			ease: 'expo.inOut',
			duration: 1,
		}
	)
	transitionInTl.fromTo(
		el.value.querySelector('.top'),
		{
			scaleY: 0,
		},
		{
			scaleY: 1,
			ease: 'expo.inOut',
			duration: 1,
			immediateRender: false,
		},
		0
	)
	transitionInTl.fromTo(
		el.value.querySelector('.bottom'),
		{
			scaleY: 0,
		},
		{
			scaleY: 1,
			ease: 'expo.inOut',
			duration: 1,
			immediateRender: false,
		},
		0
	)

	transitionOutTl.fromTo(
		el.value.querySelector('.line .inner'),
		{
			scaleX: 1,
		},
		{
			scaleX: 0,
			ease: 'expo.inOut',
			duration: 1,
		}
	)
	transitionOutTl.fromTo(
		el.value.querySelector('.top'),
		{
			scaleY: 1,
		},
		{
			scaleY: 0,
			ease: 'expo.inOut',
			duration: 1,
			immediateRender: false,
			onComplete: () => gsap.set(el.value.querySelector('.top'), { clearProps: 'all' }),
		},
		0
	)
	transitionOutTl.fromTo(
		el.value.querySelector('.bottom'),
		{
			scaleY: 1,
		},
		{
			scaleY: 0,
			ease: 'expo.inOut',
			duration: 1,
			immediateRender: false,
			onComplete: () => gsap.set(el.value.querySelector('.bottom'), { clearProps: 'all' }),
		},
		0
	)

	transitionInFadeTl.set([el.value.querySelector('.line'), el.value.querySelector('.inner')], {
		backgroundColor: '#161003',
		scaleX: 1,
		immediateRender: false,
		opacity: 1,
	})
	transitionInFadeTl.set([el.value.querySelector('.top'), el.value.querySelector('.bottom')], {
		backgroundColor: '#161003',
		scaleY: 1,
		immediateRender: false,
	})
	transitionInFadeTl.fromTo(el.value, { opacity: 0, zIndex: 9 }, { opacity: 1, duration: 0.5, immediateRender: false })

	transitionOutFadeTl.to(el.value, { opacity: 0, duration: 0.25, immediateRender: false })

	emitter.on('curtain-enter', () => enter())
	emitter.on('curtain-transitionIn', () => transitionIn())
	emitter.on('curtain-transitionOut', () => transitionOut())
}

const enter = () => {
	enterTl.seek(0).play()
	return new Promise((resolve) => setTimeout(() => resolve(), 850))
}

const transitionIn = () => {
	transitionType.value = 'in'
	// state.value = 'active'
	// transitionInFadeTl.seek(0).play()
	// transitionInTl.seek(0).play()
	return new Promise((resolve) => setTimeout(() => resolve(), 900))
}

const transitionOut = () => {
	transitionType.value = 'out'
	// state.value = ''
	// transitionOutFadeTl.seek(0).play()
	// transitionOutTl.seek(0).play()
	return new Promise((resolve) => setTimeout(() => resolve(), 900))
}

onBeforeUnmount(() => {})
onMounted(() => {
	setup()
})

defineExpose({ enter, transitionIn, transitionOut })
</script>

<style lang="scss" scoped>
[data-component='curtain'] {
	position: fixed;
	inset: 0;

	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-direction: column;
	width: 100%;
	height: 100dvh;

	z-index: 999;

	pointer-events: none;

	.top {
		&[data-transition='in'] {
			transform-origin: bottom;
		}
		&[data-transition='out'] {
			transform-origin: top;
		}
	}

	.bottom {
		&[data-transition='in'] {
			transform-origin: top;
		}
		&[data-transition='out'] {
			transform-origin: bottom;
		}
	}

	.top,
	.bottom {
		position: relative;

		flex-grow: 1;
		width: 100%;
		background-color: var(--curtain-backgroundColor, var(--color-yellow));

		transform: scaleY(0);
	}

	.line {
		position: relative;
		width: 100%;
		height: 1px;

		background-color: var(--curtain-backgroundColor, var(--color-yellow));

		.inner {
			position: relative;
			width: 100%;
			height: 100%;

			display: block;
			background-color: var(--curtain-color, var(--color-darkBrown));
			transform: scaleX(0);
		}
	}

	.full {
		position: absolute;
		inset: 0;

		background-color: var(--curtain-color, var(--color-darkBrown));

		opacity: 0;

		&[data-state='active'] {
			opacity: 1;

			transition: opacity 0.25s ease(out-expo);
		}
	}
}
</style>
