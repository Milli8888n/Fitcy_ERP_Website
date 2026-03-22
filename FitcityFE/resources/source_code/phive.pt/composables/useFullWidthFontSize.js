export const useFullWidthFontSize = (params) => {
	const { element, container, maxFontSize = 1000 } = params

	const resizeFont = () => {
		document.fonts.ready.then(() => {
			const containerElement = container?.value || document.querySelector('body')

			const textElement = element.value
			let fontSize = maxFontSize

			textElement.style.visibility = 'hidden'
			textElement.style.fontSize = `${fontSize}px`

			while (textElement.scrollWidth > containerElement.clientWidth * 0.6 && fontSize > 0) {
				fontSize--
				textElement.style.fontSize = `${fontSize}px`
			}

			textElement.style.visibility = 'visible'
		})
	}

	return { resizeFont }
}
