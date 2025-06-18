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
    THROTTLE_DELAY: 32,          // ~30fps for heavy operations
    LAZY_LOAD_MARGIN: '50px',    // Intersection observer margin
    
    // Breakpoints (mobile-first approach)
    BREAKPOINTS: {
        mobile: 320,             // Minimum mobile width
        tablet: 768,             // Tablet breakpoint
        desktop: 1024,           // Desktop breakpoint
        large: 1440              // Large desktop
    },
    
    // Scroll zones
    LEFT_ZONE_WIDTH: 0.5,        // 50% of viewport
    RIGHT_ZONE_WIDTH: 0.5,       // 50% of viewport
    
    // Card positions (viewport units)
    INITIAL_POSITION_PROJECTS: { x: 110, y: 50, scale: 1, opacity: 0, rotation: 0 },
    INITIAL_POSITION_PROCESS: { x: 50, y: 110, scale: 1, opacity: 0, rotation: 0 },
    CENTER_POSITION: { x: 50, y: 50, scale: 1, opacity: 1, rotation: 0 },
    
    // Debug settings
    DEBUG_MODE: false,           // Set to true for debug logs
    PERFORMANCE_MONITORING: true, // Monitor performance metrics
    
    // Validation limits
    MAX_CARDS_PER_PROJECT: 20,
    MAX_CARDS_PER_PROCESS: 4,
    MAX_TOOLTIP_LENGTH: 1000,
    
    // Browser support fallbacks
    FALLBACK_ANIMATION_DURATION: 300,
    ENABLE_REDUCED_MOTION: true
};

// ================================================
// DATA STRUCTURES
// ================================================

