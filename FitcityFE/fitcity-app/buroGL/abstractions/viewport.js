import { Vector3 } from 'three'
import { useThree } from '@buro/gl'

/**
 * Returns tree if camera is orthographic
 * @param {Camera} def
 */

export const isOrthographicCamera = (def) => !!(def && def.isOrthographicCamera)

/**
 * Viewport
 */

export function viewport() {
	const position = new Vector3()
	const defaultTarget = new Vector3()
	const tempTarget = new Vector3()

	const { camera: defaultCamera, size: defaultSize } = useThree()

	function getCurrentViewport(props) {
		const { camera = defaultCamera, target = defaultTarget, size = defaultSize } = { ...props }

		const { width, height, top = 0, left = 0 } = size
		const aspect = width / height
		if (target instanceof Vector3) tempTarget.copy(target)
		else tempTarget.set(...target)
		const distance = camera.getWorldPosition(position).distanceTo(tempTarget)
		if (isOrthographicCamera(camera)) {
			return {
				width: width / camera.zoom,
				height: height / camera.zoom,
				top,
				left,
				factor: 1,
				distance,
				aspect,
			}
		} else {
			const fov = (camera.fov * Math.PI) / 180 // convert vertical fov to radians
			const h = 2 * Math.tan(fov / 2) * distance // visible height
			const w = h * (width / height)

			return {
				width: w,
				height: h,
				top,
				left,
				factor: width / w,
				distance,
				aspect,
			}
		}
	}

	return { getCurrentViewport }
}
