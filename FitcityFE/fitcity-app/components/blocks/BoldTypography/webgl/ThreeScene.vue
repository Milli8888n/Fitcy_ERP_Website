<template>
	<ClientOnly>
		<Suspense>
			<component :is="Three" v-if="isDesktop" />
		</Suspense>
	</ClientOnly>
</template>

<script setup>
import { useScreen } from 'vue-screen'
import { breakpoints } from '~/config'
import { useEmitter } from '~/composables/core'

const Three = defineAsyncComponent(() => import('./Scene.vue'))

const screen = useScreen()
const isDesktop = computed(() => screen.width >= breakpoints.small)
onMounted(() => {
	if (isDesktop.value) context.$page.loader.deferLoad(webglLoad())
})
const context = inject('pageContext')
const emitter = useEmitter()

function webglLoad() {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => {
			console.warn('WebGL init timed out')
			reject()
		}, 5000)

		emitter.on('webgl-error', () => {
			clearTimeout(timer)
			reject()
		})

		emitter.on('webgl-ok', () => {
			clearTimeout(timer)
			resolve()
		})
	})
}
</script>
