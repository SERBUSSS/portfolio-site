/**
 * Form Validation Module
 * Handles all validation for the multi-step form
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
                field.addEventListener('input', () => {
                    validateAndUpdateStep(stepIndex);
                });
                
                // Initial validation
                if (field.value.trim() !== '') {
                    field.dispatchEvent(new Event('input'));
                }
            });
            
            // Handle radio buttons and checkboxes
            const radioGroups = getRadioGroupsInStep(step);
            radioGroups.forEach((groupName) => {
                const radios = step.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
                radios.forEach(radio => {
                    radio.addEventListener('change', () => {
                        validateAndUpdateStep(stepIndex);
                    });
                    
                    // Initial validation if checked
                    if (radio.checked) {
                        radio.dispatchEvent(new Event('change'));
                    }
                });
            });
            
            // Validate checkboxes if any are required
            const checkboxes = step.querySelectorAll('input[type="checkbox"][required]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    validateAndUpdateStep(stepIndex);
                });
                
                // Initial validation if checked
                if (checkbox.checked) {
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            
            // Initial validation for the step
            validateAndUpdateStep(stepIndex);
        });
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
            // Skip radio buttons (handled separately)
            if (field.type === 'radio' || field.type === 'checkbox') return true;
            
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
        
        // Return true only if all validations pass
        return allFieldsValid && allRadioGroupsValid && allCheckboxesValid;
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
                const radios = step.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
                radios.forEach(radio => {
                    radio.addEventListener('change', function() {
                        const errorMsg = container.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.remove();
                        }
                    }, { once: true });
                });
            }
        });
        
        // Check required checkboxes
        step.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
            if (checkbox.checked) return;
            
            // Get container for the error message
            const container = checkbox.closest('.checkbox-container').parentNode;
            if (!container) return;
            
            // Add error message
            const errorMessage = document.createElement('p');
            errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
            errorMessage.textContent = 'This selection is required';
            container.appendChild(errorMessage);
            
            // Add event listener to remove error when option is selected
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    const errorMsg = container.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            }, { once: true });
        });
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
document.addEventListener('DOMContentLoaded', FormValidation.init);