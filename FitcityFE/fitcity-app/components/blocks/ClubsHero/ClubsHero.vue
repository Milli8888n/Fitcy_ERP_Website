<template>
	<section ref="el" data-component="clubs-hero" data-section-intersect="light">
		<div class="bg-container">
			<video src="/videos/smoke.mp4" autoplay muted playsinline loop class="media" />
		</div>
		<div class="row align-center">
			<div class="xxlarge-11 xsmall-14 col">
				<h2 class="-subhead-2 -uppercase upper-title">{{ upperTitle }}</h2>

				<div class="animation-container">
					<ClientOnly>
						<component :is="RiveAsset" v-if="RiveAsset && title" ref="taglineRef" :asset="title" layout="contain" :loop="false" hydrate-on-idle />
					</ClientOnly>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

// import { RiveAsset } from '~/components/core'

import { useEnterAnimation } from '~/composables/core'

import { breakpoints } from '~/config'

defineProps({
	upperTitle: { type: String, default: '' },
	title: { type: [Boolean, Object], default: false },
})

const el = ref(null)
const taglineRef = ref(null)
const context = inject('pageContext')
const smokeTl = gsap.timeline({ paused: true })
const enterAnimation = useEnterAnimation()
let riveObserver
const mm = gsap.matchMedia()

const RiveAsset = shallowRef(null)

const setup = () => {}

const init = () => {
	mm.add(`(min-width: ${breakpoints.medium}px)`, () => {
		const smoke = el.value.querySelector('.bg-container video')
		smokeTl.fromTo(smoke, { opacity: 1 }, { opacity: 0, ease: 'none' })

		enterAnimation.init({
			trigger: el.value,
			timeline: smokeTl,
			start: 'center top',
			end: 'bottom top',
			scrub: true,
		})

		riveObserver = ScrollTrigger.create({
			trigger: el.value,
			start: 'top center',
			end: 'bottom bottom',
			onUpdate: ({ progress }) => {
				const time = progress * 4
				taglineRef.value.scrub(time)
			},
		})

		return () => {
			riveObserver?.kill()
			smokeTl?.kill()
		}
	})

	mm.add(`(max-width: ${breakpoints.medium - 1}px)`, () => {
		const smoke = el.value.querySelector('.bg-container video')
		smokeTl.fromTo(smoke, { opacity: 1 }, { opacity: 0, ease: 'none' })

		riveObserver = ScrollTrigger.create({
			trigger: el.value.querySelector('.animation-container'),
			start: 'top center',
			onEnter: () => {
				taglineRef.value.play()
				riveObserver.kill()
			},
		})

		return () => {
			riveObserver?.kill()
			smokeTl?.kill()
			taglineRef.value?.reset()
		}
	})
}
const kill = () => {
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
[data-component='clubs-hero'] {
	position: relative;

	width: var(--computed-100vw);
	height: 400vh;

	background-color: var(--color-darkBrown);
	color: var(--color-yellow);

	@include max-screen($medium) {
		height: 100vh;
	}

	.bg-container {
		position: absolute;
		top: 0;
		left: 0;

		display: block;
		width: 100%;
		height: 150%;

		opacity: 0.5;
		mix-blend-mode: plus-lighter;

		z-index: 1;

		.media {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.row {
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		align-items: center;
	}

	.col {
		position: relative;
		padding: rs(46) 0 rs(86) 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: rs(22);
		height: 100%;

		text-align: center;
	}

	.animation-container {
		position: relative;
		// padding: 0 n_grid_columns(2);

		flex: 1;

		@include max-screen($xsmall) {
			padding: 0;
		}
	}
}
</style>
