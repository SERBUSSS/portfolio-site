// Make ScrollTrigger available globally for use in GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Select the HTML elements needed for the animation
const scrollSections = document.querySelectorAll('.scroll-section');

// Function to initialize scroll animations
function initScroll(section, items, direction) {
    // Set initial state for all cards
    items.forEach((item, index) => {
        if (index === 0) {
            gsap.set(item, { 
                scale: 1, 
                opacity: 1,
                rotation: 0
            });
        } else {
            gsap.set(item, { 
                scale: 0.8, 
                opacity: 1,
                y: '50vh', // Additional offset from their 80vh position
                rotation: index % 2 === 0 ? 5 : -5 // Alternate rotation
            });
        }
    });
    
    // Calculate the total duration based on number of cards
    const cardCount = items.length;
    const totalDuration = `+=${cardCount * 100}%`;
    
    // Create the timeline with ScrollTrigger
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: totalDuration,
            scrub: 1,
            invalidateOnRefresh: true,
            // markers: true, // Uncomment for debugging
            pinSpacing: true
        },
        defaults: { ease: "power2.inOut" }, // Smoother easing
    });
    
    // For each card, create sequential animations
    items.forEach((item, index) => {
        // First move the current card up and fade it out
        timeline.to(item, {
            scale: 0.8,
            y: '-50vh', // Move up from its current position
            opacity: 1,
            rotation: index % 2 === 0 ? -5 : 5, // Alternate rotation
            duration: 1
        });
        
        // Then bring in the next card if it exists
        if (index < items.length - 1) {
            timeline.to(items[index + 1], {
                y: 0, // Return to its original position
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 1
            }, "<0.5"); // Overlap with previous animation
        }
    });
}

// Initialize the animations once the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    scrollSections.forEach((section) => {
        const items = section.querySelectorAll('.item');
        let direction = section.classList.contains('vertical-section') ? 'vertical' : 'horizontal';
        initScroll(section, items, direction);
    });
});