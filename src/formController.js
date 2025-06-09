// formController.js - Main control script for the form functionality
// This handles all form interactions, animations, and validation

document.addEventListener('DOMContentLoaded', () => {
  const supabase = window.supabase.createClient(
    'https://guyjtfegraqcthngbhvf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1eWp0ZmVncmFxY3RobmdiaHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDUyNzIsImV4cCI6MjA2NDAyMTI3Mn0.i-yK2m0JRx_KI-h6LINIjH4UwQav6A2iJdsNOxrVevs'
  );

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

  // Enhanced validation helper functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (name) => {
    return name.trim().length >= 2;
  };

  // Visual feedback helper functions
  const showFieldValidation = (fieldId, isValid, message = '') => {
    const field = document.getElementById(fieldId);
    const successIcon = document.getElementById(`${fieldId}-success-icon`);
    const errorIcon = document.getElementById(`${fieldId}-error-icon`);
    const messageEl = document.getElementById(`${fieldId}-validation-message`);
    
    if (!field) return;
    
    // Remove all validation classes
    field.classList.remove('valid', 'invalid');
    
    if (field.value.trim() === '') {
      // Empty field - neutral state
      hideAllIcons(fieldId);
      hideMessage(fieldId);
      return;
    }
    
    if (isValid) {
      // Valid state
      field.classList.add('valid');
      showIcon(successIcon);
      hideIcon(errorIcon);
      if (message) {
        showMessage(fieldId, message, 'success');
      } else {
        hideMessage(fieldId);
      }
    } else {
      // Invalid state
      field.classList.add('invalid');
      showIcon(errorIcon);
      hideIcon(successIcon);
      showMessage(fieldId, message, 'error');
    }
  };

  const showIcon = (icon) => {
    if (icon) {
      icon.classList.remove('hidden');
      icon.classList.add('visible');
    }
  };

  const hideIcon = (icon) => {
    if (icon) {
      icon.classList.remove('visible');
      icon.classList.add('hidden');
    }
  };

  const hideAllIcons = (fieldId) => {
    const successIcon = document.getElementById(`${fieldId}-success-icon`);
    const errorIcon = document.getElementById(`${fieldId}-error-icon`);
    hideIcon(successIcon);
    hideIcon(errorIcon);
  };

  const showMessage = (fieldId, message, type) => {
    const messageEl = document.getElementById(`${fieldId}-validation-message`);
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.classList.remove('hidden', 'error', 'success');
      messageEl.classList.add('visible', type);
    }
  };

  const hideMessage = (fieldId) => {
    const messageEl = document.getElementById(`${fieldId}-validation-message`);
    if (messageEl) {
      messageEl.classList.remove('visible', 'error', 'success');
      messageEl.classList.add('hidden');
    }
  };

  // Enhanced field validation
  const validateField = (field) => {
    const fieldId = field.id;
    const value = field.value.trim();
    
    switch (field.type) {
      case 'email':
        if (value === '') {
          showFieldValidation(fieldId, true); // Neutral for empty
          return false; // But still invalid for form submission
        } else if (isValidEmail(value)) {
          showFieldValidation(fieldId, true, 'Valid email address');
          return true;
        } else {
          showFieldValidation(fieldId, false, 'Please enter a valid email address');
          return false;
        }
        
      case 'text':
        if (fieldId === 'fullName') {
          if (value === '') {
            showFieldValidation(fieldId, true); // Neutral for empty
            return false;
          } else if (isValidName(value)) {
            showFieldValidation(fieldId, true);
            return true;
          } else {
            showFieldValidation(fieldId, false, 'Name must be at least 2 characters long');
            return false;
          }
        }
        // For other text fields, just check if not empty
        return value !== '';
        
      default:
        return value !== '';
    }
  };
  
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

  // Form state protection
  let formIsOpen = false;
  let isNavigating = false;

  // Viewport change protection
  let preventViewportResize = false;
  let keyboardOpen = false;

  const activeCardScale = 1;

  // Force correct step visibility
  const enforceStepVisibility = () => {
    if (!formIsOpen) return;
    
    steps.forEach((step, index) => {
      if (index === currentStep) {
        // Current step should be visible
        if (step.classList.contains('hidden')) {
          step.classList.remove('hidden');
          step.style.display = 'block';
        }
      } else if (index < currentStep) {
        // Previous steps should be visible but in background (for back navigation)
        step.classList.remove('hidden');
        step.style.display = 'block';
        step.style.pointerEvents = 'none'; // But not interactive
      } else {
        // Future steps should be hidden
        if (!step.classList.contains('hidden')) {
          step.classList.add('hidden');
        }
      }
    });
  };
  
  // Define final positions for the staggered card stack pattern
  const finalPositions = [
    { x: '-30px', y: '-150px', rotation: -3, scale: 0.5 },
    { x: '25px', y: '-140px', rotation: 2, scale: 0.5 },
    { x: '-40px', y: '-300px', rotation: -1, scale: 0.5 },
    { x: '30px', y: '0px', rotation: 3, scale: 0.5 },
    { x: '0px', y: '100px', rotation: -2, scale: 0.5 },
    { x: '0px', y: '0px', rotation: 0, scale: 0.7 }, // For success message
    { x: '0px', y: '0px', rotation: 0, scale: 0.7 } // For error message
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

  // Protect against scroll interference
  const handleScrollProtection = () => {
    if (formIsOpen && !isNavigating) {
      enforceStepVisibility();
    }
  };

  // Debounced scroll handler
  let scrollTimeout;
  const debouncedScrollHandler = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScrollProtection, 50);
  };
  
  // ---------------
  // CORE FORM CONTROL
  // ---------------
  
  // Helper function to show only the current step
  const showStep = (stepIndex) => {
    console.log(`showStep called for step ${stepIndex}`);
    steps.forEach((step, index) => {
      if (index === stepIndex) {
        step.classList.remove('hidden');
        console.log(`Step ${index} shown`);
      } else {
        step.classList.add('hidden');
        console.log(`Step ${index} hidden`);
      }
    });
  };
  
  // Initialize the form
  const initForm = () => {
    console.log('initForm called');

    // Check if form was previously submitted
    checkPreviousSubmission();

    // Reset current step to 0
    currentStep = 0;
    
    // Show only the first step
    showStep(currentStep);

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
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize validation for the first step
    validateStep(0);

    setupInputVisualStates();

    let setupCardsTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(setupCardsTimeout);
      setupCardsTimeout = setTimeout(() => {
        if (!preventViewportResize && !formIsOpen) {
          setupResponsiveCards();
        }
      }, 150);
    });

    setupKeyboardDetection();

    // Small delay to prevent race condition
    setTimeout(() => {
      setupResponsiveCards();
    }, 100);

    // Initial protection setup
    if (isMobile()) {
      // Additional mobile protection
      document.addEventListener('visibilitychange', () => {
        if (formIsOpen) {
          setTimeout(enforceStepVisibility, 100);
        }
      });
    };

    // Test mode detection
    if (window.location.hash === '#test-success') {
      // Delay to ensure everything is loaded
      setTimeout(() => {
        openForm();
        setTimeout(() => {
          testSuccessState();
        }, 500);
      }, 300);
    }
  };
  
  // Setup all event listeners
  const setupEventListeners = () => {
    // Open form buttons (multiple instances)
    const formOpenButtons = document.querySelectorAll('.form-open-btn');
    formOpenButtons.forEach(button => {
      button.addEventListener('click', () => {
        openForm();
        // Scroll to form-entry section after a short delay
        setTimeout(() => {
          scrollToFormEntry();
        }, 100);
      });
    });

    // Scroll to form-entry section
    const scrollToFormEntry = () => {
      const formEntrySection = document.getElementById('form-entry');
      if (formEntrySection) {
        formEntrySection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    };
    
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
      button.addEventListener('click', (e) => {
        // Check if this is the existing email message prev button
        const isExistingEmailPrev = button.closest('#existing-email-message');
        
        if (isExistingEmailPrev) {
          goBackFromExistingEmail();
        } else {
          goToPrevStep();
        }
      });
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

    const setupInitialSocialMediaButtons = () => {
      // Setup delete buttons on any existing social media fields
      const initialSocialFields = socialMediaFields.querySelectorAll('.social-media-field');
      
      initialSocialFields.forEach((field, index) => {
        const deleteBtn = field.querySelector('.delete-social-field');
        
        // Skip the first field if we want to keep at least one field
        if (index === 0 && initialSocialFields.length === 1) {
          if (deleteBtn) deleteBtn.style.display = 'none';
          return;
        }
        
        if (deleteBtn) {
          // Make sure the button is visible
          deleteBtn.style.display = 'flex';
          deleteBtn.style.visibility = 'visible';
          
          // Add or re-add the event listener
          deleteBtn.addEventListener('click', (e) => {
            console.log('Delete button clicked for initial field:', index);
            e.stopPropagation();
            
            field.remove();
            updateSocialMediaIndexes();
            hideMaxFieldsMessage();
            validateStep(currentStep);
          });
        }
      });
    };
  
    setupInitialSocialMediaButtons();

    // Special textarea handlers
    setupTextareaHandlers();
    
    // Social media type change
    setupSocialMediaTypeHandlers();
    
    // Input fields validation
    setupInputValidation();

    document.querySelectorAll('input[type="text"], input[type="email"], textarea, select').forEach(input => {
      // Remove any existing listeners first
      input.removeEventListener('focus', handleInputScroll);
      
      // Add the listener once
      input.addEventListener('focus', () => {
        setTimeout(() => handleInputScroll(input), 0);
      });
    });
  };
  
  // ---------------
  // FORM OPEN/CLOSE
  // ---------------
  
  // Open the form with animation
  const openForm = () => {
    const debugStep1Position = () => {
      const step1 = document.getElementById('step-1');
      console.log('🔍 DEBUGGING STEP-1 POSITION:');
      console.log('📏 Element rect:', step1.getBoundingClientRect());
      console.log('🎨 Computed styles:', window.getComputedStyle(step1).transform);
      console.log('📐 Inline styles:', step1.style.transform);
      console.log('📦 Offset details:', {
        offsetTop: step1.offsetTop,
        offsetLeft: step1.offsetLeft,
        offsetParent: step1.offsetParent?.tagName
      });
      console.log('🏠 Parent container:', step1.parentElement.getBoundingClientRect());
    };

    // Check what's actually applied
    const step1 = document.getElementById('step-1');
    console.log('CSS transform:', step1.style.transform);
    console.log('GSAP _gsap object:', step1._gsap);

    const originalGsapSet = gsap.set;
    gsap.set = function(target, vars) {
      if (target === '#step-1' || (target && target.id === 'step-1')) {
        console.log('🎯 GSAP.set called on step-1:', vars);
        console.trace(); // This shows you exactly where it's called from
      }
      return originalGsapSet.apply(this, arguments);
    };

    // Set state immediately
    formIsOpen = true;
    preventViewportResize = true; // Prevent resize interference
    
    // Reset form state completely
    resetForm();
    
    // First, ensure form container is properly reset and visible
    formContainer.classList.remove('hidden');
    formContainer.style.display = 'flex';
    formContainer.style.visibility = 'visible';
    formContainer.style.opacity = '1';
    
    // Show overlay
    formOverlay.classList.remove('hidden');
    
    // Set up the form container
    formContainer.style.position = 'fixed';
    formContainer.style.top = '0';
    formContainer.style.left = '0';
    formContainer.style.width = '100vw';
    formContainer.style.height = '100vh';
    formContainer.style.justifyContent = 'center';
    formContainer.style.alignItems = 'center';
    formContainer.style.zIndex = '50';
    formContainer.style.padding = '0';
    formContainer.style.overflow = 'visible';
    
    // Make sure the form takes the full space
    form.style.position = 'relative';
    form.style.width = '100%';
    form.style.height = '100%';
    form.style.display = 'flex';
    form.style.justifyContent = 'center';
    form.style.alignItems = 'center';
    form.style.padding = '0';
    form.style.overflow = 'visible';
    
    // Disable background scrolling
    document.body.style.overflow = 'hidden';
    
    // Force first step visibility
    steps.forEach((step, index) => {
      if (index === 0) {
        step.classList.remove('hidden');
        step.style.display = 'block';
      } else {
        step.classList.add('hidden');
      }
    });
    
    // Add scroll protection
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    document.addEventListener('touchmove', debouncedScrollHandler, { passive: true });
    
    // Animate overlay fading in
    gsap.to(formOverlay, {
      duration: animDurations.overlay,
      opacity: 0.5,
      ease: 'power2.out'
    });
    
    // Get the first step and animate it in
    const firstStep = steps[0];
    
    // Clear any existing transforms
    gsap.set(firstStep, { clearProps: 'all' });
    
    // Reset first step positioning
    firstStep.style.position = 'absolute';
    firstStep.style.left = '50%';
    firstStep.style.top = '50%';
    firstStep.style.transform = 'translate(-50%, -50%)';
    
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
    
    // Reset resize prevention after animation
    setTimeout(() => {
      preventViewportResize = false;
    }, 1000);
    
    // Validate the first step
    validateStep(0);
  };
  
  // Close the form with animation
  const closeForm = () => {
    // Set state immediately
    formIsOpen = false;
    preventViewportResize = false; // Re-enable resize handling
    keyboardOpen = false; // Reset keyboard state
    
    // Remove scroll protection
    window.removeEventListener('scroll', debouncedScrollHandler);
    document.removeEventListener('touchmove', debouncedScrollHandler);

    const wasSuccessful = !successMessage.classList.contains('hidden');
    
    if (wasSuccessful) {
      // Form was submitted successfully
      const finalPos = finalPositions[Math.min(steps.length, finalPositions.length - 1)];
      
      // First, animate all other cards sliding out to the left
      const allOtherCards = Array.from(steps).filter(step => step !== successMessage);
      
      if (allOtherCards.length > 0) {
        gsap.to(allOtherCards, {
          duration: animDurations.cardSlide,
          x: '-100vw',
          opacity: 0,
          stagger: animDurations.stagger,
          ease: 'power2.in',
          onComplete: () => {
            // After other cards are out, handle the success card
            handleSuccessCardTransition();
          }
        });
      } else {
        // If no other cards, go straight to success handling
        handleSuccessCardTransition();
      }
      
      function handleSuccessCardTransition() {
        // Make sure overlay fades out
        gsap.to(formOverlay, {
          duration: animDurations.overlay,
          opacity: 0,
          ease: 'power2.in',
          onComplete: () => {
            formOverlay.classList.add('hidden');
            document.body.style.overflow = '';
          }
        });
        
        // Get the form entry section
        const formEntrySection = document.getElementById('form-entry');
        
        // Animate success message to final stacked position first
        gsap.to(successMessage, {
          duration: animDurations.cardStack,
          scale: finalPos.scale,
          rotation: finalPos.rotation,
          x: finalPos.x,
          y: finalPos.y,
          ease: 'power2.inOut',
          onComplete: () => {
            // After animation completes, move to form-entry section
            successMessage.style.position = 'absolute';
            successMessage.style.left = '50%';
            successMessage.style.top = '50%';
            successMessage.style.zIndex = '45';
            successMessage.style.pointerEvents = 'none';
            
            // Apply the final position offset
            const offsetX = parseFloat(finalPos.x) || 0;
            const offsetY = parseFloat(finalPos.y) || 0;
            successMessage.style.left = `calc(50% + ${offsetX}px)`;
            successMessage.style.top = `calc(50% + ${offsetY}px)`;
            successMessage.style.transform = `translate(-50%, -50%) scale(${finalPos.scale}) rotate(${finalPos.rotation}deg)`;
            
            // Move the success message from form-container to form-entry section
            formEntrySection.appendChild(successMessage);
            
            // Hide the form container
            setTimeout(() => {
              formContainer.classList.add('hidden');
              formContainer.style.display = 'none';
            }, 100);
          }
        });
      }
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
    
    // Reset all steps to their initial state - ENSURE ONLY FIRST STEP IS VISIBLE
    showStep(currentStep);
    
    steps.forEach((step, index) => {
      step.style.pointerEvents = 'auto';
      
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
    // Hide max fields message on reset
    maxSocialFieldsMessage.classList.add('hidden');
    
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
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch('/.netlify/functions/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() })
      });
      
      if (!response.ok) {
        console.error('Email check failed:', response.status);
        return false; // Allow submission on error
      }
      
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Email check error:', error);
      return false; // Allow submission on error
    }
  };

  // Go to next step
  const goToNextStep = async () => {
    if (currentStep >= steps.length - 1 || isNavigating) return;
    
    // Special handling for step 0 - check email before proceeding
    if (currentStep === 0) {
      const emailInput = document.getElementById('email');
      const email = emailInput.value.trim();
      
      if (email) {
        // Show loading state
        const nextButton = steps[currentStep].querySelector('.next-button');
        const originalText = nextButton.innerHTML;
        nextButton.innerHTML = '<span class="text-[#fffdff] text-xl font-bold font-sans leading-5">Checking...</span>';
        nextButton.disabled = true;
        
        const emailExists = await checkEmailExists(email);
        
        if (emailExists) {
          // Show existing email message instead of progressing
          showExistingEmailMessage();
          return;
        }
        
        // Reset button state
        nextButton.innerHTML = originalText;
        nextButton.disabled = false;
      }
    }
    
    // Continue with existing logic...
    isNavigating = true;
    
    const currentCard = steps[currentStep];
    const nextCard = steps[currentStep + 1];
    
    // Show next card and position it off-screen to the right
    nextCard.classList.remove('hidden');
    nextCard.style.display = 'block';

    // Ensure next card starts from proper center position
    gsap.set(nextCard, { 
      x: '100vw', 
      y: 0,  // Start at center Y
      opacity: 0,
      scale: 1,
      rotation: 0
    });
    
    // Make sure the next card is properly positioned
    nextCard.style.position = 'absolute';
    nextCard.style.left = '50%';
    nextCard.style.top = '50%';
    // nextCard.style.transform = 'translate(-50%, -50%)'; // 

    gsap.set(nextCard, { 
      x: '100vw', 
      y: 0,
      xPercent: -50,  // Use GSAP's xPercent instead
      yPercent: -50,  // Use GSAP's yPercent instead
      opacity: 0 
    });

    console.log('🔧 After GSAP set:', nextCard.style.transform);
    console.log('📐 Computed transform:', window.getComputedStyle(nextCard).transform);
    
    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isNavigating = false;
        // Final protection check
        setTimeout(enforceStepVisibility, 100);
      }
    });
    
    // Move current card to its stacked position
    tl.to(currentCard, {
      duration: animDurations.cardStack,
      scale: finalPositions[currentStep].scale,
      rotation: finalPositions[currentStep].rotation,
      x: finalPositions[currentStep].x,
      y: finalPositions[currentStep].y,
      ease: 'power2.inOut',
      onComplete: () => {
        // DON'T hide the card - just disable interaction
        currentCard.style.pointerEvents = 'none';
        // Make sure it stays visible
        currentCard.classList.remove('hidden');
        currentCard.style.display = 'block';
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
    console.log(`goToPrevStep called. Current step: ${currentStep}`);
    
    // Make sure we're not on the first step
    if (currentStep <= 0) {
      console.log('Already at first step, cannot go to previous');
      return;
    }
    
    isNavigating = true;
    
    const currentCard = steps[currentStep];
    const prevCard = steps[currentStep - 1];
    
    console.log(`Moving from step ${currentStep} to step ${currentStep - 1}`);
    
    // Make sure previous card is visible before animating
    prevCard.classList.remove('hidden');
    prevCard.style.display = 'block';
    
    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        isNavigating = false;
      }
    });
    
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
      scale: activeCardScale,
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
    console.log(`Step updated to: ${currentStep}`);
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
      let allValid = true;
      
      requiredFields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
          // For checkboxes and radios, we need at least one checked in the group
          const name = field.name;
          const group = step.querySelectorAll(`[name="${name}"]`);
          const checked = Array.from(group).some(input => input.checked);
          if (!checked) allValid = false;
        } else {
          // Use enhanced validation for text and email fields
          if (!validateField(field)) {
            allValid = false;
          }
        }
      });
      
      // Enable/disable next button based on validation
      nextButton.disabled = !allValid;
    };
    
    // Check fields initially
    checkFields();
    
    // Add event listeners with debouncing for better UX
    requiredFields.forEach(field => {
      let timeoutId;
      
      const debouncedValidation = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkFields, 300); // 300ms delay
      };
      
      const immediateValidation = () => {
        clearTimeout(timeoutId);
        checkFields();
      };
      
      // Remove existing listeners
      field.removeEventListener('input', debouncedValidation);
      field.removeEventListener('blur', immediateValidation);
      field.removeEventListener('change', immediateValidation);
      
      // Add appropriate listeners based on field type
      if (field.type === 'checkbox' || field.type === 'radio') {
        field.addEventListener('change', immediateValidation);
      } else {
        // For text/email: debounced on input, immediate on blur
        field.addEventListener('input', debouncedValidation);
        field.addEventListener('blur', immediateValidation);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final email validation check before submission
    const emailField = document.getElementById('email');
    const email = emailField?.value?.trim();
    
    if (email) {
      try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          // Show error and stop submission
          const errorMessageElement = document.querySelector('#error-message .text-red-700 p');
          if (errorMessageElement) {
            errorMessageElement.textContent = 'This email has already been used for an inquiry. Please use a different email address.';
          }
          showErrorMessage();
          return; // Stop submission
        }
      } catch (error) {
        console.warn('Email validation failed, proceeding with submission:', error);
        // Continue with submission even if email check fails
      }
    }
    
    // Collect form data
    const formData = new FormData(form);
    
    // Process service checkboxes into an array
    const servicesChecked = Array.from(document.querySelectorAll('input[name="services"]:checked'))
      .map(checkbox => checkbox.value);
    
    // Process social media fields
    const socialMediaFields = document.querySelectorAll('.social-media-field');
    const socialMediaData = {};
    
    socialMediaFields.forEach((field, index) => {
      const type = field.querySelector(`select[name="social-media-type-${index}"]`)?.value;
      const profile = field.querySelector(`input[name="social-media-profile-${index}"]`)?.value;
      
      if (type && profile && profile.trim()) {
        socialMediaData[`social-media-type-${index}`] = type;
        socialMediaData[`social-media-profile-${index}`] = profile.trim();
      }
    });
    
    // Convert FormData to JSON and add processed data
    const formDataJson = {};
    formData.forEach((value, key) => {
      formDataJson[key] = value;
    });
    
    // Add processed data
    formDataJson.services = servicesChecked;
    Object.assign(formDataJson, socialMediaData);
    
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="text-xl">Sending...</span>';
    submitButton.disabled = true;
    
    try {
      // Send form data to server
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJson)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      
      // Check if this was a duplicate submission
      if (responseData.duplicate) {
        console.log('Duplicate submission detected by backend');
        // Still show success to user for good UX
        showSuccessMessage();
      } else {
        // Normal successful submission
        console.log('Form submitted successfully:', responseData);
        showSuccessMessage();
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      
      // Enhanced error handling
      let errorMessageText = 'An error occurred processing your request. ';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessageText += 'Please check your internet connection and try again.';
      } else if (error.message.includes('429')) {
        errorMessageText += 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('500')) {
        errorMessageText += 'Server error. Please try again in a few minutes or contact me directly at sergiu@bustiuc.digital';
      } else if (error.message.includes('400')) {
        errorMessageText += 'Invalid form data. Please check your inputs and try again.';
      } else if (error.message.includes('409')) {
        errorMessageText = 'This email has already been used for an inquiry. Please use a different email address.';
      } else {
        errorMessageText += 'Please try again later or contact me directly at sergiu@bustiuc.digital';
      }
      
      // Update error message content
      const errorMessageElement = document.querySelector('#error-message .text-red-700 p');
      if (errorMessageElement) {
        errorMessageElement.textContent = errorMessageText;
      }
      
      // Show error message
      showErrorMessage();
    } finally {
      // Reset button state
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    }
  };
  
  // Show success message
  const showSuccessMessage = () => {
    // Stack the current card
    const currentCard = steps[currentStep];
    
    gsap.to(currentCard, {
      duration: animDurations.cardStack,
      scale: finalPositions[currentStep].scale,
      rotation: finalPositions[currentStep].rotation,
      x: finalPositions[currentStep].x,
      y: finalPositions[currentStep].y,
      ease: 'power2.inOut',
      onComplete: () => {
        currentCard.style.pointerEvents = 'none';
      }
    });
    
    // Show success message
    successMessage.classList.remove('hidden');
    
    // Position for animation
    gsap.set(successMessage, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      y: '20px',
      opacity: 0,
      scale: 1, // Start at normal scale
      rotation: 0 // Start with no rotation
    });
    
    // Animate in
    gsap.to(successMessage, {
      duration: 0.5,
      y: 0,
      opacity: 1,
      ease: 'back.out(1.2)'
    });
  };

  // Disable form entry after successful submission
  const disableFormEntry = () => {
    const formOpenButtons = document.querySelectorAll('.form-open-btn');
    const formEntrySection = document.getElementById('form-entry');
    
    // Store submission state
    localStorage.setItem('formSubmitted', 'true');
    localStorage.setItem('submissionTime', new Date().toISOString());
    
    // Update all form open buttons
    formOpenButtons.forEach(button => {
      button.innerHTML = 'Form Submitted ✓';
      button.disabled = true;
      button.style.cursor = 'not-allowed';
      button.style.opacity = '0.6';
      button.removeEventListener('click', openForm);
    });
    
    // Update description text
    const descriptionText = formEntrySection.querySelector('p');
    if (descriptionText) {
      descriptionText.textContent = 'Thank you! Your inquiry has been submitted successfully.';
    }
  };

  // Check if form was already submitted (on page load)
  const checkPreviousSubmission = () => {
    const wasSubmitted = localStorage.getItem('formSubmitted');
    
    if (wasSubmitted === 'true') {
      disableFormEntry();
    }
  };
  
  // Show error message
  const showErrorMessage = () => {
    // Don't hide the current step, just add it to the stack
    const currentCard = steps[currentStep];
    
    // Stack the current card
    gsap.to(currentCard, {
      duration: animDurations.cardStack,
      scale: finalPositions[currentStep].scale,
      rotation: finalPositions[currentStep].rotation,
      x: finalPositions[currentStep].x,
      y: finalPositions[currentStep].y,
      ease: 'power2.inOut',
      onComplete: () => {
        currentCard.style.pointerEvents = 'none';
      }
    });
    
    // Show error message
    errorMessage.classList.remove('hidden');
    
    // Ensure the error message is positioned correctly - centered
    errorMessage.style.position = 'absolute';
    errorMessage.style.left = '50%';
    errorMessage.style.top = '50%';
    errorMessage.style.transform = 'translate(-50%, -50%)';
    
    // Clear any inline transform that might be interfering
    errorMessage.style.translate = 'none';
    
    // Set initial opacity
    gsap.set(errorMessage, {
      opacity: 0,
      x: 0  // Make sure there's no x offset
    });
    
    // Animate in with shake effect
    gsap.to(errorMessage, {
      duration: animDurations.cardSlide,
      x: 0,
      opacity: 1,
      ease: 'power2.out'
    });
  };
  
  // Hide error message
  const hideErrorMessage = () => {
    // Hide error message
    errorMessage.classList.add('hidden');
    
    // Restore the current step to center
    const currentCard = steps[currentStep];
    
    gsap.to(currentCard, {
      duration: animDurations.cardStack,
      scale: activeCardScale,
      rotation: 0,
      x: 0,
      y: 0,
      ease: 'power2.out',
      onComplete: () => {
        currentCard.style.pointerEvents = 'auto';
      }
    });
  };

  // Show existing email message
  const showExistingEmailMessage = () => {
    const currentCard = steps[currentStep];
    const existingEmailMessage = document.getElementById('existing-email-message');
    
    // Stack the current card
    gsap.to(currentCard, {
      duration: animDurations.cardStack,
      scale: finalPositions[currentStep].scale,
      rotation: finalPositions[currentStep].rotation,
      x: finalPositions[currentStep].x,
      y: finalPositions[currentStep].y,
      ease: 'power2.inOut',
      onComplete: () => {
        currentCard.style.pointerEvents = 'none';
      }
    });
    
    // Show existing email message
    existingEmailMessage.classList.remove('hidden');
    
    // Position for animation
    gsap.set(existingEmailMessage, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      y: '20px',
      opacity: 0,
      scale: 1,
      rotation: 0
    });
    
    // Animate in
    gsap.to(existingEmailMessage, {
      duration: 0.5,
      y: 0,
      opacity: 1,
      ease: 'back.out(1.2)'
    });
  };

  // Handle going back from existing email message
  const goBackFromExistingEmail = () => {
    const existingEmailMessage = document.getElementById('existing-email-message');
    const firstStep = steps[0]; // Go back to the first step
    
    // Animate existing email message out
    gsap.to(existingEmailMessage, {
      duration: animDurations.cardSlide,
      x: '100vw',
      opacity: 0,
      ease: 'power2.in',
      onComplete: () => {
        existingEmailMessage.classList.add('hidden');
      }
    });
    
    // Restore the first step to its original centered position
    gsap.to(firstStep, {
      duration: animDurations.cardStack,
      scale: activeCardScale,
      rotation: 0,
      x: 0,
      y: 0,
      ease: 'power2.out',
      onComplete: () => {
        // Re-enable interaction with the first step
        firstStep.style.pointerEvents = 'auto';
      }
    }, '-=0.3');
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
    
    // Updated HTML with better flex control for the input field
    newField.innerHTML = `
      <div class="flex rounded-xl border border-[#4c4f50] bg-[#333435] overflow-hidden">
        <div class="self-stretch bg-[#4c4f50] rounded-lg outline-2 outline-offset-[-2px] outline-[#4c4f50] inline-flex justify-start items-center px-2">
          <select name="social-media-type-${index}" class="border-none focus:ring-0 bg-[#4c4f50] text-[#fffdff] social-media-type">
            <option value="instagram" class="text-[#fffdff] bg-[#4c4f50]">Instagram</option>
            <option value="facebook" class="text-[#fffdff] bg-[#4c4f50]">Facebook</option>
            <option value="twitter" class="text-[#fffdff] bg-[#4c4f50]">Twitter</option>
            <option value="linkedin" class="text-[#fffdff] bg-[#4c4f50]">LinkedIn</option>
            <option value="website" class="text-[#fffdff] bg-[#4c4f50]">Website</option>
          </select>
        </div>
        <input 
          type="text" 
          name="social-media-profile-${index}"
          class="form-input flex-grow min-w-0 px-4 py-3 social-media-profile rounded-l-none shadow-none! placeholder:text-[#b2b5b6] placeholder:text-base placeholder:font-medium placeholder:font-sans text-[#CCCDCE]" 
          placeholder="e.g. @username"
        >
        <button 
          type="button" 
          class="delete-social-field bg-[#333435] hover:bg-[#4c4f50] px-3 py-3 text-red-600 hover:text-red-700 transition-colors flex-shrink-0 rounded-r-xl"
          title="Remove this social media field"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;
    
    // Add to container
    socialMediaFields.appendChild(newField);
    
    // Add event listener for type change
    const select = newField.querySelector('select');
    const input = newField.querySelector('input');
    const deleteBtn = newField.querySelector('.delete-social-field');
    
    select.addEventListener('change', () => {
      updatePlaceholder(select, input);
    });
    
    // Add delete functionality
    deleteBtn.addEventListener('click', () => {
      newField.remove();
      updateSocialMediaIndexes();
      hideMaxFieldsMessage();
      validateStep(currentStep);
    });

    input.addEventListener('focus', function() {
      setTimeout(() => {
        handleInputScroll(this);
      }, 0);
    });

    select.addEventListener('focus', function() {
      setTimeout(() => {
        handleInputScroll(this);
      }, 0);
    });

    input.addEventListener('blur', function() {
      if (isMobile()) {
        const currentCard = steps[currentStep];
        
        // Check if we need to reset the scroll position
        if (currentCard.dataset.scrollOffset) {
          gsap.to(currentCard, {
            duration: 0.3,
            y: 0,
            ease: 'power2.out',
            onComplete: () => {
              // Ensure it maintains proper centering
              currentCard.style.left = '50%';
              currentCard.style.top = '50%';
              currentCard.style.transform = 'translate(-50%, -50%)';
              delete currentCard.dataset.scrollOffset;
            }
          });
          
          // Clear the stored offset
          delete currentCard.dataset.scrollOffset;
        }
      }
    });

    select.addEventListener('blur', function() {
      if (isMobile()) {
        const currentCard = steps[currentStep];
        
        // Check if we need to reset the scroll position
        if (currentCard.dataset.scrollOffset) {
          gsap.to(currentCard, {
            duration: 0.3,
            y: 0,
            ease: 'power2.out'
          });
          
          // Clear the stored offset
          delete currentCard.dataset.scrollOffset;
        }
      }
    });
    
    // Revalidate
    validateStep(currentStep);
  };

  // Update social media field indexes after deletion
  const updateSocialMediaIndexes = () => {
    const socialFields = socialMediaFields.querySelectorAll('.social-media-field');
    
    socialFields.forEach((field, index) => {
      const select = field.querySelector('select');
      const input = field.querySelector('input');
      
      if (select) select.name = `social-media-type-${index}`;
      if (input) input.name = `social-media-profile-${index}`;
    });
  };

  // Hide max fields message when fields are removed
  const hideMaxFieldsMessage = () => {
    const socialFields = socialMediaFields.querySelectorAll('.social-media-field');
    if (socialFields.length < 5) {
      maxSocialFieldsMessage.classList.add('hidden');
    }
  };
  
  // Update placeholder based on social media type
  const updatePlaceholder = (select, input) => {
    const type = select.value;
    
    if (type === 'website') {
      input.placeholder = 'e.g. yoursite.com';
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
      
      // Update the label color to black
      const label = developmentCheckbox.parentNode.nextElementSibling;
      if (label) {
        label.classList.remove('text-[#969696]');
        label.classList.remove('cursor-not-allowed');
        label.classList.add('text-[#fffdff]');
        label.classList.add('cursor-pointer');
      }
    } else {
      // Disable development checkbox and ensure it's unchecked
      developmentCheckbox.disabled = true;
      developmentCheckbox.checked = false;  // This line is already present
      developmentCheckbox.parentNode.classList.remove('border-black');
      developmentCheckbox.parentNode.classList.add('border-gray-300');
      
      // Update the label color to gray
      const label = developmentCheckbox.parentNode.nextElementSibling;
      if (label) {
        label.classList.add('text-[#969696]');
        label.classList.add('cursor-not-allowed');
        label.classList.remove('text-[#fffdff]');
        label.classList.remove('cursor-pointer');
      }
      
      // Trigger a change event to ensure validation is updated
      const changeEvent = new Event('change', { bubbles: true });
      developmentCheckbox.dispatchEvent(changeEvent);
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
    const webDesignCheckbox = document.querySelector('#webDesign');
    const developmentCheckbox = document.querySelector('#development');
    
    // webDesign checkbox logic
    webDesignCheckbox.addEventListener('change', function() {
        const container = this.parentNode;
        const selectedIcon = container.querySelector('.selected-checkbox');
        const emptyIcon = container.querySelector('.empty-checkbox');
        
        if (this.checked) {
            selectedIcon.classList.remove('hidden');
            emptyIcon.classList.add('hidden');
            
            // Enable development checkbox
            developmentCheckbox.disabled = false;
            const devContainer = developmentCheckbox.parentNode;
            const devDisabledIcon = devContainer.querySelector('.disabled-checkbox');
            const devEmptyIcon = devContainer.querySelector('.empty-checkbox');
            
            devDisabledIcon.classList.add('hidden');
            devEmptyIcon.classList.remove('hidden');
        } else {
            selectedIcon.classList.add('hidden');
            emptyIcon.classList.remove('hidden');
            
            // Disable development checkbox
            developmentCheckbox.disabled = true;
            developmentCheckbox.checked = false;
            const devContainer = developmentCheckbox.parentNode;
            const devSelectedIcon = devContainer.querySelector('.selected-checkbox');
            const devEmptyIcon = devContainer.querySelector('.empty-checkbox');
            const devDisabledIcon = devContainer.querySelector('.disabled-checkbox');
            
            devSelectedIcon.classList.add('hidden');
            devEmptyIcon.classList.add('hidden');
            devDisabledIcon.classList.remove('hidden');
        }
    });
    
    // development checkbox logic
    developmentCheckbox.addEventListener('change', function() {
        if (!this.disabled) {
            const container = this.parentNode;
            const selectedIcon = container.querySelector('.selected-checkbox');
            const emptyIcon = container.querySelector('.empty-checkbox');
            
            if (this.checked) {
                selectedIcon.classList.remove('hidden');
                emptyIcon.classList.add('hidden');
            } else {
                selectedIcon.classList.add('hidden');
                emptyIcon.classList.remove('hidden');
            }
        }
    });
    
    // Handle other checkboxes (brandStrategy, rebranding, other)
    document.querySelectorAll('input[type="checkbox"]:not(#webDesign):not(#development)').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const container = this.parentNode;
            const selectedIcon = container.querySelector('.selected-checkbox');
            const emptyIcon = container.querySelector('.empty-checkbox');
            
            if (this.checked) {
                selectedIcon.classList.remove('hidden');
                emptyIcon.classList.add('hidden');
            } else {
                selectedIcon.classList.add('hidden');
                emptyIcon.classList.remove('hidden');
            }
        });
    });
    
    // For radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const name = this.getAttribute('name');
            const group = document.querySelectorAll(`input[name="${name}"]`);
            
            // Reset all radios in group to empty
            group.forEach(item => {
                const emptyIcon = item.parentNode.querySelector('.empty-radio');
                const selectedIcon = item.parentNode.querySelector('.selected-radio');
                if (emptyIcon) emptyIcon.classList.remove('hidden');
                if (selectedIcon) selectedIcon.classList.add('hidden');
            });
            
            // Set selected radio
            if (this.checked) {
                const emptyIcon = this.parentNode.querySelector('.empty-radio');
                const selectedIcon = this.parentNode.querySelector('.selected-radio');
                if (emptyIcon) emptyIcon.classList.add('hidden');
                if (selectedIcon) selectedIcon.classList.remove('hidden');
            }
        });
    });
  };
  
  // ---------------
  // MOBILE SPECIAL STATES
  // ---------------

  const setupResponsiveCards = () => {
    // Skip if form is open and we're preventing resize
    if (formIsOpen && preventViewportResize) {
      return;
    }
    
    steps.forEach((step, index) => {
      // Skip modifications for non-current steps when form is open
      if (formIsOpen && index !== currentStep) {
        return;
      }
      
      const cardContent = step.querySelector('#card-content') || step.querySelector('.card-content');
      
      if (cardContent) {
        const maxCardHeight = window.innerHeight - 120;
        
        if (window.innerWidth < 768) {
          step.style.maxHeight = `${maxCardHeight}px`;
          step.style.overflow = 'hidden';
          step.style.display = 'flex';
          step.style.flexDirection = 'column';
          
          cardContent.style.overflowY = 'auto';
          cardContent.style.flexGrow = '1';
          cardContent.style.maxHeight = `${maxCardHeight - 80}px`;
        } else {
          step.style.maxHeight = 'none';
          step.style.overflow = 'visible';
          cardContent.style.overflowY = 'visible';
        }
      }
    });
    
    // Enforce correct visibility after responsive changes
    if (formIsOpen) {
      setTimeout(enforceStepVisibility, 50);
    }
  };
  
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
          
          // Show editing view with proper positioning
          textareaContainer.classList.add('hidden');
          editingView.classList.remove('hidden');
          
          // Position the editing view at the top of the viewport
          editingView.style.position = 'fixed';
          editingView.style.top = '10vh';
          editingView.style.left = '50%';
          editingView.style.transform = 'translateX(-50%)';
          editingView.style.width = '90vw';
          editingView.style.backgroundColor = '#4C4F50';
          editingView.style.opacity = '0.95';
          editingView.style.padding = '1rem';
          editingView.style.borderRadius = '0.25rem';
          editingView.style.borderColor = "#777777";
          editingView.style.borderWidth = '1px';
          editingView.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          editingView.style.zIndex = '60';
          
          // Animate overlay appearance
          gsap.fromTo(editingView, 
            { y: '20px', opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
          );
          
          // Focus the editing textarea
          setTimeout(() => {
            editingTextarea.focus();
          }, 100);
        } else {
          handleInputScroll(textarea);
        }
      });
      
      // Handler for marking as done
      markAsDoneButton.addEventListener('click', () => {
        // Copy text back to original textarea
        textarea.value = editingTextarea.value;
        
        gsap.to(editingView, {
          duration: 0.3,
          y: '20px',
          opacity: 0,
          ease: 'power2.in',
          onComplete: () => {
            textareaContainer.classList.remove('hidden');
            editingView.classList.add('hidden');
            
            // Reset editing view styles
            editingView.style.position = '';
            editingView.style.top = '';
            editingView.style.left = '';
            editingView.style.transform = '';
            editingView.style.width = '';
            editingView.style.backgroundColor = '';
            editingView.style.padding = '';
            editingView.style.borderRadius = '';
            editingView.style.boxShadow = '';
            editingView.style.zIndex = '';
          }
        });
        
        // Show question answered status if there's text
        if (textarea.value.trim() !== '') {
          questionStatus.classList.remove('hidden');
        } else {
          questionStatus.classList.add('hidden');
        }

        const inputEvent = new Event('input', { bubbles: true });
        textarea.dispatchEvent(inputEvent);
        
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
    if (input.dataset.scrolling === 'true') return;
    if (!isMobile()) return;

    input.dataset.scrolling = 'true';
    
    const currentCard = steps[currentStep];
    const inputRect = input.getBoundingClientRect();
    const cardRect = currentCard.getBoundingClientRect();
    
    console.log(`📍 Card position: ${cardRect.top}, Input position: ${inputRect.top}`);
    console.log(`📱 Viewport height: ${window.innerHeight}`);
    
    const targetPosition = window.innerHeight * 0.25;
    
    // For step-1, check if the card is already too high
    if (currentStep === 1 && cardRect.top < 50) {
      console.log('🔍 Step-1 card is already too high, not scrolling');
      input.dataset.scrolling = 'false';
      return;
    }

    if (inputRect.top > targetPosition) {
      const scrollAmount = Math.min(inputRect.top - targetPosition, window.innerHeight * 0.3);
      
      console.log(`📏 Scroll amount: ${scrollAmount}`);

      // For all inputs, just scroll the current step card
      gsap.to(currentCard, {
        duration: 0.3,
        y: -scrollAmount,
        ease: 'power2.out',
        onComplete: () => {
          input.dataset.scrolling = 'false';
        }
      });

      // Store the scroll amount to reset later
      currentCard.dataset.scrollOffset = scrollAmount;
    } else {
      input.dataset.scrolling = 'false';
    }
  };

  // Update the blur handler for inputs
  document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
    input.addEventListener('focus', () => {
      handleInputScroll(input);
    });
    
    input.addEventListener('blur', () => {
      if (isMobile()) {
        const currentCard = steps[currentStep];
        
        gsap.to(currentCard, {
          duration: 0.3,
          y: 0,
          ease: 'power2.out',
          onComplete: () => {
            // Ensure it maintains proper centering
            currentCard.style.left = '50%';
            currentCard.style.top = '50%';
            currentCard.style.transform = 'translate(-50%, -50%)';
            delete currentCard.dataset.scrollOffset;
          }
        });
        
        // Clear the stored offset
        delete currentCard.dataset.scrollOffset;
      }
    });
  });

  // Detect mobile keyboard open/close
  const setupKeyboardDetection = () => {
    if (!isMobile()) return;
    
    let initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      if (!formIsOpen) return;
      
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      
      // If height decreased by more than 150px, likely keyboard is open
      keyboardOpen = heightDifference > 150;
      preventViewportResize = keyboardOpen;
      
      // Force correct visibility when keyboard state changes
      if (formIsOpen) {
        enforceStepVisibility();
      }
    };
    
    // Listen for both visualViewport and resize events
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleViewportChange, 100);
    });
  };

  // Test function to simulate successful form submission
  const testSuccessState = () => {
    // Go to the last step first
    currentStep = steps.length - 1;
    showStep(currentStep);
    
    // Wait a bit to ensure the step is rendered
    setTimeout(() => {
      // Show success message
      showSuccessMessage();
      
      console.log('Success state activated for testing');
    }, 500);
  };
  
  // Initialize the form
  initForm();
});

window.FormController = {
  openForm,
  closeForm,
  currentStep,
  // Add other methods you want React to access
}