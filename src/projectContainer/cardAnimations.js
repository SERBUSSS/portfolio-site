// ================================================
// CARD ANIMATIONS - TIMELINE-BASED GSAP SYSTEM
// ================================================

import { cardPositions, CONFIG, isDesktop, isMobile, getFinalPositions } from './dataAndUtils.js';

// ================================================
// GLOBAL VARIABLES
// ================================================

let gsapAvailable = false;
let activeTimelines = new Map(); // Store timelines per section
let currentSection = null;

// ================================================
// GSAP VALIDATION & SETUP
// ================================================

function validateGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('❌ GSAP and ScrollTrigger are required but not loaded.');
        return false;
    }
    
    try {
        gsap.registerPlugin(ScrollTrigger);
        gsapAvailable = true;
        console.log('✅ GSAP validated and ready');
        return true;
    } catch (error) {
        console.error('❌ GSAP validation failed:', error);
        return false;
    }
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

function getCardsForSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn(`Section not found: ${sectionId}`);
        return [];
    }
    
    return Array.from(section.querySelectorAll('.item.card, .project-card, .process-card'));
}

function getFinalPositionsForSection(sectionId) {
    // getFinalPositions already returns the correct device array
    const positions = getFinalPositions(sectionId);
    
    if (positions && Array.isArray(positions) && positions.length > 0) {
        return positions;
    }
    
    // Fallback positions if no data exists
    console.warn(`No positions found for ${sectionId}, using fallback`);
    return Array.from({ length: 20 }, (_, i) => ({
        x: 20 + (i % 5) * 15,
        y: 20 + Math.floor(i / 5) * 20,
        scale: 0.8,
        opacity: 1,
        rotation: 0
    }));
}

// ================================================
// INITIAL CARD POSITIONING
// ================================================

