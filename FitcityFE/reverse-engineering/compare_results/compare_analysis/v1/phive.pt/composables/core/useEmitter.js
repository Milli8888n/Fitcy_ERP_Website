import { STORYBOOK } from '~/config/site'
import { useNuxtApp } from '#imports'

export function useEmitter() {
	if (STORYBOOK) {
		// No-op for Storybook
		return {
			emit: () => {},
			on: () => () => {},
			off: () => {},
		}
	}

	const { hooks } = useNuxtApp()
	const listeners = new Map() // To track registered listeners

	if (!hooks) {
		if (process.dev) {
			console.warn('Hooks are not available. Emit, On, and Off are no-ops.')
		}
		return {
			emit: () => {},
			on: () => () => {},
			off: () => {},
		}
	}

	return {
		emit: hooks.callHook.bind(hooks),

		on: function (event, callback) {
			// Register the event with Nuxt's hooks
			hooks.hook(event, callback)

			// Add to the internal listeners Map
			if (!listeners.has(event)) {
				listeners.set(event, new Set())
			}
			listeners.get(event).add(callback)

			// Return an off function
			return () => {
				this.off(event, callback)
			}
		},

		off: function (event, callback) {
			const eventListeners = listeners.get(event)
			if (eventListeners && eventListeners.has(callback)) {
				// Remove from Nuxt hooks
				hooks.removeHook(event, callback) // Properly unbind from Nuxt
				eventListeners.delete(callback) // Remove from internal Map

				// Clean up if no listeners remain
				if (eventListeners.size === 0) {
					listeners.delete(event)
				}

				if (process.dev) {
					console.log(`Listener for event "${event}" removed.`)
				}
			} else if (process.dev) {
				console.warn(`No listener found for event "${event}"`)
			}
		},
	}
}
