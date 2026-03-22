<template>
	<div ref="el" data-component="service" :style="`--service-backgroundColor: ${color}; `" :data-section-intersect="theme">
		<div class="service-inner">
			<div class="upper-title-container">
				<p class="-subhead-4 -uppercase upper-title">{{ upperTitle }}</p>
			</div>

			<div class="title-photos-container">
				<div class="top-row">
					<ul class="photos-list">
						<li v-for="(item, i) in photosArraySplit[0]" :key="i" class="item" :style="`--col: ${pairedPositions[i][0]}`">
							<Photo :photo="item" />
						</li>
					</ul>
				</div>
				<div class="middle-row">
					<h2 class="-title-1 -uppercase title">
						<span class="reg">{{ titleSplit[0] }}</span> <span class="thin">{{ titleSplit[1] }}</span>
					</h2>
				</div>
				<div class="bottom-row">
					<ul class="photos-list">
						<li v-for="(item, i) in photosArraySplit[1]" :key="i" class="item" :style="`--col: ${pairedPositions[i][1]}`">
							<Photo :photo="item" />
						</li>
					</ul>
				</div>
			</div>

			<div class="description-container">
				<p class="-subhead-2 -uppercase description">{{ description }}</p>
			</div>

			<div class="details-container">
				<div class="inner">
					<ul class="details-list">
						<li v-for="(item, i) in detailList" :key="i" class="item" :data-type="item._type">
							<ImageAsset v-if="item._type === 'imageItem'" :asset="item" class="media" :style="`max-width: ${item.width / 2}px;`" sizes="xsmall:200px medium:400px xlarge:400px" />

							<ClientOnly>
								<component
									:is="RiveAsset"
									v-if="RiveAsset && item._type === 'animationItem'"
									:asset="item"
									class="media animation"
									:width="item.fallbackImage?.width"
									:height="item.fallbackImage?.height"
									:style="`height: ${item.fallbackImage?.height / 2}px;`"
									ref="riveAnimations"
								/>
							</ClientOnly>

							<Card v-if="item._type === 'item'" v-bind="item" :index="setCardIndex(i)" :type="setCardIndex(i) % 2 === 0 ? 'odd' : 'even'" />
						</li>
					</ul>
					<ul class="details-list">
						<li v-for="(item, i) in detailList" :key="i" class="item" :data-type="item._type">
							<ImageAsset v-if="item._type === 'imageItem'" :asset="item" class="media" :style="`max-width: ${item.width / 2}px;`" sizes="xsmall:200px medium:400px xlarge:400px" />

							<ClientOnly>
								<component
									:is="RiveAsset"
									v-if="RiveAsset && item._type === 'animationItem'"
									:asset="item"
									class="media animation"
									:width="item.fallbackImage?.width"
									:height="item.fallbackImage?.height"
									:style="`height: ${item.fallbackImage?.height / 2}px;`"
									ref="riveAnimations"
								/>
							</ClientOnly>

							<Card v-if="item._type === 'item'" v-bind="item" :index="setCardIndex(i)" :type="setCardIndex(i) % 2 === 0 ? 'odd' : 'even'" />
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap, Draggable, InertiaPlugin } from 'gsap/all'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import.meta.client && gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin)

import { useScreen } from 'vue-screen'
import { splitArray } from '~/utils/arrays'
import { imgLoaded } from '~/utils/dom'
import { breakpoints } from '~/config'

import { ImageAsset, RiveAsset } from '~/components/core'

import Card from './components/Card.vue'
import Photo from './components/Photo.vue'

const props = defineProps({
	subtitle: { type: String, default: '' },
	description: { type: String, default: '' },
	color: { type: String, default: '' },
	upperTitle: { type: String, default: '' },
	title: { type: String, default: '' },
	photos: { type: [Boolean, Array], default: false },
	detailList: { type: [Boolean, Array], default: false },
	index: { type: Number, default: 0 },
})

