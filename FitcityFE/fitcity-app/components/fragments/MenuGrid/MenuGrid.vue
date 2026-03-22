<template>
	<div ref="el" data-component="menu-grid" :data-theme="colorTheme" data-element-intersect :data-open="isOpen">
		<span class="background" @click="openClose" />
		<div class="container">
			<div class="menu-inner">
				<div class="items-container">
					<Items ref="menuItems" :items="items" :clubs="clubs" :menu-cta="menuCta" :open-close-fn="openClose" class="items" />
				</div>

				<div class="bar-container">
					<Bar ref="bar" class="bar" :open-close-fn="openCloseItems" data-element-target-intersect />
					<Anchors ref="anchors" class="anchors" />
				</div>
			</div>

			<div class="button-cta-container">
				<Cta :button-cta="buttonCta" class="btn" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import Bar from './components/Bar.vue'
import Items from './components/Items.vue'
import Anchors from './components/Anchors.vue'
import Cta from './components/Cta.vue'

import { getActiveContext } from '~/components/core'
import { breakpoints } from '~/config'
import { useMenu } from './useMenu'
import { useScreen } from 'vue-screen'

const props = defineProps({
	menuCta: { type: [Boolean, Object], default: false },
	items: { type: Array, default: () => [] },
	clubs: { type: Array, default: () => [] },

	// Controls
	theme: { type: String, default: 'dark' },
})

const { getMenuTheme, getButtonCTA, setRefreshAnchors, setMenuTheme, setButtonCTA } = useMenu()

setMenuTheme(props.theme)
setButtonCTA(props.menuCta)


const el = ref(null)
const colorTheme = getMenuTheme()
const bar = ref(null)
const anchors = ref(null)
const menuItems = ref(null)
const hideTl = gsap.timeline({ paused: true })
const isOpen = ref(false)
const scroller = inject('$scroller')
const buttonCta = getButtonCTA()
const screen = useScreen()

const hideCtaTl = gsap.timeline({ paused: true })
const mm = gsap.matchMedia()

watch(screen, () => anchors.value?.resize())

const openClose = () => {
	bar.value.openClose()
}
const openCloseItems = () => {
	isOpen.value = menuItems.value.openClose()
	isOpen.value ? scroller.value.stop() : scroller.value.start()
}

const handleKey = (e) => {
	if (e.key === 'Escape') {
		isOpen.value && openClose()
	}
}

const setup = () => {
	window.addEventListener('keydown', handleKey)
	setRefreshAnchors(anchors.value.refreshAnchors)

	gsap.set(el.value.querySelector('.bar-container'), {
		transformOrigin: 'bottom',
		rotationX: 120,
	})
}

const init = () => {
	gsap.to(el.value.querySelector('.bar-container'), {
		y: 0,
		rotationX: 0,
		duration: 1.2,
		ease: 'expo.out',
		delay: 0.2,
	})

	mm.add(`(max-width: ${breakpoints.small}px)`, () => {
		hideCtaTl.fromTo(
			el.value.querySelector('.button-cta-container'),
			{
				y: 0,
			},
			{
				y: 100,
				duration: 2,
				ease: 'power4.inOut',
			}
		)

		return () => {
			gsap.killTweensOf(el.value.querySelector('.button-cta-container'))
			hideCtaTl.kill()
		}
	})

	mm.add(`(min-width: ${breakpoints.small + 1}px)`, () => {
		hideCtaTl.fromTo(
			el.value.querySelector('.button-cta-container'),
			{
				xPercent: 0,
			},
			{
				xPercent: 120,
				duration: 2,
				ease: 'power4.inOut',
			}
		)

		return () => {
			gsap.killTweensOf(el.value.querySelector('.button-cta-container'))
			hideCtaTl.kill()
		}
	})

	scroller.value?.getScrollerInstance().value.on('scroll', handleScroll)
}

const handleScroll = ({ scroll, direction }) => {
	if (direction === 1) {
		hideCtaTl.play()
	} else if (scroll <= 100) {
		hideCtaTl.reverse()
	}
}

const kill = () => {
	scroller.value?.getScrollerInstance().value.off('scroll', handleScroll)
	window.removeEventListener('keydown', handleKey)
}

