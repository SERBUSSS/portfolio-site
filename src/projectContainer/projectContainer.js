// ================================================
// PROJECT CONTAINER - Main Orchestrator (FIXED)
// ================================================

import { initSectionManagers, activateProjectSection, deactivateProjectSection, activateProcessSection, deactivateProcessSection } from './sectionManagers.js';
import { initCardAnimations, setInitialCardPositions, triggerInitialPreview } from './cardAnimations.js';
import { initUIComponents, showTooltip, hideTooltip, showNavigation, hideNavigation } from './uiComponents.js';
import { CONFIG, getGlobalState, updateGlobalState, detectDevice, debounceScrollEvents } from './dataAndUtils.js';

// ================================================
// GLOBAL STATE MANAGEMENT
// ================================================

const VALID_SECTIONS = ['project-1', 'project-2', 'project-3', 'project-4', 'process'];
const SECTION_ORDER = ['project-1', 'project-2', 'project-3', 'project-4', 'process'];

let containerState = {
    isActive: false,
    isLocked: false,
    currentSection: null,
    previousSection: null,
    isScrollLocked: false,
    device: 'desktop',
    snapDirection: null,
    isTransitioning: false,
    scrollAccumulator: 0,
    lastSnapTime: 0,
    containerElement: null,
    originalContainerStyles: {},
    observers: new Map(),
    eventListeners: new Map()
};

// ================================================
// SECURITY & VALIDATION
// ================================================

function validateSectionId(sectionId) {
    if (!sectionId || typeof sectionId !== 'string') {
        console.warn('Invalid section ID provided');
        return false;
    }
    return VALID_SECTIONS.includes(sectionId);
}

function sanitizeSectionId(sectionId) {
    return validateSectionId(sectionId) ? sectionId : null;
}

// ================================================
// CONTAINER POSITION LOCKING
// ================================================

function lockContainerPosition() {
    if (!containerState.containerElement || containerState.isLocked) return;
    
    // Store original styles for restoration
    const computedStyles = window.getComputedStyle(containerState.containerElement);
    containerState.originalContainerStyles = {
        position: computedStyles.position,
        top: computedStyles.top,
        left: computedStyles.left,
        width: computedStyles.width,
        height: computedStyles.height,
        zIndex: computedStyles.zIndex
    };
    
    // Lock container at viewport top
    containerState.containerElement.style.position = 'fixed';
    containerState.containerElement.style.top = '0px';
    containerState.containerElement.style.left = '0px';
    containerState.containerElement.style.width = '100vw';
    containerState.containerElement.style.height = '100vh';
    containerState.containerElement.style.zIndex = '100';
    
    containerState.isLocked = true;
    
    // Disable page scroll
    disablePageScroll();
    
    console.log('🔒 Container position locked');
}

function unlockContainerPosition() {
    if (!containerState.containerElement || !containerState.isLocked) return;
    
    // Restore original styles
    const styles = containerState.originalContainerStyles;
    containerState.containerElement.style.position = styles.position || '';
    containerState.containerElement.style.top = styles.top || '';
    containerState.containerElement.style.left = styles.left || '';
    containerState.containerElement.style.width = styles.width || '';
    containerState.containerElement.style.height = styles.height || '';
    containerState.containerElement.style.zIndex = styles.zIndex || '';
    
    containerState.isLocked = false;
    
    // Re-enable page scroll
    enablePageScroll();
    
    console.log('🔓 Container position unlocked');
}

// ================================================
// CONTAINER CONTROL FUNCTIONS
// ================================================

function initProjectContainer() {
    try {
        // Validate required dependencies
        if (typeof gsap === 'undefined') {
            throw new Error('GSAP is required but not loaded');
        }

        // Cache container element
        containerState.containerElement = document.querySelector('.projects-container');
        if (!containerState.containerElement) {
            throw new Error('Projects container element not found');
        }

        // Detect device type
        containerState.device = detectDevice();
        
        // Initialize subsystems in order
        initSectionManagers();
        initCardAnimations();
        initUIComponents();
        
        // Setup container position monitoring
        setupContainerPositionMonitoring();
        setupEventListeners();
        
        // Set initial card positions for all sections
        VALID_SECTIONS.forEach(sectionId => {
            setInitialCardPositions(sectionId);
        });
        
        // Coordinate managers
        coordinateManagers();
        
        console.log('✅ Project Container initialized successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Failed to initialize Project Container:', error);
        return false;
    }
}

