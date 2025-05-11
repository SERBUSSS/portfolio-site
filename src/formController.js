// formController.js
const FormController = {
    // State
    currentStep: 0,
    formData: {},
    
    // Initialize the form controller
    init() {
      this.cacheElements();
      this.bindEvents();
      this.validateCurrentStep();
    },
    
    // Cache DOM elements
    cacheElements() {
      this.openFormBtn = document.getElementById('open-form-btn');
      this.formOverlay = document.getElementById('form-overlay');
      this.formContainer = document.getElementById('form-container');
      this.form = document.getElementById('multi-step-form');
      this.steps = Array.from(document.querySelectorAll('.step'));
      this.closeButtons = document.querySelectorAll('.close-button');
      this.prevButtons = document.querySelectorAll('.prev-button');
      this.nextButtons = document.querySelectorAll('.next-button');
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
    },
    
    // Open form
    openForm() {
      // Show form and overlay
      this.formOverlay.classList.remove('hidden');
      this.formContainer.classList.remove('hidden');
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Reset to first step
      this.currentStep = 0;
      this.showStep(0);
      this.validateCurrentStep();
    },
    
    // Close form
    closeForm() {
      // Hide form and overlay
      this.formOverlay.classList.add('hidden');
      this.formContainer.classList.add('hidden');
      
      // Re-enable background scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      
      // Reset form
      this.form.reset();
      this.currentStep = 0;
      this.showStep(0);
    },
    
    // Show specific step
    showStep(stepIndex) {
      this.steps.forEach((step, index) => {
        if (index === stepIndex) {
          step.classList.remove('hidden');
        } else {
          step.classList.add('hidden');
        }
      });
      
      // Update progress indicators
      this.updateProgressIndicators();
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
          // Show success message
          this.showSuccessMessage();
        } else {
          // Show error message
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
    
    // Show success message
    showSuccessMessage() {
      this.steps.forEach(step => step.classList.add('hidden'));
      document.getElementById('success-message').classList.remove('hidden');
    },
    
    // Show error message
    showErrorMessage() {
      document.getElementById('error-message').classList.remove('hidden');
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
            developmentCheckbox.disabled = true;
            developmentCheckbox.checked = false;
            developmentLabel.classList.add('text-gray-400', 'cursor-not-allowed');
            developmentLabel.classList.remove('cursor-pointer');
            developmentContainer.classList.add('border-gray-300');
            developmentContainer.classList.remove('border-black');
          }
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