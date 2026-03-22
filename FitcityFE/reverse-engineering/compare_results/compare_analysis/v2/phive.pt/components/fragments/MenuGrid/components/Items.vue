<template>
	<div ref="el" data-component="items" :class="`items ${colorTheme}`">
		<SubItems ref="subItemsRef" :clubs="clubs" title="Clubs" class="sub-items" :close-fn="handleSubItemsClose" :click-fn="openCloseFn" />

		<div class="items-wrapper">
			<div ref="languagesContainer" class="languages-container">
				<span class="underline" />
				<ul class="languages-list">
					<li v-for="(item, i) in languages" :key="i" class="item">
						<nuxt-link
							:to="`/${item.locale}`"
							:class="`-label-2 -uppercase link ${locale === item.locale ? 'active' : ''}`"
							@click="openCloseFn"
							@mouseenter="languagesHoverEnter"
							@mouseleave="languagesHoverLeave"
						>
							{{ item.name }}
						</nuxt-link>
					</li>
				</ul>
			</div>

			<div class="main-container">
				<div v-if="menuCta" class="cta-container">
					<HyperLink :to="menuCta.link" class="-uppercase link" @click="openCloseFn" @mouseenter="handleCtaMouseEnter" @mouseleave="handleCtaMouseLeave">
						<VariableLabel ref="menuCtaRef" :label="menuCta.label" class="rollhover-label" />
					</HyperLink>
				</div>
				<ul class="pages-container">
					<li v-for="(item, i) in noTrailingSlashItems" :key="i" class="item" :data-index="i">
						<HyperLink :to="item.link" class="-uppercase link" @click="openCloseFn" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
							<VariableLabel ref="rollHoverLabelRef" :label="item.title" class="rollhover-label" />
						</HyperLink>

						<CircleBtn
							v-if="item.title.includes('Club')"
							ref="secondaryBtn"
							class="secondary-btn"
							:color="color"
							:accent-hover="true"
							slug="arrow-right"
							size="medium"
							@click="handleSubItemsClick"
						/>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'
import { onMounted } from 'vue'

import { LOCALES as languages } from '~/i18n'
import { useLocale } from '~/i18n'
import { removeTrailingSlash } from '~/utils/routing'

import { HyperLink } from '~/components/core'
import { VariableLabel, CircleBtn } from '~/components/primitives'

import { useMotion } from './Items.motion'
import { useScreen } from 'vue-screen'
import { useMenu } from '../useMenu'

import SubItems from './SubItems.vue'

import { getActiveContext } from '../components/core/Page/context'

const props = defineProps({
	menuCta: { type: [Boolean, Object], default: false },
	items: { type: Array, default: () => [] },
	clubs: { type: Array, default: () => [] },
	openCloseFn: { type: Function, default: () => {} },
})
const { getMenuTheme } = useMenu()
const locale = useLocale() || 'en'

const el = ref(null)
const isOpen = ref(false)
const { setupAnimation, animation } = useMotion(el, 'rotate')
const screen = useScreen()
const rollHoverLabelRef = ref([])
const menuCtaRef = ref(null)
const subItemsRef = ref(null)
const secondaryBtn = ref(null)
const colorTheme = getMenuTheme()

const color = ref(colorTheme.value === 'dark' ? 1 : 0)

const noTrailingSlashItems = computed(() => {
	return props.items.map((el) => {
		return {
			link: { path: removeTrailingSlash(el.link.path), type: el.link.type },
			title: el.title,
			type: el.type,
		}
	})
})

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

const languagesContainer = ref(null)

const subItemsTl = gsap.timeline({ paused: true })

watch(screen, () => {
	setActiveLanguage()
})

