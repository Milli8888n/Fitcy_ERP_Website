<template>
	<section ref="el" data-component="phive-app" data-section-intersect="light">
		<div class="background-container">
			<ImageAssetStatic
				desktop="/imgs/phive-app.jpg"
				tablet="/imgs/phive-app-tablet.jpg"
				mobile="/imgs/phive-app-mobile.jpg"
				alt="Hero image"
				layout="natural"
				:width="3400"
				:height="2158"
				class="media"
			/>
		</div>
		<div class="row content-row">
			<div class="xxlarge-6 xxlarge-offset-2 small-8 xsmall-14 xsmall-offset-1 col content-col">
				<h2 class="-title-4 -uppercase title">{{ title }}</h2>
				<p class="-subhead-3 -uppercase description">{{ description }}</p>

				<ul class="list">
					<li v-for="(item, i) in ctaList">
						<HyperLink :to="item.link">
							<img v-if="item.store === 'app-store'" src="/imgs/apps/apple-download.svg" alt="Apple Store" />
							<img v-if="item.store === 'google-play'" src="/imgs/apps/google-download.svg" alt="Google Play" />
						</HyperLink>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ImageAssetStatic, HyperLink } from '~/components/core'

const props = defineProps({
	title: { type: String, default: '' },
	description: { type: String, default: '' },
	ctaList: { type: Array, default: () => [] },
	backgroundImage: { type: [Boolean, Object], default: false },
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
[data-component='phive-app'] {
	position: relative;

	width: 100%;

	background: radial-gradient(82% 72% at 74% 82%, #3b2d10 10%, #161003 96%);

	color: var(--color-yellow);

	display: flex;
	flex-direction: column;
	gap: rs(20);

	@include max-screen($xsmall) {
		background: var(--color-darkBrown);
	}

	.background-container {
		position: relative;
		height: 100vh;
		width: 100%;

		@include max-screen($xsmall) {
			position: relative;
			order: 2;
			height: 70vh;
		}

		.media {
			width: 100%;

			:deep(img) {
				@include max-screen($small) {
					object-position: 90% 50%;
				}
			}
		}
	}

	.content-row {
		position: absolute;
		inset: 0;

		padding-top: rs(272, 0);

		@include max-screen($xsmall) {
			position: relative;
			order: 1;

			text-align: center;
		}

		.content-col {
			display: flex;
			flex-direction: column;
			gap: rs(24);
		}

		.title {
		}

		.description {
			color: var(--color-lightYellow);
			padding-right: n_grid_columns(2);

			@include max-screen($small) {
				padding-right: n_grid_columns(1);
			}

			@include max-screen($small) {
				padding-right: 0;
			}
		}

		.list {
			display: flex;
			gap: rs(12);

			@include max-screen($xsmall) {
				width: 100%;
				justify-content: center;
			}
		}
	}
}
</style>
