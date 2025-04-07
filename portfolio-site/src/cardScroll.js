// Animation for section-1 cards
window.addEventListener('load', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Select our section and cards
    const section1 = document.getElementById('section-1.1');
    const section1Cards = section1.querySelectorAll('.item');
    
    // Only initialize if we have cards to work with
    if (!section1Cards.length) return;
    
    // Set initial states - all cards start off-screen at the bottom
    section1Cards.forEach((card, index) => {
        gsap.set(card, { 
            y: '100vh', // Start below the viewport
            scale: 1,   // Full size initially
            opacity: 1,
            rotation: 0
        });
    });
    
    // Define rotation angles for each card (alternating directions)
    const rotationAngles = [-10, 12, -10, 8, -6, 9];
    
    // Create the timeline for section-1
    const section1Timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section1,
            pin: true,
            start: "top top",
            end: `+=${section1Cards.length * 100}%`,
            scrub: 1,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            // markers: true // Uncomment for debugging
        }
    });
    
    // Add animations to timeline for each card
    section1Cards.forEach((card, index) => {
        // First bring the card to center
        section1Timeline.to(card, {
            y: '-10vh',
            duration: 1
        });
        
        // Then "place it down" with rotation and scale
        section1Timeline.to(card, {
            scale: 0.6,
            rotation: rotationAngles[index % rotationAngles.length],
            y: '0vh', // Move slightly down to simulate placing
            duration: 0.5
        });
        
        // If it's not the last card, add a small pause before next card
        if (index < section1Cards.length - 1) {
            section1Timeline.to({}, {
                duration: 0.2
            });
        }
    });
    
    // Add a final animation to spread cards out in a staggered pattern
    const finalPositions = [
        { x: '-20vw', y: '-20vh' }, 
        { x: '-5vw', y: '-10vh' }, 
        { x: '10vw', y: '-0vh' }, 
        { x: '20vw', y: '10vh' },
        { x: '10vw', y: '20vh' },
        { x: '-5vw', y: '30vh' }
    ];
    
    section1Cards.forEach((card, index) => {
        section1Timeline.to(card, {
            x: finalPositions[index].x,
            y: finalPositions[index].y,
            duration: 0.8,
            ease: "power1.out"
        }, index > 0 ? "<0.1" : ">");
    });
});