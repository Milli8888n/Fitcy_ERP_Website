import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
class HomePage {
  constructor() {
    this.animation = null
    this.repeatNumber = 1
  }

  init() {
    console.log('HomePage initialized')
    this.setupEventListeners()
    this.useFullWidthFontSize({ element: document.querySelector('.title') })
    this.initAnimations()

    this.initParallax()
  }

  setupEventListeners() {
    this.boundResizeHandler = () => this.useFullWidthFontSize({ element: document.querySelector('.title') })
    window.addEventListener('resize', this.boundResizeHandler)
  }

  initAnimations() {
    this.animation = gsap.fromTo('.subtitle', { opacity: 0 }, { opacity: 1, duration: 1 })
  }

  animateIn() {
    gsap.fromTo(
      document.querySelectorAll('.label'),
      { x: 50, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        ease: 'expo.out',
        duration: 1,
        stagger: 0.075,
        delay: 0.85
      }
    )
  }

  useFullWidthFontSize = (params) => {
    const { element, container, maxFontSize = 1000 } = params

    document.fonts.ready.then(() => {
      const containerElement = container || document.querySelector('body')

      const textElement = element
      let fontSize = maxFontSize

      textElement.style.visibility = 'hidden'
      textElement.style.fontSize = `${fontSize}px`

      // console.log(textElement.scrollWidth, containerElement.clientWidth)

      while (textElement.scrollWidth > containerElement.clientWidth && fontSize > 0) {
        fontSize--
        textElement.style.fontSize = `${fontSize}px`
      }

      textElement.style.visibility = 'visible'
    })
  }

  initParallax() {
    const images = document.querySelectorAll('.benefits .images-wrapper .image')
    const speeds = [15, 25, 45, 80]

    images.forEach((image, index) => {
      const speed = speeds[index % speeds.length]

      ScrollTrigger.create({
        trigger: image,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.to(image.querySelector('img'), {
            yPercent: self.progress * speed,
            ease: 'none',
            overwrite: 'auto'
          })
        }
      })

      // gsap.to(image, {
      //   yPercent: speed,
      //   ease: 'power2.out',
      //   scrollTrigger: {
      //     trigger: image,
      //     start: 'top bottom',
      //     end: 'bottom top',
      //     scrub: true,
      //     onUpdate: (self) => {
      //       gsap.to(image.querySelector('img'), {
      //         yPercent: self.progress * speed,
      //         ease: 'none',
      //         overwrite: 'auto'
      //       })
      //     }
      //   }
      // })
    })
  }

  destroy() {
    console.log('HomePage destroyed')
    this.removeEventListeners()
    this.cleanupAnimations()
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.boundResizeHandler)
  }

  cleanupAnimations() {
    if (this.animation) {
      this.animation.kill()
    }
  }
}

export default HomePage
