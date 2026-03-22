<template>
	<component :is="as" v-bind="$props">
		<slot />
	</component>
</template>

<script>
import { resolveComponent } from 'vue'
import { useRouter } from '#app'

function useHyperlink(to) {
	const { currentRoute } = useRouter()

	try {
		const { type } = to

		if (type === 'external') {
			return {
				as: 'a',
				$props: {
					href: to.url ?? to.href,
					target: '_blank',
				},
			}
		}

		if (type === 'internal') {
			return {
				as: resolveComponent('NuxtLink'),
				$props: {
					to: to.path,
					activeClass: '-active',
					exactActiveClass: '-exact',
				},
			}
		}

		if (type === 'form') {
			return {
				as: resolveComponent('NuxtLink'),
				$props: {
					to: `${currentRoute.value.path}?drawer=${to.id}`,
				},
			}
		}

		throw new Error('Hyperlink: Unable to render link type.')
	} catch (e) {
		console.error(e)

		return { as: 'span', $props: { 'data-unknown-link': '' } }
	}
}
</script>
<script setup>
const props = defineProps({
	to: { type: Object, required: true },
})

const { as, $props } = useHyperlink(props.to)
</script>
