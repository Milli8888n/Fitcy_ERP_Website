<template>
	<div ref="el" data-component="anchors">
		<span class="progress" />
		<ul class="list">
			<li v-if="anchorsRef" v-for="(item, i) in anchorsRef" :key="i" class="item" :data-index="i" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
				<span class="label-container">
					<VariableLabel ref="rollHoverLabelRef" :label="item.label" />
				</span>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { VariableLabel } from '~/components/primitives'

const props = defineProps({})

const el = ref(null)
const anchorsRef = ref(false)
const rollHoverLabelRef = ref([])
const scroller = inject('$scroller')
let sections
const progressIntervals = []
const observers = []

const setup = () => {}
const init = () => {}
const kill = () => {}

const getOffsetElements = (elements) => {
	if (!elements.length) return { minOffsetTopElement: null, maxOffsetBottomElement: null }

	let minOffsetTopElement = null
	let maxOffsetBottomElement = null

	let minOffsetTop = Infinity
	let maxOffsetBottom = -Infinity

	elements.forEach((element) => {
		const offsetTop = element.offsetTop
		const offsetBottom = offsetTop + element.offsetHeight

		if (offsetTop < minOffsetTop) {
			minOffsetTop = offsetTop
			minOffsetTopElement = element
		}

		if (offsetBottom > maxOffsetBottom) {
			maxOffsetBottom = offsetBottom
			maxOffsetBottomElement = element
		}
	})

	return { minOffsetTopElement, maxOffsetBottomElement }
}

const resize = () => {
	gsap.set(el.value, { clearProps: 'width' })

	nextTick(() => {
		gsap.to(el.value, {
			width: el.value.querySelector('.list').offsetWidth,
			duration: 1,
			ease: 'expo.inOut',
			onComplete: () => {
				computeProgressIntervals()
				addTriggers()
			},
		})
	})
}

const refreshAnchors = () => {
	sections = document.querySelectorAll('[data-anchor]')
	const { minOffsetTopElement, maxOffsetBottomElement } = getOffsetElements(sections)

	const aux = []
	sections.forEach((elem) => {
		const obj = {}
		obj.label = elem.dataset.anchor
		obj.element = elem
		aux.push(obj)
	})

	let tm = 0
	if (aux.length === 0 && anchorsRef.value.length > 0) {
		tm = 200

		gsap.killTweensOf(el.value.querySelector('.progress'))
		gsap.to(el.value.querySelector('.progress'), { scaleX: 0, duration: 0.5 })
		gsap.fromTo(
			el.value.querySelectorAll('.list .item'),
			{
				opacity: 1,
				y: 0,
			},
			{
				opacity: 0,
				y: 5,
				duration: 0.5,
				stagger: 0.025,
				ease: 'expo.out',
			}
		)
	}

	setTimeout(() => {
		if (aux.length) {
			anchorsRef.value = aux

			nextTick(() => {
				gsap.to(el.value, {
					width: el.value.querySelector('.list').offsetWidth,
					duration: 1,
					ease: 'expo.inOut',
					onComplete: () => {
						computeProgressIntervals()
						addTriggers()
					},
				})

				gsap.to(el.value.querySelectorAll('.list .item'), {
					opacity: 1,
					y: 0,
					duration: 0.75,
					stagger: 0.1,
					delay: 0.25,
					ease: 'expo.out',
				})
			})
		} else {
			gsap.to(el.value, {
				width: 0,
				duration: 1,
				ease: 'expo.inOut',
				onComplete: () => (anchorsRef.value = aux),
			})

			if (el.value.querySelectorAll('.list .item').length)
				gsap.to(el.value.querySelectorAll('.list .item'), {
					opacity: 0,
					y: -10,
					duration: 0.5,
					stagger: 0.1,
					delay: 0.25,
				})
		}
	}, tm)
}

const computeProgressIntervals = () => {
	const barWidth = el.value.getBoundingClientRect().width

	el.value.querySelectorAll('.list .item').forEach((item, i) => {
		const { width } = item.getBoundingClientRect()
		progressIntervals.push(width / barWidth)
	})
}

const addTriggers = () => {
	el.value.querySelectorAll('.list .item').forEach((item, i) => {
		const section = sections[i]
		const trigger = ScrollTrigger.create({
			trigger: section,
			start: 'top top',
			end: 'bottom top',
			onUpdate: ({ progress }) => {
				const outMin = i === 0 ? 0 : progressIntervals.slice(0, i).reduce((sum, value) => sum + value, 0)
				const outMax = outMin + progressIntervals[i]
				const mapProgress = gsap.utils.mapRange(0, 1, outMin, outMax, progress)

				gsap.to(el.value.querySelector('.progress'), { scaleX: mapProgress })
			},
		})

		observers.push(trigger)
	})
}

const handleClick = (e) => {
	const targetIndex = Number(e.target.closest('li').dataset.index)
	const targetEl = sections[targetIndex]

	scroller && scroller.value.scrollTo(targetEl.offsetTop)
}

const handleMouseEnter = (e) => {
	const index = Number(e.target.closest('.item').dataset.index)
	rollHoverLabelRef.value[index].setForceHover(true)
}
const handleMouseLeave = (e) => {
	const index = Number(e.target.closest('.item').dataset.index)
	rollHoverLabelRef.value[index].setForceHover(false)
}

onBeforeUnmount(() => {
	observers?.forEach((observer) => observer.kill())
	observers.length = 0
})
onMounted(() => {})

defineExpose({ refreshAnchors, resize })
</script>

<style lang="scss" scoped>
[data-component='anchors'] {
	position: relative;
	left: 2px;

	display: flex;
	height: rs(54, 48);
	width: 0;
	overflow: hidden;

	background-color: var(--menu-secondaryBackgroundColor, var(--color-lightYellow));
	pointer-events: visible;

	.progress {
		position: absolute;
		inset: 0;

		display: block;
		background-color: var(--menu-backgroundColor, var(--color-yellow));

		transform: scaleX(0);
		transform-origin: left;
	}

	.list {
		display: flex;
		flex: 1;
		height: 100%;
		align-items: center;

		.item {
			position: relative;

			display: flex;
			align-items: center;
			height: 100%;
			padding: 0 rs(12);

			cursor: pointer;

			&:first-child {
				padding-left: rs(24);
			}
			&:last-child {
				padding-right: rs(24);
			}

			.label {
				position: relative;
				white-space: nowrap;

				display: block;
				opacity: 0.7;
				transition: font-variation-settings 0.25s ease(out-expo);
			}

			@media (hover: hover) {
				&:hover {
					.label {
						opacity: 1;
						font-variation-settings: 'wdth' 0, 'wght' 650;
					}
				}
			}
		}
	}
}
</style>
