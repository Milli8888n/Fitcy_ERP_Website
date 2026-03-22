const contextAggregator = new Map()

export function createPageContext({ element, slug, loader, scroller, name, theme, transitionEnter, transitionLeave }) {
	const context = {
		element,
		slug,
		loader,
		scroller,
		name,
		theme,
		methods: {
			transitionEnter,
			transitionLeave,
		},
	}
	contextAggregator.set(slug, context)

	loader.destroyed.then(() => {
		contextAggregator.delete(slug, context)
	})

	return { $page: context }
}

export function getActiveContext() {
	return [...contextAggregator.values()].find(({ loader }) => !loader.isDestroyed)
}

export function getContext(slug) {
	return contextAggregator.get(slug)
}

export function getAllContexts() {
	return contextAggregator
}

export function pageContextPlugin() {
	return {
		provide: {
			getActivePageContext: getActiveContext,
			getPageContext: getContext,
		},
	}
}
