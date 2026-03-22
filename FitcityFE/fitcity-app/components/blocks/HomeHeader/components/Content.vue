<template>
	<div ref="el" data-component="content">
		<RichText v-if="computedBlocks" :blocks="computedBlocks" />
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

import { RichText } from '~/components/primitives'

const props = defineProps({
	blocks: { type: [Boolean, Array], default: false },
	club: { type: [Boolean, Object], default: false },
	playFunc: { type: Function, default: () => {} },
	pauseFunc: { type: Function, default: () => {} },
})

const el = ref(null)
const context = inject('pageContext')
const openCloseTl = gsap.timeline({ paused: true })

const computedBlocks = computed(() => {
	if (!props.club) return props.blocks

	const aux = props.blocks

	aux.forEach((block) => {
		block.children.forEach((child) => {
			if (child._type === 'cta' && child.link.path.includes('form') && !child.link.path.includes('?club=')) {
				const query = `?club=${props.club.path.split('/')[props.club.path.split('/').length - 1]}`
				child.link.path = `${child.link.path}${query}`
			}
		})
	})
	return aux
})

const setup = () => {}
const init = () => {
	const link = el.value.querySelector('a')
	if (link) {
		link.addEventListener('mouseenter', () => props.pauseFunc())
		link.addEventListener('mouseleave', () => props.playFunc())
	}
	openCloseAnimation()
}
const kill = () => {
	const link = el.value.querySelector('a')
	if (link) {
		link.removeEventListener('mouseenter', () => props.pauseFunc())
		link.removeEventListener('mouseleave', () => props.playFunc())
	}
}

const open = () => {
	return openCloseTl.play()
}

const close = () => {
	return openCloseTl.reverse()
}

const openCloseAnimation = () => {
	const content = el.value

	openCloseTl.to(content, {
		clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
		ease: 'expo.inOut',
		duration: 1,
	})
}

const start = () => {
	el.value.classList.add('active')
}

const cleanup = () => {
	el.value.classList.remove('active')
}

onBeforeUnmount(() => {
	openCloseTl.kill()
})
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})

defineExpose({ open, close, start, cleanup })
</script>

<style lang="scss" scoped>
[data-component='content'] {
	--contentButton-color: var(--color-white);
	--contentButton-backgroundColor: transparent;

	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;

	clip-path: polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%);

	text-align: center;

	opacity: 0;
	visibility: hidden;

	&.active {
		opacity: 1;
		visibility: visible;
	}

	:deep(h3) {
		position: relative;
		margin-top: rs(20);

		@include callout;
		text-transform: uppercase;
		color: var(--color-white);
	}
	:deep(h2) {
		position: relative;
		margin-top: rs(20);

		@include headline;
		text-transform: uppercase;
		color: var(--color-white);
	}
	:deep([data-component='content-button']) {
		position: relative;
		display: inline-flex;
		margin-top: rs(50);
		padding: rs(22) rs(40);
		width: auto;

		.label {
			@include label-1;
		}

		@media (hover: hover) {
			&:hover {
				--contentButton-backgroundColor: var(--color-darkBrown);
			}
		}
	}
	:deep(p) {
		text-align: center;
		@include title-6;
		color: var(--color-white);
	}
}
</style>
