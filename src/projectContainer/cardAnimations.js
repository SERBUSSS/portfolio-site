// ================================================
// CARD ANIMATIONS - GSAP Animation System
// ================================================

import { cardPositions, CONFIG, isDesktop, isMobile } from './dataAndUtils.js';

// ================================================
// GSAP VALIDATION & SETUP
// ================================================

let gsapAvailable = false;

function validateGSAP() {
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP is required but not loaded. Card animations will not work.');
        return false;
    }
    
    // Test basic GSAP functionality
    try {
        gsap.set({}, { x: 0 });
        gsapAvailable = true;
        console.log('✅ GSAP validated and ready');
        return true;
    } catch (error) {
        console.error('❌ GSAP validation failed:', error);
        return false;
    }
}

// ================================================
// STATE MANAGEMENT
// ================================================

// Card animation states
const cardStates = new Map();
const animationTimelines = new Map();
const activeAnimations = new Set();

// Performance tracking
let animationFrameId = null;
let performanceMode = 'normal'; // 'normal' | 'reduced'

// Animation step constants
const ANIMATION_STEPS = {
    INITIAL: 'initial',
    TO_CENTER: 'toCenter',
    TO_FINAL: 'toFinal',
    COMPLETE: 'complete'
};

// ================================================
// POSITION MANAGEMENT
// ================================================

function getInitialPosition(sectionId) {
    if (sectionId === 'process') {
        return { ...CONFIG.INITIAL_POSITION_PROCESS };
    } else {
        return { ...CONFIG.INITIAL_POSITION_PROJECTS };
    }
}

function getCenterPosition() {
    return { ...CONFIG.CENTER_POSITION };
}

function getFinalPosition(sectionId, cardIndex, device) {
    try {
        const positions = cardPositions[sectionId];
        if (!positions) {
            console.warn(`No positions found for section: ${sectionId}`);
            return getCenterPosition(); // Fallback to center
        }
        
        const devicePositions = positions[device] || positions['desktop'] || [];
        const position = devicePositions[cardIndex];
        
        if (!position) {
            console.warn(`No position found for ${sectionId} card ${cardIndex} on ${device}`);
            return getCenterPosition(); // Fallback to center
        }
        
        return { ...position };
    } catch (error) {
        console.error(`Error getting final position:`, error);
        return getCenterPosition();
    }
}

function interpolatePosition(fromPos, toPos, progress) {
    // Clamp progress to prevent overshoot
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    return {
        x: fromPos.x + (toPos.x - fromPos.x) * clampedProgress,
        y: fromPos.y + (toPos.y - fromPos.y) * clampedProgress,
        scale: fromPos.scale + (toPos.scale - fromPos.scale) * clampedProgress,
        opacity: fromPos.opacity + (toPos.opacity - fromPos.opacity) * clampedProgress,
        rotation: fromPos.rotation + (toPos.rotation - fromPos.rotation) * clampedProgress
    };
}

// ================================================
// CARD STATE MANAGEMENT
// ================================================

function getCardId(cardElement) {
    return cardElement.id || cardElement.dataset.cardId || cardElement.dataset.index || `card-${Date.now()}-${Math.random()}`;
}

function initCardState(cardElement, sectionId, cardIndex) {
    const cardId = getCardId(cardElement);
    
    const state = {
        element: cardElement,
        sectionId,
        cardIndex,
        currentStep: ANIMATION_STEPS.INITIAL,
        progress: 0,
        isAnimating: false,
        lastUpdate: 0,
        positions: {
            initial: getInitialPosition(sectionId),
            center: getCenterPosition(),
            final: getFinalPosition(sectionId, cardIndex, isDesktop() ? 'desktop' : 'mobile')
        }
    };
    
    cardStates.set(cardId, state);
    
    // Set initial position immediately
    setCardPosition(cardElement, state.positions.initial);
    
    return cardId;
}

function getCardState(cardElement) {
    const cardId = getCardId(cardElement);
    return cardStates.get(cardId);
}

function updateCardState(cardElement, updates) {
    const cardId = getCardId(cardElement);
    const currentState = cardStates.get(cardId);
    
    if (currentState) {
        Object.assign(currentState, updates);
        currentState.lastUpdate = performance.now();
        cardStates.set(cardId, currentState);
    }
}