function activateContainer() {
    if (containerState.isActive) return;
    
    containerState.isActive = true;
    
    // Lock container position first
    lockContainerPosition();
    
    // Enable snap scroll within container
    enableSnapScroll();
    
    // Ensure first section is active and visible
    if (!containerState.currentSection) {
        transitionToSection(null, 'project-1');
    } else {
        // Make sure current section is properly visible
        showCurrentSection();
    }
    
    console.log('🔒 Container activated with background coverage');
}

// Section visibility management
function showCurrentSection() {
    if (!containerState.currentSection) return;
    
    // Hide all sections first
    hideAllSections();
    
    // Show only current section
    const currentSectionElement = document.getElementById(containerState.currentSection);
    if (currentSectionElement) {
        currentSectionElement.classList.add('active');
        currentSectionElement.style.display = 'block';
        currentSectionElement.style.opacity = '1';
        currentSectionElement.style.pointerEvents = 'auto';
        currentSectionElement.style.zIndex = '10';
        currentSectionElement.style.position = 'absolute';
        currentSectionElement.style.top = '0';
        currentSectionElement.style.left = '0';
        currentSectionElement.style.width = '100%';
        currentSectionElement.style.height = '100%';
        
        console.log(`👁️ Showing section: ${containerState.currentSection}`);
    }
}

function hideAllSections() {
    if (!containerState.containerElement) return;
    
    const allSections = containerState.containerElement.querySelectorAll('[id^="project-"], #process');
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.opacity = '0';
        section.style.pointerEvents = 'none';
        section.style.zIndex = '1';
        // Don't set display: none as it might interfere with card positioning
    });
}

function deactivateContainer() {
    if (!containerState.isActive) return;
    
    const exitDirection = containerState.currentSection === 'project-1' ? 'up' : 'down';
    
    containerState.isActive = false;
    
    // Cleanup current section
    if (containerState.currentSection) {
        cleanupSection(containerState.currentSection);
        hideAllSections();
    }
    
    // Store current container position before unlocking
    const containerRect = containerState.containerElement.getBoundingClientRect();
    
    // Unlock container position
    unlockContainerPosition();
    
    // Disable snap scroll
    disableSnapScroll();
    
    // Handle scroll positioning based on exit direction
    if (exitDirection === 'down') {
        // Exiting down: scroll to just past the container
        setTimeout(() => {
            const newRect = containerState.containerElement.getBoundingClientRect();
            const targetScroll = window.scrollY + newRect.bottom - window.innerHeight + 100;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }, 50);
    } else {
        // Exiting up: scroll to just before the container
        setTimeout(() => {
            const newRect = containerState.containerElement.getBoundingClientRect();
            const targetScroll = window.scrollY + newRect.top - 100;
            window.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
        }, 50);
    }
    
    // Reset state
    containerState.currentSection = null;
    containerState.isTransitioning = false;
    
    // Reset all card indices
    Object.keys(sectionCardIndices).forEach(sectionId => {
        sectionCardIndices[sectionId] = 0;
    });
    
    console.log(`🔓 Container deactivated with ${exitDirection} exit`);
}

// ================================================
// CONTAINER POSITION MONITORING
// ================================================

function setupContainerPositionMonitoring() {
    let isExiting = false;
    let exitDirection = null;
    
    function handleContainerPositionCheck() {
        if (!containerState.containerElement) return;
        
        const rect = containerState.containerElement.getBoundingClientRect();
        
        // If we're exiting, don't immediately re-activate
        if (isExiting) {
            if (exitDirection === 'down') {
                // Only re-activate if user scrolls back up significantly
                if (rect.top > 100) {
                    isExiting = false;
                    exitDirection = null;
                }
                return;
            } else if (exitDirection === 'up') {
                // Only re-activate if user scrolls down significantly
                if (rect.top < -100) {
                    isExiting = false;
                    exitDirection = null;
                }
                return;
            }
        }
        
        // Activate when container top hits viewport top (not when still exiting)
        if (rect.top <= 0 && rect.bottom > window.innerHeight * 0.1 && !containerState.isActive && !isExiting) {
            activateContainer();
        }
        // Deactivate when scrolling significantly above container
        else if (rect.top > 50 && containerState.isActive) {
            isExiting = true;
            exitDirection = 'up';
            deactivateContainer();
        }
    }
    
    // Store exit state handlers
    containerState.setExitState = (direction) => {
        isExiting = true;
        exitDirection = direction;
        console.log(`🚪 Container exit state: ${direction}`);
    };
    
    // Monitor scroll for container position
    window.addEventListener('scroll', handleContainerPositionCheck, { passive: true });
    containerState.eventListeners.set('containerPosition', handleContainerPositionCheck);
    
    console.log('📍 Container position monitoring active');
}

