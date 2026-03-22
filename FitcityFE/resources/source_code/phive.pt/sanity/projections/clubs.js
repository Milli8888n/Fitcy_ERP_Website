import { mediaProjection } from './media.js'
import { pathResolver } from './hyperlink.js'

export function clubsProjection() {
	return `
    {
      "title": coalesce(presentation.title, metadata.title),
      "thumb": presentation.media[] {
        ...${mediaProjection()}
      }, 
      "link": {
        "type": "internal",
        "path": ${pathResolver()}
      },
      "api": blocks[_type == 'block.clubTimetable'][0].api,
      "salesforce": salesforce[] {
        key,
        value
      }
    }
`
}
