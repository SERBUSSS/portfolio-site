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
    items.forEach((item, index) => {
        if (index !== 0) {
            direction == "horizontal"
                ? gsap.set(item, {xPercent: 100})
                : gsap.set(item, {yPercent: 100});
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
            // markers: true,
        },
        defaults: { ease: "none" },
    });
    
    items.forEach((item, index) => {
        timeline.to(item, {
            scale: 0.8,
            // rotate slightly to the right/left
        })
    });

    direction == "horizontal"
        ? timeline.to(items[index + 1], {
            xPercent: 0,
        }, 
        "<"
        )
        : timeline.to(items[index + 1], {
            yPercent: 0,
        },
        "<"
        )
}