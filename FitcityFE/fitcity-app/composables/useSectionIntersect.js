import { onBeforeUnmount, onMounted, watch } from '#imports'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useScreen } from 'vue-screen'

import { getActiveContext } from '../components/core/Page/context.js'
import { useMenu } from '../components/fragments/MenuGrid/useMenu.js'

import { breakpoints } from '../config/index.js'

import.meta.client && gsap.registerPlugin(ScrollTrigger)

export function useSectionIntersect(el) {
	const observersArray = []

	const screen = useScreen()
	watch(
		() => screen.width,
		() => {
			setTimeout(() => {
				ScrollTrigger.refresh()
			}, 100)
		}
	)

	onBeforeUnmount(() => kill())

	onMounted(() => {
		const context = getActiveContext()

		context.loader.ready.then(() => {
			init()
		})
	})

	const init = () => {
		const { setMenuTheme } = useMenu()

		const sections = el.value.querySelectorAll('[data-section-intersect]')
		const elements = document.querySelectorAll('[data-element-intersect]')

		sections.forEach((section) => {
			elements.forEach((element) => {
				const boundingEl = element.dataset.elementTargetIntersect || element.querySelector('[data-element-target-intersect]') || element
				const bounding = boundingEl.getBoundingClientRect()
				const elementOffset = section.dataset.sectionOffsetIntersect || false

				let offsetValue = 1

				if (elementOffset && elementOffset.includes('px')) {
					offsetValue = Number(elementOffset.split('px')[0])
				} else if (elementOffset && elementOffset.includes('vh')) {
					offsetValue = Number((elementOffset.split('vh')[0] * screen.height) / 100)
				}

				const ob = ScrollTrigger.create({
					trigger: section,
					start: () => `top+=${offsetValue}px top+=${bounding.top}px`,
					end: () => `bottom+=1px top+=${bounding.top}px`,
					onEnter: () => {
						const theme = section.dataset.sectionIntersect
						const themeMobile = section.dataset.sectionIntersectMobile || theme
						setMenuTheme(screen.width <= breakpoints.small ? themeMobile : theme)
					},
					onEnterBack: () => {
						const theme = section.dataset.sectionIntersect
						const themeMobile = section.dataset.sectionIntersectMobile || theme
						setMenuTheme(screen.width <= breakpoints.small ? themeMobile : theme)
					},
				})
				observersArray.push(ob)
			})
		})
	}

	const kill = () => {
		observersArray.forEach((el) => el.kill())
	}
	return {}
}
