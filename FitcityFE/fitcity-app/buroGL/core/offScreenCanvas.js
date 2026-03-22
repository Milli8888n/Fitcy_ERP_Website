import { ThreeCore } from './runner'

const __renderGroup = []
let __context

export function offScreenRender(Component) {
	__renderGroup.push(Component)
}

function init(data) {
	if (__context) {
		throw new Error('\u{1F340} BüroGL: Context already defined, createApp() should be called only once')
	}

	__context = ThreeCore()
	__context.create(data.canvas, { offScreen: true, ...data })

	__renderGroup.forEach((Component) => {
		Component(__context.__state)
	})
}

function resize(data) {
	__context?.resize(data)
}

function frameloop({ state }) {
	__context.__state.frameloop = state
}

function proxy(data) {
	__context?.proxy(data.options)
}

function dispose() {
	__context?.dispose()
}

const handlers = {
	init,
	resize,
	frameloop,
	proxy,
	dispose,
}

self.onmessage = function (e) {
	const fn = handlers[e.data.type]
	if (typeof fn !== 'function' || e.data.type === 'webpackOk') {
		return
	}

	fn(e.data)
}
