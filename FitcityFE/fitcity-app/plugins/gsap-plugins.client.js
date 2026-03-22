import { gsap } from 'gsap'
import SplitText from './gsap/SplitText'
import InertiaPlugin from './gsap/InertiaPlugin'
import CustomEase from './gsap/CustomEase'

export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        gsap.registerPlugin(SplitText, InertiaPlugin, CustomEase)
    }
})
