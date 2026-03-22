import { ref } from '#imports'

export const useSwipeDetection = (onSwipe) => {
	const startX = ref(null)
	const startY = ref(null)
	const isSwiping = ref(false)

	// Handle the touch start event
	const handleTouchStart = (event) => {
		startX.value = event.touches[0].clientX
		startY.value = event.touches[0].clientY
		isSwiping.value = true
	}

	// Handle the touch move event
	const handleTouchMove = (event) => {
		if (!isSwiping.value) return

		const currentX = event.touches[0].clientX
		const currentY = event.touches[0].clientY
		const diffX = currentX - startX.value
		const diffY = currentY - startY.value

		// Detect horizontal swipe
		if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 20) {
			if (diffX > 0) {
				// Swiped right
				onSwipe('right') // Trigger the callback with 'right' direction
			} else {
				// Swiped left
				onSwipe('left') // Trigger the callback with 'left' direction
			}
		}

		// // Reset swipe detection
		// isSwiping.value = false
		// startX.value = null
		// startY.value = null
	}

	// Handle the touch end event
	const handleTouchEnd = () => {
		// Reset swipe detection
		isSwiping.value = false
		startX.value = null
		startY.value = null
	}

	return {
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
	}
}
