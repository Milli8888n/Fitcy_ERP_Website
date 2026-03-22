<template>
	<div ref="el" data-component="form-inputs" data-section-intersect="dark">
		<div class="inner">
			<div class="row align-center">
				<div class="xxlarge-14 xsmall-16 col form-col">
					<div class="title-container">
						<h3 class="-label-1 -uppercase title">{{ title }}</h3>
					</div>

					<form ref="form" :class="`form-container ${fields.length % 3 === 0 ? 'odd' : 'even'}`" @submit="handleSubmit">
						<input ref="phoneArea" type="hidden" name="00NTX000000PMVB" />
						<input ref="userTemplateId" type="hidden" name="templateId" value="7" />
						<input type="hidden" name="templateClientId" value="5" />
						<input class="company" type="hidden" name="club" value="" />
						<input type="hidden" name="form_title" :value="pageTitle" />

						<InputWrapper v-for="(input, i) in fields" ref="inputs" v-bind="input" :key="i" class="input-wrapper" />

						<div v-if="legalNotice" class="legal-container">
							<LegalNotice ref="legalNoticeRef" v-bind="legalNotice" />
						</div>

						<ButtonRoundVariable :label="$t('send', 'Send')" class="send-btn" :disabled="disableSend" />
					</form>
				</div>
			</div>
		</div>

		<div class="response-container">
			<div class="title-container">
				<h2 ref="titleRef" class="-title-4 -uppercase title">{{ $t('message', 'Message') }}</h2>
				<h2 ref="secondTitleRef" class="-title-4 -uppercase title">{{ $t('sent', 'Sent') }}</h2>
			</div>

			<ButtonRoundVariable v-if="returnLink" v-bind="returnLink" size="large" class="return-btn" />
		</div>
	</div>
</template>

<script setup>
import { gsap } from 'gsap/all'

import { InputWrapper, ButtonRoundVariable } from '~/components/primitives'

import { LegalNotice } from '~/components/fragments'
import { useForm, useSalesForce, useEmitter, useModal } from '~/composables/core'
import { useSelectedClub } from '~/components/blocks/FormClubs/useSelectedClub'
import { getActiveContext } from '~/components/core'
import { useLocale } from '@/i18n'
import { useTitleAnimation } from '~/composables'
import { useStringTranslation } from '@/i18n'

import { IS_DEV } from '~/config/site'

const props = defineProps({
	pageTitle: { type: String, default: '' },
	title: { type: String, default: '' },
	fields: { type: Array, default: () => [] },
	returnLink: { type: [Boolean, Object], default: false },
	salesforce: { type: [Boolean, Object], default: false },
	legalNotice: { type: [Boolean, Object], default: false },
})

const emitter = useEmitter()
const el = ref(null)
const legalNoticeRef = ref(null)
const disableSend = ref(true)
const inputs = ref([])
const form = ref(null)
const phoneArea = ref(null)
const userTemplateId = ref(null)
const locale = useLocale()
const titleRef = ref(null)
const secondTitleRef = ref(null)
const $t = useStringTranslation()

const { closeModal } = useModal()
const scroller = inject('$scroller')

let salesforceVariables = []
const { selectedClub } = useSelectedClub()

const { tl } = useTitleAnimation(titleRef, false, 0, false, true)
const { tl: secondTl } = useTitleAnimation(secondTitleRef, false, 0, false, true)

const handleSubmit = (e) => {
	e.preventDefault()

	inputs.value.forEach((el) => {
		el.checkField()

		if (el.input.phoneArea) {
			phoneArea.value.value = el.input.phoneArea
		}
	})

	if (el.value.querySelector('form .error')) {
		console.warn('Form contain errors.')
	} else {
		const checkInputValue = el.value.querySelector('input[name="choice"]:checked')
		const { submitForm } = useForm(
			form,
			{
				// clientEmail: 'daniel@burocratik.com',
				formName: el.value.querySelector('input[name="form_title"]').value,
				clientEmail: 'info@phive.pt',
				sendToClient: true,
				sendToUser: true,
				debug: IS_DEV,
			},
			() => {
				form.value.reset()
				form.value.querySelectorAll('[data-component="input-wrapper"]').forEach((el) => el.classList.remove('filled'))

				animateResponse()
			},
		)

		if (props.salesforce) {
			// OrgID -> "00D7R000005UkoR"; Test OrgID -> 00D9E000000ABx6
			const { submitSalesForce } = useSalesForce(form, {
				endpoint: props.salesforce?.endpoint,
				variables: [...salesforceVariables, ...props.salesforce?.variables],
				debug: IS_DEV,
			})

			if (checkInputValue.value === 'yes') {
				submitSalesForce()
					.then((result) => {
						console.log('Salesforce submission succeeded:', result)
					})
					.catch((error) => {
						console.error('Salesforce submission failed:', error)
					})
			}
		}

		submitForm()
	}
}

