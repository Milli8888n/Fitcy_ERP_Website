import { Group, Raycaster, Vector2 } from 'three'

const _pointer = new Vector2()
const _event = { type: '', data: _pointer }

/**
 * This class can be used to group 3D objects in an interactive group.
 * The group itself can listen to Pointer, Mouse or XR controller events to
 * detect selections of descendant 3D objects. If a 3D object is selected,
 * the respective event is going to dispatched to it.
 *
 * ```js
 * const group = new InteractiveGroup();
 * group.listenToPointerEvents( renderer, camera );
 * scene.add( group );
 *
 * // now add objects that should be interactive
 * group.add( mesh1, mesh2, mesh3 );
 * ```
 * @augments Group
 * @three_import import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';
 */
class InteractiveGroup extends Group {
	constructor() {
		super()

		/**
		 * The internal raycaster.
		 *
		 * @type {Raycaster}
		 */
		this.raycaster = new Raycaster()

		/**
		 * The internal raycaster.
		 *
		 * @type {?HTMLDOMElement}
		 * @default null
		 */
		this.element = null

		/**
		 * The camera used for raycasting.
		 *
		 * @type {?Camera}
		 * @default null
		 */
		this.camera = null

		this._onPointerEvent = this.onPointerEvent.bind(this)
	}

	onPointerEvent(event) {
		event.stopPropagation()

		const rect = this.renderer.domElement.getBoundingClientRect()

		_pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		_pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1

		this.raycaster.setFromCamera(_pointer, this.camera)

		const intersects = this.raycaster.intersectObjects(this.children, false)

		if (intersects.length > 0) {
			const intersection = intersects[0]

			const object = intersection.object
			const uv = intersection.uv

			_event.type = event.type
			_event.data.set(uv.x, 1 - uv.y)

			_event.intersection = intersection

			object.dispatchEvent(_event)
		}
	}

	/**
	 * Calling this method makes sure the interactive group listens to Pointer and Mouse events.
	 * The target is the `domElement` of the given renderer. The camera is required for the internal
	 * raycasting so 3D objects can be detected based on the events.
	 *
	 * @param {(WebGPURenderer|WebGLRenderer)} renderer - The renderer.
	 * @param {Camera} camera - The camera.
	 */
	listenToPointerEvents(renderer, camera) {
		this.camera = camera
		this.renderer = renderer
		this.element = window // renderer.domElement

		this.element.addEventListener('click', this._onPointerEvent)
	}

	/**
	 * Disconnects this interactive group from all Pointer and Mouse Events.
	 */
	disconnectionPointerEvents() {
		if (this.element !== null) {
			this.element.removeEventListener('click', this._onPointerEvent)
		}
	}

	/**
	 * Disconnects this interactive group from the DOM and all XR controllers.
	 */
	disconnect() {
		this.disconnectionPointerEvents()

		this.camera = null
		this.element = null
	}
}

export { InteractiveGroup }
