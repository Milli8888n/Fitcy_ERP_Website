// import { GLTFLoader, DRACOLoader } from 'three-stdlib'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' // 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js' // 'three/examples/jsm/loaders/DRACOLoader.js'

import { TextureLoader, SRGBColorSpace, CubeTexture, CubeTextureLoader, ImageBitmapLoader, Texture } from 'three'
import { useThree } from '@buro/gl'
import { useLoader } from './core/loader'

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
	const localPrefix = isLast ? '└─' : '├─'
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`)
	const newPrefix = prefix + (isLast ? '  ' : '│ ')
	const lastNdx = obj.children.length - 1
	obj.children.forEach((child, ndx) => {
		const isLast = ndx === lastNdx
		dumpObject(child, lines, isLast, newPrefix)
	})
	return lines
}

/**
 * Loader import logs
 * @param {Object3D|Scene} obj
 */

export function log(obj) {
	console.info(dumpObject(obj).join('\n'))
}

/**
 * GLTF import hook
 * @async
 * @param {string} path
 * @param {Function} [onProgress]
 * @return {Promise<Scene[]>}
 */

export async function useGLTF(path, onProgress) {
	const results = await useLoader(
		GLTFLoader,
		path,
		(loader) => {
			const dracoLoader = new DRACOLoader()
			dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
			loader.setDRACOLoader(dracoLoader)
		},
		onProgress,
	)

	return Array.isArray(path) ? results : results[0]
}

/**
 * GLTF preload
 * @param {string} path
 */

useGLTF.preload = (path /* useDraco = true, useMeshOpt = true, extendLoader */) => {
	useLoader.preload(
		GLTFLoader,
		path,
		// extensions(useDraco, useMeshOpt, extendLoader)
		(loader) => {
			const dracoLoader = new DRACOLoader()
			dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
			loader.setDRACOLoader(dracoLoader)
		},
	)
}

/**
 * Textures import hook
 * @async
 * @param {string} path
 * @param {Function} [onProgress]
 * @return {Promise<Texture[]>}
 */

export async function useTexture(path, onProgress) {
	const results = await useLoader(TextureLoader, path, null, onProgress)

	const { gl } = useThree()

	results.forEach((texture) => {
		texture.colorSpace = SRGBColorSpace
		texture.flipY = false

		gl.initTexture(texture)
	})

	const array = Array.isArray(path) ? results : results[0]

	return array
}

/**
 * Textures preload
 * @param {string} path
 */

useTexture.preload = (path) => useLoader.preload(TextureLoader, path)

/**
 * CubeTexture import hook
 * @async
 * @param {object} [options] {path = '', files = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png']}
 * @param {Function} [onProgress]
 * @return {Promise<Texture[]>}
 */

export function useEnvironment({ path = '', files = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'], useTextureLoader = false }, onProgress) {
	if (useTextureLoader) {
		const loader = new CubeTextureLoader().setPath(path)
		return new Promise((resolve, reject) => {
			loader.load(files, resolve, onProgress, reject)
		})
	} else {
		return new Promise((resolve, reject) => {
			useLoader(
				ImageBitmapLoader,
				files.map((file) => `${path}/${file}`),
				null,
				onProgress,
			)
				.then((images) => {
					const texture = new CubeTexture(images)
					texture.colorSpace = SRGBColorSpace
					texture.needsUpdate = true

					resolve(texture)
				})
				.catch((e) => {
					reject(e)
				})
		})
	}
}

/**
 * ImageBitmapLoader import hook
 * @async
 * @param {string} path
 * @param {boolean} flipY
 * @param {Function} [onProgress]
 * @return {Promise<Texture[]>}
 */
export async function useBitmap(path, flipY, onProgress) {
	const bitmaps = await useLoader(
		ImageBitmapLoader,
		path,
		(loader) => {
			if (flipY) loader.setOptions({ imageOrientation: 'flipY' })
		},
		null,
		onProgress,
	)

	const results = bitmaps.map((bitmap) => {
		const texture = new Texture(bitmap)
		texture.colorSpace = SRGBColorSpace
		texture.needsUpdate = true

		return texture
	})

	const array = Array.isArray(path) ? results : results[0]

	return array
}
