/**
 * Form Integration
 * Connects the various form modules
 */
const FormIntegration = (function() {
    // Keep track of initialized state
    let isInitialized = false;
    
    /**
     * Initialize module
     */
    function init() {
        if (isInitialized) return;
        
        console.log('Initializing form integration...');
        
        // Wait for DOM content to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWhenReady);
        } else {
            initWhenReady();
        }
    }
    
    /**
     * Initialize when DOM and modules are ready
     */
    function initWhenReady() {
        // Check if dependencies are available
        if (window.FormAnimation === undefined || 
            window.FormValidation === undefined || 
            window.FormModule === undefined) {
            
            console.log('Waiting for form modules to load...');
            setTimeout(initWhenReady, 100);
            return;
        }
        
        // Connect buttons to navigation events
        connectNavigationButtons();
        
        // Mark as initialized
        isInitialized = true;
        console.log('Form integration initialized successfully');
    }
    
    /**
     * Connect navigation buttons
     */
    function connectNavigationButtons() {
        // First remove all existing event listeners
        removeExistingListeners();
        
        // Next buttons
        document.querySelectorAll('.next-button').forEach((button, index) => {
            button.addEventListener('click', nextButtonHandler);
            
            // Initial validation state
            try {
                const isValid = FormValidation.validateStep(index);
                updateButtonState(button, isValid);
            } catch (e) {
                console.warn('Could not validate step', index, e);
            }
        });
        
        // Prev buttons
        document.querySelectorAll('.prev-button').forEach(button => {
            button.addEventListener('click', prevButtonHandler);
        });
    }
    
    /**
     * Remove existing event listeners
     */
    function removeExistingListeners() {
        // Next buttons
        document.querySelectorAll('.next-button').forEach(button => {
            // Create a new clone to remove all listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });
        
        // Prev buttons
        document.querySelectorAll('.prev-button').forEach(button => {
            // Create a new clone to remove all listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });
    }
    
    /**
     * Next button handler
     */
    function nextButtonHandler(e) {
        // Get current step
        const currentStep = FormAnimation.getCurrentStep();
        
        // Validate step
        if (FormValidation.validateStep(currentStep)) {
            // Proceed to next step
            FormAnimation.nextStep();
        } else {
            // Show validation errors
            FormValidation.showValidationErrors(currentStep);
            
            // Shake the button to indicate error
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    x: [-5, 5, -4, 4, -3, 3, 0],
                    duration: 0.4,
                    ease: 'power1.inOut'
                });
            }
        }
    }
    
    /**
     * Previous button handler
     */
    function prevButtonHandler(e) {
        FormAnimation.prevStep();
    }
    
    /**
     * Update button state based on validation
     */
    function updateButtonState(button, isValid) {
        if (isValid) {
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            button.classList.add('hover:bg-gray-100');
        } else {
            button.disabled = true;
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.classList.remove('hover:bg-gray-100');
        }
    }
    
    // Public API
    return {
        init,
        connectNavigationButtons
    };
})();

// Initialize when script is loaded
if (typeof FormIntegration !== 'undefined') {
    // Set a small delay to ensure other modules are initialized first
    setTimeout(function() {
        FormIntegration.init();
    }, 100);
}