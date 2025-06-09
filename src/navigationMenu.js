function initializeMobileMenu() {
    // Safer element selection with error checking
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const header = document.getElementById('nav-bar');
    
    // Early exit with logging if critical elements missing
    if (!menuToggle) {
        console.error('Menu toggle button not found');
        return;
    }
    if (!mobileNavContainer) {
        console.error('Mobile nav container not found');
        return;
    }
    if (!header) {
        console.error('Header element not found');
        return;
    }
    
    // Safe nav links selection AFTER confirming container exists
    const navLinks = mobileNavContainer.querySelectorAll('a[href^="#"]');
    
    function openMenu(e) {
        if (e) e.preventDefault();
        console.log('Opening menu'); // Debug log
        
        mobileNavContainer.style.display = 'flex';
        mobileNavContainer.style.flexDirection = 'column';
        header.style.display = 'none';
        
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('blur-sm', 'opacity-40');
        });
    }
    
    function closeMenu(e) {
        if (e) e.preventDefault();
        console.log('Closing menu'); // Debug log
        
        mobileNavContainer.style.display = 'none';
        header.style.display = 'inline-flex';
        
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.remove('blur-sm', 'opacity-40');
        });
    }
    
    // Add event listeners with error checking
    menuToggle.addEventListener('click', openMenu);
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    // Rest of your navigation logic...
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            closeMenu();
            
            if (targetSection) {
                setTimeout(() => {
                    const offset = 100;
                    const targetPosition = targetSection.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });
    
    // Outside click handler
    document.addEventListener('click', function(e) {
        if (!mobileNavContainer.contains(e.target) && 
            !menuToggle.contains(e.target) && 
            mobileNavContainer.style.display === 'flex') {
            closeMenu();
        }
    });
}

// Multiple initialization strategies for maximum compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileMenu);
} else {
    initializeMobileMenu();
}

// Keep your custom event as fallback
document.addEventListener('siteLoaded', initializeMobileMenu);

// Emergency timeout fallback for slow-loading pages
setTimeout(initializeMobileMenu, 1000);