// ================================================
// SNAP SCROLL WITHIN CONTAINER
// ================================================

function enableSnapScroll() {
    if (!containerState.containerElement) return;
    
    // Remove existing scroll listener
    const existingHandler = containerState.eventListeners.get('containerScroll');
    if (existingHandler) {
        window.removeEventListener('wheel', existingHandler);
    }
    
    // Add immediate snap scroll handler
    const scrollHandler = handleContainerScroll;
    window.addEventListener('wheel', scrollHandler, { passive: false });
    containerState.eventListeners.set('containerScroll', scrollHandler);
    
    console.log('⚡ Snap scroll enabled');
}

function disableSnapScroll() {
    const scrollHandler = containerState.eventListeners.get('containerScroll');
    if (scrollHandler) {
        window.removeEventListener('wheel', scrollHandler);
        containerState.eventListeners.delete('containerScroll');
    }
    
    console.log('🛑 Snap scroll disabled');
}

function handleContainerScroll(event) {
    // Only handle scroll when container is active and locked
    if (!containerState.isActive || !containerState.isLocked) {
        return;
    }
    
    // Prevent default scroll behavior
    event.preventDefault();
    
    // Prevent rapid-fire snapping
    if (containerState.isTransitioning) {
        return;
    }
    
    // Reduce minimum time for more responsive feel
    const timeSinceLastSnap = Date.now() - containerState.lastSnapTime;
    if (timeSinceLastSnap < 300) { // Reduced from 800ms
        return;
    }
    
    const direction = event.deltaY > 0 ? 'down' : 'up';
    
    console.log(`🖱️ Container scroll: ${direction} in section ${containerState.currentSection}`);
    
    // Handle exit conditions FIRST
    if (shouldExitContainer(direction)) {
        deactivateContainer();
        return;
    }
    
    // Handle process section special behavior
    if (containerState.currentSection === 'process') {
        handleProcessSectionScroll(direction);
        return;
    }
    
    // Only snap to next section if no cards to animate
    const nextSection = getNextSection(direction);
    if (nextSection) {
        snapToSection(nextSection, direction);
    }
}

function shouldExitContainer(direction) {
    // Exit up from first section
    if (direction === 'up' && containerState.currentSection === 'project-1') {
        containerState.setExitState('up');
        return true;
    }
    
    // Exit down from last section (process)
    if (direction === 'down' && containerState.currentSection === 'process') {
        containerState.setExitState('down');
        return true;
    }
    
    return false;
}

function handleProcessSectionScroll(direction) {
    // TODO: Implement process section card animation logic
    // This should handle:
    // - Check if first card is at initial position
    // - If yes: scroll up = container snap, scroll down = card animation
    // - If cards are animating: scroll controls card animation progress
    // - If last card at final position: scroll down = exit container
    
    console.log(`🔄 Process section scroll: ${direction}`);
    
    // Temporary: treat as normal section for now
    if (direction === 'up') {
        const prevSection = getNextSection('up');
        if (prevSection) {
            snapToSection(prevSection, 'up');
        }
    }
}

function getNextSection(direction) {
    if (!containerState.currentSection) return 'project-1';
    
    const currentIndex = SECTION_ORDER.indexOf(containerState.currentSection);
    if (currentIndex === -1) return null;
    
    if (direction === 'down') {
        return currentIndex < SECTION_ORDER.length - 1 ? SECTION_ORDER[currentIndex + 1] : null;
    } else {
        return currentIndex > 0 ? SECTION_ORDER[currentIndex - 1] : null;
    }
}

function snapToSection(sectionId, direction = null) {
    const validSectionId = sanitizeSectionId(sectionId);
    if (!validSectionId) {
        console.warn('Cannot snap to invalid section:', sectionId);
        return;
    }
    
    if (containerState.isTransitioning) {
        console.log('Snap blocked: transition in progress');
        return;
    }
    
    containerState.lastSnapTime = Date.now();
    console.log(`📍 Snapping to section: ${validSectionId} (${direction || 'direct'})`);
    transitionToSection(containerState.currentSection, validSectionId);
}

// ================================================
// PAGE SCROLL MANAGEMENT
// ================================================

