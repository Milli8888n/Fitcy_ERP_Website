<template>
	<!-- <Scroller ref="mainScroller" :main="true" :class="`scroller`">
		<Page slug="404" name="404" :metadata="page?.metadata">
			<Menu v-bind="menu" />
			<Error />
		</Page>
	</Scroller> -->

	<Scroller ref="mainScroller" :main="true" :class="`scroller`">
		<Page slug="404" name="404" :metadata="page?.metadata" :transition-enter="onEnter" :transition-leave="onLeave">
			<Error />
			<Three></Three>
		</Page>
	</Scroller>

	<MenuGrid v-bind="menu" />
	<PreLoader :title="`${SITE_NAME} — ${SITE_DESCRIPTION}`" color="#ffe000" />
	<Curtain ref="curtainRef" />
</template>

<script setup>
import { useFetch } from '#app'
import { useLocale } from '@/i18n'

import Three from '~/components/blocks/BoldTypography/webgl/404/ThreeScene.vue'

import { Error } from '~/components/blocks'
import { MenuGrid } from '~/components/fragments'
import { Curtain } from '~/components/primitives'

import { Scroller, Page, PreLoader } from '~/components/core'
import { useAudioController } from '~/composables/core'

import { pageTransition } from '~/transitions/page'

import { SITE_NAME, SITE_DESCRIPTION } from './config/site'

import { useRuntimeConfig } from '#app'
import { middleware as i18nRouteMiddleware } from '@/i18n'

const locale = useLocale()
const query = { lang: locale.value }

const { data: menu } = await useFetch('/cms/menu', { query })

const mainScroller = ref(null)
const curtainRef = ref(null)
const { loadAudio } = useAudioController()

definePageMeta({
	pageTransition,
	middleware: [i18nRouteMiddleware],
})

const { onEnter, onLeave } = useTransitionAlt()

const page = {
	metadata: {
		description: 'Não é só fitness. É viver plenamente',
		image: null,
		keywords: null,
		lang: 'pt',
		path: '/',
		sitedescription: 'Não é só fitness. É viver plenamente',
		sitename: 'Phive',
		title: '404',
		unlisted: false,
	},
}

onMounted(() => {
	const runtime = useRuntimeConfig()
	const { audio } = runtime.public

	audio.forEach((el) => loadAudio(el.slug, [el.audioTrack]))
})

provide('$scroller', mainScroller)
provide('$curtain', curtainRef)

useHead({
	bodyAttrs: {
		class: 'page-404',
	},
})
</script>

<style lang="scss" scoped>
._page[data-slug='404'],
._page[data-name='404'] {
	._common-header {
		h1 {
			white-space: pre;
		}

		._scroll-hint {
			display: none;
		}
	}
}
</style>
