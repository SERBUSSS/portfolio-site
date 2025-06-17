// ================================================
// SECTION MANAGERS - Project & Process Sections
// ================================================

import { setInitialCardPositions } from './cardAnimations.js'
import { updateTooltipContent, positionTooltip, updateButtonStates } from './uiComponents.js';
import { CONFIG, calculateScrollProgress, isDesktop, isMobile, debounceScrollEvents } from './dataAndUtils.js';

// ================================================
// SECTION STATE MANAGEMENT
// ================================================

const VALID_PROJECT_SECTIONS = ['project-1', 'project-2', 'project-3', 'project-4'];
const CARDS_PER_PROJECT = 20;
const CARDS_PER_PROCESS = 4;

const projectSectionStates = {};
let processSectionState = {
    isActive: false,
    currentCardIndex: 0,
    scrollProgress: 0,
    isScrollLocked: false,
    cards: [],
    eventListeners: new Map()
};

// Zone tracking for desktop
let currentActiveZone = null; // 'left' | 'right' | null
let zoneElements = new Map();
let zoneEventListeners = new Map();

// Touch state for mobile
let touchState = {
    startX: 0,
    startY: 0,
    isDragging: false,
    currentSection: null,
    lastTouchTime: 0,
    touchDirection: null // 'horizontal' | 'vertical' | null
};

// ================================================
// VALIDATION & UTILITIES
// ================================================

function validateProjectSectionId(sectionId) {
    return VALID_PROJECT_SECTIONS.includes(sectionId);
}

function getSectionCards(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return [];
    
    if (sectionId === 'process') {
        return section.querySelectorAll('.process-card, .item.card');
    } else {
        return section.querySelectorAll('.project-card, .item.card');
    }
}

function calculateCardProgress(cardIndex, totalCards, scrollProgress) {
    // Each card gets 1/totalCards of the total scroll range
    const cardScrollRange = 1 / totalCards;
    const cardStartProgress = cardIndex * cardScrollRange;
    const cardEndProgress = (cardIndex + 1) * cardScrollRange;
    
    if (scrollProgress < cardStartProgress) return 0;
    if (scrollProgress > cardEndProgress) return 1;
    
    return (scrollProgress - cardStartProgress) / cardScrollRange;
}

// ================================================
// PROJECT SECTION MANAGEMENT
// ================================================

function initProjectSections() {
    VALID_PROJECT_SECTIONS.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) {
            console.warn(`Project section not found: ${sectionId}`);
            return;
        }
        
        const cards = getSectionCards(sectionId);
        projectSectionStates[sectionId] = {
            isActive: false,
            currentCardIndex: 0,
            scrollProgress: 0,
            maxScroll: CARDS_PER_PROJECT * 100, // Each card = 100 scroll units
            cards: Array.from(cards),
            eventListeners: new Map(),
            currentZone: null
        };
        
        console.log(`✅ Initialized project section: ${sectionId} (${cards.length} cards)`);
    });
}

function activateProjectSection(sectionId) {
    if (!validateProjectSectionId(sectionId)) {
        console.error(`Invalid project section: ${sectionId}`);
        return false;
    }
    
    const state = projectSectionStates[sectionId];
    if (state.isActive) return true;
    
    try {
        state.isActive = true;
        
        // Setup based on device
        if (isDesktop()) {
            createProjectScrollZones(sectionId);
        } else {
            enableMobileProjectScroll(sectionId);
        }
        
        console.log(`🎬 Activated project section: ${sectionId}`);
        
        // Dispatch activation event
        document.dispatchEvent(new CustomEvent('sectionActivated', {
            detail: { sectionId, type: 'project' }
        }));
        
        return true;
        
    } catch (error) {
        console.error(`Failed to activate project section ${sectionId}:`, error);
        state.isActive = false;
        return false;
    }
}

