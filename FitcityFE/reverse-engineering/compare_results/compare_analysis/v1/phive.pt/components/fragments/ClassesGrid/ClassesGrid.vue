<template>
	<div ref="el" data-component="classes-grid" :class="`${sliderType}`">
		<div class="classes-categories">
			<DraggableList :have-handler="false">
				<div class="inner">
					<p class="-label-1 -uppercase filter-label">{{ $t('filter', 'Filtrar') }}</p>

					<ul class="categories-list">
						<li class="item" @click="handleCategoryClick" :data-index="0" data-category="all">
							<TagButton :label="$t('all', 'Todas')" :active-state="activeCategoryIndex === 0" />
						</li>
						<li v-for="(item, i) in categories" :key="i" class="item" :data-category="item && item.slug" :data-index="i + 1" @click="handleCategoryClick">
							<TagButton :label="item.name" :active-state="i + 1 === activeCategoryIndex" />
						</li>
					</ul>
				</div>
			</DraggableList>
		</div>

		<div class="list-container">
			<DraggableList ref="dragList" :active="sliderType === 'slider'">
				<ul class="list">
					<li
						v-for="(item, i) in list"
						:key="i"
						:class="`item ${item.category.slug === activeCategorySlug || activeCategorySlug === 'all' ? 'active' : 'inactive'} `"
						:data-category="item.category.slug"
					>
						<div class="item-inner">
							<ClassCard ref="classCards" v-bind="item" class="card" />
						</div>
					</li>
				</ul>
			</DraggableList>
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { ClassCard } from '~/components/fragments'
import { TagButton } from '~/components/primitives'
import { DraggableList } from '~/components/core'

import { useScreen } from 'vue-screen'

import { useStringTranslation } from '@/i18n'

import { breakpoints } from '~/config'

const props = defineProps({
	list: { type: Array, default: () => [] },
	type: { type: String, default: 'grid' },
})

const $t = useStringTranslation()

const el = ref(null)
const context = inject('pageContext')
const activeCategoryIndex = ref(0)
const activeCategorySlug = ref('all')
const dragList = ref(null)
const isAnimated = ref(false)
const classCards = ref([])

const categories = computed(() => {
	const agg = []
	props.list && props.list.forEach((el) => agg.push(el.category))
	const reduced = agg.filter((value, index, self) => index === self.findIndex((t) => t && value && t.slug === value.slug))

	return reduced
})

const handleCategoryClick = (elem) => {
	const targetIndex = Number(elem.target.closest('.item').dataset.index)
	const targetSlug = elem.target.closest('.item').dataset.category

	activeCategorySlug.value = targetSlug
	activeCategoryIndex.value = targetIndex

	kill()

	nextTick(() => {
		dragList.value.reload()
		nextTick(() => ScrollTrigger.refresh())
	})
}

// const screen = useScreen()
const sliderType = ref(props.type)

// watch(
// 	() => screen.width,
// 	(newValue) => {
// 		sliderType.value = newValue > breakpoints.xsmall ? props.type : 'grid'
// 	}
// )

const sliderEnterAnimation = () => {
	const items = el.value.querySelectorAll('.item.active .item-inner')

	if (isAnimated.value) {
		gsap.set(el.value.querySelector('.list-container .custom-scrollbar'), { clearProps: 'all' })
		return
	}
	isAnimated.value = true

	const st = ScrollTrigger.create({
		trigger: items,
		start: 'top bottom',
		end: 'top center',
		onEnter: () => {
			classCards.value.forEach((el, i) => {
				el.animateIn(i * 0.1, 'slider')
			})
			st.kill()
		},
	})

	gsap.fromTo(
		el.value.querySelector('.list-container .custom-scrollbar'),
		{
			y: -20,
			opacity: 0,
		},
		{
			y: 0,
			opacity: 1,
			duration: 2,
			delay: 1,
			ease: 'power4.out',
			scrollTrigger: {
				trigger: items,
				start: 'top bottom',
				end: 'top center',
			},
		},
	)

	// const group = [...items].slice(0, 10)
	// gsap.fromTo(
	// 	group,
	// 	{
	// 		x: screen.width / 2,
	// 		opacity: 0,
	// 	},
	// 	{
	// 		x: 0,
	// 		opacity: 1,
	// 		stagger: 0.1,
	// 		duration: 2,
	// 		ease: 'power4.out',
	// 		scrollTrigger: {
	// 			trigger: items,
	// 			start: 'top bottom',
	// 			end: 'top center',
	// 		},
	// 	}
	// )
}

