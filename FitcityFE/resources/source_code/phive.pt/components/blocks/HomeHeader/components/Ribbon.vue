<template>
	<div ref="el" data-component="ribbon" class="paused">
		<div v-for="index in 3" :key="index" class="ribbon-inner" :style="`--loop-duration:${loopDuration}s`">
			<div class="full-container container">
				<h2 class="-uppercase title">
					<span class="-title-1 first">{{ title }}</span>
					<span class="-title-1 last">{{ title }}</span>
				</h2>

				<div v-if="mainCta || subtitle" class="ctas-container">
					<div class="top">
						<h3 class="-callout -uppercase subtitle">{{ subtitle }}</h3>
					</div>
					<div class="bottom">
						<span v-if="mainCta">
							<ContentButton v-bind="mainCta" @mouseenter="pauseFunc" @mouseleave="playFunc" />
						</span>
					</div>
				</div>
			</div>

			<div class="half-container top-half container">
				<h2 class="-uppercase title">
					<span class="-title-1 first">{{ title }}</span>
					<span class="-title-1 last">{{ title }}</span>
				</h2>

				<div v-if="mainCta || subtitle" class="ctas-container">
					<div class="top">
						<h3 class="-callout -uppercase subtitle">{{ subtitle }}</h3>
					</div>
					<div class="bottom">
						<span v-if="mainCta">
							<ContentButton v-bind="mainCta" @mouseenter="pauseFunc" @mouseleave="playFunc" />
						</span>
					</div>
				</div>
			</div>

			<div class="half-container bottom-half container">
				<h2 class="-uppercase title">
					<span class="-title-1 first">{{ title }}</span>
					<span class="-title-1 last">{{ title }}</span>
				</h2>

				<div v-if="mainCta || subtitle" class="ctas-container">
					<div class="top">
						<h3 class="-callout -uppercase subtitle">{{ subtitle }}</h3>
					</div>
					<div class="bottom">
						<span v-if="mainCta">
							<ContentButton v-bind="mainCta" @mouseenter="pauseFunc" @mouseleave="playFunc" />
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap, SplitText } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText)

import { ContentButton } from '~/components/primitives'
import { breakpoints } from '~/config'
import { useFirstLoad } from '~/composables/core'

import { useScreen } from 'vue-screen'

const props = defineProps({
	title: { type: String, default: '' },
	subtitle: { type: String, default: '' },
	mainCta: { type: [Boolean, Object], default: false },
	playFunc: { type: Function, default: () => {} },
	pauseFunc: { type: Function, default: () => {} },
})

const el = ref(null)
const context = inject('pageContext')
const openCloseTl = gsap.timeline({ paused: true })
const typeTl = gsap.timeline({ paused: true, repeat: -1, yoyo: true })
const ribbonTl = gsap.timeline({ paused: true, repeat: -1 })
const enterNextTl = gsap.timeline({ paused: true })
const loopDuration = ref(10)

const screen = useScreen()
const timeScaleValue = { x: 0 }
const { firstLoad } = useFirstLoad()

const topOffset = ref(0)
const bottomOffset = ref(0)

watch(screen, (newVal) => {
	setup()

	const time = openCloseTl.time()
	openCloseTl.invalidate().restart().seek(time)
	setLoopDuration(newVal)
})

const setup = () => {
	const top = el.value.querySelectorAll('.top-half')
	const bottom = el.value.querySelectorAll('.bottom-half')

	gsap.set([top, bottom], { clearProps: 'all' })
	topOffset.value = -top[0].getBoundingClientRect().top
	bottomOffset.value = bottom[0].getBoundingClientRect().bottom - bottom[0].getBoundingClientRect().height
}
const init = () => {
	setTimeout(() => {
		setup()
		setLoopDuration()
		setupTimelines()
	}, 10)
}
const kill = () => {}

const setLoopDuration = (newVal) => (loopDuration.value = newVal <= breakpoints.xxlarge ? 12 : 20)
const open = () => {
	return openCloseTl.play()
}

const close = () => {
	return openCloseTl.reverse()
}