// Card position data for each section
const cardPositions = {
    'project-1': {
        desktop: [
            { x: '-20', y: '-20', rotation: -30, scale: 0.7, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.8, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.8, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.8, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.82, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.81, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.78, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.8, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.82, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.79, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.8, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.8, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.82, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.8, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.78, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.8, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.8, opacity: 1 }
        ],
        mobile: [
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.65, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.7, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.7, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.65, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.65, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.67, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.55, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.5, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.5, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ]
    },
    'project-2': { 
        desktop: [
            // Different layout for project 2 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ], 
        mobile: [
            // Different layout for project 2 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ] 
    },
    'project-3': { 
        desktop: [
            // Tighter spiral layout for project 3
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ], 
        mobile: [
            // Tighter spiral layout for project 3
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ] 
    },
    'project-4': { 
        desktop: [
            // Different layout for project 4 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ], 
        mobile: [
            // Different layout for project 4 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ] 
    },
    'process': {
        desktop: [
            { x: 0, y: -15, scale: 0.9, opacity: 1, rotation: -2 },
            { x: 0, y: -5, scale: 0.95, opacity: 1, rotation: 1 },
            { x: 0, y: 5, scale: 0.92, opacity: 1, rotation: -1 },
            { x: 0, y: 15, scale: 0.88, opacity: 1, rotation: 2 }
        ],
        mobile: [
            { x: 0, y: -15, scale: 0.95, opacity: 1, rotation: -1 },
            { x: 0, y: -5, scale: 1.0, opacity: 1, rotation: 0 },
            { x: 0, y: 5, scale: 0.97, opacity: 1, rotation: 1 },
            { x: 0, y: 15, scale: 0.93, opacity: 1, rotation: -1 }
        ]
    }
};

// Tooltip content for each section (simplified structure)
const tooltipContent = {
    'project-1': [
        {
            name: 'Si Punct Media',
            description: 'Built my own digital marketing agency from scratch with $0 budget and grew it to profitability in under 30 days.'
        },
        {
            name: 'Market Research',
            description: 'Comprehensive analysis of the Moldovan social media management market to identify key opportunities and gaps.'
        },
        {
            name: 'Brand Identity',
            description: 'Created a compelling visual identity that resonates with underserved social media managers in Moldova.'
        },
        {
            name: 'Template Creation',
            description: 'Designed and developed digital marketing templates specifically targeting social media managers needs.'
        },
        {
            name: 'Launch Strategy',
            description: 'Executed a zero-budget launch strategy focusing on organic growth and community building.'
        }
        // ... up to 20 cards total
    ],
    'project-2': [
        // Will be populated with project-2 specific content
    ],
    'project-3': [
        // Will be populated with project-3 specific content
    ],
    'project-4': [
        // Will be populated with project-4 specific content
    ]
};

// Scroll tracking data
const horizontalScrollData = {};
const processScrollData = {
    scrollY: 0,
    isActive: false,
    maxScroll: CONFIG.MAX_CARDS_PER_PROCESS * 100,
    currentCardIndex: 0,
    scrollDirection: 1
};

// Navigation states
const navigationStates = new Map();

// Global state with validation
let globalState = {
    currentDevice: 'desktop',
    currentBreakpoint: 'desktop',
    isInitialized: false,
    activeSection: null,
    lastUpdate: 0,
    visibilityObserver: null,
    resizeObserver: null,
    performanceMetrics: {
        frameRate: 60,
        averageFrameTime: 16.67,
        droppedFrames: 0
    }
};

// ================================================
// VALIDATION UTILITIES
// ================================================

function validatePosition(position) {
    if (!position || typeof position !== 'object') return false;
    
    const required = ['x', 'y', 'scale', 'opacity', 'rotation'];
    return required.every(prop => typeof position[prop] === 'number' && !isNaN(position[prop]));
}

function validateSectionId(sectionId) {
    if (!sectionId || typeof sectionId !== 'string') return false;
    return /^(project-[1-4]|process)$/.test(sectionId);
}

function sanitizeNumber(value, min = -Infinity, max = Infinity) {
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    return Math.max(min, Math.min(max, num));
}

function sanitizeString(str, maxLength = 1000) {
    if (typeof str !== 'string') return '';
    return str.slice(0, maxLength).replace(/[<>]/g, ''); // Basic XSS prevention
}

// ================================================
// DEVICE DETECTION & RESPONSIVE UTILITIES
// ================================================

let cachedDevice = null;
let lastDeviceCheck = 0;
const DEVICE_CHECK_THROTTLE = 100; // ms

function detectDevice() {
    const now = Date.now();
    
    // Return cached result if recently checked
    if (cachedDevice && (now - lastDeviceCheck) < DEVICE_CHECK_THROTTLE) {
        return cachedDevice;
    }
    
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let device;
    
    if (width < CONFIG.BREAKPOINTS.tablet) {
        device = 'mobile';
    } else if (width < 900) {  // CHANGE THIS: Lower threshold for desktop
        device = 'tablet';
    } else {
        device = 'desktop';
    }
    
    // FORCE DESKTOP FOR TESTING
    device = 'desktop';
    
    cachedDevice = device;
    lastDeviceCheck = now;
    
    console.log(`📏 Viewport: ${width}px, Device: ${device}`);
    return device;
}

function getBreakpoint() {
    const width = window.innerWidth;
    
    if (width >= CONFIG.BREAKPOINTS.large) return 'large';
    if (width >= CONFIG.BREAKPOINTS.desktop) return 'desktop';
    if (width >= CONFIG.BREAKPOINTS.tablet) return 'tablet';
    return 'mobile';
}

function isDesktop() {
    return detectDevice() === 'desktop';
}

function isMobile() {
    return detectDevice() === 'mobile';
}

function isTablet() {
    return detectDevice() === 'tablet';
}

function supportsHover() {
    return window.matchMedia('(hover: hover)').matches;
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ================================================
// POSITION & ANIMATION UTILITIES
// ================================================

function getPositionData(sectionId, cardIndex, device) {
    if (!validateSectionId(sectionId)) {
        console.warn(`Invalid section ID: ${sectionId}`);
        return CONFIG.CENTER_POSITION;
    }
    
    const positions = cardPositions[sectionId];
    if (!positions) return CONFIG.CENTER_POSITION;
    
    const devicePositions = positions[device] || positions['desktop'] || [];
    const position = devicePositions[cardIndex];
    
    if (!position || !validatePosition(position)) {
        console.warn(`Invalid position for ${sectionId}[${cardIndex}] on ${device}`);
        return CONFIG.CENTER_POSITION;
    }
    
    return { ...position }; // Return copy to prevent mutation
}

function calculateScrollProgress(scrollAmount, maxScroll) {
    const safeMaxScroll = Math.max(1, maxScroll); // Prevent division by zero
    return Math.max(0, Math.min(1, scrollAmount / safeMaxScroll));
}

function mapProgressToAnimationStep(progress) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    if (clampedProgress <= 0.5) {
        return { step: 'toCenter', progress: clampedProgress * 2 };
    } else {
        return { step: 'toFinal', progress: (clampedProgress - 0.5) * 2 };
    }
}

function interpolateValues(from, to, progress) {
    const t = Math.max(0, Math.min(1, progress));
    return from + (to - from) * t;
}

function clampValue(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// ================================================
// DOM UTILITIES
// ================================================

function getProjectCards(sectionId) {
    if (!validateSectionId(sectionId) || sectionId === 'process') {
        return [];
    }
    
    const section = document.getElementById(sectionId);
    if (!section) return [];
    
    return Array.from(section.querySelectorAll('.item.card, .project-card'));
}

function getProcessCards() {
    const section = document.getElementById('process');
    if (!section) return [];
    
    return Array.from(section.querySelectorAll('.item.card, .process-card'));
}

function createScrollZones(sectionId) {
    if (!validateSectionId(sectionId)) return null;
    
    const container = document.createElement('div');
    container.className = 'scroll-zones-container';
    container.dataset.section = sectionId;
    
    const leftZone = document.createElement('div');
    leftZone.className = 'scroll-zone scroll-zone-left';
    leftZone.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 50;
        height: 100;
        pointer-events: auto;
        z-index: 5;
    `;
    
    const rightZone = document.createElement('div');
    rightZone.className = 'scroll-zone scroll-zone-right';
    rightZone.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 50;
        height: 100;
        pointer-events: auto;
        z-index: 5;
    `;
    
    container.appendChild(leftZone);
    container.appendChild(rightZone);
    
    return { container, leftZone, rightZone };
}

function getElementCenter(element) {
    if (!element) return { x: 0, y: 0 };
    
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function isElementInViewport(element, threshold = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    return (
        rect.top < viewportHeight * (1 + threshold) &&
        rect.bottom > viewportHeight * -threshold &&
        rect.left < viewportWidth * (1 + threshold) &&
        rect.right > viewportWidth * -threshold
    );
}

// ================================================
// SCROLL UTILITIES
// ================================================

function normalizeScrollDelta(event) {
    // Normalize scroll delta across browsers and devices
    let delta = 0;
    
    if (event.deltaY !== undefined) {
        delta = event.deltaY;
    } else if (event.wheelDelta !== undefined) {
        delta = -event.wheelDelta;
    } else if (event.detail !== undefined) {
        delta = event.detail * 40;
    }
    
    // Clamp extreme values
    return clampValue(delta, -1000, 1000);
}

function calculateScrollDirection(currentScroll, previousScroll) {
    const delta = currentScroll - previousScroll;
    if (Math.abs(delta) < 1) return 0; // No significant change
    return delta > 0 ? 1 : -1;
}

// Debounce function factory with memory cleanup
function createDebounce() {
    const timeouts = new Map();
    
    return function debounce(func, delay, key = 'default') {
        if (timeouts.has(key)) {
            clearTimeout(timeouts.get(key));
        }
        
        const timeout = setTimeout(() => {
            timeouts.delete(key);
            func();
        }, delay);
        
        timeouts.set(key, timeout);
    };
}

const debouncer = createDebounce();

function debounceScrollEvents(func, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function throttleAnimations(func, delay) {
    let lastCall = 0;
    
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// ================================================
// PERFORMANCE OPTIMIZATION
// ================================================

let visibilityObserver = null;
let performanceObserver = null;

function initPerformanceOptimizer() {
    // Initialize Intersection Observer for card visibility
    if ('IntersectionObserver' in window) {
        visibilityObserver = new IntersectionObserver(
            handleVisibilityChange,
            {
                threshold: [0, 0.1, 0.5, 0.9, 1],
                rootMargin: CONFIG.LAZY_LOAD_MARGIN
            }
        );
        
        globalState.visibilityObserver = visibilityObserver;
    }
    
    // Initialize Performance Observer if available
    if ('PerformanceObserver' in window && CONFIG.PERFORMANCE_MONITORING) {
        try {
            performanceObserver = new PerformanceObserver(handlePerformanceEntries);
            performanceObserver.observe({ entryTypes: ['measure', 'navigation'] });
        } catch (error) {
            console.warn('Performance Observer not supported:', error);
        }
    }
    
    // Initialize frame rate monitoring
    if (CONFIG.PERFORMANCE_MONITORING) {
        monitorFrameRate();
    }
}

function handleVisibilityChange(entries) {
    entries.forEach(entry => {
        const element = entry.target;
        const isVisible = entry.isIntersecting;
        
        element.dataset.visible = isVisible;
        
        if (isVisible) {
            // Element became visible
            element.classList.add('in-viewport');
        } else {
            // Element left viewport
            element.classList.remove('in-viewport');
        }
    });
}

function handlePerformanceEntries(entries) {
    entries.getEntries().forEach(entry => {
        if (entry.entryType === 'measure') {
            debugLog(`Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
    });
}

function trackVisibleCards() {
    if (!visibilityObserver) return [];
    
    const cards = document.querySelectorAll('.item.card[data-visible="true"]');
    return Array.from(cards);
}

function fadeOutExcessCards() {
    const visibleCards = trackVisibleCards();
    
    if (visibleCards.length > CONFIG.MAX_VISIBLE_CARDS) {
        const excess = visibleCards.slice(0, visibleCards.length - CONFIG.MAX_VISIBLE_CARDS);
        excess.forEach(card => {
            card.style.opacity = '0.1';
            card.style.pointerEvents = 'none';
        });
    }
}

function fadeInPreviousCards() {
    const hiddenCards = document.querySelectorAll('.item.card[style*="opacity: 0.1"]');
    hiddenCards.forEach(card => {
        card.style.opacity = '';
        card.style.pointerEvents = '';
    });
}

function updateCardVisibility(cardElement, isVisible) {
    if (!cardElement) return;
    
    if (isVisible) {
        if (visibilityObserver) {
            visibilityObserver.observe(cardElement);
        }
    } else {
        if (visibilityObserver) {
            visibilityObserver.unobserve(cardElement);
        }
    }
}

// Lazy loading system
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (visibilityObserver) {
        images.forEach(img => visibilityObserver.observe(img));
    }
}

function loadImageCard(cardElement) {
    const images = cardElement.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.onload = () => img.classList.add('loaded');
    });
}

function preloadUpcomingCards(sectionId, currentIndex, lookahead = 2) {
    const cards = getProjectCards(sectionId);
    
    for (let i = currentIndex + 1; i <= currentIndex + lookahead && i < cards.length; i++) {
        const card = cards[i];
        if (card) loadImageCard(card);
    }
}

function optimizeImageSizes() {
    const images = document.querySelectorAll('.item.card img');
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    images.forEach(img => {
        if (img.dataset.optimized) return;
        
        const rect = img.getBoundingClientRect();
        const optimalWidth = Math.ceil(rect.width * devicePixelRatio);
        const optimalHeight = Math.ceil(rect.height * devicePixelRatio);
        
        // Only resize if significantly different
        if (Math.abs(img.naturalWidth - optimalWidth) > 50) {
            img.style.maxWidth = `${optimalWidth}px`;
            img.style.maxHeight = `${optimalHeight}px`;
        }
        
        img.dataset.optimized = 'true';
    });
}

// Frame rate monitoring
let frameCount = 0;
let lastFrameTime = performance.now();

function monitorFrameRate() {
    const currentTime = performance.now();
    frameCount++;
    
    if (currentTime - lastFrameTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastFrameTime));
        
        globalState.performanceMetrics.frameRate = fps;
        globalState.performanceMetrics.averageFrameTime = (currentTime - lastFrameTime) / frameCount;
        
        if (fps < 30) {
            globalState.performanceMetrics.droppedFrames++;
            console.warn(`Low frame rate detected: ${fps}fps`);
        }
        
        frameCount = 0;
        lastFrameTime = currentTime;
    }
    
    requestAnimationFrame(monitorFrameRate);
}

// ================================================
// STATE MANAGEMENT
// ================================================

function updateGlobalState(key, value) {
    if (!key || typeof key !== 'string') {
        console.error('Invalid state key provided');
        return false;
    }
    
    const previousValue = globalState[key];
    globalState[key] = value;
    globalState.lastUpdate = Date.now();
    
    // Dispatch state change event if value actually changed
    if (previousValue !== value) {
        document.dispatchEvent(new CustomEvent('globalStateChange', {
            detail: { key, value, previousValue }
        }));
    }
    
    return true;
}

function getGlobalState(key) {
    if (!key) return { ...globalState }; // Return copy of entire state
    return globalState[key];
}

function resetGlobalState() {
    const initialState = {
        currentDevice: detectDevice(),
        currentBreakpoint: getBreakpoint(),
        isInitialized: false,
        activeSection: null,
        lastUpdate: Date.now(),
        visibilityObserver: globalState.visibilityObserver, // Keep observer
        resizeObserver: globalState.resizeObserver,
        performanceMetrics: {
            frameRate: 60,
            averageFrameTime: 16.67,
            droppedFrames: 0
        }
    };
    
    Object.assign(globalState, initialState);
    
    document.dispatchEvent(new CustomEvent('globalStateReset'));
}

// ================================================
// EVENT UTILITIES
// ================================================

function createCustomEvent(eventName, detail = {}) {
    return new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true
    });
}

function dispatchCustomEvent(element, eventName, detail = {}) {
    const event = createCustomEvent(eventName, detail);
    return element.dispatchEvent(event);
}

function addEventListenerOnce(element, eventType, callback) {
    const wrappedCallback = (event) => {
        callback(event);
        element.removeEventListener(eventType, wrappedCallback);
    };
    
    element.addEventListener(eventType, wrappedCallback);
    return wrappedCallback;
}

// ================================================
// MATH UTILITIES
// ================================================

function lerp(start, end, factor) {
    return start + (end - start) * clampValue(factor, 0, 1);
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function roundToDecimal(number, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(number * factor) / factor;
}

// ================================================
// DEBUG UTILITIES
// ================================================

function debugLog(message, data = null) {
    if (CONFIG.DEBUG_MODE) {
        console.log(`[ProjectContainer] ${message}`, data);
    }
}

function debugError(message, error = null) {
    console.error(`[ProjectContainer] ${message}`, error);
}

function debugState() {
    console.table({
        'Current Device': globalState.currentDevice,
        'Current Breakpoint': globalState.currentBreakpoint,
        'Active Section': globalState.activeSection,
        'Frame Rate': globalState.performanceMetrics.frameRate,
        'Dropped Frames': globalState.performanceMetrics.droppedFrames,
        'Initialized': globalState.isInitialized
    });
}

// ================================================
// INITIALIZATION
// ================================================

function initializeDataStructures() {
    // Initialize project sections data
    ['project-1', 'project-2', 'project-3', 'project-4'].forEach(sectionId => {
        // Initialize horizontal scroll data
        horizontalScrollData[sectionId] = {
            scrollX: 0,
            isActive: false,
            maxScroll: CONFIG.MAX_CARDS_PER_PROJECT * 120,
            currentCardIndex: 0,
            direction: 1,
            lastUpdate: 0
        };
        
        // Initialize navigation states
        navigationStates[sectionId] = {
            isActive: false,
            currentIndex: 0,
            maxIndex: CONFIG.MAX_CARDS_PER_PROJECT - 1,
            prevButton: null,
            nextButton: null,
            canGoNext: true,
            canGoPrev: false
        };
        
        // Ensure position arrays exist
        if (!cardPositions[sectionId]) {
            cardPositions[sectionId] = { desktop: [], mobile: [] };
        }
        
        // Ensure tooltip content exists
        if (!tooltipContent[sectionId]) {
            tooltipContent[sectionId] = [];
        }
    });
    
    debugLog('Data structures initialized');
}

function initDataAndUtils() {
    debugLog('Initializing Data and Utils...');
    
    try {
        // Set initial device state
        globalState.currentDevice = detectDevice();
        globalState.currentBreakpoint = getBreakpoint();
        
        // Initialize data structures
        initializeDataStructures();
        
        // Initialize performance systems
        initPerformanceOptimizer();
        initLazyLoading();
        
        // Setup resize handler with debouncing
        const resizeHandler = debounceScrollEvents(() => {
            const newDevice = detectDevice();
            const newBreakpoint = getBreakpoint();
            
            if (newDevice !== globalState.currentDevice || newBreakpoint !== globalState.currentBreakpoint) {
                updateGlobalState('currentDevice', newDevice);
                updateGlobalState('currentBreakpoint', newBreakpoint);
                
                dispatchCustomEvent(document, 'deviceChanged', {
                    device: newDevice,
                    breakpoint: newBreakpoint
                });
            }
        }, 250);
        
        window.addEventListener('resize', resizeHandler);
        
        // Mark as initialized
        globalState.isInitialized = true;
        globalState.lastUpdate = Date.now();
        
        debugLog('✅ Data and Utils initialized successfully');
        return true;
        
    } catch (error) {
        debugError('Failed to initialize Data and Utils:', error);
        return false;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataAndUtils);
} else {
    initDataAndUtils();
}

// ================================================
// CLEANUP
// ================================================

function destroyDataAndUtils() {
    debugLog('Destroying Data and Utils...');
    
    // Cleanup observers
    if (visibilityObserver) {
        visibilityObserver.disconnect();
        visibilityObserver = null;
    }
    
    if (performanceObserver) {
        performanceObserver.disconnect();
        performanceObserver = null;
    }
    
    // Clear data structures
    Object.keys(horizontalScrollData).forEach(key => delete horizontalScrollData[key]);
    Object.keys(navigationStates).forEach(key => delete navigationStates[key]);
    
    // Reset global state
    resetGlobalState();
    
    debugLog('✅ Data and Utils destroyed');
}

function getFinalPositions(sectionId) {
    const device = isDesktop() ? 'desktop' : 'mobile';
    return cardPositions[sectionId]?.[device] || [];
}

// ================================================
// EXPORTS
// ================================================

export {
    // Configuration
    CONFIG,
    
    // Data structures
    cardPositions,
    getFinalPositions,
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
    supportsHover,
    prefersReducedMotion,
    
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
    
    // Performance optimization
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
    randomBetween,
    roundToDecimal,
    
    // Validation
    validatePosition,
    validateSectionId,
    sanitizeNumber,
    sanitizeString,
    
    // Initialization & cleanup
    initDataAndUtils,
    destroyDataAndUtils,
    
    // Debug utilities
    debugLog,
    debugError,
    debugState
};