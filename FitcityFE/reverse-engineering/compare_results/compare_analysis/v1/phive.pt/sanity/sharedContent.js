import { client } from './client.js'
import { coalesceQuery } from './helpers.js'
import { pathResolver } from './projections/index.js'
import { ctaProjection } from './projections/index.js'
import { clubsProjection } from './projections/index.js'

// export function fetchMenu(lang = 'pt') {
// 	return `
//         ${coalesceQuery(`_type == 'sharedContent'`, `lang == '${lang}'`)}.menu{
//             "menuCta": menuCta {
//                 ...${ctaProjection()}
//             },
//             "items": items[]->{
//                 "type": "link",
//                 "title": coalesce(presentation.title, metadata.title),
//                 "link": {
//                     "type": "internal",
//                     "path": ${pathResolver()}
//                 }
//             },
//             "clubs": *[_type == "page.club" && lang == '${lang}' && (presentation.hidden != true || !defined(presentation.hidden))] | order(coalesce(presentation.title, metadata.title) asc) {...${clubsProjection()}}
//         }
//     `
// }

export async function fetchMenu(lang = 'pt') {
	try {
		const data = await client.fetch(`
            ${coalesceQuery(`_type == 'sharedContent'`, `lang == '${lang}'`)}.menu{
                "menuCta": menuCta {
                  ...${ctaProjection()}
                },
                "items": items[]->{
                   "type": "link",
                    "title": coalesce(presentation.title, metadata.title),
                    "link": {
                        "type": "internal",
                        "path": ${pathResolver()}
                    }
                },
                "clubs": *[_type == "page.club" && lang == '${lang}' && (presentation.hidden != true || !defined(presentation.hidden))] | order(coalesce(presentation.title, metadata.title) asc) {...${clubsProjection()}}
            }
        `)

		return data
	} catch (e) {
		console.log(e)
	}
}
