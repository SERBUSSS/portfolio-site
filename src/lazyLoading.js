// src/lazyLoading.js
document.addEventListener('DOMContentLoaded', function() {
    // Create intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Load the image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Load srcset if available
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                    img.removeAttribute('data-srcset');
                }
                
                // Handle picture sources
                const picture = img.closest('picture');
                if (picture) {
                    const sources = picture.querySelectorAll('source[data-srcset]');
                    sources.forEach(source => {
                        source.srcset = source.dataset.srcset;
                        source.removeAttribute('data-srcset');
                    });
                }
                
                // Remove loading class and add loaded class
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                
                // Stop observing this image
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // Start loading 50px before image comes into view
    });

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        // Add loading class for styling
        img.classList.add('lazy-loading');
        
        // Start observing
        imageObserver.observe(img);
    });
});