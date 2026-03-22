<template>
	<NuxtLink v-if="to.type === 'internal'" :to="to.path" active-class="-active" exact-active-class="-exact" v-bind="$attrs">
		<slot />
	</NuxtLink>
	<NuxtLink v-else-if="to.type === 'form'" :to="computedFormPath" v-bind="$attrs">
		<slot />
	</NuxtLink>
	<a v-else-if="to.type === 'external'" :href="to.url || to.href" target="_blank" v-bind="$attrs">
		<slot />
	</a>
	<span v-else data-unknown-link v-bind="$attrs">
		<slot />
	</span>
</template>

<script>
export default {
	inheritAttrs: false,
}
</script>

<script setup>
import { useRoute } from '#app'
import { computed } from 'vue'

const props = defineProps({
	to: { type: Object, required: true },
})

const route = useRoute()
const computedFormPath = computed(() => {
	if (!props.to || !props.to.id) return route.path
	return `${route.path}?drawer=${props.to.id}`
})
</script>
