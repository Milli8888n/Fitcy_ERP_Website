<template>
	<div ref="el" data-component="clubs-cards">
		<div class="cards-wrapper">
			<DraggableList :have-handler="true">
				<div class="inner">
					<button v-for="(item, i) in orderedList" :key="i" :data-index="i" :class="`club ${i === activeClub ? 'active' : ''}`" @click="handleClubClick">
						<div class="media-container">
							<MediaAsset v-if="item.thumb" :media="item.thumb" class="media" sizes="xsmall:100px" />
							<span v-else class="media media-placeholder"> P </span>
						</div>
						<h2 class="-title-6 -uppercase club-title">{{ item.title }}</h2>
					</button>
				</div>
			</DraggableList>
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'
import { DraggableList } from '~/components/core'
import MediaAsset from '~/components/core/MediaAsset/MediaAsset.vue'

import { getActiveContext } from '~/components/core'

import { reorderArray } from '~/utils/arrays'
import { useEnterAnimation } from '~/composables/core'

import { useSelectedClub } from '~/components/blocks/FormClubs/useSelectedClub'

const props = defineProps({
	list: { type: Array, default: () => [] },
	activeClub: { type: [Boolean, String], default: false },
	initialIndex: { type: Number, default: -1 },
	enterAnimation: { type: Boolean, default: true },
	isClubs: { type: Boolean, default: false },
})

const el = ref(null)
const activeClub = ref(props.initialIndex)
const orderedList = ref([])
const tl = gsap.timeline({ paused: true })
const enterAnimation = useEnterAnimation()
const { setClub } = useSelectedClub()

const handleClubClick = (e) => {
	const club = e.target.closest('.club')
	const slug = orderedList.value[Number(club.dataset.index)].link.path.split('/').filter(Boolean).pop()

	activeClub.value = Number(club.dataset.index)

	setClub(orderedList.value[activeClub.value])

	// const urlParams = new URLSearchParams(window.location.search)
	// urlParams.set('club', slug)
	// const newUrl = window.location.pathname + '?' + urlParams.toString()
	// history.pushState(null, '', newUrl)
}

const setup = () => {
	if (!props.enterAnimation) return
	tl.from(el.value.querySelectorAll('.club'), { y: 20, opacity: 0, stagger: 0.1, ease: 'expo.out', duration: 0.75 })
}
const init = () => {
	if (!props.enterAnimation) return
	enterAnimation.init({
		trigger: el.value,
		timeline: tl,
	})
}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	const club = urlParams.get('club')

	if (club) {
		const activeIndex = props.list.findIndex((el) => el.link?.path.includes(club))
		orderedList.value = props.isClubs ? props.list : reorderArray(props.list, activeIndex, 0)
		activeClub.value = 0

		setClub(props.list[activeIndex])
	} else {
		orderedList.value = props.list
		activeClub.value = 0
		setClub(props.list[0])
	}

	context.loader.loaded.then(() => setup())
	context.loader.ready.then(() => init())
})

defineExpose({ getActiveClub: () => activeClub })
</script>

<style lang="scss" scoped>
[data-component='clubs-cards'] {
	--draggableList-accentColor: var(--color-subduedYellow);

	position: relative;

	display: flex;
	justify-content: center;
	flex-direction: column;
	gap: rs(48);
	width: 100%;

	background-color: var(--clubsCards-backgroundColor, var(--color-darkBrown));

	.cards-wrapper {
		display: flex;
		width: 100%;
	}
	.inner {
		display: flex;
		justify-content: center;
		gap: rs(12, 12);
		width: max-content;
		min-width: 100%;

		will-change: transform;

		@include max-screen($xsmall) {
			padding: 0 var(--grid-inset);
		}
	}

	.club {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: rs(12);
		padding: rs(12, 6) rs(12, 6) rs(18, 9) rs(12, 6);
		width: rs(154, 84);

		color: var(--clubsCards-color, var(--color-lightYellow));
		border: 1px solid rgb(from var(--clubsCards-color, var(--color-lightYellow)) r g b / 0.5);

		transition:
			color 0.25s ease(out-expo),
			background-color 0.25s ease(out-expo),
			border 0.25s ease(out-expo);
		@include max-screen($small) {
			flex: 1 1 0;
			width: auto;
			max-width: rs(154, 100);
		}
		@media (hover: hover) {
			&:hover {
				background-color: var(--clubsCards-color, var(--color-subduedYellow));
				color: var(--clubsCards-backgroundColor, var(--color-darkBrown));
				border: 1px solid transparent;
			}
		}

		&.active {
			background-color: var(--clubsCards-color, var(--color-subduedYellow));
			color: var(--clubsCards-backgroundColor, var(--color-darkBrown));
			border: 1px solid transparent;
		}

		.media-container {
			height: rs(90, 60);
			width: 100%;

			.media {
				width: 100%;
				height: 100%;
				object-fit: cover;

				&.media-placeholder {
					content: 'P';

					display: flex;
					align-items: center;
					justify-content: center;

					@include title-5;

					color: var(--color-yellow);
					background-color: var(--color-lightBrown);
				}
			}
		}

		.club-title {
			padding-right: 20%;

			font-size: rs(30, 17);
			letter-spacing: 0em;
			text-align: left;
		}
	}

	.custom-scrollbar {
		position: relative;

		width: n_grid_columns(12);
		height: rs(6);
		background-color: rgb(from var(--color-white) r g b / 0.14);
		border-radius: rs(12);
		margin: 0 auto;

		@include extend_hitbox(10);

		display: none;

		.scroll-thumb {
			position: absolute;
			height: 100%;
			width: rs(50); /* Initially a size */
			background-color: var(--color-white);
			border-radius: 5px;
			cursor: pointer;
		}
	}
}
</style>
