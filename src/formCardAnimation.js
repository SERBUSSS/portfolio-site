// formAnimation.js - Handles card animations for the multi-step form

document.addEventListener('DOMContentLoaded', function() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
      console.error('GSAP is required for form animations');
      return;
    }
    
    // Form elements
    const formOverlay = document.getElementById('form-overlay');
    const formSection = document.getElementById('c-form');
    const formContainer = document.getElementById('form-container');
    const steps = [...document.querySelectorAll('#inquiry-form .step')];
    const openBtns = document.querySelectorAll('[data-open-form="true"]');
    const nextBtns = document.querySelectorAll('.next-button');
    const prevBtns = document.querySelectorAll('.prev-button');
    const closeBtns = document.querySelectorAll('.close-button');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // State management
    let currentStep = 0;
    
    // Setup event listeners
    function init() {
      // Open form buttons
      openBtns.forEach(btn => {
          btn.addEventListener('click', function (e) {
              e.preventDefault();

              // Dynamically load formFunctionality.js
              const formFunctionalityScript = document.createElement('script');
              formFunctionalityScript.src = 'src/formFunctionality.js';
              formFunctionalityScript.type = 'module';
              document.body.appendChild(formFunctionalityScript);

              // Open the form
              openForm();
          });
      });
      
      // Close buttons (just register the event here, validation happens in formFunctionality.js)
      closeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          closeForm();
        });
      });
      
      // The next/prev buttons are handled by formFunctionality.js
      // which will call the nextStep/prevStep methods from this module
    }
    
    /**
     * Opens the form and animates the first step
     */
    function openForm() {
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
    }
    
    /**
     * Animates to the next step
     * @returns {boolean} Whether the animation was successful
     */
    function nextStep() {
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
    }
    
    /**
     * Animates to the previous step
     * @returns {boolean} Whether the animation was successful
     */
    function prevStep() {
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
    }
    
    /**
     * Closes the form
     */
    function closeForm() {
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
          // Reset all steps and hide form
          resetForm();
          
          // Hide form elements
          formSection.classList.add('hidden');
          formOverlay.classList.add('hidden');
          
          // Reset form opacity for next time
          gsap.set(formSection, { opacity: 1 });
          
          // Allow scrolling again
          document.body.style.overflow = '';
        }
      });
    }
    
    /**
     * Resets all form steps to initial state
     */
    function resetForm() {
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
      
      // Hide success and error messages if they exist
      if (successMessage) successMessage.classList.add('hidden');
      if (errorMessage) errorMessage.classList.add('hidden');
      
      // Reset current step
      currentStep = 0;
    }
    
    /**
     * Shows success message animation
     */
    function showSuccess() {
      // Hide current step
      steps[currentStep].classList.add('hidden');
      
      // Show success message
      successMessage.classList.remove('hidden');
      gsap.fromTo(successMessage,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
    
    /**
     * Shows error message animation
     */
    function showError() {
      // Show error message
      errorMessage.classList.remove('hidden');
      gsap.fromTo(errorMessage,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
    
    /**
     * Gets the current step index
     * @returns {number} Current step index
     */
    function getCurrentStep() {
      return currentStep;
    }
    
    // Initialize the module
    init();
    
    // Expose public API
    window.formAnimation = {
      openForm,
      nextStep,
      prevStep,
      closeForm,
      showSuccess,
      showError,
      getCurrentStep
    };
  });