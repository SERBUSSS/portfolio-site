// Make ScrollTrigger available globally for use in GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Select the HTML elements needed for the animation
const scrollSections = document.querySelectorAll('.scroll-section');
// Select the background element to keep it fixed during scroll
const background = document.querySelector('.background');

// Pin the background in place so it stays centered in section-1
gsap.timeline({
    scrollTrigger: {
        trigger: '.section-1',
        start: "top top",
        end: "bottom top",
        pin: background,
        pinSpacing: false
    }
});

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
                opacity: 1,
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
            end: () => `+=${(items.length + 1) * 100}%`, // Added +1 to account for final animation
            scrub: 1,
            invalidateOnRefresh: true,
            // markers: true (uncomment to debug)
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
        } else {
            // For the last card, add a bit more scroll space before finishing
            timeline.to({}, { duration: 0.5 }); // Empty tween just to create some space
        }
    });
    
    // Add a final animation to ensure we have a clean transition to the next section
    timeline.to({}, { duration: 0.5 });
}