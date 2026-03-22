<template>
	<div ref="el" data-component="bold-desktop">
		<div class="media-container">
			<MediaAsset :media="background" class="media" />
		</div>

		<div class="words-container">
			<div class="first-word-container">
				<span class="word -uppercase">{{ firstWord }}</span>
				<span class="subtitle-container">
					<p ref="subtitleFirstWordEl" class="-manuscript-2 -uppercase subtitle">Go</p>
				</span>
			</div>

			<div class="second-word-container">
				<div class="mask-container">
					<svg viewBox="0 0 1569 417" preserveAspectRatio="none" class="svg-mask word">
						<defs>
							<mask id="mask" x="0" y="0" width="100%" height="100%">
								<rect x="0" y="0" width="100%" height="100%" fill="white" />
								<text class="-uppercase word-svg" x="50%" y="395" text-anchor="middle" textLength="100%" lengthAdjust="spacingAndGlyphs" fill="black">{{ secondWord }}</text>
							</mask>
						</defs>
						<rect x="0" y="0" width="100%" height="100%" mask="url(#mask)" fill="var(--color-yellow)" />
					</svg>

					<span class="subtitle-container">
						<p ref="subtitleSecondWordEl" class="-manuscript-2 -uppercase subtitle second">Get</p>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { gsap, ScrollTrigger } from 'gsap/all'
import { useScreen } from 'vue-screen'
import { MediaAsset } from '~/components/core'

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger)
}

const props = defineProps({
	firstWord: { type: String, default: '' },
	secondWord: { type: String, default: '' },
	background: { type: [Boolean, Array, Object], default: false },
})

const screen = useScreen()
const el = ref(null)
const subtitleFirstWordEl = ref(null)
const subtitleSecondWordEl = ref(null)
const context = inject('pageContext')

const scaleValues = {
    first: 1,
    second: 1
}

const subtitleFirstWordElTl = gsap.timeline({ paused: true })
const subtitleSecondWordElTl = gsap.timeline({ paused: true })
let subtitleFirstSt
let subtitleSecondSt

watch(screen, () => {
    nextTick(() => {
        resize()
        setup()
        init()
    })
})

const setup = () => {
    if (!el.value) return 
	const firstWord = el.value.querySelector('.first-word-container .word')
	const secondWord = el.value.querySelector('.second-word-container .svg-mask')

    if (firstWord) {
        scaleValues.first = (window.innerHeight - 60) / firstWord.getBoundingClientRect().height
    }
    if (secondWord) {
        scaleValues.second = (window.innerHeight - 0) / secondWord.getBoundingClientRect().height
    }
}

const init = () => {
    if (!el.value) return 
	const wordsContainer = el.value.querySelector('.words-container')
	const mediaContainer = el.value.querySelector('.media-container')
	if (!wordsContainer || !mediaContainer) return

	const firstWord = el.value.querySelector('.first-word-container .word')
	const secondWordSvg = el.value.querySelector('.second-word-container .svg-mask')
	const maskContainer = el.value.querySelector('.second-word-container .mask-container')
	const secondWordContainer = el.value.querySelector('.second-word-container')

    // Clean up only our specific triggers
    if (subtitleFirstSt) subtitleFirstSt.kill()
    if (subtitleSecondSt) subtitleSecondSt.kill()

    // Subtitle 1 Timeline
	subtitleFirstWordElTl.clear().fromTo(
		subtitleFirstWordEl.value,
		{ y: screen.height / 2 },
		{ y: -screen.height / 2, ease: 'none' }
	)

	subtitleFirstSt = ScrollTrigger.create({
		trigger: wordsContainer,
		start: () => `top+=${screen.height / 2}px bottom`,
		end: () => `top+=${screen.height * 1.5}px bottom`,
		onUpdate: ({ progress }) => {
			subtitleFirstWordElTl.progress(progress)
		},
	})

    // Subtitle 2 Timeline
	subtitleSecondWordElTl.clear().fromTo(
		subtitleSecondWordEl.value,
		{ y: screen.height },
		{ y: -screen.height / 2, ease: 'none' }
	)

	subtitleSecondSt = ScrollTrigger.create({
		trigger: wordsContainer,
		start: () => `top+=${screen.height * 1}px bottom`,
		end: () => `top+=${screen.height * 2}px bottom`,
		onUpdate: ({ progress }) => {
			subtitleSecondWordElTl.progress(progress)
		},
	})

    // Phase 1: First Word Enter
	gsap.fromTo(firstWord,
		{ scaleY: 0, transformOrigin: 'top' },
		{
			scaleY: scaleValues.first,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top bottom',
				end: 'top top',
				scrub: true,
			},
		}
	)

    // Phase 2: The Hand-off
	gsap.fromTo(firstWord,
		{ scaleY: scaleValues.first, transformOrigin: 'top' },
		{
			scaleY: 0,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top top',
				end: 'bottom bottom',
				scrub: true,
			},
		}
	)

	gsap.fromTo(secondWordSvg,
		{ y: '50vh', scaleY: 1, transformOrigin: 'top' },
		{
			y: '-50vh',
			scaleY: scaleValues.second,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'top top',
				end: 'bottom bottom',
				scrub: true,
				onUpdate: ({ progress }) => {
					subtitleSecondWordElTl.progress(progress)
				}
			},
		}
	)

    // Phase 3: Big Zoom (70x Portal)
	gsap.fromTo(maskContainer,
		{ scale: 1 },
		{
			scale: 70,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'bottom bottom',
				end: () => `bottom+=${window.innerHeight * 6}px bottom`,
				scrub: true,
			},
		}
	)

	gsap.fromTo(secondWordSvg,
		{ opacity: 1 },
		{
			opacity: 0,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: () => `bottom bottom`,
				end: () => `bottom+=${window.innerHeight * 1.5}px bottom`, // Mask fades out slower (longer duration)
				scrub: true,
			},
		}
	)

	gsap.fromTo(mediaContainer,
		{ opacity: 0 },
		{
			opacity: 1,
			ease: 'none',
			scrollTrigger: {
				trigger: wordsContainer,
				start: 'bottom bottom',
				end: () => `bottom+=${window.innerHeight * 0.2}px bottom`, // Video appears very quickly (0.2vh)
				scrub: true,
			},
		}
	)

	gsap.to(secondWordContainer, {
		backgroundColor: 'transparent',
		ease: 'none',
		scrollTrigger: {
			trigger: wordsContainer,
			start: 'bottom bottom',
			end: () => `bottom+=${window.innerHeight * 0.5}px bottom`, // Background clears moderately fast
			scrub: true,
		},
	})
}

