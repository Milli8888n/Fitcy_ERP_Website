export function generateConditionalObjectProjections(objects, fallback) {
	const conditionals = objects.map(({ type, projection }) => `_type == '${type}' => ${projection()}`).join(',')

	if (fallback) {
		return `
			${conditionals},
			!(_type in [${objects.map(({ type }) => `'${type}'`).join(',')}]) => {
				...${fallback}	
			}
		`
	}

	return conditionals
}

export function conditional(condition, query) {
	return condition ? query : ''
}

export function coalesceQuery(query, condition, fallback) {
	return `coalesce(*[${query} && ${condition}][0], *[${query} && ${fallback}][0])`
}
