// Add these imports at the top of cardScrollType1.js
import { tooltipContent } from './tooltipContent.js';

let navigationStates = {};
let horizontalScrollData = {};
let tooltipManagers = {};
let scrollTimeout = {};
// let sectionScrollProgress = {};
// Cache the animation frame for better performance

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
        // Check all conditions
        if (!horizontalScrollData[sectionId]?.isActive) return;
        if (!window.containerState?.isActive) return;
        if (window.containerState.currentSection !== sectionId) return;
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    section.addEventListener('touchmove', (e) => {
        // Check all conditions
        if (!horizontalScrollData[sectionId]?.isActive) return;
        if (!window.containerState?.isActive) return;
        if (window.containerState.currentSection !== sectionId) return;
        
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
    
    // Check all conditions
    if (!state || !scrollData || state.isNavigating) return;
    if (!window.containerState?.isActive) return;
    if (window.containerState.currentSection !== sectionId) return;

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
            const finalProgress = scrollData.scrollX / scrollData.maxScroll;
            state.currentCard = Math.floor(finalProgress / progressPerCard);
            state.isNavigating = false;
            updateNavButtons(sectionId);
        }
    });
}

// Update preview amount for desktop
function showAutoPreview(sectionId, cards) {
    console.log(`showAutoPreview called for ${sectionId}`);
    
    const state = navigationStates[sectionId];
    const scrollData = horizontalScrollData[sectionId];
    
    // Add more checks
    if (!state || !scrollData) {
        console.log('No state or scroll data - aborting showAutoPreview');
        return;
    }
    
    if (state.autoPreviewShown) {
        console.log('Auto preview already shown - aborting');
        return;
    }
    
    if (!window.containerState?.isActive) {
        console.log('Container not active - aborting showAutoPreview');
        return;
    }
    
    if (!horizontalScrollData[sectionId].isActive) {
        console.log('Section not active - aborting showAutoPreview');
        return;
    }

    console.log('All checks passed - showing auto preview');
    
    // ENSURE cards are in initial position first
    setInitialCardPositions(sectionId);
    
    // Wait for positions to be set
    setTimeout(() => {
        state.autoPreviewShown = true;
        
        const progressPerCard = 0.9 / cards.length;
        const isDesktop = window.innerWidth >= 768;
        const targetProgress = isDesktop ? 0.25 * progressPerCard : 0.15 * progressPerCard;

        console.log('Starting auto preview animation:', {
            progressPerCard,
            targetProgress,
            targetScrollX: targetProgress * scrollData.maxScroll
        });

        gsap.to(scrollData, {
            scrollX: targetProgress * scrollData.maxScroll,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: () => {
                const progress = scrollData.scrollX / scrollData.maxScroll;
                console.log('Auto preview progress:', progress);
                updateHorizontalAnimation(sectionId, progress, cards);
            },
            onComplete: () => {
                console.log('Auto preview animation complete');
                if (isDesktop) {
                    const tooltipManager = tooltipManagers[sectionId];
                    if (tooltipManager && cards.length > 1) {
                        setTimeout(() => {
                            tooltipManager.showTooltip(0);
                        }, 300);
                    }
                }
                
                // Show mobile navigation
                if (state.mobileNavContainer) {
                    gsap.to(state.mobileNavContainer, { 
                        opacity: 1, 
                        duration: 0.5 
                    });
                }
            }
        });
    }, 200);
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

const originalUpdateHorizontalAnimation = updateHorizontalAnimation;
// Function to update horizontal animation based on progress
function updateHorizontalAnimation(sectionId, progress, cards) {
    console.log(`updateHorizontalAnimation called: ${sectionId}, progress: ${progress}`);
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
    // Call original function
    return originalUpdateHorizontalAnimation(sectionId, progress, cards);
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

// Create invisible scroll zones
/*function createScrollZones(section, sectionId, sectionCards) {
    // Only for desktop
    if (window.innerWidth < 768) return null;
    
    const zonesContainer = document.createElement('div');
    zonesContainer.className = 'scroll-zones-container';
    zonesContainer.id = `scroll-zones-${sectionId}`;
    
    const leftZone = document.createElement('div');
    leftZone.className = 'scroll-zone scroll-zone-left';
    
    const rightZone = document.createElement('div');
    rightZone.className = 'scroll-zone scroll-zone-right';
    
    // Left zone: Continue vertical page scroll (bypass pinning)
    leftZone.addEventListener('wheel', (e) => {
        if (!horizontalScrollData[sectionId].isActive) return;
        
        if (e.deltaY > 0) { // Scrolling down
            e.preventDefault();
            // Force exit from pinned section and continue page scroll
            bypassSectionScroll(sectionId, 'down');
        } else if (e.deltaY < 0) { // Scrolling up
            e.preventDefault();
            bypassSectionScroll(sectionId, 'up');
        }
    }, { passive: false });
    
    // Right zone: Horizontal card navigation
    rightZone.addEventListener('wheel', (e) => {
        if (!horizontalScrollData[sectionId].isActive) return;
        e.preventDefault();
        handleDesktopCardNavigation(e, sectionId, sectionCards);
    }, { passive: false });
    
    zonesContainer.appendChild(leftZone);
    zonesContainer.appendChild(rightZone);
    section.appendChild(zonesContainer);
    
    return zonesContainer;
}*/

// Function to bypass section pinning and continue page scroll
/*function bypassSectionScroll(sectionId, direction) {
    // Deactivate current section
    horizontalScrollData[sectionId].isActive = false;
    deactivateScrollZones(sectionId);
    toggleNavigation(true);
    
    // Let container snap scroll handle the transition
    const container = document.querySelector('.projects-container');
    const currentSection = document.getElementById(sectionId);
    const sections = Array.from(container.querySelectorAll('.project-section'));
    const currentIndex = sections.indexOf(currentSection);
    
    if (direction === 'down' && currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (direction === 'up' && currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
}*/

// Initialize scroll progress tracking when section becomes active
/*function initSectionScrollProgress(sectionId) {
    if (!sectionScrollProgress[sectionId]) {
        const section = document.getElementById(sectionId);
        const scrollTriggerInstance = ScrollTrigger.getAll().find(st => st.trigger === section);
        
        if (scrollTriggerInstance) {
            // Start tracking from current scroll position or trigger start
            sectionScrollProgress[sectionId] = Math.max(
                window.pageYOffset, 
                scrollTriggerInstance.start
            );
        }
    }
}*/

// Reset scroll progress when section is fully exited
/*function resetSectionScrollProgress(sectionId) {
    delete sectionScrollProgress[sectionId];
}*/

function activateScrollZones(sectionId) {
    const zones = document.getElementById(`scroll-zones-${sectionId}`);
    if (zones) zones.classList.add('active');
}

function deactivateScrollZones(sectionId) {
    const zones = document.getElementById(`scroll-zones-${sectionId}`);
    if (zones) zones.classList.remove('active');
}

// UPDATE the scroll zones to work with container:
function createScrollZones(section, sectionId, sectionCards) {
    if (window.innerWidth < 768) return null;
    
    const zonesContainer = document.createElement('div');
    zonesContainer.className = 'scroll-zones-container';
    zonesContainer.id = `scroll-zones-${sectionId}`;
    
    const leftZone = document.createElement('div');
    leftZone.className = 'scroll-zone scroll-zone-left';
    
    const rightZone = document.createElement('div');
    rightZone.className = 'scroll-zone scroll-zone-right';
    
    // Left zone: Navigate between sections
    leftZone.addEventListener('wheel', (e) => {
        if (!horizontalScrollData[sectionId].isActive || !window.containerState?.isActive) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        if (e.deltaY > 0) {
            navigateContainerSection(sectionId, 'next');
        } else if (e.deltaY < 0) {
            navigateContainerSection(sectionId, 'prev');
        }
    }, { passive: false });
    
    // Right zone: Horizontal card navigation
    rightZone.addEventListener('wheel', (e) => {
        if (!horizontalScrollData[sectionId].isActive || !window.containerState?.isActive) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        handleDesktopCardNavigation(e, sectionId, sectionCards);
    }, { passive: false });
    
    zonesContainer.appendChild(leftZone);
    zonesContainer.appendChild(rightZone);
    section.appendChild(zonesContainer);
    
    return zonesContainer;
}

// new container navigation function:
function navigateContainerSection(currentSectionId, direction) {
    if (!window.containerScrollManager || !window.containerState?.isActive) return;
    
    // Use the container manager's navigation method
    window.containerScrollManager.navigateToSection(direction);
}

function addDesktopScrollListener(section, sectionId, sectionCards) {
    let isDesktop = window.innerWidth >= 768;
    
    // Update on resize
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth >= 768;
    });

    const handleHorizontalScroll = (e) => {
        // Only handle if section is active AND container is active
        if (!horizontalScrollData[sectionId].isActive || !window.containerState?.isActive) return;
        
        e.preventDefault();
        
        if (isDesktop) {
            handleDesktopCardNavigation(e, sectionId, sectionCards);
        } else {
            handleMobileScroll(e, sectionId, sectionCards);
        }
    };

    section.addEventListener('wheel', handleHorizontalScroll, { passive: false });
    addTouchEvents(section, sectionId, sectionCards);
}

