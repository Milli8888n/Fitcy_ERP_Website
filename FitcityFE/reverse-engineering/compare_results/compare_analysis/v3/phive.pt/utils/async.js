export const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

export const debounce = (func, delay) => {
	let timerId
	return function () {
		clearTimeout(timerId)
		timerId = setTimeout(() => func.apply(this, arguments), delay)
	}
}

export const throttle = (func, delay) => {
	let toThrottle = false
	return function () {
		if (!toThrottle) {
			toThrottle = true
			func.apply(this, arguments)
			setTimeout(() => {
				toThrottle = false
			}, delay)
		}
	}
}
