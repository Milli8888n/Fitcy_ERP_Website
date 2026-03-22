import { UnscopedPromise, isPromise, awaitDynamicPromiseArray } from './helpers'
const DEBUG_LIFECYCLE = true

export function createPageLoader(slug) {
	// promises
	const mounted = new UnscopedPromise()
	const loaded = new UnscopedPromise()
	const ready = new UnscopedPromise()
	const transitionReady = new UnscopedPromise()
	const destroyed = new UnscopedPromise()

	// defers
	const loadedPromises = []

	function log(message, type = 'log') {
		if (DEBUG_LIFECYCLE) {
			return console[type](`⚙︎ [${slug}] ${message}︎`)
		}
	}

	function handleMounted() {
		awaitDynamicPromiseArray(loadedPromises, handleLoaded.bind(this))
		mounted.resolve()

		log('mounted')
	}

	function handleLoaded() {
		loaded.resolve()

		log('loaded')
	}

	function handleReady() {
		ready.resolve()

		log('ready')
	}

	function handleTransitionReady() {
		transitionReady.resolve()

		log('transitionReady')
	}

	function handleDestroyed() {
		destroyed.resolve()

		log('destroyed')
	}

	function deferLoad(promise) {
		if (isPromise(promise)) {
			loadedPromises.push(promise)
		} else {
			return log('Object provided to deferSync is not a promise️', 'warn')
		}
	}

	function dispatch(action) {
		switch (action.toLowerCase()) {
			case 'mounted':
				handleMounted()
				break
			case 'ready':
				handleReady()
				break
			case 'transition-ready':
				handleTransitionReady()
				break
			case 'destroyed':
				handleDestroyed()
				break
		}
	}

	log('created')

	return {
		dispatch,
		deferLoad,
		get mounted() {
			return mounted.promise
		},
		get loaded() {
			return loaded.promise
		},
		get ready() {
			return ready.promise
		},
		get transitionReady() {
			return transitionReady.promise
		},
		get destroyed() {
			return destroyed.promise
		},
		get isMounted() {
			return mounted.resolved
		},
		get isLoaded() {
			return loaded.resolved
		},
		get isReady() {
			return ready.resolved
		},
		get isTransitionReady() {
			return transitionReady.resolved
		},
		get isDestroyed() {
			return destroyed.resolved
		},
	}
}
