// formCardSystem.js - Handles card animations for the multi-step form
document.addEventListener('DOMContentLoaded', function() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
      console.warn('GSAP not found. Animations will be disabled.');
      return;
  }
  
  // Form elements
  const formOverlay = document.getElementById('form-overlay');
  const formContainer = document.getElementById('form-container');
  const form = document.getElementById('inquiry-form');
  const steps = document.querySelectorAll('#inquiry-form .step');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  // State management
  let currentStep = 0;
  let isFormVisible = false;
  
  // Initialize the cards system
  setupTriggers();
  
  /**
   * Setup all trigger buttons for opening the form
   */
  function setupTriggers() {
      // Form opening buttons
      document.querySelectorAll('[data-open-form="true"]').forEach(button => {
          button.addEventListener('click', function(e) {
              e.preventDefault();
              showForm();
          });
      });
      
      // Next buttons
      document.querySelectorAll('.next-button').forEach(button => {
          button.addEventListener('click', function() {
              // Before moving to the next step, we would normally validate
              // For this simplified version, we'll just move forward
              nextStep();
          });
      });
      
      // Previous buttons
      document.querySelectorAll('.prev-button').forEach(button => {
          button.addEventListener('click', function() {
              previousStep();
          });
      });
      
      // Close buttons
      document.querySelectorAll('.close-button').forEach(button => {
          button.addEventListener('click', function() {
              closeForm();
          });
      });
  }
  
  /**
   * Show the form overlay and animate the first card in
   */
  function showForm() {
    if (isFormVisible) return;
    isFormVisible = true;
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    
    // Show and animate overlay
    formOverlay.classList.remove('hidden');
    gsap.to(formOverlay, {
        opacity: 0.7,
        duration: 0.3
    });
    
    // Show form container
    formContainer.classList.remove('hidden');
    gsap.set(formContainer, {
        opacity: 1
    });
    
    // Make the #c-form section visible for click handling on the form
    document.getElementById('c-form').classList.add('pointer-events-auto');
    
    // Reset to first step
    currentStep = 0;
      
      // Reset all cards to initial state
      steps.forEach((step, index) => {
          if (index === 0) {
              // First card comes from right
              gsap.set(step, {
                  x: '100%',
                  opacity: 0,
                  scale: 1,
                  rotation: 0,
                  display: 'block'
              });
          } else {
              // Hide all other cards
              step.style.display = 'none';
          }
      });
      
      // Animate first card in
      gsap.to(steps[0], {
          x: '0%',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
      });
      
      // Update progress indicators if needed
      updateProgressIndicators();
  }
  
  /**
   * Animate to next step
   */
  function nextStep() {
      if (currentStep >= steps.length - 1) return;
      
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
              currentCard.style.display = 'none';
          }
      });
      
      // Show next card and animate it in from right
      nextCard.style.display = 'block';
      gsap.fromTo(nextCard, 
          { x: '100%', opacity: 0 },
          { x: '0%', opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      
      // Update current step
      currentStep++;
      updateProgressIndicators();
  }
  
  /**
   * Animate to previous step
   */
  function previousStep() {
      if (currentStep <= 0) return;
      
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
              currentCard.style.display = 'none';
          }
      });
      
      // Show previous card and lift it back to center
      prevCard.style.display = 'block';
      gsap.to(prevCard, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out'
      });
      
      // Update current step
      currentStep--;
      updateProgressIndicators();
  }
  
  /**
   * Close the form
   */
  function closeForm() {
    if (!isFormVisible) return;
    
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
        duration: 0.4,
        onComplete: function() {
            // Hide form elements
            formOverlay.classList.add('hidden');
            formContainer.classList.add('hidden');
            
            // Make the #c-form section non-clickable again
            document.getElementById('c-form').classList.remove('pointer-events-auto');
            
            // Reset cards to initial state
            steps.forEach(step => {
                step.style.display = 'none';
                gsap.set(step, {
                    x: 0,
                    scale: 1,
                    rotation: 0,
                    opacity: 1
                });
            });
            
            // Allow scrolling again
            document.body.style.overflow = '';
            
            // Reset states
            isFormVisible = false;
            currentStep = 0;
        }
    });
  }
  
  /**
   * Update progress indicators based on current step
   */
  function updateProgressIndicators() {
      steps.forEach((step, index) => {
          const progressIndicators = step.querySelectorAll('.flex.space-x-2 > div');
          
          if (!progressIndicators.length) return;
          
          progressIndicators.forEach((indicator, indicatorIndex) => {
              // Reset all indicators
              indicator.className = 'h-1 w-12 bg-gray-300 rounded';
              
              if (indicatorIndex < currentStep) {
                  // Previous steps - green filled
                  indicator.className = 'h-6 w-12 bg-green-500 rounded';
              } else if (indicatorIndex === currentStep) {
                  // Current step - outlined
                  indicator.className = 'h-6 w-12 border-2 border-black rounded';
              }
          });
      });
  }
  
  /**
   * Show success message
   */
  function showSuccess() {
      if (!successMessage) return;
      
      // Hide form
      form.classList.add('hidden');
      steps[currentStep].style.display = 'none';
      
      // Show success message
      successMessage.classList.remove('hidden');
      gsap.fromTo(successMessage,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
      );
  }
  
  /**
   * Show error message
   */
  function showError() {
      if (!errorMessage) return;
      
      // Show error message
      errorMessage.classList.remove('hidden');
      gsap.fromTo(errorMessage,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
      );
  }
  
  // Make functions available for external use (like form validation)
  window.formCards = {
      nextStep,
      previousStep,
      showSuccess,
      showError
  };
});