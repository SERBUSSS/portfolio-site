// ================================================
// PROJECT CONTAINER - Main Orchestrator
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
    currentSection: null,
    previousSection: null,
    isScrollLocked: false,
    device: 'desktop',
    snapDirection: null, // 'up' | 'down' | null
    isTransitioning: false,
    scrollAccumulator: 0,
    containerElement: null,
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
        
        // Setup scroll detection
        setupIntersectionObserver();
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
    containerState.containerElement?.classList.add('container-active');
    
    // Disable page scroll
    disablePageScroll();
    
    // Enable snap scroll
    enableSnapScroll();
    
    // Trigger initial section if none active
    if (!containerState.currentSection) {
        transitionToSection(null, 'project-1');
    }
    
    console.log('🔒 Container activated');
}

function deactivateContainer() {
    if (!containerState.isActive) return;
    
    containerState.isActive = false;
    containerState.containerElement?.classList.remove('container-active');
    
    // Cleanup current section
    if (containerState.currentSection) {
        cleanupSection(containerState.currentSection);
    }
    
    // Enable page scroll
    enablePageScroll();
    
    // Disable snap scroll
    disableSnapScroll();
    
    console.log('🔓 Container deactivated');
}

// ================================================
// SNAP SCROLL BETWEEN SECTIONS
// ================================================

function enableSnapScroll() {
    if (!containerState.containerElement) return;
    
    // Remove existing scroll listener
    const existingHandler = containerState.eventListeners.get('containerScroll');
    if (existingHandler) {
        containerState.containerElement.removeEventListener('wheel', existingHandler);
    }
    
    // Add throttled scroll handler
    const scrollHandler = debounceScrollEvents(handleContainerScroll, CONFIG.DEBOUNCE_DELAY);
    containerState.containerElement.addEventListener('wheel', scrollHandler, { passive: false });
    containerState.eventListeners.set('containerScroll', scrollHandler);
}

function disableSnapScroll() {
    const scrollHandler = containerState.eventListeners.get('containerScroll');
    if (scrollHandler && containerState.containerElement) {
        containerState.containerElement.removeEventListener('wheel', scrollHandler);
        containerState.eventListeners.delete('containerScroll');
    }
}

function handleContainerScroll(event) {
    if (!containerState.isActive || containerState.isTransitioning) {
        return;
    }
    
    event.preventDefault();
    
    // Accumulate scroll delta to prevent micro-movements
    containerState.scrollAccumulator += event.deltaY;
    
    // Only trigger snap when threshold is reached
    if (Math.abs(containerState.scrollAccumulator) < CONFIG.SCROLL_THRESHOLD) {
        return;
    }
    
    const direction = containerState.scrollAccumulator > 0 ? 'down' : 'up';
    containerState.scrollAccumulator = 0; // Reset accumulator
    
    const nextSection = getNextSection(direction);
    if (nextSection && nextSection !== containerState.currentSection) {
        snapToSection(nextSection, direction);
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
    
    console.log(`📍 Snapping to section: ${validSectionId} (${direction || 'direct'})`);
    transitionToSection(containerState.currentSection, validSectionId);
}

// ================================================
// PAGE SCROLL MANAGEMENT
// ================================================

function disablePageScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

function enablePageScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
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
    
    // Initialize new section
    initializeSection(validToSection);
    
    // Update state
    containerState.currentSection = validToSection;
    updateGlobalState('currentSection', validToSection);
    
    // Allow new transitions after animation completes
    setTimeout(() => {
        containerState.isTransitioning = false;
    }, CONFIG.ANIMATION_DURATION);
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
            ? CONFIG.PREVIEW_MOBILE 
            : CONFIG.PREVIEW_DESKTOP;
        
        triggerInitialPreview(validSectionId, previewPercentage);
        
        // Show UI components with delay
        setTimeout(() => {
            showTooltip(validSectionId);
            showNavigation(validSectionId);
        }, CONFIG.ANIMATION_DURATION * 0.5);
        
        console.log(`🎬 Initialized section: ${validSectionId}`);
    } catch (error) {
        console.error(`Failed to initialize section ${validSectionId}:`, error);
    }
}

// ================================================
// INTERSECTION OBSERVER
// ================================================

function setupIntersectionObserver() {
    // Observer for container activation
    const containerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activateContainer();
                } else {
                    deactivateContainer();
                }
            });
        },
        { 
            threshold: 0.1,
            rootMargin: '-10px 0px -10px 0px'
        }
    );
    
    if (containerState.containerElement) {
        containerObserver.observe(containerState.containerElement);
        containerState.observers.set('container', containerObserver);
    }
}

// ================================================
// EVENT COORDINATION
// ================================================

function setupEventListeners() {
    // Window events with cleanup tracking
    const resizeHandler = debounceScrollEvents(handleMasterResize, 250);
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
            break;
        case 'ArrowDown':
            event.preventDefault();
            const nextSection = getNextSection('down');
            if (nextSection) snapToSection(nextSection, 'down');
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
        if (key === 'containerScroll' && containerState.containerElement) {
            containerState.containerElement.removeEventListener('wheel', handler);
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
    
    // Enable page scroll
    enablePageScroll();
    
    // Reset state
    containerState = {
        isActive: false,
        currentSection: null,
        previousSection: null,
        isScrollLocked: false,
        device: 'desktop',
        snapDirection: null,
        isTransitioning: false,
        scrollAccumulator: 0,
        containerElement: null,
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
    containerState, // Export getter for immutability
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