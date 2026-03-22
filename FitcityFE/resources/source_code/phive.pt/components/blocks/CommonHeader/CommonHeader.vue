<template>
	<div ref="el" data-component="common-header" :class="`${background ? '' : 'small'} ${isClubRoute ? 'club-header' : ''}`" data-section-intersect="light">
		<FormCallout v-if="formCta" class="form-cta" v-bind="formCta" />

		<div class="content-container">
			<h1 ref="titleRef" class="-title-1 -uppercase title">{{ title }}</h1>
			<p v-if="subtitle" ref="subtitleEl" class="-manuscript-3 subtitle">{{ subtitle }}</p>
		</div>

		<div v-if="background" class="background-container">
			<MediaAsset v-if="background" :media="background" class="media" :playsinline="false" />
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'

import.meta.client && gsap.registerPlugin(ScrollTrigger)

import MediaAsset from '~/components/core/MediaAsset/MediaAsset.vue'
import { FormCallout } from '~/components/fragments'
import { useTypeWrite } from '~/composables/useTypeWrite'

import { useTitleAnimation } from '~/composables'
import { useMenu } from '~/components/fragments/MenuGrid/useMenu'

import { imgLoaded, videoLoaded } from '~/utils/dom'

const props = defineProps({
	title: { type: String, default: '' },
	subtitle: { type: String, default: '' },
	background: { type: [Boolean, Array], default: false },
	formCta: { type: [Boolean, Object], default: false },
	buttonCta: { type: [Boolean, Object], default: false },

	// controlsProps
	letterAnimation: { type: Boolean, default: true },
	titleAnimation: { type: String, default: 'simple' },
})

const context = inject('pageContext')
const el = ref(null)
const titleRef = ref(null)
const subtitleEl = ref(null)
const { currentRoute } = useRouter()
let animateSubtitle

let observer

const isClubRoute = computed(() => {
	const path = currentRoute.value.path
	return (path.startsWith('/en/clubs/') || path.startsWith('/clubes/')) && path.split('/').length > 2
})

const { setButtonCTA } = useMenu()
setButtonCTA(props.buttonCta)

useTitleAnimation(titleRef, true, 500, true)
if (subtitleEl)
	animateSubtitle = useTypeWrite({
		element: subtitleEl,
		types: props.letterAnimation ? 'chars' : 'words',
		paused: true,
	})

const setup = () => {
	if (el.value.querySelector('.media')) {
		gsap.set(el.value.querySelector('.media'), {
			scale: 1.4,
			opacity: 0.5,
		})
	}

	observer = ScrollTrigger.create({
		trigger: el.value,
		onEnter: () => {
			if (el.value.querySelector('video')) {
				el.value.querySelector('video').play()
			}
		},
		onEnterBack: () => {
			if (el.value.querySelector('video')) {
				el.value.querySelector('video').play()
			}
		},
		onLeave: () => {
			if (el.value.querySelector('video')) {
				el.value.querySelector('video').pause()
			}
		},
		onLeaveBack: () => {
			if (el.value.querySelector('video')) {
				el.value.querySelector('video').pause()
			}
		},
	})
}

const init = () => {
	setTimeout(() => {
		animateSubtitle.animateChars()
	}, 1000)

	if (el.value.querySelector('.media')) {
		gsap.to(el.value.querySelector('.media'), {
			scale: 1,
			autoAlpha: 1,
			ease: 'power4.inOut',
			duration: 1,
		})
	}
}

const kill = () => {
	observer?.kill()
}

onBeforeUnmount(() => kill())

onMounted(() => {
	const mediaPromise = el.value.querySelector('.background img') ? imgLoaded(el.value.querySelector('.background img')) : videoLoaded(el.value.querySelector('.background video'))

	// context.$page.loader.deferLoad(mediaPromise)
	context.$page.loader.ready.then(() => setup())
	context.$page.loader.transitionReady.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='common-header'] {
	position: relative;

	display: grid;
	align-items: start;
	justify-items: center;
	text-align: center;

	width: var(--computed-100vw);
	background-color: var(--color-darkBrown);

	overflow: hidden;

	&.club-header {
		.background-container {
			&:after {
				content: '';
				position: absolute;
				inset: 0;

				display: block;
				background-color: rgb(from var(--color-yellow, black) r g b / 0.2);
				z-index: 1;
				mix-blend-mode: multiply;
			}
		}
	}

	&.small {
		padding-bottom: rs(80);
	}

	.form-cta {
		position: absolute;
		top: 0;

		width: 100%;
		z-index: 10;
	}

	.title {
		position: relative;
		margin-top: rs(10, 40);

		color: var(--color-yellow);

		font-family: 'PPFormula';
		font-size: rs(434, 100);
		letter-spacing: 0em;
		line-height: 1em;
		font-variation-settings:
			'wdth' 0,
			'wght' 460;
	}

	.subtitle {
		position: relative;
		top: -1em;

		width: 100%;
		color: var(--color-white);

		transform: rotate(-6deg);
		opacity: 0.9;
	}

	.content-container {
		position: relative;
		z-index: 1;

		grid-row: 1;
		grid-column: 1;
	}

	.background-container {
		position: relative;

		grid-row: 1;
		grid-column: 1;

		width: 100%;
		height: var(--computed-100vh);

		perspective: 1000px;

		background-color: var(--color-darkBrown);

		.media {
			position: relative;

			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>
