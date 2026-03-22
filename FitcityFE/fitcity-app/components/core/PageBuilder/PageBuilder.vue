<template>
	<div class="inner">
		<component :is="getBlockComponent(block)" v-for="(block, index) in semanticBlocks.header" :key="index" v-bind="block.props" />
		<main>
			<component :is="getBlockComponent(block)" v-for="(block, index) in semanticBlocks.main" :key="index" v-bind="block.props" />
		</main>
		<component :is="getBlockComponent(block)" v-for="(block, index) in semanticBlocks.footer" :key="index" v-bind="block.props" />
	</div>
</template>

<script setup>
import { isHeader, isFooter } from './PageBuilder.helpers'
import { defineAsyncComponent, computed } from 'vue'

const $props = defineProps({
	blocks: { type: Array, required: true },
})

const semanticBlocks = computed(() => {
	function blockReducer(acc, block, index, arr) {
		if (isHeader(block, index, arr)) {
			acc.header.push(block)
		} else if (isFooter(block, index, arr)) {
			acc.footer.push(block)
		} else {
			acc.main.push(block)
		}

		return acc
	}

	return $props.blocks.reduce(blockReducer, {
		header: [],
		main: [],
		footer: [],
	})
})

function getBlockComponent(block) {
	return defineAsyncComponent(() => import(`../../blocks/${block.name}/${block.name}.vue`))
}
</script>