onMounted(() => {
	const context = getActiveContext()

	context.loader.ready.then(() => {
		secondaryBtn.value.forEach((el) => el.animateIn())
	})
	document.fonts.ready.then(() => {
		setActiveLanguage()

		setTimeout(() => {
			setupAnimation()

			subItemsTl.fromTo(
				el.value.querySelector('.items-wrapper'),
				{
					z: 0,
					rotationY: 0,
					xPercent: 0,
					scaleX: 1,
					autoAlpha: 1,
					zIndex: 1,
					transformOrigin: 'left',
				},
				{
					z: -200,
					xPercent: -120,
					scaleX: 0,
					rotationY: -90,
					opacity: 0,
					ease: 'power4.inOut',
					duration: 0.9,
					delay: 0.1,
				},
			)

			subItemsTl.fromTo(
				el.value.querySelector('.sub-items'),
				{
					z: -200,
					xPercent: 120,
					scaleX: 0,
					rotationY: 90,
					opacity: 0,
					transformOrigin: 'left',
				},
				{
					z: 0,
					xPercent: 0,
					scaleX: 1,
					rotationY: 0,
					opacity: 1,
					ease: 'power4.inOut',
					duration: 1,
				},
				0,
			)
		}, 100)
	})
})

const openClose = () => {
	isOpen.value ? close() : open()
	return isOpen.value
}
const open = () => {
	el.value.classList.add('active')
	animation.timeScale(1).play()
	isOpen.value = true
}
const close = () => {
	el.value.classList.remove('active')
	animation
		.timeScale(2)
		.reverse()
		.then(() => subItemsTl.seek(0).pause())
	isOpen.value = false
}

const setActiveLanguage = () => {
	const parent = languagesContainer.value
	const parentB = parent.getBoundingClientRect()
	const activeItem = parent.querySelector('.active').closest('.item')
	const activeItemB = activeItem.getBoundingClientRect()

	gsap.set(languagesContainer.value.querySelector('.underline'), {
		x: activeItemB.left - parentB.left,
		width: activeItemB.width,
	})
}

const languagesHoverEnter = (e) => {
	const parent = languagesContainer.value
	const parentB = parent.getBoundingClientRect()
	const item = e.target.closest('.item')
	const itemB = item.getBoundingClientRect()

	gsap.to(languagesContainer.value.querySelector('.underline'), {
		x: itemB.left - parentB.left,
		width: itemB.width,
		ease: 'expo.inOut',
		duration: 0.5,
	})
}

const languagesHoverLeave = (e) => {
	const parent = languagesContainer.value
	const parentB = parent.getBoundingClientRect()
	const activeItem = parent.querySelector('.active').closest('.item')
	const activeItemB = activeItem.getBoundingClientRect()

	gsap.to(languagesContainer.value.querySelector('.underline'), {
		x: activeItemB.left - parentB.left,
		width: activeItemB.width,
		ease: 'expo.inOut',
		duration: 0.5,
	})
}

const handleMouseEnter = (e) => {
	const link = e.target.closest('.item').querySelector('a')
	const index = Number(e.target.closest('.item').dataset.index)
	!link.classList.contains('-active') && rollHoverLabelRef.value[index].setForceHover(true)
}
const handleMouseLeave = (e) => {
	const index = Number(e.target.closest('.item').dataset.index)
	rollHoverLabelRef.value[index].setForceHover(false)
}

const handleCtaMouseEnter = (e) => menuCtaRef.value.setForceHover(true)
const handleCtaMouseLeave = (e) => menuCtaRef.value.setForceHover(false)

const handleSubItemsClose = () => {
	subItemsTl.reverse()
	subItemsRef.value.exit()
}
const handleSubItemsClick = () => {
	subItemsTl.play()
	subItemsRef.value.enter()
}

defineExpose({ openClose })
</script>