const context = inject('pageContext')
const screen = useScreen()

const el = ref(null)
const titleTl = gsap.timeline({ paused: true })

let observer
let parallaxObserver
let titleObserver
const memoValues = {}
const titleSplit = computed(() => props.title.split(' '))
watch(screen, () => memoDOMValues())

let inViewportObserver

const riveAnimations = ref([])

const photosArraySplit = computed(() => splitArray(props.photos, 2))

const theme = computed(() => {
	switch (props.color.toLowerCase()) {
		case '#ffe000':
			return 'dark'
		case '#b76eff':
			return 'dark-stream'
		case '#f7bbce':
			return 'dark-pilates'
		case '#d9f7bb':
			return 'dark-nutrition'
		case '#f6c548':
			return 'dark-subduedYellow'
	}
})

const pairedPositions = ref([
	[1, 1],
	[2, 2],
	[3, 3],
	[4, 4],
	[5, 5],
])
// Generate a derangement using Sattolo's algorithm.
const sattoloShuffle = (array) => {
	const arr = [...array]
	for (let i = arr.length - 1; i > 0; i--) {
		// Choose an index from 0 to i-1 (Sattolo's algorithm)
		const j = Math.floor(Math.random() * i)
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
	return arr
}

const generatePairs = () => {
	const indices = [1, 2, 3, 4, 5, 6]
	// Shuffle the top indices randomly.
	const topIndices = gsap.utils.shuffle([...indices])
	// Generate a derangement of the top indices for the bottom row.
	const bottomIndices = sattoloShuffle([...topIndices])

	// Validate that no pair has the same value.
	for (let i = 0; i < indices.length; i++) {
		if (topIndices[i] === bottomIndices[i]) {
			// If any pair matches, re-run the function.
			return generatePairs()
		}
	}

	// Otherwise, pair them up.
	return topIndices.map((top, i) => [top, bottomIndices[i]])
}

const setCardIndex = (i) => {
	// Initialize a counter for 'item' type elements
	let itemCount = 0

	// Loop through the array up to the current item's position
	for (let j = 0; j <= i; j++) {
		if (props.detailList[j]._type === 'item') {
			itemCount++
		}
	}

	// Return the count of 'item' type elements found so far
	return itemCount
}

const handleIntersection = (entries) => {
	if (entries.length > 0) {
		const entry = entries[0]
		const intersect = entry.intersectionRatio === 0 ? false : true

		if (intersect) {
			riveAnimations.value[entry.target.index]?.play()
		}
	}
}

const memoDOMValues = () => {
	memoValues.paddingBottom = parseFloat(getComputedStyle(el.value.querySelector('.service-inner')).paddingBottom)
	memoValues.height = Math.round(el.value.getBoundingClientRect().height)
	memoValues.carrouselWidth = el.value.querySelector('.inner').getBoundingClientRect().width
	memoDOMValues.wrapX = gsap.utils.wrap(-memoValues.carrouselWidth / 2, 0)
}

const setup = () => {
	pairedPositions.value = generatePairs()
	memoDOMValues()

	inViewportObserver = new IntersectionObserver(handleIntersection, {
		root: el.value,
		rootMargin: '-250px',
		threshold: 0,
	})

	el.value.querySelectorAll('.animation').forEach((element, i) => {
		element.index = i
		inViewportObserver.observe(element)
	})

	titleTl.fromTo(
		el.value.querySelector('.title .reg'),
		{
			fontVariationSettings: props.index % 2 ? "'wdth' 40, 'wght' 150" : "'wdth' 0, 'wght' 400",
		},
		{
			fontVariationSettings: props.index % 2 ? "'wdth' 0, 'wght' 400" : "'wdth' 40, 'wght' 150",
			duration: 1,
		},
		0,
	)

	titleTl.fromTo(
		el.value.querySelector('.title .thin'),
		{
			fontVariationSettings: props.index % 2 ? "'wdth' 0, 'wght' 400" : "'wdth' 40, 'wght' 150",
		},
		{
			fontVariationSettings: props.index % 2 ? "'wdth' 40, 'wght' 150" : "'wdth' 0, 'wght' 400",
			duration: 1,
		},
		0,
	)
}

const initInfiniteDrag = () => {
	const carousel = el.value.querySelector('.inner')

	Draggable.create(carousel, {
		type: 'x',
		inertia: true,
		allowContextMenu: true,
		edgeResistance: 0.9,
		dragResistance: 0.5,
		onDrag: updateLoop,
		onDragEnd: updateLoop,
		// onThrow: updateLoop,
		// onThrowEnd: updateLoop,
		onThrowUpdate: updateLoop,
		onUpdate: updateLoop,
	})

	// Modifier function to ensure infinite wrapping without breaking at high speeds
	function updateLoop() {
		const x = gsap.getProperty(carousel, 'x')
		gsap.set(carousel, { x: memoDOMValues.wrapX(x) }) // Ensures it wraps seamlessly
	}

	function startAutoScroll() {
		const currentX = gsap.getProperty(carousel, 'x')
		const duration = (memoValues.carrouselWidth * 40) / (screen.width * 5)

		gsap.to(carousel, {
			x: currentX - memoValues.carrouselWidth / 2,
			duration: duration,
			ease: 'none',
			repeat: -1,
		})
	}

	startAutoScroll()

	carousel.addEventListener('mouseenter', () => {
		gsap.killTweensOf(carousel) // Stop animation
	})

	carousel.addEventListener('mouseleave', () => {
		startAutoScroll()
	})
}

const init = () => {
	initInfiniteDrag()

	titleObserver = ScrollTrigger.create({
		trigger: el.value,
		start: 'top bottom',
		end: () => `bottom+=${screen.height * 2}px bottom`,
		onUpdate: ({ progress }) => screen.width > breakpoints.small && titleTl.progress(progress),
	})

	if (!el.value.classList.contains('last-card')) {
		parallaxObserver = ScrollTrigger.create({
			trigger: el.value,
			start: 'top top',
			end: () => `bottom+=${memoValues.paddingBottom}px bottom`,
			onUpdate: ({ progress }) => {
				gsap.set(el.value.querySelector('.service-inner'), {
					y: Math.max(memoValues.height + memoValues.paddingBottom * 0.5 - screen.height, 0) * progress * -1,
				})
			},
		})

		gsap.to(el.value, {
			yPercent: -40,
			scale: 1,
			z: -200,
			rotationX: 25,
			opacity: 0,
			ease: 'none',
			scrollTrigger: {
				trigger: el.value,
				start: () => `bottom+=${memoValues.paddingBottom}px bottom`,
				end: `bottom+=${screen.height}px bottom`,
				scrub: true,
			},
		})
	}
}

const kill = () => {
	inViewportObserver?.disconnect()

	titleObserver?.kill()
	parallaxObserver?.kill()
	observer?.kill()
	titleTl?.kill()
	gsap.killTweensOf(el.value)
}

onBeforeUnmount(() => kill())
onMounted(async () => {
	el.value.querySelectorAll('img').forEach((el) => {
		const imgLoad = imgLoaded(el)
		context.$page.loader.deferLoad(imgLoad)
	})

	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='service'] {
	position: relative;
	overflow: hidden;
	margin-top: calc(var(--menu-gap) / 2);

	.service-inner {
		position: relative;
		padding-bottom: calc(var(--menu-gap) * 2);

		display: flex;
		flex-direction: column;
		width: 100%;

		background-color: var(--service-backgroundColor, var(--color-yellow));

		transform-origin: center;
		will-change: transform, opacity;
	}

	.upper-title-container {
		position: relative;
		padding: rs(58) 0;

		.upper-title {
			margin-left: calc(var(--grid-padding) + var(--grid-gutter) + #{n_grid_columns(1)});
			width: n_grid_columns(2.2);

			@include max-screen($small) {
				width: n_grid_columns(5);
			}
			@include max-screen($xsmall) {
				width: n_grid_columns(8);
			}
		}
	}

	.title-photos-container {
		position: relative;

		display: flex;
		flex-direction: column;
		align-items: center;
		border-bottom: 1px solid rgb(from var(--color-darkBrown) r g b / 0.2);

		:deep(canvas) {
			position: absolute;
			top: 0;
			left: 0;

			pointer-events: none;
			width: 100%;
			height: 100%;
		}

		.top-row {
			position: relative;
			border-top: 1px solid rgb(from var(--color-darkBrown) r g b / 0.2);
			width: 100%;
		}

		.middle-row {
			position: relative;
			padding: rs(14) 0;

			display: grid;
			grid-template-columns: 1fr auto 1fr;
			grid-template-rows: 1fr;

			justify-content: center;
			align-items: center;

			width: 100%;
			border-top: 1px solid rgb(from var(--color-darkBrown) r g b / 0.2);

			@include max-screen($small) {
				grid-template-columns: 1fr;
			}

			.title {
				grid-column: 2;

				@include max-screen($small) {
					grid-column: 1;
				}
			}
		}

		.bottom-row {
			position: relative;
			display: flex;
			justify-content: center;

			width: 100%;
			border-top: 1px solid rgb(from var(--color-darkBrown) r g b / 0.2);

			display: none;
		}

		.photos-list {
			padding: rs(30) 0;

			display: grid;
			grid-template-columns: repeat(5, 1fr);
			grid-template-rows: 1fr;
			align-items: center;
			justify-items: center;
			gap: rs(24);
			width: 100%;

			.item {
				position: relative;

				grid-column: var(--col, 1);
				grid-row: 1;

				width: rs(188);
				height: rs(188);
				border-radius: rs(188);

				transform-origin: center;
			}
		}

		.title {
			flex-shrink: 0;

			font-size: rs(210);

			@include max-screen($small) {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: flex-start;
				width: 100%;
				text-align: center;
			}

			.reg {
				font-family: inherit;
				font-size: inherit;
				letter-spacing: inherit;
				line-height: inherit;
				font-variation-settings: inherit;
				font-variation-settings:
					'wdth' 40,
					'wght' 150;

				transition: font-variation-settings 0.25s ease(out-expo);

				@include max-screen($small) {
					width: 100%;
					border-bottom: 1px solid rgb(from var(--color-darkBrown) r g b / 0.2);
					padding-bottom: rs(10);
				}
			}
			.thin {
				font-family: inherit;
				font-size: inherit;
				letter-spacing: inherit;
				line-height: inherit;
				font-variation-settings: inherit;
				font-variation-settings:
					'wdth' 0,
					'wght' 400;

				transition: font-variation-settings 0.25s ease(out-expo);

				@include max-screen($small) {
					padding-top: rs(20);
				}
			}
		}
	}

	.description-container {
		position: relative;
		padding: rs(58) 0;

		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;

		.description {
			width: n_grid_columns(10);
			text-align: center;

			@include max-screen($xsmall) {
				width: n_grid_columns(14);
			}
		}
	}

	.details-container {
		position: relative;

		width: 100%;
		overflow: hidden;

		.inner {
			display: flex;
			flex-wrap: nowrap;
			width: max-content;

			will-change: transform;
		}

		.details-list {
			display: flex;
			align-items: flex-end;

			white-space: nowrap;
			gap: calc(var(--grid-padding) + var(--grid-gutter));
			padding-right: calc(var(--grid-padding) + var(--grid-gutter));

			.media {
				border-radius: rs(12);
				overflow: hidden;
				max-height: rs(380);
				width: auto;
			}
		}
	}
}
</style>
