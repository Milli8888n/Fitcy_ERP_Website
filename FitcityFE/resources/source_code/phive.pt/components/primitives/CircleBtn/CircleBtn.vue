<template>
	<button ref="el" data-component="circle-btn" aria-label="Circle button" :class="size" @mouseenter="enter" @mouseleave="leave">
		<RiveAsset
			ref="riveAnimation"
			:asset="rive"
			state-machine="State Machine 1"
			:autoplay="true"
			layout="contain"
			:width="size === 'large' ? 96 : 48"
			:height="size === 'large' ? 96 : 48"
			class="icon"
		/>
	</button>
</template>

<script setup>
import { gsap } from 'gsap/all'

import { RiveAsset } from '~/components/core'
import { getActiveContext } from '~/components/core'

const props = defineProps({
	slug: { type: String, default: 'close' },
	size: { type: String, default: 'large' },
	theme: { type: String, default: 'light' },
	color: { type: Number, default: 0 },
	accentHover: { type: Boolean, default: false },
})
const riveAnimation = ref(null)
const el = ref(null)

const rive = {
	file: `/rives/${props.slug}.riv`,
}

watch(
	() => props.color,
	(newValue) => {
		riveAnimation.value.loaded().then(() => {
			riveAnimation.value.getInput('color').value = newValue
		})
	}
)

const enter = () => {
	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('hover').value = true
		if (props.accentHover) {
			riveAnimation.value.getInput('color').value = props.color === 0 ? 1 : 0
		}
	})
}
const leave = () => {
	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('hover').value = false
		if (props.accentHover) {
			riveAnimation.value.getInput('color').value = props.color
		}
	})
}

const setup = () => {
	gsap.set(el.value, {
		opacity: 1,
		scale: 0,
	})
}
const init = () => {
	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('color').value = props.theme === 'dark' ? 1 : 0
	})
}

const animateIn = () => {
	riveAnimation.value.loaded().then(() => {
		gsap.fromTo(
			el.value,
			{
				scale: 0,
				opacity: 1,
			},
			{
				scale: 1,
				ease: 'expo.out',
				duration: 1,
			}
		)

		gsap.fromTo(
			el.value.querySelector('.icon'),
			{
				rotation: 20,
				opacity: 0,
			},
			{
				rotation: 0,
				opacity: 1,
				ease: 'expo.out',
				duration: 0.75,
				delay: 0.25,
			}
		)
	})
}

const animateOut = () => {
	gsap.to(el.value, {
		opacity: 0,
		scale: 0.8,
		ease: 'expo.out',
		duration: 0.5,
	})
}

onMounted(() => {
	const context = getActiveContext()
	context.loader.loaded.then(() => setup())
	context.loader.ready.then(() => init())
})

defineExpose({ animateIn, animateOut })
</script>

<style lang="scss" scoped>
[data-component='circle-btn'] {
	--icon-color: var(--circleBtn-color, var(--color-darkBrown));

	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: var(--circleBtn-backgroundColor, var(--color-yellow));
	border-radius: 100%;

	&.large {
		width: rs(76, 48);
		height: rs(76, 48);

		.icon {
			width: rs(48, 36);
			height: rs(48, 36);
		}
	}

	&.medium {
		width: rs(54, 48);
		height: rs(54, 48);

		.icon {
			width: rs(24, 24);
			height: rs(24, 24);
		}
	}
}
</style>