const setHide = (progress) => hideTl.progress(progress)

onBeforeUnmount(() => kill())
onMounted(() => {
	const context = getActiveContext()
	console.log('[MenuGrid] onMounted - Context:', context ? 'found' : 'not found')
	
	if (!context) {
		console.warn('[MenuGrid] No active context found on mount, running setup/init immediately')
		setup()
		init()
		return
	}

	context.loader.loaded.then(() => {
		console.log('[MenuGrid] Loader: loaded')
		setup()
	})
	context.loader.ready.then(() => {
		console.log('[MenuGrid] Loader: ready')
		init()
	})
})

defineExpose({ setHide })
</script>

<style lang="scss" scoped>
[data-component='menu-grid'] {
	&[data-theme='light'] {
		--menu-color: var(--color-darkBrown);
		--menu-secondaryBackgroundColor: var(--color-lightYellow);
		--menu-backgroundColor: var(--color-yellow);
		--icon-color: var(--color-darkBrown);
		--burger-color: var(--color-darkBrown);

		--buttonVariable-accentColor: var(--color-lightYellow);
		--buttonVariable-color: var(--color-yellow);
		--buttonVariable-backgroundColor: var(--color-darkBrown);
	}
	&[data-theme='stream'] {
		--menu-color: var(--color-darkBrown);
		--menu-secondaryBackgroundColor: var(--color-warmGrey);
		--menu-backgroundColor: var(--color-stream);
		--icon-color: var(--color-darkBrown);
		--burger-color: var(--color-darkBrown);

		--buttonVariable-accentColor: var(--color-warmGrey);
		--buttonVariable-color: var(--color-stream);
		--buttonVariable-backgroundColor: var(--color-darkBrown);
	}
	&[data-theme='pilates'] {
		--menu-color: var(--color-darkBrown);
		--menu-secondaryBackgroundColor: var(--color-warmGrey);
		--menu-backgroundColor: var(--color-pilates);
		--icon-color: var(--color-darkBrown);
		--burger-color: var(--color-darkBrown);

		--buttonVariable-accentColor: var(--color-warmGrey);
		--buttonVariable-color: var(--color-pilates);
		--buttonVariable-backgroundColor: var(--color-darkBrown);
	}
	&[data-theme='nutrition'] {
		--menu-color: var(--color-darkBrown);
		--menu-secondaryBackgroundColor: var(--color-warmGrey);
		--menu-backgroundColor: var(--color-nutrition);
		--icon-color: var(--color-darkBrown);
		--burger-color: var(--color-darkBrown);

		--buttonVariable-accentColor: var(--color-warmGrey);
		--buttonVariable-color: var(--color-nutrition);
		--buttonVariable-backgroundColor: var(--color-darkBrown);
	}
	&[data-theme='subduedYellow'] {
		--menu-color: var(--color-darkBrown);
		--menu-secondaryBackgroundColor: var(--color-warmGrey);
		--menu-backgroundColor: var(--color-subduedYellow);
		--icon-color: var(--color-darkBrown);
		--burger-color: var(--color-darkBrown);

		--buttonVariable-accentColor: var(--color-warmGrey);
		--buttonVariable-color: var(--color-subduedYellow);
		--buttonVariable-backgroundColor: var(--color-darkBrown);
	}

	&[data-theme='dark'] {
		--menu-color: #FF5800; /* Orange text */
		--menu-secondaryBackgroundColor: #1a1a1a;
		--menu-backgroundColor: #000000; /* Black bar for Slide 1 */
		--icon-color: #FF5800;
		--burger-color: #FF5800;

		--buttonVariable-accentColor: #1a1a1a;
		--buttonVariable-color: #000000;
		--buttonVariable-backgroundColor: #FF5800;
	}
	&[data-theme='dark-stream'] {
		--menu-color: #C4D600; /* Lime text */
		--menu-secondaryBackgroundColor: #00361e;
		--menu-backgroundColor: #004225; /* Deep Green bar for Slide 2 */
		--icon-color: #C4D600;
		--burger-color: #C4D600;

		--buttonVariable-accentColor: #00361e;
		--buttonVariable-color: #004225;
		--buttonVariable-backgroundColor: #C4D600;
	}
	&[data-theme='dark-pilates'] {
		--menu-color: #D9E1E2; /* White text */
		--menu-secondaryBackgroundColor: #e65000;
		--menu-backgroundColor: #FF5800; /* Orange bar for Slide 3 */
		--icon-color: #D9E1E2;
		--burger-color: #D9E1E2;

		--buttonVariable-accentColor: #e65000;
		--buttonVariable-color: #FF5800;
		--buttonVariable-backgroundColor: #D9E1E2;
	}
	&[data-theme='dark-nutrition'] {
		--menu-color: var(--color-nutrition);
		--menu-secondaryBackgroundColor: #1a1a1a;
		--menu-backgroundColor: #000000;
		--icon-color: var(--color-nutrition);
		--burger-color: var(--color-nutrition);

		--buttonVariable-accentColor: #1a1a1a;
		--buttonVariable-color: #000000;
		--buttonVariable-backgroundColor: var(--color-nutrition);
	}
	&[data-theme='dark-subduedYellow'] {
		--menu-color: var(--color-subduedYellow);
		--menu-secondaryBackgroundColor: #1a1a1a;
		--menu-backgroundColor: #000000;
		--icon-color: var(--color-subduedYellow);
		--burger-color: var(--color-subduedYellow);

		--buttonVariable-accentColor: #1a1a1a;
		--buttonVariable-color: #000000;
		--buttonVariable-backgroundColor: var(--color-subduedYellow);
	}

	&[data-theme='bold-orange'] {
		--menu-color: #FF5800; /* Orange Text */
		--menu-secondaryBackgroundColor: #00361e;
		--menu-backgroundColor: #004225; /* Deep Green Background */
		--icon-color: #FF5800;
		--burger-color: #FF5800;

		--buttonVariable-accentColor: #00361e;
		--buttonVariable-color: #004225;
		--buttonVariable-backgroundColor: #FF5800;
	}

	--menu-width: 326px;
	@include max-screen($small) {
		--menu-width: 100%;
	}



position: fixed;
	bottom: 0;
	left: 0;

	display: flex;
	justify-content: center;
	align-items: flex-end;
	width: 100svw;
	height: 100dvh;

	color: var(--menu-color);

	pointer-events: none;

	z-index: 11;

	overflow: hidden;


	&[data-open='true'] {
		.background {
			opacity: 1;
			pointer-events: visible;
		}
	}

	.container {
		position: relative;
		bottom: 16px; 

		display: flex;
		justify-content: center;
		align-items: flex-end;
		width: 100dvw;
		height: calc(100vh - 16px); 

		overflow: hidden;
	}

	.background {
		position: absolute;
		inset: 0;

		display: block;
		background-color: rgba(from var(--color-darkBrown) r g b / 0.8);
		transition: opacity 1s ease(out-expo);

		opacity: 0;
		pointer-events: none;
		cursor: pointer;
	}

	.button-cta-container {
		position: absolute;
		bottom: 0;
		right: rs(16, 16);

		z-index: 1;

		@include max-screen($small) {
			bottom: rs(90, 60);
			left: calc(calc(100vw - 325px) / 2);
			right: initial;
			width: rs(325, 325);

			.btn {
				height: rs(54, 48);
				width: 100%;

				:deep(.label-container) {
					width: 100%;
				}
			}
		}

		.btn {
			pointer-events: visible;
		}
	}

	.menu-inner {
		position: relative;

		display: flex;
		flex-direction: column;
		perspective: 1000px;

		z-index: 2;

		.items-container {
			position: relative;

			display: grid;
			align-items: start;
			justify-items: start;

			perspective: 1000px;

			.items {
				position: relative;
				grid-row: 1;
				grid-column: 1;
			}
		}

		.bar-container {
			display: flex;
			backface-visibility: hidden;
		}

		.bar {
			position: relative;
			z-index: 1;
			flex: 1;
			width: var(--menu-width);

			pointer-events: visible;
		}
	}

	.anchors {
		@include max-screen($medium) {
			display: none;
		}
	}
}
</style>
