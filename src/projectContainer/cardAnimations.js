// ================================================
// CARD ANIMATIONS - GSAP Animation System (UPDATED)
// ================================================

import { cardPositions, CONFIG, isDesktop, isMobile, getFinalPositions } from './dataAndUtils.js';

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
// CARD MANAGEMENT
// ================================================

function getCardsForSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn(`Section not found: ${sectionId}`);
        return [];
    }
    
    const cards = Array.from(section.querySelectorAll('.item.card, .project-card, .process-card'));
    return cards;
}

// ================================================
// CARD VISIBILITY OPACITY
// ================================================

function getCardVisibilityOpacity(cardIndex, totalProgress, totalCards) {
    const MAX_VISIBLE = 10;
    const progressPerCard = 0.9 / totalCards;
    const currentCard = Math.floor(totalProgress / progressPerCard);
    
    // Calculate how many cards are currently visible
    const visibleCount = currentCard + 1;
    
    if (visibleCount <= MAX_VISIBLE) {
        return 1; // All cards visible if under limit
    }
    
    // Start fading earlier cards when we exceed MAX_VISIBLE
    const firstVisibleCard = visibleCount - MAX_VISIBLE;
    
    if (cardIndex < firstVisibleCard) {
        return 0; // Completely hidden
    } else if (cardIndex === firstVisibleCard) {
        // Fade out the oldest visible card
        return 0.3;
    }
    
    return 1; // Fully visible
}

// ================================================
// MAIN ANIMATION FUNCTION
// ================================================

function updateCardAnimation(sectionId, progress) {
    if (!gsapAvailable) return;
    
    const cards = getCardsForSection(sectionId);
    if (cards.length === 0) return;
    
    // Determine if this is a project section or process section
    if (sectionId === 'process') {
        updateVerticalAnimation(sectionId, progress, cards);
    } else if (sectionId.startsWith('project-')) {
        updateHorizontalAnimation(sectionId, progress, cards);
    }
}

// ================================================
// HORIZONTAL ANIMATION (PROJECT SECTIONS)
// ================================================

function updateHorizontalAnimation(sectionId, progress, cards) {
    console.log(`🎬 Horizontal animation: ${sectionId}, progress: ${progress.toFixed(2)}`);
    
    const totalCards = cards.length;
    const progressPerCard = 0.9 / totalCards; // 90% for all cards, 10% buffer
    
    // Get viewport dimensions
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    cards.forEach((card, index) => {
        const cardStartProgress = index * progressPerCard;
        const cardEndProgress = (index + 1) * progressPerCard;
        const isLastCard = index === cards.length - 1;
        
        if (progress >= cardStartProgress) {
            // Calculate this card's individual progress (0-1)
            const cardProgress = Math.min(1, (progress - cardStartProgress) / progressPerCard);
            
            if (cardProgress <= 0.6) {
                // Step 1: Slide in from right to center (0-60% of card progress)
                const slideProgress = cardProgress / 0.6;
                const startX = 110 * vw; // Start off-screen right
                const centerX = 50 * vw; // Center of screen
                const currentX = startX + (centerX - startX) * slideProgress;
                
                const visibilityOpacity = getCardVisibilityOpacity(index, progress, totalCards);
                
                gsap.set(card, {
                    x: currentX,
                    y: 45 * vh, // Slightly above center
                    xPercent: -50,
                    yPercent: -50,
                    scale: 1,
                    opacity: slideProgress * visibilityOpacity,
                    rotation: 0,
                    force3D: true
                });
            } else {
                // Step 2: Move from center to final position (60-100% of card progress)
                const finalProgress = (cardProgress - 0.6) / 0.4;
                
                // Get final positions
                const projectFinalPositions = getFinalPositions(sectionId);
                let finalPos;
                
                if (isLastCard) {
                    // Last card goes back to center
                    finalPos = { x: 50, y: 50, rotation: 0, scale: 0.8, opacity: 1 };
                } else {
                    finalPos = projectFinalPositions[index % projectFinalPositions.length];
                }
                
                // Interpolate from center to final position
                const centerX = 50 * vw;
                const centerY = 45 * vh;
                const finalX = parseFloat(finalPos.x) * vw;
                const finalY = parseFloat(finalPos.y) * vh;
                
                const currentX = centerX + (finalX - centerX) * finalProgress;
                const currentY = centerY + (finalY - centerY) * finalProgress;
                const currentScale = 1 + (finalPos.scale - 1) * finalProgress;
                const currentRotation = 0 + (finalPos.rotation - 0) * finalProgress;
                
                const visibilityOpacity = getCardVisibilityOpacity(index, progress, totalCards);
                
                gsap.set(card, {
                    x: currentX,
                    y: currentY,
                    xPercent: -50,
                    yPercent: -50,
                    scale: currentScale,
                    opacity: finalPos.opacity * visibilityOpacity,
                    rotation: currentRotation,
                    force3D: true
                });
            }
        } else {
            // Card hasn't started animating yet - keep it off-screen
            gsap.set(card, {
                x: 110 * vw,
                y: 45 * vh,
                xPercent: -50,
                yPercent: -50,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true
            });
        }
    });
}

