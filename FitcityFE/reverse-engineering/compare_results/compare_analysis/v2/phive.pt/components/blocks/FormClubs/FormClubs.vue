<template>
	<div v-if="list" ref="el" data-component="form-clubs" data-section-intersect="dark">
		<div class="inner">
			<div class="title-container">
				<h3 class="-label-1 -uppercase title">{{ title }}</h3>
			</div>

			<div class="clubs-container">
				<ClubsCards ref="clubsCards" :list="list" class="clubs-cards" :enter-animation="false" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap/all'
import { ClubsCards } from '~/components/fragments'
import { useEmitter } from '~/composables/core'
import { getActiveContext } from '~/components/core'

// import { useSelectedClub } from './useSelectedClub'

const props = defineProps({
	title: { type: String, default: '' },
	list: { type: Array, default: () => [] },
})

const el = ref(null)
const clubsCards = ref(null)
// const { setClub } = useSelectedClub()
const emitter = useEmitter()

const setup = () => {}
const init = () => {
	gsap.fromTo(
		el.value.querySelector('.inner'),
		{
			autoAlpha: 0,
			y: 20,
		},
		{
			autoAlpha: 1,
			y: 0,
			duration: 1,
			delay: 1,
			ease: 'power2.out',
		},
	)
}
const kill = () => {}

const hide = () => {
	if (el.value) gsap.to(el.value.querySelector('.inner'), { autoAlpha: 0, ease: 'power4.out', duration: 0.5 })
}

onBeforeUnmount(() => {
	emitter.off('form-submit', hide)
})
onMounted(() => {
	if (!props.list || props.list.length === 0) return

	emitter.on('form-submit', hide)

	const context = getActiveContext()
	context.loader.loaded.then(() => setup())
	context.loader.ready.then(() => init())

	// watch(clubsCards.value.getActiveClub(), (newValue, oldValue) => {
	// 	const activeClub = props.list[newValue]
	// 	setClub(activeClub)
	// })
})
</script>

<style lang="scss" scoped>
[data-component='form-clubs'] {
	--clubsCards-backgroundColor: var(--color-yellow);
	--clubsCards-color: var(--color-darkBrown);

	position: relative;
	padding-bottom: rs(50, 36);

	background-color: var(--color-yellow);
	color: var(--color-darkBrown);

	display: flex;
	justify-content: center;
	width: 100%;

	.inner {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: rs(24);
		width: rs(1100, 410);
		max-width: rs(1100, 410);

		opacity: 0;

		@include max-screen($xsmall) {
			width: 100%;
			max-width: none;
		}
	}

	.clubs-container {
		position: relative;
		width: 100%;

		.clubs-cards {
			--draggableList-accentColor: var(--color-darkBrown);
			--draggableList-color: var(--color-midBrown);
		}

		@include max-screen($small) {
			width: n_grid_columns(10);
		}

		@include max-screen($xsmall) {
			width: 100%;
		}
	}
}
</style>
