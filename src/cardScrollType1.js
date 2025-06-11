// Add these imports at the top of cardScrollType1.js
import { tooltipContent } from './tooltipContent.js';

let navigationStates = {};
let horizontalScrollData = {};
let tooltipManagers = {};
let scrollTimeout = {};

// Define final positions for up to 20 cards with complete transform data
const finalPositionsConfig = {
    'project-1': {
        mobile: [
            { x: '-20vw', y: '-20vh', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0vw', y: '-25vh', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20vw', y: '-20vh', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25vw', y: '0vh', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20vw', y: '20vh', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0vw', y: '25vh', rotation: 0, scale: 0.65, opacity: 1 },
            { x: '-20vw', y: '20vh', rotation: -20, scale: 0.7, opacity: 1 },
            { x: '-25vw', y: '0vh', rotation: -25, scale: 0.7, opacity: 1 },
            { x: '-10vw', y: '-10vh', rotation: -35, scale: 0.65, opacity: 1 },
            { x: '10vw', y: '-10vh', rotation: 35, scale: 0.65, opacity: 1 },
            { x: '15vw', y: '5vh', rotation: 22, scale: 0.67, opacity: 1 },
            { x: '5vw', y: '15vh', rotation: 10, scale: 0.55, opacity: 1 },
            { x: '-5vw', y: '15vh', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15vw', y: '5vh', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5vw', y: '-15vh', rotation: -28, scale: 0.5, opacity: 1 },
            { x: '5vw', y: '-15vh', rotation: 28, scale: 0.5, opacity: 1 },
            { x: '0vw', y: '10vh', rotation: 0, scale: 0.53, opacity: 1 }
        ],
        desktop: [
            { x: '-20vw', y: '-20vh', rotation: -30, scale: 0.7, opacity: 1 },
            { x: '0vw', y: '-25vh', rotation: 0, scale: 0.8, opacity: 1 },
            { x: '20vw', y: '-20vh', rotation: 30, scale: 0.8, opacity: 1 },
            { x: '25vw', y: '0vh', rotation: 25, scale: 0.8, opacity: 1 },
            { x: '20vw', y: '20vh', rotation: 20, scale: 0.82, opacity: 1 },
            { x: '0vw', y: '25vh', rotation: 0, scale: 0.81, opacity: 1 },
            { x: '-20vw', y: '20vh', rotation: -20, scale: 0.78, opacity: 1 },
            { x: '-25vw', y: '0vh', rotation: -25, scale: 0.8, opacity: 1 },
            { x: '-10vw', y: '-10vh', rotation: -35, scale: 0.82, opacity: 1 },
            { x: '10vw', y: '-10vh', rotation: 35, scale: 0.79, opacity: 1 },
            { x: '15vw', y: '5vh', rotation: 22, scale: 0.8, opacity: 1 },
            { x: '5vw', y: '15vh', rotation: 10, scale: 0.8, opacity: 1 },
            { x: '-5vw', y: '15vh', rotation: -10, scale: 0.82, opacity: 1 },
            { x: '-15vw', y: '5vh', rotation: -22, scale: 0.8, opacity: 1 },
            { x: '-5vw', y: '-15vh', rotation: -28, scale: 0.78, opacity: 1 },
            { x: '5vw', y: '-15vh', rotation: 28, scale: 0.8, opacity: 1 },
            { x: '0vw', y: '10vh', rotation: 0, scale: 0.8, opacity: 1 }
        ]
        
    },
    
    'project-2': {
        mobile: [
            // Different layout for project 2 - maybe more circular
            { x: '-25vw', y: '-25vh', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0vw', y: '-30vh', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25vw', y: '-25vh', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30vw', y: '0vh', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25vw', y: '25vh', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0vw', y: '30vh', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25vw', y: '25vh', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30vw', y: '0vh', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15vw', y: '-15vh', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15vw', y: '-15vh', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20vw', y: '10vh', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20vw', y: '10vh', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15vw', y: '-5vh', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15vw', y: '-5vh', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0vw', y: '15vh', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8vw', y: '-20vh', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8vw', y: '-20vh', rotation: -8, scale: 0.42, opacity: 1 }
        ],
        desktop: [
            // Different layout for project 2 - maybe more circular
            { x: '-25vw', y: '-25vh', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0vw', y: '-30vh', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25vw', y: '-25vh', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30vw', y: '0vh', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25vw', y: '25vh', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0vw', y: '30vh', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25vw', y: '25vh', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30vw', y: '0vh', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15vw', y: '-15vh', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15vw', y: '-15vh', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20vw', y: '10vh', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20vw', y: '10vh', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15vw', y: '-5vh', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15vw', y: '-5vh', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0vw', y: '15vh', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8vw', y: '-20vh', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8vw', y: '-20vh', rotation: -8, scale: 0.42, opacity: 1 }
        ]
    },
    
    'project-3': {
        mobile: [
            // Tighter spiral layout for project 3
            { x: '-20vw', y: '-20vh', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0vw', y: '-25vh', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20vw', y: '-20vh', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25vw', y: '0vh', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20vw', y: '20vh', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0vw', y: '25vh', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20vw', y: '20vh', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25vw', y: '0vh', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10vw', y: '-10vh', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10vw', y: '-10vh', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15vw', y: '5vh', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5vw', y: '15vh', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5vw', y: '15vh', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15vw', y: '5vh', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5vw', y: '-15vh', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5vw', y: '-15vh', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0vw', y: '10vh', rotation: 0, scale: 0.53, opacity: 1 }
        ],
        desktop: [
            // Tighter spiral layout for project 3
            { x: '-20vw', y: '-20vh', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0vw', y: '-25vh', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20vw', y: '-20vh', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25vw', y: '0vh', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20vw', y: '20vh', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0vw', y: '25vh', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20vw', y: '20vh', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25vw', y: '0vh', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10vw', y: '-10vh', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10vw', y: '-10vh', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15vw', y: '5vh', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5vw', y: '15vh', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5vw', y: '15vh', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15vw', y: '5vh', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5vw', y: '-15vh', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5vw', y: '-15vh', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0vw', y: '10vh', rotation: 0, scale: 0.53, opacity: 1 }
        ]
    },
    
    'project-4': {
        mobile: [
            // Different layout for project 4 - maybe more circular
            { x: '-25vw', y: '-25vh', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0vw', y: '-30vh', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25vw', y: '-25vh', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30vw', y: '0vh', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25vw', y: '25vh', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0vw', y: '30vh', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25vw', y: '25vh', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30vw', y: '0vh', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15vw', y: '-15vh', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15vw', y: '-15vh', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20vw', y: '10vh', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20vw', y: '10vh', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15vw', y: '-5vh', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15vw', y: '-5vh', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0vw', y: '15vh', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8vw', y: '-20vh', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8vw', y: '-20vh', rotation: -8, scale: 0.42, opacity: 1 }
        ],
        desktop: [
            // Different layout for project 4 - maybe more circular
            { x: '-25vw', y: '-25vh', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0vw', y: '-30vh', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25vw', y: '-25vh', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30vw', y: '0vh', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25vw', y: '25vh', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0vw', y: '30vh', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25vw', y: '25vh', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30vw', y: '0vh', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15vw', y: '-15vh', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15vw', y: '-15vh', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20vw', y: '10vh', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10vw', y: '20vh', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20vw', y: '10vh', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15vw', y: '-5vh', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15vw', y: '-5vh', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0vw', y: '15vh', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8vw', y: '-20vh', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8vw', y: '-20vh', rotation: -8, scale: 0.42, opacity: 1 }
        ]
    }
};

function isMobileViewport() {
    return window.innerWidth < 768;
}

function getFinalPositions(projectId) {
    const config = finalPositionsConfig[projectId] || finalPositionsConfig['project-1'];
    const positions = isMobileViewport() ? config.mobile : config.desktop;
    
    // 🔍 DEBUG - Remove this after testing
    console.log(`Project: ${projectId}, Viewport: ${window.innerWidth}px, Mobile: ${isMobileViewport()}, Using:`, positions[0]);
    
    return positions;
}

// Add this class before your existing code
class ProjectTooltipManager {
    constructor(projectId) {
        this.projectId = projectId;
        this.tooltip = document.getElementById(`tooltip-${projectId}`);
        this.projectNameEl = document.getElementById(`tt-project-name-${projectId.split('-')[1]}`);
        this.descriptionEl = document.getElementById(`tt-card-description-${projectId.split('-')[1]}`);
        this.currentCardIndex = -1;
        this.isVisible = false;
        this.isTransitioning = false;
        this.content = tooltipContent[projectId];
        this.shouldBeVisible = false;
        
        // Desktop navigation buttons
        this.prevBtn = this.tooltip?.querySelector('.nav-prev');
        this.nextBtn = this.tooltip?.querySelector('.nav-next');
        
        if (this.content) {
            this.projectNameEl.textContent = this.content.projectName;
        }
        
        // Setup desktop navigation event listeners
        this.setupDesktopNavigation();
    }

    setupDesktopNavigation() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.navigateCard('prev');
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.navigateCard('next');
            });
        }
    }

    navigateCard(direction) {
        const state = navigationStates[this.projectId];
        const scrollData = horizontalScrollData[this.projectId];
        if (!state || !scrollData || state.isNavigating) return;

        const cards = document.getElementById(this.projectId).querySelectorAll('.item');
        const progressPerCard = 0.9 / cards.length;
        const currentProgress = scrollData.scrollX / scrollData.maxScroll;
        
        let targetIndex;
        
        if (direction === 'next') {
            if (currentProgress < (0.5 * progressPerCard)) {
                targetIndex = 0;
            } else {
                const currentCardFromProgress = Math.floor(currentProgress / progressPerCard);
                targetIndex = Math.min(currentCardFromProgress + 1, cards.length - 1);
            }
        } else {
            const currentCardFromProgress = Math.floor(currentProgress / progressPerCard);
            // FIXED: Allow going back to preview state
            targetIndex = Math.max(currentCardFromProgress - 1, -1);
        }

        state.isNavigating = true;
        
        // FIXED: Handle preview state
        let targetProgress;
        if (targetIndex === -1) {
            targetProgress = 0.15 * progressPerCard;
        } else {
            targetProgress = (targetIndex + 0.6) * progressPerCard;
        }
        
        gsap.to(scrollData, {
            scrollX: targetProgress * scrollData.maxScroll,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
                const progress = scrollData.scrollX / scrollData.maxScroll;
                updateHorizontalAnimation(this.projectId, progress, cards);
            },
            onComplete: () => {
                const finalProgress = scrollData.scrollX / scrollData.maxScroll;
                state.currentCard = targetIndex === -1 ? -1 : Math.floor(finalProgress / progressPerCard);
                state.isNavigating = false;
                this.updateDesktopNavButtons(state.currentCard, cards.length);
            }
        });
    }

    updateDesktopNavButtons(currentCard, totalCards) {
    if (!this.prevBtn || !this.nextBtn) return;

    // FIXED: Update prev button to handle preview state
    if (currentCard <= -1) { // Changed from <= 0 to <= -1
        gsap.to(this.prevBtn, { opacity: 0.3, duration: 0.3 });
        this.prevBtn.style.pointerEvents = 'none';
    } else {
        gsap.to(this.prevBtn, { opacity: 1, duration: 0.3 });
        this.prevBtn.style.pointerEvents = 'auto';
    }

    // Update next button
    if (currentCard >= totalCards - 1) {
        gsap.to(this.nextBtn, { opacity: 0.3, duration: 0.3 });
        this.nextBtn.style.pointerEvents = 'none';
    } else {
        gsap.to(this.nextBtn, { opacity: 1, duration: 0.3 });
        this.nextBtn.style.pointerEvents = 'auto';
    }
}

    showTooltip(cardIndex) {
        if (!this.content.cards[cardIndex]) return;
        
        if (!this.isVisible && !this.isTransitioning) {
            this.isTransitioning = true;
            this.shouldBeVisible = true;
            
            this.tooltip.classList.remove('hidden');
            this.descriptionEl.textContent = this.content.cards[cardIndex];
            this.currentCardIndex = cardIndex;
            
            gsap.set(this.descriptionEl, { opacity: 1 });
            
            gsap.to(this.tooltip, {
                duration: 0.5,
                opacity: 1,
                ease: 'power2.out',
                onComplete: () => {
                    this.isVisible = true;
                    this.isTransitioning = false;
                    // Update desktop nav buttons when tooltip becomes visible
                    const state = navigationStates[this.projectId];
                    if (state) {
                        this.updateDesktopNavButtons(state.currentCard, state.totalCards);
                    }
                }
            });
        }
    }

    updateDescription(cardIndex) {
        if (this.content.cards[cardIndex] && this.currentCardIndex !== cardIndex) {
            this.descriptionEl.textContent = this.content.cards[cardIndex];
            this.currentCardIndex = cardIndex;
        }
    }

    hideTooltip() {
        if (!this.isVisible || this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.shouldBeVisible = false;
        
        const currentOpacity = gsap.getProperty(this.descriptionEl, "opacity");
        
        if (currentOpacity <= 0.1) {
            gsap.to(this.tooltip, {
                duration: 0.3,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    this.tooltip.classList.add('hidden');
                    this.isVisible = false;
                    this.isTransitioning = false;
                    this.currentCardIndex = -1;
                }
            });
        } else {
            gsap.to([this.descriptionEl, this.tooltip], {
                duration: 0.4,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    this.tooltip.classList.add('hidden');
                    this.isVisible = false;
                    this.isTransitioning = false;
                    this.currentCardIndex = -1;
                }
            });
        }
    }

    handleCardTransition(activeCardIndex, totalCards) {
        const shouldShow = activeCardIndex >= 1 && activeCardIndex <= totalCards - 2;
        
        if (shouldShow && !this.isVisible && !this.isTransitioning) {
            this.showTooltip(activeCardIndex);
        } else if (!shouldShow && this.isVisible && !this.isTransitioning) {
            this.hideTooltip();
        }
        
        this.shouldBeVisible = shouldShow;
    }
}