<style lang="scss" scoped>
[data-component='items'] {
	position: relative;

	backface-visibility: hidden;
	overflow: hidden;

	opacity: 0;

	pointer-events: none;

	background-color: var(--menu-backgroundColor);

	transition:
		background-color 0.25s ease(out-expo),
		border-color 0.25s ease(out-expo);

	perspective: 1000px;
	width: var(--menu-width);

	&.dark {
		.pages-container {
			.item {
				border-top: 1px solid rgb(from var(--menu-color) r g b / 0.1);

				&:last-child {
					border-bottom: 1px solid rgb(from var(--menu-color) r g b / 0.1);
				}

				.secondary-btn {
					border-left: 1px solid rgb(from var(--menu-color) r g b / 0.1);
				}
			}
		}
	}

	&.active {
		pointer-events: visible;
	}

	.items-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: rs(16, 12);
		gap: rs(16, 12);
		width: 100%;
	}

	.sub-items {
		position: absolute;
		top: 0;
		left: 0;

		height: 100%;
	}

	.languages-container {
		position: relative;

		.underline {
			position: absolute;
			bottom: -2px;
			width: var(--active-width, 50%);
			height: 1px;

			background-color: var(--menu-color);
			transition: background-color 0.25s ease(out-expo);
		}

		.languages-list {
			display: flex;
			justify-content: center;
			align-items: flex-start;
			gap: rs(12, 12);

			.item {
				.link {
					position: relative;
					display: block;

					@include extend_hitbox(10);

					&.active {
						pointer-events: none;

						&:after {
							transform: scaleX(1);
						}
					}

					.label {
						display: block;
					}
				}
			}
		}
	}

	.main-container {
		position: relative;

		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.cta-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		// background-color: var(--menu-secondaryBackgroundColor);

		background-color: rgb(from var(--menu-color) r g b / 0.1);
		height: rs(54, 48);

		.link {
			position: relative;
			@include extend_hitbox(14);

			width: 100%;

			text-align: center;

			font-family: 'PPFormula';
			font-size: rs(28, 24);
			letter-spacing: -0.028em;
			line-height: 1em;

			.rollhover-label {
				width: 100%;

				:deep(.label),
				:deep(.label-shadow),
				:deep(.label-spacing) {
					font-family: 'PPFormula';
					font-size: rs(28, 24);
					letter-spacing: -0.028em;
					line-height: 1em;
				}
			}

			&.-active {
				opacity: 0.5;

				pointer-events: none;
			}
		}
	}

	.pages-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		.item {
			position: relative;

			display: flex;

			justify-content: center;
			align-items: center;
			width: 100%;
			height: rs(54, 48);

			border-top: 1px solid rgb(from var(--menu-color) r g b / 0.1);

			&:last-child {
				border-bottom: 1px solid rgb(from var(--menu-color) r g b / 0.1);
			}

			.secondary-btn {
				--circleBtn-backgroundColor: var(--menu-backgroundColor);

				position: absolute;
				top: 0;
				right: 1px;

				display: flex;
				align-items: center;
				justify-content: center;
				height: calc(100%);

				border-left: 1px solid rgb(from var(--menu-color) r g b / 0.1);
				border-radius: 0;

				transition: background-color 0.5s ease(out-expo);
				@include extend_hitbox(20);

				@media (hover: hover) {
					&:hover {
						--circleBtn-backgroundColor: var(--menu-color);
						--circleBtn-color: var(--menu-backgroundColor);
					}
				}
			}
		}

		.link {
			position: relative;
			@include extend_hitbox(14);
			flex: 1;

			text-align: center;

			font-family: 'PPFormula';
			font-size: rs(28, 24);
			letter-spacing: -0.028em;
			line-height: 1em;

			.rollhover-label {
				width: 100%;

				:deep(.label),
				:deep(.label-shadow),
				:deep(.label-spacing) {
					font-family: 'PPFormula';
					font-size: rs(28, 24);
					letter-spacing: -0.028em;
					line-height: 1em;
				}
			}

			&.-active {
				opacity: 0.5;

				pointer-events: none;
			}
		}
	}
}
</style>
