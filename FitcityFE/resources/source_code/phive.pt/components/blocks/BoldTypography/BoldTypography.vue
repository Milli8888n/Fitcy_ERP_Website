<template>
	<section ref="el" data-component="bold-typography" data-section-intersect="dark">
		<BoldDesktop v-if="isDesktop" :first-word="firstWord" :second-word="secondWord" :background="background" :parallax-elements="parallaxElements" />
		<BoldMobile v-else :first-word="firstWord" :second-word="secondWord" :background="background" :parallax-elements="parallaxElements" />

		<!-- 
		<div class="parallax-images-container"> 
			<div v-for="(item, i) in parallaxElements" :key="i" class="image-container">
				<ImageAsset :asset="item" :style="`max-width: ${item.width / 2}px;`" class="image" />
			</div> 
		</div> 
		-->

		<!-- 3d is at [...path].vue -->
	</section>
</template>

<script setup>
import BoldDesktop from './components/BoldDesktop.vue'
import BoldMobile from './components/BoldMobile.vue'

// import { ImageAsset } from '~/components/core'

import { useScreen } from 'vue-screen'
import { breakpoints } from '~/config'
// import { useParallax } from '~/composables/core'

const props = defineProps({
	firstWord: { type: String, default: '' },
	secondWord: { type: String, default: '' },
	background: { type: [Boolean, Array], default: false },
	parallaxElements: { type: [Boolean, Array], default: false },
})

// const context = inject('pageContext')
const el = ref(null)
const screen = useScreen()
const isDesktop = ref(false)
// const parallaxArr = []

watch(screen, () => (isDesktop.value = screen.width >= breakpoints.small))
onMounted(() => {
	isDesktop.value = screen.width >= breakpoints.small

	/* context.$page.loader.ready.then(() => {
		el.value.querySelectorAll('.parallax-images-container img').forEach((elem, i) => {
			const friction = i % 2 === 0 ? 1 : -1
			const aux = useParallax({
				element: elem,
				trigger: elem,
				endTrigger: el.value.querySelector('.parallax-images-container'),
				friction,
				start: 'top bottom',
				end: 'bottom top',
			})
			aux.setup()
			parallaxArr.push(aux)
		})
	}) */
})
</script>

<style lang="scss" scoped>
[data-component='bold-typography'] {
	position: relative;

	.parallax-images-container {
		position: absolute;
		// top: 10%;
		top: 0;

		left: 0;

		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		width: 100%;
		height: 75%;

		z-index: 1;

		@include max-screen($xsmall) {
			top: 50%;
		}

		.image-container {
			position: relative;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			width: 100%;
			height: 100%;
			justify-self: center;

			&:nth-child(2),
			&:nth-child(4) {
				align-items: center;
			}

			&:nth-child(1),
			&:nth-child(4) {
				@include max-screen($xsmall) {
					display: none;
				}
			}
		}

		.image {
			position: relative;
			width: auto;
			height: rs(340, 180);
		}
	}
}
</style>