function deactivateProjectSection(sectionId) {
    if (!validateProjectSectionId(sectionId)) return;
    
    const state = projectSectionStates[sectionId];
    if (!state.isActive) return;
    
    try {
        state.isActive = false;
        
        // Cleanup based on device
        if (isDesktop()) {
            cleanupProjectScrollZones(sectionId);
        } else {
            disableMobileProjectScroll(sectionId);
        }
        
        // Reset scroll progress
        state.scrollProgress = 0;
        state.currentCardIndex = 0;
        
        console.log(`🛑 Deactivated project section: ${sectionId}`);
        
        // Dispatch deactivation event
        document.dispatchEvent(new CustomEvent('sectionDeactivated', {
            detail: { sectionId, type: 'project' }
        }));
        
    } catch (error) {
        console.error(`Failed to deactivate project section ${sectionId}:`, error);
    }
}

// ================================================
// DESKTOP SCROLL ZONES (50/50 split)
// ================================================

function createProjectScrollZones(sectionId) {
    if (!validateProjectSectionId(sectionId)) return;
    
    // Remove existing zones
    cleanupProjectScrollZones(sectionId);
    
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    try {
        // Create zones container
        const zonesContainer = document.createElement('div');
        zonesContainer.className = 'scroll-zones-container';
        zonesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 5;
        `;
        
        // Create left zone (vertical scroll)
        const leftZone = document.createElement('div');
        leftZone.className = 'scroll-zone scroll-zone-left';
        leftZone.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 50vw;
            height: 100vh;
            pointer-events: auto;
            cursor: ns-resize;
        `;
        
        // Create right zone (horizontal scroll)
        const rightZone = document.createElement('div');
        rightZone.className = 'scroll-zone scroll-zone-right';
        rightZone.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: 50vw;
            height: 100vh;
            pointer-events: auto;
            cursor: ew-resize;
        `;
        
        zonesContainer.appendChild(leftZone);
        zonesContainer.appendChild(rightZone);
        document.body.appendChild(zonesContainer);
        
        // Store zone references
        zoneElements.set(sectionId, {
            container: zonesContainer,
            leftZone,
            rightZone
        });
        
        // Setup zone event handlers
        setupZoneEventHandlers(sectionId, leftZone, rightZone);
        
        console.log(`🎯 Created scroll zones for: ${sectionId}`);
        
    } catch (error) {
        console.error(`Failed to create scroll zones for ${sectionId}:`, error);
    }
}

function setupZoneEventHandlers(sectionId, leftZone, rightZone) {
    const handlers = new Map();
    
    // Left zone handlers (vertical container scroll)
    const leftEnterHandler = () => activateLeftZone(sectionId);
    const leftLeaveHandler = () => deactivateZone(sectionId);
    const leftScrollHandler = debounceScrollEvents((e) => handleVerticalZoneScroll(e, sectionId), 16);
    
    leftZone.addEventListener('mouseenter', leftEnterHandler);
    leftZone.addEventListener('mouseleave', leftLeaveHandler);
    leftZone.addEventListener('wheel', leftScrollHandler, { passive: false });
    
    handlers.set('leftEnter', leftEnterHandler);
    handlers.set('leftLeave', leftLeaveHandler);
    handlers.set('leftScroll', leftScrollHandler);
    
    // Right zone handlers (horizontal card scroll)
    const rightEnterHandler = () => activateRightZone(sectionId);
    const rightLeaveHandler = () => deactivateZone(sectionId);
    const rightScrollHandler = debounceScrollEvents((e) => handleHorizontalZoneScroll(e, sectionId), 16);
    
    rightZone.addEventListener('mouseenter', rightEnterHandler);
    rightZone.addEventListener('mouseleave', rightLeaveHandler);
    rightZone.addEventListener('wheel', rightScrollHandler, { passive: false });
    
    handlers.set('rightEnter', rightEnterHandler);
    handlers.set('rightLeave', rightLeaveHandler);
    handlers.set('rightScroll', rightScrollHandler);
    
    // Store handlers for cleanup
    zoneEventListeners.set(sectionId, {
        leftZone,
        rightZone,
        handlers
    });
}

function activateLeftZone(sectionId) {
    if (currentActiveZone === 'left') return;
    
    currentActiveZone = 'left';
    projectSectionStates[sectionId].currentZone = 'left';
    
    // Visual feedback
    const zones = zoneElements.get(sectionId);
    if (zones) {
        zones.leftZone.style.backgroundColor = 'rgba(0, 255, 0, 0.05)';
        zones.rightZone.style.backgroundColor = '';
    }
    
    console.log(`⬅️ Activated left zone: ${sectionId}`);
}

function activateRightZone(sectionId) {
    if (currentActiveZone === 'right') return;
    
    currentActiveZone = 'right';
    projectSectionStates[sectionId].currentZone = 'right';
    
    // Visual feedback
    const zones = zoneElements.get(sectionId);
    if (zones) {
        zones.rightZone.style.backgroundColor = 'rgba(0, 0, 255, 0.05)';
        zones.leftZone.style.backgroundColor = '';
    }
    
    console.log(`➡️ Activated right zone: ${sectionId}`);
}

function deactivateZone(sectionId) {
    currentActiveZone = null;
    projectSectionStates[sectionId].currentZone = null;
    
    // Remove visual feedback
    const zones = zoneElements.get(sectionId);
    if (zones) {
        zones.leftZone.style.backgroundColor = '';
        zones.rightZone.style.backgroundColor = '';
    }
}

function cleanupProjectScrollZones(sectionId) {
    // Remove zone elements
    const zones = zoneElements.get(sectionId);
    if (zones) {
        zones.container.remove();
        zoneElements.delete(sectionId);
    }
    
    // Remove event listeners
    const listeners = zoneEventListeners.get(sectionId);
    if (listeners) {
        const { leftZone, rightZone, handlers } = listeners;
        
        leftZone.removeEventListener('mouseenter', handlers.get('leftEnter'));
        leftZone.removeEventListener('mouseleave', handlers.get('leftLeave'));
        leftZone.removeEventListener('wheel', handlers.get('leftScroll'));
        
        rightZone.removeEventListener('mouseenter', handlers.get('rightEnter'));
        rightZone.removeEventListener('mouseleave', handlers.get('rightLeave'));
        rightZone.removeEventListener('wheel', handlers.get('rightScroll'));
        
        zoneEventListeners.delete(sectionId);
    }
}

// ================================================
// DESKTOP ZONE SCROLL HANDLERS
// ================================================

function handleVerticalZoneScroll(event, sectionId) {
    event.preventDefault();
    
    // Request container scroll change
    document.dispatchEvent(new CustomEvent('requestSectionChange', {
        detail: {
            direction: event.deltaY > 0 ? 'down' : 'up',
            fromSection: sectionId
        }
    }));
}

function handleHorizontalZoneScroll(event, sectionId) {
    event.preventDefault();
    
    const state = projectSectionStates[sectionId];
    if (!state || !state.isActive) return;
    
    const direction = event.deltaY > 0 ? 'forward' : 'backward';
    const scrollAmount = Math.abs(event.deltaY);
    
    handleProjectCardScroll(scrollAmount, sectionId, direction);
}

// ================================================
// PROJECT CARD SCROLL HANDLING
// ================================================

function handleProjectCardScroll(scrollAmount, sectionId, direction) {
    const state = projectSectionStates[sectionId];
    if (!state || !state.isActive) return;
    
    // Calculate new scroll progress
    const scrollDelta = direction === 'forward' ? scrollAmount : -scrollAmount;
    const newProgress = Math.max(0, Math.min(1, state.scrollProgress + (scrollDelta / state.maxScroll)));
    
    // Check if we should snap to complete animation steps
    if (isDesktop()) {
        const snappedProgress = snapToAnimationStep(newProgress, state.currentCardIndex, CARDS_PER_PROJECT);
        updateProjectCardAnimations(sectionId, snappedProgress);
    } else {
        // Mobile: smooth progress
        updateProjectCardAnimations(sectionId, newProgress);
    }
    
    state.scrollProgress = newProgress;
    
    // Update current card index
    const newCardIndex = Math.floor(newProgress * CARDS_PER_PROJECT);
    if (newCardIndex !== state.currentCardIndex) {
        state.currentCardIndex = newCardIndex;
        updateTooltipContent(sectionId, newCardIndex);
        updateButtonStates(sectionId, newCardIndex, CARDS_PER_PROJECT);
    }
}

function snapToAnimationStep(progress, currentCard, totalCards) {
    // Snap to discrete animation steps
    const cardProgress = progress * totalCards;
    const cardIndex = Math.floor(cardProgress);
    const withinCardProgress = cardProgress - cardIndex;
    
    // Snap to 50% intervals (center and final positions)
    if (withinCardProgress < 0.25) {
        return cardIndex / totalCards; // Snap to card start
    } else if (withinCardProgress < 0.75) {
        return (cardIndex + 0.5) / totalCards; // Snap to center
    } else {
        return (cardIndex + 1) / totalCards; // Snap to next card
    }
}

function updateProjectCardAnimations(sectionId, progress) {
    const state = projectSectionStates[sectionId];
    if (!state) return;
    
    state.cards.forEach((card, index) => {
        const cardProgress = calculateCardProgress(index, CARDS_PER_PROJECT, progress);
        handleTwoStepAnimation(card, cardProgress, sectionId, index);
    });
}

// ================================================
// MOBILE PROJECT SCROLL HANDLING
// ================================================

function enableMobileProjectScroll(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const handlers = new Map();
    
    const touchStartHandler = (e) => handleProjectTouchStart(e, sectionId);
    const touchMoveHandler = (e) => handleProjectTouchMove(e, sectionId);
    const touchEndHandler = (e) => handleProjectTouchEnd(e, sectionId);
    
    section.addEventListener('touchstart', touchStartHandler, { passive: false });
    section.addEventListener('touchmove', touchMoveHandler, { passive: false });
    section.addEventListener('touchend', touchEndHandler, { passive: false });
    
    handlers.set('touchstart', touchStartHandler);
    handlers.set('touchmove', touchMoveHandler);
    handlers.set('touchend', touchEndHandler);
    
    projectSectionStates[sectionId].eventListeners = handlers;
}

function disableMobileProjectScroll(sectionId) {
    const section = document.getElementById(sectionId);
    const handlers = projectSectionStates[sectionId]?.eventListeners;
    
    if (section && handlers) {
        section.removeEventListener('touchstart', handlers.get('touchstart'));
        section.removeEventListener('touchmove', handlers.get('touchmove'));
        section.removeEventListener('touchend', handlers.get('touchend'));
        handlers.clear();
    }
}

function handleProjectTouchStart(event, sectionId) {
    const touch = event.touches[0];
    touchState.startX = touch.clientX;
    touchState.startY = touch.clientY;
    touchState.isDragging = false;
    touchState.currentSection = sectionId;
    touchState.lastTouchTime = Date.now();
}

function handleProjectTouchMove(event, sectionId) {
    if (touchState.currentSection !== sectionId) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    
    // Determine scroll direction on first significant movement
    if (!touchState.touchDirection && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        touchState.touchDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
    }
    
    // Only handle horizontal scrolls for projects
    if (touchState.touchDirection === 'horizontal') {
        event.preventDefault();
        touchState.isDragging = true;
        
        const direction = deltaX < 0 ? 'forward' : 'backward';
        const scrollAmount = Math.abs(deltaX) * 2; // Amplify touch movement
        
        handleProjectCardScroll(scrollAmount, sectionId, direction);
    }
}

function handleProjectTouchEnd(event, sectionId) {
    touchState.isDragging = false;
    touchState.touchDirection = null;
    touchState.currentSection = null;
}

// ================================================
// PROCESS SECTION MANAGEMENT
// ================================================

function initProcessSection() {
    const section = document.getElementById('process');
    if (!section) {
        console.warn('Process section not found');
        return;
    }
    
    const cards = getSectionCards('process');
    processSectionState.cards = Array.from(cards);
    
    console.log(`✅ Initialized process section (${cards.length} cards)`);
}

function activateProcessSection() {
    if (processSectionState.isActive) return true;
    
    try {
        processSectionState.isActive = true;
        
        // Setup based on device
        if (isMobile()) {
            enableMobileProcessScroll();
        } else {
            enableDesktopProcessScroll();
        }
        
        console.log('🎬 Activated process section');
        
        // Dispatch activation event
        document.dispatchEvent(new CustomEvent('sectionActivated', {
            detail: { sectionId: 'process', type: 'process' }
        }));
        
        return true;
        
    } catch (error) {
        console.error('Failed to activate process section:', error);
        processSectionState.isActive = false;
        return false;
    }
}

function deactivateProcessSection() {
    if (!processSectionState.isActive) return;
    
    try {
        processSectionState.isActive = false;
        
        // Cleanup based on device
        if (isMobile()) {
            disableMobileProcessScroll();
        } else {
            disableDesktopProcessScroll();
        }
        
        // Reset state
        processSectionState.scrollProgress = 0;
        processSectionState.currentCardIndex = 0;
        processSectionState.isScrollLocked = false;
        
        console.log('🛑 Deactivated process section');
        
        // Dispatch deactivation event
        document.dispatchEvent(new CustomEvent('sectionDeactivated', {
            detail: { sectionId: 'process', type: 'process' }
        }));
        
    } catch (error) {
        console.error('Failed to deactivate process section:', error);
    }
}

// ================================================
// PROCESS SCROLL HANDLING
// ================================================

function enableDesktopProcessScroll() {
    const section = document.getElementById('process');
    if (!section) return;
    
    const scrollHandler = debounceScrollEvents(handleProcessCardScroll, 16);
    section.addEventListener('wheel', scrollHandler, { passive: false });
    
    processSectionState.eventListeners.set('wheel', scrollHandler);
}

function disableDesktopProcessScroll() {
    const section = document.getElementById('process');
    const scrollHandler = processSectionState.eventListeners.get('wheel');
    
    if (section && scrollHandler) {
        section.removeEventListener('wheel', scrollHandler);
        processSectionState.eventListeners.delete('wheel');
    }
}

function enableMobileProcessScroll() {
    const section = document.getElementById('process');
    if (!section) return;
    
    const touchStartHandler = handleProcessTouchStart;
    const touchMoveHandler = handleProcessTouchMove;
    const touchEndHandler = handleProcessTouchEnd;
    
    section.addEventListener('touchstart', touchStartHandler, { passive: false });
    section.addEventListener('touchmove', touchMoveHandler, { passive: false });
    section.addEventListener('touchend', touchEndHandler, { passive: false });
    
    processSectionState.eventListeners.set('touchstart', touchStartHandler);
    processSectionState.eventListeners.set('touchmove', touchMoveHandler);
    processSectionState.eventListeners.set('touchend', touchEndHandler);
}

function disableMobileProcessScroll() {
    const section = document.getElementById('process');
    
    if (section) {
        const touchStartHandler = processSectionState.eventListeners.get('touchstart');
        const touchMoveHandler = processSectionState.eventListeners.get('touchmove');
        const touchEndHandler = processSectionState.eventListeners.get('touchend');
        
        if (touchStartHandler) section.removeEventListener('touchstart', touchStartHandler);
        if (touchMoveHandler) section.removeEventListener('touchmove', touchMoveHandler);
        if (touchEndHandler) section.removeEventListener('touchend', touchEndHandler);
    }
    
    processSectionState.eventListeners.clear();
}

function handleProcessCardScroll(event) {
    if (!processSectionState.isActive) return;
    
    event.preventDefault();
    
    const direction = event.deltaY > 0 ? 'forward' : 'backward';
    const scrollAmount = Math.abs(event.deltaY);
    
    handleProcessScroll(scrollAmount, direction);
}

function handleProcessScroll(scrollAmount, direction) {
    const maxScroll = CARDS_PER_PROCESS * 100;
    const scrollDelta = direction === 'forward' ? scrollAmount : -scrollAmount;
    
    // Check scroll bounds for container unlock
    const newProgress = processSectionState.scrollProgress + (scrollDelta / maxScroll);
    
    if (newProgress <= 0 && direction === 'backward') {
        // Unlock container for upward navigation
        document.dispatchEvent(new CustomEvent('requestSectionChange', {
            detail: { direction: 'up', fromSection: 'process' }
        }));
        return;
    }
    
    if (newProgress >= 1 && direction === 'forward') {
        // Allow exit from container
        document.dispatchEvent(new CustomEvent('requestContainerExit', {
            detail: { direction: 'down' }
        }));
        return;
    }
    
    // Update progress within bounds
    processSectionState.scrollProgress = Math.max(0, Math.min(1, newProgress));
    
    // Update card animations
    updateProcessCardAnimations(processSectionState.scrollProgress);
    
    // Update current card index
    const newCardIndex = Math.floor(processSectionState.scrollProgress * CARDS_PER_PROCESS);
    if (newCardIndex !== processSectionState.currentCardIndex) {
        processSectionState.currentCardIndex = newCardIndex;
        updateTooltipContent('process', newCardIndex);
    }
}

function updateProcessCardAnimations(progress) {
    processSectionState.cards.forEach((card, index) => {
        const cardProgress = calculateCardProgress(index, CARDS_PER_PROCESS, progress);
        handleTwoStepAnimation(card, cardProgress, 'process', index);
    });
}

// ================================================
// MOBILE PROCESS TOUCH HANDLERS
// ================================================

function handleProcessTouchStart(event) {
    const touch = event.touches[0];
    touchState.startY = touch.clientY;
    touchState.isDragging = false;
}

function handleProcessTouchMove(event) {
    const touch = event.touches[0];
    const deltaY = touch.clientY - touchState.startY;
    
    if (Math.abs(deltaY) > 10) {
        event.preventDefault();
        touchState.isDragging = true;
        
        const direction = deltaY < 0 ? 'forward' : 'backward';
        const scrollAmount = Math.abs(deltaY) * 2;
        
        handleProcessScroll(scrollAmount, direction);
    }
}

function handleProcessTouchEnd(event) {
    touchState.isDragging = false;
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

function getCurrentProjectSection() {
    return Object.keys(projectSectionStates).find(id => 
        projectSectionStates[id].isActive
    ) || null;
}

function getProjectCards(sectionId) {
    return projectSectionStates[sectionId]?.cards || [];
}

function getProcessCards() {
    return processSectionState.cards;
}

function isProjectSection(sectionId) {
    return VALID_PROJECT_SECTIONS.includes(sectionId);
}

function isProcessSection(sectionId) {
    return sectionId === 'process';
}

// ================================================
// INITIALIZATION & EXPORTS
// ================================================

function initSectionManagers() {
    console.log('🚀 Initializing Section Managers...');
    
    try {
        initProjectSections();
        initProcessSection();
        
        console.log('✅ Section Managers initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to initialize Section Managers:', error);
        return false;
    }
}

// ================================================
// CLEANUP
// ================================================

function destroySectionManagers() {
    // Cleanup project sections
    VALID_PROJECT_SECTIONS.forEach(sectionId => {
        if (projectSectionStates[sectionId]?.isActive) {
            deactivateProjectSection(sectionId);
        }
        cleanupProjectScrollZones(sectionId);
    });
    
    // Cleanup process section
    if (processSectionState.isActive) {
        deactivateProcessSection();
    }
    
    // Clear state
    Object.keys(projectSectionStates).forEach(key => delete projectSectionStates[key]);
    processSectionState.eventListeners.clear();
    
    console.log('🧨 Section Managers destroyed');
}

// ================================================
// EXPORTS
// ================================================

export {
    // Initialization
    initSectionManagers,
    destroySectionManagers,
    
    // Project sections
    activateProjectSection,
    deactivateProjectSection,
    handleProjectCardScroll,
    
    // Process section
    activateProcessSection,
    deactivateProcessSection,
    handleProcessCardScroll,
    
    // State access
    projectSectionStates,
    processSectionState,
    
    // Utilities
    getCurrentProjectSection,
    getProjectCards,
    getProcessCards,
    isProjectSection,
    isProcessSection,
    validateProjectSectionId
};