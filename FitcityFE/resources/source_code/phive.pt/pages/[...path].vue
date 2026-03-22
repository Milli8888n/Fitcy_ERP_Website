<template>
	<Page v-if="data && data.slug" :slug="data.slug" :name="data.name" :metadata="data.metadata" :transition-enter="onEnter" :transition-leave="onLeave">
		<PageBuilder :blocks="data.blocks" />

		<Three v-if="data.type === 'page.home'"></Three>
	</Page>
</template>

<script setup>
import { showError, useFetch } from '#app'
import { definePageMeta } from '#imports'

import { Page, PageBuilder } from '~/components/core'

import { useLocalizedRoute, middleware as i18nRouteMiddleware } from '@/i18n'
import { useTransitionAlt } from '~/composables'

import { pageTransition } from '~/transitions/page'

import Three from '~/components/blocks/BoldTypography/webgl/ThreeScene.vue'

// import { fetchPage } from '@/sanity/pages.js'

import { useRuntimeConfig } from '#app'

definePageMeta({
	pageTransition,
	middleware: [i18nRouteMiddleware],
})

const route = useRoute()
const runtime = useRuntimeConfig()

if (!runtime.public.paths.includes(route.path)) {
	throw showError({
		statusCode: 404,
		statusMessage: 'Page not found',
	})
}

const { path, locale } = useLocalizedRoute()
const { onEnter, onLeave } = useTransitionAlt()

// const data = await fetchPage(path.value, locale.value)

const { data, error } = await useFetch('/cms/page', {
	query: {
		path: path.value,
		lang: locale.value,
	},
	key: `page-${path.value}-${locale.value}`,
	transform: (response) => response || null,
	default: () => null,
})

if (error.value) {
	throw showError({
		statusCode: error.value?.statusCode || 404,
		statusMessage: error.value?.message || 'Page not found',
	})
}

if (!data) {
	throw showError({
		statusCode: error.value?.statusCode || 404,
		statusMessage: error.value?.message || 'Page not found',
	})
}

// Set head attributes if we have data
watchEffect(() => {
	if (data.value?.type) {
		useHead({
			bodyAttrs: {
				class: data.value.type.replace('page.', ''),
			},
		})
	}
})
</script>