function disablePageScroll() {
    // Prevent scrolling on multiple levels
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    
    // Prevent touch scrolling on mobile
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });
}

function enablePageScroll() {
    // Restore scrolling
    document.body.style.overflow = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.height = '';
    
    // Remove touch scroll prevention
    document.removeEventListener('touchmove', preventScroll);
    document.removeEventListener('wheel', preventScroll);
}

function preventScroll(event) {
    // Only prevent if container is active - let container handle its own scroll
    if (containerState.isActive && containerState.isLocked) {
        // Let container scroll handler deal with it
        return;
    } else {
        // Prevent all other scrolling
        event.preventDefault();
    }
}

// ================================================
// SECTION TRANSITIONS
// ================================================

function transitionToSection(fromSection, toSection) {
    if (containerState.isTransitioning) return;
    
    const validToSection = sanitizeSectionId(toSection);
    if (!validToSection) return;
    
    containerState.isTransitioning = true;
    containerState.previousSection = fromSection;
    
    console.log(`🔄 Transitioning: ${fromSection || 'none'} → ${validToSection}`);
    
    // Cleanup previous section
    if (fromSection) {
        cleanupSection(fromSection);
    }
    
    // IMPORTANT: Hide all sections first, then show new one
    hideAllSections();
    
    // Initialize new section
    initializeSection(validToSection);
    
    // Update state
    containerState.currentSection = validToSection;
    updateGlobalState('currentSection', validToSection);
    // Allow new transitions after animation completes
    setTimeout(() => {
        containerState.isTransitioning = false;
    }, CONFIG.ANIMATION_DURATION || 800);
}

function cleanupSection(sectionId) {
    const validSectionId = sanitizeSectionId(sectionId);
    if (!validSectionId) return;
    
    try {
        // Hide tooltips and navigation
        hideTooltip(validSectionId);
        hideNavigation(validSectionId);
        
        // Deactivate section based on type
        if (validSectionId.startsWith('project-')) {
            deactivateProjectSection(validSectionId);
        } else if (validSectionId === 'process') {
            deactivateProcessSection();
        }
        
        console.log(`🧹 Cleaned up section: ${validSectionId}`);
    } catch (error) {
        console.error(`Failed to cleanup section ${validSectionId}:`, error);
    }
}

function initializeSection(sectionId) {
    const validSectionId = sanitizeSectionId(sectionId);
    if (!validSectionId) return;
    
    try {
        // Activate section based on type
        if (validSectionId.startsWith('project-')) {
            activateProjectSection(validSectionId);
        } else if (validSectionId === 'process') {
            activateProcessSection();
        }
        
        // Trigger initial preview
        const previewPercentage = containerState.device === 'mobile' 
            ? (CONFIG.PREVIEW_MOBILE || 15)
            : (CONFIG.PREVIEW_DESKTOP || 15);
        
        triggerInitialPreview(validSectionId, previewPercentage);
        
        // Show UI components with delay
        setTimeout(() => {
            showTooltip(validSectionId);
            showNavigation(validSectionId);
        }, (CONFIG.ANIMATION_DURATION || 800) * 0.5);
        
        console.log(`🎬 Initialized section: ${validSectionId}`);
    } catch (error) {
        console.error(`Failed to initialize section ${validSectionId}:`, error);
    }
}

// ================================================
// EVENT COORDINATION
// ================================================

function setupEventListeners() {
    // Window events with cleanup tracking
    const resizeHandler = debounceScrollEvents ? debounceScrollEvents(handleMasterResize, 250) : handleMasterResize;
    const keyHandler = handleMasterKeyboard;
    
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('keydown', keyHandler);
    
    containerState.eventListeners.set('resize', resizeHandler);
    containerState.eventListeners.set('keyboard', keyHandler);
    
    // Custom events
    document.addEventListener('sectionActivated', handleSectionActivation);
    document.addEventListener('sectionDeactivated', handleSectionDeactivation);
    
    console.log('🎧 Event listeners setup complete');
}

function handleMasterResize() {
    const newDevice = detectDevice();
    if (newDevice !== containerState.device) {
        console.log(`📱 Device changed: ${containerState.device} → ${newDevice}`);
        containerState.device = newDevice;
        
        // Reinitialize current section for new device
        if (containerState.currentSection) {
            const currentSection = containerState.currentSection;
            cleanupSection(currentSection);
            setTimeout(() => initializeSection(currentSection), 100);
        }
    }
}