// Enhanced wheel scroll handler for desktop smooth card-by-card navigation
function addDesktopScrollListener(section, sectionId, sectionCards) {
    let isDesktop = window.innerWidth >= 768; // md breakpoint
    
    // Update on resize
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth >= 768;
    });

    const handleHorizontalScroll = (e) => {
        if (!horizontalScrollData[sectionId].isActive) return;
        
        e.preventDefault();
        
        // Different behavior for desktop vs mobile
        if (isDesktop) {
            // Desktop: Card-by-card navigation
            handleDesktopCardNavigation(e, sectionId, sectionCards);
        } else {
            // Mobile: Smooth continuous scroll (existing behavior)
            handleMobileScroll(e, sectionId, sectionCards);
        }
    };

    section.addEventListener('wheel', handleHorizontalScroll, { passive: false });
    
    // Keep existing touch events for mobile
    addTouchEvents(section, sectionId, sectionCards);
}

// Desktop card-by-card navigation function
function handleDesktopCardNavigation(e, sectionId, sectionCards) {
    const state = navigationStates[sectionId];
    const scrollData = horizontalScrollData[sectionId];
    
    if (!state || state.isNavigating) return;
    
    // Clear any existing timeout
    if (scrollTimeout[sectionId]) {
        clearTimeout(scrollTimeout[sectionId]);
    }
    
    // Debounce scroll events
    scrollTimeout[sectionId] = setTimeout(() => {
        const delta = e.deltaX || e.deltaY;
        const direction = delta > 0 ? 'next' : 'prev';
        
        const progressPerCard = 0.9 / sectionCards.length;
        const currentProgress = scrollData.scrollX / scrollData.maxScroll;
        
        let targetIndex;
        
        if (direction === 'next') {
            if (currentProgress < (0.5 * progressPerCard)) {
                targetIndex = 0;
            } else {
                const currentCardFromProgress = Math.floor(currentProgress / progressPerCard);
                targetIndex = Math.min(currentCardFromProgress + 1, sectionCards.length - 1);
            }
        } else {
            const currentCardFromProgress = Math.floor(currentProgress / progressPerCard);
            // FIXED: Allow going back to preview state (negative index)
            targetIndex = Math.max(currentCardFromProgress - 1, -1); // Changed from 0 to -1
        }

        state.isNavigating = true;
        
        // FIXED: Handle preview state differently
        let targetProgress;
        if (targetIndex === -1) {
            // Go to preview state
            targetProgress = 0.15 * progressPerCard; // Same as showAutoPreview
        } else {
            targetProgress = (targetIndex + 0.6) * progressPerCard;
        }
        
        gsap.to(scrollData, {
            scrollX: targetProgress * scrollData.maxScroll,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
                const progress = scrollData.scrollX / scrollData.maxScroll;
                updateHorizontalAnimation(sectionId, progress, sectionCards);
            },
            onComplete: () => {
                const finalProgress = scrollData.scrollX / scrollData.maxScroll;
                // FIXED: Update currentCard to reflect preview state
                state.currentCard = targetIndex === -1 ? -1 : Math.floor(finalProgress / progressPerCard);
                state.isNavigating = false;
                
                // Update desktop nav buttons in tooltip
                const tooltipManager = tooltipManagers[sectionId];
                if (tooltipManager) {
                    tooltipManager.updateDesktopNavButtons(state.currentCard, sectionCards.length);
                }
            }
        });
    }, 50);
}

