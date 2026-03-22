export const memoBoundingClientRect = (element, initMemo = true) => {
	const obj = {
		node: element,
		x: null,
		y: null,
		width: null,
		offsetWidth: null,
		height: null,
		offsetHeight: null,
		last: { x: null, y: null, width: null, offsetWidth: null, height: null, offsetHeight: null },
		update() {
			if (!this.node) return

			this.last = { x: this.x, y: this.x, width: this.width, offsetWidth: this.offsetWidth, height: this.height, offsetHeight: this.offsetHeight }

			const bb = this.node.getBoundingClientRect()
			this.x = bb.x
			this.y = bb.y
			this.width = bb.width
			this.height = bb.height

			this.offsetWidth = this.node.offsetWidth
			this.offsetHeight = this.node.offsetHeight
		},
	}

	if (initMemo) obj.update()

	return obj
}

// returns promise
export const imgLoaded = (img, resolveLimit = false) => {
	const node = (() => {
		if (img instanceof HTMLElement) return img
		if (typeof img === 'string') return document.body.querySelector(img)
		return null
	})()

	return new Promise((resolve) => {
		if (!node) resolve()
		if (node.complete && node.naturalHeight !== 0) resolve()
		node.onload = resolve

		if (resolveLimit && typeof resolveLimit === 'number') setTimeout(resolve, resolveLimit)
	})
}

export const videoLoaded = (video, resolveLimit = false) => {
	const node = (() => {
		if (video instanceof HTMLElement) return video
		if (typeof video === 'string') return document.body.querySelector(video)
		return null
	})()

	return new Promise((resolve) => {
		if (!node) resolve()

		// Check if video is already loaded and can play
		if (node.readyState >= 3) resolve()

		// Listen for canplay event
		node.addEventListener('canplay', () => resolve(), { once: true })

		// Optional timeout
		if (resolveLimit && typeof resolveLimit === 'number') {
			setTimeout(resolve, resolveLimit)
		}
	})
}
