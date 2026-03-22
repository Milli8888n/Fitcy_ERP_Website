<template>
	<button ref="el" data-component="burger" aria-label="Menu Button" @mouseenter="enter" @mouseleave="leave">
		<ClientOnly>
			<component :is="RiveAsset" v-if="RiveAsset" ref="riveAnimation" :asset="burger" state-machine="State Machine 1" :autoplay="true" layout="contain" :width="96" :height="96" />
		</ClientOnly>
	</button>
</template>

<script setup>
const props = defineProps({
	forceHover: { type: Boolean, default: false },
	color: { type: Number, default: 0 },
})
const el = ref(null)
const riveAnimation = ref(null)

const burger = {
	file: '/rives/burger.riv',
}

const isOpen = ref(false)
const RiveAsset = shallowRef(null)

watch(
	() => props.forceHover,
	(newValue) => (newValue ? enter() : leave())
)

watch(
	() => props.color,
	(newValue) => {
		riveAnimation.value.loaded().then(() => {
			riveAnimation.value.getInput('color').value = newValue
		})
	}
)

const click = () => (isOpen.value ? close() : open())
const enter = () => {
	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('hover').value = true
	})
}
const leave = () => {
	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('hover').value = false
	})
}

const open = () => {
	riveAnimation.value.getInput('close').value = true
	isOpen.value = true
}
const close = () => {
	riveAnimation.value.getInput('close').value = false
	isOpen.value = false
}

onMounted(async () => {
	const module = await import('~/components/core/RiveAsset/RiveAsset.vue')
	RiveAsset.value = module.default

	// Ensure initial color is set after Rive is ready
	nextTick(() => {
		riveAnimation.value?.loaded().then(() => {
			const colorInput = riveAnimation.value.getInput('color')
			if (colorInput) {
				colorInput.value = props.color
			}
		})
	})
})
defineExpose({ close, open, click, enter, leave })
</script>

<style lang="scss" scoped>
[data-component='burger'] {
	position: relative;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: rs(8, 8);

	width: rs(40, 40);
	height: rs(40, 40);

	background: none;
	border: none;
	padding: 0;
	cursor: pointer;

	pointer-events: auto;
}

</style>
