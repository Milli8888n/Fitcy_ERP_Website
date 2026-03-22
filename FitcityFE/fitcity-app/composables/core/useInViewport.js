import { ref, onMounted, onUnmounted, onBeforeUnmount, watch } from 'vue'

export const useInViewport = (target, options) => {
	const intersectionRatio = ref(0)
	const viewport = ref(null)
	const inViewport = ref(false)
	const direction = ref(null) // To store the direction (top/bottom)

	let previousY = 0 // To store the previous Y position
	let observer = null

	const handleIntersection = (entries) => {
		if (entries.length > 0) {
			const entry = entries[0]
			intersectionRatio.value = entry.intersectionRatio
			inViewport.value = entry.intersectionRatio === 0 ? false : true

			// Determine the direction by comparing current and previous Y positions
			const currentY = entry.boundingClientRect.top
			direction.value = currentY < previousY ? 'top' : 'bottom'

			viewport.value = {
				inViewport: inViewport.value,
				direction: direction.value,
				intersectionRatio: intersectionRatio.value,
			}

			// Update previous Y for the next comparison
			previousY = currentY
		}
	}

	const disconnect = () => {
		if (observer && target.value) {
			observer.unobserve(target.value)
			observer.disconnect()
			observer = null
		}
	}

	onMounted(() => {
		observer = new IntersectionObserver(handleIntersection, options)
		if (target.value) {
			observer.observe(target.value)
		}
	})

	onBeforeUnmount(() => {
		if (observer && target.value) {
			observer.unobserve(target.value)
			observer.disconnect()
		}
	})

	return {
		inViewport,
		viewport,
		disconnect,
	}
}
