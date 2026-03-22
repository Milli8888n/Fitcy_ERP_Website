<template>
	<div ref="el" data-component="statistics-table">
		<div class="wrapper">
			<div class="title-container">
				<h2 class="-callout -uppercase title">{{ title }}</h2>
			</div>
			<ul class="list">
				<li v-for="(item, i) in list" :key="i" class="item">
					<div class="content">
						<span class="-title-4 value">{{ item.value }}</span>
						<span class="-footnote-2 -uppercase label">{{ item.label }}</span>
					</div>
				</li>
			</ul>

		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap'

const props = defineProps({
	title: { type: String, default: '' },
	list: { type: [Boolean, Array], default: false },
})

const el = ref(null)
const context = inject('pageContext')

const setup = () => {}
const init = () => {}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {})
</script>

<style lang="scss" scoped>
[data-component='statistics-table'] {
	position: relative;

	width: 100%;

	display: flex;
	justify-content: center;

	color: var(--color-lightYellow);
	background-color: var(--color-darkBrown);

	.wrapper {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--color-lightYellow);
	}

	.title-container {
		padding: rs(18) 0;

		display: flex;
		justify-content: center;

		border-bottom: 1px solid var(--color-lightYellow);
	}

	.list {
		display: flex;

		.item {
			position: relative;
			flex: 0 0 rs(140, 96);
			width: rs(140, 96);

			display: flex;
			align-items: center;
			justify-content: center;

			&:after {
				content: '';
				position: absolute;
				top: 20%;
				right: 0;

				display: block;
				width: 1px;
				height: 60%;

				background-color: var(--color-lightYellow);
			}

			&:last-child {
				&:after {
					display: none;
				}
			}

			.content {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: rs(24);
				gap: rs(4);
			}

			.label {
				white-space: pre-line;
				text-align: center;
				line-height: 1.2em;
			}

			.value {
				color: var(--color-yellow);
			}

		}
	}
}
</style>
