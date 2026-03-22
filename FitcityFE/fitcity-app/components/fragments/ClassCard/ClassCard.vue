<template>
	<div ref="el" data-component="class-card" :class="media ? '' : 'no-media'" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
		<HyperLink :to="link" class="inner">
			<div class="media-container">
				<div v-if="media && media[0] !== null && media.length" class="media-wrapper">
					<div v-if="hasHoverBackground" class="media-with-hover">
						<VideoAsset ref="video" :asset="hoverVideo" :lazy="true" class="media video" @mouseenter="handleVideoEnter" @mouseleave="handleVideoLeave" hydrate-on-interaction="mouseover" />
						<ImageAsset :asset="image" class="media image" sizes="xsmall:200px xlarge:400px" hydrate-on-interaction="mouseover" loading="lazy" fetchpriority="low" />
					</div>
					<MediaAsset v-else :media="media" class="media" sizes="xsmall:200px xlarge:400px" />
				</div>
				<div v-else class="default-container">
					<div class="inner">
						<SvgAsset url="/svg/logo.svg" />
					</div>
				</div>
			</div>
			<div class="content-container">
				<div class="left-col">
					<div v-if="icon" class="icon">
						<SvgAsset :url="icon.url" />
					</div>
					<p class="-title-6 -uppercase">{{ title }}</p>
				</div>

				<div v-if="category" class="right-col">
					<button class="category-tag">
						<span class="-label-2 -uppercase label">{{ category.name }}</span>
					</button>
				</div>
			</div>
		</HyperLink>
	</div>

	<!-- <QueryModalDrawer :path="link.path">
		<ClassHeader v-bind="header" />
		<ClassBody v-bind="body" />
	</QueryModalDrawer> -->
</template>

<script setup>
import { gsap } from 'gsap/all'
import { ImageAsset, VideoAsset, HyperLink, SvgAsset, MediaAsset } from '~/components/core'

import { useScreen } from 'vue-screen'

// import { QueryModalDrawer } from '~/components/modals'
// import { ClassHeader, ClassBody } from '~/components/blocks'

const props = defineProps({
	link: { type: [Boolean, Object], default: () => {} },
	slug: { type: String, default: 'test' },
	title: { type: String, default: '' },
	category: { type: [Boolean, Object], default: false },
	media: { type: [Boolean, Array], default: false },
	icon: { type: [Boolean, Object], default: false },
	header: { type: [Boolean, Object], default: false },
	body: { type: [Boolean, Object], default: false },
})

const context = inject('pageContext')
const screen = useScreen()

const router = useRouter()
const computedModalLink = computed(() => {
	return {
		type: 'internal',
		path: `${router.currentRoute.value.path}?modal=${props.link.path}`,
	}
})

const el = ref(null)
const video = ref(null)

const hasHoverBackground = computed(() => props.media && props.media.length > 1)
const hoverVideo = computed(() => props.media.find((el) => el.type === 'video'))
const image = computed(() => props.media.find((el) => el.type === 'image'))

const handleVideoEnter = () => video.value?.playVideo()
const handleVideoLeave = () => video.value?.pauseVideo()

const handleMouseMove = (event) => {
	if (!el.value) return

	const { width, height, left, top } = el.value?.getBoundingClientRect()
	const x = event.clientX - left - width / 2
	const y = event.clientY - top - height / 2
	const intensity = 4

	const rotateX = (y / height) * intensity // Adjust the multiplier for effect intensity
	const rotateY = (x / width) * -intensity

	gsap.to(el.value?.querySelector('.media-container'), {
		duration: 0.5,
		rotationX: rotateX,
		rotationY: rotateY * 2,
		transformPerspective: 800,
	})
}

const handleMouseLeave = (event) => {
	if (!el.value) return
	gsap.to(el.value.querySelector('.media-container'), {
		duration: 0.5,
		rotationX: 0,
		rotationY: 0,
		x: 0,
		y: 0,
	})
}

const init = () => {}
const setup = () => {
	gsap.set(el.value, { opacity: 0 })
}

const animateIn = (delay, type) => {
	if (type === 'grid') {
		gsap.fromTo(
			el.value,
			{
				scaleY: 1.5,
				transformOrigin: 'top',
				y: 100,
			},
			{
				scaleY: 1,
				opacity: 1,
				y: 0,
				duration: 1,
				ease: 'power4.out',
				delay,
			},
		)
	} else {
		gsap.fromTo(
			el.value,
			{
				x: screen.width / 3,
			},
			{
				x: 0,
				opacity: 1,
				duration: 2,
				ease: 'power4.out',
				delay,
			},
		)
	}
}

