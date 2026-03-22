<template>
	<div ref="el" data-component="form-header" data-section-intersect="dark">
		<div class="row align-center">
			<div class="xxlarge-14 col">
				<h2 ref="titleRef" class="-title-4 -uppercase title">{{ title }}</h2>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap/all'
// import { useTitleAnimation } from '~/composables'
import { useEmitter } from '~/composables/core'

const props = defineProps({
	title: { type: String, default: '' },
})

const el = ref(null)
const titleRef = ref(null)
const emitter = useEmitter()

// useTitleAnimation(titleRef)

const hide = () => {
	gsap.to(el.value.querySelector('.row'), { autoAlpha: 0, ease: 'power4.out', duration: 0.5 })
}

onBeforeUnmount(() => {
	emitter.off('form-submit', hide)
})
onMounted(() => {
	emitter.on('form-submit', hide)
})
</script>

<style lang="scss" scoped>
[data-component='form-header'] {
	position: relative;
	padding-top: rs(64, 60);
	padding-bottom: rs(50, 36);

	background-color: var(--color-yellow);
	color: var(--color-darkBrown);

	display: flex;
	align-items: flex-start;
	justify-content: center;
	width: 100%;
	overflow: hidden;

	.title {
		position: relative;

		text-align: center;

		:deep(.first),
		:deep(.last) {
			display: inline-block;
		}
	}
}
</style>