// Mobile scroll function (existing behavior)
function handleMobileScroll(e, sectionId, sectionCards) {
    const delta = e.deltaX || e.deltaY;
    horizontalScrollData[sectionId].scrollX += delta * 0.7;
    
    horizontalScrollData[sectionId].scrollX = Math.max(0, 
        Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll)
    );
    
    const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
    updateHorizontalAnimation(sectionId, progress, sectionCards);
}

// Touch events for mobile
function addTouchEvents(section, sectionId, sectionCards) {
    let touchStartX = 0;
    let touchStartY = 0;
    
    section.addEventListener('touchstart', (e) => {
        if (!horizontalScrollData[sectionId].isActive) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    section.addEventListener('touchmove', (e) => {
        if (!horizontalScrollData[sectionId].isActive) return;
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchStartX - touchX;
        const deltaY = touchStartY - touchY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
            
            horizontalScrollData[sectionId].scrollX += deltaX * 0.5;
            horizontalScrollData[sectionId].scrollX = Math.max(0, 
                Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll)
            );
            
            const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
            updateHorizontalAnimation(sectionId, progress, sectionCards);
            
            touchStartX = touchX;
            touchStartY = touchY;
        }
    }, { passive: false });
}

function initProjectNavigation(sectionId, cards) {
    const section = document.getElementById(sectionId);
    
    // Mobile navigation container
    const mobileNavContainer = section?.querySelector('#project-navigation');
    // Desktop navigation buttons in tooltip
    const tooltipContainer = section?.querySelector(`#tooltip-${sectionId}`);
    
    navigationStates[sectionId] = {
        currentCard: 0,
        isNavigating: false,
        autoPreviewShown: false,
        mobileNavContainer: mobileNavContainer,
        tooltipContainer: tooltipContainer,
        totalCards: cards.length
    };

    // Initialize mobile navigation
    if (mobileNavContainer) {
        gsap.set(mobileNavContainer, { opacity: 0 });
        const prevButton = mobileNavContainer.querySelector('[data-direction="prev"]');
        const nextButton = mobileNavContainer.querySelector('[data-direction="next"]');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => navigateToCard(sectionId, 'prev', cards));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => navigateToCard(sectionId, 'next', cards));
        }
    }

    // Initialize desktop navigation buttons in tooltip
    if (tooltipContainer) {
        const desktopPrevButton = tooltipContainer.querySelector('.nav-btn[data-direction="prev"]');
        const desktopNextButton = tooltipContainer.querySelector('.nav-btn[data-direction="next"]');
        
        if (desktopPrevButton) {
            desktopPrevButton.addEventListener('click', () => navigateToCard(sectionId, 'prev', cards));
        }
        if (desktopNextButton) {
            desktopNextButton.addEventListener('click', () => navigateToCard(sectionId, 'next', cards));
        }
    }

    updateNavButtons(sectionId);
}

