export const lerp = (value, start, end) => {
	return (1 - value) * start + value * end
}

export const clamp = (number, rangeMin, rangeMax) => {
	return Math.min(Math.max(number, rangeMin), rangeMax)
}

export const mapNumber = (n, start1, stop1, start2, stop2, withinBounds = false) => {
	const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
	if (!withinBounds) {
		return newval
	}
	if (start2 < stop2) {
		return clamp(newval, start2, stop2)
	} else {
		return clamp(newval, stop2, start2)
	}
}

export const linearEquationFromPoints = (pointA, pointB) => {
	const m = (pointB[1] - pointA[1]) / (pointB[0] - pointA[0])
	const b = m * pointB[0] - pointB[1]

	return [m, b]
}

export const formatUnits = (value, unitMult, units, asString = false) => {
	if (value === 0) return units[0]

	let index = parseInt(Math.floor(Math.log(value) / Math.log(unitMult)))
	index = Math.min(index, units.length - 1)

	const [parsedValue, unit] = [Math.round(value / Math.pow(unitMult, index), 2), units[index]]

	if (asString) return [parsedValue, unit].join('')
	return [parsedValue, unit]
}

export const getRandom = (min, max) => {
	return min + Math.floor(Math.random() * (max - min + 1))
}

export const randomIntExclude = (min, max, exclude) => {
	const nums = []
	const excludeLookup = new Set(exclude)
	for (let i = min; i <= max; i++) {
		if (!excludeLookup.has(i)) nums.push(i)
	}
	if (nums.length === 0) return false

	const randomIndex = Math.floor(Math.random() * nums.length)
	return nums[randomIndex]
}

export const shuffleArray = (array) => {
	let i = array.length
	let j = 0
	let temp

	while (i--) {
		j = Math.floor(Math.random() * (i + 1))

		// swap randomly chosen element with current element
		temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}

	return array
}
