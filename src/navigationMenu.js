// Navigation menu functionality
window.addEventListener('load', function() {
    // Register ScrollTrigger plugin if not already registered
    gsap.registerPlugin(ScrollTrigger);
    
    // Get elements
    const header = document.getElementById('nav-bar');
    const headerLogo = header.querySelector('img[alt="Buștiuc Sergiu Logo"]');
    const menuButton = header.querySelector('a[href=""]:nth-child(1)');
    const menuCloseButton = header.querySelector('.hidden a:nth-child(1)');
    const menuContainer = header.querySelector('.hidden');
    
    // Convert the navigation h4 elements to links
    const navItems = menuContainer.querySelectorAll('.inline-flex.gap-1 h4');
    
    // Map section IDs to their corresponding nav items
    const sectionMap = {
        0: 'project-1',
        1: 'process',
        2: 'services',
        3: 'FAQ'
    };
    
    // Convert h4 elements to anchor links
    navItems.forEach((item, index) => {
        const sectionId = sectionMap[index];
        const text = item.textContent.trim();
        
        // Create new anchor element
        const link = document.createElement('a');
        link.href = `#${sectionId}`;
        link.className = item.className;
        link.textContent = text;
        
        // Add click event for smooth scrolling
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close the menu
            toggleMenu(false);
            
            // Scroll to section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: targetSection,
                        offsetY: 0
                    },
                    ease: "power2.inOut"
                });
            }
        });
        
        // Replace the h4 with the anchor
        item.parentNode.replaceChild(link, item);
    });
    
    // Menu toggle function
    function toggleMenu(show) {
        if (show) {
            // Show menu
            menuContainer.classList.remove('hidden');
            menuContainer.classList.add('flex');
            
            // Animate in
            gsap.fromTo(menuContainer, 
                { opacity: 0 },
                { 
                    opacity: 1, 
                    duration: 0.3,
                    ease: "power1.out"
                }
            );
            
            // Blur the background
            document.body.style.overflow = 'hidden';
            
            // Add overlay to the body
            const overlay = document.createElement('div');
            overlay.id = 'menu-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            overlay.style.backdropFilter = 'blur(10px)';
            overlay.style.zIndex = '90';
            document.body.appendChild(overlay);
            
            // Add click event to close when clicking outside
            overlay.addEventListener('click', function() {
                toggleMenu(false);
            });
            
        } else {
            // Hide menu
            gsap.to(menuContainer, {
                opacity: 0,
                duration: 0.3,
                ease: "power1.in",
                onComplete: function() {
                    menuContainer.classList.add('hidden');
                    menuContainer.classList.remove('flex');
                }
            });
            
            // Remove overlay
            const overlay = document.getElementById('menu-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
            }
            
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }
    
    // Setup click events for menu toggle
    menuButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu(true);
    });
    
    menuCloseButton.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu(false);
    });
    
    // Ensure the start project buttons work correctly
    const projectButtons = document.querySelectorAll('a[href="#process"]');
    projectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: '#process',
                    offsetY: 0
                },
                ease: "power2.inOut"
            });
        });
    });
});