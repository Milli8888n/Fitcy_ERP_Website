import { Cache, Clock, Scene, MathUtils } from 'three'
import { Timer } from 'three-stdlib'

import { Renderer } from './defaults/renderer'
import { PerspectiveCamera } from './defaults/camera/perspective'
import { OrthographicCamera } from './defaults/camera/orthographic'

let hooks

/**
 * Three invalidate - force render
 */

export function invalidate() {
	return hooks?.invalidate()
}

/**
 * Three state
 * @returns {Object} {camera, gl, scene, clock, ...}
 */

export function useThree() {
	if (!hooks) {
		throw new Error('\u{1F340} BüroGL: useThree() hook called outside render context')
	}
	return hooks?.useThree()
}

/**
 * This hook runs every frame, state (same as useThree) and a clock delta available
 * @param {function} f ({camera, gl, scene, clock, ...}, delta) => {}
 */

export function useFrame(f) {
	if (!hooks) {
		throw new Error('\u{1F340} BüroGL: useFrame() hook called outside render context')
	}
	return hooks?.useFrame(f)
}

/**
 * Dispose hook
 * @param {function} f () => {}
 */

export function useDispose(f) {
	if (!hooks) {
		throw new Error('\u{1F340} BüroGL: useDispose() hook called outside render context')
	}
	return hooks?.useDispose(f)
}

/**
 * This hook runs on every resize if active
 * @param {function} f () => {}
 */

export function useResize(f) {
	if (!hooks) {
		throw new Error('\u{1F340} BüroGL: useResize() hook called outside render context')
	}
	return hooks?.useResize(f)
}

/**
 * Use this hook to proxy values between the dom and the worker
 * @param {function} f ({ proxy parameters }) => {}
 * @param {string} t type
 */

export function useProxy(f, t) {
	//
	if (!hooks) {
		throw new Error('\u{1F340} BüroGL: useResize() hook called outside render context')
	}
	return hooks?.useProxy(f, t)
}

