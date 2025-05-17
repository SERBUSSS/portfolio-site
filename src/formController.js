// formController.js - Main control script for the form functionality
// This handles all form interactions, animations, and validation

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const formOpenBtn = document.getElementById('open-form-btn');
  const formContainer = document.getElementById('form-container');
  const formOverlay = document.getElementById('form-overlay');
  const form = document.getElementById('multi-step-form');
  const steps = document.querySelectorAll('.step');
  const nextButtons = document.querySelectorAll('.next-button');
  const prevButtons = document.querySelectorAll('.prev-button');
  const closeButtons = document.querySelectorAll('.close-button');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  const tryAgainButton = document.getElementById('try-again-button');
  
  // Social media functionality
  const addSocialButton = document.querySelector('.add-social-button');
  const socialMediaFields = document.querySelector('.social-media-fields');
  const maxSocialFieldsMessage = document.getElementById('max-social-fields-message');
  
  // Optional question toggle
  const showQuestionButton = document.getElementById('show-question-button');
  const hideQuestionButton = document.getElementById('hide-question-button');
  const optionalQuestionContainer = document.getElementById('optional-question-container');
  
  // Custom budget fields
  const budgetCustomRadio = document.getElementById('budgetCustom');
  const customBudgetContainer = document.getElementById('customBudgetContainer');
  
  // Special states for textareas
  const questionContainers = document.querySelectorAll('.question-container');
  
  // Web Design & Development checkboxes
  const webDesignCheckbox = document.getElementById('webDesign');
  const developmentCheckbox = document.getElementById('development');
  
  // Current step tracker
  let currentStep = 0;
  
  // Define final positions for the staggered card stack pattern
  const finalPositions = [
    { x: '-300px', y: '-200px', rotation: -5 },
    { x: '-150px', y: '-100px', rotation: 2 },
    { x: '150px', y: '0px', rotation: -3 },
    { x: '300px', y: '100px', rotation: 5 },
    { x: '200px', y: '200px', rotation: -2 }
  ];
  
  // Animation durations
  const animDurations = {
    overlay: 0.3,
    cardSlide: 0.5,
    cardStack: 0.3,
    stagger: 0.1
  };
  
  // Check if device is mobile
  const isMobile = () => window.innerWidth < 768;
  
  // ---------------
  // CORE FORM CONTROL
  // ---------------
  
  // Initialize the form
  const initForm = () => {
    // Show the first step only
    steps.forEach((step, index) => {
      if (index === 0) step.classList.remove('hidden');
      else step.classList.add('hidden');
    });

    // Center cards in the form
    const formElement = document.getElementById('multi-step-form');
    formElement.style.display = 'flex';
    formElement.style.flexDirection = 'column';
    formElement.style.justifyContent = 'center';
    formElement.style.alignItems = 'center';
    formElement.style.height = '100%';
    
    steps.forEach((step, index) => {
      step.style.position = 'absolute';
      step.style.left = '50%';
      step.style.top = '50%';
      step.style.transform = 'translate(-50%, -50%)';
      
      if (index !== currentStep) {
        step.classList.add('hidden');
      }
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize validation for the first step
    validateStep(0);

    setupInputVisualStates();
  };
  
  // Setup all event listeners
  const setupEventListeners = () => {
    // Open form button
    if (formOpenBtn) {
      formOpenBtn.addEventListener('click', openForm);
    }
    
    // Add more social media fields
    if (addSocialButton) {
      addSocialButton.addEventListener('click', addSocialMediaField);
    }
    
    // Custom budget toggle
    if (budgetCustomRadio) {
      budgetCustomRadio.addEventListener('change', toggleCustomBudget);
      document.querySelectorAll('input[name="budget"]').forEach(radio => {
        radio.addEventListener('change', () => {
          if (radio.id !== 'budgetCustom') {
            customBudgetContainer.classList.add('hidden');
          }
        });
      });
    }
    
    // Web Design & Development checkbox dependency
    if (webDesignCheckbox && developmentCheckbox) {
      webDesignCheckbox.addEventListener('change', updateDevelopmentCheckbox);
    }
    
    // Optional question toggle
    if (showQuestionButton && hideQuestionButton && optionalQuestionContainer) {
      showQuestionButton.addEventListener('click', showOptionalQuestion);
      hideQuestionButton.addEventListener('click', hideOptionalQuestion);
    }
    
    // Next buttons
    nextButtons.forEach(button => {
      button.addEventListener('click', goToNextStep);
    });
    
    // Previous buttons
    prevButtons.forEach(button => {
      button.addEventListener('click', goToPrevStep);
    });
    
    // Close buttons
    closeButtons.forEach(button => {
      button.addEventListener('click', closeForm);
    });
    
    // Try again button
    if (tryAgainButton) {
      tryAgainButton.addEventListener('click', hideErrorMessage);
    }
    
    // Form submission
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }
    
    // Special textarea handlers
    setupTextareaHandlers();
    
    // Social media type change
    setupSocialMediaTypeHandlers();
    
    // Input fields validation
    setupInputValidation();
  };
  
  // ---------------
  // FORM OPEN/CLOSE
  // ---------------
  
  // Open the form with animation
  const openForm = () => {
    // First, ensure form container is properly reset and visible
    formContainer.classList.remove('hidden');
    formContainer.style.display = 'flex';
    formContainer.style.visibility = 'visible';
    formContainer.style.opacity = '1';
    
    // Show overlay
    formOverlay.classList.remove('hidden');
    
    // Set up the form container to fill the screen and center content
    formContainer.style.position = 'fixed';
    formContainer.style.top = '0';
    formContainer.style.left = '0';
    formContainer.style.width = '100vw';
    formContainer.style.height = '100vh';
    formContainer.style.justifyContent = 'center';
    formContainer.style.alignItems = 'center';
    formContainer.style.zIndex = '50';
    
    // Make sure the form takes the full space
    form.style.position = 'relative';
    form.style.width = '100%';
    form.style.height = '100%';
    form.style.display = 'flex';
    form.style.justifyContent = 'center';
    form.style.alignItems = 'center';
    
    // Disable background scrolling
    document.body.style.overflow = 'hidden';
    
    // Animate overlay fading in
    gsap.to(formOverlay, {
      duration: animDurations.overlay,
      opacity: 0.5,
      ease: 'power2.out'
    });
    
    // Get the first step and ensure it's visible
    const firstStep = steps[0];
    firstStep.classList.remove('hidden');
    
    // Set initial position (off-screen to the right)
    gsap.set(firstStep, {
      x: '100vw',
      opacity: 0
    });
    
    // Animate first card sliding in
    gsap.to(firstStep, {
      duration: animDurations.cardSlide,
      x: 0,
      opacity: 1,
      ease: 'power2.out'
    });
  };
  
  // Close the form with animation
  const closeForm = () => {
    const wasSuccessful = !successMessage.classList.contains('hidden');
    
    if (wasSuccessful) {
      // Form was submitted successfully - position it over the form-entry section
      const formEntrySection = document.getElementById('form-entry');
      
      if (formEntrySection) {
        const formEntryRect = formEntrySection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        formContainer.style.position = 'absolute';
        formContainer.style.top = `${formEntryRect.top + scrollTop}px`;
        formContainer.style.left = '0';
        formContainer.style.width = '100vw';
        formContainer.style.height = `${formEntryRect.height}px`;
        formContainer.style.zIndex = '10';
      }
      
      // Make all cards non-interactive
      steps.forEach(step => {
        step.style.pointerEvents = 'none';
      });
      
      // Hide success message and overlay
      gsap.to(successMessage, {
        duration: animDurations.cardSlide,
        opacity: 0,
        ease: 'power2.in'
      });
      
      gsap.to(formOverlay, {
        duration: animDurations.overlay,
        opacity: 0,
        ease: 'power2.in',
        onComplete: () => {
          formOverlay.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    } else {
      // Form was not submitted - animate all cards out, then hide everything
      const allCards = Array.from(steps);
      const cardsToAnimate = [...allCards];
      
      // Add error message if visible
      if (!errorMessage.classList.contains('hidden')) {
        cardsToAnimate.unshift(errorMessage);
      }
      
      // Animate all cards sliding out to the left
      gsap.to(cardsToAnimate, {
        duration: animDurations.cardSlide,
        x: '-100vw',
        opacity: 0,
        stagger: animDurations.stagger,
        ease: 'power2.in',
        onComplete: () => {
          // Hide everything completely
          formContainer.classList.add('hidden');
          formContainer.style.display = 'none';
          formOverlay.classList.add('hidden');
          
          // Reset form state
          resetForm();
          
          // Re-enable scrolling
          document.body.style.overflow = '';
        }
      });
      
      // Animate overlay fading out
      gsap.to(formOverlay, {
        duration: animDurations.overlay,
        opacity: 0,
        ease: 'power2.in'
      });
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    // Reset current step
    currentStep = 0;
    
    // Reset all steps to their initial state
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.remove('hidden');
        step.style.pointerEvents = 'auto';
      } else {
        step.classList.add('hidden');
      }
      
      // Clear all GSAP transforms
      gsap.set(step, { 
        clearProps: 'all' 
      });
      
      // Reset to initial positioning
      step.style.position = 'absolute';
      step.style.left = '50%';
      step.style.top = '50%';
      step.style.transform = 'translate(-50%, -50%)';
    });
    
    // Reset messages
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
    
    // Reset form fields
    form.reset();
    
    // Reset social media fields
    const socialFields = socialMediaFields.querySelectorAll('.social-media-field');
    for (let i = 1; i < socialFields.length; i++) {
      socialFields[i].remove();
    }
    
    // Hide custom budget container
    if (customBudgetContainer) {
      customBudgetContainer.classList.add('hidden');
    }
    
    // Hide optional question
    if (optionalQuestionContainer) {
      optionalQuestionContainer.classList.add('hidden');
      showQuestionButton.classList.remove('hidden');
      hideQuestionButton.classList.add('hidden');
    }
    
    // Reset development checkbox state
    if (developmentCheckbox) {
      developmentCheckbox.disabled = true;
      developmentCheckbox.checked = false;
      developmentCheckbox.parentNode.classList.remove('border-black');
      developmentCheckbox.parentNode.classList.add('border-gray-300');
    }
    
    // Reset textarea special states
    questionContainers.forEach(container => {
      const questionStatus = container.querySelector('.question-status');
      const textareaContainer = container.querySelector('.textarea-container');
      const editingView = container.querySelector('.editing-view');
      
      if (questionStatus) questionStatus.classList.add('hidden');
      if (textareaContainer) textareaContainer.classList.remove('hidden');
      if (editingView) editingView.classList.add('hidden');
    });
    
    // Reset validation for all steps
    nextButtons.forEach(button => {
      button.disabled = true;
    });
    
    // Validate first step
    validateStep(0);
  };
  
  // ---------------
  // NAVIGATION
  // ---------------
  
  // Go to next step
  const goToNextStep = () => {
    if (currentStep >= steps.length - 1) return;
    
    const currentCard = steps[currentStep];
    const nextCard = steps[currentStep + 1];
    
    // Show next card and position it off-screen to the right
    nextCard.classList.remove('hidden');
    gsap.set(nextCard, { x: '100vw', opacity: 0 });
    
    // Animation timeline
    const tl = gsap.timeline();
    
    // Move current card to its stacked position
    tl.to(currentCard, {
      duration: animDurations.cardStack,
      scale: 0.9,
      rotation: finalPositions[currentStep].rotation,
      x: finalPositions[currentStep].x,
      y: finalPositions[currentStep].y,
      ease: 'power2.inOut',
      onComplete: () => {
        currentCard.style.pointerEvents = 'none';
      }
    });
    
    // Slide next card in from the right
    tl.to(nextCard, {
      duration: animDurations.cardSlide,
      x: 0,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.3');
    
    currentStep++;
    validateStep(currentStep);
  };
  
  // Go to previous step
  const goToPrevStep = () => {
    // Make sure we're not on the first step
    if (currentStep <= 0) return;
    
    const currentCard = steps[currentStep];
    const prevCard = steps[currentStep - 1];
    
    // Animation timeline
    const tl = gsap.timeline();
    
    // Animate current card sliding out to the right
    tl.to(currentCard, {
      duration: animDurations.cardSlide,
      x: '100vw',
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        currentCard.classList.add('hidden');
      }
    });
    
    // Animate previous card back to its original centered position
    tl.to(prevCard, {
      duration: animDurations.cardStack,
      scale: 1,
      rotation: 0,
      x: 0,  // Reset to original position
      y: 0,  // Reset to original position
      ease: 'power2.out',
      onComplete: () => {
        // Re-enable interaction with the previous card
        prevCard.style.pointerEvents = 'auto';
      }
    }, '-=0.3');
    
    // Update current step
    currentStep--;
  };
  
  // ---------------
  // VALIDATION
  // ---------------
  
  // Validate current step
  const validateStep = (stepIndex) => {
    const step = steps[stepIndex];
    const nextButton = step.querySelector('.next-button');
    
    if (!nextButton) return;
    
    // Get all required fields in the current step
    const requiredFields = step.querySelectorAll('[required]');
    
    // Initial validation - disable next button by default
    nextButton.disabled = true;
    
    // Function to check if all required fields are filled
    const checkFields = () => {
      let allFilled = true;
      
      requiredFields.forEach(field => {
        // Check if field is empty based on type
        if (field.type === 'checkbox' || field.type === 'radio') {
          // For checkboxes and radios, we need at least one checked in the group
          const name = field.name;
          const group = step.querySelectorAll(`[name="${name}"]`);
          const checked = Array.from(group).some(input => input.checked);
          
          if (!checked) allFilled = false;
        } else {
          // For text inputs, emails, etc.
          if (!field.value.trim()) allFilled = false;
        }
      });
      
      // Enable/disable next button based on validation
      nextButton.disabled = !allFilled;
    };
    
    // Check fields initially
    checkFields();
    
    // Add event listeners to all required fields
    requiredFields.forEach(field => {
      // Remove existing listeners to avoid duplicates
      field.removeEventListener('input', checkFields);
      field.removeEventListener('change', checkFields);
      
      // Add appropriate listeners based on field type
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.addEventListener('change', checkFields);
      } else {
        field.addEventListener('input', checkFields);
      }
    });
  };
  
  // Setup input validation
  const setupInputValidation = () => {
    // Add validation to all required fields
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      field.addEventListener('input', () => {
        validateStep(currentStep);
      });
      
      field.addEventListener('change', () => {
        validateStep(currentStep);
      });
    });
  };
  
  // ---------------
  // FORM SUBMISSION
  // ---------------
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(form);
    
    // Process service checkboxes into a comma-separated string
    const servicesChecked = Array.from(document.querySelectorAll('input[name="services"]:checked'))
      .map(checkbox => checkbox.value)
      .join(', ');
      
    formData.set('services', servicesChecked);
    
    // Process social media fields
    const socialMediaFields = document.querySelectorAll('.social-media-field');
    const socialMediaProfiles = [];
    
    socialMediaFields.forEach((field, index) => {
      const type = field.querySelector(`select[name="social-media-type-${index}"]`).value;
      const profile = field.querySelector(`input[name="social-media-profile-${index}"]`).value;
      
      if (profile.trim()) {
        socialMediaProfiles.push(`${type}: ${profile}`);
      }
    });
    
    // Set the first social media as Instagram profile for compatibility
    if (socialMediaProfiles.length > 0) {
      formData.set('instagramProfile', socialMediaProfiles.join(', '));
    }
    
    // Convert FormData to JSON
    const formDataJson = {};
    formData.forEach((value, key) => {
      formDataJson[key] = value;
    });
    
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="text-xl">Sending...</span>';
    submitButton.disabled = true;
    
    // Send form data to server
    fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formDataJson)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Show success message
      showSuccessMessage();
    })
    .catch(error => {
      console.error('Error:', error);
      // Show error message
      showErrorMessage();
    })
    .finally(() => {
      // Reset button state
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    });
  };
  
  // Show success message
  const showSuccessMessage = () => {
    // Hide the current step
    steps[currentStep].classList.add('hidden');
    
    // Show success message
    successMessage.classList.remove('hidden');
    
    // Position offscreen initially
    gsap.set(successMessage, {
      y: '20px',
      opacity: 0
    });
    
    // Animate in
    gsap.to(successMessage, {
      duration: 0.5,
      y: 0,
      opacity: 1,
      ease: 'back.out(1.2)'
    });
  };
  
  // Show error message
  const showErrorMessage = () => {
    // Hide the current step
    steps[currentStep].classList.add('hidden');
    
    // Show error message
    errorMessage.classList.remove('hidden');
    
    // Position offscreen initially
    gsap.set(errorMessage, {
      opacity: 0
    });
    
    // Animate in with shake effect
    gsap.to(errorMessage, {
      duration: 0.5,
      opacity: 1,
      ease: 'power2.out',
      onComplete: () => {
        // Add shake animation
        gsap.to(errorMessage, {
          x: [-10, 10, -10, 10, 0],
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  };
  
  // Hide error message
  const hideErrorMessage = () => {
    // Hide error message
    errorMessage.classList.add('hidden');
    
    // Show the last step again
    steps[currentStep].classList.remove('hidden');
  };
  
  // ---------------
  // SPECIAL FEATURES
  // ---------------
  
  // Add social media field
  const addSocialMediaField = () => {
    // Count existing fields
    const socialFields = socialMediaFields.querySelectorAll('.social-media-field');
    
    // Maximum 5 social fields
    if (socialFields.length >= 5) {
      maxSocialFieldsMessage.classList.remove('hidden');
      return;
    }
    
    // Create new field
    const newField = document.createElement('div');
    newField.className = 'social-media-field mt-3';
    
    const index = socialFields.length;
    
    newField.innerHTML = `
      <div class="flex rounded-xl border border-gray-300 overflow-hidden">
        <div class="bg-gray-100 flex items-center px-4 py-3 border-r border-gray-300">
          <select name="social-media-type-${index}" class="bg-gray-100 border-none focus:ring-0 social-media-type">
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="website">Website</option>
          </select>
        </div>
        <input 
          type="text" 
          name="social-media-profile-${index}"
          class="flex-grow px-4 py-3 bg-white social-media-profile" 
          placeholder="e.g. @username"
        >
      </div>
    `;
    
    // Add to container
    socialMediaFields.appendChild(newField);
    
    // Add event listener for type change
    const select = newField.querySelector('select');
    const input = newField.querySelector('input');
    
    select.addEventListener('change', () => {
      updatePlaceholder(select, input);
    });
    
    // Revalidate
    validateStep(currentStep);
  };
  
  // Update placeholder based on social media type
  const updatePlaceholder = (select, input) => {
    const type = select.value;
    
    if (type === 'website') {
      input.placeholder = 'e.g. yourcompany.com';
    } else {
      input.placeholder = 'e.g. @username';
    }
  };
  
  // Setup social media type change handlers
  const setupSocialMediaTypeHandlers = () => {
    // Get all initial social media selects
    document.querySelectorAll('.social-media-type').forEach(select => {
      const input = select.closest('.social-media-field').querySelector('input');
      
      select.addEventListener('change', () => {
        updatePlaceholder(select, input);
      });
    });
  };
  
  // Toggle custom budget field
  const toggleCustomBudget = () => {
    if (budgetCustomRadio.checked) {
      customBudgetContainer.classList.remove('hidden');
    } else {
      customBudgetContainer.classList.add('hidden');
    }
  };
  
  // Update development checkbox based on web design selection
  const updateDevelopmentCheckbox = () => {
    if (webDesignCheckbox.checked) {
      // Enable development checkbox
      developmentCheckbox.disabled = false;
      developmentCheckbox.parentNode.classList.remove('border-gray-300');
      developmentCheckbox.parentNode.classList.add('border-black');
    } else {
      // Disable development checkbox
      developmentCheckbox.disabled = true;
      developmentCheckbox.checked = false;
      developmentCheckbox.parentNode.classList.remove('border-black');
      developmentCheckbox.parentNode.classList.add('border-gray-300');
    }
  };
  
  // Show optional question
  const showOptionalQuestion = () => {
    optionalQuestionContainer.classList.remove('hidden');
    showQuestionButton.classList.add('hidden');
    hideQuestionButton.classList.remove('hidden');
  };
  
  // Hide optional question
  const hideOptionalQuestion = () => {
    optionalQuestionContainer.classList.add('hidden');
    showQuestionButton.classList.remove('hidden');
    hideQuestionButton.classList.add('hidden');
  };

  function setupInputVisualStates() {
    // For checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const icon = this.parentNode.querySelector('.checkbox-icon');
        if (this.checked) {
          icon.classList.remove('hidden');
        } else {
          icon.classList.add('hidden');
        }
      });
    });
    
    // For radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', function() {
        const name = this.getAttribute('name');
        const group = document.querySelectorAll(`input[name="${name}"]`);
        
        // Hide all dots in the group
        group.forEach(item => {
          const dot = item.parentNode.querySelector('.radio-selected');
          if (dot) dot.classList.add('hidden');
        });
        
        // Show the selected dot
        if (this.checked) {
          const dot = this.parentNode.querySelector('.radio-selected');
          if (dot) dot.classList.remove('hidden');
        }
      });
    });
  };
  
  // ---------------
  // MOBILE SPECIAL STATES
  // ---------------
  
  // Setup textarea handlers for mobile special state
  const setupTextareaHandlers = () => {
    questionContainers.forEach(container => {
      const textarea = container.querySelector('textarea');
      const editingTextarea = container.querySelector('.editing-view textarea');
      const markAsDoneButton = container.querySelector('.mark-as-done');
      const textareaContainer = container.querySelector('.textarea-container');
      const editingView = container.querySelector('.editing-view');
      const questionStatus = container.querySelector('.question-status');
      
      if (!textarea || !editingTextarea || !markAsDoneButton) return;
      
      // Copy textarea attributes to editing textarea
      editingTextarea.placeholder = textarea.placeholder;
      
      // Handler for focusing on textarea on mobile
      textarea.addEventListener('focus', () => {
        if (isMobile()) {
          // Copy current text to editing textarea
          editingTextarea.value = textarea.value;
          
          // Show editing view
          textareaContainer.classList.add('hidden');
          editingView.classList.remove('hidden');
          
          // Animate overlay appearance
          gsap.fromTo(editingView, 
            { y: '20px', opacity: 0 },
            { y: 0, opacity: 0.5, duration: 0.3, ease: 'power2.out' }
          );
          
          // Focus the editing textarea
          setTimeout(() => {
            editingTextarea.focus();
          }, 100);
        } else {
          // If not mobile, just handle normal scroll
          handleInputScroll(textarea);
        }
      });
      
      // Handler for marking as done
      markAsDoneButton.addEventListener('click', () => {
        // Copy text back to original textarea
        textarea.value = editingTextarea.value;
        
        // Hide editing view
        textareaContainer.classList.remove('hidden');
        editingView.classList.add('hidden');
        
        // Show question answered status if there's text
        if (textarea.value.trim() !== '') {
          questionStatus.classList.remove('hidden');
        } else {
          questionStatus.classList.add('hidden');
        }
        
        // Revalidate the step
        validateStep(currentStep);
      });
      
      // Sync text between textareas
      editingTextarea.addEventListener('input', () => {
        textarea.value = editingTextarea.value;
        validateStep(currentStep);
      });
      
      // For non-mobile special handling
      if (!isMobile()) {
        textarea.addEventListener('blur', () => {
          // Show question answered status if there's text
          if (textarea.value.trim() !== '') {
            questionStatus.classList.remove('hidden');
          } else {
            questionStatus.classList.add('hidden');
          }
        });
      }
    });
    
    // Handle scroll for regular inputs
    document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
      input.addEventListener('focus', () => {
        handleInputScroll(input);
      });
    });
  };
  
  // Handle scrolling when input is focused (for non-mobile special state)
  const handleInputScroll = (input) => {
    if (!isMobile()) return;
    
    const inputRect = input.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // If input is in lower half of screen, scroll up a bit
    if (inputRect.top > windowHeight / 2) {
      const scrollStep = inputRect.top - (windowHeight / 4);
      const currentStep = steps[currentStep];
      
      gsap.to(currentStep, {
        duration: 0.3,
        y: -scrollStep,
        ease: 'power2.out'
      });
      
      // Scroll back when done typing
      input.addEventListener('blur', () => {
        gsap.to(currentStep, {
          duration: 0.3,
          y: 0,
          ease: 'power2.out'
        });
      }, { once: true });
    }
  };
  
  // Initialize the form
  initForm();
});