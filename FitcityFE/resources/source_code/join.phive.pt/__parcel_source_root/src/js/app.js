import HomePage from './home.js'
import Checkout from './checkout.js'

document.addEventListener('DOMContentLoaded', () => {
  let pageInstance = null

  // Get the page type from the body attribute
  const pageType = document.querySelector('.page').getAttribute('data-view')

  console.log(pageType)

  if (pageType === 'home') {
    pageInstance = new HomePage()
  } else if (pageType === 'checkout') {
    pageInstance = new Checkout()
  }

  // Initialize the page instance if one is set
  if (pageInstance) {
    pageInstance.init()
  }

  // Cleanup logic
  window.addEventListener('beforeunload', () => {
    if (pageInstance) {
      pageInstance.destroy()
    }
  })
})