function setInitialCardPositions(sectionId) {
    const cards = getCardsForSection(sectionId);
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    cards.forEach((card) => {
        if (sectionId === 'process') {
            // Process cards start below viewport
            gsap.set(card, {
                x: 50 * vw,
                y: 120 * vh,
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
                x: 120 * vw,
                y: 50 * vh,
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
// TIMELINE CREATION - HORIZONTAL (PROJECT SECTIONS)
// ================================================

function createHorizontalTimeline(sectionId) {
    const cards = getCardsForSection(sectionId);
    if (cards.length === 0) return null;
    
    const finalPositions = getFinalPositionsForSection(sectionId);
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    // Create main timeline with precise timing
    const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" }
    });
    
    // Each card gets exactly 2 seconds: 1 for center, 1 for final
    cards.forEach((card, index) => {
        const startTime = index / totalCards;
        const duration = 1 / totalCards;
        
        // Step 1: Initial to center (first half of card's duration)
        timeline.fromTo(card,
            {
                x: initialPos.x,
                y: initialPos.y,
                scale: initialPos.scale || 0.8,
                opacity: 0,
                rotation: initialPos.rotation || 0
            },
            {
                x: centerPos.x,
                y: centerPos.y,
                scale: centerPos.scale || 1,
                opacity: 1,
                rotation: centerPos.rotation || 0,
                duration: duration * 0.5,
                ease: "power2.inOut"
            },
            startTime
        );
        
        // Step 2: Center to final (second half of card's duration)
        timeline.to(card,
            {
                x: finalPos.x,
                y: finalPos.y,
                scale: finalPos.scale || 1,
                opacity: finalPos.opacity || 1,
                rotation: finalPos.rotation || 0,
                duration: duration * 0.5,
                ease: "power2.inOut"
            },
            startTime + (duration * 0.5)
        );
    });
    
    console.log(`🎬 Timeline created: ${cards.length} cards, duration: ${tl.duration()}s`);
    return tl;
}

// ================================================
// TIMELINE CREATION - VERTICAL (PROCESS SECTION)
// ================================================

function createVerticalTimeline(sectionId) {
    const cards = getCardsForSection(sectionId);
    if (cards.length === 0) return null;
    
    const finalPositions = getFinalPositionsForSection(sectionId);
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    
    // Create main timeline
    const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.inOut" }
    });
    
    // Animate each card sequentially
    cards.forEach((card, index) => {
        const finalPos = finalPositions[index] || finalPositions[0];
        
        // Step 1: Move card from bottom to center
        tl.to(card, {
            x: 50 * vw,
            y: 50 * vh,
            xPercent: -50,
            yPercent: -50,
            opacity: 1,
            duration: 1,
            ease: "power2.inOut"
        }, index * 2);
        
        // Step 2: Move card from center to final position
        tl.to(card, {
            x: finalPos.x * vw,
            y: finalPos.y * vh,
            xPercent: -50,
            yPercent: -50,
            scale: finalPos.scale || 1,
            opacity: finalPos.opacity || 1,
            rotation: finalPos.rotation || 0,
            duration: 1,
            ease: "power2.inOut"
        }, index * 2 + 1);
    });
    
    return tl;
}

// ================================================
// TIMELINE MANAGEMENT
// ================================================

function initializeTimelineForSection(sectionId) {
    // Clean up existing timeline
    if (activeTimelines.has(sectionId)) {
        activeTimelines.get(sectionId).kill();
        activeTimelines.delete(sectionId);
    }
    
    // Set initial positions
    setInitialCardPositions(sectionId);
    
    // Create new timeline
    let timeline;
    if (sectionId === 'process') {
        timeline = createVerticalTimeline(sectionId);
    } else if (sectionId.startsWith('project-')) {
        timeline = createHorizontalTimeline(sectionId);
    }
    
    if (timeline) {
        activeTimelines.set(sectionId, timeline);
        console.log(`🎬 Created timeline for ${sectionId} with duration: ${timeline.duration()}`);
    }
    
    return timeline;
}

// ================================================
// PROGRESS UPDATE - THE KEY FUNCTION
// ================================================

function updateCardAnimation(sectionId, progress) {
    if (!gsapAvailable) return;
    
    const timeline = activeTimelines.get(sectionId);
    if (!timeline) {
        timeline = initializeTimelineForSection(sectionId);
        if (!timeline) return;
    }
    
    // Instead of seeking directly, use progress() for smooth animation
    timeline.progress(progress);
    
    console.log(`🎯 Updated ${sectionId} to progress: ${(progress * 100).toFixed(1)}%`);
}

// ================================================
// SECTION ACTIVATION/DEACTIVATION
// ================================================

function activateSection(sectionId) {
    if (currentSection === sectionId) return;
    
    console.log(`🎯 Activating section: ${sectionId}`);
    
    // Deactivate previous section
    if (currentSection && activeTimelines.has(currentSection)) {
        const prevTimeline = activeTimelines.get(currentSection);
        // Optional: animate out or reset previous section
    }
    
    currentSection = sectionId;
    
    // Initialize timeline for new section
    if (!activeTimelines.has(sectionId)) {
        initializeTimelineForSection(sectionId);
    }
    
    // Trigger initial preview (15% or 30% progress)
    const previewProgress = isMobile() ? 0.15 : 0.30;
    setTimeout(() => {
        updateCardAnimation(sectionId, previewProgress);
    }, 300);
}

function deactivateSection(sectionId) {
    console.log(`🛑 Deactivating section: ${sectionId}`);
    
    const timeline = activeTimelines.get(sectionId);
    if (timeline) {
        // Reset to beginning
        timeline.seek(0);
    }
    
    if (currentSection === sectionId) {
        currentSection = null;
    }
}

// ================================================
// EVENT HANDLERS
// ================================================

function handleSectionChange(event) {
    const { sectionId, isActive } = event.detail;
    
    if (isActive) {
        activateSection(sectionId);
    } else {
        deactivateSection(sectionId);
    }
}

function handleProgressUpdate(event) {
    const { sectionId, progress } = event.detail;
    updateCardAnimation(sectionId, progress);
}

// ================================================
// RESIZE HANDLER
// ================================================

function handleResize() {
    console.log('📱 Handling resize - recreating timelines');
    
    // Recreate all active timelines with new dimensions
    const activeSections = Array.from(activeTimelines.keys());
    activeSections.forEach(sectionId => {
        initializeTimelineForSection(sectionId);
    });
}

// ================================================
// INITIALIZATION
// ================================================

function initCardAnimations() {
    console.log('🚀 Initializing Timeline-Based Card Animations...');
    
    if (!validateGSAP()) {
        return false;
    }
    
    try {
        // Set up event listeners
        document.addEventListener('sectionChange', handleSectionChange);
        document.addEventListener('updateCardAnimation', handleProgressUpdate);
        window.addEventListener('resize', handleResize);
        
        // Optimize all cards for animation
        const allCards = document.querySelectorAll('.item.card, .project-card, .process-card');
        allCards.forEach(card => {
            card.style.willChange = 'transform, opacity';
            card.style.backfaceVisibility = 'hidden';
            card.style.perspective = '1000px';
        });
        
        console.log(`🎨 Optimized ${allCards.length} cards for animation`);
        console.log('✅ Timeline-Based Card Animations initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to initialize Card Animations:', error);
        return false;
    }
}

// ================================================
// CLEANUP
// ================================================

function cleanupCardAnimations() {
    // Kill all active timelines
    activeTimelines.forEach(timeline => timeline.kill());
    activeTimelines.clear();
    
    // Remove event listeners
    document.removeEventListener('sectionChange', handleSectionChange);
    document.removeEventListener('updateCardAnimation', handleProgressUpdate);
    window.removeEventListener('resize', handleResize);
    
    console.log('🧹 Card animations cleaned up');
}

function triggerInitialPreview(sectionId, percentage) {
    const progress = percentage / 100;
    updateCardAnimation(sectionId, progress);
}

// ================================================
// EXPORTS
// ================================================

export {
    initCardAnimations,
    cleanupCardAnimations,
    updateCardAnimation,
    activateSection,
    deactivateSection,
    setInitialCardPositions,
    getCardsForSection,
    triggerInitialPreview,
    activeTimelines
};