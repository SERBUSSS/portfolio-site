// Make ScrollTrigger available globally for use in GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Select the HTML elements needed for the animation
const scrollSections = document.querySelectorAll('.scroll-section');

scrollSections.forEach((section) => {
    const wrapper = section.querySelector('.wrapper');
    const items = wrapper.querySelectorAll('.item');

    let direction = null;

    if (section.classList.contains('vertical-section')) {
        direction = 'vertical';
    } else if (section.classList.contains('horizontal-section')) {
        direction = 'horizontal';
    }

    initScroll(section, items, direction);
});

function initScroll(section, items, direction) {
    // Set initial state for all cards
    // We'll keep their original vertical position (top: 80vh) and modify other properties
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
                opacity: 0,
                y: '50vh', // Additional offset from their 80vh position
                rotation: index % 2 === 0 ? 5 : -5 // Alternate rotation
            });
        }
    });
    
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: () => `+=${items.length * 100}%`,
            scrub: 1,
            invalidateOnRefresh: true,
            // markers: true (uncomment to debug)
        },
        defaults: { ease: "power2.inOut" }, // Smoother easing
    });
    
    // For each card, create sequential animations
    items.forEach((item, index) => {
        if (index < items.length - 1) {
            // First move the current card up and fade it out
            timeline.to(item, {
                scale: 0.8,
                y: '-50vh', // Move up from its current position
                opacity: 0,
                rotation: index % 2 === 0 ? -5 : 5, // Alternate rotation
                duration: 1
            });
            
            // Then bring in the next card
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