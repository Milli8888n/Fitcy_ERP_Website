<script setup>
import { ImageAsset, HyperLink } from '~/components/core/index.js'
import { ContentButton } from '~/components/primitives/index.js'

import PortableText from '~/components/utilities/PortableText/PortableText.vue'
import { h } from 'vue'

defineProps({
	blocks: { type: Array, required: true },
})

const COMPONENTS = {
	styles: {
		h2: 'h2',
		h3: 'h3',
	},
	marks: {
		link: ({ props, children }) => {
			return h(HyperLink, { to: props.link }, () => children)
		},
	},
	types: {
		cta: function ({ props }) {
			return h(ContentButton, {
				label: props.label,
				link: props.link,
			})
		},
		figure: function ({ props }) {
			return h('figure', {}, [
				h(ImageAsset, {
					asset: props.asset,
					skeleton: true,
					sizes: 'xl:100vw md:100vw sm:100vw xs:100vw xxs:100vw',
				}),
			])
		},
	},
}
</script>

<template>
	<PortableText class="_rich-text" :blocks="blocks" :components="COMPONENTS" />
</template>

