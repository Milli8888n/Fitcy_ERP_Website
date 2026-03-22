import { AmbientLight, DirectionalLight, InstancedMesh, Object3D, Matrix4, MathUtils, Quaternion, Vector3, PMREMGenerator } from 'three/webgpu'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { InteractiveGroup } from './InteractiveGroup.js'
import { useGLTF, useThree, useResize, useProxy, viewport, useDispose, useFrame, ResourceTracker } from '@buro/gl'
import { Preload } from '@buro/gl/components'
import { BASE_URL } from '~/config/site'

export default (emitter) => {
	const { scene, gl, camera } = useThree()

	scene.visible = false

	// envMap
	const environment = new RoomEnvironment()
	const generator = new PMREMGenerator(gl)
	generator.compileEquirectangularShader()

	const envMap = generator.fromScene(environment).texture
	scene.environment = envMap

	// lights
	const ambientLight = new AmbientLight(0x404040, 1.2)
	scene.add(ambientLight)

	const directionalLight = new DirectionalLight(0xffffff, 2)
	directionalLight.position.set(0, 0, 8)
	scene.add(directionalLight)

	const rt = ResourceTracker()

	useDispose(() => {
		scene.remove(ambientLight)
		scene.remove(directionalLight)

		environment.dispose()
		generator.dispose()

		rt.track(scene)
		rt.dispose()

		group.disconnect()
	})

	const vp = viewport()

	const { width, height } = vp.getCurrentViewport()
	const w = width / 2
	const h = height / 2

	const items = [
		{
			positionFrom: [-w * 0.7, -h - 2, -1],
			positionTo: [-w * 0.7, h + 2, -1],
			rotation: [Math.PI / 3, 0, -(Math.PI / 5)],
			from: 0,
			to: 0.4,
		},
		{
			positionFrom: [w * 0.5, -h - 2, 2],
			positionTo: [w * 0.5, h + 2, 2],
			rotation: [Math.PI / 3, 0, Math.PI / 4],
			from: 0.25,
			to: 0.6,
		},
		{
			positionFrom: [-w * 0.5, -h - 2, 0],
			positionTo: [-w * 0.5, h + 2, 0],
			rotation: [Math.PI / 3, 0, -(Math.PI / 4)],
			from: 0.5,
			to: 0.75,
		},
		{
			positionFrom: [w * 0.25, -h - 2, 1],
			positionTo: [w * 0.25, h + 2, 0],
			rotation: [Math.PI / 3, 0, Math.PI / 4],
			from: 0.6,
			to: 1,
		},
	]

	useResize(() => {
		const { width, height } = vp.getCurrentViewport()
		const w = width / 2
		const h = height / 2

		// recalculate positions, not the best but works
		if (items[0]) {
			items[0].positionFrom = [-w * 0.7, -h - 2, -1]
			items[0].positionTo = [-w * 0.7, h + 2, -1]
		}
		if (items[1]) {
			items[1].positionFrom = [w * 0.5, -h - 2, 2]
			items[1].positionTo = [w * 0.5, h + 2, 2]
		}
		if (items[2]) {
			items[2].positionFrom = [-w * 0.5, -h - 2, 0]
			items[2].positionTo = [-w * 0.5, h + 2, 0]
		}
		if (items[3]) {
			items[3].positionFrom = [w * 0.25, -h - 2, 1]
			items[3].positionTo = [w * 0.25, h + 2, 0]
		}
	})

	let instancedMesh
	let ironMesh

	const group = new InteractiveGroup()
	group.listenToPointerEvents(gl, camera)

	useGLTF(`/webgl/plates-color-whit-imetal-round.glb`).then((e) => {
		const plate = e.scene.getObjectByName('plate')
		instancedMesh = new InstancedMesh(plate.geometry, plate.material, items.length)
		scene.add(instancedMesh)

		const iron = e.scene.getObjectByName('iron')
		ironMesh = new InstancedMesh(iron.geometry, iron.material, items.length)
		scene.add(ironMesh)

		const dummy = new Object3D()

		for (let i = 0; i < instancedMesh.count; i++) {
			dummy.rotation.set(...items[i].rotation)
			dummy.position.set(...items[i].positionFrom)
			dummy.scale.set(1, 2, 1)
			dummy.updateMatrix()
			instancedMesh.setMatrixAt(i, dummy.matrix)
		}

		instancedMesh.addEventListener('click', ({ intersection }) => {
			items[intersection.instanceId].pointerdown = true
			items[intersection.instanceId].rotationSpeed = 10
		})

		instancedMesh.computeBoundingBox()

		instancedMesh.frustumCulled = false
		instancedMesh.instanceMatrix.needsUpdate = true
		ironMesh.instanceMatrix.needsUpdate = true

		group.add(instancedMesh)
		scene.add(group)

		Preload({ all: true, camera, scene })
		gl.render(scene, camera)
		gl.clear()

		emitter.emit('webgl-ok')
	})

	const instanceObject = new Object3D()
	const matrix = new Matrix4()

	const state = {
		progress: 0,
		lastSmoothScroll: 0,
		smoothProgress: 0,
	}

	const yVector = new Vector3(0, 1, 0)
	const zVector = new Vector3(0, 0, 1)

	useFrame(({ timer }) => {
		if (instancedMesh === undefined) {
			return
		}

		const delta = timer.getDelta()

		const smoothing = 0.1 // smoothing factor (lower = smoother/slower)
		state.smoothProgress = MathUtils.lerp(state.smoothProgress, state.progress, smoothing)

		const rotationAmount = (state.smoothProgress - state.lastSmoothScroll) * Math.PI * 2

		state.lastSmoothScroll = state.smoothProgress

		// click
		items.forEach((it, index) => {
			if (it.pointerdown === true) {
				const currentIndex = index

				instancedMesh.getMatrixAt(currentIndex, matrix)
				matrix.decompose(instanceObject.position, instanceObject.quaternion, instanceObject.scale)

				instanceObject.rotation.setFromQuaternion(instanceObject.quaternion)

				const damping = 0.95
				it.rotationSpeed *= damping

				if (Math.abs(it.rotationSpeed) < 0.0001) {
					it.rotationSpeed = 0
				}

				const od = it.rotationSpeed * delta
				qX.setFromAxisAngle(yVector, od)

				instanceObject.quaternion.multiplyQuaternions(instanceObject.quaternion, qX)

				instanceObject.updateMatrix()
				instancedMesh.setMatrixAt(currentIndex, instanceObject.matrix)
				ironMesh.setMatrixAt(currentIndex, instanceObject.matrix)
				instancedMesh.instanceMatrix.needsUpdate = true
				ironMesh.instanceMatrix.needsUpdate = true
			}
		})

		for (let i = 0; i < instancedMesh.count; i++) {
			instancedMesh.getMatrixAt(i, tempMatrix)
			tempMatrix.decompose(dummy.position, dummy.quaternion, dummy.scale)

			qZ.setFromAxisAngle(yVector, rotationAmount * 0.8 || 0)
			dummy.quaternion.multiplyQuaternions(dummy.quaternion, qZ)

			qY.setFromAxisAngle(zVector, rotationAmount * 0.25 || 0)
			dummy.quaternion.multiplyQuaternions(dummy.quaternion, qY)

			const item = items[i]
			const percentage = MathUtils.clamp(MathUtils.mapLinear(state.progress, item.from, item.to, 0, 1), 0, 1)
			dummy.position.y = MathUtils.lerp(item.positionFrom[1], item.positionTo[1], percentage)

			dummy.updateMatrix()
			instancedMesh.setMatrixAt(i, dummy.matrix)
			ironMesh.setMatrixAt(i, dummy.matrix)
		}
		instancedMesh.instanceMatrix.needsUpdate = true
		ironMesh.instanceMatrix.needsUpdate = true
	})

	const dummy = new Object3D()
	const tempMatrix = new Matrix4()

	const qX = new Quaternion()
	const qY = new Quaternion()
	const qZ = new Quaternion()

	useProxy(({ progress }) => {
		state.progress = progress
	}, 'scroll')
}
