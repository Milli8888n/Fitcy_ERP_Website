<template>
	<div ref="el" data-component="bar">
		<div class="left-col" @click="openClose" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
			<Burger ref="burger" class="burger-btn" :color="color" />
		</div>
		<div class="center-col" @click="openClose" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
			<!-- <span class="-uppercase label">Phive</span> -->
			<SvgAsset url="/imgs/logo.svg" />
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

	transition: background-color 0.25s ease(out-expo), border-color 0.25s ease(out-expo);

	cursor: pointer;

	user-select: none;

	.left-col {
		display: flex;
		justify-content: center;
		align-items: center;
		width: rs(70, 70);
		flex: 0 0 rs(70, 70);
	}

	.right-col {
		display: flex;
		justify-content: center;
		align-items: center;
		width: rs(70, 70);
		flex: 0 0 rs(70, 70);
	}

	.center-col {
		flex: 1;

		display: flex;
		justify-content: center;
		align-items: center;

		:deep(svg) {
			width: rs(90, 90);

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
	}

	.sound-btn {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		:deep(svg) {
			path,
			circle,
			line {
				transition: fill 0.5s ease(out-expo);
			}
		}
	}

	.label {
		position: relative;

		font-family: 'PPFormula';
		font-size: rs(28, 24);
		letter-spacing: -0.01em;
		line-height: 1em;
		font-variation-settings: 'wdth' 10, 'wght' 350;
	}
}
</style>
