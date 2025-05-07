/**
 * Form Initialization Script
 * Simple script to enable the form without needing to wait for all modules
 */
(function() {
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize open form buttons immediately
        const openButtons = document.querySelectorAll('[data-open-form="true"]');
        
        openButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Try to use FormMainController if available
                if (window.FormMainController && typeof window.FormMainController.loadAndOpenForm === 'function') {
                    window.FormMainController.loadAndOpenForm();
                } else {
                    // Simple fallback if modules aren't loaded
                    showSimpleForm();
                }
            });
        });
        
        // Initialize all links to #background-form
        const formLinks = document.querySelectorAll('a[href="#background-form"]');
        
        formLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Scroll to the form section
                const formSection = document.getElementById('background-form');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Find the open form button
                    const openFormButton = formSection.querySelector('[data-open-form="true"]');
                    if (openFormButton) {
                        // Simulate click after scroll completes
                        setTimeout(() => {
                            openFormButton.click();
                        }, 800);
                    }
                }
            });
        });
    });
    
    /**
     * Show a simple form without animations as fallback
     */
    function showSimpleForm() {
        // Get form elements
        const formSection = document.getElementById('c-form');
        const formOverlay = document.getElementById('form-overlay');
        
        if (!formSection || !formOverlay) {
            // Create overlay if it doesn't exist
            if (!formOverlay) {
                const overlay = document.createElement('div');
                overlay.id = 'form-overlay';
                overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-40';
                overlay.style.opacity = 0.8;
                document.body.appendChild(overlay);
                formOverlay = overlay;
            }
            
            console.error('Form elements not found');
            alert('The form could not be loaded. Please try again later.');
            return;
        }
        
        // Show form overlay
        formOverlay.classList.remove('hidden');
        
        // Show form container
        formSection.classList.remove('hidden');
        formSection.classList.add('flex');
        
        // Make first step visible
        const steps = document.querySelectorAll('#inquiry-form .step');
        if (steps.length > 0) {
            // Hide all steps
            steps.forEach(step => step.classList.add('hidden'));
            
            // Show first step
            steps[0].classList.remove('hidden');
        }
        
        // Setup form close buttons
        const closeButtons = document.querySelectorAll('#c-form .close-button');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (confirm('Are you sure you want to close the form? Your progress will be lost.')) {
                    closeSimpleForm();
                }
            });
        });
        
        // Close when clicking overlay
        formOverlay.addEventListener('click', function(e) {
            if (e.target === formOverlay) {
                if (confirm('Are you sure you want to close the form? Your progress will be lost.')) {
                    closeSimpleForm();
                }
            }
        });
        
        // Prevent scrolling
        document.body.classList.add('overflow-hidden');
        
        // Setup simple navigation
        setupSimpleFormNavigation();
    }
    
    /**
     * Close the simple form
     */
    function closeSimpleForm() {
        const formSection = document.getElementById('c-form');
        const formOverlay = document.getElementById('form-overlay');
        
        // Hide form elements
        if (formSection) {
            formSection.classList.add('hidden');
            formSection.classList.remove('flex');
        }
        
        if (formOverlay) {
            formOverlay.classList.add('hidden');
        }
        
        // Allow scrolling
        document.body.classList.remove('overflow-hidden');
        
        // Reset form if it exists
        const form = document.getElementById('inquiry-form');
        if (form) {
            form.reset();
        }
    }
    
    /**
     * Setup simple navigation for the form
     */
    function setupSimpleFormNavigation() {
        const form = document.getElementById('inquiry-form');
        if (!form) return;
        
        // Get steps
        const steps = Array.from(form.querySelectorAll('.step'));
        
        // Next buttons
        form.querySelectorAll('.next-button').forEach((button, index) => {
            button.addEventListener('click', function() {
                // Simple validation
                const currentStep = steps.findIndex(step => !step.classList.contains('hidden'));
                const currentStepElement = steps[currentStep];
                
                // Basic validation - check if all required fields have a value
                const requiredFields = currentStepElement.querySelectorAll('input[required], textarea[required], select[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    // Skip radio and checkbox
                    if (field.type === 'radio' || field.type === 'checkbox') return;
                    
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('border-red-500');
                    } else {
                        field.classList.remove('border-red-500');
                    }
                });
                
                if (!isValid) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                // Go to next step
                if (currentStep < steps.length - 1) {
                    // Hide current step
                    currentStepElement.classList.add('hidden');
                    
                    // Show next step
                    steps[currentStep + 1].classList.remove('hidden');
                }
            });
        });
        
        // Previous buttons
        form.querySelectorAll('.prev-button').forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = steps.findIndex(step => !step.classList.contains('hidden'));
                
                if (currentStep > 0) {
                    // Hide current step
                    steps[currentStep].classList.add('hidden');
                    
                    // Show previous step
                    steps[currentStep - 1].classList.remove('hidden');
                }
            });
        });
        
        // Form submission
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                // Get submit button
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = 'Submitting...';
                }
                
                // Get form data
                const formData = new FormData(form);
                const formObject = Object.fromEntries(formData.entries());
                
                // Handle checkboxes (services)
                const services = [];
                form.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
                    services.push(checkbox.value);
                });
                formObject.services = services.join(', ');
                
                // Submit form
                const response = await fetch('/.netlify/functions/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });
                
                const result = await response.json();
                
                // Handle response
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
                }
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error message
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.classList.remove('hidden');
                }
            } finally {
                // Re-enable submit button
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Submit Form';
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
})();