// formAnimation.js
import FormController from './formController.js';

const FormAnimation = {
  // Stacked card final positions pattern
  finalPositions: [
    { x: '-20vw', y: '-20vh' },
    { x: '-5vw', y: '-10vh' },
    { x: '10vw', y: '0vh' },
    { x: '20vw', y: '10vh' },
    { x: '10vw', y: '20vh' },
    { x: '-5vw', y: '30vh' }
  ],
  
  stackedCards: [],
  cardTransitions: {},
  
  init() {
    this.setupInitialState();
    this.enhanceFormController();
    this.bindCloseAnimations();
  },
  
  setupInitialState() {
    // Set initial off-screen position for all steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
      if (index > 0) {
        step.style.transform = 'translateX(100vw)';
        step.style.opacity = '0';
      }
    });
  },
  
  enhanceFormController() {
    // Wrap FormController methods to add animations
    const originalOpenForm = FormController.openForm.bind(FormController);
    const originalCloseForm = FormController.closeForm.bind(FormController);
    const originalShowStep = FormController.showStep.bind(FormController);
    const originalShowSuccessMessage = FormController.showSuccessMessage.bind(FormController);
    const originalShowErrorMessage = FormController.showErrorMessage.bind(FormController);
    
    FormController.openForm = () => {
      originalOpenForm();
      this.animateFormOpen();
    };
    
    FormController.closeForm = () => {
      this.animateFormClose(() => {
        originalCloseForm();
      });
    };
    
    FormController.showStep = (stepIndex) => {
      const previousStep = FormController.currentStep;
      originalShowStep(stepIndex);
      
      if (typeof previousStep === 'number') {
        this.animateStepTransition(previousStep, stepIndex);
      }
    };
    
    FormController.showSuccessMessage = () => {
      originalShowSuccessMessage();
      this.animateSuccessMessage();
    };
    
    FormController.showErrorMessage = () => {
      originalShowErrorMessage();
      this.animateErrorMessage();
    };
  },
  
  animateFormOpen() {
    const overlay = document.getElementById('form-overlay');
    const firstStep = document.querySelector('#step-0');
    
    // Animate overlay
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.5';
    });
    
    // Animate first card sliding in
    firstStep.style.transform = 'translateX(100vw)';
    firstStep.style.opacity = '0';
    firstStep.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    
    requestAnimationFrame(() => {
      firstStep.style.transform = 'translateX(0)';
      firstStep.style.opacity = '1';
    });
  },
  
  animateStepTransition(fromStep, toStep) {
    const fromElement = document.querySelector(`#step-${fromStep}`);
    const toElement = document.querySelector(`#step-${toStep}`);
    
    if (!fromElement || !toElement) return;
    
    if (toStep > fromStep) {
      // Moving forward - stack current card
      this.stackCard(fromElement, fromStep);
      this.slideInNextCard(toElement);
    } else {
      // Moving backward - unstack card
      this.slideOutCurrentCard(fromElement);
      this.unstackCard(toElement, toStep);
    }
  },
  
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
    element.style.opacity = '1';
    element.style.zIndex = '-1';
    
    // Store the transform for later
    this.cardTransitions[stepIndex] = {
      position,
      rotation
    };
  },
  
  slideInNextCard(element) {
    // Start from right side
    element.style.transform = 'translateX(100vw)';
    element.style.opacity = '0';
    element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    element.style.zIndex = '10';
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
    });
  },
  
  slideOutCurrentCard(element) {
    element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    element.style.transform = 'translateX(100vw)';
    element.style.opacity = '0';
  },
  
  unstackCard(element, stepIndex) {
    element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    element.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
    element.style.opacity = '1';
    element.style.zIndex = '10';
    
    // Remove from stacked cards
    const index = this.stackedCards.indexOf(stepIndex);
    if (index > -1) {
      this.stackedCards.splice(index, 1);
    }
  },
  
  animateFormClose() {
    const overlay = document.getElementById('form-overlay');
    const formContainer = document.getElementById('form-container');
    const successMessage = document.getElementById('success-message');
    const currentStep = FormController.currentStep;
    
    // If closing from success state, keep stacked cards in place
    if (currentStep === 'success') {
      // Only hide the success message and overlay
      successMessage.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      successMessage.style.transform = 'translateX(-100vw)';
      successMessage.style.opacity = '0';
      
      overlay.style.transition = 'opacity 0.5s ease';
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        formContainer.classList.add('hidden');
        overlay.classList.add('hidden');
        // Reset success message for next time
        successMessage.style.transform = '';
        successMessage.style.opacity = '';
      }, 500);
    } else {
      // Normal close - animate all cards out
      const visibleElements = formContainer.querySelectorAll('.step:not(.hidden), #error-message:not(.hidden)');
      
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
        if (element) {
          setTimeout(() => {
            element.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            element.style.transform = 'translateX(-100vw)';
            element.style.opacity = '0';
          }, (visibleElements.length + i) * 100);
        }
      });
      
      // Fade out overlay
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';
      }, 300);
      
      // Reset after animations complete
      setTimeout(() => {
        formContainer.classList.add('hidden');
        overlay.classList.add('hidden');
        this.resetAnimations();
      }, 1000);
    }
  },
  
  animateSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    
    // Fade in with upward movement
    successMessage.style.transform = 'translateY(20px)';
    successMessage.style.opacity = '0';
    successMessage.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    
    requestAnimationFrame(() => {
      successMessage.style.transform = 'translateY(0)';
      successMessage.style.opacity = '1';
    });
  },
  
  animateErrorMessage() {
    const errorMessage = document.getElementById('error-message');
    
    // Add shake animation
    errorMessage.style.animation = 'shake 0.5s ease-out';
    errorMessage.style.opacity = '0';
    errorMessage.style.transition = 'opacity 0.3s ease-out';
    
    requestAnimationFrame(() => {
      errorMessage.style.opacity = '1';
    });
    
    // Remove animation after completion
    setTimeout(() => {
      errorMessage.style.animation = '';
    }, 500);
  },
  
  bindCloseAnimations() {
    // Add specific animation for try again button
    const tryAgainButton = document.getElementById('try-again-button');
    if (tryAgainButton) {
      tryAgainButton.addEventListener('click', () => {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        errorMessage.style.transform = 'translateX(100vw)';
        errorMessage.style.opacity = '0';
        
        setTimeout(() => {
          FormController.currentStep = 0;
          FormController.showStep(0);
          this.animateStepTransition(-1, 0);
        }, 300);
      });
    }
  },
  
  resetAnimations() {
    // Reset all transforms unless we're keeping stacked cards
    if (FormController.currentStep !== 'success') {
      const steps = document.querySelectorAll('.step');
      steps.forEach(step => {
        step.style.transform = '';
        step.style.opacity = '';
        step.style.transition = '';
        step.style.zIndex = '';
      });
      
      this.stackedCards = [];
      this.cardTransitions = {};
    }
  }
};

// Add CSS for shake animation
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  FormAnimation.init();
});

export default FormAnimation;