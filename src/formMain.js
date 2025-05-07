/**
 * Form Main Controller - Enhanced
 * Main entry point for the form functionality with improved coordination between modules
 */
(function() {
    // State
    let isInitialized = false;
    let modulesLoaded = false;
    
    // Configuration
    const config = {
        dependencies: [
            { 
                name: 'GSAP', 
                global: 'gsap',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
                required: false // Make it optional to avoid breaking if CDN fails
            }
        ],
        modules: [
            { 
                name: 'FormAnimation', 
                global: 'FormAnimation',
                src: '/src/formAnimation.js',
                required: true
            },
            { 
                name: 'FormValidation', 
                global: 'FormValidation',
                src: '/src/formValidation.js',
                required: true
            },
            { 
                name: 'FormModule', 
                global: 'FormModule',
                src: '/src/formFunctionality.js',
                required: true
            },
            { 
                name: 'FormIntegration', 
                global: 'FormIntegration',
                src: '/src/formIntegration.js',
                required: true
            }
        ]
    };
    
    /**
     * Initialize when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Form Main Controller initializing...');
        
        // Add form containers if not present
        ensureFormContainers();
        
        // Initialize open form buttons
        initializeOpenFormButtons();
        
        // Setup click handlers on form links in the site
        setupFormLinkHandlers();
        
        // Check if we should auto-open the form based on URL hash
        checkAutoOpenForm();
    });
    
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
                        if (typeof FormAnimation !== 'undefined') {
                            FormAnimation.closeForm();
                        } else {
                            hideForm();
                        }
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
            button.addEventListener('click', function(e) {
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
            link.addEventListener('click', function(e) {
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
        if (modulesLoaded) {
            // Modules already loaded, just open the form
            if (typeof FormAnimation !== 'undefined') {
                FormAnimation.openForm();
            } else {
                // Fallback without animation
                showForm();
            }
            return;
        }
        
        // Show loading overlay
        showLoadingOverlay();
        
        // Load dependencies first
        loadDependencies()
            .then(() => {
                // Then load and initialize modules
                return loadModules();
            })
            .then(() => {
                // Initialize modules if they have an init function
                initializeModules();
                
                // Hide loading overlay
                hideLoadingOverlay();
                
                // Mark as loaded
                modulesLoaded = true;
                
                // Wait a moment for modules to initialize
                setTimeout(() => {
                    // Open form
                    if (typeof FormAnimation !== 'undefined') {
                        FormAnimation.openForm();
                    } else {
                        // Fallback without animation
                        showForm();
                    }
                }, 300);
            })
            .catch(error => {
                // Hide loading overlay
                hideLoadingOverlay();
                
                console.error('Failed to load form dependencies:', error);
                alert('There was an error loading the form. Please try again later.');
            });
    }
    
    /**
     * Initialize modules if they have an init function
     */
    function initializeModules() {
        // Try to initialize individual modules
        for (const module of config.modules) {
            if (window[module.global] && typeof window[module.global].init === 'function') {
                try {
                    window[module.global].init();
                } catch (e) {
                    console.error(`Error initializing ${module.name}:`, e);
                }
            }
        }
    }
    
    /**
     * Load dependencies
     * @returns {Promise} Promise that resolves when dependencies are loaded
     */
    function loadDependencies() {
        return loadScriptsSequentially(config.dependencies);
    }
    
    /**
     * Load modules
     * @returns {Promise} Promise that resolves when modules are loaded
     */
    function loadModules() {
        return loadScriptsSequentially(config.modules);
    }
    
    /**
     * Load scripts sequentially
     * @param {Array} scripts Array of script objects to load
     * @param {number} index Current index
     * @returns {Promise} Promise that resolves when all scripts are loaded
     */
    function loadScriptsSequentially(scripts, index = 0) {
        if (index >= scripts.length) {
            return Promise.resolve();
        }
        
        const script = scripts[index];
        
        // Skip if already loaded
        if (script.global && window[script.global] !== undefined) {
            console.log(`${script.name} already loaded, skipping...`);
            return loadScriptsSequentially(scripts, index + 1);
        }
        
        // Load script
        return loadScript(script.src)
            .then(() => {
                console.log(`${script.name} loaded successfully`);

                // Load next script
                return loadScriptsSequentially(scripts, index + 1);
            })
            .catch(error => {
                console.error(`Failed to load ${script.name}:`, error);
                
                if (script.required) {
                    // Re-throw if required
                    throw new Error(`Failed to load required module: ${script.name}`);
                } else {
                    // Skip if not required
                    console.warn(`Skipping non-required module: ${script.name}`);
                    return loadScriptsSequentially(scripts, index + 1);
                }
            });
    }
    
    /**
     * Load script
     * @param {string} src Script source
     * @returns {Promise} Promise that resolves when script is loaded
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
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
     * Show form without animation (fallback)
     */
    function showForm() {
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
        }
    }
    
    /**
     * Hide form without animation (fallback)
     */
    function hideForm() {
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
        }
    }
    
    /**
     * Reset form (fallback)
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
    
    // Expose public API (for debugging)
    window.FormMainController = {
        loadAndOpenForm,
        showForm,
        hideForm
    };
})();