// ================================================
// VERTICAL ANIMATION (PROCESS SECTION)
// ================================================

function updateVerticalAnimation(sectionId, progress, cards) {
    console.log(`🎬 Vertical animation: ${sectionId}, progress: ${progress.toFixed(2)}`);
    
    const totalCards = cards.length;
    const progressPerCard = 0.9 / totalCards;
    
    // Get viewport dimensions
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    cards.forEach((card, index) => {
        const cardStartProgress = index * progressPerCard;
        
        if (progress >= cardStartProgress) {
            const cardProgress = Math.min(1, (progress - cardStartProgress) / progressPerCard);
            
            if (cardProgress <= 0.5) {
                // Step 1: Slide up from bottom to center
                const slideProgress = cardProgress / 0.5;
                const startY = 110 * vh; // Start below viewport
                const centerY = 50 * vh;
                const currentY = startY + (centerY - startY) * slideProgress;
                
                gsap.set(card, {
                    x: 50 * vw,
                    y: currentY,
                    xPercent: -50,
                    yPercent: -50,
                    scale: 1,
                    opacity: slideProgress,
                    rotation: 0,
                    force3D: true
                });
            } else {
                // Step 2: Move from center to final position
                const finalProgress = (cardProgress - 0.5) / 0.5;
                
                // Get final positions for process cards
                const processFinalPositions = getFinalPositions('process');
                const finalPos = processFinalPositions[index % processFinalPositions.length];
                
                const centerX = 50 * vw;
                const centerY = 50 * vh;
                const finalX = parseFloat(finalPos.x) * vw;
                const finalY = parseFloat(finalPos.y) * vh;
                
                const currentX = centerX + (finalX - centerX) * finalProgress;
                const currentY = centerY + (finalY - centerY) * finalProgress;
                const currentScale = 1 + (finalPos.scale - 1) * finalProgress;
                const currentRotation = 0 + (finalPos.rotation - 0) * finalProgress;
                
                gsap.set(card, {
                    x: currentX,
                    y: currentY,
                    xPercent: -50,
                    yPercent: -50,
                    scale: currentScale,
                    opacity: finalPos.opacity,
                    rotation: currentRotation,
                    force3D: true
                });
            }
        } else {
            // Card hasn't started animating yet
            gsap.set(card, {
                x: 50 * vw,
                y: 110 * vh,
                xPercent: -50,
                yPercent: -50,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true
            });
        }
    });
}

// ================================================
// PREVIEW SYSTEM
// ================================================

function triggerInitialPreview(sectionId, previewPercentage = null) {
    if (!gsapAvailable) return;
    
    const cards = getCardsForSection(sectionId);
    if (cards.length === 0) return;
    
    // Determine preview percentage
    const preview = previewPercentage || (isMobile() ? CONFIG.PREVIEW_MOBILE : CONFIG.PREVIEW_DESKTOP);
    
    console.log(`🎬 Triggering ${preview * 100}% preview for ${sectionId}`);
    
    // Animate with preview progress
    setTimeout(() => {
        updateCardAnimation(sectionId, preview);
    }, 100);
}

// ================================================
// INITIAL POSITIONING
// ================================================

function setInitialCardPositions(sectionId) {
    if (!gsapAvailable) return;
    
    const cards = getCardsForSection(sectionId);
    if (cards.length === 0) return;
    
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    cards.forEach((card) => {
        if (sectionId === 'process') {
            // Process cards start below viewport
            gsap.set(card, {
                x: 50 * vw,
                y: 110 * vh,
                xPercent: -50,
                yPercent: -50,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true
            });
        } else {
            // Project cards start to the right
            gsap.set(card, {
                x: 110 * vw,
                y: 45 * vh,
                xPercent: -50,
                yPercent: -50,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true
            });
        }
    });
    
    console.log(`📍 Set initial positions for ${cards.length} cards in ${sectionId}`);
}

// ================================================
// INITIALIZATION
// ================================================

function initCardAnimations() {
    console.log('🚀 Initializing Card Animations...');
    
    if (!validateGSAP()) {
        return false;
    }
    
    try {
        // Set up event listener for scroll updates
        document.addEventListener('updateCardAnimation', (event) => {
            const { sectionId, progress } = event.detail;
            updateCardAnimation(sectionId, progress);
        });
        
        // Optimize all cards
        const allCards = document.querySelectorAll('.item.card, .project-card, .process-card');
        allCards.forEach(card => {
            card.style.willChange = 'transform, opacity';
            card.style.backfaceVisibility = 'hidden';
            card.style.perspective = '1000px';
        });
        
        console.log(`🎨 Optimized ${allCards.length} cards for animation`);
        console.log('✅ Card Animations initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to initialize Card Animations:', error);
        return false;
    }
}

// ================================================
// EXPORTS
// ================================================

export {
    initCardAnimations,
    updateCardAnimation,
    updateHorizontalAnimation,
    updateVerticalAnimation,
    triggerInitialPreview,
    setInitialCardPositions,
    getCardsForSection,
    getCardVisibilityOpacity
};