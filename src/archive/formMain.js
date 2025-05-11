/**
 * Form Main Controller
 * Main entry point for the form functionality with improved coordination between modules
 */
const FormMainController = (function() {
    // State variables
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
     * Initialize open form buttons with click handlers
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
            console.log('Form is already open');
            return;
        }
        
        if (modulesLoaded) {
            // Modules already loaded, just open the form
            console.log('Modules already loaded, opening form...');
            openForm();
            return;
        }
        
        // Show loading overlay
        showLoadingOverlay();

        console.log('Initializing form modules...');
        
        // Initialize modules if globally available
        if (initializeFormModules()) {
            // Modules successfully initialized, open the form
            console.log('Modules successfully initialized');
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
        resetTextareas();
    }

    /**
     * Reset textareas to initial state
     */
    function resetTextareas() {
        // If we have a dedicated textarea fix module, use it
        if (window.textareaFix) {
            window.textareaFix.initializeAllTextareas();
            window.textareaFix.setupTextareaInteractions();
        } 
        // Otherwise if we have FormModule available, use it
        else if (modules.functionality && typeof modules.functionality.fixTextareaInitialStates === 'function') {
            modules.functionality.fixTextareaInitialStates();
            modules.functionality.initializeExpandableTextareas();
        }
    }
    
    /**
     * Initialize form modules if globally available
     * @returns {boolean} Success status
     */
    function initializeFormModules() {
        try {
            console.log('Checking for form modules:', {
                Animation: !!window.FormAnimation, 
                Validation: !!window.FormValidation, 
                Functionality: !!window.FormModule, 
                Integration: !!window.FormIntegration
            });

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
                console.log('Initializing form modules in sequence...');
                
                // 1. Initialize validation first
                if (typeof modules.validation.init === 'function') {
                    modules.validation.init();
                }
                
                // 2. Initialize functionality second
                if (typeof modules.functionality.init === 'function') {
                    modules.functionality.init();
                }
                
                // 3. Initialize animation third
                if (typeof modules.animation.init === 'function') {
                    modules.animation.init();
                }
                
                // 4. Initialize integration last (connects everything together)
                if (typeof modules.integration.init === 'function') {
                    modules.integration.init();
                }
                
                // Connect navigation buttons explicitly for extra redundancy
                if (typeof modules.integration.connectNavigationButtons === 'function') {
                    modules.integration.connectNavigationButtons();
                }
                
                return true;
            }
            
            console.warn('One or more required modules not found:',
                window.FormAnimation ? '✓' : '✗', 'Animation',
                window.FormValidation ? '✓' : '✗', 'Validation',
                window.FormModule ? '✓' : '✗', 'Functionality',
                window.FormIntegration ? '✓' : '✗', 'Integration'
            );
            
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

        // Prevent background scrolling
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
        
        // Activate validation here - after the form is shown
        if (modules.validation && typeof modules.validation.activateValidation === 'function') {
            modules.validation.activateValidation();
        }
        
        if (modules.animation && typeof modules.animation.openForm === 'function') {
            // Use animation module
            modules.animation.openForm();
        } else {
            // Fallback
            showFormFallback();
        }
    }

    function hardResetForm() {
        console.log('Hard resetting form state...');
        
        // Reset form state flags
        isFormOpen = false;
        
        // Re-enable scrolling with multiple approaches
        document.body.classList.remove('form-open');
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Make sure form elements are hidden
        const formSection = document.getElementById('c-form');
        const formOverlay = document.getElementById('form-overlay');
        
        if (formSection) {
            formSection.classList.add('hidden');
            formSection.classList.remove('flex');
            formSection.style.opacity = '1';
        }
        
        if (formOverlay) {
            formOverlay.classList.add('hidden');
            formOverlay.style.opacity = '0';
        }
        
        // Reset steps to initial state
        const steps = document.querySelectorAll('#inquiry-form .step');
        steps.forEach((step, index) => {
            // Reset transformations and styles
            step.style = '';
            
            // Show only first step, hide others
            if (index === 0) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });
        
        // Reset navbar z-index
        const navbar = document.getElementById('nav-bar-cont');
        if (navbar) {
            navbar.style.zIndex = '100';
        }
        
        console.log('Form has been hard reset');
    }
    
    /**
     * Close form
     */
    function closeForm() {
        console.log('Closing form with hard reset...');
        hardResetForm();
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
     * Show form fallback when animation module is not available
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
     * Hide form fallback when closing without animation module
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
     * Reset form to initial state
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
     * Setup basic form navigation for fallback mode
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
                } else {
                    // Show validation errors
                    showBasicValidationErrors(steps[currentIndex]);
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
            if (!validateBasicStep(steps[currentIndex])) {
                showBasicValidationErrors(steps[currentIndex]);
                return;
            }
            
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
        
        // Use integration module's validation if available
        if (modules.integration && typeof modules.integration.validateBasicStep === 'function') {
            return modules.integration.validateBasicStep(step);
        }
        
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
    
    /**
     * Show basic validation errors
     * @param {HTMLElement} step Step element to show errors for
     */
    function showBasicValidationErrors(step) {
        if (!step) return;
        
        // Clear previous error messages
        step.querySelectorAll('.error-message').forEach(msg => msg.remove());
        
        // Check required fields
        step.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
            // Skip radio and checkbox fields
            if (field.type === 'radio' || field.type === 'checkbox') return;
            
            // Special validation for email
            if (field.type === 'email' && field.value.trim() !== '') {
                const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailRegex.test(field.value.toLowerCase())) {
                    // Add error styling
                    field.classList.add('border-red-500');
                    
                    // Add error message
                    const errorMessage = document.createElement('p');
                    errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                    errorMessage.textContent = 'Please enter a valid email address';
                    field.parentNode.insertBefore(errorMessage, field.nextSibling);
                }
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
        });
        
        // Check radio groups
        const radioGroups = new Set();
        step.querySelectorAll('input[type="radio"][required]').forEach(radio => {
            radioGroups.add(radio.name);
        });
        
        radioGroups.forEach(groupName => {
            const isAnyChecked = step.querySelector(`input[name="${groupName}"]:checked`) !== null;
            
            if (!isAnyChecked) {
                // Get a container for the error message
                const firstRadio = step.querySelector(`input[type="radio"][name="${groupName}"]`);
                if (!firstRadio) return;
                
                const container = firstRadio.closest('.space-y-4') || firstRadio.closest('div');
                if (!container) return;
                
                // Add error message
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                errorMessage.textContent = 'Please select an option';
                container.appendChild(errorMessage);
                
                // Highlight the radio containers
                const radioContainers = container.querySelectorAll('.radio-container');
                radioContainers.forEach(radioContainer => {
                    radioContainer.classList.add('border-red-500');
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
        });
        
        // Check custom budget
        const budgetCustomRadio = step.querySelector('#budgetCustom');
        const customBudgetContainer = step.querySelector('#customBudgetContainer');
        
        if (budgetCustomRadio && 
            customBudgetContainer && 
            !customBudgetContainer.classList.contains('hidden') && 
            budgetCustomRadio.checked) {
            
            const customBudgetInput = customBudgetContainer.querySelector('#customBudget');
            if (customBudgetInput && !customBudgetInput.value.trim()) {
                // Add error styling
                customBudgetInput.classList.add('border-red-500');
                
                // Add error message
                const errorMessage = document.createElement('p');
                errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                errorMessage.textContent = 'Please specify your budget';
                customBudgetInput.parentNode.insertBefore(errorMessage, customBudgetInput.nextSibling);
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
     * Reset form parameters after closing
     */
    function resetFormParameters() {
        // Reset form state
        isFormOpen = false;
        
        // Re-enable scrolling - use multiple approaches to ensure it works
        document.body.classList.remove('form-open');
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Reset button states directly
        const nextButtons = document.querySelectorAll('.next-button');
        nextButtons.forEach(button => {
            // Reset any inline styles
            button.style = '';
            
            // Reset classes
            button.classList.add('opacity-50', 'cursor-not-allowed');
            button.classList.remove('hover:bg-gray-100');
            
            // Set disabled
            button.disabled = true;
        });
        
        console.log('Form parameters reset, scrolling should be enabled');
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
    
    // Expose public API
    return {
        init,
        loadAndOpenForm,
        openForm,
        closeForm,
        resetTextareas
    };
})();

window.formHelpers = {
    validateCurrentStep: function() {
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        const steps = Array.from(form.querySelectorAll('.step'));
        const currentStepIndex = steps.findIndex(step => !step.classList.contains('hidden'));
        
        if (currentStepIndex >= 0) {
            this.validateStep(currentStepIndex);
        }
    },
    
    validateStep: function(stepIndex) {
        const form = document.getElementById('inquiry-form');
        if (!form) return false;
        
        const steps = Array.from(form.querySelectorAll('.step'));
        if (stepIndex < 0 || stepIndex >= steps.length) return false;
        
        const step = steps[stepIndex];
        
        // Check required fields
        const requiredFields = step.querySelectorAll('input[required], textarea[required]');
        const allFieldsValid = Array.from(requiredFields).every(field => {
            if (field.type === 'radio' || field.type === 'checkbox') return true;
            if (field.type === 'email' && field.value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
            }
            return field.value.trim() !== '';
        });
        
        // Update button state
        const button = step.querySelector('.next-button');
        if (button) {
            // Clean implementation of button state
            button.disabled = !allFieldsValid;
            button.style.pointerEvents = allFieldsValid ? 'auto' : 'none';
            button.style.cursor = allFieldsValid ? 'pointer' : 'not-allowed';
            button.style.opacity = allFieldsValid ? '1' : '0.5';
            
            // Ensure click event is active when valid
            if (allFieldsValid) {
                const oldButton = button;
                const newButton = button.cloneNode(true);
                
                newButton.addEventListener('click', function() {
                    console.log('Direct button click handler');
                    window.formHelpers.goToNextStep();
                });
                
                oldButton.parentNode.replaceChild(newButton, oldButton);
            }
        }
        
        return allFieldsValid;
    },
    
    goToNextStep: function() {
        if (typeof FormAnimation !== 'undefined' && typeof FormAnimation.nextStep === 'function') {
            FormAnimation.nextStep();
        } else {
            // Simple direct implementation if animation module fails
            const form = document.getElementById('inquiry-form');
            if (!form) return;
            
            const steps = Array.from(form.querySelectorAll('.step'));
            const currentStepIndex = steps.findIndex(step => !step.classList.contains('hidden'));
            
            if (currentStepIndex >= 0 && currentStepIndex < steps.length - 1) {
                steps[currentStepIndex].classList.add('hidden');
                steps[currentStepIndex + 1].classList.remove('hidden');
            }
        }
    },
    
    resetForm: function() {
        // Direct DOM manipulation to reset the form
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        // Hide form elements
        const formSection = document.getElementById('c-form');
        const formOverlay = document.getElementById('form-overlay');
        
        if (formSection) {
            formSection.classList.add('hidden');
            formSection.classList.remove('flex');
        }
        
        if (formOverlay) {
            formOverlay.classList.add('hidden');
        }
        
        // Reset body scroll
        document.body.classList.remove('form-open');
        document.body.style.overflow = '';
        document.body.style.height = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        console.log('Form has been reset via direct helpers');
    }
};