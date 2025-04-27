// formCardSystem.js - Main form functionality and animations for multi-step form cards
document.addEventListener('DOMContentLoaded', function() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
      console.warn('GSAP not found. Animations will be disabled.');
      return;
  }
  
  // Register GSAP plugins if needed
  if (gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
  }
  
  // Form elements
  const formContainer = document.querySelector('#c-form .bg-white');
  const formBackground = document.getElementById('background-form');
  const form = document.getElementById('inquiry-form');
  const steps = document.querySelectorAll('#inquiry-form .step');
  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');
  
  // State management
  let currentStep = 0;
  const totalSteps = steps.length;
  let isFormVisible = false;
  
  // Initialize the form system
  initializeForm();
  
  /**
   * Main Form Initialization
   */
  function initializeForm() {
      // Set up initial card states
      setupCardStates();
      
      // Initialize form backgrounds
      setupFormBackground();
      
      // Initialize special interactions for textareas
      initializeTextareas();
      
      // Initialize checkbox functionality
      initializeCheckboxes();
      
      // Initialize radio button functionality
      initializeRadioButtons();
      
      // Initialize optional question toggle
      initializeOptionalQuestion();
      
      // Initialize navigation buttons
      initializeNavigation();
      
      // Initialize form submission
      initializeFormSubmission();
      
      // Set up trigger buttons across the site
      setupTriggerButtons();
  }
  
  /**
   * Set up initial card animation states
   */
  function setupCardStates() {
      // Initially hide all cards except the first one
      steps.forEach((step, index) => {
          if (index === 0) {
              gsap.set(step, { 
                  opacity: 0,
                  x: '100%',
                  scale: 1,
                  rotation: 0
              });
          } else {
              gsap.set(step, { 
                  opacity: 0,
                  x: '100%',
                  scale: 1,
                  rotation: 0,
                  display: 'none'
              });
          }
      });
      
      // Also set up success and error messages
      if (successMessage) {
          gsap.set(successMessage, { opacity: 0, display: 'none' });
      }
      if (errorMessage) {
          gsap.set(errorMessage, { opacity: 0, display: 'none' });
      }
  }
  
  /**
   * Set up form background and overlay
   */
  function setupFormBackground() {
      if (formBackground) {
          gsap.set(formBackground, {
              opacity: 0.8,
              filter: 'blur(0px)'
          });
      }
      
      // Set up form container
      if (formContainer) {
          gsap.set(formContainer, {
              opacity: 0,
              scale: 0.9,
              display: 'none'
          });
      }
  }
  
  /**
   * Initialize textarea interactions for expanded editing view
   */
  function initializeTextareas() {
      // When a textarea is clicked/focused
      document.querySelectorAll('.textarea-container textarea').forEach(textarea => {
          textarea.addEventListener('focus', function() {
              // Get parent question container
              const questionContainer = this.closest('.question-container');
              if (!questionContainer) return;
              
              // Hide the regular textarea view
              questionContainer.querySelector('.textarea-container').classList.add('hidden');
              
              // Show the editing view
              const editingView = questionContainer.querySelector('.editing-view');
              if (editingView) {
                  editingView.classList.remove('hidden');
                  
                  // Set the value in the editing textarea to match the main textarea
                  const editingTextarea = editingView.querySelector('textarea');
                  if (editingTextarea) {
                      editingTextarea.value = this.value;
                      
                      // Focus the editing textarea
                      editingTextarea.focus();
                  }
              }
          });
      });
      
      // Handle "Mark as done" button clicks
      document.querySelectorAll('.mark-as-done').forEach(button => {
          button.addEventListener('click', function() {
              // Get parent question container
              const questionContainer = this.closest('.question-container');
              if (!questionContainer) return;
              
              // Get the editing textarea and its value
              const editingTextarea = questionContainer.querySelector('.editing-view textarea');
              if (!editingTextarea) return;
              
              const textValue = editingTextarea.value.trim();
              
              // Get the main textarea
              const mainTextarea = questionContainer.querySelector('.textarea-container textarea');
              if (!mainTextarea) return;
              
              // Update the main textarea value
              mainTextarea.value = textValue;
              
              // Show/hide appropriate elements
              questionContainer.querySelector('.editing-view').classList.add('hidden');
              questionContainer.querySelector('.textarea-container').classList.remove('hidden');
              
              // Show "Question answered!" if there's content
              const statusElement = questionContainer.querySelector('.question-status');
              if (statusElement) {
                  if (textValue) {
                      statusElement.classList.remove('hidden');
                  } else {
                      statusElement.classList.add('hidden');
                  }
              }
          });
      });
      
      // Initialize questions that might already have answers
      document.querySelectorAll('.textarea-container textarea').forEach(textarea => {
          if (textarea.value.trim()) {
              const questionContainer = textarea.closest('.question-container');
              if (!questionContainer) return;
              
              const statusElement = questionContainer.querySelector('.question-status');
              if (statusElement) {
                  statusElement.classList.remove('hidden');
              }
          }
      });
  }
  
  /**
   * Initialize checkbox functionality including dependencies
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
   * Initialize radio button functionality
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
   * Initialize optional question toggle on final step
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
   * Handle navigation between form steps
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
                  animateFormClose();
              }
          });
      });
  }
  
  /**
   * Set up the form opening trigger buttons across the site
   */
  function setupTriggerButtons() {
      // Set up trigger buttons (buttons that open the form)
      document.querySelectorAll('a[href="#process"], button[data-open-form]').forEach(button => {
          button.addEventListener('click', function(e) {
              // Prevent default anchor behavior
              e.preventDefault();
              
              // Show form
              showForm();
          });
      });
  }
  
  /**
   * Animate and show the form
   */
  function showForm() {
      if (isFormVisible) return;
      isFormVisible = true;
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      
      // Make form container visible
      formContainer.style.display = 'block';
      
      // Animate the background
      gsap.to(formBackground, {
          opacity: 0.8,
          filter: 'blur(5px)',
          duration: 0.5
      });
      
      // Animate the form container
      gsap.to(formContainer, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power1.out'
      });
      
      // Reset to first step if needed
      currentStep = 0;
      updateProgressIndicators();
      
      // Animate the first card coming in from the right
      steps[0].style.display = 'block';
      gsap.fromTo(steps[0], 
          { opacity: 0, x: '100%', scale: 1, rotation: 0 },
          { opacity: 1, x: '0%', scale: 1, rotation: 0, duration: 0.5, ease: 'power2.out' }
      );
  }
  
  /**
   * Animate and close the form
   */
  function animateFormClose() {
      if (!isFormVisible) return;
      isFormVisible = false;
      
      // Allow background scrolling again
      document.body.style.overflow = '';
      
      // Animate the current step out to the left
      gsap.to(steps[currentStep], {
          x: '-100%',
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in'
      });
      
      // Animate the container and background
      gsap.to(formContainer, {
          opacity: 0,
          scale: 0.9,
          duration: 0.5,
          onComplete: function() {
              // Reset form state
              form.reset();
              formContainer.style.display = 'none';
              
              // Reset all steps to initial state
              steps.forEach((step, index) => {
                  if (index === 0) {
                      gsap.set(step, { 
                          opacity: 0,
                          x: '100%',
                          scale: 1,
                          rotation: 0
                      });
                  } else {
                      step.style.display = 'none';
                      gsap.set(step, { 
                          opacity: 0,
                          x: '100%',
                          scale: 1,
                          rotation: 0
                      });
                  }
              });
              
              // Reset textareas
              document.querySelectorAll('.question-status').forEach(status => {
                  status.classList.add('hidden');
              });
              
              // Reset all editing views
              document.querySelectorAll('.editing-view').forEach(view => {
                  view.classList.add('hidden');
              });
              
              document.querySelectorAll('.textarea-container').forEach(container => {
                  container.classList.remove('hidden');
              });
              
              // Reset checkboxes
              document.querySelectorAll('.checkbox-icon').forEach(icon => {
                  icon.classList.add('hidden');
              });
              
              // Reset radio buttons
              document.querySelectorAll('.radio-selected').forEach(indicator => {
                  indicator.classList.add('hidden');
              });
              
              // Reset form progress
              currentStep = 0;
              updateProgressIndicators();
              
              // Hide any error/success messages
              if (successMessage) {
                  successMessage.classList.add('hidden');
              }
              if (errorMessage) {
                  errorMessage.classList.add('hidden');
              }
          }
      });
      
      // Animate the background
      gsap.to(formBackground, {
          filter: 'blur(0px)',
          duration: 0.5
      });
  }
  
  /**
   * Animate to next step
   */
  function animateToNextStep() {
      if (currentStep >= steps.length - 1) return;
      
      const currentStepElement = steps[currentStep];
      const nextStepElement = steps[currentStep + 1];
      
      // Make next step visible before animation
      nextStepElement.style.display = 'block';
      
      // Create random slight rotation for card "resting" position
      const randomRotation = (Math.random() * 10 - 5); // Random between -5 and 5 degrees
      
      // Animate current step out (scaling down and rotating slightly)
      gsap.to(currentStepElement, {
          scale: 0.8,
          rotation: randomRotation,
          opacity: 0.7,
          y: '30vh', // Move down
          duration: 0.5,
          ease: 'power2.in'
      });
      
      // Animate next step in from the right
      gsap.fromTo(nextStepElement, 
          { opacity: 0, x: '100%', scale: 1, rotation: 0 },
          { 
              opacity: 1, 
              x: '0%', 
              scale: 1, 
              rotation: 0, 
              duration: 0.5, 
              ease: 'power2.out',
              onComplete: function() {
                  // Update current step after animation
                  currentStep++;
                  updateProgressIndicators();
              }
          }
      );
  }
  
  /**
   * Animate to previous step
   */
  function animateToPreviousStep() {
      if (currentStep <= 0) return;
      
      const currentStepElement = steps[currentStep];
      const prevStepElement = steps[currentStep - 1];
      
      // Animate current step off to the right
      gsap.to(currentStepElement, {
          x: '100%',
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: function() {
              currentStepElement.style.display = 'none';
              gsap.set(currentStepElement, { x: '100%' });
          }
      });
      
      // Make previous step visible 
      prevStepElement.style.display = 'block';
      
      // Animate previous step from "resting" position to active
      gsap.to(prevStepElement, {
          scale: 1,
          rotation: 0,
          opacity: 1,
          y: '0',
          x: '0%',
          duration: 0.5,
          ease: 'power2.out',
          onComplete: function() {
              // Update current step after animation
              currentStep--;
              updateProgressIndicators();
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
   * Validate the current step
   * @param {number} stepIndex - Index of the step to validate
   * @returns {boolean} - Whether the step is valid
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
  
  /**
   * Initialize form submission
   */
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
                  animateSuccessState();
              } else {
                  // Show error message
                  animateErrorState();
                  console.error('Form submission error:', result);
              }
          } catch (error) {
              // Show error message
              animateErrorState();
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
              gsap.set(errorMessage, { opacity: 0 });
          });
      }
  }
  
  /**
   * Animate success state
   */
  function animateSuccessState() {
      if (!successMessage || !formContainer) return;
      
      // Get the visible step
      const visibleStep = steps[currentStep];
      if (!visibleStep) return;
      
      // Hide form
      gsap.to(visibleStep, {
          opacity: 0,
          y: -30,
          scale: 0.95,
          duration: 0.4,
          onComplete: function() {
              // Hide the form
              form.classList.add('hidden');
              visibleStep.classList.add('hidden');
              
              // Show success message
              successMessage.classList.remove('hidden');
              
              // Animate success message in
              gsap.fromTo(successMessage,
                  { opacity: 0, y: 30, scale: 0.95 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
              );
          }
      });
  }
  
  /**
   * Animate error state
   */
  function animateErrorState() {
      if (!errorMessage) return;
      
      // Show and animate error message
      errorMessage.classList.remove('hidden');
      
      // Set initial state for error message
      gsap.set(errorMessage, {
          opacity: 0,
          y: 20
      });
      
      // Animate in
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
   * URL validation helper
   * @param {string} text - Text to validate
   * @returns {string} - Sanitized text
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