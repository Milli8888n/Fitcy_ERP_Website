// Example usage:
//
// const { submitSalesForce } = useSalesForce(form, {
// 	endpoint: props.salesforce?.endpoint,
// 	variables: [...salesforceVariables, ...props.salesforce?.variables],
// 	debug: true,
// })

// submitSalesForce()

export const useSalesForce = (form, options = {}, fn = () => {}) => {
	const { endpoint = '', variables = [], debug = false } = options

	const submitSalesForce = async () => {
		if (!form.value) return
		if (endpoint.length === 0 || !endpoint) return

		return new Promise(async (resolve, reject) => {
			const formData = new FormData(form.value)
			const formValues = Object.fromEntries(formData.entries()) // convert to object

			const result = variables

			// Loop through each key-value pair in the object
			for (const [key, value] of Object.entries(formValues)) {
				result.push({ key, value })
			}

			const resultString = result
				.map(({ key, value }) => {
					// Convert null values to empty strings
					const formattedValue = value === null ? '' : encodeURIComponent(value)
					return `&${key}=${formattedValue}`
				})
				.join('')

			if (debug) {
				console.log('📨 SALESFORCE endpoint:', endpoint)
				console.log('📨 SALESFORCE variables:', variables)
				console.log('📨 SALESFORCE formValues:', formValues)
				console.log('📨 SALESFORCE queryVarsArray:', result)
				console.log('📨 SALESFORCE queryVarsString:', resultString)

				resolve('Debug mode: salesforce submission simulated.')
			} else {
				const requestOptions = {
					method: 'POST',
					mode: 'no-cors',
				}

				const url = `${endpoint}${resultString}`

				console.log('📨 SALESFORCE url:', url)

				await fetch(url, requestOptions)
					.then((response) => response.text())
					.then((result) => {
						console.log(result)
						resolve(result)
					})
					.catch((error) => {
						console.log('error', error)
						reject(error)
					})
			}
		})
	}

	return { submitSalesForce }
}
