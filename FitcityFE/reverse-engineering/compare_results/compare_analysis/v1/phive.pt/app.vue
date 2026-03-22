<template>
	<Scroller ref="mainScroller" :main="true" :class="`scroller`">
		<NuxtPage />
	</Scroller>

	<Grid />
	<MenuGrid v-bind="menu" />
	<ModalDrawer />

	<PreLoader :title="`${SITE_NAME} — ${SITE_DESCRIPTION}`" color="#ffe000" />

	<Curtain ref="curtainRef" />
</template>

<script setup>
import { useFetch } from '#app'
import { useLocale } from '@/i18n'
import { fetchMenu } from '@/sanity/sharedContent.js'

import { ModalDrawer } from '~/components/modals'

import { MenuGrid } from '~/components/fragments'
import { Curtain } from '~/components/primitives'

import { Scroller, Grid, PreLoader } from '~/components/core'
import { useAudioController } from '~/composables/core'

import { SITE_NAME, SITE_DESCRIPTION } from './config/site'

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
