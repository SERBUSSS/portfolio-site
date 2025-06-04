import ReactDOM from 'react-dom/client'
import BlurText from './blocks/TextAnimations/BlurText/BlurText.jsx'
import ScrollReveal from './blocks/TextAnimations/ScrollReveal/ScrollReveal.jsx'
import FadeContent from './blocks/Animations/FadeContent/FadeContent.jsx'
import AnimatedContent from './blocks/Animations/AnimatedContent/AnimatedContent.jsx'

class ViewportAnimationController {
  constructor() {
    this.reactRoots = new WeakMap()
    this.processedElements = new WeakSet()
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
    const animationConfigs = [
      { 
        className: 'blur-reveal-title', 
        component: BlurText, 
        props: { delay: 50, animateBy: 'words' } 
      },
      { 
        className: 'scroll-reveal-paragraph', 
        component: ScrollReveal, 
        props: { enableBlur: true, baseOpacity: 0.3 } 
      },
      { 
        className: 'fade-reveal-element', 
        component: FadeContent, 
        props: { duration: 800, threshold: 0.1 } 
      },
      { 
        className: 'scroll-reveal-heading', 
        component: ScrollReveal, 
        props: { enableBlur: true, baseOpacity: 0.2 } 
      },
      { 
        className: 'animate-reveal-element', 
        component: AnimatedContent, 
        props: { distance: 50, direction: 'vertical' } 
      }
    ]

    animationConfigs.forEach(config => {
      this.setupAnimationType(config)
    })
  }

  setupAnimationType({ className, component: Component, props }) {
    const elements = document.querySelectorAll(`.${className}`)
    
    elements.forEach((element, index) => {
      if (this.processedElements.has(element)) return
      
      this.processedElements.add(element)
      this.wrapWithAnimation(element, Component, props, `${className}-${index}`)
    })
  }

  wrapWithAnimation(element, Component, defaultProps, uniqueId) {
    // Extract text content for text-based animations
    const textContent = element.textContent.trim()
    const hasTextContent = textContent.length > 0
    
    // Store original attributes and styles
    const originalClasses = Array.from(element.classList).filter(cls => 
      !cls.includes('reveal') && !cls.includes('animate')
    )
    const originalStyles = element.getAttribute('style') || ''
    const originalId = element.getAttribute('id')
    
    // Create container that preserves layout
    const container = document.createElement('div')
    
    // Preserve important attributes
    if (originalId) container.setAttribute('id', originalId)
    container.className = originalClasses.join(' ')
    if (originalStyles) container.setAttribute('style', originalStyles)
    
    // Copy data attributes
    Array.from(element.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        container.setAttribute(attr.name, attr.value)
      }
    })
    
    // Replace element with container
    element.parentNode.replaceChild(container, element)
    
    // Mount React component
    const root = ReactDOM.createRoot(container)
    this.reactRoots.set(container, root)
    
    // Render appropriate component based on content type
    if (hasTextContent && (Component === BlurText || Component === ScrollReveal)) {
      // Text-based animations
      root.render(
        <Component 
          {...defaultProps}
          text={textContent}
          className={originalClasses.join(' ')}
        />
      )
    } else {
      // Content-based animations - wrap the original element
      root.render(
        <Component {...defaultProps}>
          <div 
            className={originalClasses.join(' ')}
            dangerouslySetInnerHTML={{ __html: element.innerHTML }}
          />
        </Component>
      )
    }
  }

  destroy() {
    // Cleanup all React roots
    this.reactRoots.forEach((root) => {
      try {
        root.unmount()
      } catch (e) {
        console.warn('Error unmounting animation component:', e)
      }
    })
  }
}

// Initialize
const animationController = new ViewportAnimationController()
window.viewportAnimations = animationController

export default animationController