function navigateToCard(sectionId, direction, cards) {
    const state = navigationStates[sectionId];
    const scrollData = horizontalScrollData[sectionId];
    if (!state || !scrollData || state.isNavigating) return;

    const progressPerCard = 0.9 / cards.length;
    const currentProgress = scrollData.scrollX / scrollData.maxScroll;
    
    let targetIndex;
    
    if (direction === 'next') {
        // FIXED: Simple logic - if we're in preview (less than 50% of first card), go to card 0
        // Otherwise, increment normally
        if (currentProgress < (0.5 * progressPerCard)) {
            targetIndex = 0;
        } else {
            // Calculate which card we should go to based on current progress
            const currentCardFromProgress = Math.floor(currentProgress / progressPerCard);
            targetIndex = Math.min(currentCardFromProgress + 1, cards.length - 1);
        }
    } else {
        // For previous, always use progress-based calculation
        const currentCardFromProgress = Math.floor(currentProgress / progressPerCard);
        targetIndex = Math.max(currentCardFromProgress - 1, 0);
    }

    state.isNavigating = true;
    const targetProgress = (targetIndex + 0.6) * progressPerCard;
    
    gsap.to(scrollData, {
        scrollX: targetProgress * scrollData.maxScroll,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => {
            const progress = scrollData.scrollX / scrollData.maxScroll;
            updateHorizontalAnimation(sectionId, progress, cards);
        },
        onComplete: () => {
            // FIXED: Always sync currentCard with actual progress
            const finalProgress = scrollData.scrollX / scrollData.maxScroll;
            state.currentCard = Math.floor(finalProgress / progressPerCard);
            state.isNavigating = false;
            updateNavButtons(sectionId);
        }
    });
}