const resize = () => {
    if (!el.value) return 
	const wordsContainer = el.value.querySelector('.words-container')
	const firstWord = el.value.querySelector('.first-word-container .word')
	const maskContainer = el.value.querySelector('.second-word-container .mask-container')
	const secondWord = el.value.querySelector('.second-word-container .word')
	const mediaContainer = el.value.querySelector('.media-container')

	gsap.killTweensOf([wordsContainer, firstWord, maskContainer, secondWord, mediaContainer])
	gsap.set([wordsContainer, firstWord, maskContainer, secondWord, mediaContainer], { clearProps: 'all' })

	if (subtitleSecondSt) subtitleSecondSt.kill()
	if (subtitleFirstSt) subtitleFirstSt.kill()
}

onMounted(() => {
	context.$page.loader.loaded.then(() => setup())
	context.$page.loader.ready.then(() => init())
})

onBeforeUnmount(() => {
    if (subtitleFirstSt) subtitleFirstSt.kill()
    if (subtitleSecondSt) subtitleSecondSt.kill()
    // Also kill the GSAP animations themselves
    gsap.killTweensOf('*')
})
</script>

<style lang="scss" scoped>
[data-component='bold-desktop'] {
	position: relative;
	display: block;
	height: 600vh; // PHYSICAL HEIGHT
	width: 100%;
	background-color: var(--color-yellow);
	overflow: clip; // THE ULTIMATE FIX: Hard clip everything within this 600vh block

	.word {
		font-family: 'PPFormula';
		font-size: rs(450, 108);
		letter-spacing: -0.03em;
		line-height: 0.78em;
		user-select: none;
	}

	.words-container {
		position: sticky;
		top: 0;
		display: block;
		height: 200vh;
		width: 100%;
		overflow: hidden; // LỚP CHẶN THỨ 2: Khóa chặt box sticky

		.subtitle-container {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;

			.subtitle {
				position: relative;
				color: var(--color-white);
				opacity: 0.98;
				z-index: 10;
				font-size: rs(320);
                line-height: 1;
			}
		}

		.first-word-container {
			position: relative;
			padding: 30px 0;
			height: 50vh;
			display: flex;
			align-items: flex-start;
			justify-content: center;
			z-index: 3;

			.word {
				position: relative;
				display: block;
				width: 100%;
				transform-origin: top;
				text-align: center;
				font-variation-settings: 'wdth' 27, 'wght' 1;
				color: var(--color-darkBrown);
				margin-left: -0.06em;
			}
		}

		.second-word-container {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: flex-end;
			height: 50vh;
			z-index: 2;
			background-color: var(--color-yellow);

			.mask-container {
				position: absolute;
				inset: 0;
				z-index: 2;
				transform-origin: 50% 0%;
			}

			.svg-mask {
				position: absolute;
				top: rs(-40);
				left: 0;
                right: 0;
				width: 100%;
                margin: 0 auto;

				background-color: var(--color-darkBrown);
				z-index: 1;

				.word-svg {
					font-family: 'PPFormula';
					font-size: 400px;
					letter-spacing: -0.01em;
					line-height: 0.81em;
					font-variation-settings: 'wdth' 40, 'wght' 600;
				}
			}
		}
	}

	.media-container {
		position: sticky; // Stick to viewport top
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh; // Fixed viewport height
		margin-bottom: -100vh; // Pull subsequent content up to overlap
		overflow: hidden; // Prevent overflow
		z-index: 0; 
		pointer-events: none;

		.media {
			position: relative; // Fill the sticky container
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}
</style>
