// ================================================
// CARD ANIMATIONS - GSAP Animation System
// ================================================

import { cardPositions, CONFIG, getPositionData, calculateScrollProgress, isDesktop, isMobile } from './dataAndUtils.js';

// ================================================
// GSAP SETUP
// ================================================

// Ensure GSAP is loaded
if (typeof gsap === 'undefined') {
    console.error('GSAP is required for card animations');
}

// Animation timelines storage
const animationTimelines = {};
const cardStates = {};

// ================================================
// CORE ANIMATION SYSTEM
// ================================================

function initCardAnimations() {
    // Initialize GSAP and card animation system
}

function animateCard(cardElement, fromPos, toPos, progress) {
    // Animate card from one position to another with progress
}

function animateToCenter(cardElement, progress) {
    // Animate card from initial position to center
}

function animateToFinal(cardElement, progress) {
    // Animate card from center to final position
}

function animateToInitial(cardElement, progress) {
    // Animate card from final position back to initial
}

// ================================================
// ANIMATION STATES
// ================================================

function setInitialCardPositions(sectionId) {
    // Set all cards to their initial positions
}

function resetCardPosition(cardElement) {
    // Reset card to initial position
}

function getCardCurrentState(cardElement) {
    // Get current animation state of card
}

function setCardState(cardElement, state) {
    // Set card animation state
}

// ================================================
// PROGRESS CALCULATION
// ================================================

function calculateAnimationProgress(scrollAmount, cardIndex, maxScroll) {
    // Calculate animation progress based on scroll
}

function getAnimationStep(progress) {
    // Determine which animation step based on progress
    // Returns: 'initial', 'toCenter', 'toFinal', 'complete'
}

function handleTwoStepAnimation(cardElement, totalProgress) {
    // Handle the 2-step animation system
    // Step 1: initial → center (0-50% progress)
    // Step 2: center → final (50-100% progress)
}

function mapProgressToAnimationStep(progress, step) {
    // Map total progress to specific animation step progress
}

// ================================================
// PREVIEW ANIMATIONS
// ================================================

function triggerInitialPreview(sectionId, previewPercentage) {
    // Trigger initial card preview (15% mobile, 30% desktop)
}

function handlePreviewCompletion(sectionId) {
    // Handle when preview animation completes
}

function calculatePreviewProgress(device) {
    // Calculate preview progress based on device
    // Mobile: 15%, Desktop: 30%
}

// ================================================
// POSITION MANAGEMENT
// ================================================

function getInitialPosition(sectionId) {
    // Get initial position for cards
    // Projects: right outside viewport
    // Process: below screen outside viewport
}

function getCenterPosition() {
    // Get center screen position (50vw, 50vh)
}

function getFinalPosition(sectionId, cardIndex, device) {
    // Get final position for specific card
}

function interpolatePosition(fromPos, toPos, progress) {
    // Interpolate between two positions
}

// ================================================
// ANIMATION UTILITIES
// ================================================

function createCardTimeline(cardElement) {
    // Create GSAP timeline for card
}

function updateCardTransform(cardElement, position) {
    // Update card transform properties
}

function animateCardProperty(cardElement, property, fromValue, toValue, progress) {
    // Animate specific card property
}

function easeInOutCubic(t) {
    // Custom easing function
}

// ================================================
// CARD VISIBILITY MANAGEMENT
// ================================================

function showCard(cardElement) {
    // Show card (opacity and visibility)
}

function hideCard(cardElement) {
    // Hide card
}

function fadeCard(cardElement, opacity, duration) {
    // Fade card to specific opacity
}

// ================================================
// PERFORMANCE OPTIMIZATIONS
// ================================================

function optimizeCardAnimation(cardElement) {
    // Optimize card for animation (GPU acceleration)
}

function enableHardwareAcceleration(cardElement) {
    // Enable GPU acceleration for card
}

function pauseInactiveAnimations() {
    // Pause animations for inactive cards
}

function resumeActiveAnimations() {
    // Resume animations for active cards
}

// ================================================
// PROJECT SECTION ANIMATIONS
// ================================================

function animateProjectCard(cardElement, scrollProgress, cardIndex, sectionId) {
    // Animate project section card (horizontal scroll based)
}

function handleProjectCardProgression(sectionId, direction) {
    // Handle card progression in project sections
}

function getProjectAnimationProgress(scrollDelta, cardIndex, totalCards) {
    // Calculate animation progress for project cards
}

// ================================================
// PROCESS SECTION ANIMATIONS
// ================================================

function animateProcessCard(cardElement, scrollProgress, cardIndex) {
    // Animate process section card (vertical scroll based)
}

function handleProcessCardProgression(direction) {
    // Handle card progression in process section
}

function getProcessAnimationProgress(scrollDelta, cardIndex, totalCards) {
    // Calculate animation progress for process cards
}

// ================================================
// ANIMATION COORDINATION
// ================================================

function startCardAnimation(cardElement, animationType, progress) {
    // Start specific animation for card
}

function stopCardAnimation(cardElement) {
    // Stop all animations for card
}

function syncCardAnimations(sectionId) {
    // Synchronize multiple card animations
}

function handleAnimationComplete(cardElement, animationType) {
    // Handle animation completion
}

// ================================================
// EVENT HANDLERS
// ================================================

function onCardAnimationStart(cardElement) {
    // Handle animation start event
}

function onCardAnimationComplete(cardElement) {
    // Handle animation complete event
}

function onCardAnimationUpdate(cardElement, progress) {
    // Handle animation update event
}

// ================================================
// INITIALIZATION
// ================================================

function setupCardElements() {
    // Set up card elements for animation
    const allCards = document.querySelectorAll('.item.card');
    allCards.forEach(card => {
        // Initialize card state
        cardStates[card.id || card.dataset.cardId] = {
            currentPosition: null,
            animationState: 'initial',
            timeline: null,
            isVisible: false
        };
        
        // Optimize for animation
        optimizeCardAnimation(card);
    });
}

function initAnimationTimelines() {
    // Initialize GSAP timelines for all sections
    const sections = document.querySelectorAll('.project-section');
    sections.forEach(section => {
        animationTimelines[section.id] = gsap.timeline({ paused: true });
    });
}

// ================================================
// MAIN INITIALIZATION
// ================================================

function initCardAnimations() {
    // Main initialization function
    
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded - card animations will not work');
        return;
    }
    
    setupCardElements();
    initAnimationTimelines();
    
    console.log('Card Animations initialized');
}

// ================================================
// EXPORTS
// ================================================

export {
    initCardAnimations,
    animateCard,
    animateToCenter,
    animateToFinal,
    animateToInitial,
    setInitialCardPositions,
    resetCardPosition,
    getCardCurrentState,
    calculateAnimationProgress,
    getAnimationStep,
    handleTwoStepAnimation,
    triggerInitialPreview,
    handlePreviewCompletion,
    animateProjectCard,
    animateProcessCard,
    handleProjectCardProgression,
    handleProcessCardProgression,
    showCard,
    hideCard,
    fadeCard,
    cardStates,
    animationTimelines
};