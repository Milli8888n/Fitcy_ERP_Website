<template>
	<div ref="el" data-component="home-header" :data-section-intersect="menuTheme" :data-section-intersect-mobile="menuThemeMobile">
		<div class="backgrounds-container">
			<Background v-for="(item, i) in highlights" :key="i" ref="backgrounds" :media="item.background" :content-media="item.contentBackground" :class="`background module`" :priority="i === 0" />
		</div>

		<div class="ribbons-container">
			<Ribbon
				v-for="(item, i) in highlights"
				:key="i"
				ref="ribbons"
				:title="item.title"
				:subtitle="item.subtitle"
				:main-cta="item.mainCta"
				:class="`ribbon module`"
				:play-func="play"
				:pause-func="pause"
			/>
		</div>

		<div class="contents-container">
			<Content v-for="(item, i) in highlights" :key="i" ref="contents" :blocks="item.richText" :club="item.club" :class="`content module`" :play-func="playContent" :pause-func="pauseContent" />
		</div>

		<div class="bullets-container">
			<Bullets ref="bullets" :slides-number="highlights.length" :open-func="open" :close-func="close" :click-func="changeSlide" />
		</div>

		<audio src="https://burospaces1.fra1.cdn.digitaloceanspaces.com/phive/2025-06-13T10-08-55.387Z-phive-clubs.mp3" />
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

import { useEmitter, useInViewport } from '~/composables/core'
import { imgLoaded, videoLoaded } from '~/utils/dom'

import Ribbon from './components/Ribbon.vue'
import Background from './components/Background.vue'
import Content from './components/Content.vue'
import Bullets from './components/Bullets.vue'

import { breakpoints } from '~/config'
import { useMenu } from '~/components/fragments/MenuGrid/useMenu'

const props = defineProps({
	highlights: { type: Array, default: () => [] },
})

const emitter = useEmitter()
const el = ref(null)
const ribbons = ref([])
const backgrounds = ref([])
const contents = ref([])
const bullets = ref(null)
const context = inject('pageContext')

const activeSlide = ref(0)
const { viewport } = useInViewport(el)
import { useScreen } from 'vue-screen'
const { setButtonCTA, setMenuTheme } = useMenu()
setButtonCTA(false)

const screen = useScreen()
const scroller = inject('$scroller')

const menuTheme = ref('dark')
const menuThemeMobile = ref('light')

const highlightsTest = computed(() => props.highlights.slice(0, 1))

const setup = () => {
	emitter.on('homeHeader-play', play)
	emitter.on('homeHeader-pause', pause)

	window.addEventListener('blur', pause)
	window.addEventListener('focus', play)
	watch(viewport, (value) => (value.inViewport ? play() : pause()))
}
const initRibbon = () => {
	const activeRibbon = ribbons.value[activeSlide.value]
	activeRibbon.enter().then(() => activeRibbon.start())
}

const init = () => {
	const activeContent = contents.value[activeSlide.value]
	const activeBackground = backgrounds.value[activeSlide.value]

	activeBackground.start()
	activeBackground.enter()
	activeContent.start()

	bullets.value.enter().then(() => {
		bullets.value.start(activeSlide.value)
	})
}
const kill = () => {
	window.removeEventListener('blur', pause)
	window.removeEventListener('focus', play)

	emitter.off('homeHeader-play', play)
	emitter.off('homeHeader-pause', pause)
}

const play = () => {
	const activeRibbon = ribbons.value[activeSlide.value]
	const activeBackground = backgrounds.value[activeSlide.value]

	if (activeRibbon) {
		activeBackground.play()
		activeRibbon.play()
		bullets.value.play(activeSlide.value)
	}
}

const pause = () => {
	const activeRibbon = ribbons.value[activeSlide.value]
	const activeBackground = backgrounds.value[activeSlide.value]

	if (activeRibbon) {
		activeBackground.pause()
		activeRibbon.pause()
		bullets.value.pause(activeSlide.value)
	}
}

const playContent = () => {
	const activeRibbon = ribbons.value[activeSlide.value]

	activeRibbon.play()
	bullets.value.play(activeSlide.value)
}

const pauseContent = () => {
	const activeRibbon = ribbons.value[activeSlide.value]

	activeRibbon.pause()
	bullets.value.pause(activeSlide.value)
}

const open = () => {
	const activeRibbon = ribbons.value[activeSlide.value]
	const activeBackground = backgrounds.value[activeSlide.value]
	const activeContent = contents.value[activeSlide.value]

	activeContent.open()
	activeBackground.open()
	activeRibbon.open()
}

const close = (slide = null) => {
	const activeBackground = backgrounds.value[activeSlide.value]
	const activeRibbon = ribbons.value[activeSlide.value]
	const activeContent = contents.value[activeSlide.value]
	let nextSlide

	if (slide !== null) {
		nextSlide = slide
	} else {
		nextSlide = activeSlide.value + 1 === props.highlights.length ? 0 : activeSlide.value + 1
	}

	const nextBackground = backgrounds.value[nextSlide]
	const nextRibbon = ribbons.value[nextSlide]
	const nextContent = contents.value[nextSlide]

	activeContent.close()
	activeBackground.close(activeRibbon.openCloseTl.progress())

	activeRibbon.close().then(() => {
		bullets.value.stop(activeSlide.value)
		activeRibbon.cleanup()
		activeBackground.cleanup()
		activeContent.cleanup()

		activeSlide.value = nextSlide

		gsap.set([el.value.querySelectorAll('.module')], { clearProps: 'all' })
		startSlider()
	})

	nextTick(() => {
		setTimeout(() => {
			nextRibbon.enterNext(activeRibbon.openCloseTl.progress())
			changeSlideAnimation(nextSlide)
			nextBackground.enterNext()
		}, 10)
	})
}