const setupTimelines = () => {
	const top = el.value.querySelectorAll('.top-half')
	const bottom = el.value.querySelectorAll('.bottom-half')
	const titles = el.value.querySelectorAll('.title')

	if (screen.width > breakpoints.small) {
		titles.forEach((elem) => {
			const titleFirst = elem.querySelector('.title .first')
			const titleLast = elem.querySelector('.title .last')
			const splitTitleFirst = new SplitText(titleFirst, { type: 'chars', charsClass: 'char', tag: 'span' })
			const splitTitleLast = new SplitText(titleLast, { type: 'chars', charsClass: 'char', tag: 'span' })

			nextTick(() => {
				typeTl.fromTo(
					splitTitleFirst.chars,
					{
						scaleY: 1,
						transformOrigin: 'bottom',
					},
					{
						scaleY: 0,
						stagger: 0.1,
						ease: 'expo.inOut',
						duration: 2,
					},
					0,
				)
				typeTl.fromTo(
					splitTitleLast.chars,
					{
						scaleY: 0,
						transformOrigin: 'top',
					},
					{
						scaleY: 1,
						stagger: 0.1,
						ease: 'expo.inOut',
						duration: 2,
					},
					0,
				)
			})
		})
	}

	ribbonTl.fromTo(
		el.value.querySelectorAll('.ribbon-inner'),
		{
			xPercent: 0,
		},
		{
			xPercent: -100,
			duration: 12,
			ease: 'linear',
		},
	)

	openCloseTl.to(
		top,
		{
			y: () => topOffset.value,
			ease: 'expo.inOut',
			duration: 1,
		},
		0,
	)
	openCloseTl.to(
		bottom,
		{
			y: () => bottomOffset.value,
			ease: 'expo.inOut',
			duration: 1,
			onStart: () => {
				el.value.classList.add('splitted')
			},
		},
		0,
	)

	enterNextTl.fromTo(
		top,
		{
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
		},
		{
			clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%',
			ease: 'expo.inOut',
			duration: 1,
			immediateRender: false,
		},
		0,
	)

	enterNextTl.fromTo(
		bottom,
		{
			clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
		},
		{
			clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)',
			ease: 'expo.inOut',
			duration: 1,
			immediateRender: false,
		},
		0,
	)
	enterNextTl.to([top, bottom], { clearProps: 'all' })
}

const enterAnimation = () => {
	let delayTime = 0
	if (firstLoad.value) {
		delayTime = 0.55
		firstLoad.value = false
	} else {
	}

	return new Promise((resolve) => {
		gsap.fromTo(
			el.value,
			{
				clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
				autoAlpha: 1,
			},
			{
				clipPath: 'polygon(0 30%, 100% 30%, 100% 70%, 0 70%)',
				ease: 'power4.out',
				duration: 0.75,
				delay: delayTime,
				onStart: () => resolve(),
				onComplete: () => gsap.set(el.value, { clearProps: 'clipPath' }),
			},
		)

		gsap.fromTo(
			el.value.querySelectorAll('.container'),
			{
				xPercent: 45,
				clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
				scale: 1.4,
				opacity: 1,
			},
			{
				xPercent: 0,
				clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
				scale: 1,
				ease: 'power4.out',
				duration: 0.75,
				delay: delayTime,
				onComplete: () => gsap.set(el.value.querySelectorAll('.container'), { clearProps: 'clipPath, scale, opacity' }),
			},
		)
	})
}

const enterNext = (progress) => {
	openCloseTl.progress(progress).reverse()
	enterNextTl.seek(0).play()
	typeTl.seek(0).play()
	ribbonTl.seek(0).play()

	el.value.classList.remove('paused')
}

const cleanup = () => {
	openCloseTl.seek(0).pause()
	enterNextTl.seek(0).pause()
	typeTl.seek(0).pause()
	ribbonTl.seek(0).pause()

	el.value.classList.add('paused')
	el.value.classList.remove('active')
}

