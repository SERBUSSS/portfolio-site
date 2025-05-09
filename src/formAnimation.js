/**
 * Form Animation Module
 * Handles all animations for the multi-step form including transitions between steps,
 * card stacking effects, and success/error animations.
 */
const FormAnimation = (function() {
    // Private variables
    let currentStep = 0;
    let isInitialized = false;
    
    // DOM elements
    let formOverlay, formSection, formContainer;
    let steps = [];
    let nextButtons = [];
    let prevButtons = [];
    let closeButtons = [];
    let successMessage, errorMessage;
    
    // Card stack properties
    const cardStackOffsets = [];
    const MAX_STACK_SIZE = 3; // Max number of cards to keep in the stack
    
    /**
     * Initialize the module - set up DOM references and event handlers
     */
    function init() {
        if (isInitialized) return;
        
        console.log('Initializing FormAnimation...');
        
        // Wait for DOM content to be loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initWhenReady);
        } else {
            initWhenReady();
        }
    }
    
    /**
     * Initialize when DOM is ready - find DOM elements and set up initial state
     */
    function initWhenReady() {
        try {
            // Get DOM elements
            formOverlay = document.getElementById('form-overlay');
            formSection = document.getElementById('c-form');
            formContainer = document.getElementById('form-container');

            console.log('Initializing FormAnimation with elements:', {
                formOverlay: formOverlay,
                formSection: formSection,
                formContainer: formContainer
            });
            
            // Check if form elements exist
            if (!formSection || !formOverlay) {
                console.log('Form elements not found, retrying in 100ms...');
                setTimeout(initWhenReady, 100);
                return;
            }
            
            steps = Array.from(document.querySelectorAll('#inquiry-form .step'));
            nextButtons = Array.from(document.querySelectorAll('.next-button'));
            prevButtons = Array.from(document.querySelectorAll('.prev-button'));
            closeButtons = Array.from(document.querySelectorAll('.close-button'));
            successMessage = document.getElementById('success-message');
            errorMessage = document.getElementById('error-message');
            
            // Setup event listeners for close buttons
            closeButtons.forEach(btn => {
                btn.addEventListener('click', closeForm);
            });
            
            // Initialize card stack positions
            for (let i = 0; i < steps.length; i++) {
                cardStackOffsets.push({
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    y: 0,
                    z: 0
                });
            }
            
            isInitialized = true;
            console.log('FormAnimation initialized successfully with', steps.length, 'steps');
        } catch (error) {
            console.error('Error initializing FormAnimation:', error);
        }
    }
    
    /**
     * Open form animation - displays the form with an entrance animation
     */
    function openForm() {
        console.log('Opening form...', formSection, formOverlay, steps);
        
        // Make sure we're initialized
        if (!isInitialized) {
            console.log('FormAnimation not initialized, initializing now...');
            init();
            // Wait a moment for initialization
            setTimeout(() => {
                if (isInitialized) {
                    console.log('Initialization successful, opening form now');
                    openForm();
                } else {
                    console.error('Could not initialize FormAnimation');
                }
            }, 100);
            return;
        }
        
        // Make sure form elements exist
        if (!formSection || !formOverlay) {
            console.error('Form elements not found', {formSection, formOverlay});
            return;
        }
        
        // Show form elements
        formSection.classList.remove('hidden');
        formSection.classList.add('flex');
        formOverlay.classList.remove('hidden');
        
        // Prevent background scrolling
        document.body.classList.add('overflow-hidden');

        // Lower the navbar z-index
        const headerContainer = document.getElementById('nav-bar-cont');
        if (headerContainer) {
            headerContainer.style.zIndex = '30'; // Lower than form z-index
        }
        
        // Animate overlay fade in
        if (typeof gsap !== 'undefined') {
            gsap.to(formOverlay, {
                opacity: 0.8,
                duration: 0.4,
                ease: 'power2.out'
            });
        } else {
            formOverlay.style.opacity = 0.8;
        }
        
        // Hide all steps except the first
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
            
            // Position all steps off-screen
            if (typeof gsap !== 'undefined') {
                gsap.set(step, {
                    x: '100%', 
                    opacity: 0,
                    scale: 1,
                    rotation: 0,
                    y: 0
                });
            } else {
                step.style.transform = 'translateX(100%)';
                step.style.opacity = 0;
            }
        });
        
        // Animate first step in
        if (typeof gsap !== 'undefined') {
            gsap.to(steps[0], {
                x: '0%',
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.2 // Slight delay after overlay appears
            });
        } else {
            steps[0].style.transform = 'translateX(0)';
            steps[0].style.opacity = 1;
        }
        
        // Reset stack
        resetCardStack();
        
        // Reset step
        setCurrentStep(0);
        
        // Initialize validation state
        if (typeof FormValidation !== 'undefined') {
            try {
                FormValidation.validateAndUpdateStep(0);
            } catch (e) {
                console.warn('Could not validate initial step', e);
            }
        }
    }
    
    /**
     * Next step animation - transitions to the next form step with animation
     * @returns {boolean} Success - whether the transition was successful
     */
    function nextStep() {
        console.log(`Attempting to move from step ${currentStep} to step ${currentStep + 1}`);
        
        if (currentStep >= steps.length - 1) return false;
        
        const currentCard = steps[currentStep];
        const nextCard = steps[currentStep + 1];
        
        // Generate random rotation (-5 to 5 degrees)
        const randomRotation = (Math.random() * 10) - 5;
        
        // Update stack information
        updateCardStackForward(randomRotation);
        
        // Animate current card to scaled/rotated position
        if (typeof gsap !== 'undefined') {
            gsap.to(currentCard, {
                scale: cardStackOffsets[0].scale,
                rotation: cardStackOffsets[0].rotation,
                y: cardStackOffsets[0].y,
                opacity: cardStackOffsets[0].opacity,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Apply z-index to keep proper stacking order
                    applyCardStackZIndices();
                }
            });
        } else {
            currentCard.style.transform = `scale(${cardStackOffsets[0].scale}) rotate(${cardStackOffsets[0].rotation}deg) translateY(${cardStackOffsets[0].y}px)`;
            currentCard.style.opacity = cardStackOffsets[0].opacity;
            // Apply z-index
            applyCardStackZIndices();
        }
        
        // Show next card
        nextCard.classList.remove('hidden');
        
        // Position next card off-screen
        if (typeof gsap !== 'undefined') {
            gsap.set(nextCard, {
                x: '100%',
                opacity: 0,
                scale: 1,
                rotation: 0,
                y: 0
            });
        } else {
            nextCard.style.transform = 'translateX(100%)';
            nextCard.style.opacity = 0;
        }
        
        // Animate next card in
        if (typeof gsap !== 'undefined') {
            gsap.to(nextCard, {
                x: '0%',
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        } else {
            nextCard.style.transform = 'translateX(0)';
            nextCard.style.opacity = 1;
        }
        
        // Update current step
        setCurrentStep(currentStep + 1);
        
        // Validate new step with a slight delay to ensure DOM is updated
        setTimeout(() => {
            if (typeof FormValidation !== 'undefined') {
                try {
                    console.log(`Triggering validation for new step ${currentStep}`);
                    FormValidation.validateAndUpdateStep(currentStep);
                } catch (e) {
                    console.warn('Could not validate step', currentStep, e);
                }
            }
        }, 100);
        
        return true;
    }
    
    /**
     * Previous step animation - transitions back to the previous form step
     * @returns {boolean} Success - whether the transition was successful
     */
    function prevStep() {
        if (currentStep <= 0) return false;
        
        const currentCard = steps[currentStep];
        const prevCard = steps[currentStep - 1];
        
        // Update stack information
        updateCardStackBackward();
        
        // Animate current card out to the right
        if (typeof gsap !== 'undefined') {
            gsap.to(currentCard, {
                x: '100%',
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    // Hide current card when animation is done
                    currentCard.classList.add('hidden');
                    
                    // Reset position
                    gsap.set(currentCard, {
                        x: '0%'
                    });
                    
                    // Apply z-index to keep proper stacking order
                    applyCardStackZIndices();
                }
            });
        } else {
            currentCard.style.transform = 'translateX(100%)';
            currentCard.style.opacity = 0;
            setTimeout(() => {
                currentCard.classList.add('hidden');
                currentCard.style.transform = 'translateX(0)';
                applyCardStackZIndices();
            }, 400);
        }
        
        // Show previous card and restore it to normal
        prevCard.classList.remove('hidden');
        
        // Animate previous card to normal
        if (typeof gsap !== 'undefined') {
            gsap.to(prevCard, {
                scale: 1,
                rotation: 0,
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        } else {
            prevCard.style.transform = 'scale(1) rotate(0) translateY(0)';
            prevCard.style.opacity = 1;
        }
        
        // Update current step
        setCurrentStep(currentStep - 1);
        
        // Validate new step
        if (typeof FormValidation !== 'undefined') {
            try {
                FormValidation.validateAndUpdateStep(currentStep);
            } catch (e) {
                console.warn('Could not validate step', currentStep, e);
            }
        }
        
        return true;
    }
    
    /**
     * Close form animation - animates the form closing and resets it
     */
    function closeForm() {
        console.log('FormAnimation.closeForm() called');
    
        // Animate current card out to the left
        if (typeof gsap !== 'undefined') {
            gsap.to(steps[currentStep], {
                x: '-100%',
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut'
            });
        } else {
            steps[currentStep].style.transform = 'translateX(-100%)';
            steps[currentStep].style.opacity = 0;
        }
        
        // Animate stacked cards out too (with delay)
        for (let i = 0; i < currentStep && i < MAX_STACK_SIZE; i++) {
            const stackedCard = steps[currentStep - i - 1];
            if (!stackedCard.classList.contains('hidden')) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(stackedCard, {
                        x: '-100%',
                        opacity: 0,
                        duration: 0.5,
                        delay: 0.1 * (i + 1),
                        ease: 'power2.inOut'
                    });
                } else {
                    stackedCard.style.transform = 'translateX(-100%)';
                    stackedCard.style.opacity = 0;
                    stackedCard.style.transitionDelay = `${0.1 * (i + 1)}s`;
                }
            }
        }
        
        // Fade out overlay
        if (typeof gsap !== 'undefined') {
            gsap.to(formOverlay, {
                opacity: 0,
                duration: 0.5,
                delay: 0.2
            });
        } else {
            formOverlay.style.opacity = 0;
            formOverlay.style.transitionDelay = '0.2s';
        }
    
        // Restore the navbar z-index after a delay to complete animations
        setTimeout(() => {
            const headerContainer = document.getElementById('nav-bar-cont');
            if (headerContainer) {
                headerContainer.style.zIndex = '100';
            }
        }, 500);
        
        // Hide form after animation completes
        if (typeof gsap !== 'undefined') {
            gsap.to(formSection, {
                opacity: 0,
                duration: 0.5,
                delay: 0.4,
                onComplete: () => {
                    // Reset form
                    resetForm();
                    
                    // Hide elements
                    formSection.classList.add('hidden');
                    formSection.classList.remove('flex');
                    formOverlay.classList.add('hidden');
                    
                    // Reset opacity for next opening
                    gsap.set(formSection, { opacity: 1 });
                    
                    // Allow scrolling again
                    document.body.classList.remove('overflow-hidden');
                    document.body.style.overflow = '';
                    document.body.style.height = '';
                    
                    console.log('Form animation completed, form is now hidden');
                }
            });
        } else {
            formSection.style.opacity = 0;
            formSection.style.transitionDelay = '0.4s';
            
            setTimeout(() => {
                // Reset form
                resetForm();
                
                // Hide elements
                formSection.classList.add('hidden');
                formSection.classList.remove('flex');
                formOverlay.classList.add('hidden');
                
                // Reset opacity for next opening
                formSection.style.opacity = 1;
                formSection.style.transitionDelay = '0s';
                
                // Reset overlay transition
                formOverlay.style.transitionDelay = '0s';
                
                // Reset stacked card transitions
                for (let i = 0; i < currentStep && i < MAX_STACK_SIZE; i++) {
                    const stackedCard = steps[currentStep - i - 1];
                    stackedCard.style.transitionDelay = '0s';
                }
                
                // Allow scrolling again
                document.body.classList.remove('overflow-hidden');
            }, 900);
        }
    }
    
    /**
     * Reset form to initial state
     */
    function resetForm() {
        // Hide all steps except the first one
        steps.forEach((step, index) => {
            if (index === 0) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
            
            // Reset transform and opacity
            if (typeof gsap !== 'undefined') {
                gsap.set(step, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1
                });
            } else {
                step.style.transform = 'translateX(0) translateY(0) scale(1) rotate(0)';
                step.style.opacity = 1;
            }
        });
        
        // Hide success and error messages
        if (successMessage) successMessage.classList.add('hidden');
        if (errorMessage) errorMessage.classList.add('hidden');
        
        // Reset to first step
        setCurrentStep(0);
        
        // Reset stack
        resetCardStack();
    }
    
    /**
     * Show success message animation
     */
    function showSuccess() {
        // Hide current step
        steps[currentStep].classList.add('hidden');
        
        // Show success message
        successMessage.classList.remove('hidden');
        
        // Animate success message
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(successMessage, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
        } else {
            successMessage.style.opacity = 1;
            successMessage.style.transform = 'translateY(0)';
        }
    }
    
    /**
     * Show error message animation
     */
    function showError() {
        // Show error message
        errorMessage.classList.remove('hidden');
        
        // Animate error message
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(errorMessage,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
            
            // Add shake animation for emphasis
            gsap.to(errorMessage, {
                x: [-10, 10, -8, 8, -5, 5, 0],
                duration: 0.6,
                ease: 'power1.inOut',
                delay: 0.1
            });
        } else {
            errorMessage.style.opacity = 1;
            errorMessage.style.transform = 'translateY(0)';
        }
    }
    
    /**
     * Set current step and update UI to reflect the current step
     * @param {number} index - The step index to set as current
     */
    function setCurrentStep(index) {
        currentStep = index;
        
        // Update progress indicators
        updateProgressIndicators();
        
        // Update prev button visibility
        if (currentStep === 0) {
            prevButtons.forEach(btn => btn.classList.add('invisible'));
        } else {
            prevButtons.forEach(btn => btn.classList.remove('invisible'));
        }
    }
    
    /**
     * Update progress indicators based on current step
     */
    function updateProgressIndicators() {
        // Adjust step index for progress display (skipping step 0)
        const displayStep = Math.max(0, currentStep - 1);
        
        // Get all progress indicator groups
        const progressGroups = document.querySelectorAll('.step .flex.space-x-2');
        
        progressGroups.forEach(group => {
            const indicators = Array.from(group.children);
            
            indicators.forEach((indicator, index) => {
                // Reset classes
                if (currentStep === 0) {
                    // Special case for initial step (shows all as empty)
                    indicator.className = 'h-1 w-12 bg-gray-300 rounded';
                } else if (index < displayStep) {
                    // Completed steps
                    indicator.className = 'h-6 w-12 bg-green-500 rounded';
                } else if (index === displayStep) {
                    // Current step
                    indicator.className = 'h-6 w-12 border-2 border-black rounded';
                } else {
                    // Future steps
                    indicator.className = 'h-1 w-12 bg-gray-300 rounded';
                }
            });
        });
    }
    
    /**
     * Update card stack when moving forward
     * @param {number} newRotation - Random rotation to apply to the current card
     */
    function updateCardStackForward(newRotation) {
        // Shift all cards down in the stack
        for (let i = MAX_STACK_SIZE - 1; i > 0; i--) {
            cardStackOffsets[i] = { ...cardStackOffsets[i-1] };
        }
        
        // Add new card to top of stack
        cardStackOffsets[0] = {
            scale: 0.95,
            rotation: newRotation,
            opacity: 0.8,
            y: '5%',
            z: -1
        };
    }
    
    /**
     * Update card stack when moving backward
     */
    function updateCardStackBackward() {
        // Shift all cards up in the stack
        for (let i = 0; i < MAX_STACK_SIZE - 1; i++) {
            cardStackOffsets[i] = { ...cardStackOffsets[i+1] };
        }
        
        // Clear the last position
        cardStackOffsets[MAX_STACK_SIZE - 1] = {
            scale: 1,
            rotation: 0,
            opacity: 1,
            y: 0,
            z: 0
        };
    }
    
    /**
     * Reset card stack to initial state
     */
    function resetCardStack() {
        for (let i = 0; i < cardStackOffsets.length; i++) {
            cardStackOffsets[i] = {
                scale: 1,
                rotation: 0,
                opacity: 1,
                y: 0,
                z: 0
            };
        }
    }
    
    /**
     * Apply z-index to maintain proper card stacking
     */
    function applyCardStackZIndices() {
        for (let i = 0; i < currentStep && i < MAX_STACK_SIZE; i++) {
            const stepIndex = currentStep - i - 1;
            if (stepIndex >= 0) {
                // Apply decreasing z-index to create proper stacking
                const zIndex = 10 - i;
                steps[stepIndex].style.zIndex = zIndex;
            }
        }
        
        // Current step always on top
        if (currentStep < steps.length) {
            steps[currentStep].style.zIndex = 20;
        }
    }
    
    // Public API
    return {
        init,
        openForm,
        nextStep,
        prevStep,
        closeForm,
        showSuccess,
        showError,
        getCurrentStep: () => currentStep
    };
})();

// Initialize when script is loaded
if (typeof FormAnimation !== 'undefined') {
    FormAnimation.init();
}

window.FormAnimation = FormAnimation;