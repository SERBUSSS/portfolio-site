// Form animation script - derived from cardScrollType1.js
// but adapted for form steps and button navigation
document.addEventListener('DOMContentLoaded', function() {
    // Make sure GSAP is available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not found. Animations will be disabled.');
      return;
    }
    
    // Register GSAP plugins if available
    if (gsap.registerPlugin) {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }
    }
    
    // Get form elements
    const formContainer = document.querySelector('#c-form .bg-white');
    const formSteps = document.querySelectorAll('#inquiry-form .step');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Set up background animation if a background element exists
    setupFormBackground();
    
    // Initialize form card animations
    initializeFormCards();
    
    /**
     * Set up the form background animation
     */
    function setupFormBackground() {
      const backgroundElement = document.getElementById('background-form');
      
      if (backgroundElement && formContainer) {
        // Style the background element
        gsap.set(backgroundElement, {
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
          opacity: 0.8
        });
        
        // Create a subtle parallax effect on the background
        gsap.to(backgroundElement, {
          y: '10%',
          scrollTrigger: {
            trigger: '#c-form',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    }
    
    /**
     * Initialize the form card animations
     */
    function initializeFormCards() {
      if (!formSteps.length) return;
      
      // Set initial states for form steps
      formSteps.forEach((step, index) => {
        if (index === 0) {
          // First step is visible initially
          gsap.set(step, { 
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            transformOrigin: 'center center'
          });
        } else {
          // Hide other steps initially
          gsap.set(step, { 
            opacity: 0,
            y: 80,
            scale: 0.95,
            rotation: 0,
            transformOrigin: 'center center'
          });
        }
      });
      
      // Add event listeners for navigation buttons
      setupStepNavigation();
    }
    
    /**
     * Set up event listeners for step navigation
     */
    function setupStepNavigation() {
      // Next button transitions
      document.querySelectorAll('.next-button').forEach(button => {
        button.addEventListener('click', function() {
          const currentStep = this.closest('.step');
          const currentIndex = Array.from(formSteps).indexOf(currentStep);
          const nextIndex = currentIndex + 1;
          
          if (nextIndex < formSteps.length) {
            animateStepTransition(currentIndex, nextIndex);
          }
        });
      });
      
      // Previous button transitions
      document.querySelectorAll('.prev-button').forEach(button => {
        button.addEventListener('click', function() {
          const currentStep = this.closest('.step');
          const currentIndex = Array.from(formSteps).indexOf(currentStep);
          const prevIndex = currentIndex - 1;
          
          if (prevIndex >= 0) {
            animateStepTransition(currentIndex, prevIndex, true);
          }
        });
      });
      
      // Close button animation
      document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
          // Only animate if the user confirms closing
          if (confirm('Are you sure you want to close the form? Your progress will be lost.')) {
            animateFormClose();
          }
        });
      });
      
      // Submit button animation
      const form = document.getElementById('inquiry-form');
      if (form) {
        form.addEventListener('submit', function(e) {
          // Prevent the default form submission
          e.preventDefault();
          
          // Get the current visible step
          const currentStep = Array.from(formSteps).find(step => !step.classList.contains('hidden'));
          if (!currentStep) return;
          
          // Get form data for submission
          const formData = new FormData(form);
          const formObject = {};
          
          formData.forEach((value, key) => {
            // Skip editing-view textareas
            if (!key.includes('-editing')) {
              formObject[key] = value;
            }
          });
          
          // Animate the form submission
          animateFormSubmission(formObject);
        });
      }
    }
    
    /**
     * Animate transition between steps
     */
    function animateStepTransition(currentIndex, targetIndex, isPrevious = false) {
      const currentStep = formSteps[currentIndex];
      const targetStep = formSteps[targetIndex];
      
      // Direction of animation
      const direction = isPrevious ? -1 : 1;
      
      // Initial state for target step
      gsap.set(targetStep, {
        opacity: 0,
        y: 50 * direction,
        scale: 0.95,
        rotation: 0,
        display: 'block'
      });
      
      // Timeline for the transition
      const tl = gsap.timeline({
        onComplete: function() {
          // Make sure current step is hidden and target step is visible
          currentStep.classList.add('hidden');
          targetStep.classList.remove('hidden');
          
          // Update progress indicators
          updateProgressIndicators(targetIndex);
        }
      });
      
      // Animate current step out
      tl.to(currentStep, {
        opacity: 0,
        y: -50 * direction,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.inOut'
      });
      
      // Animate target step in
      tl.to(targetStep, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.2'); // Slight overlap for smoother transition
    }
    
    /**
     * Animate the form close action
     */
    function animateFormClose() {
      const visibleStep = Array.from(formSteps).find(step => !step.classList.contains('hidden'));
      
      if (!visibleStep || !formContainer) return;
      
      // Timeline for closing animation
      const tl = gsap.timeline({
        onComplete: function() {
          // Reset the form
          const form = document.getElementById('inquiry-form');
          if (form) form.reset();
          
          // Hide the form container
          formContainer.classList.add('hidden');
        }
      });
      
      // Animate the visible step away
      tl.to(visibleStep, {
        opacity: 0,
        x: '100%',
        duration: 0.5,
        ease: 'power2.inOut'
      });
      
      // Animate the form container
      tl.to(formContainer, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3
      }, '-=0.3');
    }
    
    /**
     * Animate the form submission
     */
    function animateFormSubmission(formData) {
      const visibleStep = Array.from(formSteps).find(step => !step.classList.contains('hidden'));
      if (!visibleStep) return;
      
      // Show loading state
      const submitButton = visibleStep.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';
        submitButton.disabled = true;
      }
      
      // Submit the form to Netlify function
      fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(result => {
        if (result.message === 'Form submitted successfully') {
          animateSuccessState();
        } else {
          animateErrorState();
        }
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        animateErrorState();
      })
      .finally(() => {
        // Reset button state if needed
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
    }
    
    /**
     * Animate the success state after form submission
     */
    function animateSuccessState() {
      if (!successMessage || !formContainer) return;
      
      // Get the visible step
      const visibleStep = Array.from(formSteps).find(step => !step.classList.contains('hidden'));
      if (!visibleStep) return;
      
      // Timeline for success animation
      const tl = gsap.timeline();
      
      // Animate current step out
      tl.to(visibleStep, {
        opacity: 0,
        y: -30,
        scale: 0.95,
        duration: 0.4
      });
      
      // Show success message
      tl.add(() => {
        // Hide form and show success message
        visibleStep.classList.add('hidden');
        formContainer.querySelector('form').classList.add('hidden');
        successMessage.classList.remove('hidden');
        
        // Set initial state for success message
        gsap.set(successMessage, {
          opacity: 0,
          y: 30,
          scale: 0.95
        });
      });
      
      // Animate success message in
      tl.to(successMessage, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.2)'
      });
    }
    
    /**
     * Animate the error state if form submission fails
     */
    function animateErrorState() {
      if (!errorMessage) return;
      
      // Set initial state for error message
      gsap.set(errorMessage, {
        opacity: 0,
        y: 20
      });
      
      // Show and animate error message
      errorMessage.classList.remove('hidden');
      
      gsap.to(errorMessage, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
      
      // Add a shake effect to highlight the error
      gsap.to(errorMessage, {
        x: [-10, 10, -8, 8, -5, 5, 0],
        duration: 0.6,
        ease: 'power1.inOut'
      });
    }
    
    /**
     * Update progress indicators when changing steps
     */
    function updateProgressIndicators(activeIndex) {
      formSteps.forEach((step, stepIndex) => {
        const progressIndicators = step.querySelectorAll('.flex.space-x-2 > div');
        
        if (!progressIndicators.length) return;
        
        progressIndicators.forEach((indicator, indicatorIndex) => {
          // Reset all indicators
          indicator.className = 'h-1 w-12 bg-gray-300 rounded';
          
          if (indicatorIndex < activeIndex) {
            // Previous steps - green filled
            indicator.className = 'h-6 w-12 bg-green-500 rounded';
          } else if (indicatorIndex === activeIndex) {
            // Current step - outlined
            indicator.className = 'h-6 w-12 border-2 border-black rounded';
          }
        });
      });
    }
});