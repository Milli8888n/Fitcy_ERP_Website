import { PerspectiveCamera as PC } from 'three'

export function PerspectiveCamera(props) {
	const { fov = 75, aspect, near = 0.1, far = 1000, position = [0, 0, 5], rotation = [0, 0, 0] } = props

	const camera = new PC(fov, aspect, near, far)
	camera.position.set(...position)
	camera.rotation.set(...rotation)

	if (camera.bglResize) {
		throw new Error("\u{1F340} BüroGL: 'bglResize' redefined")
	}

	Object.assign(camera, {
		bglResize: (width, height) => {
			camera.aspect = width / height
			camera.updateProjectionMatrix()
		},
	})

	return camera
}
