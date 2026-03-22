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
	// Initialize curtain as split screen (Top Orange / Bottom Green)
	// IMPORTANT: Preloader rotates 90deg, so Left becoming Top (Orange), Right becoming Bottom (Green)
	// We need to match this.
	
	gsap.set(el.value.querySelector('.top'), {
		scaleY: 1,
		transformOrigin: 'top', 
		backgroundColor: '#FF5800', // Orange (Top)
		height: '50%', // Take up top half
		top: 0,
		position: 'absolute'
	})
	
	gsap.set(el.value.querySelector('.bottom'), {
		scaleY: 1,
		transformOrigin: 'bottom',
		backgroundColor: '#004225', // Green (Bottom)
		height: '50%', // Take up bottom half
		bottom: 0,
		position: 'absolute'
	})

	// Initialize curtain line (Hidden)
	gsap.set(el.value.querySelector('.line'), {
		opacity: 0,
		zIndex: 10,
		position: 'absolute',
		top: '50%',
		marginTop: '-0.5px' // Center vertically
	})
	
	gsap.set(el.value.querySelector('.line .inner'), {
		scaleX: 0, // Start hidden
		backgroundColor: '#FFFFFF', // White Line
		transformOrigin: 'center center'
	})

	// Enter Animation: Slide Down & Shrink -> (Expand to Ribbon Height + Slide Left)
	// 1. Nửa cam trượt xuống giữa màn hình và CO LẠI thành một thanh (10vw)
	enterTl.to(
		el.value.querySelector('.top'),
		{
			top: '50%',
			yPercent: -50,
			height: '10vw', // Giảm xuống 10vw để thanh mảnh và thanh thoát hơn
			ease: 'power3.inOut',
			duration: 0.8,
			force3D: true,
			onStart: () => {
				// Ẩn phần màu xanh bên dưới
				gsap.to(el.value.querySelector('.bottom'), { opacity: 0, duration: 0.3 })
			}
		}
	)

	// 2. ĐỒNG THỜI: GIÃN NỞ ra cao hơn ribbon VÀ trượt sang bên trái
	enterTl.to(
		el.value.querySelector('.top'),
		{
			xPercent: -100,
			height: '12vw', // Tăng chiều cao thanh cam (cao hơn ribbon)
			ease: 'power4.inOut',
			duration: 1.2,
			force3D: true
		},
		'+=0.05' // Nghỉ cực ngắn
	)

	// Keep existing transition logic for page navigation (transitionIn/Out)
	transitionInTl.fromTo(
		el.value.querySelector('.line .inner'),
		{ scaleX: 0 },
		{ scaleX: 1, ease: 'expo.inOut', duration: 1, force3D: true }
	)
	transitionInTl.fromTo(
		el.value.querySelector('.top'),
		{ scaleY: 0 },
		{ scaleY: 1, ease: 'expo.inOut', duration: 1, immediateRender: false, force3D: true },
		0
	)
	transitionInTl.fromTo(
		el.value.querySelector('.bottom'),
		{ scaleY: 0 },
		{ scaleY: 1, ease: 'expo.inOut', duration: 1, immediateRender: false, force3D: true },
		0
	)

	transitionOutTl.fromTo(
		el.value.querySelector('.line .inner'),
		{ scaleX: 1 },
		{ scaleX: 0, ease: 'expo.inOut', duration: 1, force3D: true }
	)
	transitionOutTl.fromTo(
		el.value.querySelector('.top'),
		{ scaleY: 1 },
		{ scaleY: 0, ease: 'expo.inOut', duration: 1, immediateRender: false, force3D: true, onComplete: () => gsap.set(el.value.querySelector('.top'), { clearProps: 'all' }) },
		0
	)
	transitionOutTl.fromTo(
		el.value.querySelector('.bottom'),
		{ scaleY: 1 },
		{ scaleY: 0, ease: 'expo.inOut', duration: 1, immediateRender: false, force3D: true, onComplete: () => gsap.set(el.value.querySelector('.bottom'), { clearProps: 'all' }) },
		0
	)

	// Clean up old hardcoded fade TLs or update them
	transitionInFadeTl.set([el.value.querySelector('.line'), el.value.querySelector('.inner')], {
		backgroundColor: '#FF5800',
		scaleX: 1,
		immediateRender: false,
		opacity: 1,
	})
	transitionInFadeTl.set([el.value.querySelector('.top'), el.value.querySelector('.bottom')], {
		backgroundColor: '#FF5800',
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
	// Giai đoạn 1 (Slide down & Shrink) tốn 0.8s
	// Ta sẽ resolve ở t=0.85s để Slide 1 bắt đầu trượt vào đồng bộ với hành động Giãn nở + Trượt trái
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
		z-index: 10;

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
