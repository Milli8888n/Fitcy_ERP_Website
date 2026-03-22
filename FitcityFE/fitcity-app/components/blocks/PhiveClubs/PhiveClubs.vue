<template>
	<section ref="el" data-component="phive-clubs" data-section-intersect="light">
		<div class="animation-container">
			<ClientOnly>
				<component :is="RiveAsset" v-if="RiveAsset && tagline" ref="taglineRef" :asset="tagline" state-machine="State Machine 1" layout="cover" />
			</ClientOnly>
		</div>

		<div class="row align-center title-row">
			<div class="xxlarge-8 small-12 xsmall-14 -text-center col">
				<h2 class="-subhead-2 title">{{ title }}</h2>
			</div>
		</div>

		<div class="photos-ctas-container">
			<div class="inner">
				<PhotoGrid ref="photosGrid" :photos="photoGrid" class="photos-grid" hydrate-on-idle />
				<CallToAction ref="callToAction" :title="ctaTitle" :subtitle="ctaSubtitle" :cta-list="ctaList" class="call-to-action" :parent-element="el" />
			</div>
		</div>

		<div class="statistics-container">
			<StatisticsTable v-if="overview" v-bind="overview" class="statistics" />
		</div>

		<!-- Smart Color Filter: Black -> Green, Yellow -> Orange, White -> White -->
		<svg style="position: absolute; width: 0; height: 0; pointer-events: none;">
			<filter id="smart-tagline-filter" color-interpolation-filters="sRGB">
				<feColorMatrix type="matrix" values="
					1.0   0.0   0.0   0.0   0.0
					-0.4  0.55  0.6   0.0   0.26
					-0.15 0.0   1.0   0.0   0.15
					0.0   0.0   0.0   1.0   0.0
				" />
			</filter>
		</svg>
	</section>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { StatisticsTable } from '~/components/fragments'

import CallToAction from './components/CallToAction.vue'
import PhotoGrid from './components/PhotoGrid.vue'
import ButtonRoundVariable from '~/components/primitives/ButtonRoundVariable/ButtonRoundVariable.vue'

import { useLocale } from '@/i18n'

const props = defineProps({
	tagline: { type: [Boolean, Object], default: false },
	title: { type: String, default: '' },
	ctaTitle: { type: String, default: '' },
	ctaSubtitle: { type: String, default: '' },
	ctaList: { type: [Boolean, Array], default: false },
	photoGrid: { type: [Boolean, Array], default: false },
	overview: { type: [Boolean, Object], default: false },
})

const el = ref(null)
const taglineRef = ref(null)
const callToAction = ref(null)
const photosGrid = ref(null)
const context = inject('pageContext')
const locale = useLocale()
const RiveAsset = shallowRef(null)

let observer
let riveObserver
let callToActionAnimated = false

const setup = () => {}

const init = () => {
	taglineRef.value.loaded().then(() => {
		if (taglineRef.value.getInput('language')) {
			taglineRef.value.getInput('language').value = locale.value === 'vi' ? 0 : 1
		}


		riveObserver = ScrollTrigger.create({
			trigger: el.value.querySelector('.animation-container'),
			start: 'top center',
			onEnter: () => {
				taglineRef.value.play()
				riveObserver.kill()
			},
		})
	})

	observer = ScrollTrigger.create({
		trigger: el.value.querySelector('.photos-ctas-container'),
		start: 'top bottom',
		end: 'bottom bottom',
		onUpdate: ({ progress }) => {
			photosGrid.value.setTimeline(progress)

			if (progress > 0.5 && !callToActionAnimated) {
				callToActionAnimated = true
				callToAction.value.enterAnimation()
			}

			if (progress > 0.5) {
				const mappedProgress = gsap.utils.mapRange(0.5, 1, 0, 1, progress)
				callToAction.value.setTimeline(mappedProgress)
			} else {
				callToAction.value.setTimeline(0)
			}
		},
	})
}
const kill = () => {
	observer?.kill()
	riveObserver?.kill()
}

onBeforeUnmount(() => kill())
onMounted(async () => {
	const module = await import('~/components/core/RiveAsset/RiveAsset.vue')
	RiveAsset.value = module.default

	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='phive-clubs'] {
	position: relative;
	z-index: 10;
	padding-bottom: rs(120);

	display: flex;
	flex-direction: column;
	width: 100%;

	color: var(--color-yellow);
	background-color: var(--color-darkBrown);

	.animation-container {
		position: relative;
		top: 1px;
		width: 100%;
		height: 100vh;

		// Apply smart color filter
		filter: url(#smart-tagline-filter);

		@include max-screen($small) {
			height: 50vh;
		}
	}

	.title-row {
		margin-bottom: rs(120);
		padding-bottom: 2em;

		.title {
			white-space: pre-line;
		}
	}
	.photos-ctas-container {
		position: relative;

		display: grid;
		align-items: flex-start;
		justify-content: center;
		height: 400svh;

		@include max-screen($small) {
			height: 200svh;
		}

		.inner {
			position: sticky;
			top: 0;

			display: flex;
			align-items: center;
			justify-content: center;
			height: 100svh;
			width: var(--computed-100vw);
			padding: rs(16);

			overflow: hidden;
		}
		.photos-grid {
			position: relative;
			top: 0;
			left: 0;

			@include max-screen($small) {
				flex: 0 0 200vw;
				width: 200vw;
			}

			@include max-screen($xsmall) {
				flex: 0 0 300vw;
				width: 300vw;
			}
		}

		.call-to-action {
			position: absolute;
			top: 0;
			left: 0;
		}
	}

	.statistics-container {
		margin-top: 0em;

		@include max-screen($xsmall) {
			display: none;
		}
	}
}
</style>