const kill = () => {
	gsap.set(el.value, { pointerEvents: 'none' })
	gsap.killTweensOf(el.value.querySelector('.media-container'))
}

onBeforeUnmount(() => kill())

onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})

defineExpose({
	animateIn,
})
</script>

<style lang="scss" scoped>
[data-component='class-card'] {
	position: relative;

	width: calc((100vw - 80px) / 16 * 4 - 32px); // Precise width from original
	height: clamp(260px, 170.69px + 22.9vw, 560px); // Precise height

	background-color: transparent; 
	color: var(--color-white);

	transition: color 0.5s ease(out-expo);
	overflow: visible !important;

	.inner {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		position: relative;
	}

	@include max-screen($small) {
		width: calc((100vw - 40px) / 16 * 6 - 24px);
	}
	@include max-screen($xsmall) {
		width: calc((100vw - 32px) / 16 * 8 - 16px);
	}

	&.no-media {
		background-color: var(--color-midBrown);
	}

	&:after {
		content: '';
		position: absolute;
		inset: 0;

		border: 2px solid var(--color-yellow);
		opacity: 0;

		transition: opacity 0.5s ease(out-expo);

		z-index: 10;
		pointer-events: none;
	}

	@media (hover: hover) {
		&:hover {
			color: var(--color-yellow);

			&:after {
				opacity: 1;
			}

			.media-container {
				&:before {
					opacity: 0;
				}

				.media {
					transform: scale(1.05);
				}
				.media-with-hover {
					.video {
						opacity: 1;
						visibility: visible;
					}
				}
			}

			.content-container {
				.left-col {
					.icon {
						:deep(svg) {
							path[fill='#fff'],
							path[fill='#ffffff'],
							path[fill='white'],
							.st0 {
								fill: var(--color-yellow);
							}
						}
					}
				}
			}
		}
	}

	.media-container {
		position: relative;

		width: 100%;
		height: 100%;

		&:before {
			content: '';
			position: absolute;
			inset: 0;

			display: block;
			background-color: rgba(0, 0, 0, 0.1);

			z-index: 3;
			pointer-events: none;
		}

		.default-container {
			position: relative;

			width: 100%;
			height: 100%;

			.inner {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;

				background-color: var(--color-yellow);
				transform: scale(1.1);
				z-index: 1;
			}
		}

		:deep([data-component='svg-asset']) {
			position: relative;

			color: var(--color-subduedYellow);
			opacity: 0.2;

			width: rs(200);
			z-index: 2;
		}

		.media-wrapper {
			width: 100%;
			height: 100%;
		}

		.media-with-hover {
			width: 100%;
			height: 100%;

			.video {
				opacity: 0;
				visibility: hidden;

				z-index: 1;

				transition: opacity 0.5s ease(out-expo);
			}
		}

		.media {
			position: absolute;
			inset: 0;

			width: 100%;
			height: 100%;

			object-fit: cover;

			transition: transform 1.5s ease(out-expo);

			&.video {
				opacity: 0;
			}
		}
	}

	.content-container {
		position: absolute;
		bottom: 0;
		left: 0;

		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		
		// Precise padding from original CSS
		padding: clamp(8px, 1.448px + 1.68vw, 30px) 
				 clamp(8px, 0.863px + 1.83vw, 32px) 
				 clamp(14px, 9.242px + 1.22vw, 30px) 
				 clamp(8px, 4.412px + 0.92vw, 20px);

		z-index: 3;

		pointer-events: none;

		.left-col {
			display: flex;
			align-items: center;
			gap: min(6px, 6px + 0vw);

			.icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: max(22px, 22px + 1.06vw);
				height: max(22px, 22px + 1.06vw);

				:deep([data-component='svg-asset']) {
					width: 100%;
				}

				:deep(svg) {
					max-width: 100%;

					circle,
					.circle,
					.st1,
					path[fill='#221f1f'] {
						display: none;
					}
					path,
					.st0 {
						transition: opacity 0.5s ease(out-expo);
					}
				}
			}
		}

		.-title-6 {
			position: relative;
		}
	}

	.category-tag {
		position: relative;

		display: block;
		padding: min(8px, 8px + 0vw) min(12px, 12px + 0vw);
		border-radius: max(21.2px, 21.2px + 0.64vw);
		border: 1px solid var(--color-white);
		color: var(--color-white);

		opacity: 0.3;

		transition: color 0.5s ease(out-expo);

		.label {
			position: relative;
			display: block;
		}
	}
}
</style>
