// formController.js - Updated version with animations

const FormController = {
    // State
    currentStep: 0,
    formData: {},
    socialFieldCount: 1,
    MAX_SOCIAL_FIELDS: 5,
    
    // Animation related
    stackedCards: [],
    finalPositions: [
      { x: '-20vw', y: '-20vh' },
      { x: '-5vw', y: '-10vh' },
      { x: '10vw', y: '0vh' },
      { x: '20vw', y: '10vh' },
      { x: '10vw', y: '20vh' },
      { x: '-5vw', y: '30vh' }
    ],
    
    // Initialize the form controller
    init() {
      this.cacheElements();
      this.bindEvents();
      this.setupTextareaInteractions();
      this.setupInputInteractions();
      this.validateCurrentStep();
      this.setupAnimations();
    },
    
    // Setup initial animation states
    setupAnimations() {
      // Add CSS for animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `;
      document.head.appendChild(style);
    },
    
    // Cache DOM elements
    cacheElements() {
      this.openFormBtn = document.getElementById('open-form-btn');
      this.formOverlay = document.getElementById('form-overlay');
      this.formContainer = document.getElementById('form-container');
      this.form = document.getElementById('multi-step-form');
      this.steps = Array.from(document.querySelectorAll('.step'));
      this.successMessage = document.getElementById('success-message');
      this.errorMessage = document.getElementById('error-message');
      this.closeButtons = document.querySelectorAll('.close-button');
      this.prevButtons = document.querySelectorAll('.prev-button');
      this.nextButtons = document.querySelectorAll('.next-button');
      this.addSocialButton = document.querySelector('.add-social-button');
      this.maxSocialFieldsMessage = document.getElementById('max-social-fields-message');
      this.showQuestionButton = document.getElementById('show-question-button');
      this.hideQuestionButton = document.getElementById('hide-question-button');
      this.optionalQuestionContainer = document.getElementById('optional-question-container');
    },
    
    // Bind event listeners
    bindEvents() {
      // Open form button
      this.openFormBtn.addEventListener('click', () => this.openForm());
      
      // Close buttons
      this.closeButtons.forEach(btn => {
        btn.addEventListener('click', () => this.closeForm());
      });
      
      // Previous buttons
      this.prevButtons.forEach(btn => {
        btn.addEventListener('click', () => this.prevStep());
      });
      
      // Next buttons
      this.nextButtons.forEach(btn => {
        btn.addEventListener('click', () => this.nextStep());
      });
      
      // Input event listeners for validation
      this.form.addEventListener('input', () => this.validateCurrentStep());
      this.form.addEventListener('change', () => this.validateCurrentStep());
      
      // Form submission
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Close form when clicking overlay
      this.formOverlay.addEventListener('click', () => this.closeForm());
      
      // Add social media field button
      this.addSocialButton.addEventListener('click', () => this.addSocialMediaField());
      
      // Optional question toggle
      this.showQuestionButton.addEventListener('click', () => this.toggleOptionalQuestion(true));
      this.hideQuestionButton.addEventListener('click', () => this.toggleOptionalQuestion(false));
      
      // Setup initial social media placeholder
      this.setupSocialMediaPlaceholder(document.querySelector('.social-media-field'));
      
      // Try again button
      const tryAgainButton = document.getElementById('try-again-button');
      if (tryAgainButton) {
        tryAgainButton.addEventListener('click', () => {
          const errorMessage = document.getElementById('error-message');
          
          // Animate error message out
          errorMessage.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
          errorMessage.style.transform = 'translateX(100vw)';
          errorMessage.style.opacity = '0';
          
          setTimeout(() => {
            errorMessage.classList.add('hidden');
            errorMessage.style.transform = '';
            errorMessage.style.opacity = '';
            
            this.currentStep = 0;
            this.showStep(0);
          }, 300);
        });
      }
    },
    
    // Setup input special interactions for mobile
    setupInputInteractions() {
      const isMobile = () => window.innerWidth < 768;
      
      // Get all text inputs (excluding textareas)
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
      
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          if (isMobile()) {
            this.handleInputFocus(input);
          }
        });
        
        input.addEventListener('blur', () => {
          if (isMobile()) {
            this.handleInputBlur(input);
          }
        });
      });
    },
    
    handleInputFocus(input) {
      const step = input.closest('.step');
      const inputRect = input.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If input is in the lower half of the screen, scroll the card up
      if (inputRect.top > viewportHeight / 2) {
        const scrollAmount = inputRect.top - (viewportHeight * 0.3); // Position input at 30% from top
        step.scrollTop += scrollAmount;
        
        // Store the scroll amount for reversing later
        input._scrollAmount = scrollAmount;
      }
    },
    
    handleInputBlur(input) {
      const step = input.closest('.step');
      
      // Reverse the scroll if we scrolled for this input
      if (input._scrollAmount) {
        step.scrollTop -= input._scrollAmount;
        delete input._scrollAmount;
      }
    },
    
    // Setup textarea special interactions
    setupTextareaInteractions() {
      // Check if device is mobile (viewport width less than 768px)
      const isMobile = () => window.innerWidth < 768;
      
      // Get all textareas
      const textareas = document.querySelectorAll('.textarea-container textarea');
      
      textareas.forEach(textarea => {
        // Focus event to activate special state (only on mobile)
        textarea.addEventListener('focus', () => {
          if (isMobile()) {
            this.activateTextareaSpecialState(textarea);
          }
        });
      });
      
      // Mark as done buttons
      const markAsDoneButtons = document.querySelectorAll('.mark-as-done');
      markAsDoneButtons.forEach(button => {
        button.addEventListener('click', () => this.deactivateTextareaSpecialState(button));
      });
    },
    
    activateTextareaSpecialState(textarea) {
      const questionContainer = textarea.closest('.question-container');
      if (!questionContainer) return;
      
      const textareaContainer = questionContainer.querySelector('.textarea-container');
      const editingView = questionContainer.querySelector('.editing-view');
      const editingTextarea = editingView.querySelector('textarea');
      const question = questionContainer.querySelector('label');
      
      // Make editing view a focused overlay
      editingView.style.position = 'fixed';
      editingView.style.top = '0';
      editingView.style.left = '0';
      editingView.style.right = '0';
      editingView.style.bottom = '0';
      editingView.style.backgroundColor = 'white';
      editingView.style.zIndex = '60';
      editingView.style.padding = '1rem';
      editingView.style.display = 'flex';
      editingView.style.flexDirection = 'column';
      
      // Add question text to editing view if not already there
      let questionClone = editingView.querySelector('.question-text');
      if (!questionClone) {
        questionClone = document.createElement('div');
        questionClone.className = 'question-text mb-4 text-xl font-medium';
        questionClone.textContent = question.textContent;
        editingView.insertBefore(questionClone, editingTextarea);
      }
      
      // Hide normal view, show editing view
      textareaContainer.classList.add('hidden');
      editingView.classList.remove('hidden');
      
      // Copy current value to editing textarea
      editingTextarea.value = textarea.value;
      
      // Focus the editing textarea
      setTimeout(() => {
        editingTextarea.focus();
      }, 50);
      
      // Sync values between textareas
      const syncHandler = () => {
        textarea.value = editingTextarea.value;
        // Trigger validation
        this.validateCurrentStep();
      };
      
      editingTextarea.addEventListener('input', syncHandler);
      
      // Store the handler for cleanup
      editingTextarea._syncHandler = syncHandler;
    },
    
    deactivateTextareaSpecialState(button) {
      const questionContainer = button.closest('.question-container');
      if (!questionContainer) return;
      
      const textareaContainer = questionContainer.querySelector('.textarea-container');
      const editingView = questionContainer.querySelector('.editing-view');
      const textarea = textareaContainer.querySelector('textarea');
      const editingTextarea = editingView.querySelector('textarea');
      const questionStatus = questionContainer.querySelector('.question-status');
      
      // Update the main textarea with the edited value
      textarea.value = editingTextarea.value;
      
      // Remove overlay styles
      editingView.style = '';
      
      // Show normal view, hide editing view
      editingView.classList.add('hidden');
      textareaContainer.classList.remove('hidden');
      
      // Show "Question answered!" if there's content
      if (textarea.value.trim()) {
        questionStatus.classList.remove('hidden');
      } else {
        questionStatus.classList.add('hidden');
      }
      
      // Clean up event listeners
      if (editingTextarea._syncHandler) {
        editingTextarea.removeEventListener('input', editingTextarea._syncHandler);
        delete editingTextarea._syncHandler;
      }
      
      // Trigger validation
      this.validateCurrentStep();
    },
    
    // Open form with animation
    openForm() {
      // Show form and overlay
      this.formOverlay.classList.remove('hidden');
      this.formContainer.classList.remove('hidden');
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Animate overlay fade in
      this.formOverlay.style.opacity = '0';
      this.formOverlay.style.transition = 'opacity 0.3s ease';
      requestAnimationFrame(() => {
        this.formOverlay.style.opacity = '0.5';
      });
      
      // Reset to first step
      this.currentStep = 0;
      
      // Show first step with slide-in animation
      const firstStep = this.steps[0];
      this.steps.forEach(step => step.classList.add('hidden'));
      firstStep.classList.remove('hidden');
      
      firstStep.style.transform = 'translateX(100vw)';
      firstStep.style.opacity = '0';
      firstStep.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      
      requestAnimationFrame(() => {
        firstStep.style.transform = 'translateX(0)';
        firstStep.style.opacity = '1';
      });
      
      this.validateCurrentStep();
    },
    
    // Close form with animation
    closeForm() {
      const isSuccessState = this.currentStep === 'success';
      
      if (isSuccessState) {
        // Close from success state - keep stacked cards
        this.successMessage.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        this.successMessage.style.transform = 'translateX(-100vw)';
        this.successMessage.style.opacity = '0';
        
        // Fade out overlay
        this.formOverlay.style.transition = 'opacity 0.5s ease';
        this.formOverlay.style.opacity = '0';
        
        setTimeout(() => {
          // Actually hide elements
          this.formOverlay.classList.add('hidden');
          this.formContainer.classList.add('hidden');
          
          // Reset styles
          this.formOverlay.style.opacity = '';
          this.formOverlay.style.transition = '';
          this.successMessage.style.transform = '';
          this.successMessage.style.opacity = '';
          
          // Re-enable background scrolling
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }, 500);
      } else {
        // Normal close - animate all cards out
        const visibleElements = document.querySelectorAll('.step:not(.hidden), #success-message:not(.hidden), #error-message:not(.hidden)');
        
        visibleElements.forEach((element, index) => {
          setTimeout(() => {
            element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            element.style.transform = 'translateX(-100vw)';
            element.style.opacity = '0';
          }, index * 100);
        });
        
        // Animate stacked cards out
        this.stackedCards.forEach((stepIndex, i) => {
          const element = document.querySelector(`#step-${stepIndex}`);
          if (element && !element.classList.contains('hidden')) {
            setTimeout(() => {
              element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
              element.style.transform = 'translateX(-100vw)';
              element.style.opacity = '0';
            }, (visibleElements.length + i) * 100);
          }
        });
        
        // Fade out overlay
        setTimeout(() => {
          this.formOverlay.style.transition = 'opacity 0.5s ease';
          this.formOverlay.style.opacity = '0';
        }, 300);
        
        // Actually hide elements and reset after animations complete
        setTimeout(() => {
          // Hide elements
          this.formOverlay.classList.add('hidden');
          this.formContainer.classList.add('hidden');
          
          // Re-enable background scrolling
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
          
          // Reset form
          this.form.reset();
          this.currentStep = 0;
          
          // Reset all animations
          this.resetAnimations();
          
          // Reset social fields
          this.resetSocialFields();
          
          // Reset optional question
          this.toggleOptionalQuestion(false);
          
          // Reset textarea states
          this.resetTextareaStates();
          
          // Hide success/error messages
          this.successMessage.classList.add('hidden');
          this.errorMessage.classList.add('hidden');
          
          // Show first step (hidden during animation)
          this.steps[0].classList.remove('hidden');
          this.steps[0].style.transform = '';
          this.steps[0].style.opacity = '';
          this.steps[0].style.transition = '';
        }, 1000);
      }
    },
    
    // Reset animations
    resetAnimations() {
      // Reset all transforms
      this.steps.forEach(step => {
        step.style.transform = '';
        step.style.opacity = '';
        step.style.transition = '';
        step.style.zIndex = '';
      });
      
      this.stackedCards = [];
    },
    
    // Setup social media placeholder based on selection
    setupSocialMediaPlaceholder(field) {
      const select = field.querySelector('select');
      const input = field.querySelector('input[type="text"]');
      
      if (!select || !input) return;
      
      const updatePlaceholder = () => {
        const placeholders = {
          instagram: 'e.g. @username',
          facebook: 'e.g. @username',
          twitter: 'e.g. @username',
          linkedin: 'e.g. @username',
          website: 'e.g. yourcompany.com'
        };
        
        input.placeholder = placeholders[select.value] || 'e.g. @username';
      };
      
      // Update placeholder on change
      select.addEventListener('change', updatePlaceholder);
      
      // Set initial placeholder
      updatePlaceholder();
    },
    
    // Reset social fields to initial state
    resetSocialFields() {
      const container = document.querySelector('.social-media-fields');
      const extraFields = container.querySelectorAll('.social-media-field:not(:first-child)');
      extraFields.forEach(field => field.remove());
      this.socialFieldCount = 1;
      this.addSocialButton.classList.remove('hidden');
      this.maxSocialFieldsMessage.classList.add('hidden');
    },
    
    // Add social media field
    addSocialMediaField() {
      if (this.socialFieldCount >= this.MAX_SOCIAL_FIELDS) {
        this.maxSocialFieldsMessage.classList.remove('hidden');
        setTimeout(() => {
          this.maxSocialFieldsMessage.classList.add('hidden');
        }, 3000);
        return;
      }
      
      const container = document.querySelector('.social-media-fields');
      const newField = document.createElement('div');
      newField.className = 'social-media-field mt-3';
      
      newField.innerHTML = `
        <div class="flex rounded-xl border border-gray-300 overflow-hidden">
          <div class="bg-gray-100 flex items-center px-4 py-3 border-r border-gray-300">
            <select name="social-media-type-${this.socialFieldCount}" class="bg-gray-100 border-none focus:ring-0">
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="website">Website</option>
            </select>
          </div>
          <input 
            type="text" 
            name="social-media-profile-${this.socialFieldCount}" 
            class="flex-grow px-3 py-3 bg-white min-w-0" 
            placeholder="e.g. @username"
          >
          <button type="button" class="remove-social px-3 bg-gray-100 border-l border-gray-300 text-gray-500 hover:text-red-500 flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;
      
      container.appendChild(newField);
      this.socialFieldCount++;
      
      // Setup placeholder for the new field
      this.setupSocialMediaPlaceholder(newField);
      
      // Hide add button if max reached
      if (this.socialFieldCount >= this.MAX_SOCIAL_FIELDS) {
        this.addSocialButton.classList.add('hidden');
      }
      
      // Add remove button functionality
      const removeButton = newField.querySelector('.remove-social');
      removeButton.addEventListener('click', () => this.removeSocialMediaField(newField));
    },
    
    // Remove social media field
    removeSocialMediaField(field) {
      field.remove();
      this.socialFieldCount--;
      
      // Show add button if it was hidden
      if (this.socialFieldCount < this.MAX_SOCIAL_FIELDS) {
        this.addSocialButton.classList.remove('hidden');
      }
    },
    
    // Toggle optional question visibility
    toggleOptionalQuestion(show) {
      if (show) {
        this.showQuestionButton.classList.add('hidden');
        this.hideQuestionButton.classList.remove('hidden');
        this.optionalQuestionContainer.classList.remove('hidden');
      } else {
        this.showQuestionButton.classList.remove('hidden');
        this.hideQuestionButton.classList.add('hidden');
        this.optionalQuestionContainer.classList.add('hidden');
      }
    },

    // Show specific step with animation
    showStep(stepIndex) {
        const fromStep = this.currentStep;
        
        // Skip animation for special states
        if (typeof fromStep !== 'number' || typeof stepIndex !== 'number') {
          this.steps.forEach((step, i) => {
            step.classList.toggle('hidden', i !== stepIndex);
          });
          this.successMessage.classList.add('hidden');
          this.errorMessage.classList.add('hidden');
          
          this.updateProgressIndicators();
          return;
        }
        
        // Handle step transitions with animations
        if (fromStep !== stepIndex) {
          if (stepIndex > fromStep) {
            // Moving forward - stack current card
            this.animateForward(fromStep, stepIndex);
          } else {
            // Moving backward - unstack card
            this.animateBackward(fromStep, stepIndex);
          }
        }
        
        this.updateProgressIndicators();
    },
    
    // Animate moving forward to next step
    animateForward(fromIndex, toIndex) {
    const fromElement = this.steps[fromIndex];
    const toElement = this.steps[toIndex];
    
    // Stack the current card
    this.stackCard(fromElement, fromIndex);
    
    // Prepare the next card for animation
    toElement.classList.remove('hidden');
    toElement.style.transform = 'translateX(100vw)';
    toElement.style.opacity = '0';
    toElement.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    toElement.style.zIndex = '10';
    
    // Slide in the next card
    requestAnimationFrame(() => {
        toElement.style.transform = 'translateX(0)';
        toElement.style.opacity = '1';
    });
    },
    
    // Animate moving backward to previous step
    animateBackward(fromIndex, toIndex) {
    const fromElement = this.steps[fromIndex];
    const toElement = this.steps[toIndex];
    
    // Slide out current card
    fromElement.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    fromElement.style.transform = 'translateX(100vw)';
    fromElement.style.opacity = '0';
    
    // Show and unstack the previous card
    toElement.classList.remove('hidden');
    this.unstackCard(toElement, toIndex);
    
    // Hide the from element after animation
    setTimeout(() => {
        fromElement.classList.add('hidden');
        fromElement.style.transform = '';
        fromElement.style.opacity = '';
    }, 500);
    },
    
    // Stack a card in a decorative position
    stackCard(element, stepIndex) {
    // Add to stacked cards if not already there
    if (!this.stackedCards.includes(stepIndex)) {
        this.stackedCards.push(stepIndex);
    }
    
    // Get final position based on step index
    const position = this.finalPositions[stepIndex % this.finalPositions.length];
    
    // Random rotation between -5 and 5 degrees
    const rotation = (Math.random() - 0.5) * 10;
    
    // Animate to stacked position
    element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    element.style.transform = `translate(${position.x}, ${position.y}) scale(0.9) rotate(${rotation}deg)`;
    element.style.opacity = '0.8';
    element.style.zIndex = '-1';
    },
    
    // Unstack a card and bring to front
    unstackCard(element, stepIndex) {
    element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    element.style.transform = 'translateX(0) scale(1) rotate(0deg)';
    element.style.opacity = '1';
    element.style.zIndex = '10';
    
    // Remove from stacked cards
    const index = this.stackedCards.indexOf(stepIndex);
    if (index > -1) {
        this.stackedCards.splice(index, 1);
    }
    },
    
    // Navigate to previous step
    prevStep() {
    if (this.currentStep > 0) {
        this.currentStep--;
        this.showStep(this.currentStep);
        this.validateCurrentStep();
    }
    },
    
    // Navigate to next step
    nextStep() {
    if (this.currentStep < this.steps.length - 1 && this.isStepValid(this.currentStep)) {
        this.currentStep++;
        this.showStep(this.currentStep);
        this.validateCurrentStep();
    }
    },
    
    // Validate current step and update button state
    validateCurrentStep() {
    const isValid = this.isStepValid(this.currentStep);
    const nextButton = this.steps[this.currentStep].querySelector('.next-button');
    
    if (nextButton) {
        if (isValid) {
        nextButton.disabled = false;
        nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
        nextButton.disabled = true;
        nextButton.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
    },
    
    // Check if a step is valid
    isStepValid(stepIndex) {
    const step = this.steps[stepIndex];
    
    // Check required text inputs and textareas
    const requiredInputs = step.querySelectorAll('input[required]:not([type="radio"]):not([type="checkbox"]), textarea[required]');
    for (let input of requiredInputs) {
        if (!input.value.trim()) {
        return false;
        }
        
        // Special validation for email
        if (input.type === 'email' && !this.isValidEmail(input.value)) {
        return false;
        }
    }
    
    // Check required radio groups
    const radioGroups = this.getRadioGroups(step);
    for (let groupName of radioGroups) {
        const radios = step.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
        if (radios.length > 0 && radios[0].hasAttribute('required')) {
        const checked = step.querySelector(`input[type="radio"][name="${groupName}"]:checked`);
        if (!checked) {
            return false;
        }
        }
    }
    
    // Check required checkboxes (if any checkboxes in a group are required)
    const checkboxGroups = this.getCheckboxGroups(step);
    for (let groupName of checkboxGroups) {
        const checkboxes = step.querySelectorAll(`input[type="checkbox"][name="${groupName}"]`);
        if (checkboxes.length > 0 && checkboxes[0].hasAttribute('required')) {
        const checked = step.querySelector(`input[type="checkbox"][name="${groupName}"]:checked`);
        if (!checked) {
            return false;
        }
        }
    }
    
    // Special case for custom budget field
    const budgetCustomRadio = step.querySelector('#budgetCustom');
    const customBudgetInput = step.querySelector('#customBudget');
    if (budgetCustomRadio && budgetCustomRadio.checked && customBudgetInput) {
        if (!customBudgetInput.value.trim()) {
        return false;
        }
    }
    
    return true;
    },
    
    // Get unique radio group names in a step
    getRadioGroups(step) {
    const radios = step.querySelectorAll('input[type="radio"]');
    const groups = new Set();
    radios.forEach(radio => groups.add(radio.name));
    return Array.from(groups);
    },
    
    // Get unique checkbox group names in a step
    getCheckboxGroups(step) {
    const checkboxes = step.querySelectorAll('input[type="checkbox"]');
    const groups = new Set();
    checkboxes.forEach(checkbox => groups.add(checkbox.name));
    return Array.from(groups);
    },
    
    // Validate email format
    isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
    },
    
    // Update progress indicators
    updateProgressIndicators() {
    // This will be implemented later with your specific progress indicator logic
    },
    
    // Handle form submission
    async handleSubmit(e) {
    e.preventDefault();
    
    // Validate final step
    if (!this.isStepValid(this.currentStep)) {
        return;
    }
    
    // Collect form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Remove honeypot field from data
    delete data.website;
    
    // Show loading state
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Submitting...</span>';
    
    try {
        // Submit to Netlify function
        const response = await fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        });
        
        if (response.ok) {
        // Show success message as a card
        this.showSuccessMessage();
        } else {
        // Show error message as a card
        this.showErrorMessage();
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        this.showErrorMessage();
    } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
    },
    
    // Show success message with animation
    showSuccessMessage() {
    // Hide all steps but don't reset stacked cards
    this.steps.forEach(step => step.classList.add('hidden'));
    
    // Prepare success message
    this.successMessage.classList.remove('hidden');
    this.successMessage.style.transform = 'translateY(20px)';
    this.successMessage.style.opacity = '0';
    this.successMessage.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    
    // Animate success message in
    requestAnimationFrame(() => {
        this.successMessage.style.transform = 'translateY(0)';
        this.successMessage.style.opacity = '1';
    });
    
    // Update the currentStep to indicate we're on a special state
    this.currentStep = 'success';
    },
    
    // Show error message with animation
    showErrorMessage() {
    // Hide all steps
    this.steps.forEach(step => step.classList.add('hidden'));
    
    // Prepare error message
    this.errorMessage.classList.remove('hidden');
    this.errorMessage.style.animation = 'shake 0.5s ease-out';
    this.errorMessage.style.opacity = '0';
    this.errorMessage.style.transition = 'opacity 0.3s ease-out';
    
    // Animate error message in
    requestAnimationFrame(() => {
        this.errorMessage.style.opacity = '1';
    });
    
    // Remove animation after completion
    setTimeout(() => {
        this.errorMessage.style.animation = '';
    }, 500);
    
    // Update the currentStep to indicate we're on a special state
    this.currentStep = 'error';
    },
    
    resetTextareaStates() {
    // Hide all editing views
    document.querySelectorAll('.editing-view').forEach(view => {
        view.classList.add('hidden');
        view.style = ''; // Reset any inline styles
    });
    
    // Show all textarea containers
    document.querySelectorAll('.textarea-container').forEach(container => {
        container.classList.remove('hidden');
    });
    
    // Hide all question status indicators
    document.querySelectorAll('.question-status').forEach(status => {
        status.classList.add('hidden');
    });
    
    // Clean up any event listeners
    document.querySelectorAll('.editing-view textarea').forEach(textarea => {
        if (textarea._syncHandler) {
        textarea.removeEventListener('input', textarea._syncHandler);
        delete textarea._syncHandler;
        }
    });
    }
};
    
// Special field interactions
const SpecialFields = {
    init() {
    this.setupWebDesignDependency();
    this.setupBudgetRadios();
    this.setupCheckboxVisuals();
    this.setupRadioVisuals();
    },
    
    // Setup Web Design -> Development dependency
    setupWebDesignDependency() {
    const webDesignCheckbox = document.getElementById('webDesign');
    const developmentCheckbox = document.getElementById('development');
    const developmentLabel = document.querySelector('label[for="development"]');
    const developmentContainer = developmentCheckbox?.closest('.checkbox-container');
    
    if (webDesignCheckbox && developmentCheckbox) {
        webDesignCheckbox.addEventListener('change', () => {
        if (webDesignCheckbox.checked) {
            developmentCheckbox.disabled = false;
            developmentLabel.classList.remove('text-gray-400', 'cursor-not-allowed');
            developmentLabel.classList.add('cursor-pointer');
            developmentContainer.classList.remove('border-gray-300');
            developmentContainer.classList.add('border-black');
        } else {
            // Disable and uncheck development checkbox when web design is unchecked
            developmentCheckbox.disabled = true;
            developmentCheckbox.checked = false;
            developmentLabel.classList.add('text-gray-400', 'cursor-not-allowed');
            developmentLabel.classList.remove('cursor-pointer');
            developmentContainer.classList.add('border-gray-300');
            developmentContainer.classList.remove('border-black');
            
            // Also hide the checkbox icon
            const icon = developmentContainer.querySelector('.checkbox-icon');
            if (icon) {
            icon.classList.add('hidden');
            }
        }
        
        // Trigger validation after change
        FormController.validateCurrentStep();
        });
    }
    },
    
    // Setup budget radio custom field
    setupBudgetRadios() {
    const budgetRadios = document.querySelectorAll('input[name="budget"]');
    const customBudgetContainer = document.getElementById('customBudgetContainer');
    
    budgetRadios.forEach(radio => {
        radio.addEventListener('change', () => {
        if (radio.id === 'budgetCustom' && radio.checked) {
            customBudgetContainer.classList.remove('hidden');
        } else if (radio.id !== 'budgetCustom' && radio.checked) {
            customBudgetContainer.classList.add('hidden');
        }
        });
    });
    },
    
    // Setup checkbox visual feedback
    setupCheckboxVisuals() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
        const icon = checkbox.closest('.checkbox-container').querySelector('.checkbox-icon');
        if (checkbox.checked) {
            icon.classList.remove('hidden');
        } else {
            icon.classList.add('hidden');
        }
        });
    });
    },
    
    // Setup radio visual feedback
    setupRadioVisuals() {
    const radios = document.querySelectorAll('input[type="radio"]');
    
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
        if (radio.checked) {
            // Hide all radio indicators in the same group
            const groupRadios = document.querySelectorAll(`input[name="${radio.name}"]`);
            groupRadios.forEach(groupRadio => {
            const indicator = groupRadio.closest('.radio-container').querySelector('.radio-selected');
            indicator.classList.add('hidden');
            });
            
            // Show the selected indicator
            const selectedIndicator = radio.closest('.radio-container').querySelector('.radio-selected');
            selectedIndicator.classList.remove('hidden');
        }
        });
    });
    }
};
    
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    FormController.init();
    SpecialFields.init();
});