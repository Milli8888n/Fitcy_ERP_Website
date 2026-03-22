<template>
	<div ref="el" data-component="class-header">
		<div class="row align-center">
			<div class="xxlarge-14 col">
				<h2 class="-title-2 -uppercase title">{{ titleMod }}</h2>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap, SplitText } from 'gsap/all'
import.meta.client && gsap.registerPlugin(SplitText)

import { getActiveContext } from '~/components/core/Page/context'
import { normalizeText } from '~/utils/strings'

const props = defineProps({
	title: { type: String, default: '' },
})

const el = ref(null)
const titleMod = computed(() => normalizeText(props.title))
let split

const setup = () => {
	nextTick(() => {
		const title = el.value.querySelector('.title')

		split = new SplitText(title, {
			type: 'words',
			wordsClass: 'word',
			tag: 'span',
		})
	})
}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => kill())
onMounted(() => {
	const context = getActiveContext()

	setup()
	context.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='class-header'] {
	position: relative;
	padding: rs(50, 64) 0 rs(60);

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	color: var(--color-darkBrown);
	background-color: var(--color-yellow);

	.col {
		display: flex;
		align-items: center;
		justify-content: center;

		.title {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			@include split_text_inherit();
			text-box: trim-both cap alphabetic;

			:deep(.word) {
				position: relative;
				overflow: hidden;

				&:after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;

					display: block;
					width: 100%;
					height: 50%;
					background: linear-gradient(180deg, rgba(255, 224, 0, 0) 0%, #ffe000 79%);
				}

				&:last-child {
					margin-top: rs(-20);

					&:after {
						display: none;
					}
				}
			}
		}
	}
}
</style>
