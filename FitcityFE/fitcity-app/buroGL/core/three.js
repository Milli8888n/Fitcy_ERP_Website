import { ThreeCore } from './runner'

const isOSCSupported = (canvasRef) => {
	try {
		return canvasRef.transferControlToOffscreen()
	} catch {
		console.info('OffScreenCanvas not supported \u{1F340}')
		return false // browser doesn't support offscreen canvas
	}
}

function throttle(f, delay) {
	let timer = 0

	return function (...args) {
		clearTimeout(timer)
		timer = setTimeout(() => f.apply(this, args), delay)
	}
}

/**
 * BüroGL three.js
 */

const Three = (function () {
	/**
	 * Creates context
	 * @param {HTMLCanvasElement} canvasRef
	 * @param {object|Function} props.gl - Default renderer props
	 * @param {object|Function} props.camera - Default camera props
	 * @param {boolean} props.camera.orthographic - Use an orthographic camera (default is false)
	 * @param {string} props.frameloop - Render mode [always, demand, never] (default is always)
	 * @param {boolean} props.resize - Canvas resize observer (default is true)
	 * @param {boolean} props.scene - Main scene (default is true)
	 */

	const createApp = (canvasRef, props) => {
		if (canvasRef.tagName !== 'CANVAS') {
			throw new Error("\u{1F340} BüroGL: 'canvasRef' is not a valid HTML canvas")
		}

		let __context

		const __state = {
			size: {
				width: 0,
				height: 0,
				top: 0,
				left: 0,
			},
			gl: {
				dpr: Math.max(window.devicePixelRatio, 2),
			},
			resize: true,
			observe: true,
			...props,
		}

		let renderObserver
		if (__state.observe) {
			renderObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					const isWorker = Object.getPrototypeOf(__context).constructor.name === 'Worker'

					if (entry.isIntersecting) {
						if (isWorker) {
							__context.postMessage({ type: 'frameloop', state: 'always' })
						} else {
							__context.__state.frameloop = 'always'
						}
					} else if (isWorker) {
						__context.postMessage({ type: 'frameloop', state: 'none' })
					} else {
						__context.__state.frameloop = 'none'
					}
				})
			})
			renderObserver.observe(canvasRef.parentElement)
		}

		const visibilityObs = () => {
			if (Object.getPrototypeOf(__context).constructor.name === 'Worker') {
				__context.postMessage({ type: 'frameloop', state: document.hidden ? 'none' : 'always' })
			}
		}

		document.addEventListener('visibilitychange', visibilityObs, false)

		const resizeObserver = new ResizeObserver(
			throttle((entries) => {
				__state.size.width = entries[0].contentRect.width
				__state.size.height = entries[0].contentRect.height
				__state.size.top = entries[0].contentRect.top
				__state.size.left = entries[0].contentRect.left

				__state.gl.dpr = props?.gl?.dpr || Math.max(window.devicePixelRatio, 2)

				if (typeof __context.resize === 'function') {
					__context.resize({ ...__state.size, dpr: __state.gl.dpr })
				}

				if (Object.getPrototypeOf(__context).constructor.name === 'Worker') {
					__context.postMessage({ type: 'resize', ...__state.size, dpr: __state.gl.dpr })
				}
			}, 10),
		)

		if (__state.resize) {
			resizeObserver.observe(canvasRef.parentElement)
		}

		/**
		 * Releases used resources, call this if you are using a web worker before calling worker.terminate()
		 */

		const dispose = () => {
			__proxys.clear()

			renderObserver?.disconnect()
			resizeObserver?.disconnect()

			document.removeEventListener('visibilitychange', visibilityObs)

			if (typeof __context.dispose === 'function') {
				__context.dispose()
			}

			if (Object.getPrototypeOf(__context).constructor.name === 'Worker') {
				__context.postMessage({ type: 'dispose' })
				__context.terminate()
			}

			__context = undefined
		}

		const __init = () => {
			const { width, height, top, left } = canvasRef.parentElement.getBoundingClientRect()
			__state.size.width = width
			__state.size.height = height
			__state.size.top = top
			__state.size.left = left

			__context = ThreeCore()

			__context.create(canvasRef, __state, () => {
				dispose()
			})
		}

		const __screenRender = (Component) => {
			if (!__context) {
				__init()
			}

			if (Component.constructor.name === 'AsyncFunction') {
				throw new Error('\u{1F340} BüroGL: async component causes context to be lost')
			}

			Component(__context.__state, __context)
		}

		const __offScreenRender = (worker, ComponentFallback) => {
			if (__context) {
				console.warn('\u{1F340} BüroGL: offScreenCanvas do not support multiple render()')
				return
			}

			const offScreenControl = isOSCSupported(canvasRef)

			if (!ComponentFallback) {
				console.warn('OffScreenRender fallback not provided \u{1F340}')
			}

			if (!offScreenControl) {
				if (ComponentFallback) {
					console.info('OffScreenCanvas is not supported\nUsing ComponentFallback \u{1F340}')
					__screenRender(ComponentFallback)
				}
				return
			}

			const { width, height, top, left } = canvasRef.parentElement.getBoundingClientRect()
			__state.size.width = width
			__state.size.height = height
			__state.size.left = left
			__state.size.top = top

			__context = worker
			__context.postMessage({ type: 'init', canvas: offScreenControl, ...__state }, [offScreenControl])
			__context.onmessage = ({ data }) => {
				if (data.type === 'proxy') {
					const { options } = data
					__proxys.forEach((r) => {
						if (options.type === r.type) {
							r.callback(options)
						}
					})
				}
			}
		}

		/**
		 * @param {Function|Worker} code Function whit the code to render
		 * @param {Function} [fallback] Worker fallback
		 */

		const render = (code, fallback) => {
			if (Object.getPrototypeOf(code).constructor.name === 'Worker') {
				__offScreenRender(code, fallback)
			} else {
				__screenRender(code)
			}
		}

		const tx = (options) => {
			if(!__context){
				return
			}
			if (typeof __context.resize === 'function') {
				__context.proxy(options)
			} else {
				__context.postMessage({ type: 'proxy', options })
			}
		}

		const __proxys = new Set()

		const rx = (options, type) => {
			if (__context.resize && typeof __context.resize === 'function') {
				console.error('proxy rx api is only implemented in worker mode')
			} else {
				__proxys.add({ callback: options, type })
			}
		}

		/**
		 * Proxy values between the dom and the worker
		 * @param {Object} [options]
		 */
		const proxy = (o1, type) => {
			if (typeof o1 === 'function' && type) {
				rx(o1, type)
			}
			if (typeof o1 === 'object') {
				tx(o1)
			}
		}

		return { render, dispose, proxy }
	}

	return {
		createApp,
	}
})()

export { Three }
