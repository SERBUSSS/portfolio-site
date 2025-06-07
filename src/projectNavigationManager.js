// src/projectNavigationManager.js - Enhanced Project Navigation

class ProjectNavigationManager {
  constructor(sectionId, cards, tooltipManager) {
    this.sectionId = sectionId
    this.cards = cards
    this.tooltipManager = tooltipManager
    this.currentCardIndex = 0
    this.totalCards = cards.length
    this.isNavigating = false
    this.autoPreviewShown = false
    this.progressPerCard = 0.9 / this.totalCards
    this.autoPreviewPercent = 0.15 // 15% of first card animation
    
    this.setupNavigationButtons()
  }

  setupNavigationButtons() {
    // Find navigation container for this project
    const navContainer = document.querySelector(`#${this.sectionId} #project-navigation`)
    if (!navContainer) return

    const buttons = navContainer.querySelectorAll('div')
    if (buttons.length >= 2) {
      this.prevButton = buttons[0]
      this.nextButton = buttons[buttons.length - 1]
      
      // Add click handlers
      this.prevButton.addEventListener('click', () => this.navigateTo('prev'))
      this.nextButton.addEventListener('click', () => this.navigateTo('next'))
      
      // Update initial button states
      this.updateButtonStates()
    }
  }

  // Show automatic preview when section locks in
  showAutoPreview() {
    if (this.autoPreviewShown || this.isNavigating) return
    
    this.autoPreviewShown = true
    
    // Calculate target progress for auto preview
    const targetProgress = this.autoPreviewPercent * this.progressPerCard
    
    // Get section's horizontal scroll data
    const scrollData = window.horizontalScrollData?.[this.sectionId]
    if (!scrollData) return
    
    // Animate to preview position
    gsap.to(scrollData, {
      scrollX: targetProgress * scrollData.maxScroll,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        window.updateHorizontalAnimation(this.sectionId, 
          scrollData.scrollX / scrollData.maxScroll, this.cards)
      },
      onComplete: () => {
        // Update current card index
        this.currentCardIndex = 0
        this.updateButtonStates()
      }
    })
  }

  // Navigate to specific direction
  navigateTo(direction) {
    if (this.isNavigating) return

    const targetIndex = direction === 'next' 
      ? Math.min(this.currentCardIndex + 1, this.totalCards - 1)
      : Math.max(this.currentCardIndex - 1, 0)
    
    if (targetIndex === this.currentCardIndex) return

    this.navigateToCard(targetIndex)
  }

  // Navigate to specific card index
  navigateToCard(targetIndex) {
    if (this.isNavigating || targetIndex < 0 || targetIndex >= this.totalCards) return
    
    this.isNavigating = true
    const scrollData = window.horizontalScrollData?.[this.sectionId]
    if (!scrollData) {
      this.isNavigating = false
      return
    }

    // Calculate target progress
    const targetProgress = (targetIndex + this.autoPreviewPercent) * this.progressPerCard
    const targetScrollX = Math.min(targetProgress * scrollData.maxScroll, scrollData.maxScroll)
    
    // Animate to target position
    gsap.to(scrollData, {
      scrollX: targetScrollX,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        const currentProgress = scrollData.scrollX / scrollData.maxScroll
        window.updateHorizontalAnimation(this.sectionId, currentProgress, this.cards)
        
        // Update tooltip during navigation
        const currentActiveCard = Math.floor(currentProgress / this.progressPerCard)
        if (this.tooltipManager && currentActiveCard !== this.tooltipManager.currentCardIndex) {
          this.tooltipManager.updateDescription(currentActiveCard)
        }
      },
      onComplete: () => {
        this.currentCardIndex = targetIndex
        this.updateButtonStates()
        this.isNavigating = false
      }
    })
  }

  // Update button visual states
  updateButtonStates() {
    if (!this.prevButton || !this.nextButton) return

    // Update previous button
    if (this.currentCardIndex <= 0) {
      this.prevButton.style.opacity = '0.3'
      this.prevButton.style.pointerEvents = 'none'
    } else {
      this.prevButton.style.opacity = '1'
      this.prevButton.style.pointerEvents = 'auto'
    }

    // Update next button
    if (this.currentCardIndex >= this.totalCards - 1) {
      this.nextButton.style.opacity = '0.3'
      this.nextButton.style.pointerEvents = 'none'
    } else {
      this.nextButton.style.opacity = '1'
      this.nextButton.style.pointerEvents = 'auto'
    }
  }

  // Sync with manual scroll position
  syncWithScroll(currentProgress) {
    if (this.isNavigating) return
    
    const newCardIndex = Math.floor(currentProgress / this.progressPerCard)
    if (newCardIndex !== this.currentCardIndex && newCardIndex >= 0 && newCardIndex < this.totalCards) {
      this.currentCardIndex = newCardIndex
      this.updateButtonStates()
    }
  }

  // Reset to initial state when leaving section
  reset() {
    this.currentCardIndex = 0
    this.autoPreviewShown = false
    this.isNavigating = false
    this.updateButtonStates()
  }
}

export default ProjectNavigationManager