const memoizedLoaders = new WeakMap()

function loadingFn(extensions, onProgress) {
	return function (Proto, ...input) {
		let loader = memoizedLoaders.get(Proto)

		if (!loader) {
			loader = new Proto()
			memoizedLoaders.set(Proto, loader)
		}

		if (extensions) extensions(loader)

		return Promise.all(
			input.map(
				(input) =>
					new Promise((resolve, reject) =>
						loader.load(
							input,
							(data) => {
								resolve(data)
							},
							onProgress,
							(error) => reject(new Error(`Could not load ${input}: ${error?.message}`)),
						),
					),
			),
		).finally(() => loader.dispose?.())
	}
}

export const useLoader = (Proto, input, extensions, onProgress) => {
	const keys = Array.isArray(input) ? input : [input]

	const load = loadingFn(extensions, onProgress)
	const results = load(Proto, ...keys)

	return results
}

/**
 * Preloads an asset into cache as a side-effect.
 */

useLoader.preload = function (Proto, input, extensions) {
	const keys = Array.isArray(input) ? input : [input]

	const load = loadingFn(extensions)
	load(Proto, ...keys)
}