// ================================================
// ANIMATION CORE FUNCTIONS
// ================================================

function setCardPosition(cardElement, position) {
    if (!gsapAvailable || !cardElement) return;
    
    try {
        // Use GSAP.set for immediate positioning (no animation)
        gsap.set(cardElement, {
            x: `${position.x}vw`,
            y: `${position.y}vh`,
            scale: position.scale,
            opacity: position.opacity,
            rotation: position.rotation,
            transformOrigin: 'center center',
            force3D: true // GPU acceleration
        });
    } catch (error) {
        console.error('Error setting card position:', error);
    }
}

function animateCardToPosition(cardElement, targetPosition, duration = 0.6, ease = 'power2.out') {
    if (!gsapAvailable || !cardElement) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        try {
            gsap.to(cardElement, {
                x: `${targetPosition.x}vw`,
                y: `${targetPosition.y}vh`,
                scale: targetPosition.scale,
                opacity: targetPosition.opacity,
                rotation: targetPosition.rotation,
                duration,
                ease,
                force3D: true,
                onComplete: resolve,
                onError: reject
            });
        } catch (error) {
            console.error('Error animating card:', error);
            reject(error);
        }
    });
}

// ================================================
// TWO-STEP ANIMATION SYSTEM
// ================================================

function handleTwoStepAnimation(cardElement, totalProgress, sectionId, cardIndex) {
    if (!gsapAvailable || !cardElement) return;
    
    const state = getCardState(cardElement);
    if (!state) {
        const cardId = initCardState(cardElement, sectionId, cardIndex);
        return handleTwoStepAnimation(cardElement, totalProgress, sectionId, cardIndex);
    }
    
    // Prevent too frequent updates (60fps max)
    const now = performance.now();
    if (now - state.lastUpdate < 16 && Math.abs(totalProgress - state.progress) < 0.01) {
        return;
    }
    
    // Clamp progress
    const clampedProgress = Math.max(0, Math.min(1, totalProgress));
    
    // Determine animation step
    const step = getAnimationStep(clampedProgress);
    let currentPosition;
    
    if (clampedProgress <= 0.5) {
        // Step 1: Initial → Center (0-50% progress)
        const stepProgress = clampedProgress * 2; // Map 0-0.5 to 0-1
        currentPosition = interpolatePosition(
            state.positions.initial,
            state.positions.center,
            easeInOutCubic(stepProgress)
        );
    } else {
        // Step 2: Center → Final (50-100% progress)
        const stepProgress = (clampedProgress - 0.5) * 2; // Map 0.5-1 to 0-1
        currentPosition = interpolatePosition(
            state.positions.center,
            state.positions.final,
            easeInOutCubic(stepProgress)
        );
    }
    
    // Apply position with hardware acceleration
    setCardPosition(cardElement, currentPosition);
    
    // Update state
    updateCardState(cardElement, {
        currentStep: step,
        progress: clampedProgress
    });
}

function getAnimationStep(progress) {
    if (progress <= 0) return ANIMATION_STEPS.INITIAL;
    if (progress <= 0.5) return ANIMATION_STEPS.TO_CENTER;
    if (progress < 1) return ANIMATION_STEPS.TO_FINAL;
    return ANIMATION_STEPS.COMPLETE;
}

// ================================================
// PREVIEW SYSTEM
// ================================================

function triggerInitialPreview(sectionId, previewPercentage = null) {
    if (!gsapAvailable) return;
    
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn(`Section not found: ${sectionId}`);
        return;
    }
    
    const cards = section.querySelectorAll('.item.card, .project-card, .process-card');
    if (cards.length === 0) {
        console.warn(`No cards found in section: ${sectionId}`);
        return;
    }
    
    // Determine preview percentage
    const preview = previewPercentage || (isMobile() ? CONFIG.PREVIEW_MOBILE : CONFIG.PREVIEW_DESKTOP);
    
    // Only animate the first card for preview
    const firstCard = cards[0];
    if (firstCard) {
        console.log(`🎬 Triggering ${preview * 100}% preview for ${sectionId}`);
        
        // Delay preview to allow section setup
        setTimeout(() => {
            handleTwoStepAnimation(firstCard, preview, sectionId, 0);
            
            // Dispatch preview completion event
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('cardPreviewComplete', {
                    detail: { sectionId, previewPercentage: preview }
                }));
            }, CONFIG.ANIMATION_DURATION * 0.5);
        }, 100);
    }
}

