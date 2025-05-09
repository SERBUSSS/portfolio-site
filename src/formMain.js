/**
 * Form Main Controller - Fixed Version
 * Main entry point for the form functionality with improved coordination between modules
 */
const FormMainController = (function() {
    // State
    let isInitialized = false;
    let modulesLoaded = false;
    let isFormOpen = false;
    
    // Module references
    const modules = {
        animation: null,
        validation: null,
        functionality: null,
        integration: null
    };
    
    /**
     * Initialize when DOM is ready
     */
    function init() {
        if (isInitialized) return;
        
        console.log('Form Main Controller initializing...');
        
        // Add form containers if not present
        ensureFormContainers();
        
        // Initialize open form buttons
        initializeOpenFormButtons();
        
        // Setup click handlers on form links in the site
        setupFormLinkHandlers();
        
        // Check if we should auto-open the form based on URL hash
        checkAutoOpenForm();
        
        isInitialized = true;
    }
    
    /**
     * Ensure form container elements exist
     */
    function ensureFormContainers() {
        // Create overlay if it doesn't exist
        if (!document.getElementById('form-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'form-overlay';
            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 hidden';
            overlay.style.opacity = 0;
            document.body.appendChild(overlay);
            
            // Add click handler to close form when clicking outside
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    if (confirm('Are you sure you want to close the form? Your progress will be lost.')) {
                        closeForm();
                    }
                }
            });
        }
        
        // Make sure form section exists
        if (!document.getElementById('c-form')) {
            console.warn('Form section not found, the form HTML should be added to the page');
        }
    }
    
    /**
     * Initialize open form buttons
     */
    function initializeOpenFormButtons() {
        const openButtons = document.querySelectorAll('[data-open-form="true"]');
        
        openButtons.forEach(button => {
            // Remove any existing event listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new event listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                loadAndOpenForm();
            });
        });
    }
    
    /**
     * Setup click handlers for form links in the site
     */
    function setupFormLinkHandlers() {
        // Find all links that point to #background-form
        const formLinks = document.querySelectorAll('a[href="#background-form"]');
        
        formLinks.forEach(link => {
            // Remove any existing event listeners by cloning
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // Add new event listener
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Smooth scroll to the form section first
                const formSection = document.getElementById('background-form');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Then open the form after a short delay
                    setTimeout(() => {
                        loadAndOpenForm();
                    }, 800); // Delay to allow scroll to complete
                } else {
                    // If section doesn't exist, just open the form
                    loadAndOpenForm();
                }
            });
        });
    }
    
    /**
     * Check if we should auto-open the form based on URL hash
     */
    function checkAutoOpenForm() {
        if (window.location.hash === '#open-form') {
            // Wait a moment for page to settle
            setTimeout(() => {
                loadAndOpenForm();
                
                // Clear the hash to prevent reopening on refresh
                history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }, 500);
        }
    }
    
    /**
     * Load dependencies and open form
     */
    function loadAndOpenForm() {
        if (isFormOpen) {
            // Form is already open, do nothing
            return;
        }
        
        if (modulesLoaded) {
            // Modules already loaded, just open the form
            openForm();
            return;
        }
        
        // Show loading overlay
        showLoadingOverlay();
        
        // Initialize modules if globally available
        if (initializeFormModules()) {
            // Modules successfully initialized, open the form
            hideLoadingOverlay();
            modulesLoaded = true;
            openForm();
        } else {
            // Failed to initialize modules, show fallback form
            console.warn('Could not initialize form modules, showing fallback form');
            hideLoadingOverlay();
            showFormFallback();
        }

        // Reset textareas when form opens
        if (window.textareaFix) {
            window.textareaFix.initializeAllTextareas();
            window.textareaFix.setupTextareaInteractions();
        }
    }
    
    /**
     * Initialize form modules if globally available
     * @returns {boolean} Success status
     */
    function initializeFormModules() {
        try {
            // Check for global modules (already loaded via script tags)
            if (window.FormAnimation && 
                window.FormValidation && 
                window.FormModule && 
                window.FormIntegration) {
                
                // Store references
                modules.animation = window.FormAnimation;
                modules.validation = window.FormValidation;
                modules.functionality = window.FormModule;
                modules.integration = window.FormIntegration;
                
                // Initialize modules in the correct order
                if (typeof modules.validation.init === 'function') {
                    modules.validation.init();
                }
                
                if (typeof modules.functionality.init === 'function') {
                    modules.functionality.init();
                }
                
                if (typeof modules.animation.init === 'function') {
                    modules.animation.init();
                }
                
                // Initialize integration last
                if (typeof modules.integration.init === 'function') {
                    modules.integration.init();
                }
                
                // Connect navigation buttons
                if (typeof modules.integration.connectNavigationButtons === 'function') {
                    modules.integration.connectNavigationButtons();
                }
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error initializing form modules:', error);
            return false;
        }
    }
    
    /**
     * Open form
     */
    function openForm() {
        isFormOpen = true;

        // Prevent background scrolling more forcefully
        document.body.classList.add('form-open');
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100%';

        // Make overlay visible and apply blur effect
        const formOverlay = document.getElementById('form-overlay');
        if (formOverlay) {
            formOverlay.classList.remove('hidden');
            
            // Ensure overlay has proper styling
            formOverlay.style.opacity = '0.8';
            formOverlay.style.backdropFilter = 'blur(8px)';
            formOverlay.style.WebkitBackdropFilter = 'blur(8px)';
        }

        // Hide the navigation bar when form is open
        const navbar = document.getElementById('nav-bar-cont');
        if (navbar) {
            navbar.style.zIndex = '30'; // Lower than form z-index
        }
        
        if (modules.animation && typeof modules.animation.openForm === 'function') {
            // Use animation module
            modules.animation.openForm();
        } else {
            // Fallback
            showFormFallback();
        }
    }
    
    /**
     * Close form
     */
    function closeForm() {
        if (modules.animation && typeof modules.animation.closeForm === 'function') {
            // Use animation module
            modules.animation.closeForm();
        } else {
            // Fallback
            hideFormFallback();
        }

        // Re-enable scrolling
        document.body.classList.remove('form-open');
        document.body.style.overflow = '';
        document.body.style.height = '';

        // Restore nav bar z-index after animations complete
        setTimeout(() => {
            const navbar = document.getElementById('nav-bar-cont');
            if (navbar) {
                navbar.style.zIndex = '100';
            }
        }, 500);
        
        isFormOpen = false;
    }
    
    /**
     * Show loading overlay
     */
    function showLoadingOverlay() {
        let overlay = document.getElementById('form-loading-overlay');
        
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'form-loading-overlay';
            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50';
            overlay.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-lg">
                    <div class="flex items-center space-x-4">
                        <svg class="animate-spin h-8 w-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span class="text-xl font-medium">Loading form...</span>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        } else {
            overlay.classList.remove('hidden');
        }
    }
    
    /**
     * Hide loading overlay
     */
    function hideLoadingOverlay() {
        const overlay = document.getElementById('form-loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
    
    /**
     * Show form fallback
     */
    function showFormFallback() {
        const formSection = document.getElementById('c-form');
        const formOverlay = document.getElementById('form-overlay');
        
        if (formSection && formOverlay) {
            // Show form and overlay
            formSection.classList.remove('hidden');
            formSection.classList.add('flex');
            formOverlay.classList.remove('hidden');
            formOverlay.style.opacity = 0.8;
            
            // Make first step visible
            const steps = document.querySelectorAll('#inquiry-form .step');
            if (steps.length > 0) {
                // Hide all steps
                steps.forEach(step => step.classList.add('hidden'));
                
                // Show first step
                steps[0].classList.remove('hidden');
            }
            
            // Prevent scrolling
            document.body.classList.add('overflow-hidden');
            
            // Setup basic form navigation
            setupBasicFormNavigation();
            
            isFormOpen = true;
        }
    }
    
    /**
     * Hide form fallback
     */
    function hideFormFallback() {
        const formSection = document.getElementById('c-form');
        const formOverlay = document.getElementById('form-overlay');
        
        if (formSection && formOverlay) {
            // Hide form and overlay
            formSection.classList.add('hidden');
            formSection.classList.remove('flex');
            formOverlay.classList.add('hidden');
            
            // Reset form
            resetForm();
            
            // Allow scrolling
            document.body.classList.remove('overflow-hidden');
            
            isFormOpen = false;
        }
    }
    
    /**
     * Reset form
     */
    function resetForm() {
        const form = document.getElementById('inquiry-form');
        if (form) {
            form.reset();
            
            // Show first step, hide others
            const steps = form.querySelectorAll('.step');
            steps.forEach((step, index) => {
                if (index === 0) {
                    step.classList.remove('hidden');
                } else {
                    step.classList.add('hidden');
                }
            });
            
            // Hide success and error messages
            const successMessage = document.getElementById('success-message');
            const errorMessage = document.getElementById('error-message');
            
            if (successMessage) successMessage.classList.add('hidden');
            if (errorMessage) errorMessage.classList.add('hidden');
        }
    }
    
    /**
     * Setup basic form navigation for fallback
     */
    function setupBasicFormNavigation() {
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        // Get all steps
        const steps = Array.from(form.querySelectorAll('.step'));
        
        // Remove existing event listeners
        function removeExistingListeners(selector) {
            const elements = form.querySelectorAll(selector);
            elements.forEach(element => {
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
            });
            return form.querySelectorAll(selector);
        }
        
        // Next buttons
        const nextButtons = removeExistingListeners('.next-button');
        nextButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                const currentIndex = getCurrentStepIndex();
                
                // Validate current step
                if (validateBasicStep(steps[currentIndex])) {
                    // Go to next step
                    if (currentIndex < steps.length - 1) {
                        // Hide current step
                        steps[currentIndex].classList.add('hidden');
                        
                        // Show next step
                        steps[currentIndex + 1].classList.remove('hidden');
                        
                        // Update prev button visibility
                        updatePrevButtonVisibility(currentIndex + 1);
                    }
                }
            });
            
            // Initial validation state
            setTimeout(() => {
                const isValid = validateBasicStep(steps[index]);
                updateButtonState(button, isValid);
            }, 100);
        });
        
        // Previous buttons
        const prevButtons = removeExistingListeners('.prev-button');
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentIndex = getCurrentStepIndex();
                
                if (currentIndex > 0) {
                    // Hide current step
                    steps[currentIndex].classList.add('hidden');
                    
                    // Show previous step
                    steps[currentIndex - 1].classList.remove('hidden');
                    
                    // Update prev button visibility
                    updatePrevButtonVisibility(currentIndex - 1);
                }
            });
        });
        
        // Close buttons
        const closeButtons = removeExistingListeners('.close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Are you sure you want to close the form? Your progress will be lost.')) {
                    hideFormFallback();
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate current step
            const currentIndex = getCurrentStepIndex();
            if (!validateBasicStep(steps[currentIndex])) return;
            
            // Get submit button
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
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
                    
                    // Handle services checkboxes
                    const services = [];
                    form.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
                        services.push(checkbox.value);
                    });
                    formObject.services = services.join(', ');
                    
                    // Handle social media profiles
                    const socialMediaProfiles = [];
                    form.querySelectorAll('.social-media-field').forEach((field, index) => {
                        const typeSelect = field.querySelector('select');
                        const profileInput = field.querySelector('input');
                        
                        if (typeSelect && profileInput && profileInput.value.trim()) {
                            socialMediaProfiles.push(`${typeSelect.value}: ${profileInput.value.trim()}`);
                        }
                    });
                    formObject.socialMediaProfiles = socialMediaProfiles.join(', ');
                    
                    // Handle custom budget
                    if (formObject.budget === 'custom' && formObject.customBudget) {
                        formObject.budget = formObject.customBudget;
                    }
                    
                    // Submit to server
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
                        steps.forEach(step => step.classList.add('hidden'));
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
        
        // Input events for validation
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('input', function() {
                const currentIndex = getCurrentStepIndex();
                const isValid = validateBasicStep(steps[currentIndex]);
                
                // Update next button state
                const nextButton = steps[currentIndex].querySelector('.next-button');
                if (nextButton) {
                    updateButtonState(nextButton, isValid);
                }
                
                // Remove error styling
                if (field.value.trim() !== '') {
                    field.classList.remove('border-red-500');
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
        });
        
        // Change events for checkboxes and radios
        form.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(field => {
            field.addEventListener('change', function() {
                const currentIndex = getCurrentStepIndex();
                const isValid = validateBasicStep(steps[currentIndex]);
                
                // Update next button state
                const nextButton = steps[currentIndex].querySelector('.next-button');
                if (nextButton) {
                    updateButtonState(nextButton, isValid);
                }
            });
        });
        
        // Special case for Web Design -> Development dependency
        const webDesignCheckbox = form.querySelector('#webDesign');
        const developmentCheckbox = form.querySelector('#development');
        
        if (webDesignCheckbox && developmentCheckbox) {
            webDesignCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    developmentCheckbox.disabled = false;
                    developmentCheckbox.classList.remove('cursor-not-allowed');
                    developmentCheckbox.classList.add('cursor-pointer');
                    
                    const container = developmentCheckbox.closest('.checkbox-container');
                    if (container) {
                        container.classList.remove('border-gray-300');
                        container.classList.add('border-black');
                    }
                    
                    const label = form.querySelector('label[for="development"]');
                    if (label) {
                        label.classList.remove('text-gray-400', 'cursor-not-allowed');
                        label.classList.add('cursor-pointer');
                    }
                } else {
                    developmentCheckbox.disabled = true;
                    developmentCheckbox.checked = false;
                    developmentCheckbox.classList.add('cursor-not-allowed');
                    developmentCheckbox.classList.remove('cursor-pointer');
                    
                    const container = developmentCheckbox.closest('.checkbox-container');
                    if (container) {
                        container.classList.add('border-gray-300');
                        container.classList.remove('border-black');
                        
                        const icon = container.querySelector('.checkbox-icon');
                        if (icon && !icon.classList.contains('hidden')) {
                            icon.classList.add('hidden');
                        }
                    }
                    
                    const label = form.querySelector('label[for="development"]');
                    if (label) {
                        label.classList.add('text-gray-400', 'cursor-not-allowed');
                        label.classList.remove('cursor-pointer');
                    }
                }
            });
        }
        
        // Special case for Budget radios
        const budgetCustomRadio = form.querySelector('#budgetCustom');
        const customBudgetContainer = form.querySelector('#customBudgetContainer');
        
        if (budgetCustomRadio && customBudgetContainer) {
            budgetCustomRadio.addEventListener('change', function() {
                if (this.checked) {
                    customBudgetContainer.classList.remove('hidden');
                    
                    // Focus the input
                    const customBudgetInput = customBudgetContainer.querySelector('#customBudget');
                    if (customBudgetInput) {
                        customBudgetInput.focus();
                    }
                }
            });
            
            // Hide custom budget if another option is selected
            form.querySelectorAll('input[name="budget"]').forEach(radio => {
                if (radio.id !== 'budgetCustom') {
                    radio.addEventListener('change', function() {
                        if (this.checked) {
                            customBudgetContainer.classList.add('hidden');
                        }
                    });
                }
            });
        }
        
        // Initialize checkbox and radio visual state
        form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                const container = checkbox.closest('.checkbox-container');
                if (container) {
                    const icon = container.querySelector('.checkbox-icon');
                    if (icon) {
                        icon.classList.remove('hidden');
                    }
                }
            }
        });
        
        form.querySelectorAll('input[type="radio"]').forEach(radio => {
            if (radio.checked) {
                const container = radio.closest('.radio-container');
                if (container) {
                    const indicator = container.querySelector('.radio-selected');
                    if (indicator) {
                        indicator.classList.remove('hidden');
                    }
                }
                
                // Handle custom budget
                if (radio.id === 'budgetCustom' && customBudgetContainer) {
                    customBudgetContainer.classList.remove('hidden');
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
        
        // Update initial button states
        steps.forEach((step, index) => {
            const isValid = validateBasicStep(step);
            const nextButton = step.querySelector('.next-button');
            if (nextButton) {
                updateButtonState(nextButton, isValid);
            }
        });
        
        // Initialize prev button visibility
        updatePrevButtonVisibility(0);
        
        console.log('Basic form navigation set up successfully');
    }
    
    /**
     * Get current step index
     * @returns {number} Current step index or -1 if not found
     */
    function getCurrentStepIndex() {
        const form = document.getElementById('inquiry-form');
        if (!form) return -1;
        
        const steps = Array.from(form.querySelectorAll('.step'));
        return steps.findIndex(step => !step.classList.contains('hidden'));
    }
    
    /**
     * Update prev button visibility based on step index
     * @param {number} index Step index
     */
    function updatePrevButtonVisibility(index) {
        const prevButtons = document.querySelectorAll('.prev-button');
        prevButtons.forEach(btn => {
            if (index === 0) {
                btn.classList.add('invisible');
            } else {
                btn.classList.remove('invisible');
            }
        });
    }
    
    /**
     * Update button state based on validation
     * @param {HTMLElement} button Button element
     * @param {boolean} isValid Validation state
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
    
    /**
     * Validate step in basic mode
     * @param {HTMLElement} step Step element
     * @returns {boolean} Validation result
     */
    function validateBasicStep(step) {
        if (!step) return false;
        
        // Required fields
        const requiredFields = step.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Skip radio and checkbox fields
            if (field.type === 'radio' || field.type === 'checkbox') return;
            
            // Check if field has value
            if (!field.value.trim()) {
                isValid = false;
            }
            
            // Special validation for email
            if (field.type === 'email' && field.value.trim() !== '') {
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailRegex.test(field.value.toLowerCase())) {
                    isValid = false;
                }
            }
        });
        
        // Required radio groups
        const radioGroups = new Set();
        step.querySelectorAll('input[type="radio"][required]').forEach(radio => {
            radioGroups.add(radio.name);
        });
        
        radioGroups.forEach(groupName => {
            const isAnyChecked = step.querySelector(`input[name="${groupName}"]:checked`) !== null;
            if (!isAnyChecked) {
                isValid = false;
            }
        });
        
        // Required checkboxes
        step.querySelectorAll('input[type="checkbox"][required]').forEach(checkbox => {
            if (!checkbox.checked) {
                isValid = false;
            }
        });
        
        // Check custom budget if visible and required
        const budgetCustomRadio = step.querySelector('#budgetCustom');
        const customBudgetContainer = step.querySelector('#customBudgetContainer');
        const customBudgetInput = customBudgetContainer?.querySelector('#customBudget');
        
        if (budgetCustomRadio && 
            customBudgetInput && 
            !customBudgetContainer.classList.contains('hidden') && 
            budgetCustomRadio.checked && 
            !customBudgetInput.value.trim()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
    
    // Expose public API
    return {
        init,
        loadAndOpenForm,
        openForm,
        closeForm
    };
})();