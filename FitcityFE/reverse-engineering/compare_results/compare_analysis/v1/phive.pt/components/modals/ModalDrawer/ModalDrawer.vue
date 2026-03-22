<template>
	<div ref="el" data-component="modal-drawer" :class="isClass ? 'class-modal' : 'form-modal'">
		<span class="background">
			<span class="close-hitarea" @click="close" />
		</span>

		<Scroller ref="modalScroller" class="modal-scroller">
			<div ref="inner" class="inner">
				<ClassModal ref="modalInner" v-if="isClass" v-bind="modalData" />
				<FormModal ref="modalInner" v-if="isForm" v-bind="modalData" />
			</div>
		</Scroller>

		<CircleBtn ref="closeBtn" class="close-btn" slug="close" theme="dark" size="large" @click="close" />
	</div>
</template>

<script setup>
import { FormModal } from '~/components/modals/FormModal'
import { ClassModal } from '~/components/modals/ClassModal'

import { Scroller } from '~/components/core'

import { CircleBtn } from '~/components/primitives'

import { getData, testModalUrl } from './ModalDrawer.data'
import { useModal, useEmitter } from '~/composables/core'
import { createFauxRouteEntry } from '~/utils/routing'
import { useLocale } from '~/i18n'

const el = ref(null)
const { registerActions } = useModal(el)
const emitter = useEmitter()

const modalData = ref(null)
const modalFns = ref(null)
const modalInner = ref(null)
const closeBtn = ref(null)

const isClass = ref(false)
const isForm = ref(false)
const modalScroller = ref(null)
const scroller = inject('$scroller')
const locale = useLocale()

let revertFauxRouteEntry = false

const open = async (to, from) => {
	const data = await getData(to, locale.value)
	let query = ''

	if (testModalUrl(to.fullPath) === 'page.class') {
		modalData.value = {
			header: data.blocks.find((el) => el.name === 'ClassHeader')?.props || null,
			body: data.blocks.find((el) => el.name === 'ClassBody')?.props || null,
		}

		isClass.value = true
	} else if (testModalUrl(to.fullPath) === 'page.form') {
		console.log(fromClub(from))
		if (fromClub(from)) {
			query = `?club=${from.href.split('/')[from.href.split('/').length - 1]}`
		}

		modalData.value = {
			formHeader: data.blocks.find((el) => el.name === 'FormHeader')?.props || null,
			formClubs: data.blocks.find((el) => el.name === 'FormClubs')?.props || null,
			formInputs: data.blocks.find((el) => el.name === 'FormInputs')?.props || null,
		}
		isForm.value = true
	}

	nextTick(() => {
		el.value.classList.add('open')

		modalFns.value = {
			enterAnimation: modalInner.value.enterAnimation,
			exitAnimation: modalInner.value.exitAnimation,
		}

		modalFns.value.enterAnimation()
		setTimeout(() => {
			closeBtn.value.animateIn()
			emitter.emit('homeHeader-pause')
		}, 500)
	})

	const pathname = to.fullPath + query
	revertFauxRouteEntry = createFauxRouteEntry(pathname, () => close('popstate'))

	modalScroller.value.resize()
	modalScroller.value.start()
	scroller.value.stop()

	window.addEventListener('keydown', handleKey)
}
const close = (type = 'manual') => {
	if (!el.value || !el.value.classList.contains('open')) return

	closeBtn.value.animateOut()

	modalFns.value.exitAnimation().then(() => {
		el.value.classList.remove('open')

		modalScroller.value.stop()
		scroller.value.start()

		window.history.back()
		revertFauxRouteEntry()

		modalData.value = null
		isClass.value = false
		isForm.value = false

		window.removeEventListener('keydown', handleKey)
		emitter.emit('homeHeader-play')
	})
}

function fromClub(route) {
	return /^\/en\/clubs\/.*/.test(route.fullPath) || /^\/clubes\/.*/.test(route.fullPath)
}

function handleKey(e) {
	if (e.key === 'Escape') close()
}

registerActions(open, close)
</script>

<style lang="scss" scoped>
[data-component='modal-drawer'] {
	--modal-width: #{rs(1100)};

	&.class-modal {
		--modal-width: #{rs(1250)};
	}

	position: fixed;
	top: 0;
	left: 0;

	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 100svw;
	height: 100dvh;

	z-index: 11;

	pointer-events: none;

	opacity: 0;
	visibility: hidden;

	@include max-screen($xsmall) {
		--modal-width: 100%;
	}

	&.open {
		pointer-events: visible;

		opacity: 1;
		visibility: visible;

		.background {
			background-color: rgb(from var(--color-darkBrown) r g b / 0.98);

			.close-hitarea {
				pointer-events: visible;
			}
		}
	}

	.close-btn {
		--circleBtn-backgroundColor: var(--color-darkBrown);
		--icon-color: var(--color-yellow);

		position: absolute;
		top: calc(var(--grid-padding));
		left: calc(100vw - var(--modal-width) + #{rs(28)});

		z-index: 4;

		@include max-screen($xsmall) {
			top: calc(var(--grid-padding));
			left: calc(var(--grid-padding));

			display: flex;
		}
	}

	.background {
		position: absolute;
		inset: 0;

		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		background-color: rgb(from var(--color-darkBrown) r g b / 0);

		transition: background-color 1s ease(out-expo);
		pointer-events: none;
	}

	.close-hitarea {
		position: absolute;
		inset: 0;

		display: block;
		width: calc(100% - var(--modal-width));
		cursor: pointer;

		z-index: 1;
	}

	.modal-scroller {
		position: relative;
		pointer-events: none;
	}

	.inner {
		position: relative;

		display: flex;
		justify-content: flex-end;
		pointer-events: visible;

		perspective: 2000px;
	}
}
</style>