export function ThreeCore() {
	//

	const handler1 = {
		set(target, key, value, receiver) {
			const result = Reflect.set(target, key, value, receiver)
			if (key === 'frameloop') {
				if (value === 'always') {
					__state.timer.reset()
					// raf(0)
				}
			}

			return result
		},
	}

	const send = (message) => {
		//
		self.postMessage?.({ type: 'proxy', options: message })
	}

	const __state = new Proxy(
		{
			// eslint-disable-next-line no-undef
			dev: process.env.NODE_ENV === 'development' || process.env.STORYBOOK, // import.meta.env.NODE_ENV === 'development' || import.meta.env.STORYBOOK
			uuid: MathUtils.generateUUID(),
			size: {
				width: 0,
				height: 0,
				top: 0,
				left: 0,
			},
			gl: undefined,
			camera: undefined,
			scene: undefined,
			timer: new Timer(),
			clock: new Clock(),
			frameloop: 'always',
			offScreen: false,
			proxy: {
				defaults: [],
				send,
			},
		},
		handler1,
	)

	const __internal = {
		props: {
			scene: true,
			gl: {
				dpr: 1,
				width: 0,
				height: 0,
			},
			camera: {
				width: undefined,
				height: undefined,
				orthographic: false,
			},
		},
		rafID: undefined,
		disposeCallback: () => { },
	}

	const __frames = new Set()
	const __resizes = new Set()
	const __disposers = new Set()
	const __proxys = new Set()

	function create(canvasRef, options, disposeCallback) {
		// setup props

		if (options.proxyStartValues) {
			__state.proxy.defaults = options.proxyStartValues
		}

		if (options.dev !== undefined) __state.dev = options.dev
		if (options.scene !== undefined) __internal.props.scene = options.scene
		if (options.frameloop !== undefined) __state.frameloop = options.frameloop

		if (options.gl !== undefined) __internal.props.gl = { ...__internal.props.gl, ...options.gl }
		if (options.camera !== undefined) __internal.props.camera = { ...__internal.props.camera, ...options.camera }

		if (__state.dev) {
			console.groupCollapsed('BüroGL Context \u{1F340}')
			console.info(`uuid: ${__state.uuid}\n${__state.dev ? 'dev' : 'prod'}\nv0.1.0`)
			if (options.offScreen !== undefined) {
				console.info('Using OffScreenCanvas 🚀\u{1F340}')
				__state.offScreen = true
			}
			console.groupEnd()
		}

		if (typeof disposeCallback === 'function') __internal.disposeCallback = disposeCallback

		// enable cache
		Cache.enabled = true

		// render
		__state.gl = Renderer({ canvas: canvasRef, ...__internal.props.gl })

		__state.gl.setPixelRatio(__internal.props.gl.dpr)
		if (!__state.dev) {
			__state.gl.debug.checkShaderErrors = false
		}

		const { size } = { ...options }
		if (size) {
			__state.gl?.setSize(size.width, size.height, false)
			__state.gl?.setPixelRatio(__internal.props.gl.dpr)
			__state.size = size
		}

		// camera
		if (__internal.props.camera.orthographic) {
			__state.camera = OrthographicCamera(__internal.props.camera)
		} else {
			__state.camera = PerspectiveCamera(__internal.props.camera)
			__state.camera.aspect = __state.size.width / __state.size.height
		}

		// scene
		if (__internal.props.scene) {
			__state.scene = new Scene()
			__state.scene.name = 'main'
		}

		// raf()
		__state.gl.setAnimationLoop(raf)

		// console.log('__state.gl', __state.gl)
	}

	const performance = (() => {
		let frameCount = 0
		let lastTime = 0
		let fps = 0

		const get = () => {
			const elapsedTime = __state.clock.getElapsedTime()
			const deltaTime = elapsedTime - lastTime
			frameCount++

			// if (deltaTime > 0.05) {
			fps = Math.round(frameCount / deltaTime)
			frameCount = 0
			lastTime = elapsedTime
			// }

			return fps
		}

		get()

		return { get }
	})()

	const invalidate = () => {
		render()
	}

	function render(timestamp) {
		const delta = __state.clock.getDelta()
		const fps = performance.get()

		__state.timer.update(timestamp)

		__frames.forEach((f) => f({ ...__state, fps }, delta))

		if (__state.scene) __state.gl?.render(__state.scene, __state.camera)
	}

	function raf(timestamp) {
		// __internal.rafID = requestAnimationFrame(raf)
		if (__state.frameloop !== 'none') {
			if (typeof document === 'object')
				try {
					if (document.contains(__state.gl.domElement) === false) {
						__internal.disposeCallback()
						return
					}
				} catch (_) {
					console.error(_)
					return
				}

			render(timestamp)
		} else {
			// cancelAnimationFrame(__internal.rafID)
		}
	}

	function setSize({ width, height, dpr }) {
		const needsResize = __internal.props.gl.width !== width || __internal.props.gl.height !== height

		if (needsResize) {
			__internal.props.gl.width = width
			__internal.props.gl.height = height
			__state.size.width = width
			__state.size.height = height
			__state.gl?.setSize(__state.size.width, __state.size.height, false)
		}

		const needsDpiUpdate = __internal.props.gl.dpr !== dpr
		if (needsDpiUpdate) {
			__internal.props.gl.dpr = dpr
			__state.gl.dpr = dpr
			__state.gl?.setPixelRatio(__internal.props.gl.dpr)
		}
	}

	function resize(props) {
		setSize(props)
		__state.camera.bglResize(__internal.props.camera.width || __state.size.width, __internal.props.camera.height || __state.size.height)
		__resizes.forEach((r) => r(props))
	}

	function proxy(options) {
		__proxys.forEach((r) => {
			if (options.type === r.type) {
				r.callback(options)
			}
		})
	}

	// hooks
	function useProxy(callback, type) {
		__proxys.add({ callback, type })
	}

	function useThree() {
		return __state
	}

	function useFrame(callback) {
		__frames.add(callback)
	}

	function useResize(callback) {
		__resizes.add(callback)
	}

	function useDispose(callback) {
		__disposers.add(callback)
	}

	function dispose() {
		__disposers.forEach((dispose) => dispose())

		__state.gl.setAnimationLoop(null)

		// cancelAnimationFrame(__internal.rafID)

		__frames.clear()
		__resizes.clear()
		__disposers.clear()
		__proxys.clear()

		__state.timer.dispose()

		__state.clock.stop()
		__state.scene?.clear()

		__state.gl.forceContextLoss?.()

		__state.gl.dispose()

		__state.gl.domElement = null
		__state.gl.renderLists?.dispose()

		__state.gl = null
		__state.camera = null
		__state.scene = null
	}

	hooks = { useThree, useFrame, useDispose, useResize, create, invalidate, useProxy }

	return { useThree, useFrame, useDispose, useResize, create, resize, proxy, dispose, __state }
}
