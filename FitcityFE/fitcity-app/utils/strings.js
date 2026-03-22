export const randomString = (length, options = {}) => {
	options.upperCase = options?.upperCase ?? true
	options.lowerCase = options?.lowerCase ?? true
	options.numbers = options?.numbers ?? true
	options.symbols = options?.symbols ?? true

	const LOWER_CASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const UPPER_CASE = 'abcdefghijklmnopqrstuvwxyz'
	const NUMBERS = '0123456789'
	const SYMBOLS = '_.;;,?!*+~^ºª|#€"%&/()=€'

	const charSet = []
	if (options.upperCase) charSet.push(...UPPER_CASE)
	if (options.lowerCase) charSet.push(...LOWER_CASE)
	if (options.numbers) charSet.push(...NUMBERS)
	if (options.symbols) charSet.push(...SYMBOLS)
	if (Array.isArray(options?.include)) charSet.push(options.include)

	return new Array(length)
		.fill('_')
		.map(() => charSet[parseInt(Math.random() * charSet.length)])
		.join('')
}

export const extractInitials = (name, limitChars = true) => {
	try {
		const allInitials = name
			.split(' ')
			.filter((name) => name.length > 0)
			.map((name) => name[0].toUpperCase())
		if (limitChars) return allInitials.length > 1 ? `${allInitials[0]}${allInitials[allInitials.length - 1]}` : allInitials[0]
		return allInitials.join('')
	} catch (e) {
		console.log(e)
		return ''
	}
}

export const firstLetterToUpperCase = (string) => string.charAt(0).toUpperCase() + string.slice(1)

export const convertCase = (from, to, string) => {
	try {
		const kebabString = (() => {
			switch (from) {
				case 'kebab':
					return string
				case 'camel':
					return string
						.replace(/([A-Z])/g, '-$1')
						.replace(/(\d+)/, '-$1')
						.toLowerCase()
				default:
					throw new Error(`From case '${from}' not found.`)
			}
		})()

		switch (to) {
			case 'kebab':
				return kebabString
			case 'title':
				return kebabString.split('-').map(firstLetterToUpperCase).join(' ')
			default:
				throw new Error(`To case '${to}' not found.`)
		}
	} catch (e) {
		console.warn(`[buroCore/utils/strings] convertCase error parsing "${string}" from |${from}| to |${to}|.`)
		console.warn(e)
		return string
	}
}

export const isValidText = (textString) => {
	if (textString.length < 1) return false

	// Patterns to check against
	const patterns = {
		// URLs including IP addresses and various protocols
		url: /(https?:\/\/(?:www\.|(?!www))[^\s<>]*|www\.[^\s<>]*)/gi,

		// Common code injection patterns
		script: /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
		html: /<[^>]*>?/gm,
		jsProtocol: /javascript:/gi,
		events: /\bon\w+\s*=/gi,
		functions: /\b(alert|console\.|eval|Function|document\.)/gi,
		sqlInjection: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/gi,

		// Shell commands
		shellCommands: /\b(cat|chmod|curl|wget|rm|sudo|bash)\b/gi,
	}

	// Test against all patterns
	for (const [key, pattern] of Object.entries(patterns)) {
		if (pattern.test(textString)) {
			console.debug(`Text validation failed: matched ${key} pattern`)
			return false
		}
	}

	return true
}

export const isValidUrl = (urlString) => {
	const urlPattern = new RegExp(
		'^(https?:\\/\\/)?' + // validate protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	) // validate fragment locator
	return !!urlPattern.test(urlString)
}

export const isValidEmail = (emailString) => {
	const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

	return emailPattern.test(emailString)
}

export const isValidPhone = (phoneString) => {
	const phonePattern = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/

	return phonePattern.test(phoneString)
}

export const convertToSlug = (text) => {
	return text
		.normalize('NFD') // Normalize the string to NFD (Normalization Form Decomposition)
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
		.replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters except alphanumeric, spaces, and hyphens
		.trim() // Trim leading and trailing whitespace
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.toLowerCase() // Convert to lowercase
}

export const blocksToText = (blocks, opts = {}) => {
	const options = Object.assign({}, { nonTextBehavior: 'remove' }, opts)
	return blocks
		.map((block) => {
			if (block._type !== 'block' || !block.children) {
				return options.nonTextBehavior === 'remove' ? '' : `[${block._type} block]`
			}

			return block.children.map((child) => child.text).join('')
		})
		.join('\n\n')
}

export const removeSpacesAndAccents = (str) => {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, '')
}
export const normalizeText = (text) => {
	return text
		.normalize('NFD') // Normalize to decomposed form
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
}
