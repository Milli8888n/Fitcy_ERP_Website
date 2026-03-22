<template>
	<div ref="el" data-component="class-body">
		<div class="row">
			<div class="xxlarge-16 col">
				<div class="inner">
					<div class="top">
						<div class="left-col">
							<div class="icon-container">
								<ClientOnly>
									<component :is="RiveAsset" v-if="RiveAsset" :asset="durationRive" layout="contain" :autoplay="true" />
								</ClientOnly>
							</div>
							<span class="label">
								<span class="-label-1 -uppercase label-content">{{ duration }}</span>
								<span class="-label-1 -uppercase label-description">{{ $t('minutes', 'Minutos') }}</span>
							</span>
						</div>
						<div class="center-col">
							<MediaAsset v-if="media" :media="media" />
						</div>

						<div class="right-col">
							<div class="icon-container">
								<ClientOnly>
									<component :is="RiveAsset" v-if="RiveAsset" ref="intensityRef" :asset="intensityRive" layout="contain" :autoplay="true" state-machine="State Machine 1" />
								</ClientOnly>
							</div>
							<span class="label">
								<span class="-label-1 -uppercase label-content">{{ intensity }}</span>
								<span class="-label-1 -uppercase label-description">{{ $t('intensity', 'Intensidade') }}</span>
							</span>
						</div>
					</div>

					<div class="bottom">
						<p class="-subhead-2 -uppercase description">{{ description }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
// import { RiveAsset } from '~/components/core'
import MediaAsset from '~/components/core/MediaAsset/MediaAsset.vue'
import { useStringTranslation } from '@/i18n'

import { getActiveContext } from '~/components/core/Page/context.js'

const props = defineProps({
	media: { type: [Boolean, Array], default: false },
	description: { type: String, default: '' },
	duration: { type: String, default: '' },
	intensity: { type: String, default: '0' },
})

const $t = useStringTranslation()

const RiveAsset = shallowRef(null)

const durationRive = {
	file: '/rives/duration.riv',
}

const intensityRive = {
	file: '/rives/intensity.riv',
}

const el = ref(null)
const intensityRef = ref(null)

const setup = () => {}
const init = () => {
	intensityRef.value.loaded().then(() => {
		const aux = Number(props.intensity.replace(/\D/g, ''))
		intensityRef.value.getInput('intensity').value = aux
	})
}
const kill = () => {}

onBeforeUnmount(() => {})

onMounted(async () => {
	const module = await import('~/components/core/RiveAsset/RiveAsset.vue')
	RiveAsset.value = module.default

	const context = getActiveContext()

	context.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='class-body'] {
	position: relative;
	padding: rs(50) 0 rs(60, 88);

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	color: var(--color-darkBrown);
	background-color: var(--color-yellow);

	.inner {
		display: flex;
		flex-direction: column;

		gap: rs(50);

		.top {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: rs(86, 20);

			@include max-screen($xsmall) {
				flex-direction: column;
			}
		}

		.center-col {
			display: flex;
			justify-content: center;
			align-items: center;

			height: rs(622, 400);
			width: rs(420, 280);

			background-color: var(--color-darkBrown);

			.media {
				width: 100%;
				height: 100%;
				object-fit: cover;

				// @include max-screen($xsmall) {
				// 	width: n_grid_columns(12);
				// 	height: auto;
				// }
			}
		}

		.left-col,
		.right-col {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: rs(18, 6);

			.label {
				span {
					line-height: 1.6em;
				}
			}
		}

		.icon-container {
			height: rs(86);
			width: rs(86);
		}

		.label {
			white-space: pre-line;
			text-align: center;

			display: flex;
			flex-direction: column;
		}

		.description {
			position: relative;
			padding: 0 n_grid_columns(3);

			text-align: center;

			@include max-screen($xsmall) {
				padding: 0 n_grid_columns(1);
			}
		}
	}
}
</style>
