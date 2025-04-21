// This script handles the special textarea functionality
document.addEventListener('DOMContentLoaded', function() {
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
          questionContainer.querySelector('.question-status').classList.remove('hidden');
        } else {
          questionContainer.querySelector('.question-status').classList.add('hidden');
        }
      });
    });
    
    // Initialize questions that might already have answers
    document.querySelectorAll('.textarea-container textarea').forEach(textarea => {
      if (textarea.value.trim()) {
        const questionContainer = textarea.closest('.question-container');
        questionContainer.querySelector('.question-status').classList.remove('hidden');
      }
    });
});

// This script handles the custom checkboxes and conditional behavior
document.addEventListener('DOMContentLoaded', function() {
    // Handle custom checkbox styling and functionality
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const checkboxIcon = this.closest('.checkbox-container').querySelector('.checkbox-icon');
        
        if (this.checked) {
          checkboxIcon.classList.remove('hidden');
        } else {
          checkboxIcon.classList.add('hidden');
        }
        
        // Special handling for the Web Design checkbox
        if (this.id === 'webDesign') {
          const developmentCheckbox = document.getElementById('development');
          const developmentContainer = developmentCheckbox.closest('.checkbox-container');
          const developmentLabel = document.querySelector('label[for="development"]');
          
          if (this.checked) {
            // Enable the Development checkbox
            developmentCheckbox.disabled = false;
            developmentCheckbox.classList.remove('cursor-not-allowed');
            developmentCheckbox.classList.add('cursor-pointer');
            
            // Update the styles
            developmentContainer.classList.remove('border-gray-300');
            developmentContainer.classList.add('border-black');
            developmentLabel.classList.remove('text-gray-400', 'cursor-not-allowed');
            developmentLabel.classList.add('cursor-pointer');
          } else {
            // Disable the Development checkbox
            developmentCheckbox.disabled = true;
            developmentCheckbox.checked = false;
            developmentCheckbox.classList.add('cursor-not-allowed');
            developmentCheckbox.classList.remove('cursor-pointer');
            
            // Update the styles
            developmentContainer.classList.add('border-gray-300');
            developmentContainer.classList.remove('border-black');
            developmentContainer.querySelector('.checkbox-icon').classList.add('hidden');
            developmentLabel.classList.add('text-gray-400', 'cursor-not-allowed');
            developmentLabel.classList.remove('cursor-pointer');
          }
        }
      });
    });
});

// This script handles the radio buttons and custom field functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle custom radio button styling
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', function() {
        // Remove selected state from all radio buttons
        document.querySelectorAll('.radio-selected').forEach(el => {
          el.classList.add('hidden');
        });
        
        // Add selected state to the clicked radio button
        if (this.checked) {
          const radioSelected = this.closest('.radio-container').querySelector('.radio-selected');
          radioSelected.classList.remove('hidden');
          
          // Handle the custom budget field visibility
          const customBudgetContainer = document.getElementById('customBudgetContainer');
          if (this.id === 'budgetCustom') {
            customBudgetContainer.classList.remove('hidden');
            document.getElementById('customBudget').focus();
          } else {
            customBudgetContainer.classList.add('hidden');
          }
        }
      });
    });
    
    // URL validation function for the vision textarea
    function validateAndSanitizeUrls(text) {
      // Basic URL pattern
      const urlPattern = /(https?:\/\/[^\s]+)/g;
      
      // Find all URLs in the text
      const urls = text.match(urlPattern) || [];
      
      // Check each URL for basic safety (you can add more sophisticated checks)
      urls.forEach(url => {
        try {
          // Parse the URL
          const parsedUrl = new URL(url);
          
          // Check for common safe domains (this is just a basic example)
          const safeDomains = ['pinterest.com', 'pinterest.ca', 'behance.net', 'dribbble.com', 'instagram.com'];
          const isSafeDomain = safeDomains.some(domain => parsedUrl.hostname.includes(domain));
          
          // You could add more checks here...
          
          if (!isSafeDomain) {
            console.warn('Potentially unsafe URL detected:', url);
            // Here you could take action like highlighting the URL or showing a warning
          }
        } catch (e) {
          console.error('Invalid URL:', url, e);
        }
      });
      
      return text;
    }
    
    // Add URL validation to the vision textarea
    document.getElementById('projectVision').addEventListener('blur', function() {
      this.value = validateAndSanitizeUrls(this.value);
    });
    
    document.getElementById('projectVision-editing').addEventListener('blur', function() {
      this.value = validateAndSanitizeUrls(this.value);
    });
});

// Handle showing/hiding the optional question
document.addEventListener('DOMContentLoaded', function() {
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
        document.getElementById('referralSource').focus();
      });
      
      // Hide question when the "Hide question" button is clicked
      hideQuestionButton.addEventListener('click', function() {
        optionalQuestionContainer.classList.add('hidden');
        hideQuestionButton.classList.add('hidden');
        showQuestionButton.classList.remove('hidden');
      });
    }
});