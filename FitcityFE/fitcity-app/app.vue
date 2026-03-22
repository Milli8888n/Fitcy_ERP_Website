<template>
	<Scroller ref="mainScroller" :main="true" :class="`scroller`">
		<NuxtPage />
	</Scroller>

	<Grid />
	<MenuGrid v-bind="menu" />
	<ModalDrawer />

	<PreLoader :title="SITE_NAME" color="#FF5800" />

	<Curtain ref="curtainRef" />
</template>

<script setup>
import { useFetch } from '#app'
import { useLocale } from './i18n/index.js'
import { fetchMenu } from './sanity/sharedContent.js'

import { ModalDrawer } from './components/modals/index.js'
 
import { MenuGrid } from './components/fragments/index.js'
import { Curtain } from './components/primitives/index.js'
 
import { Scroller, Grid, PreLoader } from './components/core/index.js'
import { useAudioController } from './composables/core/index.js'

import { SITE_NAME, SITE_DESCRIPTION } from './config/site.js'

import { useRuntimeConfig } from '#app'

const locale = useLocale()
const query = { lang: locale.value }

const sanityQuery = fetchMenu(locale.value)
// const { data: menu } = await useSanityQuery(sanityQuery)
const { data: menu } = await useFetch('/cms/menu', { query })

const mainScroller = ref(null)
const curtainRef = ref(null)
const { loadAudio } = useAudioController()

onMounted(() => {
	const runtime = useRuntimeConfig()
	const { audio } = runtime.public

	audio.forEach((el) => loadAudio(el.slug, ['/assets/rive/' + el.assetId + '.mp3']))
})

provide('$scroller', mainScroller)
provide('$curtain', curtainRef)

useHead({
	link: [
		{
			rel: 'preconnect',
			href: 'https://fonts.googleapis.com',
		},
		{
			rel: 'preconnect',
			href: 'https://fonts.gstatic.com',
			crossorigin: 'anonymous',
		},
		{
			rel: 'stylesheet',
			href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/AcidGroteskVF.woff2',
			type: 'font/woff2',
			crossorigin: 'anonymous',
		},
		{
			rel: 'preload',
			as: 'font',
			href: '/fonts/PPFormula.woff2',
			type: 'font/woff2',
			crossorigin: 'anonymous',
		},
	],


})
</script>

<style lang="scss" scoped></style>
