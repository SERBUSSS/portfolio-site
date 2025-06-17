// ================================================
// UI COMPONENTS - Tooltips & Navigation
// ================================================

import { tooltipContent, navigationStates, CONFIG, isDesktop, isMobile, getBreakpoint } from './dataAndUtils.js';
import { handleProjectCardScroll, handleProcessCardScroll } from './sectionManagers.js';

// ================================================
// TOOLTIP MANAGEMENT
// ================================================

const tooltipStates = {};

function initTooltips() {
    // Initialize tooltip system for all sections
}

function showTooltip(sectionId, delay = 500) {
    // Show tooltip with fade in animation
}

function hideTooltip(sectionId) {
    // Hide tooltip with fade out animation
}

function updateTooltipContent(sectionId, cardIndex) {
    // Update tooltip content based on current card
}

function createTooltipElement(sectionId) {
    // Create tooltip DOM element
}

// ================================================
// TOOLTIP POSITIONING
// ================================================

function positionTooltip(sectionId) {
    // Position tooltip based on device and section
}

function adjustTooltipForDevice(sectionId) {
    // Adjust tooltip positioning for current device
}

function handleTooltipResize() {
    // Handle tooltip repositioning on window resize
}

function getTooltipPosition(sectionId, device) {
    // Get optimal tooltip position
}

// ================================================
// TOOLTIP CONTENT MANAGEMENT
// ================================================

function getTooltipContent(sectionId, cardIndex) {
    // Get tooltip content for specific card
}

function validateTooltipContent(content) {
    // Validate tooltip content structure
}

function preloadTooltipImages(sectionId) {
    // Preload images used in tooltips
}

function renderTooltipContent(content) {
    // Render tooltip content HTML
}

// ================================================
// NAVIGATION SYSTEM
// ================================================

function initNavigation() {
    // Initialize navigation system for all sections
}

function createNavigationButtons(sectionId) {
    // Create prev/next navigation buttons
}

function positionNavigationButtons(sectionId, device) {
    // Position navigation buttons based on device
    // Desktop: beside tooltip
    // Mobile: bottom of screen
}

function createNavigationButton(type, sectionId) {
    // Create individual navigation button (prev/next)
}

// ================================================
// NAVIGATION CONTROL
// ================================================

function showNavigation(sectionId) {
    // Show navigation buttons with fade in
}

function hideNavigation(sectionId) {
    // Hide navigation buttons with fade out
}

function updateButtonStates(sectionId, cardIndex, totalCards) {
    // Update button states (enabled/disabled)
}

function enableNavigationButton(button) {
    // Enable navigation button
}

function disableNavigationButton(button) {
    // Disable navigation button
}

// ================================================
// NAVIGATION ACTIONS
// ================================================

function handlePrevClick(sectionId) {
    // Handle previous button click
}

function handleNextClick(sectionId) {
    // Handle next button click
}

function handleNavigationKeyboard(event, sectionId) {
    // Handle keyboard navigation (arrow keys)
}

function triggerNavigationScroll(sectionId, direction) {
    // Trigger scroll animation for navigation
}

// ================================================
// NAVIGATION UTILITIES
// ================================================

function getNavigationElements(sectionId) {
    // Get navigation button elements
}

function isNavigationEnabled(sectionId) {
    // Check if navigation is enabled for section
}

function getCardNavigationLimits(sectionId) {
    // Get min/max card indices for navigation
}

// ================================================
// UI STATE MANAGEMENT
// ================================================

function updateUIState(sectionId, cardIndex) {
    // Update UI state (tooltip + navigation)
}

function getUIState(sectionId) {
    // Get current UI state
}

function resetUIState(sectionId) {
    // Reset UI state for section
}

// ================================================
// RESPONSIVE BEHAVIOR
// ================================================

function handleUIResize() {
    // Handle UI resize for responsive behavior
}

function adaptUIForDevice(device) {
    // Adapt UI elements for current device
}

function updateUIBreakpoint(breakpoint) {
    // Update UI for breakpoint change
}

// ================================================
// ANIMATION HELPERS
// ================================================

function fadeInElement(element, duration = 300) {
    // Fade in UI element
}

function fadeOutElement(element, duration = 300) {
    // Fade out UI element
}

function slideInElement(element, direction, duration = 300) {
    // Slide in UI element
}

function slideOutElement(element, direction, duration = 300) {
    // Slide out UI element
}

// ================================================
// EVENT HANDLERS
// ================================================

