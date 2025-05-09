/**
 * Form Steps Animation Fix
 * This script adds specific fixes for the form step animations without affecting card scrolling
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing form steps animation fix');
    
    // Wait for the FormAnimation to be available
    if (window.FormAnimation) {
        patchFormAnimation();
    } else {
        // Poll for FormAnimation to become available
        let checkCount = 0;
        const checkInterval = setInterval(() => {
            checkCount++;
            if (window.FormAnimation) {
                clearInterval(checkInterval);
                patchFormAnimation();
            }
            
            // Give up after 10 attempts
            if (checkCount >= 10) {
                clearInterval(checkInterval);
                console.warn('Could not find FormAnimation to patch');
            }
        }, 200);
    }
});

/**
 * Patch the FormAnimation module with fixes
 */
function patchFormAnimation() {
    console.log('Patching FormAnimation module');
    
    // Store the original functions
    const originalOpenForm = window.FormAnimation.openForm;
    const originalNextStep = window.FormAnimation.nextStep;
    const originalPrevStep = window.FormAnimation.prevStep;
    
    // Replace openForm with fixed version
    window.FormAnimation.openForm = function() {
        console.log('Opening form with animation fix');
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        
        // Apply blur to the overlay
        const formOverlay = document.getElementById('form-overlay');
        if (formOverlay) {
            formOverlay.style.backdropFilter = 'blur(8px)';
            formOverlay.style.WebkitBackdropFilter = 'blur(8px)';
        }
        
        // Make sure the form container is above everything else
        const formContainer = document.getElementById('c-form');
        if (formContainer) {
            formContainer.style.zIndex = '50';
        }
        
        // Lower the navigation bar z-index
        const navBar = document.getElementById('nav-bar-cont');
        if (navBar) {
            navBar.style.zIndex = '30';
        }
        
        // Call the original function
        originalOpenForm.call(window.FormAnimation);
    };
    
    // Replace nextStep with fixed version
    window.FormAnimation.nextStep = function() {
        console.log('Next step with animation fix');
        
        // Ensure step change animation works properly
        // Get current step for animation reference
        const currentStep = window.FormAnimation.getCurrentStep();
        const form = document.getElementById('inquiry-form');
        if (form) {
            const steps = Array.from(form.querySelectorAll('.step'));
            if (currentStep < steps.length - 1) {
                // Ensure proper animation for current step stacking
                if (typeof gsap !== 'undefined') {
                    // Animate current step out 
                    gsap.to(steps[currentStep], {
                        scale: 0.95,
                        opacity: 0.8,
                        y: '5%',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    // Make sure next step is ready
                    steps[currentStep + 1].classList.remove('hidden');
                    
                    // Animate next step in
                    gsap.fromTo(steps[currentStep + 1],
                        { x: '100%', opacity: 0 },
                        { x: '0%', opacity: 1, duration: 0.4, ease: 'power2.out' }
                    );
                }
            }
        }
        
        // Call the original function
        originalNextStep.call(window.FormAnimation);
    };
    
    // Replace prevStep with fixed version
    window.FormAnimation.prevStep = function() {
        console.log('Previous step with animation fix');
        
        // Ensure step change animation works properly
        const currentStep = window.FormAnimation.getCurrentStep();
        const form = document.getElementById('inquiry-form');
        if (form) {
            const steps = Array.from(form.querySelectorAll('.step'));
            if (currentStep > 0) {
                // Ensure proper animation for returning to previous step
                if (typeof gsap !== 'undefined') {
                    // Animate current step out
                    gsap.to(steps[currentStep], {
                        x: '100%',
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            steps[currentStep].classList.add('hidden');
                        }
                    });
                    
                    // Make sure previous step is visible
                    steps[currentStep - 1].classList.remove('hidden');
                    
                    // Animate previous step back to full size
                    gsap.to(steps[currentStep - 1], {
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            }
        }
        
        // Call the original function
        originalPrevStep.call(window.FormAnimation);
    };
    
    console.log('FormAnimation patched successfully');
}