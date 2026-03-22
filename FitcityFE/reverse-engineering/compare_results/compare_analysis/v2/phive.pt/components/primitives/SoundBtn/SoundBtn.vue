<template>
	<button ref="el" data-component="sound-btn" aria-label="Sound Button" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
		<ClientOnly>
			<component :is="RiveAsset" v-if="RiveAsset" ref="riveAnimation" :asset="sound" state-machine="State Machine 1" :autoplay="true" layout="contain" :width="96" :height="96" />
		</ClientOnly>
	</button>
</template>

<script setup>
import { useAudioController } from '~/composables/core'

import { getActiveContext } from '~/components/core/Page/context'

const { toggleMute } = useAudioController()

const props = defineProps({
	color: { type: Number, default: 0 },
})

const sound = {
	file: '/rives/sound.riv',
}

const el = ref(null)
const riveAnimation = ref(null)
const audioState = ref(0)
const RiveAsset = shallowRef(null)

watch(
	() => props.color,
	(newValue) => {
		riveAnimation.value.loaded().then(() => {
			riveAnimation.value.getInput('color').value = newValue
		})
	},
)

const handleClick = () => {
	audioState.value = audioState.value === 0 ? 1 : 0

	toggleMute()

	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('sound').value = audioState.value ? true : false
	})
}

const handleMouseEnter = () => {
	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('hover').value = true
	})
}

const handleMouseLeave = () => {
	riveAnimation.value.loaded().then(() => {
		riveAnimation.value.getInput('hover').value = false
	})
}

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(async () => {
	const module = await import('~/components/core/RiveAsset/RiveAsset.vue')
	RiveAsset.value = module.default
})
</script>

<style lang="scss" scoped>
[data-component='sound-btn'] {
	position: relative;

	width: rs(48, 38);
	height: rs(48, 38);

	cursor: pointer;
}
</style>
