class LoadingScreenController {
  constructor() {
    this.isLoaded = false
    this.minLoadTime = 800 // Minimum loading time in ms
    this.startTime = Date.now()
    this.loadingScreen = null
    this.resourcesLoaded = false
    this.scriptsLoaded = false
    
    this.init()
  }

  init() {
    // Add loading class to body immediately
    document.body.classList.add('loading')
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupLoadingScreen())
    } else {
      this.setupLoadingScreen()
    }
  }

  setupLoadingScreen() {
    this.loadingScreen = document.getElementById('loading-screen')
    
    if (!this.loadingScreen) {
      console.warn('Loading screen element not found')
      this.hideLoadingScreen()
      return
    }

    // Start checking for resource completion
    this.checkResourcesLoaded()
    this.checkScriptsLoaded()
    
    // Fallback timeout to prevent infinite loading
    setTimeout(() => {
      if (!this.isLoaded) {
        console.warn('Loading timeout reached, forcing load completion')
        this.completeLoading()
      }
    }, 5000) // 5 second maximum
  }

  checkResourcesLoaded() {
    // Check if all resources are loaded
    if (document.readyState === 'complete') {
      this.resourcesLoaded = true
      this.tryCompleteLoading()
    } else {
      window.addEventListener('load', () => {
        this.resourcesLoaded = true
        this.tryCompleteLoading()
      })
    }
  }

  checkScriptsLoaded() {
    // Check if critical scripts are loaded
    const checkScripts = () => {
      const gsapLoaded = typeof gsap !== 'undefined'
      const scrollTriggerLoaded = typeof ScrollTrigger !== 'undefined'
      
      if (gsapLoaded && scrollTriggerLoaded) {
        this.scriptsLoaded = true
        this.tryCompleteLoading()
      } else {
        // Check again after a short delay
        setTimeout(checkScripts, 100)
      }
    }
    
    checkScripts()
  }

  tryCompleteLoading() {
    // Only complete loading if both resources and scripts are ready
    if (this.resourcesLoaded && this.scriptsLoaded && !this.isLoaded) {
      const elapsedTime = Date.now() - this.startTime
      
      if (elapsedTime >= this.minLoadTime) {
        this.completeLoading()
      } else {
        // Wait for minimum load time
        setTimeout(() => {
          this.completeLoading()
        }, this.minLoadTime - elapsedTime)
      }
    }
  }

  completeLoading() {
    if (this.isLoaded) return
    
    this.isLoaded = true
    
    // Remove loading class and add loaded class
    document.body.classList.remove('loading')
    document.body.classList.add('loaded')
    
    // Hide loading screen with animation
    this.hideLoadingScreen()
    
    // Initialize animations after loading screen is hidden
    setTimeout(() => {
      this.initializeAnimations()
    }, 100)
  }

  hideLoadingScreen() {
    if (!this.loadingScreen) return
    
    this.loadingScreen.classList.add('hidden')
    
    // Remove from DOM after animation completes
    setTimeout(() => {
      if (this.loadingScreen && this.loadingScreen.parentNode) {
        this.loadingScreen.parentNode.removeChild(this.loadingScreen)
      }
    }, 800)
  }

  initializeAnimations() {
    // Trigger a refresh of animations after loading is complete
    if (window.simpleAnimations) {
      window.simpleAnimations.refresh()
    }
    
    // Dispatch custom event for other scripts to listen to
    window.dispatchEvent(new CustomEvent('siteLoaded', {
      detail: { timestamp: Date.now() }
    }))
    
    console.log('✅ Site loading complete, animations initialized')
  }
}

// Initialize loading screen controller immediately
const loadingController = new LoadingScreenController()

// Export for potential external use
window.loadingController = loadingController

export default loadingController