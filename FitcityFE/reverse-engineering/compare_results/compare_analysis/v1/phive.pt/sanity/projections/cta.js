import { hyperlinkProjection } from './hyperlink.js'

export function ctaProjection() {
	return `
    {
        link[0]._type == 'app' => {
            "store": link[0]->.store,
        },
        link[0]._type != 'app' => {
            label,
        },
        "link": link[0]{
            ...${hyperlinkProjection()}
        }
    }
    `
}
