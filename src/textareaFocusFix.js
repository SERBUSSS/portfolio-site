/**
 * Refined Textarea Focus Fix
 * This script fixes the textarea focus behavior, ensuring focused state is hidden by default
 * and appears correctly when the textarea is clicked
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing refined textarea focus fix');
    
    // First, ensure all editing views are hidden on initial load
    resetAllEditingViews();
    
    // Set up proper event listeners for the textareas
    setupEnhancedTextareaListeners();
    
    // Ensure the fix runs after the form is opened
    setupFormOpenListener();
});

/**
 * Reset all editing views to hidden state
 */
function resetAllEditingViews() {
    console.log('Resetting all editing views to hidden state');
    
    // Get all editing views
    const editingViews = document.querySelectorAll('.editing-view');
    
    // Hide all editing views
    editingViews.forEach(view => {
        view.classList.add('hidden');
    });
    
    // Ensure all textarea containers are visible
    const textareaContainers = document.querySelectorAll('.textarea-container');
    textareaContainers.forEach(container => {
        container.classList.remove('hidden');
    });
    
    // Update status indicators for filled textareas
    const textareas = document.querySelectorAll('.textarea-container textarea');
    textareas.forEach(textarea => {
        if (textarea.value.trim() !== '') {
            const container = textarea.closest('.question-container');
            if (container) {
                const statusElement = container.querySelector('.question-status');
                if (statusElement) {
                    statusElement.classList.remove('hidden');
                }
            }
        }
    });
}

/**
 * Set up enhanced event listeners for textareas
 */
function setupEnhancedTextareaListeners() {
    console.log('Setting up enhanced textarea listeners');
    
    // For normal textareas - expand when clicked
    const textareas = document.querySelectorAll('.textarea-container textarea');
    textareas.forEach(textarea => {
        // Clear existing listeners by replacing the element
        const newTextarea = textarea.cloneNode(true);
        textarea.parentNode.replaceChild(newTextarea, textarea);
        
        // Add the focus/click listener
        newTextarea.addEventListener('focus', function(e) {
            showFocusedState(this);
            e.preventDefault(); // Prevent default to avoid keyboard immediately popping up on mobile
        });
        
        newTextarea.addEventListener('click', function(e) {
            showFocusedState(this);
            e.preventDefault(); // Prevent default to handle the behavior ourselves
        });
        
        // Handle touch events specifically for mobile
        newTextarea.addEventListener('touchend', function(e) {
            showFocusedState(this);
            e.preventDefault(); // Prevent default
        });
    });
    
    // For mark-as-done buttons - collapse when clicked
    const markDoneButtons = document.querySelectorAll('.mark-as-done');
    markDoneButtons.forEach(button => {
        // Clear existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add the click listener
        newButton.addEventListener('click', function() {
            hideFocusedState(this);
        });
    });
}

/**
 * Show the focused state for a textarea
 * @param {HTMLElement} textarea - The textarea that was clicked
 */
function showFocusedState(textarea) {
    console.log('Showing focused state');
    
    // Get the question container
    const container = textarea.closest('.question-container');
    if (!container) return;
    
    // Hide the textarea container
    const textareaContainer = container.querySelector('.textarea-container');
    if (textareaContainer) {
        textareaContainer.classList.add('hidden');
    }
    
    // Show the editing view
    const editingView = container.querySelector('.editing-view');
    if (editingView) {
        editingView.classList.remove('hidden');
        
        // Get editing textarea
        const editingTextarea = editingView.querySelector('textarea');
        if (editingTextarea) {
            // Copy the value from the original textarea
            editingTextarea.value = textarea.value;
            
            // Set appropriate height
            const optimalHeight = calculateOptimalHeight(editingTextarea);
            editingTextarea.style.height = optimalHeight + 'px';
            
            // Focus the textarea
            setTimeout(() => {
                editingTextarea.focus();
                
                // On mobile, scroll to make sure the textarea is visible
                if (window.innerWidth < 768) {
                    const scrollOptions = {
                        behavior: 'smooth',
                        block: 'center'
                    };
                    
                    // Scroll the editing view into view
                    editingView.scrollIntoView(scrollOptions);
                }
            }, 50);
            
            // Setup input event for auto-resizing
            editingTextarea.addEventListener('input', function() {
                // Auto-resize as the user types
                const newHeight = calculateOptimalHeight(this);
                this.style.height = newHeight + 'px';
            });
        }
    }
}

/**
 * Hide the focused state and return to normal view
 * @param {HTMLElement} button - The mark-as-done button that was clicked
 */
function hideFocusedState(button) {
    console.log('Hiding focused state');
    
    // Get the question container
    const container = button.closest('.question-container');
    if (!container) return;
    
    // Get text from editing textarea
    const editingTextarea = container.querySelector('.editing-view textarea');
    if (!editingTextarea) return;
    
    const textValue = editingTextarea.value.trim();
    
    // Update the original textarea
    const originalTextarea = container.querySelector('.textarea-container textarea');
    if (originalTextarea) {
        originalTextarea.value = textValue;
        
        // Trigger input event for validation
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        originalTextarea.dispatchEvent(inputEvent);
    }
    
    // Hide editing view
    const editingView = container.querySelector('.editing-view');
    if (editingView) {
        editingView.classList.add('hidden');
    }
    
    // Show textarea container
    const textareaContainer = container.querySelector('.textarea-container');
    if (textareaContainer) {
        textareaContainer.classList.remove('hidden');
    }
    
    // Update completion status
    const statusElement = container.querySelector('.question-status');
    if (statusElement) {
        if (textValue) {
            statusElement.classList.remove('hidden');
            
            // Animate status appearance if GSAP is available
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(statusElement,
                    { opacity: 0, y: -10 },
                    { opacity: 1, y: 0, duration: 0.3 }
                );
            }
        } else {
            statusElement.classList.add('hidden');
        }
    }
}

/**
 * Calculate optimal height for a textarea based on content
 * @param {HTMLElement} textarea - The textarea to calculate height for
 * @returns {number} The optimal height in pixels
 */
function calculateOptimalHeight(textarea) {
    // Reset height to auto to get proper scrollHeight
    textarea.style.height = 'auto';
    
    // Get content height
    const contentHeight = textarea.scrollHeight;
    
    // Calculate maximum height (mobile-aware)
    const isMobile = window.innerWidth < 768;
    const maxHeight = isMobile ? window.innerHeight * 0.4 : window.innerHeight * 0.5;
    
    // Use the smaller of content height or max height
    return Math.min(contentHeight, maxHeight);
}

/**
 * Set up listener for form open event
 */
function setupFormOpenListener() {
    // Listen for clicks on form open buttons
    const formOpenButtons = document.querySelectorAll('[data-open-form="true"]');
    formOpenButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Wait for form to open, then reset textareas
            setTimeout(() => {
                resetAllEditingViews();
                setupEnhancedTextareaListeners();
            }, 500);
        });
    });
}

// Make functions available globally for debugging
window.textareaFix = {
    resetAllEditingViews,
    setupEnhancedTextareaListeners,
    showFocusedState,
    hideFocusedState
};