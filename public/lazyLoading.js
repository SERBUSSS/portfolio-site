// Add this as the FIRST line in src/lazyLoading.js
console.log('🔥 LAZY LOADING SCRIPT LOADED - Production Debug');
console.log('Environment:', window.location.hostname);


document.addEventListener('DOMContentLoaded', function() {
    console.log('Lazy loading script started'); // Debug log
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // console.log('Loading image:', img.dataset.src); // Debug log
                
                // Handle picture sources first
                const picture = img.closest('picture');
                if (picture) {
                    const sources = picture.querySelectorAll('source[data-srcset]');
                    sources.forEach(source => {
                        if (source.dataset.srcset) {
                            source.srcset = source.dataset.srcset;
                            source.removeAttribute('data-srcset');
                        }
                    });
                }
                
                // Then handle the img tag
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Add loaded class for CSS transitions
                img.addEventListener('load', () => {
                    img.classList.add('lazy-loaded');
                });
                
                // Handle load errors
                img.addEventListener('error', () => {
                    console.error('Failed to load image:', img.src);
                    img.classList.add('lazy-error');
                });
                
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Find and observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]');
    // console.log('Found lazy images:', lazyImages.length); // Debug log
    
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});