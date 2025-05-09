document.addEventListener('DOMContentLoaded', function() {
    console.log("Checking card animation initialization");
    
    // Check if ScrollTrigger is registered
    if (!window.ScrollTrigger) {
        console.error("ScrollTrigger not found! Make sure GSAP plugins are loaded.");
    } else {
        console.log("ScrollTrigger is available");
    }
    
    // Log all card elements to see if they're found
    const cards = document.querySelectorAll('.scroll-section .card');
    console.log("Found card elements:", cards.length);
    
    // Check if card styles are applied
    if (cards.length > 0) {
        const firstCard = cards[0];
        const computedStyle = window.getComputedStyle(firstCard);
        console.log("First card position:", computedStyle.position);
        console.log("First card transform:", computedStyle.transform);
    }
    
    // Check if cardScrollType1.js and cardScrollType2.js are loaded
    console.log("cardScrollType1 loaded:", typeof window.cardScrollType1 !== 'undefined');
    console.log("cardScrollType2 loaded:", typeof window.cardScrollType2 !== 'undefined');
});