export function pathResolver(scope = 'document') {
	// let root = '@'
	let metadata = '@.metadata'
	let lang = '@.lang'

	if (scope === 'metadata') {
		// root = '^'
		metadata = '@'
		lang = '^.lang'
	}

	return `select(${lang} == 'pt' => ${metadata}.path.current, '/' + ${lang} + ${metadata}.path.current)`
}

export function externalLinkProjection() {
	return `
        {
            "type": 'external',
            url
        }
    `
}

function pageLinkProjection() {
	return `
        {
            "type": 'internal',
            "path": ${pathResolver()}
        }
    `
}

function appLinkProjection() {
	return `
        {
            "type": 'external',
            "url": url,
        }
    `
}

export function hyperlinkProjection() {
	return `
        {
            _type == 'hyperlink.external' || _type == 'external' => ${externalLinkProjection()},
            _type == 'app' => {...} -> ${appLinkProjection()},
            _type match 'page.*' || _type == 'page' || _type == 'form' || _type == 'club' || _type == 'class' || _type == 'classes'  || _type == 'legal'  => {...} -> ${pageLinkProjection()},
        }
        `
}
