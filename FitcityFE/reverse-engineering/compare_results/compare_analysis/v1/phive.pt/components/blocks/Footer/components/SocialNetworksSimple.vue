<template>
	<div ref="el" data-component="social-networks-simple" :style="`--ball-size: ${110 / list.length}vw; --total-items: ${list.length};`">
		<ul class="list">
			<li v-for="(item, i) in list" :key="i" :data-index="i" class="item" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" :style="`--index:${i};`">
				<span class="bg" />
				<HyperLink :to="item.link" class="link">
					<div class="images-container">
						<ImageAsset v-for="(img, j) in item.gallery" :key="j" class="image" :asset="img" sizes="xsmall:100px medium:1200px xlarge:600px" />
					</div>

					<div class="content-container">
						<span class="-title-4 -uppercase initials">{{ item.initials }}</span>
						<div class="x-container">
							<ImageAssetStatic desktop="/imgs/x.png" alt="Cross icon" layout="natural" class="x" />
						</div>
					</div>
				</HyperLink>
			</li>
		</ul>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import.meta.client && gsap.registerPlugin(ScrollTrigger)

import { HyperLink, ImageAsset, ImageAssetStatic } from '~/components/core'

import { breakpoints } from '~/config'

import { getRandom } from '~/utils/math'

const props = defineProps({
	list: { type: Array, default: () => [] },
	parent: { type: [Boolean, Object], default: false },
})

const context = inject('pageContext')
const el = ref(null)
const timelines = []
const mm = gsap.matchMedia()
let observer
let canHover = false

const setup = () => {
	gsap.set(el.value.querySelectorAll('.link'), {
		opacity: 0,
	})
	gsap.set(el.value.querySelectorAll('.item'), {
		scale: 0,
	})
}

const init = () => {
	gsap.fromTo(
		el.value.querySelectorAll('.item'),
		{
			scale: 0,
			opacity: 1,
		},
		{
			scale: 1,
			stagger: 0.25,
			ease: 'expo.out',
			duration: 1,
			scrollTrigger: {
				trigger: el.value,
			},
		},
	)

	gsap.fromTo(
		el.value.querySelectorAll('.link'),
		{
			scale: 1,
			rotation: 20 * getRandom(-1, 1),
			opacity: 0,
		},
		{
			rotation: 0,
			opacity: 1,
			stagger: 0.1,
			ease: 'expo.out',
			duration: 0.75,
			delay: 0.7,
			scrollTrigger: {
				trigger: el.value,
			},
			onComplete: () => {
				gsap.set(el.value?.querySelectorAll('.bg'), { opacity: 0 })
				canHover = true
			},
		},
	)

	mm.add(`(min-width: ${breakpoints.medium}px)`, () => {
		nextTick(() => {
			el.value.querySelectorAll('.item .link').forEach((elem) => {
				const images = elem.querySelectorAll('.images-container .image')
				const durationPerImage = 0.33
				const rotationDirection = Math.random() < 0.5 ? -1 : 1

				elem.style.setProperty('--rotation', `${rotationDirection * 20}`)

				const tl = gsap.timeline({ paused: true, repeat: -1 })

				images.forEach((elem, i) => {
					tl.set(elem, { autoAlpha: 1 }, i * durationPerImage)
					tl.set(elem, { autoAlpha: 0 }, (i + 1) * durationPerImage)
				})

				elem.tl = tl
				timelines.push(tl)
			})

			observer = ScrollTrigger.create({
				trigger: props.parent,
				start: 'top bottom',
				onEnter: () => {
					observer.kill()
				},
			})
		})

		return () => {
			kill()
		}
	})
}

const kill = () => {}

const shrinkOthers = (index) => {
	const current = el.value.querySelectorAll('.item')[index]

	switch (index) {
		case 0:
			gsap.to(el.value.querySelectorAll('.item')[1], {
				scale: 0.9,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'right',
			})
			gsap.to(current, {
				scale: 1.2,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'center',
			})
			break

		case 1:
			gsap.to(el.value.querySelectorAll('.item')[0], {
				scale: 0.9,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'left',
			})
			gsap.to(el.value.querySelectorAll('.item')[2], {
				scale: 0.9,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'right',
			})
			gsap.to(current, {
				scale: 1.2,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'center',
			})
			break

		case 2:
			gsap.to(el.value.querySelectorAll('.item')[1], {
				scale: 0.9,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'left',
			})
			gsap.to(el.value.querySelectorAll('.item')[3], {
				scale: 0.9,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'right',
			})
			gsap.to(current, {
				scale: 1.2,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'center',
			})
			break

		case 3:
			gsap.to(el.value.querySelectorAll('.item')[2], {
				scale: 0.9,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'left',
			})
			gsap.to(current, {
				scale: 1.2,
				duration: 0.25,
				ease: 'power4.out',
				transformOrigin: 'center',
			})
			break
	}
}