const changeSlideAnimation = (nextSlide) => {
	changeMenuTheme(nextSlide)

	gsap.set(el.value.querySelectorAll('.background')[activeSlide.value], {
		zIndex: 99,
	})

	gsap.set(el.value.querySelectorAll('.ribbon')[nextSlide], {
		zIndex: 99,
		autoAlpha: 1,
	})

	gsap.set(el.value.querySelectorAll('.module')[nextSlide], {
		autoAlpha: 1,
	})
}

const changeMenuTheme = (nextSlide) => {
	if (scroller.value?.getScrollerInstance().value.targetScroll > 0) return

	const themeIndex = (nextSlide % 5) + 1
	let theme
	switch (themeIndex) {
		case 1:
			theme = screen.width <= breakpoints.small ? 'light' : 'dark'
			setMenuTheme(theme)
			menuTheme.value = 'dark'
			menuThemeMobile.value = 'light'
			break
		case 2:
			theme = screen.width <= breakpoints.small ? 'stream' : 'dark-stream'
			setMenuTheme(theme)
			menuTheme.value = 'dark-stream'
			menuThemeMobile.value = 'stream'
			break
		case 3:
			theme = screen.width <= breakpoints.small ? 'pilates' : 'dark-pilates'
			setMenuTheme(theme)
			menuTheme.value = 'dark-pilates'
			menuThemeMobile.value = 'pilates'
			break
		case 4:
			theme = screen.width <= breakpoints.small ? 'nutrition' : 'dark-nutrition'
			setMenuTheme(theme)
			menuTheme.value = 'dark-nutrition'
			menuThemeMobile.value = 'nutrition'
			break
		case 5:
			theme = screen.width <= breakpoints.small ? 'subduedYellow' : 'dark-subduedYellow'
			setMenuTheme(theme)
			menuTheme.value = 'dark-subduedYellow'
			menuThemeMobile.value = 'subduedYellow'
			break
	}
}

const startSlider = () => {
	const activeRibbon = ribbons.value[activeSlide.value]
	const activeBackground = backgrounds.value[activeSlide.value]
	const activeContent = contents.value[activeSlide.value]

	activeRibbon.start()
	activeBackground.start()
	activeContent.start()
	bullets.value.start(activeSlide.value)
}

const changeSlide = (slide) => {
	if (slide === activeSlide.value) return
	close(slide)
}

onBeforeUnmount(() => kill())
onMounted(() => {
	// const mediaPromise = el.value.querySelector('.background img') ? imgLoaded(el.value.querySelector('.background img')) : videoLoaded(el.value.querySelector('.background video')
	// context.$page.loader.deferLoad(mediaPromise)

	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => initRibbon())
	context.$page.loader.transitionReady.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='home-header'] {
	position: relative;

	display: grid;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	height: var(--computed-100vh);
	max-height: 100vh;

	background-color: var(--color-darkBrown);
	overflow: hidden;

	.backgrounds-container {
		z-index: 1;
	}
	.ribbons-container {
		z-index: 4;
		pointer-events: none;
	}

	.contents-container {
		z-index: 3;
	}

	.backgrounds-container,
	.ribbons-container,
	.contents-container {
		position: relative;
		grid-row: 1;
		grid-column: 1;

		display: grid;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: var(--computed-100vh);

		@include max-screen($small) {
			height: calc(var(--computed-100vh) - var(--menu-gap));
		}

		.ribbon {
			grid-row: 1;
			grid-column: 1;

			// Colors repeat every 5 elements

			&:nth-child(5n + 1) {
				--ribbon-backgroundColor: var(--color-yellow);
			}
			&:nth-child(5n + 2) {
				--ribbon-backgroundColor: var(--color-stream);
			}
			&:nth-child(5n + 3) {
				--ribbon-backgroundColor: var(--color-pilates);
			}
			&:nth-child(5n + 4) {
				--ribbon-backgroundColor: var(--color-nutrition);
			}
			&:nth-child(5n + 5) {
				--ribbon-backgroundColor: var(--color-subduedYellow);
			}
		}

		.background {
			grid-row: 1;
			grid-column: 1;

			width: 100%;
			height: 100%;
			object-fit: cover;

			// Colors repeat every 5 elements

			&:nth-child(5n + 1) {
				--ribbon-backgroundColor: var(--color-yellow);
			}
			&:nth-child(5n + 2) {
				--ribbon-backgroundColor: var(--color-stream);
			}
			&:nth-child(5n + 3) {
				--ribbon-backgroundColor: var(--color-pilates);
			}
			&:nth-child(5n + 4) {
				--ribbon-backgroundColor: var(--color-nutrition);
			}
			&:nth-child(5n + 5) {
				--ribbon-backgroundColor: var(--color-subduedYellow);
			}
		}

		.content {
			grid-row: 1;
			grid-column: 1;
		}
	}

	.bullets-container {
		position: absolute;
		left: 0;
		top: 0;
		padding-bottom: rs(220);

		display: flex;
		justify-content: center;
		align-items: flex-end;
		width: 100%;
		height: 100%;

		z-index: 5;

		pointer-events: none;

		@include max-screen($small) {
			height: calc(100% - #{rs(54, 48)} - #{rs(32, 32)});
		}
	}
}
</style>
