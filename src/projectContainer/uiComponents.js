// ================================================
// UI COMPONENTS - Tooltips & Navigation
// ================================================

import { tooltipContent, navigationStates, CONFIG, isDesktop, isMobile, debounceScrollEvents } from './dataAndUtils.js';
import { handleProjectCardScroll } from './sectionManagers.js';

// ================================================
// CONSTANTS & VALIDATION
// ================================================

const PROJECT_SECTIONS = ['project-1', 'project-2', 'project-3', 'project-4'];
const TOOLTIP_FADE_DURATION = 300;
const NAV_BUTTON_ANIMATION_DURATION = 200;

// UI component states
const tooltipStates = new Map();

// GSAP validation
let gsapAvailable = false;

function validateGSAP() {
    gsapAvailable = typeof gsap !== 'undefined';
    if (!gsapAvailable) {
        console.warn('GSAP not available - using CSS transitions fallback');
    }
    return gsapAvailable;
}

function validateProjectSection(sectionId) {
    return PROJECT_SECTIONS.includes(sectionId);
}

// ================================================
// TOOLTIP MANAGEMENT
// ================================================

function initTooltips() {
    PROJECT_SECTIONS.forEach(sectionId => {
        const tooltipElement = document.getElementById(`tooltip-${sectionId}`);
        
        if (tooltipElement) {
            // Initialize tooltip state
            tooltipStates.set(sectionId, {
                element: tooltipElement,
                isVisible: false,
                currentCardIndex: 0,
                isAnimating: false,
                nameElement: tooltipElement.querySelector(`#tt-project-name-${sectionId.split('-')[1]}`),
                descriptionElement: tooltipElement.querySelector(`#tt-card-description-${sectionId.split('-')[1]}`)
            });
            
            // Set initial visibility
            hideTooltipImmediate(sectionId);
            
            console.log(`✅ Initialized tooltip for ${sectionId}`);
        } else {
            console.warn(`⚠️ Tooltip element not found: tooltip-${sectionId}`);
        }
    });
}

function showTooltip(sectionId, delay = 500) {
    if (!validateProjectSection(sectionId)) return;
    
    const state = tooltipStates.get(sectionId);
    if (!state || state.isVisible || state.isAnimating) return;
    
    console.log(`📝 Showing tooltip for ${sectionId} with ${delay}ms delay`);
    
    setTimeout(() => {
        const currentState = tooltipStates.get(sectionId);
        if (!currentState || currentState.isAnimating) return;
        
        currentState.isAnimating = true;
        currentState.isVisible = true;
        
        if (gsapAvailable) {
            gsap.fromTo(currentState.element, 
                {
                    opacity: 0,
                    y: 20,
                    visibility: 'hidden'
                },
                {
                    opacity: 1,
                    y: 0,
                    visibility: 'visible',
                    duration: TOOLTIP_FADE_DURATION / 1000,
                    ease: 'power2.out',
                    onComplete: () => {
                        currentState.isAnimating = false;
                    }
                }
            );
        } else {
            // CSS fallback
            currentState.element.style.visibility = 'visible';
            currentState.element.style.opacity = '1';
            currentState.element.style.transform = 'translateY(0)';
            currentState.isAnimating = false;
        }
        
        tooltipStates.set(sectionId, currentState);
    }, delay);
}

function hideTooltip(sectionId) {
    if (!validateProjectSection(sectionId)) return;
    
    const state = tooltipStates.get(sectionId);
    if (!state || !state.isVisible || state.isAnimating) return;
    
    console.log(`📝 Hiding tooltip for ${sectionId}`);
    
    state.isAnimating = true;
    
    if (gsapAvailable) {
        gsap.to(state.element, {
            opacity: 0,
            y: -20,
            duration: TOOLTIP_FADE_DURATION / 1000,
            ease: 'power2.in',
            onComplete: () => {
                state.element.style.visibility = 'hidden';
                state.isVisible = false;
                state.isAnimating = false;
                tooltipStates.set(sectionId, state);
            }
        });
    } else {
        // CSS fallback
        state.element.style.opacity = '0';
        state.element.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            state.element.style.visibility = 'hidden';
            state.isVisible = false;
            state.isAnimating = false;
            tooltipStates.set(sectionId, state);
        }, TOOLTIP_FADE_DURATION);
    }
}

