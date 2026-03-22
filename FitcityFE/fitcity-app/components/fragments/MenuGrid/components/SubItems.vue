<template>
	<div ref="el" data-component="sub-items">
		<div class="items-header">
			<div class="left-col">
				<CircleBtn ref="closeBtn" class="back-btn" :color="color" slug="arrow-left" size="medium" @click="() => closeFn()" />
			</div>
			<h3 class="-callout -uppercase title">{{ title }}</h3>
		</div>

		<div class="scroller-wrapper" data-lenis-prevent>
			<Scroller ref="subScroller" class="pages-container">
				<ul class="list">
					<li v-for="(item, i) in clubs" :key="i" class="item">
						<HyperLink :to="item.link" class="link" @click="() => clickFn()">
							<div class="media-container">
								<MediaAsset :media="item.thumb" class="media" sizes="xsmall:100px medium:1200px xlarge:1700px" />
							</div>
							<h2 class="-title-6 -uppercase club-title">{{ item.title }}</h2>
						</HyperLink>
					</li>
				</ul>
			</Scroller>

			<div class="custom-scrollbar">
				<div class="custom-scrollbar-thumb" ref="scrollThumb"></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { HyperLink, Scroller } from '~/components/core'
import MediaAsset from '~/components/core/MediaAsset/MediaAsset.vue'
import { CircleBtn } from '~/components/primitives'
import { useMenu } from '../useMenu'

import { getActiveContext } from '../../../core/Page/context.js'

const props = defineProps({
	title: { type: String, default: '' },
	clubs: { type: Array, default: () => [] },
	closeFn: { type: Function, default: () => {} },
	clickFn: { type: Function, default: () => {} },
})

const { getMenuTheme } = useMenu()

const el = ref(null)
const closeBtn = ref(null)
const subScroller = ref(null)
const scrollThumb = ref(null)
const scroller = inject('$scroller')
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

const setup = () => {}
const init = () => {}
const kill = () => {}

const enter = () => {
	subScroller.value.resize()
	subScroller.value.start()
	scroller.value.stop()

	const container = el.value.querySelector('.pages-container').getBoundingClientRect()
	const scrollContent = el.value.querySelector('.scroller-container').getBoundingClientRect()
	const scrollbar = el.value.querySelector('.custom-scrollbar').getBoundingClientRect()
	const thumbHeight = (container.height / scrollContent.height) * scrollbar.height

	scrollThumb.value.style.height = `${thumbHeight}px`
	const scroll = subScroller.value?.getScrollerInstance().value
	scroll.on('scroll', (e) => updateScrollbar(e))
}

const exit = () => {
	subScroller.value.stop()
	scroller.value.start()
}

const updateScrollbar = (e) => {
	const container = el.value.querySelector('.pages-container')
	const thumb = scrollThumb.value
	if (!container || !thumb) return

	const scrollableHeight = container.scrollHeight - container.clientHeight
	const scrollProgress = container.scrollTop / scrollableHeight

	const scrollbarHeight = container.clientHeight - thumb.clientHeight - 40
	thumb.style.transform = `translateY(${scrollProgress * scrollbarHeight}px)`
}

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()

	context.loader.ready.then(() => {
		closeBtn.value.animateIn()
	})
})

defineExpose({
	enter,
	exit,
})
</script>

<style lang="scss" scoped>
[data-component='sub-items'] {
	position: relative;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding-top: rs(8);
	width: var(--menu-width);

	background-color: var(--menu-backgroundColor);
	border: 1px solid var(--menu-backgroundColor);
	border-bottom: none;

	backface-visibility: hidden;
	overflow: hidden;

	opacity: 0;

	pointer-events: visible;

	transition:
		background-color 0.25s ease(out-expo),
		border-color 0.25s ease(out-expo);

	.custom-scrollbar {
		position: absolute;
		right: 8px;
		top: 20px;
		width: 4px;
		height: calc(100% - 40px);
		background: rgb(from var(--menu-color) r g b / 0.1);

		z-index: 10;
	}

	.custom-scrollbar-thumb {
		width: 100%;
		height: 50px; /* Adjust dynamically */
		background: rgb(from var(--menu-color) r g b / 0.8);
		position: absolute;
		top: 0;
	}

	.items-header {
		position: relative;

		display: grid;

		grid-template-columns: 1fr auto 1fr;
		grid-template-rows: 1fr;

		align-items: center;
		justify-content: center;
		width: 100%;

		z-index: 2;

		.back-btn {
			--circleBtn-backgroundColor: transparent;

			position: relative;
			padding-left: rs(8);
		}

		.title {
			position: relative;
			font-size: rs(28, 24);
			letter-spacing: -0.028em;
			font-variation-settings:
				'wdth' 0,
				'wght' 500;

			z-index: 1;
		}
	}

	.scroller-wrapper {
		position: relative;
		height: calc(100% - #{rs(54)});

		&:before {
			content: '';
			position: absolute;
			top: rs(-5);
			left: 0;

			display: block;
			width: 100%;
			height: rs(20);
			background: linear-gradient(180deg, var(--menu-backgroundColor) 10%, rgba(255, 255, 255, 0) 100%);
			z-index: 1;
		}

		&:after {
			content: '';
			position: absolute;
			bottom: rs(-5);
			left: 0;

			display: block;
			width: 100%;
			height: rs(20);
			background: linear-gradient(0deg, var(--menu-backgroundColor) 40%, rgba(255, 255, 255, 0) 100%);
		}
	}

	.pages-container {
		position: relative;
		padding: 0 rs(24) 0 rs(24);

		flex-grow: 1;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: rs(8);
		padding: rs(20) 0 rs(20);

		.item {
			position: relative;

			.link {
				position: relative;
				padding: rs(8);

				display: flex;
				align-items: center;
				gap: rs(8);

				border: 1px solid rgb(from var(--menu-color, var(--color-darkBrown)) r g b / 0.5);

				@media (hover: hover) {
					&:hover {
						background-color: var(--menu-color);
						color: var(--menu-backgroundColor);
					}
				}

				.media-container {
					display: flex;
					width: rs(98, 98);
					flex: 0 0 rs(98, 98);

					height: rs(68, 68);

					.media {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}

				.club-title {
					padding-right: 19%;

					font-size: rs(22, 22);
					letter-spacing: 0em;
					text-align: left;
					text-wrap-mode: normal;
				}
			}
		}
	}
}
</style>