const setup = () => {
	userTemplateId.value.value = locale.value === 'pt' ? '8' : '7'

	if (legalNoticeRef.value) watch(legalNoticeRef.value.getOption(), () => (disableSend.value = false))

	watch(
		selectedClub,
		(newValue) => {
			salesforceVariables = newValue.salesforce || []
			if (el.value) el.value.querySelector('input.company').value = newValue.title
		},
		{ immediate: true },
	)

	if (selectedClub.value) el.value.querySelector('input.company').value = selectedClub.value.title
}

const animateResponse = () => {
	const responseContainer = el.value.querySelector('.response-container')
	const isPage = document.querySelector('body').classList.contains('form')
	// const scrollValue = isPage ? 0 : scroller.value.getScrollerInstance().value.animatedScroll
	const height =
		document.querySelector('[data-component="form-header"]')?.offsetHeight +
		document.querySelector('[data-component="form-clubs"]')?.offsetHeight +
		document.querySelector('[data-component="form-inputs"]')?.offsetHeight

	emitter.emit('form-submit')
	gsap.to(el.value.querySelector('.inner'), { autoAlpha: 0, ease: 'power4.out', duration: 0.5 })

	isPage && scroller.value.scrollTo(0)

	isPage &&
		gsap.set(document.querySelector('main'), { marginTop: -document.querySelector('[data-component="form-header"]').offsetHeight - 1, height: Math.min(height, window.innerHeight), delay: 0.75 })

	gsap.set(el.value, { position: 'absolute', height: isPage ? '' : '100vh', top: 0, delay: 0.5, overflow: isPage ? 'visible' : 'hidden', delay: 0.75 })
	gsap.set(responseContainer, {
		opacity: 1,
		pointerEvents: 'visible',
		zIndex: 10,
		delay: 0.75,
		height: Math.min(height, window.innerHeight),
		onComplete: () => {
			if (isPage) gsap.fromTo(el.value.querySelector('.return-btn'), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, delay: 1.5, duration: 2, ease: 'power4.out' })

			tl.play().then(() => {
				setTimeout(() => {
					// emitter.emit('homeHeader-play')
					// closeModal()
				}, 500)
			})

			setTimeout(() => secondTl.play(), 500)
		},
	})
}
const init = () => {
	gsap.fromTo(
		el.value.querySelector('.inner'),
		{
			autoAlpha: 0,
			y: 20,
		},
		{
			autoAlpha: 1,
			y: 0,
			duration: 1,
			delay: 1,
			ease: 'power2.out',
		},
	)
}
const kill = () => {}

onBeforeUnmount(() => {})
onMounted(() => {
	const context = getActiveContext()
	context.loader.loaded.then(() => setup())
	context.loader.ready.then(() => init())
})
</script>

<style lang="scss" scoped>
[data-component='form-inputs'] {
	--roundButton-color: var(--color-yellow);
	--roundButton-backgroundColor: var(--color-darkBrown);

	position: relative;
	padding-bottom: rs(50, 36);

	background-color: var(--color-yellow);
	color: var(--color-darkBrown);

	display: flex;
	flex-direction: column;
	align-items: center;

	gap: rs(24);
	width: 100%;
	overflow: hidden;

	.response-container {
		position: absolute;
		top: 0;
		left: 0;

		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: rs(40);

		width: 100%;
		height: calc(100vh);

		background-color: var(--color-yellow);

		z-index: 1;

		opacity: 0;
		pointer-events: none;

		.return-btn {
			opacity: 0;
			visibility: hidden;

			pointer-events: visible;
		}
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: center;

		gap: rs(24);
		width: 100%;
		max-width: rs(1100);

		@include max-screen($xsmall) {
			max-width: none;
		}
	}
	.form-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: rs(24);
		width: 100%;

		.form-container {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			gap: rs(24);
			width: 100%;
		}

		.input-wrapper {
			width: 100%;
			display: flex;
			flex-direction: column;
			gap: rs(12);

			flex: 1 1 0;

			@include max-screen($xsmall) {
				flex: 0 0 100%;
			}

			&:first-of-type {
				flex: 0 0 100%;
			}

			&.text {
				flex: 0 0 100%;
			}
		}
	}

	.legal-container {
		position: relative;
		margin-top: rs(24);
	}
}
</style>
