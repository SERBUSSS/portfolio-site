document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('scroll-container');
    const cards = document.querySelectorAll('.card');
    const cardHeight = 256; // 64rem in pixels (Tailwind's h-64)
    const viewportHeight = window.innerHeight;
    
    // Initialize card positions
    cards.forEach((card, index) => {
      const topPosition = viewportHeight - (cardHeight / 2) + (index * cardHeight);
      card.style.top = `${topPosition}px`;
    });
    
    // Set container height to accommodate all cards
    const lastCard = cards[cards.length - 1];
    const lastCardBottom = parseFloat(lastCard.style.top) + cardHeight;
    scrollContainer.style.height = `${lastCardBottom + (cardHeight / 2)}px`;
    
    // Touch interaction variables
    let isDragging = false;
    let startY = 0;
    let startScrollY = 0;
    
    // Touch event handlers
    scrollContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      startY = e.touches[0].clientY;
      startScrollY = window.scrollY;
      e.preventDefault();
    });
    
    scrollContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touchY = e.touches[0].clientY;
      const diffY = touchY - startY;
      
      // Calculate new scroll position with bounds checking
      const newScrollY = Math.max(
        0,
        Math.min(
          startScrollY + diffY,
          scrollContainer.scrollHeight - window.innerHeight
        )
      );
      
      window.scrollTo(0, newScrollY);
      updateCards();
      e.preventDefault();
    });
    
    scrollContainer.addEventListener('touchend', () => {
      isDragging = false;
    });
    
    // Mouse wheel support
    scrollContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const newScrollY = window.scrollY + e.deltaY;
      window.scrollTo({
        top: newScrollY,
        behavior: 'smooth'
      });
    });
    
    // Update cards on scroll
    window.addEventListener('scroll', updateCards);
    updateCards(); // Initial call
    
    function updateCards() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      const maxRotation = 8; // Maximum rotation in degrees
      
      cards.forEach((card, index) => {
        const cardTop = parseFloat(card.style.top);
        const currentY = cardTop - scrollY;
        
        // Check if card is in view
        if (currentY + cardHeight > 0 && currentY < viewportHeight) {
          const cardCenter = currentY + (cardHeight / 2);
          const distanceFromCenter = viewportCenter - cardCenter;
          const normalizedDistance = Math.min(1, Math.abs(distanceFromCenter) / (viewportHeight / 2));
          
          // Calculate transformations
          const scale = 1 - (normalizedDistance * 0.2); // Scale down by 20% max
          const rotation = (index % 2 === 0) 
            ? (distanceFromCenter / viewportHeight) * maxRotation
            : -(distanceFromCenter / viewportHeight) * maxRotation;
          
          card.style.transform = `
            translateY(${currentY}px)
            scale(${scale})
            rotate(${rotation}deg)
          `;
        } else {
          // Reset transformations if card is not in view
          card.style.transform = `translateY(${currentY}px) scale(1) rotate(0deg)`;
        }
      });
    }
});