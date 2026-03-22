<template>
	<component
		:is="computedComp"
		ref="el"
		:placeholder="placeholder"
		:name="/*name.current*/ name"
		:type="computedType"
		:rows="rows"
		@blur="handleInputBlur"
		@focus="handleInputFocus"
		@keyup="handleInputKeyUp"
	/>
</template>

<script setup>
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'

import { isValidEmail, isValidPhone, isValidText } from '~/utils/strings'
import { getActiveContext } from '../Page'

const props = defineProps({
	placeholder: { type: String, default: '' },
	type: { type: String, default: 'text' },
	// name: { type: [Boolean, Object], default: false },
	name: { type: String, default: '' },
	required: { type: Boolean, default: false },
	rows: { type: Number, default: 3 },
})
const el = ref(null)
const value = ref(null)
const phoneArea = ref(false)
let phoneInput

const computedComp = computed(() => (props.type === 'input.text' ? 'textarea' : 'input'))
const computedType = computed(() => (props.type.split('.')[1] === 'string' ? 'text' : props.type.split('.')[1]))

const handleInputFocus = () => el.value.closest('.input-wrapper').classList.add('focus')
const handleInputBlur = () => {
	checkField()
	el.value.closest('.input-wrapper').classList.remove('focus')
}
const handleInputKeyUp = () => {
	checkField()

	el.value.value.length > 0 ? el.value.closest('.input-wrapper').classList.add('filled') : el.value.closest('.input-wrapper').classList.remove('filled')
	value.value = el.value.value
}

const getValue = () => value.value
const setValue = (val) => {
	el.value.value = val
	handleInputKeyUp()
}

const checkField = () => {
	isValid() ? el.value.closest('.input-wrapper').classList.remove('error') : el.value.closest('.input-wrapper').classList.add('error')

	return isValid()
}

const isValid = () => {
	if (props.type === 'input.email') {
		if (el.value.value.length > 0 || props.required) {
			if (isValidEmail(el.value.value)) {
				return true
			} else {
				return false
			}
		} else {
			return true
		}
	}

	if (props.type === 'input.tel') {
		if (el.value.value.length > 0 || props.required) {
			if (isValidPhone(el.value.value)) {
				return true
			} else {
				return false
			}
		}
	}

	if (props.type === 'input.string' || props.type === 'input.text') {
		if (el.value.value.length > 0 || props.required) {
			if (isValidText(el.value.value)) {
				return true
			} else {
				return false
			}
		}
	}

	return true
}

const setup = () => {
	if (props.type === 'input.tel') {
		phoneArea.value = '351'

		phoneInput = intlTelInput(el.value, {
			separateDialCode: true,
			initialCountry: 'pt',
			useFullscreenPopup: false,
			preferredCountries: ['pt', 'us', 'gb'],
		})
		el.value.addEventListener('countrychange', () => {
			phoneArea.value = phoneInput.selectedCountryData.dialCode
		})
	}
}

const kill = () => {}

onBeforeUnmount(() => kill())
onMounted(() => {
	const context = getActiveContext()
	context.loader.ready.then(() => setup())
})

defineExpose({ getValue, setValue, checkField, phoneArea })
</script>

<style lang="scss" scoped>
[data-component='input'] {
	position: relative;
}
</style>
