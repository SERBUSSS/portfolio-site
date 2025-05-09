/**
 * Form Validation Module
 * Handles all validation for the multi-step form with improved error handling
 */
const FormValidation = (function() {
    // DOM elements
    let form, steps, nextButtons;
    
    /**
     * Initialize the module
     */
    function init() {
        // Get DOM elements
        form = document.getElementById('inquiry-form');
        steps = Array.from(document.querySelectorAll('#inquiry-form .step'));
        nextButtons = Array.from(document.querySelectorAll('.next-button'));
        
        // Setup real-time validation
        setupRealTimeValidation();
        
        console.log('FormValidation initialized with', steps.length, 'steps');
    }
    
    /**
     * Setup real-time validation for form fields
     */
    function setupRealTimeValidation() {
        // Watch input events on required fields
        steps.forEach((step, stepIndex) => {
            // Get all required fields in this step
            const requiredFields = step.querySelectorAll('input[required], textarea[required], select[required]');
            
            // Add input event listeners
            requiredFields.forEach(field => {
                // Clear previous event listeners by cloning the element
                const newField = field.cloneNode(true);
                field.parentNode.replaceChild(newField, field);
                
                // Add new listener to the cloned element
                newField.addEventListener('input', function() {
                    // Special validation for email field
                    if (this.type === 'email' && this.value.trim() !== '') {
                        validateEmail(this);
                    }
                    
                    // Remove error styling when field has value
                    if (this.value.trim() !== '') {
                        this.classList.remove('border-red-500');
                        
                        // Remove error message if exists
                        const errorMsg = this.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                    
                    // Update step validation state
                    setTimeout(() => {
                        validateAndUpdateStep(stepIndex);
                    }, 10); // Small delay to ensure value is updated
                });
                
                // Initial validation if field has value
                if (newField.value.trim() !== '') {
                    newField.dispatchEvent(new Event('input'));
                }
            });
            
            // Handle radio buttons and checkboxes
            const radioGroups = getRadioGroupsInStep(step);
            radioGroups.forEach((groupName) => {
                const radios = step.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
                radios.forEach(radio => {
                    // Clear previous event listeners by cloning the element
                    const newRadio = radio.cloneNode(true);
                    radio.parentNode.replaceChild(newRadio, radio);
                    
                    // Add new listener to the cloned element
                    newRadio.addEventListener('change', function() {
                        // Update step validation state
                        setTimeout(() => {
                            validateAndUpdateStep(stepIndex);
                        }, 10);
                    });
                    
                    // Initial validation if checked
                    if (newRadio.checked) {
                        newRadio.dispatchEvent(new Event('change'));
                    }
                });
            });
            
            // Validate checkboxes if any are required
            const checkboxes = step.querySelectorAll('input[type="checkbox"][required]');
            checkboxes.forEach(checkbox => {
                // Clear previous event listeners by cloning the element
                const newCheckbox = checkbox.cloneNode(true);
                checkbox.parentNode.replaceChild(newCheckbox, checkbox);
                
                // Add new listener to the cloned element
                newCheckbox.addEventListener('change', function() {
                    // Update step validation state
                    setTimeout(() => {
                        validateAndUpdateStep(stepIndex);
                    }, 10);
                });
                
                // Initial validation if checked
                if (newCheckbox.checked) {
                    newCheckbox.dispatchEvent(new Event('change'));
                }
            });
            
            // Initial validation for the step
            validateAndUpdateStep(stepIndex);
        });
    }
    
    /**
     * Validate email field
     * @param {HTMLInputElement} field Email input field
     * @returns {boolean} Whether the email is valid
     */
    function validateEmail(field) {
        // Remove any existing error message
        const existingError = field.nextElementSibling;
        if (existingError && existingError.classList.contains('error-message')) {
            existingError.remove();
        }
        
        // Check if email is valid
        if (!isValidEmail(field.value)) {
            // Add error styling
            field.classList.add('border-red-500');
            
            // Add error message
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
            errorMessage.textContent = 'Please enter a valid email address';
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
            
            return false;
        }
        
        // Remove error styling if valid
        field.classList.remove('border-red-500');
        return true;
    }
    
    /**
     * Validate step and update UI
     * @param {number} stepIndex Step index to validate
     */
    function validateAndUpdateStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        
        // Validate the step
        const isValid = validateStep(stepIndex);
        
        // Update next button state
        if (nextButtons[stepIndex]) {
            nextButtons[stepIndex].disabled = !isValid;
            
            // Add/remove classes for visual indication
            if (isValid) {
                nextButtons[stepIndex].classList.remove('opacity-50', 'cursor-not-allowed');
                nextButtons[stepIndex].classList.add('hover:bg-gray-100');
            } else {
                nextButtons[stepIndex].classList.add('opacity-50', 'cursor-not-allowed');
                nextButtons[stepIndex].classList.remove('hover:bg-gray-100');
            }
        }
    }
    
    /**
     * Validate a specific step
     * @param {number} stepIndex Index of the step to validate
     * @returns {boolean} Whether the step is valid
     */
    function validateStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return false;
        
        const step = steps[stepIndex];
        
        // 1. Validate required inputs (text, email, etc.)
        const requiredFields = step.querySelectorAll('input[required], textarea[required], select[required]');
        const allFieldsValid = Array.from(requiredFields).every(field => {
            // Skip radio buttons and checkboxes (handled separately)
            if (field.type === 'radio' || field.type === 'checkbox') return true;
            
            // Special validation for email field
            if (field.type === 'email' && field.value.trim() !== '') {
                return isValidEmail(field.value);
            }
            
            return field.value.trim() !== '';
        });
        
        // 2. Validate radio button groups
        const radioGroups = getRadioGroupsInStep(step);
        const allRadioGroupsValid = radioGroups.length === 0 || radioGroups.every(groupName => {
            // Check if any radio in the group is required
            const isRequired = step.querySelector(`input[type="radio"][name="${groupName}"][required]`) !== null;
            
            // If not required, consider it valid
            if (!isRequired) return true;
            
            // Check if any radio in the group is checked
            return step.querySelector(`input[type="radio"][name="${groupName}"]:checked`) !== null;
        });
        
        // 3. Validate checkboxes (if required)
        const requiredCheckboxes = step.querySelectorAll('input[type="checkbox"][required]');
        const allCheckboxesValid = Array.from(requiredCheckboxes).every(checkbox => checkbox.checked);
        
        // 4. Validate custom fields (if any)
        const isCustomBudgetValid = validateCustomBudgetIfVisible(step);
        
        // Return true only if all validations pass
        return allFieldsValid && allRadioGroupsValid && allCheckboxesValid && isCustomBudgetValid;
    }
    
    /**
     * Validate custom budget field if visible
     * @param {HTMLElement} step Step element
     * @returns {boolean} Whether the custom budget is valid
     */
    function validateCustomBudgetIfVisible(step) {
        const customBudgetContainer = step.querySelector('#customBudgetContainer');
        if (!customBudgetContainer || customBudgetContainer.classList.contains('hidden')) {
            return true; // If not visible, consider valid
        }
        
        const customBudgetInput = customBudgetContainer.querySelector('#customBudget');
        if (!customBudgetInput) return true;
        
        const budgetCustomRadio = step.querySelector('#budgetCustom');
        if (!budgetCustomRadio || !budgetCustomRadio.checked) return true;
        
        // Check if custom budget has a value when the custom option is selected
        return customBudgetInput.value.trim() !== '';
    }
    
    /**
     * Show validation errors for a step
     * @param {number} stepIndex Index of the step to show errors for
     */
    function showValidationErrors(stepIndex) {
        if (stepIndex < 0 || stepIndex >= steps.length) return;
        
        const step = steps[stepIndex];
        
        // Clear previous error messages
        step.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Check required fields
        step.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
            // Skip radio buttons and checkboxes (handled separately)
            if (field.type === 'radio' || field.type === 'checkbox') return;
            
            // Special validation for email
            if (field.type === 'email' && field.value.trim() !== '') {
                validateEmail(field);
                return;
            }
            
            // Skip if valid
            if (field.value.trim() !== '') return;
            
            // Add error styling
            field.classList.add('border-red-500');
            
            // Add error message
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
            errorMessage.textContent = 'This field is required';
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
            
            // Add event listener to remove error when field is valid
            field.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.remove('border-red-500');
                    const errorMsg = this.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            }, { once: true });
            
            // If this is the first invalid field, focus it
            if (!step.querySelector('.error-message')) {
                field.focus();
            }
        });
        
        // Check radio groups
        const radioGroups = getRadioGroupsInStep(step);
        radioGroups.forEach(groupName => {
            // Check if any radio in the group is required
            const isRequired = step.querySelector(`input[type="radio"][name="${groupName}"][required]`) !== null;
            
            // Skip if not required
            if (!isRequired) return;
            
            // Check if any radio in the group is checked
            const isAnyChecked = step.querySelector(`input[type="radio"][name="${groupName}"]:checked`) !== null;
            
            if (!isAnyChecked) {
                // Get a container for the error message (parent of the first radio in the group)
                const firstRadio = step.querySelector(`input[type="radio"][name="${groupName}"]`);
                if (!firstRadio) return;
                
                const container = firstRadio.closest('.space-y-4') || firstRadio.closest('div');
                if (!container) return;
                
                // Add error message
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                errorMessage.textContent = 'Please select an option';
                container.appendChild(errorMessage);
                
                // Add event listener to remove error when option is selected
                const radios = step.querySelectorAll(`input[name="${groupName}"]`);
                radios.forEach(radio => {
                    radio.addEventListener('change', function() {
                        const errorMsg = container.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.remove();
                        }
                    }, { once: true });
                });
                
                // Highlight the radio container
                const radioContainers = container.querySelectorAll('.radio-container');
                radioContainers.forEach(radioContainer => {
                    radioContainer.classList.add('border-red-500');
                    
                    // Add event listener to remove highlight when an option is selected
                    radios.forEach(radio => {
                        radio.addEventListener('change', function() {
                            radioContainers.forEach(rc => {
                                rc.classList.remove('border-red-500');
                            });
                        }, { once: true });
                    });
                });
            }
        });
        
        // Check required checkboxes
        step.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
            if (checkbox.checked) return;
            
            // Get container for the error message
            const container = checkbox.closest('.checkbox-container')?.parentNode;
            if (!container) return;
            
            // Add error message
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
            errorMessage.textContent = 'This selection is required';
            container.appendChild(errorMessage);
            
            // Highlight the checkbox container
            const checkboxContainer = checkbox.closest('.checkbox-container');
            if (checkboxContainer) {
                checkboxContainer.classList.add('border-red-500');
            }
            
            // Add event listener to remove error when option is selected
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    const errorMsg = container.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                    
                    if (checkboxContainer) {
                        checkboxContainer.classList.remove('border-red-500');
                    }
                }
            }, { once: true });
        });
        
        // Check custom budget if it's visible and required
        const customBudgetContainer = step.querySelector('#customBudgetContainer');
        if (customBudgetContainer && !customBudgetContainer.classList.contains('hidden')) {
            const customBudgetInput = customBudgetContainer.querySelector('#customBudget');
            const budgetCustomRadio = step.querySelector('#budgetCustom');
            
            if (customBudgetInput && budgetCustomRadio && budgetCustomRadio.checked && customBudgetInput.value.trim() === '') {
                // Add error styling
                customBudgetInput.classList.add('border-red-500');
                
                // Add error message
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                errorMessage.textContent = 'Please specify your budget';
                customBudgetInput.parentNode.insertBefore(errorMessage, customBudgetInput.nextSibling);
                
                // Add event listener to remove error when field is valid
                customBudgetInput.addEventListener('input', function() {
                    if (this.value.trim() !== '') {
                        this.classList.remove('border-red-500');
                        const errorMsg = this.nextElementSibling;
                        if (errorMsg && errorMsg.classList.contains('error-message')) {
                            errorMsg.remove();
                        }
                    }
                }, { once: true });
            }
        }
        
        // Shake the form to indicate error
        const formContainer = step.closest('form');
        if (formContainer && typeof gsap !== 'undefined') {
            gsap.to(formContainer, {
                x: [-5, 5, -4, 4, -3, 3, 0],
                duration: 0.4,
                ease: 'power1.inOut'
            });
        }
    }
    
    /**
     * Get all radio groups in a step
     * @param {Element} step Step element
     * @returns {string[]} Array of radio group names
     */
    function getRadioGroupsInStep(step) {
        const radioGroups = new Set();
        step.querySelectorAll('input[type="radio"]').forEach(radio => {
            radioGroups.add(radio.name);
        });
        return Array.from(radioGroups);
    }
    
    /**
     * Validate email format
     * @param {string} email Email to validate
     * @returns {boolean} Whether the email is valid
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Public API
    return {
        init,
        validateStep,
        validateAndUpdateStep,
        showValidationErrors,
        isValidEmail
    };
})();

// Initialize FormValidation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        FormValidation.init();
    }, 50);
});