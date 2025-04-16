// Form navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inquiry-form');
    const steps = document.querySelectorAll('.step');
    const progressBar = document.getElementById('progress-bar');
    const currentStepElement = document.getElementById('current-step');
    const progressPercentElement = document.getElementById('progress-percent');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    // Initialize the form
    updateFormState();
    
    // Handle "Next" button clicks
    document.querySelectorAll('.next-button').forEach(button => {
      button.addEventListener('click', function() {
        // Validate current step before proceeding
        if (validateStep(currentStep)) {
          currentStep++;
          updateFormState();
        }
      });
    });
    
    // Handle "Previous" button clicks
    document.querySelectorAll('.prev-button').forEach(button => {
      button.addEventListener('click', function() {
        currentStep--;
        updateFormState();
      });
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!validateStep(currentStep)) return;
      
      // Collect form data
      const formData = new FormData(form);
      const formObject = {};
      
      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      
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
          successMessage.classList.remove('hidden');
        } else {
          // Show error message
          errorMessage.classList.remove('hidden');
          console.error('Form submission error:', result);
        }
      } catch (error) {
        // Show error message
        errorMessage.classList.remove('hidden');
        console.error('Form submission error:', error);
      }
    });
    
    // Update the form display based on current step
    function updateFormState() {
      // Update step visibility
      steps.forEach((step, index) => {
        if (index === currentStep) {
          step.classList.remove('hidden');
        } else {
          step.classList.add('hidden');
        }
      });
      
      // Update progress indicators
      const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
      progressBar.style.width = `${progressPercentage}%`;
      currentStepElement.textContent = currentStep + 1;
      progressPercentElement.textContent = `${Math.round(progressPercentage)}%`;
    }
    
    // Validate the current step
    function validateStep(stepIndex) {
      const currentStepElement = steps[stepIndex];
      const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
      
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
          
          // Add event listener to remove error styling when user inputs valid data
          input.addEventListener('input', function() {
            if (this.value.trim()) {
              this.classList.remove('border-red-500');
            }
          }, { once: true });
        }
      });
      
      return isValid;
    }
});