const enter = () => enterAnimation()
const start = () => {
	el.value.classList.remove('paused')
	el.value.classList.add('active')
	typeTl.play()
	ribbonTl.play()
}

const stop = () => {
	typeTl.pause()
	typeTl.progress(0)

	ribbonTl.pause()
	ribbonTl.progress(0)
}

const pause = () => {
	gsap.killTweensOf(timeScaleValue)
	gsap.to(timeScaleValue, {
		x: 0,
		duration: 2,
		ease: 'expo.out',
		onUpdate: () => {
			// typeTl.timeScale(timeScaleValue.x)
			ribbonTl.timeScale(timeScaleValue.x)
		},
		onComplete: () => {
			el.value?.classList.add('paused')
			// typeTl.pause()
			ribbonTl.pause()
		},
	})
}
const play = () => {
	gsap.killTweensOf(timeScaleValue)
	gsap.to(timeScaleValue, {
		x: 1,
		duration: 2,
		ease: 'expo.out',
		onUpdate: () => {
			typeTl.timeScale(timeScaleValue.x)
			ribbonTl.timeScale(timeScaleValue.x)
		},
		onComplete: () => el.value?.classList.remove('paused'),
		onStart: () => {
			ribbonTl.play()
			typeTl.play()
		},
	})
}

onBeforeUnmount(() => kill())
onMounted(() => {
	context.$page.loader.ready.then(() => init())
})

defineExpose({ enter, open, close, start, stop, play, pause, enterNext, cleanup, openCloseTl })
</script>

<style lang="scss" scoped>
[data-component='ribbon'] {
	position: relative;

	display: flex;
	align-items: center;
	justify-content: flex-start;
	width: 100%;
	height: 100%;
	overflow: hidden;

	color: var(--color-darkBrown);

	pointer-events: none;

	opacity: 0;
	visibility: hidden;

	overflow: hidden;

	&.active {
		opacity: 1;
		visibility: visible;
	}

	&.paused {
		.ribbon-inner {
			animation-play-state: paused;
		}
	}

	&.splitted {
		pointer-events: none;

		.full-container {
			opacity: 0;
			visibility: hidden;
		}

		.ribbon-inner {
			background-color: transparent;
		}
	}

	.ribbon-inner {
		display: grid;
		align-items: center;
		justify-content: center;
		width: max-content;

		white-space: nowrap;

		background-color: var(--ribbon-backgroundColor, var(--color-yellow));

		// animation-name: loop;
		// animation-iteration-count: infinite;
		// animation-play-state: playing;
		// animation-duration: var(--loop-duration, 10s);
		// animation-timing-function: linear;

		// @keyframes loop {
		// 	0% {
		// 		transform: translate3d(0%, 0, 0);
		// 	}
		// 	100% {
		// 		transform: translate3d(-100%, 0, 0);
		// 	}
		// }

		&:last-child {
			margin-left: -1px;
		}
	}

	.container {
		position: relative;
		padding-right: rs(110);

		grid-row: 1;
		grid-column: 1;

		display: flex;
		gap: rs(110);

		background-color: var(--ribbon-backgroundColor, var(--color-yellow));

		&.full-container {
			z-index: 2;

			// display: none;
		}

		&.half-container {
			margin: 0;
			float: none;

			&:nth-child(2) {
				clip-path: polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%);
			}

			&:nth-child(3) {
				clip-path: polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%);
			}
		}

		.ctas-container {
			pointer-events: visible;
		}
	}

	.title {
		display: grid;

		.first,
		.last {
			grid-row: 1;
			grid-column: 1;
		}

		:deep(.char) {
			position: relative;
			display: inline-block !important;
		}

		@include split_text_inherit();
	}

	.ctas-container {
		--contentButton-backgroundColor: var(--ribbon-backgroundColor);

		display: flex;
		flex-direction: column;

		.top,
		.bottom {
			flex: 0 0 50%;

			display: flex;
			align-items: center;
			justify-content: center;
		}

		.subtitle {
			font-size: rs(30);
			white-space: pre-line;
			text-align: center;
		}
	}
}
</style>
