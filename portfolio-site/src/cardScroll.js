// IMPORTANT: This is a complete rewrite to fix duplication issues

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

// Wait for everything to be fully loaded before initializing
window.addEventListener('load', function() {
    // First, let's kill any existing ScrollTrigger instances to prevent conflicts
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // Select our elements
    const section1 = document.getElementById('section-1');
    const cards = section1.querySelectorAll('.item');
    
    // Important: Only initialize if we have cards to work with
    if (!cards.length) return;
    
    // Set initial states
    gsap.set(cards[0], { 
        scale: 1, 
        opacity: 1,
        rotation: 0
    });
    
    for (let i = 1; i < cards.length; i++) {
        gsap.set(cards[i], { 
            scale: 0.8, 
            opacity: 1,
            y: '50vh',
            rotation: i % 2 === 0 ? 5 : -5
        });
    }
    
    // Create the animation timeline
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section1,
            pin: true,
            start: "top top",
            end: `+=${cards.length * 100}%`,
            scrub: 1,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            // markers: true // Uncomment for debugging
        }
    });
    
    // Add card animations to timeline
    cards.forEach((card, index) => {
        // Move current card up
        timeline.to(card, {
            scale: 0.8,
            y: '-50vh',
            rotation: index % 2 === 0 ? -5 : 5
        });
        
        // Bring in next card if available
        if (index < cards.length - 1) {
            timeline.to(cards[index + 1], {
                y: 0,
                scale: 1,
                rotation: 0
            }, "<0.5");
        }
    });
});

// Block any other scripts from running duplicate initializations
window.cardScrollInitialized = true;