// Update preview amount for desktop
function showAutoPreview(sectionId, cards) {
    const state = navigationStates[sectionId];
    const scrollData = horizontalScrollData[sectionId];
    if (!state || !scrollData || state.autoPreviewShown) return;

    if (scrollData.scrollX > 0) {
        state.autoPreviewShown = true;
        return;
    }

    state.autoPreviewShown = true;
    const progressPerCard = 0.9 / cards.length;
    
    const isDesktop = window.innerWidth >= 768;
    const targetProgress = isDesktop ? 
        0.25 * progressPerCard : 
        0.15 * progressPerCard;

    gsap.to(scrollData, {
        scrollX: targetProgress * scrollData.maxScroll,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
            const progress = scrollData.scrollX / scrollData.maxScroll;
            updateHorizontalAnimation(sectionId, progress, cards);
        },
        onComplete: () => {
            // FIXED: Show tooltip immediately for desktop (even for card 0)
            if (isDesktop) {
                const tooltipManager = tooltipManagers[sectionId];
                if (tooltipManager && cards.length > 1) {
                    setTimeout(() => {
                        // Show tooltip for card 0 on desktop (since we're in preview state)
                        tooltipManager.showTooltip(0);
                    }, 300);
                }
            }
        }
    });
}

function updateNavButtons(sectionId) {
    const state = navigationStates[sectionId];
    if (!state) return;

    // Update mobile buttons
    if (state.mobileNavContainer) {
        const mobilePrevBtn = state.mobileNavContainer.querySelector('[data-direction="prev"]');
        const mobileNextBtn = state.mobileNavContainer.querySelector('[data-direction="next"]');

        if (mobilePrevBtn) {
            if (state.currentCard <= 0) {
                gsap.to(mobilePrevBtn, { opacity: 0.3, duration: 0.3, pointerEvents: 'none' });
            } else {
                gsap.to(mobilePrevBtn, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
            }
        }

        if (mobileNextBtn) {
            if (state.currentCard >= state.totalCards - 1) {
                gsap.to(mobileNextBtn, { opacity: 0.3, duration: 0.3, pointerEvents: 'none' });
            } else {
                gsap.to(mobileNextBtn, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
            }
        }
    }

    // Update desktop buttons in tooltip
    if (state.tooltipContainer) {
        const desktopPrevBtn = state.tooltipContainer.querySelector('.nav-btn[data-direction="prev"]');
        const desktopNextBtn = state.tooltipContainer.querySelector('.nav-btn[data-direction="next"]');

        if (desktopPrevBtn) {
            if (state.currentCard <= 0) {
                gsap.to(desktopPrevBtn, { opacity: 0.3, duration: 0.3, pointerEvents: 'none' });
            } else {
                gsap.to(desktopPrevBtn, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
            }
        }

        if (desktopNextBtn) {
            if (state.currentCard >= state.totalCards - 1) {
                gsap.to(desktopNextBtn, { opacity: 0.3, duration: 0.3, pointerEvents: 'none' });
            } else {
                gsap.to(desktopNextBtn, { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
            }
        }
    }
}

function showNavigation(sectionId) {
    const state = navigationStates[sectionId];
    if (!state) return;

    // Show mobile navigation
    if (state.mobileNavContainer) {
        gsap.to(state.mobileNavContainer, { 
            opacity: 1, 
            duration: 0.5,
            onComplete: () => updateNavButtons(sectionId)
        });
    }
    
    // Desktop buttons are shown/hidden with the tooltip automatically
    updateNavButtons(sectionId);
}

function hideNavigation(sectionId) {
    const state = navigationStates[sectionId];
    if (!state) return;

    // Hide mobile navigation
    if (state.mobileNavContainer) {
        gsap.to(state.mobileNavContainer, { 
            opacity: 0, 
            duration: 0.3,
            onComplete: () => {
                state.isNavigating = false;
            }
        });
    }
    
    // Desktop buttons are hidden with the tooltip automatically
}

function syncNavWithScroll(sectionId, progress, totalCards) {
    const state = navigationStates[sectionId];
    if (!state || state.isNavigating) return;
    
    const progressPerCard = 0.9 / totalCards;
    // FIXED: Use 0.6 threshold to match navigation logic
    const newCardIndex = Math.floor((progress + 0.3 * progressPerCard) / progressPerCard);
    
    if (newCardIndex !== state.currentCard && newCardIndex >= 0 && newCardIndex < totalCards) {
        state.currentCard = newCardIndex;
        updateNavButtons(sectionId);
    }
}

const updateTooltip = (projectId, cardIndex) => {
  window.ReactBridge?.emit('tooltip-update', { projectId, cardIndex })
}

// Function to update horizontal animation based on progress
function updateHorizontalAnimation(sectionId, progress, cards) {
    const totalCards = cards.length;
    const progressPerCard = 0.9 / totalCards;
    const tooltipManager = tooltipManagers[sectionId];
    
    // Get viewport dimensions for calculations
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    // Check if desktop
    const isDesktop = window.innerWidth >= 768; // md breakpoint
    
    cards.forEach((card, index) => {
        const cardStartProgress = index * progressPerCard;
        const cardEndProgress = (index + 1) * progressPerCard;
        const isLastCard = index === cards.length - 1;
        
        if (progress >= cardStartProgress) {
            const cardProgress = Math.min(1, (progress - cardStartProgress) / progressPerCard);
            
            // Tooltip logic
            if (tooltipManager && index >= 1 && index <= cards.length - 2) {
            const isActiveCard = progress >= cardStartProgress && progress < cardEndProgress;
            
            if (isActiveCard) {
                // Update description if needed
                if (tooltipManager.currentCardIndex !== index) {
                    tooltipManager.updateDescription(index);
                }
                
                // Handle description opacity based on card progress
                if (cardProgress >= 0.05 && cardProgress <= 0.95) {
                    if (cardProgress >= 0.05 && cardProgress <= 0.1) {
                        const fadeProgress = (cardProgress - 0.05) / 0.05;
                        gsap.set(tooltipManager.descriptionEl, { opacity: fadeProgress });
                        // If this is the first tooltip card (index 1) and we're fading in from card 0
                        if (index === 1) {
                            gsap.set(tooltipManager.tooltip, { opacity: fadeProgress });
                        }
                    } else if (cardProgress > 0.1 && cardProgress < 0.9) {
                        gsap.set(tooltipManager.descriptionEl, { opacity: 1 });
                        gsap.set(tooltipManager.tooltip, { opacity: 1 });
                    } else if (cardProgress >= 0.9 && cardProgress <= 0.95) {
                        const fadeProgress = 1 - ((cardProgress - 0.9) / 0.05);
                        gsap.set(tooltipManager.descriptionEl, { opacity: fadeProgress });
                        // If this is the last tooltip card (second-to-last overall card) and we're fading out to last card
                        if (index === cards.length - 2) {
                            gsap.set(tooltipManager.tooltip, { opacity: fadeProgress });
                        }
                    }
                } else {
                    gsap.set(tooltipManager.descriptionEl, { opacity: 0 });
                    // Fade out tooltip on edge cases
                    if (index === 1 || index === cards.length - 2) {
                        gsap.set(tooltipManager.tooltip, { opacity: 0 });
                    }
                }
            }
        }
            
            // Your existing card animation code stays the same here...
            if (cardProgress <= 0.6) {
                // Step 1: Slide in from right to center
                const slideProgress = cardProgress / 0.6;
                const startX = 100 * vw;
                const endX = 0;
                const currentX = startX + (endX - startX) * slideProgress;
                
                const visibilityOpacity = getCardVisibilityOpacity(index, progress, totalCards);
                gsap.set(card, {
                    x: currentX,
                    y: -5 * vh,
                    scale: 1,
                    opacity: slideProgress * visibilityOpacity,
                    rotation: 0,
                    force3D: true
                });
            } else {
                // Step 2: Move to final position
                const finalProgress = (cardProgress - 0.6) / 0.4;

                // Get responsive final positions
                const projectFinalPositions = getFinalPositions(sectionId);

                let finalPos;
                if (isLastCard) {
                    finalPos = { x: '0vw', y: '0vh', rotation: 0, scale: 0.8, opacity: 1 };
                } else {
                    finalPos = projectFinalPositions[index % projectFinalPositions.length];
                }
                
                const finalX = parseFloat(finalPos.x) * vw;
                const finalY = parseFloat(finalPos.y) * vh;
                
                const currentX = 0 + (finalX - 0) * finalProgress;
                const currentY = (-5 * vh) + (finalY - (-5 * vh)) * finalProgress;
                const currentScale = 1 + (finalPos.scale - 1) * finalProgress;
                const currentOpacity = 1 + (finalPos.opacity - 1) * finalProgress;
                const currentRotation = 0 + (finalPos.rotation - 0) * finalProgress;
                
                const visibilityOpacity = getCardVisibilityOpacity(index, progress, totalCards);
                gsap.set(card, {
                    x: currentX,
                    y: currentY,
                    scale: currentScale,
                    opacity: currentOpacity * visibilityOpacity,
                    rotation: currentRotation,
                    force3D: true
                });
            }
        } else {
            // Card hasn't started animating yet
            gsap.set(card, {
                x: 100 * vw,
                y: -5 * vh,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true
            });
        }
    });

    // Handle tooltip visibility ONCE per frame outside the loop
    if (tooltipManager) {
        const currentActiveCard = Math.floor(progress / progressPerCard);
        
        // Different logic for desktop vs mobile
        let shouldShow;
        if (isDesktop) {
            // Desktop: Show tooltip for cards 0 through second-to-last (include first card)
            shouldShow = currentActiveCard >= 0 && currentActiveCard <= cards.length - 2;
        } else {
            // Mobile: Show tooltip for cards 1 through second-to-last (exclude first card)
            shouldShow = currentActiveCard >= 1 && currentActiveCard <= cards.length - 2;
        }
        
        const cardProgress = (progress - (currentActiveCard * progressPerCard)) / progressPerCard;
        
        if (shouldShow) {
            // Show tooltip if not visible
            if (!tooltipManager.isVisible && !tooltipManager.isTransitioning) {
                tooltipManager.showTooltip(currentActiveCard);
            }
            
            // Update description only when we're well into the card (avoid flicker)
            if (cardProgress > 0.2 && cardProgress < 0.8) {
                if (tooltipManager.currentCardIndex !== currentActiveCard) {
                    tooltipManager.updateDescription(currentActiveCard);
                }
            }
            
            // Keep tooltip visible throughout the card range
            if (tooltipManager.isVisible) {
                gsap.set(tooltipManager.tooltip, { opacity: 1 });
                gsap.set(tooltipManager.descriptionEl, { opacity: 1 });
            }
        } else {
            // Hide tooltip only when clearly outside the range
            if (tooltipManager.isVisible && !tooltipManager.isTransitioning) {
                tooltipManager.hideTooltip();
            }
        }
    }

    syncNavWithScroll(sectionId, progress, cards.length);
}

function getCardVisibilityOpacity(cardIndex, progress, totalCards) {
    const maxVisibleCards = 10;
    const progressPerCard = 0.9 / totalCards;
    const currentActiveCard = Math.floor(progress / progressPerCard);
    
    if (currentActiveCard < maxVisibleCards) {
        return 1; // All cards visible when we have 10 or fewer active
    }
    
    const oldestVisibleIndex = currentActiveCard - maxVisibleCards;
    
    if (cardIndex < oldestVisibleIndex) {
        return 0; // Completely hidden
    } else if (cardIndex === oldestVisibleIndex) {
        // This card is fading out - calculate fade based on next card's progress
        const nextCardIndex = currentActiveCard;
        const nextCardStartProgress = nextCardIndex * progressPerCard;
        const fadeProgress = Math.min(1, (progress - nextCardStartProgress) / (progressPerCard * 0.2)); // Fade over 20% of next card
        return Math.max(0, 1 - fadeProgress);
    } else if (cardIndex === currentActiveCard + 1 && cardIndex > maxVisibleCards) {
        // This card is fading in - calculate fade based on current progress
        const currentCardProgress = (progress - (currentActiveCard * progressPerCard)) / progressPerCard;
        const fadeProgress = Math.min(1, currentCardProgress / 0.2); // Fade in over first 20% of current card
        return Math.max(0, fadeProgress);
    }
    
    return 1; // Fully visible
}

// Animation for project sections with hybrid horizontal scroll
window.addEventListener('siteLoaded', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Select the project sections
    const projectSections = document.querySelectorAll('[id^="project-"]');
    
    // Map of project IDs to their corresponding background sections
    const backgroundMap = {
        'project-1': 'background-p-1',
        'project-2': 'background-p-2',
        'project-3': 'background-p-3',
        'project-4': 'background-p-4'
    };
    
    // Process each project section
    projectSections.forEach(section => {
        const sectionCards = section.querySelectorAll('.item');
        const sectionId = section.id;
        
        // Only initialize if we have cards to work with
        if (!sectionCards.length) return;
        
        // Initialize horizontal scroll tracking for this section
        horizontalScrollData[sectionId] = {
            scrollX: 0,
            isActive: false,
            maxScroll: sectionCards.length * 120
        };
        
        // Get background section if one is mapped
        const backgroundId = backgroundMap[sectionId];
        const backgroundElement = backgroundId ? document.getElementById(backgroundId) : null;
        
        // If we have a background element for this section
        if (backgroundElement) {
            // Style the background element
            gsap.set(backgroundElement, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: -1
            });
            
            // Clone and insert the background into the project section
            const bgClone = backgroundElement.cloneNode(true);
            bgClone.id = `${backgroundId}-clone`;
            bgClone.style.position = 'absolute';
            bgClone.style.zIndex = '-1';
            section.insertBefore(bgClone, section.firstChild);
            
            // Hide the original background section
            backgroundElement.style.display = 'none';
        }
        
        // Set initial states for cards
        sectionCards.forEach(card => {
            gsap.set(card, { 
                x: window.innerWidth, // Start from right side of screen
                y: -window.innerHeight * 0.1, // Slightly above center
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true,
                transformOrigin: "50% 50%",
                willChange: "transform, opacity"
            });
        });
        
        // Create ScrollTrigger for section pinning only
        ScrollTrigger.create({
            trigger: section,
            pin: true,
            start: "top 5%",
            end: "+=25%", // Reduced from 30% for faster exit
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
        });
        
        // Add horizontal scroll listener when section is active
        addDesktopScrollListener(section, sectionId, sectionCards);
        
        // Set section as active when it's pinned
        ScrollTrigger.create({
            trigger: section,
            start: "top 5%",
            end: "+=25%",
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            onEnter: () => {
                horizontalScrollData[sectionId].isActive = true;
                toggleNavigation(false);
                showNavigation(sectionId);
                setTimeout(() => showAutoPreview(sectionId, sectionCards), 500);
            },
            onLeave: () => {
                horizontalScrollData[sectionId].isActive = false;
                toggleNavigation(true);
                hideNavigation(sectionId);
            },
            onEnterBack: () => {
                horizontalScrollData[sectionId].isActive = true;
                toggleNavigation(false);
                showNavigation(sectionId);
                setTimeout(() => showAutoPreview(sectionId, sectionCards), 300);
            },  
            onLeaveBack: () => {
                horizontalScrollData[sectionId].isActive = false;
                toggleNavigation(true);
                hideNavigation(sectionId);
            },
        });
    });

    // Initialize tooltip managers
    projectSections.forEach(section => {
        const sectionId = section.id;
        tooltipManagers[sectionId] = new ProjectTooltipManager(sectionId);
        // ADD THIS LINE:
        initProjectNavigation(sectionId, section.querySelectorAll('.item'));
    });

    function toggleNavigation(show) {
        const headerContainer = document.getElementById('nav-bar-cont');
        if (headerContainer) {
            gsap.to(headerContainer, {
                opacity: show ? 1 : 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }

    // Add this after your existing event listeners
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate positions on viewport change
            Object.keys(horizontalScrollData).forEach(sectionId => {
                if (horizontalScrollData[sectionId].isActive) {
                    const section = document.getElementById(sectionId);
                    const cards = section.querySelectorAll('.item');
                    const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
                    updateHorizontalAnimation(sectionId, progress, cards);
                }
            });
        }, 150);
    });
});