function handleMasterKeyboard(event) {
    if (!containerState.isActive) return;
    
    // Arrow key navigation
    switch (event.key) {
        case 'ArrowUp':
            event.preventDefault();
            const prevSection = getNextSection('up');
            if (prevSection) snapToSection(prevSection, 'up');
            else if (containerState.currentSection === 'project-1') deactivateContainer();
            break;
        case 'ArrowDown':
            event.preventDefault();
            const nextSection = getNextSection('down');
            if (nextSection) snapToSection(nextSection, 'down');
            else if (containerState.currentSection === 'process') deactivateContainer();
            break;
        case 'Escape':
            deactivateContainer();
            break;
    }
}

function handleSectionActivation(event) {
    console.log('📡 Section activation event:', event.detail);
}

function handleSectionDeactivation(event) {
    console.log('📡 Section deactivation event:', event.detail);
}

// ================================================
// MANAGER COORDINATION
// ================================================

function coordinateManagers() {
    // Share container state with other managers
    updateGlobalState('containerState', containerState);
    
    // Setup inter-manager communication
    document.addEventListener('requestSectionChange', (event) => {
        const { sectionId, direction } = event.detail;
        snapToSection(sectionId, direction);
    });
    
    console.log('🤝 Manager coordination established');
}

// ================================================
// STATE MANAGEMENT
// ================================================

function updateContainerState(updates) {
    if (typeof updates !== 'object' || updates === null) return;
    
    const previousState = { ...containerState };
    Object.assign(containerState, updates);
    
    // Notify state change
    handleStateChange(containerState, previousState);
    updateGlobalState('containerState', containerState);
}

function getContainerState() {
    return { ...containerState }; // Return copy to prevent external mutations
}

function handleStateChange(newState, oldState) {
    // Log significant state changes
    if (newState.currentSection !== oldState.currentSection) {
        console.log(`🔄 Section changed: ${oldState.currentSection} → ${newState.currentSection}`);
    }
    
    if (newState.isActive !== oldState.isActive) {
        console.log(`📊 Container active: ${newState.isActive}`);
    }
    
    if (newState.isLocked !== oldState.isLocked) {
        console.log(`🔐 Container locked: ${newState.isLocked}`);
    }
}

// ================================================
// CLEANUP & DESTRUCTION
// ================================================

function destroy() {
    console.log('🧨 Destroying Project Container...');
    
    // Cleanup observers
    containerState.observers.forEach(observer => observer.disconnect());
    containerState.observers.clear();
    
    // Remove event listeners
    containerState.eventListeners.forEach((handler, key) => {
        if (key === 'containerScroll') {
            window.removeEventListener('wheel', handler);
        } else if (key === 'containerPosition') {
            window.removeEventListener('scroll', handler);
        } else if (key === 'resize') {
            window.removeEventListener('resize', handler);
        } else if (key === 'keyboard') {
            window.removeEventListener('keydown', handler);
        }
    });
    containerState.eventListeners.clear();
    
    // Remove custom event listeners
    document.removeEventListener('sectionActivated', handleSectionActivation);
    document.removeEventListener('sectionDeactivated', handleSectionDeactivation);
    
    // Cleanup current section
    if (containerState.currentSection) {
        cleanupSection(containerState.currentSection);
    }
    
    // Unlock container if locked
    if (containerState.isLocked) {
        unlockContainerPosition();
    }
    
    // Reset state
    containerState = {
        isActive: false,
        isLocked: false,
        currentSection: null,
        previousSection: null,
        isScrollLocked: false,
        device: 'desktop',
        snapDirection: null,
        isTransitioning: false,
        scrollAccumulator: 0,
        lastSnapTime: 0,
        containerElement: null,
        originalContainerStyles: {},
        observers: new Map(),
        eventListeners: new Map()
    };
    
    console.log('✅ Project Container destroyed');
}

// ================================================
// PUBLIC API
// ================================================

function init() {
    console.log('🚀 Initializing Project Container...');
    return initProjectContainer();
}

// ================================================
// EXPORTS
// ================================================

export {
    init,
    destroy,
    containerState,
    activateContainer,
    deactivateContainer,
    snapToSection,
    transitionToSection,
    updateContainerState,
    getContainerState,
    validateSectionId,
    VALID_SECTIONS,
    SECTION_ORDER
};

// ================================================
// AUTO-INITIALIZATION
// ================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM already loaded, initialize immediately
    init();
}