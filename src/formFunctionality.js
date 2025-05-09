/**
 * Form Functionality Module
 * Handles special form interactions and submission
 */
const FormModule = (function() {
  // State
  let socialFieldCount = 1;
  const MAX_SOCIAL_FIELDS = 5;
  let isInitialized = false;
  
  /**
   * Initialize the module
   */
    function init() {
        if (isInitialized) return;
        
        console.log('Initializing FormModule with enhanced field implementations...');
        
        // Fix textarea initial states
        fixTextareaInitialStates();
        
        // Initialize special field interactions
        initializeSpecialFields();
        
        // Setup form submission
        setupFormSubmission();
        
        // Mark as initialized
        isInitialized = true;
    }

    /**
     * Fix textarea initial states to prevent auto-focus and overflow
     */
    function fixTextareaInitialStates() {
        // Find all textareas in the form
        const textareas = document.querySelectorAll('.textarea-container textarea');
        const editingViews = document.querySelectorAll('.editing-view');
        
        // Reset all textareas to collapsed state
        textareas.forEach(textarea => {
            // Remove any focus
            textarea.blur();
            
            // Reset height
            textarea.style.height = 'auto';
            
            // Clear any existing event listeners by cloning
            const newTextarea = textarea.cloneNode(true);
            textarea.parentNode.replaceChild(newTextarea, textarea);
        });
        
        // Make sure all editing views are hidden initially
        editingViews.forEach(view => {
            view.classList.add('hidden');
        });
        
        // Make sure mark-as-done buttons work
        const markAsDoneButtons = document.querySelectorAll('.mark-as-done');
        markAsDoneButtons.forEach(button => {
            // Clear any existing event listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add fixed event listener
            newButton.addEventListener('click', function() {
                const container = this.closest('.question-container');
                if (!container) return;
                
                // Get text from editing view
                const editingTextarea = container.querySelector('.editing-view textarea');
                if (!editingTextarea) return;
                
                const textValue = editingTextarea.value.trim();
                
                // Update main textarea
                const mainTextarea = container.querySelector('.textarea-container textarea');
                if (mainTextarea) {
                    mainTextarea.value = textValue;
                    
                    // Trigger input event for validation
                    mainTextarea.dispatchEvent(new Event('input'));
                }
                
                // Toggle views
                container.querySelector('.editing-view').classList.add('hidden');
                container.querySelector('.textarea-container').classList.remove('hidden');
                
                // Update completion status
                const statusElement = container.querySelector('.question-status');
                if (statusElement) {
                    if (textValue) {
                        statusElement.classList.remove('hidden');
                    } else {
                        statusElement.classList.add('hidden');
                    }
                }
            });
        });
        
        // Enhance textarea focus handling
        document.querySelectorAll('.textarea-container textarea').forEach(textarea => {
            textarea.addEventListener('focus', function(event) {
                expandTextarea(this);
                
                // Prevent event propagation
                event.stopPropagation();
            });
        });
    }

  
  /**
   * Initialize special field interactions
   */
  function initializeSpecialFields() {
      // Setup text area expanded editing state
      initializeExpandableTextareas();
      
      // Setup social media fields
      initializeSocialMediaFields();
      
      // Setup checkbox dependencies
      initializeCheckboxDependencies();
      
      // Setup radio button dependencies
      initializeRadioDependencies();
      
      // Setup optional question toggle
      initializeOptionalQuestion();
  }
  
  /**
   * Enhanced implementation for expandable text areas
   */
  function initializeExpandableTextareas() {
      // Focus event to expand textarea
      document.querySelectorAll('.textarea-container textarea').forEach(textarea => {
          textarea.addEventListener('focus', function() {
              expandTextarea(this);
          });
          
          // Also handle touch events for mobile
          textarea.addEventListener('touchstart', function(e) {
              // Prevent default only if necessary
              if (window.innerWidth < 768) { // mobile viewport
                  e.preventDefault();
              }
              expandTextarea(this);
          });
          
          // Check if textarea has content and show completion status
          if (textarea.value.trim() !== '') {
              const container = textarea.closest('.question-container');
              if (container) {
                  const statusElement = container.querySelector('.question-status');
                  if (statusElement) {
                      statusElement.classList.remove('hidden');
                  }
              }
          }
      });
      
      // Mark as done button to collapse textarea
      document.querySelectorAll('.mark-as-done').forEach(button => {
          button.addEventListener('click', function() {
              collapseTextarea(this);
          });
      });
      
      /**
       * Expand textarea for editing
       * @param {Element} textarea - The textarea element
       */
      function expandTextarea(textarea) {
        const container = textarea.closest('.question-container');
        if (!container) return;
        
        // Hide compact view
        const textareaContainer = container.querySelector('.textarea-container');
        if (textareaContainer) {
            textareaContainer.classList.add('hidden');
        }
        
        // Show expanded editing view
        const editingView = container.querySelector('.editing-view');
        if (editingView) {
            editingView.classList.remove('hidden');
            
            // Set max height to prevent overflow
            editingView.style.maxHeight = '50vh';
            
            // Copy value to editing textarea
            const editingTextarea = editingView.querySelector('textarea');
            if (editingTextarea) {
                editingTextarea.value = textarea.value;
                
                // Set maximum height for textarea
                editingTextarea.style.maxHeight = '40vh';
                
                // Auto-resize textarea to fit content, but respect max height
                const scrollHeight = editingTextarea.scrollHeight;
                const maxHeight = window.innerHeight * 0.4; // 40% of viewport height
                editingTextarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
                
                // Add scrolling if content exceeds height
                if (scrollHeight > maxHeight) {
                    editingTextarea.style.overflowY = 'auto';
                }
                
                // Focus with slight delay for animation
                setTimeout(() => {
                    editingTextarea.focus();
                }, 50);
                
                // Add auto-resize on input
                editingTextarea.addEventListener('input', function() {
                    // Reset height to calculate proper scrollHeight
                    this.style.height = 'auto';
                    
                    // Calculate new height (with max-height limit)
                    const newScrollHeight = this.scrollHeight;
                    const newMaxHeight = window.innerHeight * 0.4;
                    this.style.height = Math.min(newScrollHeight, newMaxHeight) + 'px';
                    
                    // Add scrollbar if content exceeds max height
                    this.style.overflowY = newScrollHeight > newMaxHeight ? 'auto' : 'hidden';
                });
            }
        }
      }
      
      /**
       * Collapse textarea after editing
       * @param {Element} button - The "Mark as done" button
       */
      function collapseTextarea(button) {
          const container = button.closest('.question-container');
          if (!container) return;
          
          // Get text from editing view
          const editingTextarea = container.querySelector('.editing-view textarea');
          if (!editingTextarea) return;
          
          const textValue = editingTextarea.value.trim();
          
          // Update main textarea
          const mainTextarea = container.querySelector('.textarea-container textarea');
          if (mainTextarea) {
              mainTextarea.value = textValue;
              
              // Trigger input event for validation
              mainTextarea.dispatchEvent(new Event('input'));
          }
          
          // Toggle views
          container.querySelector('.editing-view').classList.add('hidden');
          container.querySelector('.textarea-container').classList.remove('hidden');
          
          // Update completion status
          const statusElement = container.querySelector('.question-status');
          if (statusElement) {
              if (textValue) {
                  statusElement.classList.remove('hidden');
                  
                  // Animate status appearance
                  if (typeof gsap !== 'undefined') {
                      gsap.fromTo(statusElement,
                          { opacity: 0, y: -10 },
                          { opacity: 1, y: 0, duration: 0.3 }
                      );
                  }
              } else {
                  statusElement.classList.add('hidden');
              }
          }
      }
      
      /**
       * Auto-resize textarea to fit content
       * @param {Element} textarea - The textarea to resize
       */
      function autoResizeTextarea(textarea) {
          // Reset height to calculate proper scrollHeight
          textarea.style.height = 'auto';
          
          // Calculate new height (with a max-height limit if needed)
          const maxHeight = window.innerHeight * 0.6; // 60% of viewport height
          const newHeight = Math.min(textarea.scrollHeight, maxHeight);
          
          // Set new height
          textarea.style.height = newHeight + 'px';
          
          // Add scrollbar if content exceeds max height
          textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
      }
  }
  
  /**
   * Enhanced implementation for social media fields
   */
  function initializeSocialMediaFields() {
      // Add more social media fields button
      const addButton = document.querySelector('.add-social-button');
      if (addButton) {
          addButton.addEventListener('click', function() {
              addSocialMediaField();
          });
      }
      
      /**
       * Add a new social media field
       */
      function addSocialMediaField() {
          if (socialFieldCount >= MAX_SOCIAL_FIELDS) {
              // Show max fields message
              const maxMsg = document.getElementById('max-social-fields-message');
              if (maxMsg) {
                  maxMsg.classList.remove('hidden');
                  
                  // Highlight the message
                  if (typeof gsap !== 'undefined') {
                      gsap.fromTo(maxMsg,
                          { backgroundColor: 'rgba(251, 191, 36, 0.2)' },
                          { 
                              backgroundColor: 'rgba(251, 191, 36, 0)',
                              duration: 2,
                              ease: 'power2.out'
                          }
                      );
                  }
                  
                  // Hide message after 3 seconds
                  setTimeout(() => {
                      maxMsg.classList.add('hidden');
                  }, 3000);
              }
              return;
          }
          
          // Get container
          const container = document.querySelector('.social-media-fields');
          if (!container) return;
          
          // Create new field
          const newField = document.createElement('div');
          newField.className = 'social-media-field mt-3';
          newField.innerHTML = `
              <div class="flex rounded-xl border border-gray-300 overflow-hidden">
                  <div class="bg-gray-100 flex items-center px-4 py-3 border-r border-gray-300">
                      <select name="social-media-type-${socialFieldCount}" class="bg-gray-100 border-none focus:ring-0">
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="website">Website</option>
                      </select>
                  </div>
                  <input 
                      type="text" 
                      name="social-media-profile-${socialFieldCount}" 
                      class="flex-grow px-4 py-3 bg-white" 
                      placeholder="e.g. @username or website URL"
                  >
                  <button type="button" class="remove-social px-3 bg-gray-100 border-l border-gray-300 text-gray-500 hover:text-red-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                  </button>
              </div>
          `;
          
          // Add remove button functionality
          const removeButton = newField.querySelector('.remove-social');
          if (removeButton) {
              removeButton.addEventListener('click', function() {
                  removeSocialMediaField(newField);
              });
          }
          
          // Add to container with animation
          container.appendChild(newField);
          
          // Animate field appearance
          if (typeof gsap !== 'undefined') {
              gsap.fromTo(newField,
                  { height: 0, opacity: 0, marginTop: 0 },
                  { height: 'auto', opacity: 1, marginTop: 12, duration: 0.3, ease: 'power2.out' }
              );
          }
          
          // Increment counter
          socialFieldCount++;
          
          // Hide add button if max reached
          if (socialFieldCount >= MAX_SOCIAL_FIELDS) {
              addButton.classList.add('hidden');
          }
          
          // Focus the new input field
          setTimeout(() => {
              const newInput = newField.querySelector('input');
              if (newInput) {
                  newInput.focus();
              }
          }, 50);
      }
      
      /**
       * Remove a social media field
       * @param {Element} field - The field to remove
       */
      function removeSocialMediaField(field) {
          // Animate removal
          if (typeof gsap !== 'undefined') {
              gsap.to(field, {
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                  duration: 0.3,
                  ease: 'power2.in',
                  onComplete: () => {
                      field.remove();
                      socialFieldCount--;
                      
                      // Show add button if it was hidden
                      if (socialFieldCount < MAX_SOCIAL_FIELDS) {
                          addButton.classList.remove('hidden');
                      }
                  }
              });
          } else {
              // Fallback without animation
              field.remove();
              socialFieldCount--;
              
              // Show add button if it was hidden
              if (socialFieldCount < MAX_SOCIAL_FIELDS) {
                  addButton.classList.remove('hidden');
              }
          }
      }
  }
  
  /**
   * Enhanced implementation for checkbox dependencies
   */
  function initializeCheckboxDependencies() {
      // Web Design -> Development dependency
      const webDesignCheckbox = document.getElementById('webDesign');
      const developmentCheckbox = document.getElementById('development');
      
      if (webDesignCheckbox && developmentCheckbox) {
          webDesignCheckbox.addEventListener('change', function() {
              updateDevelopmentCheckboxState(this.checked);
          });
          
          // Initial state
          if (webDesignCheckbox.checked) {
              updateDevelopmentCheckboxState(true);
          }
      }
      
      // Initialize all checkboxes for visual feedback
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
          checkbox.addEventListener('change', function() {
              updateCheckboxVisualState(this);
          });
          
          // Initial state
          if (checkbox.checked) {
              updateCheckboxVisualState(checkbox);
          }
      });
      
      /**
       * Update the development checkbox state
       * @param {boolean} enabled - Whether to enable the development checkbox
       */
      function updateDevelopmentCheckboxState(enabled) {
          const container = developmentCheckbox.closest('.checkbox-container');
          const label = document.querySelector('label[for="development"]');
          
          if (enabled) {
              // Enable development checkbox
              developmentCheckbox.disabled = false;
              developmentCheckbox.classList.remove('cursor-not-allowed');
              developmentCheckbox.classList.add('cursor-pointer');
              
              // Update styles
              if (container) {
                  // Animate border color change
                  if (typeof gsap !== 'undefined') {
                      gsap.to(container, {
                          borderColor: '#000000',
                          duration: 0.3
                      });
                  } else {
                      container.style.borderColor = '#000000';
                  }
                  
                  container.classList.remove('border-gray-300');
                  container.classList.add('border-black');
              }
              
              if (label) {
                  // Animate text color change
                  if (typeof gsap !== 'undefined') {
                      gsap.to(label, {
                          color: '#000000',
                          duration: 0.3
                      });
                  } else {
                      label.style.color = '#000000';
                  }
                  
                  label.classList.remove('text-gray-400', 'cursor-not-allowed');
                  label.classList.add('cursor-pointer');
              }
              
              // Add tooltip to explain dependency
              const tooltip = document.createElement('div');
              tooltip.className = 'text-xs text-green-600 mt-1 development-tooltip';
              tooltip.textContent = 'Available with Web Design';
              
              // Only add if it doesn't exist yet
              if (!container.parentNode.querySelector('.development-tooltip')) {
                  container.parentNode.appendChild(tooltip);
                  
                  // Animate tooltip
                  if (typeof gsap !== 'undefined') {
                      gsap.from(tooltip, {
                          opacity: 0,
                          y: -5,
                          duration: 0.3
                      });
                  }
              }
          } else {
              // Disable development checkbox
              developmentCheckbox.disabled = true;
              developmentCheckbox.checked = false;
              developmentCheckbox.classList.add('cursor-not-allowed');
              developmentCheckbox.classList.remove('cursor-pointer');
              
              // Update styles
              if (container) {
                  // Animate border color change
                  if (typeof gsap !== 'undefined') {
                      gsap.to(container, {
                          borderColor: 'rgb(209, 213, 219)',
                          duration: 0.3
                      });
                  } else {
                      container.style.borderColor = 'rgb(209, 213, 219)';
                  }
                  
                  container.classList.add('border-gray-300');
                  container.classList.remove('border-black');
                  
                  // Hide checkbox icon
                  const icon = container.querySelector('.checkbox-icon');
                  if (icon && !icon.classList.contains('hidden')) {
                      // Animate icon disappearance
                      if (typeof gsap !== 'undefined') {
                          gsap.to(icon, {
                              scale: 0,
                              opacity: 0,
                              duration: 0.2,
                              onComplete: () => {
                                  icon.classList.add('hidden');
                                  gsap.set(icon, { scale: 1, opacity: 1 });
                              }
                          });
                      } else {
                          icon.classList.add('hidden');
                      }
                  }
              }
              
              if (label) {
                  // Animate text color change
                  if (typeof gsap !== 'undefined') {
                      gsap.to(label, {
                          color: 'rgb(156, 163, 175)',
                          duration: 0.3
                      });
                  } else {
                      label.style.color = 'rgb(156, 163, 175)';
                  }
                  
                  label.classList.add('text-gray-400', 'cursor-not-allowed');
                  label.classList.remove('cursor-pointer');
              }
              
              // Remove tooltip
              const tooltip = container.parentNode.querySelector('.development-tooltip');
              if (tooltip) {
                  // Animate tooltip removal
                  if (typeof gsap !== 'undefined') {
                      gsap.to(tooltip, {
                          opacity: 0,
                          y: -5,
                          duration: 0.3,
                          onComplete: () => {
                              tooltip.remove();
                          }
                      });
                  } else {
                      tooltip.remove();
                  }
              }
          }
      }
      
      /**
       * Update checkbox visual state
       * @param {Element} checkbox - The checkbox element
       */
      function updateCheckboxVisualState(checkbox) {
          const container = checkbox.closest('.checkbox-container');
          if (!container) return;
          
          const icon = container.querySelector('.checkbox-icon');
          if (!icon) return;
          
          if (checkbox.checked) {
              icon.classList.remove('hidden');
              
              // Animate icon appearance
              if (typeof gsap !== 'undefined') {
                  gsap.fromTo(icon,
                      { scale: 0.5, opacity: 0 },
                      { scale: 1, opacity: 1, duration: 0.2, ease: 'back.out(1.5)' }
                  );
              }
              
              // Pulse the border
              if (typeof gsap !== 'undefined') {
                  gsap.fromTo(container,
                      { boxShadow: '0 0 0 0px rgba(0,0,0,0.1)' },
                      { 
                          boxShadow: '0 0 0 3px rgba(0,0,0,0)',
                          duration: 0.5,
                          ease: 'power2.out'
                      }
                  );
              }
          } else {
              // Animate icon disappearance
              if (typeof gsap !== 'undefined' && !icon.classList.contains('hidden')) {
                  gsap.to(icon, {
                      scale: 0.5,
                      opacity: 0,
                      duration: 0.2,
                      onComplete: () => {
                          icon.classList.add('hidden');
                          gsap.set(icon, { scale: 1, opacity: 1 });
                      }
                  });
              } else {
                  icon.classList.add('hidden');
              }
          }
      }
  }
  
  /**
   * Enhanced implementation for radio button dependencies
   */
  function initializeRadioDependencies() {
      // Handle radio button selection indicators
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
          radio.addEventListener('change', function() {
              // Update visual state for all radios in the same group
              updateRadioGroupVisualState(this.name);
              
              // Handle specific dependencies
              if (this.name === 'budget') {
                  handleBudgetDependency(this.id);
              }
          });
          
          // Initial state
          if (radio.checked) {
              // Trigger change event to update visual state
              radio.dispatchEvent(new Event('change'));
          }
      });
      
      /**
       * Update visual state for a radio button group
       * @param {string} groupName - The name of the radio group
       */
      function updateRadioGroupVisualState(groupName) {
          const radios = document.querySelectorAll(`input[name="${groupName}"]`);
          
          radios.forEach(radio => {
              const container = radio.closest('.radio-container');
              if (!container) return;
              
              const indicator = container.querySelector('.radio-selected');
              if (!indicator) return;
              
              if (radio.checked && indicator.classList.contains('hidden')) {
                  // Show indicator with animation
                  indicator.classList.remove('hidden');
                  
                  if (typeof gsap !== 'undefined') {
                      gsap.fromTo(indicator,
                          { scale: 0, opacity: 0 },
                          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
                      );
                      
                      // Pulse the radio border
                      gsap.fromTo(container,
                          { boxShadow: '0 0 0 0px rgba(0,0,0,0.1)' },
                          { 
                              boxShadow: '0 0 0 3px rgba(0,0,0,0)',
                              duration: 0.5,
                              ease: 'power2.out'
                          }
                      );
                  }
              } else if (!radio.checked && !indicator.classList.contains('hidden')) {
                  // Hide indicator with animation
                  if (typeof gsap !== 'undefined') {
                      gsap.to(indicator, {
                          scale: 0,
                          opacity: 0,
                          duration: 0.2,
                          onComplete: () => {
                              indicator.classList.add('hidden');
                              gsap.set(indicator, { scale: 1, opacity: 1 });
                          }
                      });
                  } else {
                      indicator.classList.add('hidden');
                  }
              }
          });
      }
      
      /**
       * Handle budget option dependency
       * @param {string} radioId - The ID of the selected radio button
       */
      function handleBudgetDependency(radioId) {
          const customBudgetContainer = document.getElementById('customBudgetContainer');
          if (!customBudgetContainer) return;
          
          if (radioId === 'budgetCustom') {
              // Show custom budget field
              customBudgetContainer.classList.remove('hidden');
              
              // Animate field appearance
              if (typeof gsap !== 'undefined') {
                  gsap.fromTo(customBudgetContainer,
                      { height: 0, opacity: 0, y: -10 },
                      { 
                          height: 'auto', 
                          opacity: 1, 
                          y: 0,
                          duration: 0.3,
                          ease: 'power2.out',
                          onComplete: () => {
                              // Focus the input
                              const customBudgetInput = document.getElementById('customBudget');
                              if (customBudgetInput) {
                                  customBudgetInput.focus();
                              }
                          }
                      }
                  );
              } else {
                  // Focus the input without animation
                  const customBudgetInput = document.getElementById('customBudget');
                  if (customBudgetInput) {
                      customBudgetInput.focus();
                  }
              }
          } else if (!customBudgetContainer.classList.contains('hidden')) {
              // Hide custom budget field with animation
              if (typeof gsap !== 'undefined') {
                  gsap.to(customBudgetContainer, {
                      height: 0,
                      opacity: 0,
                      y: -10,
                      duration: 0.3,
                      ease: 'power2.in',
                      onComplete: () => {
                          customBudgetContainer.classList.add('hidden');
                          
                          // Reset height and opacity after animation
                          gsap.set(customBudgetContainer, { 
                              height: 'auto', 
                              opacity: 1,
                              y: 0
                          });
                      }
                  });
              } else {
                  // Hide without animation
                  customBudgetContainer.classList.add('hidden');
              }
          }
      }
  }
  
  /**
   * Enhanced implementation for optional question toggle
   */
  function initializeOptionalQuestion() {
      const showButton = document.getElementById('show-question-button');
      const hideButton = document.getElementById('hide-question-button');
      const container = document.getElementById('optional-question-container');
      
      if (showButton && hideButton && container) {
          // Show optional question
          showButton.addEventListener('click', function() {
              toggleOptionalQuestion(true);
          });
          
          // Hide optional question
          hideButton.addEventListener('click', function() {
              toggleOptionalQuestion(false);
          });
      }
      
      /**
       * Toggle optional question visibility
       * @param {boolean} show - Whether to show the question
       */
      function toggleOptionalQuestion(show) {
          if (show) {
              // Toggle button visibility
              if (typeof gsap !== 'undefined') {
                  // Crossfade the buttons
                  gsap.to(showButton, {
                      opacity: 0,
                      scale: 0.9,
                      duration: 0.2,
                      onComplete: () => {
                          showButton.classList.add('hidden');
                          hideButton.classList.remove('hidden');
                          
                          gsap.fromTo(hideButton,
                              { opacity: 0, scale: 0.9 },
                              { opacity: 1, scale: 1, duration: 0.2 }
                          );
                      }
                  });
              } else {
                  // Simple toggle without animation
                  showButton.classList.add('hidden');
                  hideButton.classList.remove('hidden');
              }
              
              // Show question container
              container.classList.remove('hidden');
              
              // Animate container appearance
              if (typeof gsap !== 'undefined') {
                  gsap.fromTo(container,
                      { height: 0, opacity: 0, y: -10 },
                      { 
                          height: 'auto', 
                          opacity: 1, 
                          y: 0,
                          duration: 0.4,
                          ease: 'power2.out',
                          onComplete: () => {
                              // Focus textarea
                              const textarea = container.querySelector('textarea');
                              if (textarea) {
                                  textarea.focus();
                                  
                                  // Scroll to make sure the textarea is visible
                                  textarea.scrollIntoView({ 
                                      behavior: 'smooth',
                                      block: 'center'
                                  });
                              }
                          }
                      }
                  );
              } else {
                  // Focus textarea without animation
                  const textarea = container.querySelector('textarea');
                  if (textarea) {
                      textarea.focus();
                  }
              }
          } else {
              // Toggle button visibility
              if (typeof gsap !== 'undefined') {
                  // Crossfade the buttons
                  gsap.to(hideButton, {
                      opacity: 0,
                      scale: 0.9,
                      duration: 0.2,
                      onComplete: () => {
                          hideButton.classList.add('hidden');
                          showButton.classList.remove('hidden');
                          
                          gsap.fromTo(showButton,
                              { opacity: 0, scale: 0.9 },
                              { opacity: 1, scale: 1, duration: 0.2 }
                          );
                      }
                  });
              } else {
                  // Simple toggle without animation
                  hideButton.classList.add('hidden');
                  showButton.classList.remove('hidden');
              }
              
              // Animate container disappearance
              if (typeof gsap !== 'undefined') {
                  gsap.to(container, {
                      height: 0,
                      opacity: 0,
                      y: -10,
                      duration: 0.4,
                      ease: 'power2.in',
                      onComplete: () => {
                          container.classList.add('hidden');
                          
                          // Reset height and opacity for next time
                          gsap.set(container, { 
                              height: 'auto', 
                              opacity: 1,
                              y: 0
                          });
                      }
                  });
              } else {
                  // Hide without animation
                  container.classList.add('hidden');
              }
          }
      }
  }
  
  /**
   * Setup form submission
   */
  function setupFormSubmission() {
      const form = document.getElementById('inquiry-form');
      if (!form) return;
      
      form.addEventListener('submit', async function(e) {
          e.preventDefault();
          
          // Check if current step is valid
          const currentStep = FormAnimation.getCurrentStep();
          if (!FormValidation.validateStep(currentStep)) {
              FormValidation.showValidationErrors(currentStep);
              
              // Shake the form to indicate error
              if (typeof gsap !== 'undefined') {
                  gsap.to(form, {
                      x: [-10, 10, -8, 8, -5, 5, 0],
                      duration: 0.5,
                      ease: 'power1.inOut'
                  });
              }
              
              return;
          }
          
          // Get submit button
          const submitButton = form.querySelector('button[type="submit"]');
          if (!submitButton) return;
          
          // Show loading state
          const originalText = submitButton.innerHTML;
          submitButton.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Submitting...</span>';
          submitButton.disabled = true;
          
          try {
            // Collect form data
            const formData = new FormData(form);
            const formObject = {};
            
            formData.forEach((value, key) => {
                // Skip editing-view fields
                if (!key.includes('-editing')) {
                    formObject[key] = value;
                }
            });
            
            // Handle services checkboxes
            const services = [];
            form.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
                services.push(checkbox.value);
            });
            formObject.services = services.join(', ');
            
            // Handle custom budget
            if (formObject.budget === 'custom' && formObject.customBudget) {
                formObject.budget = formObject.customBudget;
            }
            
            // Handle social media profiles
            const socialMediaProfiles = [];
            form.querySelectorAll('.social-media-field').forEach((field, index) => {
                const typeSelect = field.querySelector('select');
                const profileInput = field.querySelector('input');
                
                if (typeSelect && profileInput && profileInput.value.trim()) {
                    socialMediaProfiles.push(`${typeSelect.value}: ${profileInput.value.trim()}`);
                }
            });
            formObject.socialMediaProfiles = socialMediaProfiles.join(', ');
            
            // Submit to server
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
                if (typeof FormAnimation !== 'undefined') {
                    FormAnimation.showSuccess();
                } else {
                    // Fallback without animation
                    const successMessage = document.getElementById('success-message');
                    if (successMessage) {
                        // Hide form steps
                        document.querySelectorAll('.step').forEach(step => {
                            step.classList.add('hidden');
                        });
                        
                        // Show success message
                        successMessage.classList.remove('hidden');
                    }
                }
            } else {
                console.error('Form submission error:', result);
                
                if (typeof FormAnimation !== 'undefined') {
                    FormAnimation.showError();
                } else {
                    // Fallback without animation
                    const errorMessage = document.getElementById('error-message');
                    if (errorMessage) {
                        errorMessage.classList.remove('hidden');
                    }
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            if (typeof FormAnimation !== 'undefined') {
                FormAnimation.showError();
            } else {
                // Fallback without animation
                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.classList.remove('hidden');
                }
            }
        } finally {
            // Restore button state
            if (submitButton) {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }
    });
    
    // Try again button
    const tryAgainButton = document.getElementById('try-again-button');
    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                // Hide with animation if available
                if (typeof gsap !== 'undefined') {
                    gsap.to(errorMessage, {
                        opacity: 0,
                        y: -10,
                        duration: 0.3,
                        onComplete: () => {
                            errorMessage.classList.add('hidden');
                            gsap.set(errorMessage, { opacity: 1, y: 0 });
                        }
                    });
                } else {
                    // Simple hide
                    errorMessage.classList.add('hidden');
                }
            }
        });
    }
}

// Public API
return {
    init
};
})();