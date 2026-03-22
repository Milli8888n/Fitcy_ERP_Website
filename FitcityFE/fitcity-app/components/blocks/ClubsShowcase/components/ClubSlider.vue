<template>
	<div ref="el" data-component="club-slider" :data-index="index">
		<div class="photos-wrapper">
			<PhotosSlideshow ref="photosSlideshowRef" :photos="computedPhotos" :duration="4" />
		</div>

		<div class="rolling-title-container">
			<div class="wrapper">
				<div v-for="index in 2" :key="index" class="inner">
					<RollingTitle :label="title" :infinite="true" />

					<div class="subtitle-location-wrapper">
						<h3 class="-title-6 -uppercase subtitle">{{ subtitle }}</h3>
						<HyperLink v-if="locationCta" class="-footnote-1 -uppercase location-btn" :to="locationCta.link" @mouseenter="handleLocationEnter" @mouseleave="handleLocationLeave">
							<span class="label">{{ locationCta.label }}</span>
						</HyperLink>
					</div>

					<RollingTitle :label="title" :infinite="true" />

					<div class="subtitle-location-wrapper">
						<h3 class="-title-6 -uppercase subtitle">{{ subtitle }}</h3>
						<HyperLink v-if="locationCta" class="-footnote-1 -uppercase location-btn" :to="locationCta.link" @mouseenter="handleLocationEnter" @mouseleave="handleLocationLeave">
							<span class="label">{{ locationCta.label }}</span>
						</HyperLink>
					</div>
				</div>
			</div>
		</div>

		<div class="ctas-list-container">
			<ButtonRoundVariable v-for="(button, i) in computedCtasList" :key="i" v-bind="button" class="btn" :type="`${i % 2 ? 'secondary' : 'primary'}`" />
		</div>
	</div>
</template>

<script setup>
import { HyperLink } from '~/components/core'

import { RollingTitle } from '~/components/primitives'
// import { PhotosSlideshow } from '~/components/fragments'

import ButtonRoundVariable from '~/components/primitives/ButtonRoundVariable/ButtonRoundVariable.vue'

import { useMotion } from './ClubSlider.motion'

const PhotosSlideshow = defineAsyncComponent(() => import('~/components/fragments/PhotosSlideshow/PhotosSlideshow.vue'))

const props = defineProps({
	path: { type: String, default: '' },
	title: { type: String, default: '' },
	subtitle: { type: String, default: '' },
	photos: { type: [Boolean, Array], default: false },
	locationCta: { type: [Boolean, Object], default: false },
	ctasList: { type: [Boolean, Array], default: false },
	index: { type: Number, default: 0 },
})

const el = ref(null)
const photosSlideshowRef = ref(null)
useMotion(el, photosSlideshowRef)

const computedPhotos = computed(() => props.photos.slice(0, 4))
const computedCtasList = computed(() => {
	const aux = props.ctasList
	aux.forEach((el) => {
		if (el.link.path.includes('form') && !el.link.path.includes('?')) {
			const query = `?club=${props.path.split('/')[props.path.split('/').length - 1]}`
			el.link.path = `${el.link.path}${query}`
		} else if (el.link.path.includes('timetable') && !el.link.path.includes('?')) {
			const query = `?club=${props.path.split('/')[props.path.split('/').length - 1]}`
			el.link.path = `${el.link.path}${query}`
		}
	})
	return aux
})

const handleLocationEnter = () => el.value.querySelector('.rolling-title-container').classList.add('paused')
const handleLocationLeave = () => el.value.querySelector('.rolling-title-container').classList.remove('paused')
</script>

<style lang="scss" scoped>
[data-component='club-slider'] {
	--slider-height: 100vh;

	position: relative;

	display: grid;
	height: var(--slider-height);
	width: 100%;
	padding: 5vh var(--grid-padding) var(--menu-gap) var(--grid-padding);

	overflow: hidden;

	@include max-screen($xsmall) {
		padding: rs(16, 16) var(--grid-padding) var(--menu-gap) var(--grid-padding);
	}

	.photos-wrapper {
		position: relative;

		grid-row: 1;
		grid-column: 1;

		width: 100%;
		height: 100%;

		border-radius: rs(12);
		overflow: hidden;

		pointer-events: none;

		.inner {
			display: grid;
			width: 100%;
			height: 100%;
			background-color: var(--color-darkBrown);
		}

		.photo-wrapper {
			grid-row: 1;
			grid-column: 1;

			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.rolling-title-container {
		position: relative;
		grid-row: 1;
		grid-column: 1;

		width: 100%;
		height: 100%;

		display: flex;

		overflow: hidden;
		z-index: 3;

		pointer-events: none;

		&.paused {
			.inner {
				animation-play-state: paused;
			}
		}

		.wrapper {
			position: relative;

			display: flex;
			width: 100%;
		}

		.inner {
			display: flex;
			align-items: center;
			width: max-content;
			white-space: nowrap;
			gap: rs(80);
			height: 100%;
			padding-right: rs(80);

			color: var(--color-white);

			animation-name: loop;
			animation-iteration-count: infinite;
			animation-play-state: running;
			animation-duration: 48s;
			animation-timing-function: linear;

			@keyframes loop {
				0% {
					transform: translate3d(0%, 0, 0);
				}
				100% {
					transform: translate3d(-100%, 0, 0);
				}
			}
		}

		.subtitle-location-wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: rs(24);

			text-align: center;

			pointer-events: visible;

			.subtitle {
				white-space: pre-line;
			}

			.location-btn {
				position: relative;

				display: flex;
				padding: rs(6) rs(24);
				border: 1px solid var(--color-white);
				border-radius: 100%;

				@include extend_hitbox(20);

				transition: color 0.25s ease(out-expo), background-color 0.25s ease(out-expo);

				@media (hover: hover) {
					&:hover {
						background-color: var(--color-white);
						color: var(--color-darkBrown);
					}
				}

				.label {
					position: relative;
				}
			}
		}
	}

	.ctas-list-container {
		position: relative;
		grid-row: 1;
		grid-column: 1;

		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: rs(12);
		padding-bottom: rs(162);
		width: 100%;
		height: 100%;

		z-index: 3;

		pointer-events: none;

		@include max-screen($small) {
			align-items: center;
			padding-top: rs(600, 240);
			padding-bottom: 0;
		}

		.btn {
			pointer-events: visible;
		}
	}
}
</style>