function hideTooltipImmediate(sectionId) {
    const state = tooltipStates.get(sectionId);
    if (!state) return;
    
    if (gsapAvailable) {
        gsap.set(state.element, {
            opacity: 0,
            visibility: 'hidden',
            y: 0
        });
    } else {
        state.element.style.opacity = '0';
        state.element.style.visibility = 'hidden';
        state.element.style.transform = 'translateY(0)';
    }
    
    state.isVisible = false;
    state.isAnimating = false;
    tooltipStates.set(sectionId, state);
}

function updateTooltipContent(sectionId, cardIndex) {
    if (!validateProjectSection(sectionId)) return;
    
    const state = tooltipStates.get(sectionId);
    if (!state || cardIndex === state.currentCardIndex) return;
    
    const content = getTooltipContent(sectionId, cardIndex);
    if (!content) {
        console.warn(`No tooltip content found for ${sectionId} card ${cardIndex}`);
        return;
    }
    
    // Update content elements
    if (state.nameElement) {
        state.nameElement.textContent = content.name || '';
    }
    
    if (state.descriptionElement) {
        state.descriptionElement.textContent = content.description || '';
    }
    
    // Update state
    state.currentCardIndex = cardIndex;
    tooltipStates.set(sectionId, state);
    
    console.log(`📝 Updated tooltip content for ${sectionId} card ${cardIndex}`);
}

function getTooltipContent(sectionId, cardIndex) {
    const sectionContent = tooltipContent[sectionId];
    if (!sectionContent || !Array.isArray(sectionContent)) return null;
    
    return sectionContent[cardIndex] || null;
}

function positionTooltip(sectionId) {
    const state = tooltipStates.get(sectionId);
    if (!state) return;
    
    const device = isDesktop() ? 'desktop' : 'mobile';
    
    // Tooltip positioning is handled by CSS classes
    // This function can be used for dynamic adjustments if needed
    state.element.dataset.device = device;
}

// ================================================
// NAVIGATION SYSTEM
// ================================================

function initNavigation() {
    PROJECT_SECTIONS.forEach(sectionId => {
        const tooltipElement = document.getElementById(`tooltip-${sectionId}`);
        if (!tooltipElement) return;
        
        // Find navigation buttons within the tooltip
        const prevButton = tooltipElement.querySelector('.nav-btn.nav-prev');
        const nextButton = tooltipElement.querySelector('.nav-btn.nav-next');
        
        if (prevButton && nextButton) {
            // Initialize navigation state
            navigationStates.set(sectionId, {
                prevButton,
                nextButton,
                isActive: false,
                currentIndex: 0,
                maxIndex: 19, // 0-19 for 20 cards
                canGoPrev: false,
                canGoNext: true
            });
            
            // Setup event listeners
            setupNavigationEvents(sectionId, prevButton, nextButton);
            
            // Set initial button states
            updateButtonStates(sectionId, 0, 20);
            
            console.log(`🎮 Initialized navigation for ${sectionId}`);
        } else {
            console.warn(`⚠️ Navigation buttons not found in tooltip for ${sectionId}`);
        }
    });
}

function setupNavigationEvents(sectionId, prevButton, nextButton) {
    // Previous button
    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handlePrevClick(sectionId);
    });
    
    // Next button
    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNextClick(sectionId);
    });
    
    // Hover effects
    prevButton.addEventListener('mouseenter', () => {
        if (!prevButton.disabled) {
            animateButtonHover(prevButton, true);
        }
    });
    
    prevButton.addEventListener('mouseleave', () => {
        animateButtonHover(prevButton, false);
    });
    
    nextButton.addEventListener('mouseenter', () => {
        if (!nextButton.disabled) {
            animateButtonHover(nextButton, true);
        }
    });
    
    nextButton.addEventListener('mouseleave', () => {
        animateButtonHover(nextButton, false);
    });
}

function showNavigation(sectionId) {
    if (!validateProjectSection(sectionId)) return;
    
    const state = navigationStates.get(sectionId);
    if (!state || state.isActive) return;
    
    state.isActive = true;
    
    // Navigation visibility is handled by the tooltip container
    // Buttons are part of the tooltip HTML structure
    const tooltipState = tooltipStates.get(sectionId);
    if (tooltipState && tooltipState.isVisible) {
        enableNavigationButtons(sectionId);
    }
    
    navigationStates.set(sectionId, state);
    console.log(`🎮 Activated navigation for ${sectionId}`);
}

function hideNavigation(sectionId) {
    if (!validateProjectSection(sectionId)) return;
    
    const state = navigationStates.get(sectionId);
    if (!state || !state.isActive) return;
    
    state.isActive = false;
    disableNavigationButtons(sectionId);
    
    navigationStates.set(sectionId, state);
    console.log(`🎮 Deactivated navigation for ${sectionId}`);
}