const handleMouseEnter = (e) => {
	if (!canHover) return

	const index = Number(e.target.closest('.item').dataset.index)

	if (el.value) {
		el.value.querySelectorAll('.item .link')[index].classList.add('active')
		el.value.querySelectorAll('.item .link')[index].tl?.play()
		shrinkOthers(index)
	}
}

const handleMouseLeave = (e) => {
	if (!canHover) return
	const index = Number(e.target.closest('.item').dataset.index)

	if (el.value) {
		el.value.querySelectorAll('.item .link')[index].classList.remove('active')
		el.value.querySelectorAll('.item .link')[index].tl?.pause()

		gsap.killTweensOf(el.value.querySelectorAll('.item'))
		gsap.to(el.value.querySelectorAll('.item'), {
			scale: 1,
			duration: 0.25,
			ease: 'power4.out',
		})
	}
}

onBeforeUnmount(() => kill())
onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='social-networks-simple'] {
	position: relative;
	padding-top: rs(60);

	height: calc(100% - #{rs(96)});

	@include max-screen($medium) {
		padding-bottom: var(--ball-size);
	}

	.list {
		display: flex;

		.item {
			position: absolute;
			bottom: 0;
			left: calc((100% - var(--ball-size)) * (var(--index) / (var(--total-items) - 1)));

			width: var(--ball-size);
			height: var(--ball-size);

			.bg {
				content: '';
				position: absolute;
				top: 0;
				left: 0;

				width: 100%;
				height: 100%;

				background-color: var(--color-darkBrown);
				border-radius: 100%;
			}

			&:nth-child(odd) {
				bottom: calc(var(--ball-size) / 2);
			}
			&:first-child {
				bottom: calc(var(--ball-size) / 2);
			}

			&:last-child {
				bottom: 0;
			}

			.link {
				display: flex;
				width: 100%;
				height: 100%;

				user-select: none;
				will-change: transform;

				@media (hover: hover) {
					&:hover {
						.images-container {
							border: rs(15) solid var(--color-white);
							transform: rotate(calc(var(--rotation) * 1deg));
						}

						.content-container {
							.x-container {
								.x {
									transform: rotate(0deg) scale(1);
									opacity: 1;
								}
							}
						}
					}
				}

				&.active {
					.images-container {
						border: rs(15) solid var(--color-white);
						transform: rotate(calc(var(--rotation) * 1deg));
					}

					.content-container {
						.x-container {
							.x {
								transform: rotate(0deg) scale(1);
								opacity: 1;
							}
						}
					}
				}
			}
			.images-container {
				display: block;

				width: var(--ball-size);
				height: var(--ball-size);

				border-radius: 100%;
				overflow: hidden;

				border: 0px solid transparent;
				pointer-events: none;

				transition:
					transform 0.25s ease(out-expo),
					border 0.25s ease(out-expo);

				.image {
					position: absolute;
					top: 0;
					left: 0;

					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: 100%;

					opacity: 0;
					visibility: hidden;

					&:nth-child(1) {
						opacity: 1;
						visibility: visible;
					}
				}
			}

			.content-container {
				position: absolute;
				top: 0;
				left: 0;

				display: flex;
				align-items: center;
				justify-content: center;
				width: var(--ball-size);
				height: var(--ball-size);

				color: var(--color-white);

				display: grid;

				.initials {
					grid-row: 1;
					grid-column: 1;

					@include max-screen($xsmall) {
						@include title-5;
					}
				}

				.x-container {
					position: absolute;
					top: 0;
					left: 0;

					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					height: 100%;

					pointer-events: none;

					.x {
						transform: rotate(calc(var(--rotation) * -1deg)) scale(2);
						transition:
							transform 0.25s ease(out-expo),
							opacity 0.25s ease(out-expo);
						opacity: 0;

						width: rs(200);
						height: auto;
					}
				}
			}
		}
	}

	.physics-container {
		position: absolute;
		inset: 0;

		@include max-screen($medium) {
			pointer-events: none;
		}
	}
}
</style>
