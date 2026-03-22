import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { gsap } from 'gsap'

const isMuted = ref(true)
const canChangeVolume = ref(true)
const audios = ref({})
const mainAudio = ref(null) // Optional persistent audio
const currentAudio = ref(null)
const FADE_DURATION = 2 // Duration in seconds

export function useAudioController() {
	const route = useRoute()

	async function loadAudio(slug, paths) {
		if (import.meta.server) return

		const { default: Pizzicato } = await import('pizzicato')
		return new Promise((resolve) => {
			const sounds = paths.map((path) => new Pizzicato.Sound({ source: 'file', options: { path, loop: 0 } }))
			const group = new Pizzicato.Group(sounds)

			audios.value[slug] = { group, sounds }

			console.log(`⚙︎ [Global] ${slug} audios loaded.`)
			resolve()
		})
	}

	function fadeAudio(group, fromVolume, toVolume, duration = FADE_DURATION) {
		return new Promise((resolve) => {
			const startVolume = group.volume
			gsap.fromTo(
				group,
				{ volume: fromVolume || startVolume },
				{
					volume: toVolume,
					duration,
					ease: 'power2.inOut',
					onComplete: resolve,
				},
			)
		})
	}

	async function play(slug) {
		if (isMuted.value || !audios.value[slug]) return

		// Start new audio with fade in immediately
		const newAudio = audios.value[slug]
		newAudio.group.volume = 0
		newAudio.group.play()
		await fadeAudio(newAudio.group, 0, 1)

		currentAudio.value = newAudio
	}

	function pause(slug) {
		if (audios.value[slug]) audios.value[slug].group.pause()
	}

	function stop(slug) {
		// Fade out before stopping
		if (currentAudio.value && currentAudio.value === audios.value[slug]) {
			fadeAudio(audios.value[slug].group, audios.value[slug].group.volume, 0).then(() => {
				audios.value[slug].group.stop()
			})
		}
	}

	async function toggleMute() {
		isMuted.value = !isMuted.value

		if (isMuted.value) {
			// Fade out all playing audio
			const fadePromises = Object.values(audios.value).map(({ group }) => fadeAudio(group, group.volume, 0).then(() => group.stop()))
			await Promise.all(fadePromises)
			currentAudio.value = null
		} else {
			play(route.path)
		}
	}

	function setVolume(volume, slug) {
		if (!canChangeVolume.value || isMuted.value || !audios.value[slug]) return
		audios.value[slug].group.volume = volume
	}

	// Watch route changes and apply play/pause logic
	watch(
		() => route.path,
		(newPath, oldPath) => {
			if (newPath !== oldPath) {
				stop(oldPath) // Stop the old route audio
				play(newPath) // Play the new route audio
			}
		},
	)

	onMounted(() => {
		if (mainAudio.value) play('main')

		window.addEventListener('blur', () => pause(route.path))
		window.addEventListener('focus', () => play(route.path))
	})

	onUnmounted(() => {
		Object.values(audios.value).forEach(({ group }) => group.stop())
	})

	return { play, pause, stop, setVolume, toggleMute, loadAudio, isMuted }
}
