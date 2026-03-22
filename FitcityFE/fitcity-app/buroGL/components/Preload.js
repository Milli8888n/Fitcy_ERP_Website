import { useThree } from '@buro/gl'
import { CubeCamera, WebGLCubeRenderTarget } from 'three'

export function Preload({ all = true, scene, camera }) {
	const { gl, camera: dCamera, scene: dScene } = useThree()

	const invisible = []
	if (all) {
		// Find all invisible objects, store and then flip them
		const s = scene || dScene
		s.traverse((object) => {
			if (object.visible === false) {
				invisible.push(object)
				object.visible = true
			}
		})
	}
	// Now compile the scene
	gl.compile(scene || dScene, camera || dCamera)

	// And for good measure, hit it with a cube camera
	const cubeRenderTarget = new WebGLCubeRenderTarget(128)
	const cubeCamera = new CubeCamera(0.01, 100000, cubeRenderTarget)
	cubeCamera.update(gl, scene || dScene)
	cubeRenderTarget.dispose()

	// Flips these objects back
	invisible.forEach((object) => (object.visible = false))

	return null
}
