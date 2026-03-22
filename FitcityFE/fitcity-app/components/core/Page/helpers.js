export function isPromise(obj) {
	return typeof obj === 'object' && 'then' in obj && typeof obj.then === 'function'
}

export function awaitDynamicPromiseArray(promiseArray, then, promiseArrayLengthBeforeAwait = 0, recursionLoop = 0) {
	const MAX_RECURSION_LOOPS = 10

	if (promiseArray.length === promiseArrayLengthBeforeAwait || recursionLoop >= MAX_RECURSION_LOOPS) return then()

	const lengthAtStart = promiseArray.length
	return Promise.allSettled(promiseArray).then(() => {
		awaitDynamicPromiseArray(promiseArray, then, lengthAtStart, recursionLoop + 1)
	})
}

export class UnscopedPromise {
	constructor() {
		this.resolved = false
		this.rejected = false

		this.promise = new Promise((resolve, reject) => {
			this.resolve = () => {
				this.resolved = true
				resolve()
			}
			this.reject = (e) => {
				this.rejected = true
				reject(e)
			}
		})
	}
}
