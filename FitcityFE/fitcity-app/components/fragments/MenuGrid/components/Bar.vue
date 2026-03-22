<template>
	<div ref="el" data-component="bar" :class="colorTheme">
		<div class="left-col" @click="openClose" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
			<Burger ref="burger" class="burger-btn" :color="color" />
		</div>
		<div class="center-col" @click="openClose" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
			<span class="label">FITCITY</span>
			<!-- <SvgAsset url="/imgs/logo.svg" /> -->

		</div>
		<div class="right-col">
			<SoundBtn ref="soundBtn" class="sound-btn" :color="color" />
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

import { Burger, SoundBtn } from '~/components/primitives'
import { SvgAsset } from '~/components/core'

import { useMenu } from '../useMenu'

const { getMenuTheme } = useMenu()

const props = defineProps({
	openCloseFn: { type: Function, default: () => {} },
})

const el = ref(null)
const burger = ref(null)
const colorTheme = getMenuTheme()
const color = ref(colorTheme.value === 'dark' ? 1 : 0)

watch(colorTheme, (newValue) => {
	switch (newValue) {
		case 'light':
			color.value = 0
			break
		case 'dark':
			color.value = 1
			break
		case 'dark-stream':
			color.value = 2
			break
		case 'dark-pilates':
			color.value = 3
			break
		case 'dark-nutrition':
			color.value = 4
			break
		case 'dark-subduedYellow':
			color.value = 5
			break
	}
})

const openClose = () => {
	burger.value.click()
	props.openCloseFn()
}

const handleMouseEnter = () => {
	burger.value.enter()
}
const handleMouseLeave = () => {
	burger.value.leave()
}

defineExpose({ openClose })
</script>

<style lang="scss" scoped>
[data-component='bar'] {
	position: relative;

	display: flex;
	width: 100%;
	height: rs(54, 48);

	background-color: var(--menu-backgroundColor);
	border: 1px solid var(--menu-backgroundColor);

	transition: background-color 0.8s ease(out-expo), border-color 0.8s ease(out-expo);

	cursor: pointer;

	user-select: none;

	.left-col {
		display: flex;
		justify-content: center;
		align-items: center;
		width: rs(70, 70);
		flex: 0 0 rs(70, 70);
		background: transparent;
	}

	.right-col {
		display: flex;
		justify-content: center;
		align-items: center;
		width: rs(70, 70);
		flex: 0 0 rs(70, 70);
		background: transparent;
	}

	.center-col {
		flex: 1;

		display: flex;
		justify-content: center;
		align-items: center;
		background: transparent;

		:deep(svg) {
			width: rs(90, 80);

			path,
			polygon {
				fill: var(--menu-color);
			}
		}
	}

	.burger-btn {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		transition: filter 0.8s ease(out-expo);
	}

	&.dark,
	&.bold-orange {
		.burger-btn,
		.sound-btn {
			// Force color to Brand Orange (#FF5800)
			filter: brightness(0) saturate(100%) invert(43%) sepia(93%) saturate(3475%) hue-rotate(345deg) brightness(101%) contrast(101%) !important;
		}
	}

	&.dark-stream {
		.burger-btn,
		.sound-btn {
			// Force color to Cyber Lime (#C4D600)
			filter: brightness(0) saturate(100%) invert(74%) sepia(95%) saturate(417%) hue-rotate(24deg) brightness(97%) contrast(101%) !important;
		}
	}

	&.dark-pilates {
		.burger-btn,
		.sound-btn {
			// Force color to Arctic White (#D9E1E2)
			filter: brightness(0) saturate(100%) invert(98%) sepia(3%) saturate(913%) hue-rotate(174deg) brightness(95%) contrast(85%) !important;
		}
	}

	.sound-btn {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		transition: filter 0.8s ease(out-expo);

		:deep(svg) {
			path,
			circle,
			line {
				transition: fill 0.8s ease(out-expo);
			}
		}
	}

	.label {
		position: relative;

		color: var(--menu-color);
		font-family: 'Be Vietnam Pro', sans-serif;
		font-size: rs(28, 24);
		font-weight: 700;
		letter-spacing: -0.01em;
		line-height: 1em;

		transition: color 0.8s ease(out-expo);
	}


}
</style>
