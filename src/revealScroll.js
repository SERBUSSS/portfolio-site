// Wait for window to fully load (including all resources)
window.addEventListener('load', function() {
    console.log("Window loaded - checking for GSAP");
    
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }
    
    if (typeof ScrollTrigger === 'undefined') {
        console.error('ScrollTrigger not loaded');
        return;
    }
    
    console.log("GSAP and ScrollTrigger are available");
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Get the elements we want to animate
    const servicesIntro = document.querySelector('#s-intro');
    const serviceOne = document.querySelector('#s1-webdesign');
    const serviceOneDivider = document.querySelector('#s1-divider');
    const serviceTwo = document.querySelector('#s2-branding');
    const serviceTwoDivider = document.querySelector('#s2-divider');
    const serviceThree = document.querySelector('#s3-SMM');
    const serviceThreeDivider = document.querySelector('#s3-divider');
    
    // Debug - Check if elements are found
    console.log('Services elements found:', {
        servicesIntro: servicesIntro ? true : false,
        serviceOne: serviceOne ? true : false,
        serviceOneDivider: serviceOneDivider ? true : false,
        serviceTwo: serviceTwo ? true : false,
        serviceTwoDivider: serviceTwoDivider ? true : false,
        serviceThree: serviceThree ? true : false,
        serviceThreeDivider: serviceThreeDivider ? true : false
    });
    
    // Verify services section exists
    const servicesSection = document.querySelector('#services');
    if (!servicesSection) {
        console.error('Services section (#services) not found');
        return;
    }
    
    console.log('Services section found, setting up animations');
    
    // Set initial state with inline styles to ensure they take effect
    const elements = [servicesIntro, serviceOne, serviceOneDivider, serviceTwo, 
                     serviceTwoDivider, serviceThree, serviceThreeDivider];
    
    elements.forEach(el => {
        if (el) {
            el.style.opacity = "0";
            el.style.transform = "scale(0.95) translateY(20px)";
        }
    });
    
    // Force a layout recalculation
    servicesSection.offsetHeight;
    
    console.log('Initial states set, creating timelines');
    
    // Create a timeline for services intro
    const introTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#services',
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
            // markers: true, // Enable markers for debugging
            id: "services-intro"
        }
    });
    
    if (servicesIntro) {
        introTl.to(servicesIntro, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }
    
    // Create a timeline for service one
    if (serviceOne) {
        const serviceTl1 = gsap.timeline({
            scrollTrigger: {
                trigger: serviceOne,
                start: "top 85%",
                end: "top 15%",
                toggleActions: "play none none reverse",
                // markers: true, // Enable markers for debugging
                id: "service-one"
            }
        });
        
        serviceTl1.to(serviceOne, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        if (serviceOneDivider) {
            serviceTl1.to(serviceOneDivider, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6");
        }
    }
    
    // Create a timeline for service two
    if (serviceTwo) {
        const serviceTl2 = gsap.timeline({
            scrollTrigger: {
                trigger: serviceTwo,
                start: "top 85%",
                end: "top 15%",
                toggleActions: "play none none reverse",
                // markers: true, // Enable markers for debugging
                id: "service-two"
            }
        });
        
        serviceTl2.to(serviceTwo, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        if (serviceTwoDivider) {
            serviceTl2.to(serviceTwoDivider, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6");
        }
    }
    
    // Create a timeline for service three
    if (serviceThree) {
        const serviceTl3 = gsap.timeline({
            scrollTrigger: {
                trigger: serviceThree,
                start: "top 85%",
                end: "top 15%",
                toggleActions: "play none none reverse",
                // markers: true, // Enable markers for debugging
                id: "service-three"
            }
        });
        
        serviceTl3.to(serviceThree, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
        
        if (serviceThreeDivider) {
            serviceTl3.to(serviceThreeDivider, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.6");
        }
    }
    
    // Force ScrollTrigger to recalculate all scroll positions
    ScrollTrigger.refresh();
    console.log('ScrollTrigger refreshed');
});