const gridEnterAnimation = () => {
	// const items = el.value.querySelectorAll('.item.active .item-inner')
	// const list = el.value.querySelectorAll('.list-container')

	// const itemsPerRow = screen.width <= breakpoints.xsmall ? 2 : screen.width <= breakpoints.small ? 3 : 4

	// gsap.fromTo(list, { y: 50 }, { y: 0, opacity: 1, ease: 'power4.out', duration: 2 })
	gsap.to([el.value.querySelector('.filter-label'), el.value.querySelectorAll('.categories-list .item')], {
		opacity: 1,
		y: 0,
		stagger: {
			from: 'center',
			each: 0.1,
		},
		ease: 'power4.out',
		duration: 1,
	})

	classCards.value.forEach((el, i) => {
		el.animateIn(i * 0.1, 'grid')
	})
}

const setupEnterAnimation = () => {
	if (sliderType.value === 'grid') {
		gsap.set([el.value.querySelector('.filter-label'), el.value.querySelectorAll('.categories-list .item')], {
			opacity: 0,
			y: 40,
		})
	}
}

const enterAnimation = () => {
	if (sliderType.value === 'slider') {
		sliderEnterAnimation()
	} else {
		gridEnterAnimation()
	}
}

const kill = () => {
	const items = el.value.querySelectorAll('.item.active')
	gsap.killTweensOf(items)
}

onBeforeUnmount(() => kill())
onMounted(() => {
	// sliderType.value = screen.width > breakpoints.xsmall ? props.type : 'grid'
})

defineExpose({ setupEnterAnimation, enterAnimation })
</script>

<style lang="scss" scoped>
[data-component='classes-grid'] {
	--draggableList-accentColor: var(--color-subduedYellow);

	position: relative;

	display: flex;
	flex-direction: column;
	gap: rs(64);

	width: 100%;
	overflow: hidden;

	background-color: var(--color-darkBrown);
	color: var(--color-subduedYellow);

	&.grid {
		.list {
			flex-wrap: wrap;
		}
	}

	&.slider {
		.list {
			flex-wrap: nowrap;
			width: max-content;
			will-change: transform;
		}
	}

	.classes-categories {
		position: relative;
		width: 100%;

		.inner {
			display: flex;
			justify-content: center;
			gap: rs(6);
			width: max-content;
			min-width: 100%;
		}

		.filter-label {
			position: relative;

			display: block;
			padding: rs(12) rs(24);
			border-radius: rs(38);

			.label {
				position: relative;

				display: block;
			}

			color: var(--color-lightYellow);
			opacity: 0.4;
		}

		.categories-list {
			display: flex;
			gap: rs(6);
		}
	}

	.list {
		display: flex;
		gap: calc(var(--grid-gutter) * 2);
		padding: 0 calc(var(--grid-gutter) + var(--grid-padding));

		.item-inner {
			perspective: 1000px;
		}

		.item {
			position: relative;
			flex: 0 0 n_grid_columns(3.998);
			width: n_grid_columns(3.998);

			perspective: 1000px;

			@include max-screen($small) {
				flex: 0 0 n_grid_columns(5.33);
				width: n_grid_columns(5.33);
			}

			@include max-screen($xsmall) {
				flex: 0 0 n_grid_columns(8);
				width: n_grid_columns(8);
			}

			&.inactive {
				display: none;
			}

			.card {
				width: 100%;
			}
		}
	}
}
</style>
