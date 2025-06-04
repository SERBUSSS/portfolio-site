// Header animation that responds to scroll
window.addEventListener('load', function() {
    // Register ScrollTrigger plugin if not already registered
    gsap.registerPlugin(ScrollTrigger);
    
    // Get the header element
    const header = document.getElementById('nav-bar');
    const headerContainer = document.getElementById('nav-bar-cont');
    const headerLogo = document.getElementById('head-logo');
    
    // Set initial state with an appropriate z-index
    gsap.set(header, {
        position: 'fixed',
        width: '100%',
        background: 'rgba(16, 21, 47, 0)', // Start transparent
        backdropFilter: 'blur(0px)',
        transition: 'background 0.3s, backdrop-filter 0.3s'
    });
    
    // Set z-index on the container instead of individual elements
    gsap.set(headerContainer, {
        zIndex: 30 // Lower z-index so form can appear above it
    });
    
    // Initialize variables for scroll direction detection
    let lastScrollTop = 0;
    let headerVisible = true;
    
    // Create scroll-triggered animations
    ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: (self) => {
            const scrollTop = self.scroll();
            const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
            
            // Determine if we should show/hide header based on scroll direction
            if (scrollTop > 100) { // Only start hiding after scrolling past 100px
                if (scrollDirection === 'down' && headerVisible) {
                    // Scrolling down - minimize header
                    gsap.to(header, {
                        paddingTop: '16px',
                        paddingBottom: '16px',
                        background: 'rgba(16, 21, 47, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        duration: 0.3
                    });
                    
                    gsap.to(headerLogo, {
                        height: '40px',
                        duration: 0.3
                    });
                    
                    headerVisible = false;
                } else if (scrollDirection === 'up' && !headerVisible) {
                    // Scrolling up - maximize header
                    gsap.to(header, {
                        paddingTop: '24px', 
                        paddingBottom: '16px',
                        background: 'rgba(16, 21, 47, 0.95)',
                        backdropFilter: 'blur(10px)',
                        duration: 0.3
                    });
                    
                    gsap.to(headerLogo, {
                        height: '48px',
                        duration: 0.3
                    });
                    
                    headerVisible = true;
                }
            } else {
                // At the top of the page - fully transparent header
                gsap.to(header, {
                    paddingTop: '24px',
                    paddingBottom: '16px',
                    background: 'rgba(16, 21, 47, 0)',
                    backdropFilter: 'blur(0px)',
                    boxShadow: 'none',
                    duration: 0.3
                });
                
                gsap.to(headerLogo, {
                    height: '48px',
                    duration: 0.3
                });
                
                headerVisible = true;
            }
            
            lastScrollTop = scrollTop;
        }
    });
    
    // Add a global listener to check for form open state and adjust z-index accordingly
    document.addEventListener('click', function(e) {
        // If clicking a form open button, lower the navbar z-index
        if (e.target.closest('[data-open-form="true"]') || e.target.closest('a[href="#background-form"]')) {
            gsap.set(headerContainer, { zIndex: 30 });
        }
    });
});