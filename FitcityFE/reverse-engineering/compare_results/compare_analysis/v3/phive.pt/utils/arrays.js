export const randomIndex = (arr) => arr[Math.floor(Math.random() * arr.length)]

export const removeElement = (arr, element) => {
	const index = arr.indexOf(element)
	if (index < 0) return false

	arr.splice(index, 1)
}

export function reorderArray(arr, currentIndex, finalIndex) {
	if (currentIndex < 0 || currentIndex >= arr.length) {
		throw new Error('Current index out of range')
	}
	if (finalIndex < 0 || finalIndex >= arr.length) {
		throw new Error('Final index out of range')
	}

	// Remove the item from the array
	const item = arr[currentIndex]
	const filteredArray = arr.filter((_, idx) => idx !== currentIndex)

	// Insert the item at the final index
	return [...filteredArray.slice(0, finalIndex), item, ...filteredArray.slice(finalIndex)]
}

export const shuffle = (array, randomValue) => {
	let counter = array.length

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		const index = Math.floor(randomValue * counter)

		// Decrease counter by 1
		counter--

		// And swap the last element with it
		const temp = array[counter]
		array[counter] = array[index]
		array[index] = temp
	}

	return array
}

export const removeDuplicatesByKey = (array, key) => {
	// Using a Set to keep track of seen key values
	const seenKeys = new Set()

	// Filter array to include only elements with unique key values
	const result = array.filter((item) => {
		// Check if key value is already in the set
		if (seenKeys.has(item[key])) {
			return false // If duplicate, filter out the element
		} else {
			seenKeys.add(item[key]) // Add key value to the set
			return true // Include the element in the result
		}
	})

	return result
}

export const splitArray = (arr, numParts) => {
	const partSize = Math.floor(arr.length / numParts)
	const remainder = arr.length % numParts
	const result = []
	let start = 0

	for (let i = 0; i < numParts; i++) {
		// Each part gets an extra item if `remainder > 0`
		const end = start + partSize + (i < remainder ? 1 : 0)
		result.push(arr.slice(start, end))
		start = end
	}

	return result
}

export default { randomIndex, removeElement, shuffle, removeDuplicatesByKey, splitArray }