function updateButtonStates(sectionId, cardIndex, totalCards) {
    const state = navigationStates.get(sectionId);
    if (!state) return;
    
    const maxIndex = totalCards - 1;
    const canGoPrev = cardIndex > 0;
    const canGoNext = cardIndex < maxIndex;
    
    // Update state
    state.currentIndex = cardIndex;
    state.maxIndex = maxIndex;
    state.canGoPrev = canGoPrev;
    state.canGoNext = canGoNext;
    
    // Update button appearance
    updateButtonAppearance(state.prevButton, canGoPrev);
    updateButtonAppearance(state.nextButton, canGoNext);
    
    navigationStates.set(sectionId, state);
}

function updateButtonAppearance(button, enabled) {
    if (!button) return;
    
    button.disabled = !enabled;
    
    if (enabled) {
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
        button.classList.remove('disabled');
    } else {
        button.style.opacity = '0.3';
        button.style.pointerEvents = 'none';
        button.classList.add('disabled');
    }
}

function enableNavigationButtons(sectionId) {
    const state = navigationStates.get(sectionId);
    if (!state) return;
    
    if (state.canGoPrev) {
        state.prevButton.style.pointerEvents = 'auto';
    }
    
    if (state.canGoNext) {
        state.nextButton.style.pointerEvents = 'auto';
    }
}

function disableNavigationButtons(sectionId) {
    const state = navigationStates.get(sectionId);
    if (!state) return;
    
    state.prevButton.style.pointerEvents = 'none';
    state.nextButton.style.pointerEvents = 'none';
}

function animateButtonHover(button, isHover) {
    if (!gsapAvailable) return;
    
    const scale = isHover ? 1.1 : 1;
    const duration = NAV_BUTTON_ANIMATION_DURATION / 1000;
    
    gsap.to(button, {
        scale,
        duration,
        ease: 'power2.out'
    });
}

// ================================================
// NAVIGATION ACTIONS
// ================================================

function handlePrevClick(sectionId) {
    const state = navigationStates.get(sectionId);
    if (!state || !state.canGoPrev || !state.isActive) return;
    
    console.log(`⬅️ Previous clicked for ${sectionId}`);
    
    // Trigger scroll animation via section manager
    triggerNavigationScroll(sectionId, 'backward');
    
    // Add visual feedback
    animateButtonClick(state.prevButton);
}

function handleNextClick(sectionId) {
    const state = navigationStates.get(sectionId);
    if (!state || !state.canGoNext || !state.isActive) return;
    
    console.log(`➡️ Next clicked for ${sectionId}`);
    
    // Trigger scroll animation via section manager
    triggerNavigationScroll(sectionId, 'forward');
    
    // Add visual feedback
    animateButtonClick(state.nextButton);
}

function triggerNavigationScroll(sectionId, direction) {
    // Use the same scroll amount as a typical scroll event
    const scrollAmount = CONFIG.SCROLL_THRESHOLD;
    
    // Dispatch to section manager
    if (typeof handleProjectCardScroll === 'function') {
        handleProjectCardScroll(scrollAmount, sectionId, direction);
    } else {
        console.error('handleProjectCardScroll function not available');
    }
}

function animateButtonClick(button) {
    if (!gsapAvailable || !button) return;
    
    gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
    });
}

// ================================================
// RESPONSIVE BEHAVIOR
// ================================================

function handleUIResize() {
    const debouncedResize = debounceScrollEvents(() => {
        PROJECT_SECTIONS.forEach(sectionId => {
            positionTooltip(sectionId);
            adaptNavigationForDevice(sectionId);
        });
    }, 250);
    
    debouncedResize();
}

function adaptNavigationForDevice(sectionId) {
    const state = navigationStates.get(sectionId);
    if (!state) return;
    
    const device = isDesktop() ? 'desktop' : 'mobile';
    
    // Update button positioning classes based on device
    if (device === 'mobile') {
        // Mobile navigation positioning is handled by CSS
        state.prevButton.classList.add('mobile-nav');
        state.nextButton.classList.add('mobile-nav');
    } else {
        state.prevButton.classList.remove('mobile-nav');
        state.nextButton.classList.remove('mobile-nav');
    }
}

// ================================================
// UI STATE COORDINATION
// ================================================

