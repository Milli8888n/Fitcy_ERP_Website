<template>
	<h2 ref="el" data-component="rolling-title">
		<span class="-title-1 -uppercase first label">{{ label }}</span>
		<span class="-title-1 -uppercase last label">{{ label }}</span>
	</h2>
</template>

<script setup>
import { gsap, SplitText, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText) && gsap.registerPlugin(ScrollTrigger)

import { getActiveContext } from '~/components/core/Page/context.js'

const props = defineProps({
	label: { type: String, default: '' },
	triggerElement: { type: [Boolean, Object], default: false },
	repeat: { type: Number, default: 0 },
	infinite: { type: Boolean, default: false },
	hover: { type: [Boolean], default: false },
})

const el = ref(null)
const tl = gsap.timeline({ paused: true })
let observer
let splitTitleFirst
let splitTitleLast

let ctx
const setup = () => {
	ctx = gsap.context(() => {
		setTimeout(() => {
			const titleFirst = el.value.querySelector('.first')
			const titleLast = el.value.querySelector('.last')

			splitTitleFirst = new SplitText(titleFirst, { type: 'chars', charsClass: 'char', tag: 'span' })
			splitTitleLast = new SplitText(titleLast, { type: 'chars', charsClass: 'char', tag: 'span' })

			nextTick(() => {
				tl.fromTo(
					splitTitleFirst.chars,
					{
						scaleY: 1,
						transformOrigin: 'bottom',
					},
					{
						scaleY: 0,
						stagger: {
							from: props.hover ? 'center' : 'left',
							each: props.hover ? 0.05 : 0.1,
						},
						ease: props.hover ? 'expo.out' : 'power2.inOut',
						duration: props.infinite || props.hover ? 1 : 2,
						repeat: props.repeat,
						delay: props.infinite ? 2 : 0,
					},
					0
				)
				tl.fromTo(
					splitTitleLast.chars,
					{
						scaleY: 0,
						transformOrigin: 'top',
					},
					{
						scaleY: 1,
						stagger: {
							from: props.hover ? 'center' : 'left',
							each: props.hover ? 0.05 : 0.1,
						},
						ease: props.hover ? 'expo.out' : 'power2.inOut',
						duration: props.infinite || props.hover ? 1 : 2,
						repeat: props.repeat,
						delay: props.infinite ? 2 : 0,
					},
					0
				)

				if (props.infinite) {
					tl.repeat(-1)

					observer = ScrollTrigger.create({
						trigger: props.triggerElement || el.value,
						start: 'top bottom',
						end: 'bottom top',
						onEnter: () => tl.play(),
						onEnterBack: () => tl.play(),
						onLeave: () => tl.pause(),
						onLeaveBack: () => tl.pause(),
					})
				} else if (!props.hover) {
					observer = ScrollTrigger.create({
						trigger: props.triggerElement || el.value,
						start: 'top bottom',
						end: props.triggerElement ? 'bottom bottom' : 'bottom center',
						onUpdate: ({ progress }) => {
							tl.progress(progress)
						},
					})
				}
			})
		}, 40)
	})
}

const play = () => tl.seek(0).play()
const init = () => {}
const kill = () => {
	observer?.kill()
	tl?.kill()
	ctx?.revert()
}

onBeforeUnmount(() => kill())
onMounted(() => {
	const context = getActiveContext()

	context.loader.ready.then(() => setup())
})

defineExpose({ play: () => play(), pause: () => tl.pause() })
</script>

<style lang="scss" scoped>
[data-component='rolling-title'] {
	position: relative;

	display: grid;
	justify-items: center;

	.label {
		white-space: nowrap;

		&.first,
		&.last {
			grid-row: 1;
			grid-column: 1;
		}

		:deep(.char) {
			position: relative;
			display: inline-block !important;
		}

		@include split_text_inherit();
	}
}
</style>