function resetSectionState(sectionId) {
    const state = navigationStates[sectionId];
    const scrollData = horizontalScrollData[sectionId];
    
    if (!state || !scrollData) return;
    
    // Reset to initial state
    scrollData.scrollX = 0;
    state.currentCard = 0;
    state.autoPreviewShown = false;
    
    // Reset all cards to initial position
    const section = document.getElementById(sectionId);
    const cards = section.querySelectorAll('.item');
    
    cards.forEach(card => {
        gsap.set(card, { 
            x: window.innerWidth,
            y: -window.innerHeight * 0.1,
            scale: 1,
            opacity: 0,
            rotation: 0,
            force3D: true
        });
    });
    
    // Hide navigation initially
    if (state.mobileNavContainer) {
        gsap.set(state.mobileNavContainer, { opacity: 0 });
    }
}

function activateProjectSection(sectionId) {
    console.log(`Activating project section: ${sectionId}`);
    
    // CRITICAL: Ensure horizontal scroll data exists
    if (!horizontalScrollData[sectionId]) {
        console.error(`No horizontal scroll data for ${sectionId}`);
        return;
    }
    
    // Activate horizontal scroll
    horizontalScrollData[sectionId].isActive = true;
    
    // Reset section state to ensure clean start
    if (window.resetSectionState) {
        window.resetSectionState(sectionId);
    }
    
    // Activate scroll zones
    if (window.activateScrollZones) {
        window.activateScrollZones(sectionId);
    }
    
    // Show mobile navigation for this section
    const state = navigationStates[sectionId];
    if (state?.mobileNavContainer) {
        gsap.to(state.mobileNavContainer, { 
            opacity: 1, 
            duration: 0.3 
        });
    }
    
    console.log(`Section ${sectionId} activated:`, {
        isActive: horizontalScrollData[sectionId].isActive,
        hasScrollData: !!horizontalScrollData[sectionId],
        scrollX: horizontalScrollData[sectionId].scrollX,
        maxScroll: horizontalScrollData[sectionId].maxScroll
    });
}

