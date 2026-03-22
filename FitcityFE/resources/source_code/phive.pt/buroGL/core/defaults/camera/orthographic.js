import { OrthographicCamera as OC } from 'three'

export function OrthographicCamera(props) {
	const { width = 1, height = 1, near = 0.1, far = 1000, position = [0, 0, 5], rotation = [0, 0, 0] } = props

	const left = width / -2
	const right = width / 2
	const top = height / 2
	const bottom = height / -2

	const camera = new OC(left, right, top, bottom, near, far)
	camera.position.set(...position)
	camera.rotation.set(...rotation)

	if (camera.bglResize) {
		throw new Error("\u{1F340} BüroGL: 'bglResize' redefined")
	}

	Object.assign(camera, {
		bglResize: (width, height) => {
			camera.left = width / -2
			camera.right = width / 2
			camera.top = height / 2
			camera.bottom = height / -2
			camera.updateProjectionMatrix()
		},
	})

	return camera
}
