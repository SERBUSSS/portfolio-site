document.addEventListener('siteLoaded', function() {
    // Check if GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // Get the FAQ intro element
    const faqIntro = document.querySelector('#FAQ .inline-flex');
    
    // Get all question elements
    const questions = document.querySelectorAll('#FAQ [id^="q-"]');
    
    // Get all dividers
    const dividers = document.querySelectorAll('#FAQ [id="divider"]');
    
    /*
    console.log("FAQ Elements found:", {
        faqIntro: !!faqIntro,
        questions: questions.length,
        dividers: dividers.length
    });
    */
    
    // Make everything visible first (fallback)
    document.querySelectorAll('#FAQ *').forEach(el => {
        el.style.opacity = 1;
    });
    
    // Basic accordion functionality
    questions.forEach((question) => {
        const header = question.querySelector('div:first-child');
        const content = question.querySelector('div:nth-child(2)');
        const chevron = header.querySelector('img');
        
        if (!header || !content) return;
        
        // Store the original chevron src
        const defaultChevronSrc = chevron ? chevron.src : '';
        // Prepare the active chevron src by replacing the filename
        const activeChevronSrc = defaultChevronSrc.replace('Chev-down.svg', 'Chev-down-active.svg');
        
        // Initially hide content
        gsap.set(content, { height: 0, overflow: 'hidden' });
        
        // Add click event
        header.addEventListener('click', function() {
            // Toggle this question
            const isOpen = content.style.height !== '0px' && content.style.height !== '';
            
            if (isOpen) {
                // Close
                gsap.to(content, {
                    height: 0,
                    duration: 0.3
                });
                
                // Change chevron back to default
                if (chevron) {
                    chevron.src = defaultChevronSrc;
                }
            } else {
                // Close all others first
                questions.forEach(q => {
                    if (q !== question) {
                        const c = q.querySelector('div:nth-child(2)');
                        const chev = q.querySelector('div:first-child img');
                        if (c) gsap.to(c, { height: 0, duration: 0.3 });
                        if (chev) chev.src = defaultChevronSrc;
                    }
                });
                
                // Open this one
                gsap.set(content, { height: 'auto' });
                const height = content.offsetHeight;
                gsap.set(content, { height: 0 });
                gsap.to(content, {
                    height: height,
                    duration: 0.5
                });
                
                // Change chevron to active
                if (chevron) {
                    chevron.src = activeChevronSrc;
                }
            }
        });
    });
    
    // Open first question by default
    if (questions.length > 0) {
        const firstHeader = questions[0].querySelector('div:first-child');
        if (firstHeader) {
            setTimeout(() => {
                firstHeader.click();
            }, 500);
        }
    }
});