function calculatePreviewProgress(device) {
    return device === 'mobile' ? CONFIG.PREVIEW_MOBILE : CONFIG.PREVIEW_DESKTOP;
}

// ================================================
// SECTION-SPECIFIC ANIMATIONS
// ================================================

function setInitialCardPositions(sectionId) {
    if (!gsapAvailable) return;
    
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const cards = section.querySelectorAll('.item.card, .project-card, .process-card');
    const initialPosition = getInitialPosition(sectionId);
    
    cards.forEach((card, index) => {
        initCardState(card, sectionId, index);
        setCardPosition(card, initialPosition);
    });
    
    console.log(`📍 Set initial positions for ${cards.length} cards in ${sectionId}`);
}

function resetCardPosition(cardElement) {
    if (!gsapAvailable) return;
    
    const state = getCardState(cardElement);
    if (state) {
        setCardPosition(cardElement, state.positions.initial);
        updateCardState(cardElement, {
            currentStep: ANIMATION_STEPS.INITIAL,
            progress: 0
        });
    }
}

function resetSectionCards(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const cards = section.querySelectorAll('.item.card, .project-card, .process-card');
    cards.forEach(card => resetCardPosition(card));
    
    console.log(`🔄 Reset all cards in ${sectionId}`);
}

// ================================================
// DEVICE RESPONSIVENESS
// ================================================

function updatePositionsForDevice(newDevice) {
    if (!gsapAvailable) return;
    
    console.log(`📱 Updating card positions for device: ${newDevice}`);
    
    // Update final positions for all cards
    cardStates.forEach((state, cardId) => {
        const newFinalPosition = getFinalPosition(state.sectionId, state.cardIndex, newDevice);
        state.positions.final = newFinalPosition;
        
        // If card is in final position, update immediately
        if (state.currentStep === ANIMATION_STEPS.COMPLETE) {
            setCardPosition(state.element, newFinalPosition);
        }
    });
}

// ================================================
// PERFORMANCE OPTIMIZATIONS
// ================================================

function optimizeCardForAnimation(cardElement) {
    if (!cardElement) return;
    
    // Apply GPU acceleration styles
    cardElement.style.willChange = 'transform, opacity';
    cardElement.style.backfaceVisibility = 'hidden';
    cardElement.style.perspective = '1000px';
    
    // Ensure element is properly prepared
    gsap.set(cardElement, {
        force3D: true,
        transformOrigin: 'center center'
    });
}

