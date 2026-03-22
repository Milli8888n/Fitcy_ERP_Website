import { createClient } from '@sanity/client'
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } from '../config/sanity.js'
import { IS_DEV } from '../config/site.js'

export const client = createClient({
	projectId: SANITY_PROJECT_ID,
	dataset: SANITY_DATASET,
	useCdn: IS_DEV ? false : true,
	apiVersion: SANITY_API_VERSION,
})
