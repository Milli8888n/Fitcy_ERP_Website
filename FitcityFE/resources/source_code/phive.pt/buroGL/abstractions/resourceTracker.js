import { Object3D, Material, Texture } from 'three'

/**  
	Creates a resource tracker
	@return {Object} { track, untrack, dispose, log } 
*/

export function ResourceTracker() {
	const resources = new Set()

	const track = (resource) => {
		if (!resource) {
			return resource
		}

		// handle children and when material is an array of materials.
		if (Array.isArray(resource)) {
			resource.forEach((resource) => track(resource))
			return resource
		}

		if (resource.dispose || resource instanceof Object3D) {
			resources.add(resource)
		}

		// nested stuff
		if (resource instanceof Object3D) {
			track(resource.geometry)
			track(resource.material)
			track(resource.children)
		} else if (resource instanceof Material) {
			// We have to check if there are any textures on the material
			for (const value of Object.values(resource)) {
				if (value instanceof Texture) {
					track(value)
				}
			}
			// We also have to check if any uniforms reference textures or arrays of textures
			if (resource.uniforms) {
				for (const value of Object.values(resource.uniforms)) {
					if (value) {
						const uniformValue = value.value
						if (uniformValue instanceof Texture || Array.isArray(uniformValue)) {
							track(uniformValue)
						}
					}
				}
			}
		}

		return resource
	}

	const untrack = (resource) => {
		resources.delete(resource)
	}

	const dispose = () => {
		resources.forEach((resource) => {
			if (resource instanceof Object3D) {
				if (resource.parent) {
					resource.parent.remove(resource)
				}
			}
			if (resource.dispose) {
				resource.dispose()
			}
		})
		resources.clear()
	}

	const log = () => {
		if (resources.size === 0) {
			console.info('🕵 BüroGL GC is empty')
			return
		}
		console.group('🕵 BüroGL GC tracking')
		resources.forEach((resource) => {
			console.info(`${resource.type}${resource.isTexture ? ' (Texture)' : ''}\n%c${resource.name || resource.uuid}`, 'color: grey; font-size: 10px')
		})

		console.groupEnd()
	}

	return { track, untrack, dispose, log }
}
