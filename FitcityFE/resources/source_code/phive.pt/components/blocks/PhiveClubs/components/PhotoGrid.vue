<template>
	<div ref="el" data-component="photo-grid">
		<div v-for="(item, i) in gridArr" :key="i" class="photo-container">
			<ImageAsset v-if="item" :asset="item" />
		</div>
	</div>
</template>

<script setup>
import { gsap, Flip } from 'gsap/all'
import seedrandom from 'seedrandom'

import.meta.client && gsap.registerPlugin(Flip)

import { ImageAsset } from '~/components/core'
import { getRandom } from '~/utils/math'

import { useScreen } from 'vue-screen'

const props = defineProps({
	photos: { type: Array, default: () => [] },
})

const el = ref(null)
const context = inject('pageContext')
const screen = useScreen()

let state
let timeline

const rng = seedrandom('photosGrid-seed') // Use a fixed seed for deterministic output
const gridArr = computed(() => {
	// Shuffle the initial array to randomize element order
	const arr = props.photos
	const targetLength = 40
	const nullPositions = [2, 5, 7, 9, 10, 12, 13, 14, 15, 16, 18, 19, 21, 22, 24, 26, 28, 30, 31, 33, 35, 37, 38]

	// Shuffle the initial array to randomize element order
	const shuffledArray = arr
		.slice() // Make a copy
		.sort(() => rng() - 0.5)

	// Create a new array of the target length filled with nulls
	let result = new Array(targetLength).fill(null)

	// Place nulls at specified positions
	nullPositions.forEach((pos) => {
		if (pos < targetLength) {
			result[pos] = null
		}
	})

	// Calculate remaining positions to fill with elements
	const availablePositions = result.reduce((acc, val, index) => {
		if (val === null && !nullPositions.includes(index)) acc.push(index)
		return acc
	}, [])

	// Trim the shuffled array if it has more elements than available positions
	const trimmedArray = shuffledArray.slice(0, availablePositions.length)

	// Place elements from the trimmed shuffled array into available positions
	trimmedArray.forEach((element, i) => {
		result[availablePositions[i]] = element
	})

	return result
})

const setup = () => {}

const init = () => {
	setTimeout(() => {
		state = Flip.getState('.photo-container')
		const containerBounding = el.value.getBoundingClientRect()

		el.value.querySelectorAll('.photo-container').forEach((elem) => {
			const bounding = elem.getBoundingClientRect()
			const randomRot = getRandom(-4, 4)
			const randomXOffset = getRandom(-20, 20)
			const randomYOffset = getRandom(-40, 40)

			gsap.set(elem, {
				position: 'absolute',
				width: bounding.width,
				height: bounding.height * 1.2,
				rotation: randomRot,
				transformOrigin: 'center',
				scale: 1.8,
				top: containerBounding.height / 2 - bounding.height / 2 + randomYOffset,
				left: containerBounding.width / 2 - bounding.width / 2 + randomXOffset,
			})
		})

		timeline = Flip.from(state, {
			paused: true,
			scale: true,
			ease: 'linear',
			stagger: {
				from: 'center',
				each: 0.025,
			},
			absolute: true,
		})
	}, 500)
}
const setTimeline = (progress) => {
	timeline.progress(progress)
}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	context.$page.loader.ready.then(() => init())
})

defineExpose({ setTimeline })
</script>

<style lang="scss" scoped>
[data-component='photo-grid'] {
	position: relative;

	display: grid;
	grid-template-columns: repeat(10, 1fr);
	grid-template-rows: repeat(4, 1fr);
	gap: rs(16);

	height: 100%;
	width: 100%;

	.photo-container {
		overflow: hidden;

		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 100%;
			height: 100%;
			max-height: rs(250);
			object-fit: cover;

			@include max-screen($small) {
				max-height: none;
			}
		}
	}
}
</style>