function deactivateProjectSection(sectionId) {
    console.log(`Deactivating project section: ${sectionId}`);
    
    if (!horizontalScrollData[sectionId]) return;
    
    // Deactivate horizontal scroll
    horizontalScrollData[sectionId].isActive = false;
    
    // Deactivate scroll zones
    if (window.deactivateScrollZones) {
        window.deactivateScrollZones(sectionId);
    }
    
    // Hide navigation
    if (window.hideNavigation) {
        window.hideNavigation(sectionId);
    }
    
    // Hide tooltips
    const tooltipManager = tooltipManagers[sectionId];
    if (tooltipManager && tooltipManager.isVisible) {
        tooltipManager.hideTooltip();
    }
}

function debugSectionState(sectionId) {
    console.log(`=== Debug State for ${sectionId} ===`);
    console.log('Container State:', window.containerState);
    console.log('Horizontal Scroll Data:', horizontalScrollData[sectionId]);
    console.log('Navigation State:', navigationStates[sectionId]);
    console.log('Tooltip Manager:', tooltipManagers[sectionId]);
    
    const section = document.getElementById(sectionId);
    const cards = section?.querySelectorAll('.item');
    console.log('Cards found:', cards?.length);
    console.log('Section element:', section);
    
    return {
        containerActive: window.containerState?.isActive,
        currentSection: window.containerState?.currentSection,
        sectionActive: horizontalScrollData[sectionId]?.isActive,
        cardsCount: cards?.length,
        scrollX: horizontalScrollData[sectionId]?.scrollX,
        maxScroll: horizontalScrollData[sectionId]?.maxScroll
    };
}

function debugCardPositions(sectionId) {
    const section = document.getElementById(sectionId);
    const cards = section.querySelectorAll('.item');
    
    console.log(`=== Card Positions Debug for ${sectionId} ===`);
    console.log(`Found ${cards.length} cards`);
    
    cards.forEach((card, index) => {
        const computedStyle = window.getComputedStyle(card);
        const transform = computedStyle.transform;
        const position = {
            transform: transform,
            left: computedStyle.left,
            top: computedStyle.top,
            opacity: computedStyle.opacity,
            visibility: computedStyle.visibility
        };
        
        console.log(`Card ${index}:`, position);
        console.log(`Card ${index} GSAP values:`, {
            x: gsap.getProperty(card, "x"),
            y: gsap.getProperty(card, "y"),
            scale: gsap.getProperty(card, "scale"),
            opacity: gsap.getProperty(card, "opacity"),
            rotation: gsap.getProperty(card, "rotation")
        });
    });
}

