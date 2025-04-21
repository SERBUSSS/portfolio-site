// Enhanced form functionality script
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('inquiry-form');
    const steps = document.querySelectorAll('.step');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Animation variables
    let currentStep = 0;
    const totalSteps = steps.length;
    
    // Initialize the form
    initializeForm();
    
    /**
     * Main Form Initialization
     */
    function initializeForm() {
      // Handle textarea interactions
      initializeTextareas();
      
      // Handle checkbox functionality
      initializeCheckboxes();
      
      // Handle radio button functionality
      initializeRadioButtons();
      
      // Handle optional question toggle
      initializeOptionalQuestion();
      
      // Initialize navigation buttons
      initializeNavigation();
      
      // Initialize form submission
      initializeFormSubmission();
      
      // Show first step
      updateFormState();
      
      // Set up card animations (based on cardScrollType1.js)
      setupCardAnimations();
    }
    
    /**
     * Navigation Functions
     */
    function initializeNavigation() {
      // Handle "Next" button clicks
      document.querySelectorAll('.next-button').forEach(button => {
        button.addEventListener('click', function() {
          // Validate current step before proceeding
          if (validateStep(currentStep)) {
            animateToNextStep();
          }
        });
      });
      
      // Handle "Previous" button clicks
      document.querySelectorAll('.prev-button').forEach(button => {
        button.addEventListener('click', function() {
          animateToPreviousStep();
        });
      });
      
      // Close button functionality
      document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
          // Here you might want to add a confirmation dialog
          if (confirm('Are you sure you want to close the form? Your progress will be lost.')) {
            // Reset the form or navigate away
            form.reset();
            // Hide the form
            const formContainer = document.querySelector('#c-form .bg-white');
            if (formContainer) {
              formContainer.classList.add('hidden');
            }
          }
        });
      });
    }
    
    function updateFormState() {
      // Update step visibility
      steps.forEach((step, index) => {
        if (index === currentStep) {
          step.classList.remove('hidden');
        } else {
          step.classList.add('hidden');
        }
      });
      
      // Update progress indicators based on the current step
      updateProgressIndicators();
    }
    
    function updateProgressIndicators() {
      steps.forEach((step, index) => {
        const progressIndicators = step.querySelectorAll('.flex.space-x-2 > div');
        
        if (progressIndicators.length === 4) { // Make sure we have the 4 indicators
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
        }
      });
    }
  
    /**
     * Animation Functions
     */
    function setupCardAnimations() {
      // Set up GSAP for animations
      if (typeof gsap !== 'undefined') {
        // Hide all steps except the first one
        steps.forEach((step, index) => {
          if (index !== 0) {
            gsap.set(step, {
              opacity: 0,
              y: 50,
              scale: 0.95
            });
          }
        });
      }
    }
    
    function animateToNextStep() {
      if (typeof gsap !== 'undefined') {
        // Current step animation out
        gsap.to(steps[currentStep], {
          opacity: 0,
          y: -50,
          scale: 0.95,
          duration: 0.4,
          onComplete: function() {
            // Update currentStep after animation
            currentStep++;
            if (currentStep >= totalSteps) {
              currentStep = totalSteps - 1;
            }
            updateFormState();
            
            // Next step animation in
            gsap.fromTo(steps[currentStep], 
              { opacity: 0, y: 50, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.4 }
            );
          }
        });
      } else {
        // Fallback if GSAP is not available
        currentStep++;
        if (currentStep >= totalSteps) {
          currentStep = totalSteps - 1;
        }
        updateFormState();
      }
    }
    
    function animateToPreviousStep() {
      if (typeof gsap !== 'undefined') {
        // Current step animation out
        gsap.to(steps[currentStep], {
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.4,
          onComplete: function() {
            // Update currentStep after animation
            currentStep--;
            if (currentStep < 0) {
              currentStep = 0;
            }
            updateFormState();
            
            // Previous step animation in
            gsap.fromTo(steps[currentStep], 
              { opacity: 0, y: -50, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.4 }
            );
          }
        });
      } else {
        // Fallback if GSAP is not available
        currentStep--;
        if (currentStep < 0) {
          currentStep = 0;
        }
        updateFormState();
      }
    }
    
    /**
     * Textarea Functionality
     */
    function initializeTextareas() {
      // Handle textarea focus events
      document.querySelectorAll('.textarea-container textarea').forEach(textarea => {
        // When a textarea is clicked/focused
        textarea.addEventListener('focus', function() {
          // Get parent question container
          const questionContainer = this.closest('.question-container');
          
          // Hide the regular textarea view
          questionContainer.querySelector('.textarea-container').classList.add('hidden');
          
          // Show the editing view
          const editingView = questionContainer.querySelector('.editing-view');
          editingView.classList.remove('hidden');
          
          // Set the value in the editing textarea to match the main textarea
          const editingTextarea = editingView.querySelector('textarea');
          editingTextarea.value = this.value;
          
          // Focus the editing textarea
          editingTextarea.focus();
        });
      });
      
      // Handle "Mark as done" button clicks
      document.querySelectorAll('.mark-as-done').forEach(button => {
        button.addEventListener('click', function() {
          // Get parent question container
          const questionContainer = this.closest('.question-container');
          
          // Get the editing textarea and its value
          const editingTextarea = questionContainer.querySelector('.editing-view textarea');
          const textValue = editingTextarea.value.trim();
          
          // Get the main textarea
          const mainTextarea = questionContainer.querySelector('.textarea-container textarea');
          
          // Update the main textarea value
          mainTextarea.value = textValue;
          
          // Show/hide appropriate elements
          questionContainer.querySelector('.editing-view').classList.add('hidden');
          questionContainer.querySelector('.textarea-container').classList.remove('hidden');
          
          // Show "Question answered!" if there's content
          if (textValue) {
            const statusElement = questionContainer.querySelector('.question-status');
            if (statusElement) {
              statusElement.classList.remove('hidden');
            }
          } else {
            const statusElement = questionContainer.querySelector('.question-status');
            if (statusElement) {
              statusElement.classList.add('hidden');
            }
          }
        });
      });
      
      // Initialize questions that might already have answers
      document.querySelectorAll('.textarea-container textarea').forEach(textarea => {
        if (textarea.value.trim()) {
          const questionContainer = textarea.closest('.question-container');
          const statusElement = questionContainer.querySelector('.question-status');
          if (statusElement) {
            statusElement.classList.remove('hidden');
          }
        }
      });
    }
    
    /**
     * Checkbox Functionality
     */
    function initializeCheckboxes() {
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const checkboxContainer = this.closest('.checkbox-container');
          if (!checkboxContainer) return;
          
          const checkboxIcon = checkboxContainer.querySelector('.checkbox-icon');
          if (!checkboxIcon) return;
          
          if (this.checked) {
            checkboxIcon.classList.remove('hidden');
          } else {
            checkboxIcon.classList.add('hidden');
          }
          
          // Special handling for the Web Design checkbox
          if (this.id === 'webDesign') {
            const developmentCheckbox = document.getElementById('development');
            if (!developmentCheckbox) return;
            
            const developmentContainer = developmentCheckbox.closest('.checkbox-container');
            const developmentLabel = document.querySelector('label[for="development"]');
            
            if (this.checked) {
              // Enable the Development checkbox
              developmentCheckbox.disabled = false;
              developmentCheckbox.classList.remove('cursor-not-allowed');
              developmentCheckbox.classList.add('cursor-pointer');
              
              // Update the styles
              if (developmentContainer) {
                developmentContainer.classList.remove('border-gray-300');
                developmentContainer.classList.add('border-black');
              }
              
              if (developmentLabel) {
                developmentLabel.classList.remove('text-gray-400', 'cursor-not-allowed');
                developmentLabel.classList.add('cursor-pointer');
              }
            } else {
              // Disable the Development checkbox
              developmentCheckbox.disabled = true;
              developmentCheckbox.checked = false;
              developmentCheckbox.classList.add('cursor-not-allowed');
              developmentCheckbox.classList.remove('cursor-pointer');
              
              // Update the styles
              if (developmentContainer) {
                developmentContainer.classList.add('border-gray-300');
                developmentContainer.classList.remove('border-black');
                
                const icon = developmentContainer.querySelector('.checkbox-icon');
                if (icon) {
                  icon.classList.add('hidden');
                }
              }
              
              if (developmentLabel) {
                developmentLabel.classList.add('text-gray-400', 'cursor-not-allowed');
                developmentLabel.classList.remove('cursor-pointer');
              }
            }
          }
        });
      });
    }
    
    /**
     * Radio Button Functionality
     */
    function initializeRadioButtons() {
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
          // Find all selected indicators in the same group
          const groupName = this.name;
          const allRadios = document.querySelectorAll(`input[name="${groupName}"]`);
          
          // Hide all selected indicators
          allRadios.forEach(radioBtn => {
            const container = radioBtn.closest('.radio-container');
            if (container) {
              const selectedIndicator = container.querySelector('.radio-selected');
              if (selectedIndicator) {
                selectedIndicator.classList.add('hidden');
              }
            }
          });
          
          // Show selected indicator for this radio button
          if (this.checked) {
            const container = this.closest('.radio-container');
            if (container) {
              const selectedIndicator = container.querySelector('.radio-selected');
              if (selectedIndicator) {
                selectedIndicator.classList.remove('hidden');
              }
            }
            
            // Handle the custom budget field visibility
            if (this.name === 'budget') {
              const customBudgetContainer = document.getElementById('customBudgetContainer');
              if (customBudgetContainer) {
                if (this.id === 'budgetCustom') {
                  customBudgetContainer.classList.remove('hidden');
                  
                  const customBudgetInput = document.getElementById('customBudget');
                  if (customBudgetInput) {
                    customBudgetInput.focus();
                  }
                } else {
                  customBudgetContainer.classList.add('hidden');
                }
              }
            }
          }
        });
      });
    }
    
    /**
     * Optional Question Toggle
     */
    function initializeOptionalQuestion() {
      const showQuestionButton = document.getElementById('show-question-button');
      const hideQuestionButton = document.getElementById('hide-question-button');
      const optionalQuestionContainer = document.getElementById('optional-question-container');
      
      if (showQuestionButton && hideQuestionButton && optionalQuestionContainer) {
        // Show question when the "Show question" button is clicked
        showQuestionButton.addEventListener('click', function() {
          optionalQuestionContainer.classList.remove('hidden');
          showQuestionButton.classList.add('hidden');
          hideQuestionButton.classList.remove('hidden');
          
          // Focus on the textarea for better UX
          const referralSource = document.getElementById('referralSource');
          if (referralSource) {
            referralSource.focus();
          }
        });
        
        // Hide question when the "Hide question" button is clicked
        hideQuestionButton.addEventListener('click', function() {
          optionalQuestionContainer.classList.add('hidden');
          hideQuestionButton.classList.add('hidden');
          showQuestionButton.classList.remove('hidden');
        });
      }
    }
    
    /**
     * Form Validation and Submission
     */
    function validateStep(stepIndex) {
      if (stepIndex < 0 || stepIndex >= steps.length) {
        return false;
      }
      
      const currentStepElement = steps[stepIndex];
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
          
          // Add error message if it doesn't exist
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
      
      // Validate radio button groups if present
      const radioGroups = new Set();
      currentStepElement.querySelectorAll('input[type="radio"][required]').forEach(radio => {
        radioGroups.add(radio.name);
      });
      
      radioGroups.forEach(groupName => {
        const groupButtons = currentStepElement.querySelectorAll(`input[name="${groupName}"]`);
        const isGroupValid = Array.from(groupButtons).some(r => r.checked);
        
        if (!isGroupValid) {
          isValid = false;
          
          // Add error message if it doesn't exist
          const container = groupButtons[0].closest('div.space-y-4');
          if (container) {
            let errorMessage = container.querySelector('.error-message');
            if (!errorMessage) {
              errorMessage = document.createElement('p');
              errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
              errorMessage.textContent = 'Please select an option';
              container.appendChild(errorMessage);
            }
            
            // Add listener to remove error when user selects an option
            groupButtons.forEach(radio => {
              radio.addEventListener('change', function() {
                const errorMsg = container.querySelector('.error-message');
                if (errorMsg) {
                  errorMsg.remove();
                }
              }, { once: true });
            });
          }
        }
      });
      
      return isValid;
    }
    
    function initializeFormSubmission() {
      if (!form) return;
      
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) return;
        
        // Show loading state
        const submitButton = document.querySelector('button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        const formObject = {};
        
        formData.forEach((value, key) => {
          // Skip editing-view textareas
          if (!key.includes('-editing')) {
            formObject[key] = value;
          }
        });
        
        // Handle custom budget field
        if (formObject.budget === 'custom') {
          formObject.budget = formObject.customBudget || 'Custom (not specified)';
        }
        
        // Format services as a comma-separated list
        const selectedServices = [];
        document.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
          selectedServices.push(checkbox.value);
        });
        formObject.services = selectedServices.join(', ');
        
        // URL validation for project vision
        const visionTextarea = document.getElementById('projectVision');
        if (visionTextarea) {
          visionTextarea.value = validateAndSanitizeUrls(visionTextarea.value);
        }
        
        // Submit data to Netlify function
        try {
          const response = await fetch('/.netlify/functions/submit-form', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
          });
          
          const result = await response.json();
          
          if (response.ok) {
            // Show success message
            form.classList.add('hidden');
            if (successMessage) {
              successMessage.classList.remove('hidden');
            }
          } else {
            // Show error message
            if (errorMessage) {
              errorMessage.classList.remove('hidden');
            }
            console.error('Form submission error:', result);
          }
        } catch (error) {
          // Show error message
          if (errorMessage) {
            errorMessage.classList.remove('hidden');
          }
          console.error('Form submission error:', error);
        } finally {
          // Restore button state
          submitButton.innerHTML = originalText;
          submitButton.disabled = false;
        }
      });
      
      // Try again button functionality
      const tryAgainButton = document.getElementById('try-again-button');
      if (tryAgainButton && errorMessage) {
        tryAgainButton.addEventListener('click', function() {
          errorMessage.classList.add('hidden');
        });
      }
    }
    
    /**
     * URL Validation
     */
    function validateAndSanitizeUrls(text) {
      if (!text) return text;
      
      // Basic URL pattern
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      
      // Find all URLs in the text
      const urls = text.match(urlPattern) || [];
      
      // Check each URL for basic safety
      urls.forEach(url => {
        try {
          // Parse the URL
          const parsedUrl = new URL(url);
          
          // Check for common safe domains
          const safeDomains = ['pinterest.com', 'pinterest.ca', 'behance.net', 'dribbble.com', 'instagram.com'];
          const isSafeDomain = safeDomains.some(domain => parsedUrl.hostname.includes(domain));
          
          if (!isSafeDomain) {
            console.warn('Potentially unsafe URL detected:', url);
            // You could replace with a sanitized version or add a warning
          }
        } catch (e) {
          console.error('Invalid URL:', url, e);
        }
      });
      
      return text;
    }
});