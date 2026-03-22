<template>
	<div ref="el" data-component="footer" data-section-intersect="dark" :class="locale">
		<div v-if="joinPhive" class="animation-container">
			<ClientOnly>
				<component :is="RiveAsset" v-if="RiveAsset" ref="taglineRef" :asset="joinPhive" state-machine="State Machine 1" layout="cover" hydrate-on-idle />
			</ClientOnly>

			<div v-if="footerCta && isNotOnForm" class="cta-container">
				<ButtonRoundVariable v-bind="footerCta" type="secondary" class="btn" size="large" />
			</div>
		</div>

		<div v-if="socialLinks" class="social-container">
			<SocialNetworksSimple :list="socialLinks" :parent="el" />
		</div>

		<div class="row description-container">
			<div class="xxlarge-16 col">
				<h2 class="-title-5 -uppercase">{{ description }}</h2>
			</div>
		</div>
		<div v-if="items" class="items-container">
			<div class="row">
				<div class="xxlarge-16 col">
					<div class="left-col">
						<ul class="items-list">
							<li class="mobile-badge">
								<a href="/Centro-2030-Koachy Operation.pdf" target="_blank" rel="external" aria-label="Portugal 20230">
									<img src="/ue-badges.svg" alt="Portugal 2030" />
								</a>
							</li>

							<li v-for="(item, i) in items" :key="i" class="item">
								<HyperLink :to="item.link">
									<span class="-subhead-3 -uppercase label">{{ item.label }}</span>
								</HyperLink>
							</li>
						</ul>
					</div>

					<div class="center-col">
						<a href="/Centro-2030-Koachy Operation.pdf" target="_blank" rel="external" aria-label="Portugal 20230">
							<img src="/ue-badges.svg" alt="Portugal 2030" />
						</a>
					</div>

					<div class="right-col">
						<a href="https://burocratik.com">
							<span class="-subhead-3 -uppercase label">Made by Büro</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { HyperLink } from '~/components/core'
import { ButtonRoundVariable } from '~/components/primitives/'

import SocialNetworksSimple from './components/SocialNetworksSimple.vue'
import { useLocale } from '@/i18n'

defineProps({
	joinPhive: { type: [Boolean, Object], default: false },
	footerCta: { type: [Boolean, Object], default: false },
	socialLinks: { type: [Boolean, Array], default: false },
	description: { type: String, default: '' },
	items: { type: [Boolean, Array], default: false },
})

const el = ref(null)
const context = inject('pageContext')
const taglineRef = ref()
const route = useRoute()
const isNotOnForm = ref(!route.href.includes('form'))
const locale = useLocale()
const RiveAsset = shallowRef(null)

let riveObserver

const setup = () => {}
const init = () => {
	const isForm = document.querySelector('body').classList.contains('form')

	taglineRef.value.loaded().then(() => {
		// if (taglineRef.value.getInput('language')) {
		// 	taglineRef.value.getInput('language').value = locale.value === 'pt' ? 0 : 1
		// }

		// if (taglineRef.value.getInput('line')) {
		// 	taglineRef.value.getInput('line').value = isForm ? 1 : 0
		// }

		riveObserver = ScrollTrigger.create({
			trigger: el.value.querySelector('.animation-container'),
			start: 'top+=100px bottom',
			onEnter: () => {
				if (el.value.querySelector('.cta-container')) {
					gsap.fromTo(
						el.value.querySelector('.cta-container'),
						{
							autoAlpha: 0,
							y: -20,
						},
						{
							y: 0,
							autoAlpha: 1,
							duration: 1,
							delay: 1,
							ease: 'power2.out',
						},
					)
				}
				if (taglineRef.value) {
					taglineRef.value.play()
					riveObserver.kill()
				}
			},
		})
	})
}
const kill = () => {
	riveObserver?.kill()
}

onBeforeUnmount(() => kill())
onMounted(async () => {
	const module = await import('~/components/core/RiveAsset/RiveAsset.vue')
	RiveAsset.value = module.default

	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='footer'] {
	position: relative;

	display: flex;
	flex-direction: column;
	gap: rs(46);
	width: 100%;

	overflow: hidden;

	background-color: var(--color-yellow);
	color: var(--color-darkBrown);

	&.pt {
		.social-container {
			height: calc(100% - #{rs(160, 160)});
		}

		.items-container {
			.col {
				padding-bottom: rs(100, 80);

				.center-col {
					display: block;

					@include max-screen($small) {
						display: none;
					}
				}
			}
		}
	}

	.animation-container {
		position: relative;
		padding-bottom: 60vh;

		z-index: 1;
		pointer-events: none;

		@include max-screen($medium) {
			padding-bottom: 0;
		}

		:deep([data-component='rive-asset']) {
			@include max-screen($xsmall) {
				width: 120vw;
				left: -10vw;
			}
		}

		.cta-container {
			--roundButton-color: var(--color-darkBrown);
			--roundButton-borderColor: var(--color-darkBrown);

			position: relative;
			padding: rs(30) 0 rs(80);

			display: flex;
			justify-content: center;
			width: 100%;

			opacity: 0;
			visibility: hidden;

			.btn {
				pointer-events: visible;
			}
		}
	}

	.social-container {
		position: absolute;
		top: 0;
		left: 0;

		display: block;
		width: 100%;
		height: calc(100% - #{rs(96)});

		@include max-screen($medium) {
			position: relative;

			height: auto;
		}
	}

	.description-container {
		.col {
			text-align: center;
		}
	}

	.items-container {
		position: relative;

		.label {
			font-size: rs(16, 10);
		}

		.col {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-top: rs(20);
			padding-bottom: rs(46, 80);

			border-top: 1px solid var(--color-darkBrown);

			.center-col {
				display: none;
			}

			.left-col {
				flex: 0 0 35%;

				@include max-screen($small) {
					flex: 0 0 50%;
				}

				.items-list {
					display: flex;

					gap: rs(12, 8);

					@include max-screen($small) {
						flex-direction: column;
						gap: rs(12, 8);
					}
				}

				.mobile-badge {
					display: none;

					@include max-screen($small) {
						display: block;
						width: rs(280);
					}
				}
			}

			.right-col {
				flex: 0 0 35%;

				display: flex;
				justify-content: flex-end;
			}
		}
	}
}
</style>
