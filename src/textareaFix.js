/**
 * Textarea Focus and Mark as Done Fix
 * This script specifically addresses the textarea focus and mark as done functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing textarea focus fix');
    
    // Force reset all textareas to initial state
    initializeAllTextareas();
    
    // Setup proper event listeners for expanding/collapsing
    setupTextareaInteractions();
});

/**
 * Reset all textareas to initial state
 */
function initializeAllTextareas() {
    console.log('Resetting all textareas to initial state');
    
    // Find all editing views and hide them
    const editingViews = document.querySelectorAll('.editing-view');
    editingViews.forEach(view => {
        view.classList.add('hidden');
    });
    
    // Make sure all textarea containers are visible
    const textareaContainers = document.querySelectorAll('.textarea-container');
    textareaContainers.forEach(container => {
        container.classList.remove('hidden');
    });
    
    // Reset all textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        // Remove focus
        textarea.blur();
        
        // Reset height
        textarea.style.height = 'auto';
        
        // Update completion status indicator if textarea has content
        if (textarea.value.trim()) {
            const questionContainer = textarea.closest('.question-container');
            if (questionContainer) {
                const statusElement = questionContainer.querySelector('.question-status');
                if (statusElement) {
                    statusElement.classList.remove('hidden');
                }
            }
        }
    });
}

/**
 * Setup proper event listeners for textareas
 */
function setupTextareaInteractions() {
    console.log('Setting up textarea interactions');
    
    // Clear existing event listeners for all textareas
    const textareas = document.querySelectorAll('.textarea-container textarea');
    textareas.forEach(textarea => {
        const newTextarea = textarea.cloneNode(true);
        textarea.parentNode.replaceChild(newTextarea, textarea);
        
        // Add focus event listener to expand
        newTextarea.addEventListener('focus', function() {
            expandTextarea(this);
        });
        
        // Also handle click event for mobile
        newTextarea.addEventListener('click', function(e) {
            e.preventDefault();
            expandTextarea(this);
        });
    });
    
    // Clear existing event listeners for all mark-as-done buttons
    const markDoneButtons = document.querySelectorAll('.mark-as-done');
    markDoneButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add click event listener to collapse
        newButton.addEventListener('click', function() {
            collapseTextarea(this);
        });
    });
}

/**
 * Expand textarea for editing
 * @param {Element} textarea - The textarea element to expand
 */
function expandTextarea(textarea) {
    console.log('Expanding textarea');
    
    const container = textarea.closest('.question-container');
    if (!container) return;
    
    // Hide compact view
    const textareaContainer = container.querySelector('.textarea-container');
    if (textareaContainer) {
        textareaContainer.classList.add('hidden');
    }
    
    // Show expanded editing view
    const editingView = container.querySelector('.editing-view');
    if (editingView) {
        editingView.classList.remove('hidden');
        
        // Copy value to editing textarea
        const editingTextarea = editingView.querySelector('textarea');
        if (editingTextarea) {
            editingTextarea.value = textarea.value;
            
            // Set maximum height
            editingTextarea.style.maxHeight = '40vh';
            
            // Auto-resize to fit content but respect max height
            autoResizeTextarea(editingTextarea);
            
            // Focus with slight delay for animation
            setTimeout(() => {
                editingTextarea.focus();
                
                // Ensure it's visible if scrolling needed
                editingView.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
            
            // Add auto-resize on input
            editingTextarea.addEventListener('input', function() {
                autoResizeTextarea(this);
            });
        }
    }
}

/**
 * Collapse textarea after editing
 * @param {Element} button - The "Mark as done" button
 */
function collapseTextarea(button) {
    console.log('Collapsing textarea');
    
    const container = button.closest('.question-container');
    if (!container) return;
    
    // Get text from editing view
    const editingTextarea = container.querySelector('.editing-view textarea');
    if (!editingTextarea) return;
    
    const textValue = editingTextarea.value.trim();
    
    // Update main textarea
    const mainTextarea = container.querySelector('.textarea-container textarea');
    if (mainTextarea) {
        mainTextarea.value = textValue;
        
        // Trigger input event for validation
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        mainTextarea.dispatchEvent(event);
    }
    
    // Toggle views
    container.querySelector('.editing-view').classList.add('hidden');
    container.querySelector('.textarea-container').classList.remove('hidden');
    
    // Update completion status
    const statusElement = container.querySelector('.question-status');
    if (statusElement) {
        if (textValue) {
            statusElement.classList.remove('hidden');
            
            // Animate status appearance if gsap is available
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
 * Auto-resize textarea to fit content
 * @param {Element} textarea - The textarea to resize
 */
function autoResizeTextarea(textarea) {
    // Reset height to calculate proper scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height (with a max-height limit)
    const maxHeight = window.innerHeight * 0.4; // 40% of viewport height
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    
    // Set new height
    textarea.style.height = newHeight + 'px';
    
    // Add scrollbar if content exceeds max height
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

// Execute this fix immediately and also make it available globally
window.textareaFix = {
    initializeAllTextareas,
    setupTextareaInteractions,
    expandTextarea,
    collapseTextarea
};

// Force reset all textareas when form opens
document.querySelectorAll('[data-open-form="true"]').forEach(button => {
    button.addEventListener('click', function() {
        // Wait for form to open then reset textareas
        setTimeout(() => {
            initializeAllTextareas();
            setupTextareaInteractions();
        }, 500);
    });
});