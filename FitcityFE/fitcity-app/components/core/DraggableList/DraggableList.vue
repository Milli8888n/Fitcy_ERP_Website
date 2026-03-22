<template>
	<div ref="el" data-component="draggable-list" :class="haveHandler ? '' : 'no-handler'">
		<slot />

		<div v-if="isActive" class="custom-scrollbar" @mousedown="handleScrollbarClick">
			<div class="scroll-thumb"></div>
		</div>
	</div>
</template>

<script setup>
import { gsap, Draggable, InertiaPlugin } from 'gsap/all'
import { useScreen } from 'vue-screen'
import { getActiveContext } from '~/components/core/Page/context.js'

gsap.registerPlugin(Draggable)
gsap.registerPlugin(InertiaPlugin)

const props = defineProps({
	active: { type: Boolean, default: true },
	haveHandler: { type: Boolean, default: true },
	forceReload: { type: Boolean, default: false },
})

const el = ref(null)
const isActive = ref(props.active)
const screen = useScreen()

let dragList = null
let dargHandler = null

watch(
	() => screen.width,
	() => reload(),
)
const setup = () => {
	props.active && gsap.set(el.value, { opacity: 0 })
}

const init = () => {
	if (!props.active) {
		isActive.value = false
		return
	} else {
		isActive.value = true
	}

	const elBounding = el.value.getBoundingClientRect()
	const dragListBounding = el.value.children[0].getBoundingClientRect()

	isActive.value = dragListBounding.width > elBounding.width
	gsap.set(el.value, { opacity: 1 })

	if (!isActive.value) return

	nextTick(() => {
		const scrollbarBounding = el.value.querySelector('.custom-scrollbar').getBoundingClientRect()
		const thumbWidth = (elBounding.width / dragListBounding.width) * scrollbarBounding.width
		const scrollThumb = el.value.querySelector('.scroll-thumb')

		scrollThumb.style.width = `${thumbWidth}px`

		dragList = Draggable.create(el.value.children[0], {
			type: 'x',
			bounds: el.value,
			inertia: true,
			edgeResistance: 0.98,
			dragResistance: 0.4,
			throwResistance: 0.9,
			onClick: function () {},
			onDrag: function () {
				updateHandler(-this.x)
			},
			onThrowUpdate: function () {
				updateHandler(-this.x)
			},
			onDragEnd: function () {
				updateHandler(-this.x)
			},
		})

		dargHandler = Draggable.create(el.value.querySelector('.scroll-thumb'), {
			type: 'x',
			bounds: el.value.querySelector('.custom-scrollbar'),
			inertia: true,
			edgeResistance: 0.9,
			dragResistance: 0.2,
			onClick: function () {},
			onDrag: function () {
				updateList(-this.x)
			},
			onThrowUpdate: function () {
				updateList(-this.x)
			},
			onDragEnd: function () {
				updateList(-this.x)
			},
		})
	})
}

const updateHandler = (x) => {
	const elBounding = el.value.getBoundingClientRect()
	const dragListBounding = el.value.children[0].getBoundingClientRect()
	const scrollbarBounding = el.value.querySelector('.custom-scrollbar').getBoundingClientRect()
	const thumbBounding = el.value.querySelector('.scroll-thumb').getBoundingClientRect()
	const scrollThumb = el.value.querySelector('.scroll-thumb')

	const scrollLeft = gsap.utils.mapRange(0, dragListBounding.width - elBounding.width, 0, scrollbarBounding.width - thumbBounding.width, x)

	gsap.set(scrollThumb, { x: scrollLeft })
}

const updateList = (x) => {
	const elBounding = el.value.getBoundingClientRect()
	const dragListBounding = el.value.children[0].getBoundingClientRect()
	const scrollbarBounding = el.value.querySelector('.custom-scrollbar').getBoundingClientRect()
	const thumbBounding = el.value.querySelector('.scroll-thumb').getBoundingClientRect()
	const dragList = el.value.children[0]

	const scrollLeft = gsap.utils.mapRange(0, scrollbarBounding.width - thumbBounding.width, 0, dragListBounding.width - elBounding.width, x)

	gsap.set(dragList, { x: scrollLeft })
}

const reload = () => {
	kill()
	nextTick(() => init())
}

const kill = () => {
	dragList && dragList[0].kill()
	dargHandler && dargHandler[0].kill()
	gsap.set([el.value.children[0], el.value.querySelector('.scroll-thumb')], { clearProps: 'all' })

	dragList = null
	dargHandler = null
}

onBeforeUnmount(() => kill())
onMounted(() => {
	const context = getActiveContext()

	context.loader.loaded.then(() => setup())
	context.loader.ready.then(() => init())
})

defineExpose({ reload, kill })
</script>

<style lang="scss" scoped>
[data-component='draggable-list'] {
	position: relative;

	display: flex;
	flex-direction: column;
	gap: rs(46);
	width: 100%;
	overflow: hidden;

	&.no-handler {
		.custom-scrollbar {
			display: none;
		}
	}

	.custom-scrollbar {
		position: relative;

		width: n_grid_columns(12);
		height: rs(6);
		background-color: rgb(from var(--draggableList-color, var(--color-white)) r g b / 0.14);
		border-radius: rs(12);
		margin: 0 auto;

		@include extend_hitbox(10);

		.scroll-thumb {
			position: absolute;
			height: 100%;
			width: rs(50); /* Initially a size */
			background-color: var(--draggableList-accentColor, var(--color-white));
			border-radius: 5px;
			cursor: pointer;

			@include extend_hitbox(20);
		}
	}
}
</style>