function enablePerformanceMode(mode) {
    performanceMode = mode;
    
    if (mode === 'reduced') {
        // Disable complex animations
        console.log('🐌 Performance mode: REDUCED');
    } else {
        console.log('🚀 Performance mode: NORMAL');
    }
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function showCard(cardElement) {
    if (!gsapAvailable) return;
    
    gsap.set(cardElement, {
        visibility: 'visible',
        display: 'block'
    });
}

function hideCard(cardElement) {
    if (!gsapAvailable) return;
    
    gsap.set(cardElement, {
        opacity: 0,
        visibility: 'hidden'
    });
}

function fadeCard(cardElement, opacity, duration = 0.3) {
    if (!gsapAvailable) return Promise.resolve();
    
    return new Promise(resolve => {
        gsap.to(cardElement, {
            opacity,
            duration,
            onComplete: resolve
        });
    });
}

// ================================================
// CARD VISIBILITY MANAGEMENT
// ================================================

function getVisibleCards() {
    const visibleCards = [];
    cardStates.forEach((state, cardId) => {
        if (state.progress > 0) {
            visibleCards.push(state);
        }
    });
    return visibleCards;
}

function optimizeVisibleCards() {
    const visibleCards = getVisibleCards();
    
    // If too many cards are visible, fade out the earliest ones
    if (visibleCards.length > CONFIG.MAX_VISIBLE_CARDS) {
        const cardsToFade = visibleCards
            .sort((a, b) => a.lastUpdate - b.lastUpdate)
            .slice(0, visibleCards.length - CONFIG.MAX_VISIBLE_CARDS);
        
        cardsToFade.forEach(state => {
            fadeCard(state.element, 0.1, 0.5);
        });
    }
}

// ================================================
// EVENT HANDLING
// ================================================

function handleCardAnimationComplete(cardElement) {
    const state = getCardState(cardElement);
    if (state) {
        updateCardState(cardElement, {
            isAnimating: false,
            currentStep: ANIMATION_STEPS.COMPLETE
        });
        
        activeAnimations.delete(getCardId(cardElement));
        
        // Optimize visibility if needed
        optimizeVisibleCards();
    }
}

// ================================================
// INITIALIZATION
// ================================================

function setupCardElements() {
    const allCards = document.querySelectorAll('.item.card, .project-card, .process-card');
    
    allCards.forEach(card => {
        optimizeCardForAnimation(card);
        
        // Add data attributes if missing
        if (!card.id && !card.dataset.cardId) {
            card.dataset.cardId = `card-${Date.now()}-${Math.random()}`;
        }
    });
    
    console.log(`🎨 Optimized ${allCards.length} cards for animation`);
}

function initCardAnimations() {
    console.log('🚀 Initializing Card Animations...');
    
    if (!validateGSAP()) {
        return false;
    }
    
    try {
        setupCardElements();
        
        // Listen for device changes
        window.addEventListener('resize', debounceDeviceChange);
        
        // Listen for visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        console.log('✅ Card Animations initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to initialize Card Animations:', error);
        return false;
    }
}

// ================================================
// EVENT HANDLERS
// ================================================

let currentDevice = isDesktop() ? 'desktop' : 'mobile';

function debounceDeviceChange() {
    clearTimeout(debounceDeviceChange.timeout);
    debounceDeviceChange.timeout = setTimeout(() => {
        const newDevice = isDesktop() ? 'desktop' : 'mobile';
        if (newDevice !== currentDevice) {
            currentDevice = newDevice;
            updatePositionsForDevice(newDevice);
        }
    }, 250);
}

function handleVisibilityChange() {
    if (document.hidden) {
        // Pause animations when tab is hidden
        enablePerformanceMode('reduced');
    } else {
        // Resume normal animations
        enablePerformanceMode('normal');
    }
}

// ================================================
// CLEANUP
// ================================================

function destroyCardAnimations() {
    console.log('🧨 Destroying Card Animations...');
    
    // Clear all timelines
    animationTimelines.forEach(timeline => {
        if (timeline.kill) timeline.kill();
    });
    animationTimelines.clear();
    
    // Clear states
    cardStates.clear();
    activeAnimations.clear();
    
    // Remove event listeners
    window.removeEventListener('resize', debounceDeviceChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    
    // Cancel animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    console.log('✅ Card Animations destroyed');
}

// ================================================
// DEBUG UTILITIES
// ================================================

function debugCardStates() {
    console.table(Array.from(cardStates.entries()).map(([id, state]) => ({
        id,
        section: state.sectionId,
        index: state.cardIndex,
        step: state.currentStep,
        progress: Math.round(state.progress * 100) + '%'
    })));
}

function debugAnimationPerformance() {
    console.log({
        activeAnimations: activeAnimations.size,
        cardStates: cardStates.size,
        performanceMode,
        gsapAvailable
    });
}

// ================================================
// EXPORTS
// ================================================

export {
    // Main functions
    initCardAnimations,
    destroyCardAnimations,
    
    // Animation core
    handleTwoStepAnimation,
    triggerInitialPreview,
    setInitialCardPositions,
    resetCardPosition,
    resetSectionCards,
    
    // Position management
    getInitialPosition,
    getCenterPosition,
    getFinalPosition,
    interpolatePosition,
    
    // Card management
    showCard,
    hideCard,
    fadeCard,
    optimizeCardForAnimation,
    
    // State access
    getCardState,
    updateCardState,
    cardStates,
    
    // Device handling
    updatePositionsForDevice,
    
    // Performance
    enablePerformanceMode,
    optimizeVisibleCards,
    
    // Debug
    debugCardStates,
    debugAnimationPerformance,
    
    // Utilities
    easeInOutCubic,
    ANIMATION_STEPS
};