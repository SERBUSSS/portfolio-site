// src/simpleAnimations.js
class SimpleViewportAnimations {
  constructor() {
    this.observer = null
    this.animatedElements = new Set()
    this.gsapElements = new Map() // Track GSAP-controlled elements
    this.init()
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAnimations())
    } else {
      this.setupAnimations()
    }
  }

  setupAnimations() {
    this.injectCSS()
    
    // Setup intersection observer for repeated animations
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Initial setup
    this.observeElements()
    
    // Re-observe after GSAP animations load (delay to ensure GSAP is ready)
    setTimeout(() => {
      this.observeElements()
    }, 1000)
    
    // Listen for GSAP scroll events to re-trigger our animations
    this.setupGSAPCoordination()
  }

  injectCSS() {
    const style = document.createElement('style')
    style.textContent = `
      /* Animation base styles */
      .animate-on-scroll {
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      /* Blur reveal animation */
      .blur-reveal-title {
        opacity: 0;
        filter: blur(10px);
        transform: translateY(20px);
      }
      .blur-reveal-title.in-view {
        opacity: 1 !important;
        filter: blur(0px) !important;
        transform: translateY(0) !important;
      }

      /* Scroll reveal animation */
      .scroll-reveal-paragraph,
      .scroll-reveal-heading {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
      }
      .scroll-reveal-paragraph.in-view,
      .scroll-reveal-heading.in-view {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
      }

      /* Fade reveal animation */
      .fade-reveal-element {
        opacity: 0;
        transform: translateY(20px);
      }
      .fade-reveal-element.in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }

      /* Animate reveal animation */
      .animate-reveal-element {
        opacity: 0;
        transform: translateY(50px);
      }
      .animate-reveal-element.in-view {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }

      /* Word-by-word blur animation */
      .blur-reveal-title .word {
        opacity: 0;
        filter: blur(10px);
        transform: translateY(10px);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        display: inline-block;
      }

      .blur-reveal-title.in-view .word {
        opacity: 1 !important;
        filter: blur(0px) !important;
        transform: translateY(0) !important;
      }

      /* Stagger word animations */
      .blur-reveal-title.in-view .word:nth-child(1) { transition-delay: 0.1s; }
      .blur-reveal-title.in-view .word:nth-child(2) { transition-delay: 0.2s; }
      .blur-reveal-title.in-view .word:nth-child(3) { transition-delay: 0.3s; }
      .blur-reveal-title.in-view .word:nth-child(4) { transition-delay: 0.4s; }
      .blur-reveal-title.in-view .word:nth-child(5) { transition-delay: 0.5s; }
      .blur-reveal-title.in-view .word:nth-child(6) { transition-delay: 0.6s; }
      .blur-reveal-title.in-view .word:nth-child(7) { transition-delay: 0.7s; }
      .blur-reveal-title.in-view .word:nth-child(8) { transition-delay: 0.8s; }
      .blur-reveal-title.in-view .word:nth-child(9) { transition-delay: 0.9s; }
      .blur-reveal-title.in-view .word:nth-child(10) { transition-delay: 1.0s; }

      /* Override GSAP initial states for scroll sections */
      .scroll-section .animate-on-scroll,
      .scroll-section-2 .animate-on-scroll {
        opacity: 0 !important;
      }
      
      .scroll-section .animate-on-scroll.in-view,
      .scroll-section-2 .animate-on-scroll.in-view {
        opacity: 1 !important;
      }
    `
    document.head.appendChild(style)
  }

  setupGSAPCoordination() {
    // Listen for scroll events to re-check visibility in scroll sections
    let scrollTimeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        this.recheckScrollSections()
      }, 100)
    })

    // Listen for horizontal scroll in project sections
    const projectSections = document.querySelectorAll('.scroll-section')
    projectSections.forEach(section => {
      let horizontalScrollTimeout
      section.addEventListener('scroll', () => {
        clearTimeout(horizontalScrollTimeout)
        horizontalScrollTimeout = setTimeout(() => {
          this.recheckElementsInSection(section)
        }, 100)
      })
    })
  }

  recheckScrollSections() {
    // Re-check elements in scroll sections that might have become visible
    const scrollSections = document.querySelectorAll('.scroll-section, .scroll-section-2')
    scrollSections.forEach(section => {
      this.recheckElementsInSection(section)
    })
  }

  recheckElementsInSection(section) {
    const elements = section.querySelectorAll('.animate-on-scroll')
    elements.forEach(element => {
      if (this.isElementVisible(element)) {
        element.classList.add('in-view')
      } else {
        element.classList.remove('in-view')
      }
    })
  }

  isElementVisible(element) {
    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const windowWidth = window.innerWidth || document.documentElement.clientWidth
    
    return (
      rect.top < windowHeight * 0.8 &&
      rect.bottom > windowHeight * 0.2 &&
      rect.left < windowWidth &&
      rect.right > 0
    )
  }

  observeElements() {
    const selectors = [
      '.blur-reveal-title',
      '.scroll-reveal-paragraph', 
      '.fade-reveal-element',
      '.scroll-reveal-heading',
      '.animate-reveal-element'
    ]

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        // Skip if already processed
        if (this.animatedElements.has(element)) {
          return
        }
        
        this.animatedElements.add(element)
        element.classList.add('animate-on-scroll')
        
        // Special handling for blur text
        if (element.classList.contains('blur-reveal-title')) {
          this.prepareBlurText(element)
        }

        // For elements in scroll sections, use manual visibility check
        const isInScrollSection = element.closest('.scroll-section, .scroll-section-2')
        if (isInScrollSection) {
          this.gsapElements.set(element, isInScrollSection)
          // Set initial state
          this.recheckElementsInSection(isInScrollSection)
        } else {
          // Use intersection observer for regular sections
          this.observer.observe(element)
        }
      })
    })
  }

  prepareBlurText(element) {
    // Only process if not already processed
    if (element.querySelector('.word')) {
      return
    }
    
    const text = element.textContent.trim()
    const words = text.split(/\s+/).filter(word => word.length > 0)
    
    element.innerHTML = words.map((word, index) => 
      `<span class="word">${word}</span>`
    ).join(' ')
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      const element = entry.target
      
      // Skip if this element is controlled by GSAP scroll sections
      if (this.gsapElements.has(element)) {
        return
      }
      
      if (entry.isIntersecting) {
        element.classList.add('in-view')
      } else {
        element.classList.remove('in-view')
      }
    })
  }

  // Method to manually refresh observations
  refresh() {
    this.observeElements()
    this.recheckScrollSections()
  }

  // Method to force animate all elements (useful for debugging)
  animateAll() {
    this.animatedElements.forEach(element => {
      element.classList.add('in-view')
    })
  }

  // Method to reset all animations
  resetAll() {
    this.animatedElements.forEach(element => {
      element.classList.remove('in-view')
    })
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
    this.animatedElements.clear()
    this.gsapElements.clear()
  }
}

// Initialize
const simpleAnimations = new SimpleViewportAnimations()
window.simpleAnimations = simpleAnimations

// Expose methods for debugging
window.animateAll = () => simpleAnimations.animateAll()
window.resetAnimations = () => simpleAnimations.resetAll()
window.refreshAnimations = () => simpleAnimations.refresh()

export default simpleAnimations