// ================================================
// DATA STRUCTURES, UTILITIES & PERFORMANCE
// ================================================

// ================================================
// CONFIGURATION
// ================================================

const CONFIG = {
    // Animation settings
    PREVIEW_MOBILE: 0.15,        // 15% preview on mobile
    PREVIEW_DESKTOP: 0.30,       // 30% preview on desktop
    MAX_VISIBLE_CARDS: 10,       // Maximum visible cards
    ANIMATION_DURATION: 800,     // Animation duration in ms
    SCROLL_THRESHOLD: 100,       // Scroll threshold for snapping
    
    // Performance settings
    DEBOUNCE_DELAY: 16,          // ~60fps
    THROTTLE_DELAY: 32,          // ~30fps
    LAZY_LOAD_MARGIN: '50px',    // Intersection observer margin
    
    // Breakpoints
    BREAKPOINTS: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    },
    
    // Scroll zones
    LEFT_ZONE_WIDTH: 0.5,        // 50% of viewport
    RIGHT_ZONE_WIDTH: 0.5,       // 50% of viewport
    
    // Card positions
    INITIAL_POSITION_PROJECTS: { x: 110, y: 50, scale: 1, opacity: 0, rotation: 0 }, // vw/vh
    INITIAL_POSITION_PROCESS: { x: 50, y: 110, scale: 1, opacity: 0, rotation: 0 },
    CENTER_POSITION: { x: 50, y: 50, scale: 1, opacity: 1, rotation: 0 }
};

// ================================================
// DATA STRUCTURES
// ================================================

// Card position data for each section
const cardPositions = {
    'project-1': {
        desktop: [
            // Will be populated with actual position data
            // { x: 10, y: 20, scale: 0.8, opacity: 1, rotation: 0 },
            // ... up to 20 cards
        ],
        mobile: [
            // Will be populated with actual position data
            // { x: 5, y: 15, scale: 0.9, opacity: 1, rotation: 5 },
            // ... up to 20 cards
        ]
    },
    'project-2': { desktop: [], mobile: [] },
    'project-3': { desktop: [], mobile: [] },
    'project-4': { desktop: [], mobile: [] },
    'process': {
        desktop: [
            // 4 process cards
        ],
        mobile: [
            // 4 process cards
        ]
    }
};

// Tooltip content for each section
const tooltipContent = {
    'project-1': [
        {
            category: 'BRIEF',
            date: '03.25',
            title: 'Si Punct Media',
            description: 'Built my own digital marketing agency from scratch with $0 budget...',
            goals: [
                'Launch a profitable digital marketing agency with zero upfront investment',
                'Create and sell digital marketing templates targeting underserved Social Media Managers in Moldova',
                'Build organic social media presence and establish market positioning in 30 days'
            ]
        }
        // ... more cards
    ],
    'project-2': [],
    'project-3': [],
    'project-4': [],
    'process': []
};

// Horizontal scroll tracking for projects
const horizontalScrollData = {};

// Process section scroll tracking
const processScrollData = {
    scrollY: 0,
    isActive: false,
    maxScroll: 400 // 4 cards * 100 units per card
};

// Navigation states for each section
const navigationStates = {};

// Global state
let globalState = {
    currentDevice: 'desktop',
    currentBreakpoint: 'desktop',
    isInitialized: false,
    activeSection: null,
    visibilityObserver: null
};

// ================================================
// DEVICE DETECTION & UTILITIES
// ================================================

function detectDevice() {
    // Detect if device is mobile or desktop
}

function getBreakpoint() {
    // Get current breakpoint based on window width
}

function isDesktop() {
    // Check if current device is desktop
}

function isMobile() {
    // Check if current device is mobile
}

function isTablet() {
    // Check if current device is tablet
}

// ================================================
// POSITION UTILITIES
// ================================================

function getPositionData(sectionId, cardIndex, device) {
    // Get position data for specific card
}

function calculateScrollProgress(scrollAmount, maxScroll) {
    // Calculate scroll progress (0-1)
}

function mapProgressToAnimationStep(progress) {
    // Map progress to animation step
}

function interpolateValues(from, to, progress) {
    // Interpolate between two values
}

