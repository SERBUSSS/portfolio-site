document.addEventListener('siteLoaded', function() {
    // Get references to important elements
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const header = document.getElementById('nav-bar');
    const navLinks = mobileNavContainer.querySelectorAll('a[href^="#"]');
    
    // Function to open the menu - simplified
    function openMenu(e) {
        if (e) e.preventDefault();
        
        // Simply show the menu with flex display
        mobileNavContainer.style.display = 'flex';
        mobileNavContainer.style.flexDirection = 'column';
        header.style.display = 'none';
        
        // Add a blur effect to the background
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('blur-sm', 'opacity-40');
        });
    }
    
    // Function to close the menu - simplified
    function closeMenu(e) {
        if (e) e.preventDefault();
        
        // Simply hide the menu
        mobileNavContainer.style.display = 'none';
        header.style.display = 'inline-flex';
        
        // Remove blur effect
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.remove('blur-sm', 'opacity-40');
        });
    }
    
    // Add event listeners
    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Close the menu
            closeMenu();
            
            // Scroll to the target section smoothly
            if (targetSection) {
                setTimeout(() => {
                    const offset = 100; // Adjust this value as needed
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100); // Small delay to ensure menu is closed first
            }
        });
    });

    // Special handling for the "Work with me" link
    const workWithMeLink = document.querySelector('a[href="#process"]');
    if (workWithMeLink) {
        workWithMeLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close the menu
            closeMenu();
            
            // Small delay to ensure menu is closed first
            setTimeout(() => {
                gsap.to(window, {
                    duration: 1, 
                    scrollTo: { y: "#process"},
                    ease: "power2.inOut"
                });
            }, 100);
        });
    }
    
    // Close menu when clicking outside of it
    document.addEventListener('click', function(e) {
        // If the click is outside the mobile nav container and the menu is open
        if (!mobileNavContainer.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            mobileNavContainer.style.display === 'flex') {
            closeMenu();
        }
    });
});