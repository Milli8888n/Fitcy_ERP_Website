<template>
	<div ref="page" data-component="page" :data-slug="slug">
		<slot />
	</div>
</template>

<script setup>
import { provide, nextTick, watch, ref, onBeforeUnmount, onUnmounted, onMounted, inject } from 'vue'

import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { createPageContext } from './context'
import { createPageLoader } from './loader'

import { useScreen } from 'vue-screen'
import { useEmitter, useSeoHead } from '~/composables/core'
import { useSectionIntersect } from '~/composables'
import { useMenu } from '~/components/fragments/MenuGrid/useMenu'

const props = defineProps({
	slug: { type: String, default: 'page' },
	theme: { type: String, default: 'neutral' },
	name: { type: String, default: 'Page' },
	metadata: { type: [Boolean, Object], default: false },
	transitionEnter: { type: Function, default: () => {} },
	transitionLeave: { type: Function, default: () => {} },
})

const page = ref(null)
const emitter = useEmitter()
const loader = createPageLoader(props.slug)
const screen = useScreen()
const device = useDevice()

const { refreshAnchors } = useMenu()

const scroller = inject('$scroller')

let query = null

useSectionIntersect(page)

provide(
	'pageContext',
	createPageContext({
		element: page,
		slug: props.slug,
		theme: props.theme,
		name: props.name,
		loader: loader,
		scroller: scroller,
		transitionEnter: props.transitionEnter,
		transitionLeave: props.transitionLeave,
	}),
)

defineExpose({ loader, page })

// watch(screen, (newVal) => {
// 	setCSSVars(newVal)
// })

onBeforeUnmount(() => {
	loader.dispatch('destroyed')
	query && query.removeEventListener('change', onChange)
})

onUnmounted(() => {
	loader.dispatch('destroyed')
})

onMounted(() => {
	// loader.deferLoad(document.fonts.ready)
	query = window.matchMedia('(pointer:coarse)')
	query.addEventListener('change', onChange)

	loader.ready.then(() => setTimeout(() => refreshAnchors(), 0))

	setCSSVars(screen)

	nextTick().then(() => {
		loader.dispatch('mounted')
		document.fonts.ready.then(() => {
			emitter.emit('scroller-resize')
		})
	})
})

function setCSSVars(newVal) {
	if (newVal.touch) {
		document.querySelector(':root').style.setProperty('--computed-100vh', `${newVal.height}px`)
		document.querySelector(':root').style.setProperty('--native-scrollbar-width', `0px`)
	} else {
		const scrollbarWidth = window.innerWidth - document.body.clientWidth
		document.querySelector(':root').style.setProperty('--native-scrollbar-width', `${scrollbarWidth}px`)
		document.querySelector(':root').style.setProperty('--computed-100vh', `100vh`)
	}
}

function onChange(e) {
	window.location.reload()
}

const meta = {
	sitename: props.metadata.sitename,
	sitedescription: props.metadata.sitedescription,
	title: props.metadata.title,
	description: props.metadata.description,
	keywords: props.metadata.keywords,
	alternates: props.metadata.alternates,
	image: props.metadata.image
		? {
				url: props.metadata.image,
				width: 1200,
				height: 600,
			}
		: false,
	tiktok: {
		pixelId: 'D59RM4RC77U5DJL56K9G',
		token: '2bfb906ab0dc0396ed2d4285d25e88ded0f66724',
	},
	head: {
		tags: [
			{ name: 'google-site-verification', content: '6tzSNmZ_-gXirfvLEqUowh_D1fK3p2unvSyejjU1YrA' },
			{ name: 'facebook-domain-verification', content: '' },
		],
		scripts: [{ defer: true, src: 'https://cloud.umami.is/script.js', 'data-website-id': '9c3cb278-7f02-4d03-9f5d-e67e4b87d507' }],
	},
}

useSeoHead(meta)
</script>

<style lang="scss" scoped>
[data-component='page'] {
	position: relative;
	z-index: 9;
}
</style>
