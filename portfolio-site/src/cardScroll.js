document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for the included HTML to be loaded
  setTimeout(() => {
    initCardScroll();
  }, 500);
  
  function initCardScroll() {
    // Find the existing cards container 
    const cardsContainer = document.querySelector('.cards-container');
    if (!cardsContainer) {
      console.error('No cards container found');
      return;
    }
    
    // Find all cards within the container
    const cards = Array.from(cardsContainer.querySelectorAll('.card'));
    if (cards.length === 0) {
      console.error('No cards found in container');
      return;
    }
    
    console.log('Found', cards.length, 'cards');
    
    // Tracking variables
    let activeCardIndex = 0;
    let startY = 0;
    let currentY = 0;
    let touchDelta = 0;
    let lastTouchTime = 0;
    let touchVelocity = 0;
    let animationFrameId = null;
    let isAnimating = false;
    
    // Initialize cards
    function setupCards() {
      // Add positioning styles to container if needed
      if (!cardsContainer.style.position) {
        cardsContainer.style.position = 'relative';
        cardsContainer.style.width = '100%';
        cardsContainer.style.height = '100%';
        cardsContainer.style.overflow = 'hidden';
      }
      
      // Set initial position for each card
      cards.forEach((card, index) => {
        // Ensure cards have necessary styles
        card.style.position = 'absolute';
        card.style.left = '50%';
        card.style.bottom = '0';
        card.style.width = '80vw';
        card.style.maxWidth = '500px';
        card.style.border = '1px solid black';
        card.style.borderRadius = '8px';
        card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        
        if (index === 0) {
          // First card starts half-visible (50% above fold)
          card.style.transform = 'translateX(-50%) translateY(50%)';
          card.style.opacity = '1';
          card.classList.add('active');
        } else {
          // Other cards start below the fold (not visible)
          card.style.transform = 'translateX(-50%) translateY(100%)';
          card.style.opacity = '0';
        }
      });
      
      console.log('Cards initialized');
    }
    
    // Position cards based on progress (0-100%)
    function positionCards(progress) {
      // Progress ranges:
      // 0% = active card is half visible at bottom
      // 50% = active card is centered
      // 100% = active card is archived, next card is active
      
      const activeCard = cards[activeCardIndex];
      const nextCard = activeCardIndex < cards.length - 1 ? cards[activeCardIndex + 1] : null;
      
      // Position active card
      if (progress <= 50) {
        // Phase 1: Bottom to center
        const phase1Progress = progress / 50; // 0-1
        activeCard.style.transform = `translateX(-50%) translateY(${50 - phase1Progress * 50}%)`;
        activeCard.style.opacity = '1';
      } else {
        // Phase 2: Center to archived
        const phase2Progress = (progress - 50) / 50; // 0-1
        
        // Create a unique rotation for this card
        const rotation = (activeCardIndex % 2 === 0) ? 
          10 + (activeCardIndex % 3) * 5 : 
          -10 - (activeCardIndex % 3) * 5;
        
        // Create a unique position in the stack
        const offsetX = -50 + (((activeCardIndex % 3) - 1) * 5);
        const offsetY = -50 + (((activeCardIndex % 2) - 0.5) * 5);
        
        // Scale down as it moves to archived position
        const scale = 1 - (0.3 * phase2Progress);
        
        activeCard.style.transform = `
          translateX(${offsetX + (phase2Progress * ((activeCardIndex % 3) - 1) * 5)}%) 
          translateY(${offsetY + (phase2Progress * ((activeCardIndex % 2) - 0.5) * 5)}%) 
          scale(${scale}) 
          rotate(${rotation * phase2Progress}deg)
        `;
        
        // Maintain full opacity until fully archived
        activeCard.style.opacity = `${1 - phase2Progress * 0.3}`;
      }
      
      // Position next card (if exists)
      if (nextCard) {
        if (progress < 50) {
          // Next card stays below fold until active card reaches center
          nextCard.style.transform = 'translateX(-50%) translateY(100%)';
          nextCard.style.opacity = '0';
        } else {
          // Next card starts coming up
          const nextCardProgress = (progress - 50) / 50; // 0-1
          nextCard.style.transform = `translateX(-50%) translateY(${100 - nextCardProgress * 50}%)`;
          nextCard.style.opacity = `${nextCardProgress}`;
        }
      }
      
      // Position all archived cards (before active)
      for (let i = 0; i < activeCardIndex; i++) {
        const card = cards[i];
        const archiveIndex = activeCardIndex - i; // How many cards deep in archive
        
        // Create a unique rotation for this card
        const rotation = (i % 2 === 0) ? 
          10 + (i % 3) * 5 : 
          -10 - (i % 3) * 5;
        
        // Create a unique position in the stack
        const offsetX = -50 + (((i % 3) - 1) * 5);
        const offsetY = -50 + (((i % 2) - 0.5) * 5);
        
        // Scale based on how deep in the archive
        const scale = 0.7 - (Math.min(0.2, 0.05 * archiveIndex));
        
        card.style.transform = `
          translateX(${offsetX}%) 
          translateY(${offsetY}%) 
          scale(${scale}) 
          rotate(${rotation}deg)
        `;
        
        // Reduce opacity based on how deep in archive
        card.style.opacity = `${0.7 - (Math.min(0.5, 0.1 * archiveIndex))}`;
      }
      
      // Hide cards that come after the next card
      for (let i = activeCardIndex + 2; i < cards.length; i++) {
        cards[i].style.transform = 'translateX(-50%) translateY(100%)';
        cards[i].style.opacity = '0';
      }
    }
    
    // Move to next card
    function moveToNextCard() {
      if (activeCardIndex >= cards.length - 1 || isAnimating) return;
      
      isAnimating = true;
      
      // Animate from 50% (centered) to 100% (archived)
      let progress = 50;
      const startTime = Date.now();
      const duration = 300; // ms
      
      function animateForward() {
        const elapsed = Date.now() - startTime;
        const animProgress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - animProgress, 3);
        
        progress = 50 + (eased * 50);
        positionCards(progress);
        
        if (animProgress < 1) {
          animationFrameId = requestAnimationFrame(animateForward);
        } else {
          // Animation complete, update active card
          activeCardIndex++;
          isAnimating = false;
          
          // Update active card class
          cards.forEach(c => c.classList.remove('active'));
          cards[activeCardIndex].classList.add('active');
          
          // Reset progress for new active card
          positionCards(0);
        }
      }
      
      animationFrameId = requestAnimationFrame(animateForward);
    }
    
    // Move to previous card
    function moveToPreviousCard() {
      if (activeCardIndex <= 0 || isAnimating) return;
      
      isAnimating = true;
      
      // Animate from current position to previous card
      activeCardIndex--;
      
      // Update active card class
      cards.forEach(c => c.classList.remove('active'));
      cards[activeCardIndex].classList.add('active');
      
      // Start with previous card in center
      let progress = 50;
      const startTime = Date.now();
      const duration = 300; // ms
      
      function animateBackward() {
        const elapsed = Date.now() - startTime;
        const animProgress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - animProgress, 3);
        
        progress = 50 - (eased * 50);
        positionCards(progress);
        
        if (animProgress < 1) {
          animationFrameId = requestAnimationFrame(animateBackward);
        } else {
          isAnimating = false;
        }
      }
      
      animationFrameId = requestAnimationFrame(animateBackward);
    }
    
    // Handle touch start
    function handleTouchStart(e) {
      if (isAnimating) return;
      
      // Cancel any ongoing animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      startY = e.touches[0].clientY;
      currentY = startY;
      touchDelta = 0;
      lastTouchTime = Date.now();
      touchVelocity = 0;
      
      // Remove transitions for direct manipulation
      cards.forEach(card => {
        card.style.transition = 'none';
      });
      
      console.log('Touch start:', startY);
    }
    
    // Handle touch move
    function handleTouchMove(e) {
      if (isAnimating) return;
      
      // Calculate the touch delta (how far finger moved)
      currentY = e.touches[0].clientY;
      touchDelta = startY - currentY;
      
      // Calculate velocity (for determining fast vs slow flick)
      const now = Date.now();
      const dt = now - lastTouchTime;
      if (dt > 0) {
        // Smooth velocity calculation
        const instantVelocity = (startY - currentY) / dt;
        touchVelocity = touchVelocity * 0.7 + instantVelocity * 0.3;
      }
      lastTouchTime = now;
      
      // Convert touch delta to progress percentage
      // Full screen height = 100% progress
      const touchProgress = (touchDelta / window.innerHeight) * 100;
      
      // Clamp progress based on current position and available cards
      let progress = touchProgress;
      
      // Restrict movement if we're at the first or last card
      if (activeCardIndex === 0 && touchProgress < 0) {
        // First card, restrict moving backward
        progress = Math.max(0, touchProgress);
      } else if (activeCardIndex === cards.length - 1 && touchProgress > 50) {
        // Last card, restrict moving forward
        progress = Math.min(50, touchProgress);
      }
      
      // Position all cards based on progress
      positionCards(progress);
      
      console.log('Touch move, progress:', progress);
    }
    
    // Handle touch end
    function handleTouchEnd() {
      if (isAnimating) return;
      
      // Restore transitions for smooth animation
      cards.forEach(card => {
        card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      });
      
      // Convert touch delta to progress percentage
      const touchProgress = (touchDelta / window.innerHeight) * 100;
      
      // Determine if this was a fast flick
      const isFastFlick = Math.abs(touchVelocity) > 0.5; // Threshold in px/ms
      
      console.log('Touch end, progress:', touchProgress, 'velocity:', touchVelocity);
      
      if (isFastFlick) {
        // Fast flick - complete the action in the direction of movement
        if (touchVelocity > 0) {
          // Flicked upward - go to next state
          if (touchProgress < 50) {
            // Move to center
            animateToPosition(touchProgress, 50);
          } else {
            // Move to next card
            moveToNextCard();
          }
        } else {
          // Flicked downward - go to previous state
          if (touchProgress > 0) {
            // Move back to start
            animateToPosition(touchProgress, 0);
          } else {
            // Move to previous card
            moveToPreviousCard();
          }
        }
      } else {
        // Slow movement - snap to nearest position
        if (touchProgress < 25) {
          // Snap back to start
          animateToPosition(touchProgress, 0);
        } else if (touchProgress < 75) {
          // Snap to center
          animateToPosition(touchProgress, 50);
        } else {
          // Go to next card
          moveToNextCard();
        }
      }
    }
    
    // Animate to a specific position
    function animateToPosition(fromPosition, toPosition) {
      if (isAnimating) return;
      
      isAnimating = true;
      
      // Cancel any ongoing animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      const startTime = Date.now();
      const duration = 300; // ms
      const distance = toPosition - fromPosition;
      
      function step() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const currentPosition = fromPosition + (distance * eased);
        positionCards(currentPosition);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          isAnimating = false;
          animationFrameId = null;
        }
      }
      
      animationFrameId = requestAnimationFrame(step);
    }
    
    // Handle wheel events
    function handleWheel(e) {
      e.preventDefault();
      
      if (isAnimating) return;
      
      // Cancel any ongoing animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      // Convert wheel delta to touch delta
      touchDelta += e.deltaY * 0.5;
      
      // Convert to progress percentage
      const wheelProgress = (touchDelta / window.innerHeight) * 100;
      
      // Clamp progress based on current position and available cards
      let progress = wheelProgress;
      
      // Restrict movement if we're at the first or last card
      if (activeCardIndex === 0 && wheelProgress < 0) {
        // First card, restrict moving backward
        progress = Math.max(0, wheelProgress);
      } else if (activeCardIndex === cards.length - 1 && wheelProgress > 50) {
        // Last card, restrict moving forward
        progress = Math.min(50, wheelProgress);
      }
      
      // Position cards without transition for direct manipulation
      cards.forEach(card => {
        card.style.transition = 'none';
      });
      
      // Update card positions
      positionCards(progress);
      
      // Auto-animate when wheel stops
      clearTimeout(window.wheelTimeout);
      window.wheelTimeout = setTimeout(() => {
        // Restore transitions
        cards.forEach(card => {
          card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        });
        
        // Snap to appropriate position
        if (progress < 25) {
          // Snap back to start
          animateToPosition(progress, 0);
          touchDelta = 0;
        } else if (progress < 75) {
          // Snap to center
          animateToPosition(progress, 50);
          touchDelta = window.innerHeight * 0.5;
        } else {
          // Go to next card
          moveToNextCard();
          touchDelta = 0;
        }
      }, 150);
    }
    
    // Set up event listeners
    cardsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardsContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    cardsContainer.addEventListener('touchend', handleTouchEnd);
    cardsContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    // Initialize the cards
    setupCards();
    
    console.log('Card scroll initialized');
  }
});