// Example usage:
//
// const { submitForm } = useForm(
// 	form,
// 	{
// 		clientEmail: 'daniel@burocratik.com',
// 		sendToClient: true,
// 		sendToUser: true,
// 		debug: true,
// 	},
// 	() => {
// 		form.value.reset()
// 		form.value.querySelectorAll('[data-component="input-wrapper"]').forEach((el) => el.classList.remove('filled'))
// 		emitter.emit('homeHeader-play')
// 	}
// )

// submitForm()

export function useForm(form, options = {}, fn = () => {}) {
	const { sendToUser = false, sendToClient = false, clientEmail = false, debug = false, formName = false } = options

	const submitForm = async () => {
		if (!form.value) return

		const formData = new FormData(form.value)
		const formValues = Object.fromEntries(formData.entries()) // convert to object
		const formInputs = [form.value.querySelector('[name="form_title"]'), ...form.value.querySelectorAll('.input'), form.value.querySelector('[name="choice"]')].map((el) => {
			const aux = {}
			const name = el.getAttribute('name')
			const value = el.value

			if (name === 'choice') {
				aux.name = 'permissions'
				aux.value = value
			} else {
				aux.name = name
				aux.value = value
			}

			return aux
		})

		const bodyObj = {
			clientEmail: clientEmail,
			userEmail: formValues.email,
			username: formValues.last_name,
			sendToUser: sendToUser,
			sendToClient: sendToClient,
			values: {
				formValues: formValues,
				formInputs: formInputs,
			},
		}

		if (debug) {
			console.log('📨 FORM body:', bodyObj)
			setTimeout(() => {
				formData.value = []
				fn()
			}, 250)
		} else {
			await $fetch('/api/brevo', {
				body: bodyObj,
				method: 'post',
			}).then((res) => {
				console.log(res)

				window.umami?.track(`FormSubmit ${formName ? ' — ' + formName : ''}`)

				setTimeout(() => {
					formData.value = []
					fn()
				}, 250)
			})
		}
	}

	return {
		submitForm,
	}
}
