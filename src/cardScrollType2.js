// Animation for process section with static background
window.addEventListener('load', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Select our section and cards
    const section = document.getElementById('process');
    const sectionCards = section.querySelectorAll('.item');
    
    // Only initialize if we have cards to work with
    if (!sectionCards.length) return;
    
    // Get background section
    const backgroundElement = document.getElementById('background-process');
    
    // If we have a background element for this section
    if (backgroundElement) {
        // Style the background element
        gsap.set(backgroundElement, {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: -1
        });
        
        // Clone and insert the background into the project section
        const bgClone = backgroundElement.cloneNode(true);
        bgClone.id = 'background-process-clone';
        bgClone.style.position = 'absolute';
        bgClone.style.zIndex = '-1';
        section.insertBefore(bgClone, section.firstChild);
        
        // Hide the original background section
        backgroundElement.style.display = 'none';
    }
    
    // Set initial states - all cards start off-screen at the bottom
    sectionCards.forEach((card) => {
        gsap.set(card, { 
            y: '80vh', // Start below the viewport
            scale: 1,   // Full size initially
            opacity: 1,
            rotation: 0
        });
    });
    
    // Define rotation angles for each card (alternating directions)
    const rotationAngles = [-8, 9, -6, 8];
    
    // Define final positions for each card
    const finalPositions = [
        { x: '0vw', y: '-15vh' }, 
        { x: '0vw', y: '-5vh' }, 
        { x: '0vw', y: '5vh' }, 
        { x: '0vw', y: '15vh' }
    ];
    
    // Create the timeline for process section
    const sectionTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: `+=${sectionCards.length * 45 + 25}%`,
            scrub: 1,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            // markers: true // Uncomment for debugging
        }
    });
    
    // Add animations to timeline for each card
    sectionCards.forEach((card, index) => {
        // First bring the card to center
        sectionTimeline.to(card, {
            y: '-10vh',
            duration: 0.6
        });
        
        // Then directly place it in its final position with rotation and scale
        sectionTimeline.to(card, {
            scale: 0.8,
            rotation: rotationAngles[index % rotationAngles.length],
            x: finalPositions[index].x,
            y: finalPositions[index].y,
            duration: 0.3
        });
        
        // If it's not the last card, add a small pause before next card
        if (index < sectionCards.length - 1) {
            sectionTimeline.to({}, {
                duration: 0.2
            });
        }
    });

     // Add a delay at the end before unpinning the section
     sectionTimeline.to({}, {
        duration: 0.2, // This creates a pause at the end
        onComplete: function() {
            // Optional: You could add any final animation here
            console.log("Animation sequence complete");
        }
    });
});