function setupTooltipEvents(sectionId) {
    // Set up tooltip event listeners
    const tooltip = document.getElementById(`tooltip-${sectionId}`);
    if (!tooltip) return;
    
    // Hover events for tooltip
    tooltip.addEventListener('mouseenter', () => {
        // Handle tooltip hover
    });
    
    tooltip.addEventListener('mouseleave', () => {
        // Handle tooltip leave
    });
}

function setupNavigationEvents(sectionId) {
    // Set up navigation event listeners
    const prevBtn = document.querySelector(`[data-section="${sectionId}"][data-direction="prev"]`);
    const nextBtn = document.querySelector(`[data-section="${sectionId}"][data-direction="next"]`);
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handlePrevClick(sectionId);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleNextClick(sectionId);
        });
    }
    
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (navigationStates[sectionId]?.isActive) {
            handleNavigationKeyboard(e, sectionId);
        }
    });
}

// ================================================
// UI INTEGRATION
// ================================================

function integrateWithSections() {
    // Integrate UI components with section managers
}

function syncUIWithAnimations(sectionId, cardIndex) {
    // Sync UI state with card animations
}

function handleSectionTransition(fromSection, toSection) {
    // Handle UI during section transitions
}

// ================================================
// UI TEMPLATES
// ================================================

function createTooltipTemplate(sectionId) {
    // Create tooltip HTML template
    return `
        <div id="tooltip-${sectionId}" class="project-tooltip hidden">
            <div class="tooltip-content">
                <div class="tooltip-header">
                    <span class="tooltip-category"></span>
                    <span class="tooltip-date"></span>
                </div>
                <h3 class="tooltip-title"></h3>
                <p class="tooltip-description"></p>
                <div class="tooltip-goals">
                    <h4>Project Goals:</h4>
                    <ul class="tooltip-goals-list"></ul>
                </div>
            </div>
        </div>
    `;
}

function createNavigationTemplate(sectionId) {
    // Create navigation HTML template
    return `
        <div class="project-navigation" data-section="${sectionId}">
            <button class="nav-btn nav-btn-prev" data-section="${sectionId}" data-direction="prev">
                <svg width="32" height="32" viewBox="0 0 25 24" fill="none">
                    <path d="M22.5002 11L22.5004 13L6.32845 13L10.2782 16.9496L8.864 18.3638L2.5 12L8.864 5.63604L10.2782 7.05025L6.32845 11L22.5002 11Z" fill="#FFFDFF"/>
                </svg>
            </button>
            <span class="nav-helper-text">you can also drag left/right to explore</span>
            <button class="nav-btn nav-btn-next" data-section="${sectionId}" data-direction="next">
                <svg width="32" height="32" viewBox="0 0 25 24" fill="none">
                    <path d="M2.49977 13.0001L2.49963 11.0002H18.6715L14.7218 7.05044L16.136 5.63623L22.5 12.0002L16.136 18.3642L14.7218 16.9499L18.6716 13.0002L2.49977 13.0001Z" fill="#FFFDFF"/>
                </svg>
            </button>
        </div>
    `;
}

// ================================================
// INITIALIZATION
// ================================================

function initUIComponents() {
    // Main initialization function
    
    // Initialize tooltips for all project sections
    const projectSections = document.querySelectorAll('.project-section[id^="project-"]');
    projectSections.forEach(section => {
        const sectionId = section.id;
        
        // Initialize tooltip state
        tooltipStates[sectionId] = {
            isVisible: false,
            currentCardIndex: 0,
            element: null,
            content: {}
        };
        
        // Initialize navigation state
        navigationStates[sectionId] = {
            isActive: false,
            currentIndex: 0,
            maxIndex: 0,
            prevButton: null,
            nextButton: null
        };
        
        // Create UI elements
        createTooltipElement(sectionId);
        createNavigationButtons(sectionId);
        
        // Set up events
        setupTooltipEvents(sectionId);
        setupNavigationEvents(sectionId);
    });
    
    // Global resize handler
    window.addEventListener('resize', () => {
        handleUIResize();
        handleTooltipResize();
    });
    
    console.log('UI Components initialized');
}

// ================================================
// EXPORTS
// ================================================

export {
    initUIComponents,
    showTooltip,
    hideTooltip,
    updateTooltipContent,
    positionTooltip,
    showNavigation,
    hideNavigation,
    updateButtonStates,
    handlePrevClick,
    handleNextClick,
    triggerNavigationScroll,
    updateUIState,
    resetUIState,
    handleUIResize,
    syncUIWithAnimations,
    tooltipStates,
    navigationStates,
    createTooltipTemplate,
    createNavigationTemplate
};