function clampValue(value, min, max) {
    // Clamp value between min and max
}

// ================================================
// DOM UTILITIES
// ================================================

function getProjectCards(sectionId) {
    // Get all cards for a project section
}

function getProcessCards() {
    // Get all process cards
}

function createScrollZones(section) {
    // Create invisible scroll zones for desktop
}

function getElementCenter(element) {
    // Get center coordinates of element
}

function isElementInViewport(element, threshold = 0) {
    // Check if element is in viewport
}

// ================================================
// SCROLL UTILITIES
// ================================================

function normalizeScrollDelta(event) {
    // Normalize scroll delta across browsers
}

function calculateScrollDirection(currentScroll, previousScroll) {
    // Calculate scroll direction
}

function debounceScrollEvents(callback, delay) {
    // Debounce scroll events
}

function throttleAnimations(callback, delay) {
    // Throttle animation calls
}

// ================================================
// PERFORMANCE OPTIMIZATION
// ================================================

let performanceState = {
    visibleCards: new Set(),
    intersectionObserver: null,
    frameRate: 60,
    isOptimizing: false
};

function initPerformanceOptimizer() {
    // Initialize performance optimization system
}

function trackVisibleCards(sectionId) {
    // Track which cards are currently visible
}

function fadeOutExcessCards(sectionId, activeCardIndex) {
    // Fade out cards beyond the 10-card limit
}

function fadeInPreviousCards(sectionId, activeCardIndex) {
    // Fade in cards when scrolling back
}

function updateCardVisibility(sectionId) {
    // Update card visibility based on current state
}

function getVisibleCardIndices(sectionId, currentIndex) {
    // Get indices of cards that should be visible
}

// ================================================
// LAZY LOADING SYSTEM
// ================================================

function initLazyLoading() {
    // Initialize lazy loading with Intersection Observer
}

function setupIntersectionObserver() {
    // Set up intersection observer for lazy loading
}

function loadImageCard(cardElement) {
    // Load images for a specific card
}

function preloadUpcomingCards(sectionId, currentIndex, lookahead = 2) {
    // Preload upcoming cards
}

function optimizeImageSizes(cardElement) {
    // Optimize image sizes based on viewport
}

function handleImageLoad(imageElement) {
    // Handle image load completion
}

function handleImageError(imageElement) {
    // Handle image load error
}

// ================================================
// PERFORMANCE MONITORING
// ================================================

function monitorFrameRate() {
    // Monitor frame rate and optimize if needed
}

function optimizeScrollPerformance() {
    // Optimize scroll performance
}

function measurePerformance(label, fn) {
    // Measure function performance
}

function logPerformanceMetrics() {
    // Log performance metrics
}

// ================================================
// STATE MANAGEMENT
// ================================================

function updateGlobalState(key, value) {
    // Update global state
}

function getGlobalState(key) {
    // Get global state value
}

function resetGlobalState() {
    // Reset global state
}

function validateState(state) {
    // Validate state object
}

// ================================================
// EVENT UTILITIES
// ================================================

function createCustomEvent(eventName, detail) {
    // Create custom event
}

function dispatchCustomEvent(element, eventName, detail) {
    // Dispatch custom event
}

function addEventListenerOnce(element, event, callback) {
    // Add event listener that fires only once
}

function removeAllEventListeners(element) {
    // Remove all event listeners from element
}

// ================================================
// MATH UTILITIES
// ================================================

function lerp(start, end, factor) {
    // Linear interpolation
}

function easeInOut(t) {
    // Ease in-out function
}

function randomBetween(min, max) {
    // Random number between min and max
}

function roundToDecimal(number, decimals) {
    // Round number to specific decimal places
}

// ================================================
// BROWSER COMPATIBILITY
// ================================================

function supportsScrollBehavior() {
    // Check if browser supports smooth scroll behavior
}

function supportsIntersectionObserver() {
    // Check if browser supports Intersection Observer
}

function supportsPassiveEvents() {
    // Check if browser supports passive event listeners
}

function getVendorPrefix() {
    // Get vendor prefix for CSS properties
}

// ================================================
// INITIALIZATION HELPERS
// ================================================

