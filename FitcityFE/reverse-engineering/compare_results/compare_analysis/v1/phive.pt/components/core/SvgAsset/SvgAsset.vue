<script setup>
const props = defineProps({ url: { type: String, default: '' } })
const svgString = ref('')

onMounted(() => {
	$fetch(props.url)
		.then((response) => response.text())
		.then((svg) => {
			const parser = new DOMParser()
			const doc = parser.parseFromString(svg, 'image/svg+xml')
			const svgElement = doc.documentElement
			const svgContainer = document.createElement('div')
			svgContainer.appendChild(svgElement)
			svgString.value = svgContainer.innerHTML
		})
})
</script>
<template>
	<client-only>
		<div data-component="svg-asset" v-html="svgString" />
	</client-only>
</template>
