export const testModalUrl = (url) => {
	if (/\/en\/classes\/.*/.test(url)) return 'page.class'
	else if (/^\/aulas\/.*/.test(url)) return 'page.class'
	else if (/^\/form\/.*/.test(url)) return 'page.form'
	else if (/\/en\/form\/.*/.test(url)) return 'page.form'
	else return false
}
const Loader = (type, lang) => {
	const loaded = new Map()

	const availableSlugs = fetch(`/data/${type}/${lang}/index.json`).then((r) => {
		return r.status === 200 ? r.json() : []
	})

	function load(slug) {
		return new Promise((resolve) => {
			fetch(`/data/${type}/${lang}/${slug}.json`)
				.then((response) => {
					if (response.ok) {
						return response.json()
					}

					throw new Error(`[ModalLoader] Failed to load '${slug}'.`)
				})
				.then((data) => resolve(data))
				.catch((e) => {
					console.error(e)
					resolve(null)
				})
		})
	}

	function get(slug) {
		if (availableSlugs.length > 0 && !availableSlugs.includes(slug)) {
			return console.error(`[ModalLoader] Unable to find data for '${slug}'.`)
		}

		return new Promise((resolve) => {
			if (loaded.has(slug)) {
				return resolve(loaded.get(slug))
			} else {
				load(slug)
					.then((data) => {
						loaded.set(slug, data)
						resolve(data)
					})
					.catch((e) => {
						console.error(e)
						resolve(false)
					})
			}
		})
	}

	return { get }
}

export function getData(to, lang) {
	return new Promise((resolve) => {
		try {
			const slug = to.params.path[to.params.path.length - 1]

			const document = testModalUrl(to.fullPath)

			Loader(document, lang)
				.get(slug)
				.then((data) => resolve(data))
		} catch (e) {
			console.error('[ModalDrawer.data Error]: ', e)
			resolve(null)
		}
	})
}