function waitForElement(selector, timeout = 5000) {
    // Wait for element to exist in DOM
}

function waitForGSAP(timeout = 5000) {
    // Wait for GSAP to load
}

function initializeDataStructures() {
    // Initialize all data structures with default values
    
    // Initialize horizontal scroll data for each project section
    ['project-1', 'project-2', 'project-3', 'project-4'].forEach(sectionId => {
        horizontalScrollData[sectionId] = {
            scrollX: 0,
            isActive: false,
            maxScroll: 20 * 120, // 20 cards * 120 units per card
            currentCardIndex: 0,
            direction: 1 // 1 for forward, -1 for backward
        };
        
        // Initialize navigation states
        navigationStates[sectionId] = {
            isActive: false,
            currentIndex: 0,
            maxIndex: 19, // 0-19 for 20 cards
            prevButton: null,
            nextButton: null
        };
        
        // Initialize empty position arrays if not already defined
        if (!cardPositions[sectionId]) {
            cardPositions[sectionId] = { desktop: [], mobile: [] };
        }
        
        // Initialize empty tooltip content if not already defined
        if (!tooltipContent[sectionId]) {
            tooltipContent[sectionId] = [];
        }
    });
}

function validateInitialization() {
    // Validate that all systems are properly initialized
}

// ================================================
// DEBUG UTILITIES
// ================================================

function debugLog(message, data = null) {
    // Debug logging with conditional output
    if (CONFIG.DEBUG_MODE) {
        console.log(`[ProjectContainer] ${message}`, data);
    }
}

function debugError(message, error = null) {
    // Debug error logging
    console.error(`[ProjectContainer] ${message}`, error);
}

function debugState() {
    // Debug current state
}

function debugPerformance() {
    // Debug performance metrics
}

// ================================================
// INITIALIZATION
// ================================================

function initDataAndUtils() {
    // Initialize data structures and utilities
    
    globalState.currentDevice = detectDevice();
    globalState.currentBreakpoint = getBreakpoint();
    
    initializeDataStructures();
    initPerformanceOptimizer();
    initLazyLoading();
    
    // Set up global resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newDevice = detectDevice();
            const newBreakpoint = getBreakpoint();
            
            if (newDevice !== globalState.currentDevice || newBreakpoint !== globalState.currentBreakpoint) {
                globalState.currentDevice = newDevice;
                globalState.currentBreakpoint = newBreakpoint;
                
                // Dispatch device change event
                dispatchCustomEvent(document, 'deviceChanged', {
                    device: newDevice,
                    breakpoint: newBreakpoint
                });
            }
        }, 250);
    });
    
    globalState.isInitialized = true;
    console.log('Data and Utils initialized');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataAndUtils);
} else {
    initDataAndUtils();
}

// ================================================
// EXPORTS
// ================================================

export {
    CONFIG,
    cardPositions,
    tooltipContent,
    horizontalScrollData,
    processScrollData,
    navigationStates,
    globalState,
    
    // Device detection
    detectDevice,
    getBreakpoint,
    isDesktop,
    isMobile,
    isTablet,
    
    // Position utilities
    getPositionData,
    calculateScrollProgress,
    mapProgressToAnimationStep,
    interpolateValues,
    clampValue,
    
    // DOM utilities
    getProjectCards,
    getProcessCards,
    createScrollZones,
    getElementCenter,
    isElementInViewport,
    
    // Scroll utilities
    normalizeScrollDelta,
    calculateScrollDirection,
    debounceScrollEvents,
    throttleAnimations,
    
    // Performance
    initPerformanceOptimizer,
    trackVisibleCards,
    fadeOutExcessCards,
    fadeInPreviousCards,
    updateCardVisibility,
    initLazyLoading,
    loadImageCard,
    preloadUpcomingCards,
    optimizeImageSizes,
    monitorFrameRate,
    
    // State management
    updateGlobalState,
    getGlobalState,
    resetGlobalState,
    
    // Event utilities
    createCustomEvent,
    dispatchCustomEvent,
    addEventListenerOnce,
    
    // Math utilities
    lerp,
    easeInOut,
    
    // Debug utilities
    debugLog,
    debugError,
    debugState
};