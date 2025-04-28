// formImplementation.js - Main entry point for form functionality
document.addEventListener('DOMContentLoaded', function() {
    // First, make sure we have all required elements
    const formOverlay = document.getElementById('form-overlay');
    const formSection = document.getElementById('c-form');
    const formContainer = document.getElementById('form-container');
    const form = document.getElementById('inquiry-form');
    
    if (!formOverlay || !formSection || !formContainer || !form) {
      console.error('Required form elements are missing');
      return;
    }
    
    // Position the overlay correctly if it's not already
    if (formOverlay.parentElement !== document.body) {
      // If the overlay is not directly in the body, move it there
      document.body.appendChild(formOverlay);
    }
    
    // Make sure form section has the correct classes
    formSection.classList.add('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'overflow-y-auto');
    
    // Make sure we have all required styles for the form container
    if (formContainer) {
      formContainer.classList.add('bg-white', 'rounded-xl', 'shadow-2xl', 'max-w-md', 'w-full', 'mx-auto');
    }
    
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.error('GSAP is required for form animations');
      return;
    }
    
    // Initialize form animation functionality first
    if (typeof window.formAnimation === 'undefined') {
      console.log('Form animation module not found, initializing built-in animation');
      initFormAnimation();
    }
    
    // Form steps and buttons
    const steps = [...document.querySelectorAll('#inquiry-form .step')];
    const openBtns = document.querySelectorAll('[data-open-form="true"]');
    const nextBtns = document.querySelectorAll('.next-button');
    const prevBtns = document.querySelectorAll('.prev-button');
    const closeBtns = document.querySelectorAll('.close-button');
    
    // Make sure we have steps
    if (steps.length === 0) {
      console.error('No form steps found');
      return;
    }
    
    // Register event listeners for the open form buttons
    openBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.formAnimation.openForm();
      });
    });
    
    /**
     * Initialize built-in form animation if external module is not available
     */
    function initFormAnimation() {
      // State management
      let currentStep = 0;
      
      // Animation module API
      window.formAnimation = {
        openForm: function() {
          // Prevent background scrolling
          document.body.style.overflow = 'hidden';
          
          // Show form section and overlay
          formSection.classList.remove('hidden');
          formOverlay.classList.remove('hidden');
          
          // Animate overlay fade in
          gsap.to(formOverlay, {
            opacity: 0.7,
            duration: 0.3,
            ease: 'power2.out'
          });
          
          // Position all steps off-screen to the right initially
          steps.forEach(step => {
            if (step !== steps[0]) {
              step.classList.add('hidden');
            }
            gsap.set(step, {
              x: '100%',
              opacity: 0,
              scale: 1,
              rotation: 0
            });
          });
          
          // Animate first step in
          gsap.to(steps[0], {
            x: '0%',
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          });
          
          // Reset to first step
          currentStep = 0;
        },
        
        nextStep: function() {
          if (currentStep >= steps.length - 1) return false;
          
          const currentCard = steps[currentStep];
          const nextCard = steps[currentStep + 1];
          
          // Generate random slight rotation for current card
          const randomRotation = Math.random() * 6 - 3; // Between -3 and 3 degrees
          
          // Animate current card (scale down and rotate)
          gsap.to(currentCard, {
            scale: 0.9,
            rotation: randomRotation,
            opacity: 0.7,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: function() {
              // Hide current card when animation is done
              currentCard.classList.add('hidden');
            }
          });
          
          // Show next card and animate it in from right
          nextCard.classList.remove('hidden');
          gsap.fromTo(nextCard, 
            { x: '100%', opacity: 0 },
            { x: '0%', opacity: 1, duration: 0.5, ease: 'power2.out' }
          );
          
          // Update current step
          currentStep++;
          return true;
        },
        
        prevStep: function() {
          if (currentStep <= 0) return false;
          
          const currentCard = steps[currentStep];
          const prevCard = steps[currentStep - 1];
          
          // Animate current card out to the right
          gsap.to(currentCard, {
            x: '100%',
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: function() {
              // Hide current card when animation is done
              currentCard.classList.add('hidden');
            }
          });
          
          // Show previous card and animate it back to center
          prevCard.classList.remove('hidden');
          gsap.to(prevCard, {
            scale: 1,
            rotation: 0,
            x: '0%',
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
          });
          
          // Update current step
          currentStep--;
          return true;
        },
        
        closeForm: function() {
          // Animate current card out to the left
          gsap.to(steps[currentStep], {
            x: '-100%',
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in'
          });
          
          // Fade out overlay
          gsap.to(formOverlay, {
            opacity: 0,
            duration: 0.4
          });
          
          // Fade out form section
          gsap.to(formSection, {
            opacity: 0,
            duration: 0.4,
            onComplete: function() {
              // Reset all steps
              steps.forEach(step => {
                step.classList.add('hidden');
                gsap.set(step, {
                  x: 0,
                  scale: 1,
                  rotation: 0,
                  opacity: 1
                });
              });
              
              // Make first step visible for next time
              if (steps.length > 0) {
                steps[0].classList.remove('hidden');
              }
              
              // Hide form elements
              formSection.classList.add('hidden');
              formOverlay.classList.add('hidden');
              
              // Reset form opacity for next time
              gsap.set(formSection, { opacity: 1 });
              
              // Allow scrolling again
              document.body.style.overflow = '';
              
              // Reset current step
              currentStep = 0;
            }
          });
        },
        
        showSuccess: function() {
          const successMessage = document.getElementById('success-message');
          if (!successMessage) return;
          
          // Hide current step
          steps[currentStep].classList.add('hidden');
          
          // Show success message
          successMessage.classList.remove('hidden');
          gsap.fromTo(successMessage,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
        
        showError: function() {
          const errorMessage = document.getElementById('error-message');
          if (!errorMessage) return;
          
          // Show error message
          errorMessage.classList.remove('hidden');
          gsap.fromTo(errorMessage,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 }
          );
        },
        
        getCurrentStep: function() {
          return currentStep;
        }
      };
    }
    
    /**
     * Form validation (minimal implementation)
     */
    function validateCurrentStep() {
      const currentStepIndex = window.formAnimation.getCurrentStep();
      if (currentStepIndex < 0 || currentStepIndex >= steps.length) {
        return false;
      }
      
      const currentStepElement = steps[currentStepIndex];
      const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
      
      let isValid = true;
      
      // Clear all previous error messages
      const oldErrorMessages = currentStepElement.querySelectorAll('.error-message');
      oldErrorMessages.forEach(msg => msg.remove());
      
      // Validate all required inputs
      requiredInputs.forEach(input => {
        // Remove any existing error styling
        input.classList.remove('border-red-500');
        
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
          
          // Add error message
          const errorMessage = document.createElement('p');
          errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
          errorMessage.textContent = 'This field is required';
          input.parentNode.insertBefore(errorMessage, input.nextSibling);
          
          // Add event listener to remove error styling when user inputs valid data
          input.addEventListener('input', function() {
            if (this.value.trim()) {
              this.classList.remove('border-red-500');
              
              // Remove error message
              const errorMsg = this.nextElementSibling;
              if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
              }
            }
          }, { once: true });
        }
      });
      
      return isValid;
    }
    
    // Handle next button clicks with validation
    nextBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate before proceeding
        if (validateCurrentStep()) {
          window.formAnimation.nextStep();
        }
      });
    });
    
    // Handle prev button clicks
    prevBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.formAnimation.prevStep();
      });
    });
    
    // Handle close button clicks
    closeBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.formAnimation.closeForm();
      });
    });
    
    // Handle form submission
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate before submission
        if (!validateCurrentStep()) return;
        
        // Show loading state on submit button
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';
          submitBtn.disabled = true;
        }
        
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
          
          // Handle checkboxes for services
          const services = [];
          form.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
            services.push(checkbox.value);
          });
          formObject.services = services.length ? services.join(', ') : '';
          
          // Handle custom budget
          if (formObject.budget === 'custom' && formObject.customBudget) {
            formObject.budget = formObject.customBudget;
          }
          
          // Submit the form data
          const response = await fetch('/.netlify/functions/submit-form', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObject)
          });
          
          const result = await response.json();
          
          if (response.ok) {
            // Show success message
            window.formAnimation.showSuccess();
          } else {
            console.error('Form submission error:', result);
            window.formAnimation.showError();
          }
        } catch (error) {
          console.error('Form submission error:', error);
          window.formAnimation.showError();
        } finally {
          // Restore submit button
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }
      });
    }
  });