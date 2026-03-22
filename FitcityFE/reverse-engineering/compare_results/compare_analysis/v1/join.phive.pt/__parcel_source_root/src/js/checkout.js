import gsap from 'gsap'

class Checkout {
  constructor() {
    // You can initialize any properties here if needed
    this.animation = null
    this.repeatNumber = 1
  }

  init() {
    console.log('Checkout initialized')
    this.setupEventListeners()
    this.useFullWidthFontSize({ element: document.querySelector('.title') })
    this.initAnimations()
  }

  setupEventListeners() {
    this.boundResizeHandler = () => this.useFullWidthFontSize({ element: document.querySelector('.title') })
    window.addEventListener('resize', this.boundResizeHandler)
  }

  // Method to handle animations
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

  destroy() {
    console.log('Checkout destroyed')
    this.removeEventListeners()
    this.cleanupAnimations()
  }

  // Method to remove event listeners
  removeEventListeners() {
    window.removeEventListener('resize', this.boundResizeHandler)
  }

  // Method to clean up animations
  cleanupAnimations() {
    if (this.animation) {
      this.animation.kill()
    }
  }
}

export default Checkout
