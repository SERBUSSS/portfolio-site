document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for the included HTML to be loaded
  setTimeout(() => {
    const cardsContainer = document.querySelector('.cards-container');
    
    // If no cards container exists, create one and add it to the main element
    if (!cardsContainer) {
      const main = document.querySelector('main');
      const newCardsContainer = document.createElement('div');
      newCardsContainer.className = 'cards-container';
      
      // Find all the data-include divs that should be cards
      const cardDivs = main.querySelectorAll('div[data-include]');
      
      // If we have card divs, set up the container
      if (cardDivs.length > 0) {
        main.appendChild(newCardsContainer);
        
        // Convert each div with data-include to a card
        cardDivs.forEach((div, index) => {
          if (div.innerHTML.trim() !== '') {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = div.innerHTML;
            newCardsContainer.appendChild(card);
            
            // Hide the original div
            div.style.display = 'none';
          }
        });
        
        // Initialize the card scrolling
        initCardScroll();
      }
    } else {
      initCardScroll();
    }
  }, 500); // Wait for includes to load
  
  function initCardScroll() {
    const cards = document.querySelectorAll('.card');
    let activeCardIndex = 0;
    let touchStartY = 0;
    let touchDeltaY = 0;
    let isAnimating = false;

    // Initialize cards
    function initCards() {
      cards.forEach((card, index) => {
        if (index === 0) {
          card.classList.add('active');
        }
      });
    }

    // Move to next card
    function moveToNextCard() {
      if (activeCardIndex >= cards.length - 1 || isAnimating) return;
      
      isAnimating = true;
      
      // Archive current card
      cards[activeCardIndex].classList.remove('active');
      cards[activeCardIndex].classList.add('archived');
      
      // Move previous archived cards further back
      for (let i = 0; i < activeCardIndex; i++) {
        if (cards[i].classList.contains('archived')) {
          cards[i].classList.remove('archived');
          cards[i].classList.add('archived-2');
        }
      }
      
      // Activate next card
      activeCardIndex++;
      cards[activeCardIndex].classList.add('active');
      
      setTimeout(() => {
        isAnimating = false;
      }, 400); // Match transition duration
    }

    // Move to previous card
    function moveToPreviousCard() {
      if (activeCardIndex <= 0 || isAnimating) return;
      
      isAnimating = true;
      
      // Deactivate current card
      cards[activeCardIndex].classList.remove('active');
      
      // Restore previous card
      activeCardIndex--;
      cards[activeCardIndex].classList.remove('archived');
      cards[activeCardIndex].classList.add('active');
      
      // Move other archived cards forward
      for (let i = 0; i < activeCardIndex; i++) {
        if (cards[i].classList.contains('archived-2')) {
          cards[i].classList.remove('archived-2');
          cards[i].classList.add('archived');
        }
      }
      
      setTimeout(() => {
        isAnimating = false;
      }, 400);
    }

    // Handle wheel events for desktop
    function handleWheel(e) {
      e.preventDefault();
      if (e.deltaY > 0) {
        moveToNextCard();
      } else {
        moveToPreviousCard();
      }
    }

    // Handle touch events for mobile
    function handleTouchStart(e) {
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
      if (isAnimating) return;
      
      const currentY = e.touches[0].clientY;
      touchDeltaY = touchStartY - currentY;
      
      // For real-time movement, we can apply direct transforms
      if (touchDeltaY > 0 && activeCardIndex < cards.length - 1) {
        // Moving up - current card starts to archive, next card comes in
        const progress = Math.min(touchDeltaY / 200, 1); // 200px for full transition
        
        const activeCard = cards[activeCardIndex];
        const nextCard = cards[activeCardIndex + 1];
        
        // Apply direct transforms based on touch position
        activeCard.style.transform = `
          translateX(${-50 - progress * 10}%) 
          translateY(${-progress * 30}%) 
          scale(${1 - progress * 0.2}) 
          rotate(${progress * 15}deg)
        `;
        
        nextCard.style.transform = `
          translateX(-50%) 
          translateY(${100 - progress * 100}%)
        `;
        nextCard.style.opacity = progress;
        
      } else if (touchDeltaY < 0 && activeCardIndex > 0) {
        // Moving down - bring back previous card
        const progress = Math.min(Math.abs(touchDeltaY) / 200, 1);
        
        const activeCard = cards[activeCardIndex];
        const prevCard = cards[activeCardIndex - 1];
        
        activeCard.style.transform = `
          translateX(-50%) 
          translateY(${progress * 100}%)
        `;
        activeCard.style.opacity = 1 - progress;
        
        prevCard.style.transform = `
          translateX(${-60 + progress * 10}%) 
          translateY(${-30 + progress * 30}%) 
          scale(${0.8 + progress * 0.2}) 
          rotate(${15 - progress * 15}deg)
        `;
      }
    }

    function handleTouchEnd() {
      // Reset direct style manipulations
      cards.forEach(card => {
        card.style.transform = '';
        card.style.opacity = '';
      });
      
      // Determine if we should change cards
      if (Math.abs(touchDeltaY) > 80) { // Threshold for card change
        if (touchDeltaY > 0) {
          moveToNextCard();
        } else {
          moveToPreviousCard();
        }
      }
      
      touchDeltaY = 0;
    }

    // Set up event listeners
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.addEventListener('wheel', handleWheel, { passive: false });
    cardsContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    cardsContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    cardsContainer.addEventListener('touchend', handleTouchEnd);

    // Initialize
    initCards();
    
    console.log('Card scroll initialized with', cards.length, 'cards');
  }
});
