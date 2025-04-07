// Animation for project sections with static backgrounds
window.addEventListener('load', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Select the project sections
    const projectSections = document.querySelectorAll('[id^="project-"]');
    
    // Map of project IDs to their corresponding background sections
    const backgroundMap = {
        'project-1': 'background-p-1',
        'project-2': 'background-p-2',
        'project-3': 'background-p-3',
        'project-4': 'background-p-4'
    };
    
    // Process each project section
    projectSections.forEach(section => {
        const sectionCards = section.querySelectorAll('.item');
        const sectionId = section.id;
        
        // Only initialize if we have cards to work with
        if (!sectionCards.length) return;
        
        // Get background section if one is mapped
        const backgroundId = backgroundMap[sectionId];
        const backgroundElement = backgroundId ? document.getElementById(backgroundId) : null;
        
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
            bgClone.id = `${backgroundId}-clone`;
            bgClone.style.position = 'absolute';
            bgClone.style.zIndex = '-1';
            section.insertBefore(bgClone, section.firstChild);
            
            // Hide the original background section
            backgroundElement.style.display = 'none';
        }
        
        // Set initial states for cards
        sectionCards.forEach(card => {
            gsap.set(card, { 
                y: '80vh', // Start below the viewport
                scale: 1,   // Full size initially
                opacity: 1,
                rotation: 0
            });
        });
        
        // Define rotation angles for each card (alternating directions)
        const rotationAngles = [-10, 12, -10, 8, -6, 9];
        
        // Create the timeline for this section
        const sectionTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                pin: true,
                start: "top top",
                end: `+=${sectionCards.length * 100}%`,
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
            
            // Then "place it down" with rotation and scale
            sectionTimeline.to(card, {
                scale: 0.6,
                rotation: rotationAngles[index % rotationAngles.length],
                y: '0vh', // Move slightly down to simulate placing
                duration: 0.15
            });
            
            // If it's not the last card, add a small pause before next card
            if (index < sectionCards.length - 1) {
                sectionTimeline.to({}, {
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
        
        sectionCards.forEach((card, index) => {
            sectionTimeline.to(card, {
                x: finalPositions[index % finalPositions.length].x,
                y: finalPositions[index % finalPositions.length].y,
                duration: 0.5,
                ease: "power1.out"
            }, index > 0 ? "<0.1" : ">");
        });
    });
});