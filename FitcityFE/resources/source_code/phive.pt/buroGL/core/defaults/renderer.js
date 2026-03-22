import { WebGLRenderer, ACESFilmicToneMapping } from 'three'
import { WebGPURenderer } from 'three/webgpu'

export function Renderer(props) {
	let renderer
	if (props.webGPU) {
		renderer = new WebGPURenderer({ antialias: true, alpha: false, ...props })
	} else {
		renderer = new WebGLRenderer({ antialias: true, alpha: false, toneMapping: 'ACESFilmicToneMapping', ...props })
		if (props.toneMapping !== 'ACESFilmicToneMapping') renderer.toneMapping = ACESFilmicToneMapping
	}

	return renderer
}
