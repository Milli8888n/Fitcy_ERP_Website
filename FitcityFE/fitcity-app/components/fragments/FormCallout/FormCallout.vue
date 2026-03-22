<template>
	<div ref="el" data-component="form-callout" :class="autoplay ? 'autoplay' : ''">
		<HyperLink :to="link" class="link">
			<div class="inner">
				<span v-for="index in repeatNumber" :key="index" class="-subhead-3 -uppercase label">
					{{ label }}
				</span>
				<span v-for="index in repeatNumber" :key="index" class="-subhead-3 -uppercase label">
					{{ label }}
				</span>
			</div>
		</HyperLink>
	</div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useScreen } from 'vue-screen'

import { HyperLink } from '~/components/core'

import { useMotion } from './FormCallout.motion'

defineProps({
	label: { type: String, default: '' },
	link: { type: [Boolean, Object], default: false },

	// Controls Props
	autoplay: { type: Boolean, default: true },
})

const screen = useScreen()
const context = inject('pageContext')

const el = ref(null)

const repeatNumber = ref(1)
const { animateIn } = useMotion(el)

const init = () => {
	duplicateLabel().then(() => animateIn(0))
}
onMounted(() => {
	context.$page.loader.transitionReady.then(() => init())
})

const duplicateLabel = () => {
	return new Promise((resolve) => {
		document.fonts.ready.then(() => {
			setTimeout(() => {
				const labelWidth = el.value.querySelector('.label').getBoundingClientRect().width
				const containerWidth = screen.width

				repeatNumber.value = Math.round(containerWidth / labelWidth)

				nextTick(() => resolve())
			}, 100)
		})
	})
}
</script>

<style lang="scss" scoped>
[data-component='form-callout'] {
	position: relative;

	display: flex;
	padding: rs(12) 0;
	width: 100%;

	color: var(--color-yellow);

	&.autoplay {
		.inner {
			animation-play-state: running;
		}
	}

	.link {
		@include extend_hitbox(10);
	}

	.inner {
		position: relative;
		display: flex;
		gap: rs(36);
		padding-left: rs(36);
		width: max-content;

		will-change: transform;

		animation-name: loop;
		animation-iteration-count: infinite;
		animation-play-state: paused;
		animation-duration: 12s;
		animation-timing-function: linear;

		@keyframes loop {
			0% {
				transform: translate3d(0%, 0, 0);
			}
			100% {
				transform: translate3d(-50%, 0, 0);
			}
		}
	}

	.label {
		flex: 1;

		opacity: 0;
		visibility: hidden;
	}
}
</style>
