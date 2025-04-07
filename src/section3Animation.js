// Animation for section-3 cards
window.addEventListener('load', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Select our section and cards
    const section3 = document.getElementById('section-3');
    const section3Cards = section3.querySelectorAll('.item');
    
    // Only initialize if we have cards to work with
    if (!section3Cards.length) return;
    
    // Set initial states - all cards start off-screen at the bottom
    section3Cards.forEach((card, index) => {
        gsap.set(card, { 
            y: '100vh', // Start below the viewport
            scale: 1,   // Full size initially
            opacity: 1,
            rotation: 0
        });
    });
    
    // Define rotation angles for each card (alternating directions)
    const rotationAngles = [-8, 9, -6, 8];
    
    // Create the timeline for section-3
    const section3Timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section3,
            pin: true,
            start: "top top",
            end: `+=${section3Cards.length * 100}%`,
            scrub: 1,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            // markers: true // Uncomment for debugging
        }
    });
    
    // Add animations to timeline for each card
    section3Cards.forEach((card, index) => {
        // First bring the card to center
        section3Timeline.to(card, {
            y: '-10vh',
            duration: 1
        });
        
        // Then "place it down" with rotation and scale
        section3Timeline.to(card, {
            scale: 0.8,
            rotation: rotationAngles[index % rotationAngles.length],
            y: '0vh', // Move slightly down to simulate placing
            duration: 0.5
        });
        
        // If it's not the last card, add a small pause before next card
        if (index < section3Cards.length - 1) {
            section3Timeline.to({}, {
                duration: 0.2
            });
        }
    });
    
    // Add a final animation to spread cards out in a staggered pattern
    const finalPositions = [
        { x: '0vw', y: '-15vh' }, 
        { x: '0vw', y: '-5vh' }, 
        { x: '0vw', y: '5vh' }, 
        { x: '0vw', y: '15vh' }
    ];
    
    section3Cards.forEach((card, index) => {
        section3Timeline.to(card, {
            x: finalPositions[index].x,
            y: finalPositions[index].y,
            duration: 0.8,
            ease: "power1.out"
        }, index > 0 ? "<0.1" : ">");
    });
});