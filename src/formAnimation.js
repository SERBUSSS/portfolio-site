// Enhanced form animation script
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
    const formSection = document.getElementById('c-form');
    const formContainer = document.querySelector('#c-form .bg-white');
    const formSteps = document.querySelectorAll('#inquiry-form .step');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const completeFormButton = document.getElementById('complete-form-button');
    const startProjectButton = document.getElementById('start-project-button');
    
    // Create an array to store the completed steps
    let completedSteps = [];
    const stepsStack = [];
    
    // Hide the form section initially
    if (formSection) {
      gsap.set(formSection, { 
        autoAlpha: 0,
        display: 'none'
      });
    }
    
    // Add event listener to the "Complete Form" button
    if (completeFormButton) {
      completeFormButton.addEventListener('click', function() {
        showFormWithAnimation();
      });
    }
    
    // Add event listener to the "Start a Project" button
    if (startProjectButton) {
      startProjectButton.addEventListener('click', function() {
        // Scroll to the background-form section
        const backgroundFormSection = document.getElementById('background-form');
        if (backgroundFormSection) {
          backgroundFormSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // Connect all "start project" buttons throughout the page to navigate to the form
    document.querySelectorAll('a[href="#process"]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const backgroundFormSection = document.getElementById('background-form');
        if (backgroundFormSection) {
          backgroundFormSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    
    // Find buttons with "start project" text
    document.querySelectorAll('button').forEach(button => {
      if (button.textContent.toLowerCase().includes('start project') && button.id !== 'start-project-button') {
        button.addEventListener('click', function() {
          const backgroundFormSection = document.getElementById('background-form');
          if (backgroundFormSection) {
            backgroundFormSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }
    });
    
    /**
     * Show the form with an entrance animation
     */
    function showFormWithAnimation() {
      if (!formSection || !formContainer) return;
      
      // Position the form directly over the background form
      const backgroundFormSection = document.getElementById('background-form');
      if (backgroundFormSection) {
        // Set form position to overlay the background
        gsap.set(formSection, { 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          autoAlpha: 0,
          overflow: 'hidden'
        });
      }
      
      // First make the form section visible but transparent
      gsap.set(formSection, { 
        display: 'flex', 
        autoAlpha: 0 
      });
      
      // Position the form container in the center of the screen
      gsap.set(formContainer, {
        position: 'relative',
        maxHeight: '90vh',
        overflow: 'auto',
        margin: 'auto'
      });
      
      // Create a timeline for the entrance animation
      const tl = gsap.timeline({
        onComplete: function() {
          // Initialize the form steps after the container is visible
          initializeFormSteps();
        }
      });
      
      // Fade in the form section
      tl.to(formSection, {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.inOut'
      });
      
      // Animate the form container from the right
      tl.fromTo(formContainer, 
        { 
          x: '100%',
          opacity: 0,
          scale: 0.9
        }, 
        { 
          x: '0%',
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'back.out(1.2)'
        }
      );
    }
    
    /**
     * Initialize the form steps and their animations
     */
    function initializeFormSteps() {
      if (!formSteps.length) return;
      
      // Create div for stacked cards
      const stackContainer = document.createElement('div');
      stackContainer.className = 'stack-container';
      stackContainer.style.position = 'absolute';
      stackContainer.style.top = '50%';
      stackContainer.style.transform = 'translate(-50%, -50%)';
      stackContainer.style.width = '100%';
      stackContainer.style.height = '100%';
      stackContainer.style.pointerEvents = 'none';
      stackContainer.style.zIndex = '1';
      
      if (formContainer) {
        formContainer.style.position = 'relative';
        formContainer.style.backgroundColor = 'white';
        formContainer.style.borderRadius = '10px';
        formContainer.appendChild(stackContainer);
      }
      
      // Set initial states for form steps
      formSteps.forEach((step, index) => {
        if (index === 0) {
          // First step is visible initially
          gsap.set(step, { 
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            transformOrigin: 'center center',
            position: 'relative',
            zIndex: 20,
            display: 'block'
          });
        } else {
          // Hide other steps initially and position them off-screen to the right
          gsap.set(step, { 
            opacity: 0,
            x: '100%',
            scale: 0.9,
            rotation: 0,
            transformOrigin: 'center center',
            display: 'none',
            position: 'relative',
            zIndex: 20 - index
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
          
          // Use the validateStep function from formFunctionality.js
          if (window.validateStep && typeof window.validateStep === 'function') {
            if (window.validateStep(currentIndex)) {
              const nextIndex = currentIndex + 1;
              if (nextIndex < formSteps.length) {
                animateStepTransition(currentIndex, nextIndex);
              }
            }
          } else {
            // Fallback if validateStep is not available
            const nextIndex = currentIndex + 1;
            if (nextIndex < formSteps.length) {
              animateStepTransition(currentIndex, nextIndex);
            }
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
          
          // Use the validateStep function for the final step
          const currentStep = Array.from(formSteps).find(step => !step.classList.contains('hidden'));
          const currentIndex = Array.from(formSteps).indexOf(currentStep);
          
          if (window.validateStep && typeof window.validateStep === 'function') {
            if (!window.validateStep(currentIndex)) {
              return;
            }
          }
          
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
     * Create a clone of the step to be added to the stack
     */
    function addStepToStack(step, index) {
      const stackContainer = document.querySelector('.stack-container');
      if (!stackContainer) return;
      
      // Create a clone of the step
      const stepClone = step.cloneNode(true);
      stepClone.classList.add('stack-card');
      stepClone.style.position = 'absolute';
      stepClone.style.top = '50%';
      stepClone.style.left = '50%';
      stepClone.style.transform = 'translate(-50%, -50%)';
      stepClone.style.width = '100%';
      stepClone.style.height = 'auto';
      stepClone.style.pointerEvents = 'none';
      stepClone.style.zIndex = 10 - stepsStack.length;
      stepClone.style.backgroundColor = 'white';
      stepClone.style.borderRadius = '10px';
      
      // Remove any event listeners by replacing form elements
      const formElements = stepClone.querySelectorAll('input, textarea, button, select');
      formElements.forEach(el => {
        el.disabled = true;
        el.tabIndex = -1;
      });
      
      // Apply alternating rotation and offset
      const rotation = stepsStack.length % 2 === 0 ? -5 : 5;
      const offsetX = stepsStack.length % 2 === 0 ? -5 : 5;
      const offsetY = 10 + (stepsStack.length * 5);
      
      gsap.set(stepClone, {
        y: offsetY,
        x: offsetX,
        rotation: rotation,
        scale: 0.95 - (stepsStack.length * 0.03),
        opacity: 1,
        transformOrigin: 'center center'
      });
      
      // Add to the stack container
      stackContainer.appendChild(stepClone);
      
      // Add to our tracking array
      stepsStack.push({
        element: stepClone,
        index: index
      });
      
      return stepClone;
    }
    
    /**
     * Animate transition between steps
     */
    function animateStepTransition(currentIndex, targetIndex, isPrevious = false) {
      const currentStep = formSteps[currentIndex];
      const targetStep = formSteps[targetIndex];
      
      if (!isPrevious) {
        // Going forward - add the current step to the stack
        completedSteps.push(currentIndex);
      } else {
        // Going backward - remove the target step from completed list
        const index = completedSteps.indexOf(targetIndex);
        if (index > -1) {
          completedSteps.splice(index, 1);
        }
        
        // Remove the last card from the stack
        if (stepsStack.length > 0) {
          const lastStackItem = stepsStack.pop();
          if (lastStackItem && lastStackItem.element) {
            gsap.to(lastStackItem.element, {
              x: '100%',
              opacity: 0,
              duration: 0.4,
              ease: 'power2.inOut',
              onComplete: function() {
                if (lastStackItem.element.parentNode) {
                  lastStackItem.element.parentNode.removeChild(lastStackItem.element);
                }
              }
            });
          }
        }
      }
      
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
      
      if (isPrevious) {
        // Going back to previous step
        
        // Make target step visible but with starting animation values
        gsap.set(targetStep, {
          display: 'block',
          opacity: 0,
          x: '100%',
          rotation: 0,
          scale: 0.9,
          zIndex: 20
        });
        
        // Animate current step out to the right
        tl.to(currentStep, {
          x: '100%',
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut'
        });
        
        // Animate previous step in from the right
        tl.to(targetStep, {
          opacity: 1,
          x: '0%',
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.2)'
        }, '-=0.3'); // Slight overlap for smoother transition
        
      } else {
        // Going forward to next step
        
        // Save current position data
        const currentRect = currentStep.getBoundingClientRect();
        
        // Create a clone to add to the stack
        const stepClone = addStepToStack(currentStep, currentIndex);
        
        // Make target step visible but off screen to the right
        gsap.set(targetStep, {
          display: 'block',
          opacity: 0,
          x: '100%',
          y: 0,
          rotation: 0,
          scale: 0.9,
          zIndex: 20
        });
        
        // Hide the current step immediately after it's cloned
        gsap.set(currentStep, {
          opacity: 0,
          display: 'none'
        });
        
        // Animate next step in from the right
        tl.to(targetStep, {
          x: '0%',
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.2)'
        });
      }
    }
    
    /**
     * Animate the form close action
     */
    function animateFormClose() {
      const visibleStep = Array.from(formSteps).find(step => !step.classList.contains('hidden'));
      
      if (!visibleStep || !formContainer || !formSection) return;
      
      // Timeline for closing animation
      const tl = gsap.timeline({
        onComplete: function() {
          // Reset the form
          const form = document.getElementById('inquiry-form');
          if (form) form.reset();
          
          // Clear the stack
          const stackContainer = document.querySelector('.stack-container');
          if (stackContainer) {
            stackContainer.innerHTML = '';
          }
          stepsStack.length = 0;
          completedSteps.length = 0;
          
          // Hide the form container and section
          formSection.style.display = 'none';
        }
      });
      
      // Animate the visible step away
      tl.to(visibleStep, {
        x: '100%',
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      });
      
      // Animate the stacked cards
      const stackCards = document.querySelectorAll('.stack-card');
      if (stackCards.length) {
        tl.to(stackCards, {
          x: '-100%',
          opacity: 0,
          stagger: 0.1,
          duration: 0.3,
          ease: 'power2.inOut'
        }, '-=0.2');
      }
      
      // Animate the form container
      tl.to(formContainer, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4
      }, '-=0.2');
      
      // Fade out the entire form section
      tl.to(formSection, {
        autoAlpha: 0,
        duration: 0.4
      }, '-=0.2');
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
      
      // Animate the stacked cards
      const stackCards = document.querySelectorAll('.stack-card');
      if (stackCards.length) {
        tl.to(stackCards, {
          x: '-100%',
          opacity: 0,
          stagger: 0.1,
          duration: 0.3,
          ease: 'power2.inOut'
        });
      }
      
      // Animate current step out
      tl.to(visibleStep, {
        x: '100%',
        opacity: 0,
        duration: 0.5
      }, '-=0.2');
      
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
        duration: 0.6,
        ease: 'back.out(1.2)'
      });
      
      // Add a celebratory effect
      tl.add(() => {
        // Create a subtle bounce effect on the success message
        gsap.to(successMessage, {
          y: '-10px',
          duration: 0.3,
          repeat: 1,
          yoyo: true,
          ease: 'power2.inOut'
        });
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
    
    // Make validateStep accessible from this script
    if (window.validateStep) {
      console.log('Form validation function detected');
    } else {
      console.warn('Form validation function not found. Proceeding without validation.');
      
      // Create a simple validation function as fallback
      window.validateStep = function(stepIndex) {
        const currentStepElement = formSteps[stepIndex];
        const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        let isValid = true;
        
        requiredInputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
          } else {
            input.classList.remove('border-red-500');
          }
        });
        
        return isValid;
      };
    }
  });