function updateUIState(sectionId, cardIndex) {
    if (!validateProjectSection(sectionId)) return;
    
    // Update tooltip content
    updateTooltipContent(sectionId, cardIndex);
    
    // Update navigation button states
    const totalCards = tooltipContent[sectionId]?.length || 20;
    updateButtonStates(sectionId, cardIndex, totalCards);
}

function resetUIState(sectionId) {
    if (!validateProjectSection(sectionId)) return;
    
    // Reset tooltip
    const tooltipState = tooltipStates.get(sectionId);
    if (tooltipState) {
        tooltipState.currentCardIndex = 0;
        hideTooltipImmediate(sectionId);
        tooltipStates.set(sectionId, tooltipState);
    }
    
    // Reset navigation
    const navState = navigationStates.get(sectionId);
    if (navState) {
        navState.currentIndex = 0;
        navState.isActive = false;
        updateButtonStates(sectionId, 0, 20);
        navigationStates.set(sectionId, navState);
    }
    
    console.log(`🔄 Reset UI state for ${sectionId}`);
}

function syncUIWithAnimations(sectionId, cardIndex, animationProgress) {
    // Sync UI updates with card animations
    if (animationProgress > 0.3) { // Show UI after card is partially visible
        updateUIState(sectionId, cardIndex);
    }
}

// ================================================
// KEYBOARD NAVIGATION
// ================================================

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Only handle if a project section is active
        const activeSection = PROJECT_SECTIONS.find(sectionId => {
            const navState = navigationStates.get(sectionId);
            return navState && navState.isActive;
        });
        
        if (!activeSection) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                handlePrevClick(activeSection);
                break;
            case 'ArrowRight':
                e.preventDefault();
                handleNextClick(activeSection);
                break;
        }
    });
}

// ================================================
// INITIALIZATION
// ================================================

function initUIComponents() {
    console.log('🚀 Initializing UI Components...');
    
    try {
        // Validate dependencies
        validateGSAP();
        
        // Initialize tooltips (project sections only)
        initTooltips();
        
        // Initialize navigation
        initNavigation();
        
        // Setup keyboard navigation
        setupKeyboardNavigation();
        
        // Setup global resize handler
        window.addEventListener('resize', handleUIResize);
        
        // Setup device change listener
        document.addEventListener('deviceChanged', (e) => {
            const { device } = e.detail;
            PROJECT_SECTIONS.forEach(sectionId => {
                adaptNavigationForDevice(sectionId);
                positionTooltip(sectionId);
            });
        });
        
        console.log('✅ UI Components initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to initialize UI Components:', error);
        return false;
    }
}

// ================================================
// CLEANUP
// ================================================

function destroyUIComponents() {
    console.log('🧨 Destroying UI Components...');
    
    // Clear states
    tooltipStates.clear();
    navigationStates.clear();
    
    // Remove global event listeners
    window.removeEventListener('resize', handleUIResize);
    
    console.log('✅ UI Components destroyed');
}

// ================================================
// DEBUG UTILITIES
// ================================================

function debugUIState() {
    console.group('UI Components Debug');
    
    console.log('Tooltip States:');
    tooltipStates.forEach((state, sectionId) => {
        console.log(`${sectionId}:`, {
            visible: state.isVisible,
            cardIndex: state.currentCardIndex,
            animating: state.isAnimating
        });
    });
    
    console.log('Navigation States:');
    navigationStates.forEach((state, sectionId) => {
        console.log(`${sectionId}:`, {
            active: state.isActive,
            currentIndex: state.currentIndex,
            canGoPrev: state.canGoPrev,
            canGoNext: state.canGoNext
        });
    });
    
    console.groupEnd();
}

// ================================================
// EXPORTS
// ================================================

export {
    // Main functions
    initUIComponents,
    destroyUIComponents,
    
    // Tooltip management
    showTooltip,
    hideTooltip,
    updateTooltipContent,
    positionTooltip,
    
    // Navigation management
    showNavigation,
    hideNavigation,
    updateButtonStates,
    
    // Navigation actions
    handlePrevClick,
    handleNextClick,
    triggerNavigationScroll,
    
    // UI coordination
    updateUIState,
    resetUIState,
    syncUIWithAnimations,
    
    // Responsive
    handleUIResize,
    adaptNavigationForDevice,
    
    // State access
    tooltipStates,
    navigationStates,
    
    // Debug
    debugUIState,
    
    // Constants
    PROJECT_SECTIONS,
    TOOLTIP_FADE_DURATION,
    NAV_BUTTON_ANIMATION_DURATION
};