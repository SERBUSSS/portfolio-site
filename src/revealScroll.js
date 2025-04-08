// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);
    
    // Get the elements we want to animate
    const servicesIntro = document.querySelector('#s-intro');
    const serviceOne = document.querySelector('#s1-webdesign');
    const serviceOneDivider = document.querySelector('#s1-divider');
    const serviceTwo = document.querySelector('#s2-branding');
    const serviceTwoDivider = document.querySelector('#s2-divider');
    const serviceThree = document.querySelector('#s3-SMM');
    const serviceThreeDivider = document.querySelector('#s3-divider');
    
    // Set initial state of elements - invisible and slightly scaled down
    gsap.set([servicesIntro, serviceOne, serviceOneDivider, serviceTwo, 
             serviceTwoDivider, serviceThree, serviceThreeDivider], {
      opacity: 0,
      scale: 0.95,
      y: 20 // Small vertical offset for a nicer entrance
    });
    
    // Create timeline for each element with ScrollTrigger
    // Services intro animation
    gsap.to(servicesIntro, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: servicesIntro,
        start: "top 80%", // Start animation when the top of the element reaches 80% from the top of viewport
        end: "top 40%",   // Complete animation when the top of the element reaches 40% from the top
        toggleActions: "play none none none",
        scrub: 0.5        // Smooth animation tied to scroll
      }
    });
    
    // Web Design section animation
    gsap.to([serviceOne, serviceOneDivider], {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,       // Slight delay between elements
      scrollTrigger: {
        trigger: serviceOne,
        start: "top 80%",
        end: "top 40%",
        toggleActions: "play none none none",
        scrub: 0.5
      }
    });
    
    // Branding section animation
    gsap.to([serviceTwo, serviceTwoDivider], {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: serviceTwo,
        start: "top 80%",
        end: "top 40%",
        toggleActions: "play none none none",
        scrub: 0.5
      }
    });
    
    // Social Media Marketing section animation
    gsap.to([serviceThree, serviceThreeDivider], {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: serviceThree,
        start: "top 80%",
        end: "top 40%",
        toggleActions: "play none none none",
        scrub: 0.5
      }
    });
  });