function debugAutoPreview(sectionId) {
    const state = navigationStates[sectionId];
    const scrollData = horizontalScrollData[sectionId];
    
    console.log(`=== Auto Preview Debug for ${sectionId} ===`);
    console.log('Navigation State:', state);
    console.log('Scroll Data:', scrollData);
    console.log('Auto Preview Shown:', state?.autoPreviewShown);
    console.log('Container State:', window.containerState);
    console.log('Section Active:', horizontalScrollData[sectionId]?.isActive);
}

function setInitialCardPositions(sectionId) {
    const section = document.getElementById(sectionId);
    const cards = section.querySelectorAll('.item');
    
    console.log(`Setting initial positions for ${cards.length} cards in ${sectionId}`);
    
    cards.forEach((card, index) => {
        // EXPLICIT initial position - FAR off screen to the right
        gsap.set(card, { 
            x: window.innerWidth + 200, // Extra offset to ensure off-screen
            y: -window.innerHeight * 0.05, // Slightly above center
            scale: 1,
            opacity: 0,
            rotation: 0,
            force3D: true,
            transformOrigin: "50% 50%",
            willChange: "transform, opacity"
        });
        
        console.log(`Card ${index} set to:`, {
            x: window.innerWidth + 200,
            y: -window.innerHeight * 0.05,
            scale: 1,
            opacity: 0
        });
    });
    
    // Verify positions were set
    setTimeout(() => {
        console.log('Verification after 100ms:');
        debugCardPositions(sectionId);
    }, 100);
}

window.debugCardPositions = debugCardPositions;
window.debugAutoPreview = debugAutoPreview;
window.setInitialCardPositions = setInitialCardPositions;
window.activateProjectSection = activateProjectSection;
window.deactivateProjectSection = deactivateProjectSection;
window.debugSectionState = debugSectionState;
window.resetSectionState = resetSectionState;
window.showAutoPreview = showAutoPreview;
window.activateScrollZones = activateScrollZones;
window.deactivateScrollZones = deactivateScrollZones;
window.hideNavigation = hideNavigation;
window.horizontalScrollData = horizontalScrollData;

// Animation for project sections with hybrid horizontal scroll
window.addEventListener('siteLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);
    
    const projectSections = document.querySelectorAll('.project-section[id^="project-"]');
    
    // Initialize all data structures FIRST
    projectSections.forEach(section => {
        const sectionCards = section.querySelectorAll('.item');
        const sectionId = section.id;
        
        if (!sectionCards.length) return;
        
        // Initialize horizontal scroll tracking
        horizontalScrollData[sectionId] = {
            scrollX: 0,
            isActive: false,
            maxScroll: sectionCards.length * 120
        };
        
        // Initialize navigation state
        initProjectNavigation(sectionId, Array.from(sectionCards));
        
        // Initialize tooltip manager
        tooltipManagers[sectionId] = new ProjectTooltipManager(sectionId);
        
        // Set initial card states
        setInitialCardPositions(sectionId);
        
        // Create scroll zones
        createScrollZones(section, sectionId, Array.from(sectionCards));
        
        // Add scroll listeners
        addDesktopScrollListener(section, sectionId, Array.from(sectionCards));
        
        console.log(`Initialized section ${sectionId}:`, {
            cardsCount: sectionCards.length,
            maxScroll: horizontalScrollData[sectionId].maxScroll,
            hasTooltipManager: !!tooltipManagers[sectionId],
            hasNavigationState: !!navigationStates[sectionId]
        });
    });

    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            Object.keys(horizontalScrollData).forEach(sectionId => {
                if (horizontalScrollData[sectionId].isActive) {
                    const section = document.getElementById(sectionId);
                    const cards = section.querySelectorAll('.item');
                    const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
                    updateHorizontalAnimation(sectionId, progress, Array.from(cards));
                }
            });
        }, 150);
    });

    const originalGsapTo = gsap.to;
    gsap.to = function(target, vars) {
        // Log any animations on .item elements
        if (target && (
            target.classList?.contains('item') || 
            (target.length && Array.from(target).some(el => el.classList?.contains('item')))
        )) {
            console.log('GSAP animation on card:', {
                target: target,
                vars: vars,
                stack: new Error().stack.split('\n').slice(1, 5)
            });
        }
        
        return originalGsapTo.call(this, target, vars);
    };
    
    console.log('Card scroll initialization complete:', {
        sectionsInitialized: Object.keys(horizontalScrollData),
        horizontalScrollData: horizontalScrollData,
        navigationStates: navigationStates,
        tooltipManagers: tooltipManagers
    });
});