/**
 * Form Integration - FIXED VERSION
 * Connects the various form modules and handles submission
 */
const FormIntegration = (function() {
    // Keep track of initialized state
    let isInitialized = false;
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 10; // Prevent infinite loops
    
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
        // Increment the attempt counter
        initAttempts++;
        
        // Check if we've tried too many times
        if (initAttempts > MAX_INIT_ATTEMPTS) {
            console.error('Failed to initialize FormIntegration after', MAX_INIT_ATTEMPTS, 'attempts');
            
            // Set up a basic fallback
            setupBasicNavigation();
            return;
        }
        
        // Check if dependencies are available - be more specific about what we're checking
        const animationAvailable = typeof window.FormAnimation !== 'undefined' && 
                                  typeof window.FormAnimation.nextStep === 'function';
        
        const validationAvailable = typeof window.FormValidation !== 'undefined' && 
                                   typeof window.FormValidation.validateStep === 'function';
        
        if (!animationAvailable || !validationAvailable) {
            console.log(`Waiting for form modules to load... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
            
            // Try again with increasing delay to avoid hammering
            setTimeout(initWhenReady, 100 * Math.min(initAttempts, 5));
            return;
        }
        
        // Connect buttons to navigation events
        connectNavigationButtons();
        
        // Setup form submission
        setupFormSubmission();
        
        // Setup validation
        setupFormValidation();
        
        // Mark as initialized
        isInitialized = true;
        console.log('Form integration initialized successfully');
    }
    
    /**
     * Set up basic navigation as a fallback
     */
    function setupBasicNavigation() {
        // Simple navigation logic that doesn't depend on other modules
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        // Get all steps
        const steps = Array.from(form.querySelectorAll('.step'));
        
        // Function to go to a step
        function goToStep(index) {
            if (index < 0 || index >= steps.length) return;
            
            // Hide all steps
            steps.forEach(step => step.classList.add('hidden'));
            
            // Show the requested step
            steps[index].classList.remove('hidden');
            
            // Update buttons
            updateButtonStates(index);
        }
        
        // Update button states
        function updateButtonStates(currentIndex) {
            // Previous buttons
            const prevButtons = form.querySelectorAll('.prev-button');
            prevButtons.forEach(btn => {
                if (currentIndex === 0) {
                    btn.classList.add('invisible');
                } else {
                    btn.classList.remove('invisible');
                }
            });
        }
        
        // Get current step index
        function getCurrentStepIndex() {
            return steps.findIndex(step => !step.classList.contains('hidden'));
        }
        
        // Basic form validation
        function validateCurrentStep() {
            const currentIndex = getCurrentStepIndex();
            if (currentIndex < 0) return false;
            
            const currentStep = steps[currentIndex];
            
            // Check required fields
            const requiredFields = currentStep.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                // Skip radio buttons and checkboxes (will handle separately)
                if (field.type === 'radio' || field.type === 'checkbox') return;
                
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    
                    // Add error message if it doesn't exist
                    const existingError = field.nextElementSibling;
                    if (!existingError || !existingError.classList.contains('error-message')) {
                        const errorMessage = document.createElement('p');
                        errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                        errorMessage.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('border-red-500');
                    
                    // Remove error message if exists
                    const existingError = field.nextElementSibling;
                    if (existingError && existingError.classList.contains('error-message')) {
                        existingError.remove();
                    }
                }
            });
            
            return isValid;
        }
        
        // Clear validation errors
        function clearValidationErrors() {
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.border-red-500').forEach(field => {
                field.classList.remove('border-red-500');
            });
        }
        
        // Next buttons
        form.querySelectorAll('.next-button').forEach((button, index) => {
            // Remove existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new click handler
            newButton.addEventListener('click', function() {
                const currentIndex = getCurrentStepIndex();
                
                // Validate current step
                if (validateCurrentStep()) {
                    // Go to next step
                    goToStep(currentIndex + 1);
                    
                    // Clear any errors
                    clearValidationErrors();
                } else {
                    // Shake the button to indicate error
                    this.classList.add('shake-animation');
                    setTimeout(() => {
                        this.classList.remove('shake-animation');
                    }, 500);
                }
            });
            
            // Check if the button should be enabled initially
            const shouldBeEnabled = validateCurrentStep();
            newButton.disabled = !shouldBeEnabled;
            
            if (shouldBeEnabled) {
                newButton.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                newButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        });
        
        // Previous buttons
        form.querySelectorAll('.prev-button').forEach(button => {
            // Remove existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new click handler
            newButton.addEventListener('click', function() {
                const currentIndex = getCurrentStepIndex();
                
                // Go to previous step
                if (currentIndex > 0) {
                    goToStep(currentIndex - 1);
                }
            });
        });
        
        // Make sure we're on the right step
        const currentIndex = getCurrentStepIndex();
        if (currentIndex >= 0) {
            updateButtonStates(currentIndex);
        } else {
            // If no step is visible, show the first one
            goToStep(0);
        }
        
        // Add form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate the current step
            if (!validateCurrentStep()) {
                return;
            }
            
            // Get submit button
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                
                // Save original text
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';
                
                try {
                    // Collect form data
                    const formData = new FormData(form);
                    const formObject = {};
                    
                    formData.forEach((value, key) => {
                        // Skip editing-view textareas
                        if (!key.includes('-editing')) {
                            formObject[key] = value;
                        }
                    });
                    
                    // Handle checkbox services
                    const services = [];
                    form.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
                        services.push(checkbox.value);
                    });
                    formObject.services = services.join(', ');
                    
                    // Handle custom budget if present
                    if (formObject.budget === 'custom' && formObject.customBudget) {
                        formObject.budget = formObject.customBudget;
                    }
                    
                    // Submit form
                    const response = await fetch('/.netlify/functions/submit-form', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formObject)
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        // Show success message
                        form.classList.add('hidden');
                        const successMessage = document.getElementById('success-message');
                        if (successMessage) {
                            successMessage.classList.remove('hidden');
                        }
                    } else {
                        // Show error message
                        const errorMessage = document.getElementById('error-message');
                        if (errorMessage) {
                            errorMessage.classList.remove('hidden');
                        }
                        console.error('Form submission error:', result);
                    }
                } catch (error) {
                    // Show error message
                    const errorMessage = document.getElementById('error-message');
                    if (errorMessage) {
                        errorMessage.classList.remove('hidden');
                    }
                    console.error('Form submission error:', error);
                } finally {
                    // Re-enable submit button
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalText;
                    }
                }
            }
        });
        
        // Setup real-time validation
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                // Re-validate the step
                validateCurrentStep();
                
                // Update next button state
                const currentIndex = getCurrentStepIndex();
                const nextButton = form.querySelector(`.step:nth-child(${currentIndex + 1}) .next-button`);
                if (nextButton) {
                    const isValid = validateCurrentStep();
                    nextButton.disabled = !isValid;
                    
                    if (isValid) {
                        nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
                    } else {
                        nextButton.classList.add('opacity-50', 'cursor-not-allowed');
                    }
                }
            });
        });
        
        console.log('Basic form navigation set up as fallback');
    }
    
    /**
     * Connect navigation buttons
     */
    function connectNavigationButtons() {
        // First remove all existing event listeners
        removeExistingListeners();
        
        // Get all steps
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        const steps = Array.from(form.querySelectorAll('.step'));
        
        // Next buttons
        document.querySelectorAll('.next-button').forEach((button, index) => {
            button.addEventListener('click', function(e) {
                // Call the nextButtonHandler function
                nextButtonHandler.call(this, e);
            });
            
            // Initial validation state
            if (index < steps.length) {
                try {
                    const isValid = FormValidation.validateStep(index);
                    updateButtonState(button, isValid);
                } catch (e) {
                    console.warn('Could not validate step', index, e);
                }
            }
        });
        
        // Prev buttons
        document.querySelectorAll('.prev-button').forEach(button => {
            button.addEventListener('click', function(e) {
                prevButtonHandler.call(this, e);
            });
        });
        
        // Close buttons
        document.querySelectorAll('.close-button').forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Are you sure you want to close the form? Your progress will be lost.')) {
                    if (typeof FormAnimation !== 'undefined' && typeof FormAnimation.closeForm === 'function') {
                        FormAnimation.closeForm();
                    } else {
                        // Fallback close
                        document.getElementById('c-form').classList.add('hidden');
                        document.getElementById('form-overlay').classList.add('hidden');
                        document.body.classList.remove('overflow-hidden');
                    }
                }
            });
        });
    }
    
    /**
     * Setup form validation
     */
    function setupFormValidation() {
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        // Add input event listeners to all form fields
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                if (typeof FormValidation !== 'undefined' && typeof FormValidation.validateAndUpdateStep === 'function') {
                    try {
                        // Get current step
                        const currentStepIndex = Array.from(form.querySelectorAll('.step')).findIndex(
                            step => !step.classList.contains('hidden')
                        );
                        
                        if (currentStepIndex >= 0) {
                            FormValidation.validateAndUpdateStep(currentStepIndex);
                        }
                    } catch (e) {
                        console.warn('Error during validation:', e);
                    }
                }
            });
        });
        
        // Handle special cases like checkboxes and radio buttons
        form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(field => {
            field.addEventListener('change', function() {
                if (typeof FormValidation !== 'undefined' && typeof FormValidation.validateAndUpdateStep === 'function') {
                    try {
                        // Get current step
                        const currentStepIndex = Array.from(form.querySelectorAll('.step')).findIndex(
                            step => !step.classList.contains('hidden')
                        );
                        
                        if (currentStepIndex >= 0) {
                            FormValidation.validateAndUpdateStep(currentStepIndex);
                        }
                    } catch (e) {
                        console.warn('Error during validation:', e);
                    }
                }
            });
        });
    }
    
    /**
     * Setup form submission
     */
    function setupFormSubmission() {
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        // Remove any existing submit handlers
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Re-attach event listeners
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get current step index
            const steps = Array.from(newForm.querySelectorAll('.step'));
            const currentStepIndex = steps.findIndex(step => !step.classList.contains('hidden'));
            
            // Final validation before submission
            let isValid = true;
            
            if (typeof FormValidation !== 'undefined' && typeof FormValidation.validateStep === 'function') {
                isValid = FormValidation.validateStep(currentStepIndex);
                
                if (!isValid && typeof FormValidation.showValidationErrors === 'function') {
                    FormValidation.showValidationErrors(currentStepIndex);
                }
            } else {
                // Basic validation
                isValid = validateBasicStep(steps[currentStepIndex]);
            }
            
            if (!isValid) return;
            
            // Disable the submit button
            const submitButton = newForm.querySelector('button[type="submit"]');
            let originalText = 'Submit Form';
            
            if (submitButton) {
                originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';
                submitButton.disabled = true;
            }
            
            try {
                // Collect form data
                const formData = collectFormData(newForm);
                
                // Log data for debugging
                console.log('Submitting form data:', formData);
                
                // Submit form data
                const response = await fetch('/.netlify/functions/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Reset form
                    newForm.reset();
                    
                    // Show success message
                    if (typeof FormAnimation !== 'undefined' && typeof FormAnimation.showSuccess === 'function') {
                        FormAnimation.showSuccess();
                    } else {
                        // Fallback success display
                        newForm.classList.add('hidden');
                        const successMessage = document.getElementById('success-message');
                        if (successMessage) {
                            successMessage.classList.remove('hidden');
                        }
                    }
                    
                    console.log('Form submitted successfully:', result);
                } else {
                    // Show error message
                    if (typeof FormAnimation !== 'undefined' && typeof FormAnimation.showError === 'function') {
                        FormAnimation.showError();
                    } else {
                        // Fallback error display
                        const errorMessage = document.getElementById('error-message');
                        if (errorMessage) {
                            errorMessage.classList.remove('hidden');
                        }
                    }
                    
                    console.error('Form submission failed:', result);
                }
            } catch (error) {
                // Show error message
                if (typeof FormAnimation !== 'undefined' && typeof FormAnimation.showError === 'function') {
                    FormAnimation.showError();
                } else {
                    // Fallback error display
                    const errorMessage = document.getElementById('error-message');
                    if (errorMessage) {
                        errorMessage.classList.remove('hidden');
                    }
                }
                
                console.error('Form submission error:', error);
            } finally {
                // Re-enable submit button
                if (submitButton) {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }
            }
        });
        
        // Try again button
        const tryAgainButton = document.getElementById('try-again-button');
        if (tryAgainButton) {
            tryAgainButton.addEventListener('click', function() {
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.classList.add('hidden');
                }
            });
        }
    }
    
    /**
     * Basic validation function for fallback
     */
    function validateBasicStep(step) {
        if (!step) return false;
        
        // Check required fields
        const requiredFields = step.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Skip radio buttons and checkboxes (we'll handle them separately)
            if (field.type === 'radio' || field.type === 'checkbox') return;
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                
                // Add error message if it doesn't exist
                const existingError = field.nextElementSibling;
                if (!existingError || !existingError.classList.contains('error-message')) {
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                    errorMessage.textContent = 'This field is required';
                    field.parentNode.insertBefore(errorMessage, field.nextSibling);
                }
            } else {
                field.classList.remove('border-red-500');
                
                // Remove error message if exists
                const existingError = field.nextElementSibling;
                if (existingError && existingError.classList.contains('error-message')) {
                    existingError.remove();
                }
            }
        });
        
        return isValid;
    }
    
    /**
     * Collect all form data from all steps
     * @param {HTMLFormElement} form The form element
     * @returns {Object} Form data as an object
     */
    function collectFormData(form) {
        const formData = new FormData(form);
        const formObject = {};
        
        // Process normal form fields
        formData.forEach((value, key) => {
            // Skip editing-view textareas
            if (!key.includes('-editing')) {
                formObject[key] = value;
            }
        });
        
        // Handle checkbox services properly
        const services = [];
        form.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
            services.push(checkbox.value);
        });
        formObject.services = services.join(', ');
        
        // Handle social media fields - collect all profiles into a single string
        const socialMediaProfiles = [];
        const socialFields = document.querySelectorAll('.social-media-field');
        socialFields.forEach((field, index) => {
            const typeSelect = field.querySelector('select');
            const profileInput = field.querySelector('input');
            
            if (typeSelect && profileInput && profileInput.value.trim()) {
                socialMediaProfiles.push(`${typeSelect.value}: ${profileInput.value.trim()}`);
            }
        });
        formObject.socialMediaProfiles = socialMediaProfiles.join(', ');
        
        // Handle custom budget field
        if (formObject.budget === 'custom' && formObject.customBudget) {
            formObject.budget = formObject.customBudget;
        }
        
        return formObject;
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
        // Try to use FormAnimation if available
        if (typeof FormAnimation !== 'undefined' && typeof FormAnimation.getCurrentStep === 'function') {
            // Get current step
            const currentStep = FormAnimation.getCurrentStep();
            
            // Try to use FormValidation if available
            if (typeof FormValidation !== 'undefined' && typeof FormValidation.validateStep === 'function') {
                // Validate step
                if (FormValidation.validateStep(currentStep)) {
                    // Proceed to next step
                    if (typeof FormAnimation.nextStep === 'function') {
                        FormAnimation.nextStep();
                    }
                } else {
                    // Show validation errors
                    if (typeof FormValidation.showValidationErrors === 'function') {
                        FormValidation.showValidationErrors(currentStep);
                    }
                    
                    // Shake the button to indicate error
                    if (typeof gsap !== 'undefined') {
                        gsap.to(this, {
                            x: [-5, 5, -4, 4, -3, 3, 0],
                            duration: 0.4,
                            ease: 'power1.inOut'
                        });
                    }
                }
            } else {
                // No validation module, just proceed
                if (typeof FormAnimation.nextStep === 'function') {
                    FormAnimation.nextStep();
                }
            }
        } else {
            // Fallback - find the current step and go to the next one
            const form = document.getElementById('inquiry-form');
            if (!form) return;
            
            const steps = Array.from(form.querySelectorAll('.step'));
            const currentIndex = steps.findIndex(step => !step.classList.contains('hidden'));
            
            if (currentIndex >= 0 && currentIndex < steps.length - 1) {
                // Hide current step
                steps[currentIndex].classList.add('hidden');
                
                // Show next step
                steps[currentIndex + 1].classList.remove('hidden');
                
                // Update prev button visibility
                if (currentIndex + 1 > 0) {
                    const prevButtons = form.querySelectorAll('.prev-button');
                    prevButtons.forEach(btn => btn.classList.remove('invisible'));
                }
            }
        }
    }
    
    /**
     * Previous button handler
     */
    function prevButtonHandler(e) {
        // Try to use FormAnimation if available
        if (typeof FormAnimation !== 'undefined' && typeof FormAnimation.prevStep === 'function') {
            FormAnimation.prevStep();
        } else {
            // Fallback - find the current step and go to the previous one
            const form = document.getElementById('inquiry-form');
            if (!form) return;
            
            const steps = Array.from(form.querySelectorAll('.step'));
            const currentIndex = steps.findIndex(step => !step.classList.contains('hidden'));
            
            if (currentIndex > 0) {
                // Hide current step
                steps[currentIndex].classList.add('hidden');
                
                // Show previous step
                steps[currentIndex - 1].classList.remove('hidden');
                
                // Update prev button visibility
                if (currentIndex - 1 === 0) {
                    const prevButtons = form.querySelectorAll('.prev-button');
                    prevButtons.forEach(btn => btn.classList.add('invisible'));
                }
            }
        }
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
document.addEventListener('DOMContentLoaded', function() {
    // Set a small delay to ensure other modules are initialized first
    setTimeout(function() {
        if (typeof FormIntegration !== 'undefined') {
            FormIntegration.init();
        }
    }, 300);
});