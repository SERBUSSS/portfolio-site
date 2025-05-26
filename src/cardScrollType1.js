// Add these imports at the top of cardScrollType1.js
import { tooltipContent } from './tooltipContent.js';

// Add this class before your existing code
class ProjectTooltipManager {
    constructor(projectId) {
        this.projectId = projectId;
        this.tooltip = document.getElementById(`tooltip-${projectId}`);
        this.projectNameEl = document.getElementById(`tt-project-name-${projectId.split('-')[1]}`);
        this.descriptionEl = document.getElementById(`tt-card-description-${projectId.split('-')[1]}`);
        this.currentCardIndex = -1;
        this.isVisible = false;
        this.isTransitioning = false;
        this.content = tooltipContent[projectId];
        this.shouldBeVisible = false; // Track intended visibility state
        
        if (this.content) {
            this.projectNameEl.textContent = this.content.projectName;
        }
    }

    showTooltip(cardIndex) {
        if (!this.content.cards[cardIndex]) return;
        
        if (!this.isVisible && !this.isTransitioning) {
            this.isTransitioning = true;
            this.shouldBeVisible = true;
            
            this.tooltip.classList.remove('hidden');
            this.descriptionEl.textContent = this.content.cards[cardIndex];
            this.currentCardIndex = cardIndex;
            
            // Reset description opacity
            gsap.set(this.descriptionEl, { opacity: 1 });
            
            gsap.to(this.tooltip, {
                duration: 0.5,
                opacity: 1,
                ease: 'power2.out',
                onComplete: () => {
                    this.isVisible = true;
                    this.isTransitioning = false;
                }
            });
        }
    }

    updateDescription(cardIndex) {
        if (this.content.cards[cardIndex] && this.currentCardIndex !== cardIndex) {
            this.descriptionEl.textContent = this.content.cards[cardIndex];
            this.currentCardIndex = cardIndex;
        }
    }

    hideTooltip() {
        if (!this.isVisible || this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.shouldBeVisible = false;
        
        // Check if description is already faded out
        const currentOpacity = gsap.getProperty(this.descriptionEl, "opacity");
        
        if (currentOpacity <= 0.1) {
            // Description is already faded, hide tooltip immediately
            gsap.to(this.tooltip, {
                duration: 0.3,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    this.tooltip.classList.add('hidden');
                    this.isVisible = false;
                    this.isTransitioning = false;
                    this.currentCardIndex = -1;
                }
            });
        } else {
            // Fade description and tooltip together
            gsap.to([this.descriptionEl, this.tooltip], {
                duration: 0.4,
                opacity: 0,
                ease: 'power2.in',
                onComplete: () => {
                    this.tooltip.classList.add('hidden');
                    this.isVisible = false;
                    this.isTransitioning = false;
                    this.currentCardIndex = -1;
                }
            });
        }
    }

    // New method to handle card-based visibility
    handleCardTransition(activeCardIndex, totalCards) {
        // Only show tooltip for cards 1 through second-to-last
        const shouldShow = activeCardIndex >= 1 && activeCardIndex <= totalCards - 2;
        
        if (shouldShow && !this.isVisible && !this.isTransitioning) {
            // Should show and currently hidden - fade in
            this.showTooltip(activeCardIndex);
        } else if (!shouldShow && this.isVisible && !this.isTransitioning) {
            // Should hide and currently visible - fade out
            this.hideTooltip();
        }
        
        // Update shouldBeVisible to match current state
        this.shouldBeVisible = shouldShow;
    }
}

// Animation for project sections with hybrid horizontal scroll
window.addEventListener('load', function() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Select the project sections
    const projectSections = document.querySelectorAll('[id^="project-"]');
    
    // Map of project IDs to their corresponding background sections
    const backgroundMap = {
        'project-1': 'background-p-1',
        'project-2': 'background-p-2',
        'project-3': 'background-p-3',
        'project-4': 'background-p-4'
    };
    
    // Define final positions for up to 20 cards with complete transform data
    const finalPositions = [
        // Top curve - left to right - first row
        { x: '-30vw', y: '-30vh', rotation: -15, scale: 0.35, opacity: 1 },
        { x: '-15vw', y: '-35vh', rotation: -8, scale: 0.38, opacity: 1 },
        { x: '0vw', y: '-32vh', rotation: -3, scale: 0.4, opacity: 1 },
        { x: '15vw', y: '-30vh', rotation: 2, scale: 0.42, opacity: 1 },
        { x: '28vw', y: '-32vh', rotation: -2, scale: 0.4, opacity: 1 },
        
        // Right side curve - right to left - second row
        { x: '27vw', y: '-4vh', rotation: 2, scale: 0.38, opacity: 1 },
        { x: '14vw', y: '0vh', rotation: -5, scale: 0.36, opacity: 1 },
        { x: '2vw', y: '-2vh', rotation: 8, scale: 0.39, opacity: 1 },
        { x: '-13vw', y: '0vh', rotation: -2, scale: 0.41, opacity: 1 },
        { x: '-29vw', y: '4vh', rotation: 8, scale: 0.43, opacity: 1 },
        
        // Bottom curve - letf to right - third row
        { x: '-28vw', y: '28vh', rotation: 5, scale: 0.4, opacity: 1 },
        { x: '-16vw', y: '26vh', rotation: 2, scale: 0.42, opacity: 1 },
        { x: '-4vw', y: '27vh', rotation: -2, scale: 0.44, opacity: 1 },
        { x: '15vw', y: '25vh', rotation: -5, scale: 0.42, opacity: 1 },
        { x: '29vw', y: '27vh', rotation: -8, scale: 0.4, opacity: 1 },
        
        // Left side curve - bottom to top
        { x: '2vw', y: '30vh', rotation: -9, scale: 0.38, opacity: 1 },
        { x: '0vw', y: '5vh', rotation: -10, scale: 0.36, opacity: 1 },
        { x: '-3vw', y: '-10vh', rotation: 8, scale: 0.39, opacity: 1 },
        { x: '1vw', y: '-25vh', rotation: -12, scale: 0.41, opacity: 1 },
        
        // This will be overridden for the last card
        { x: '0vw', y: '0vh', rotation: -8, scale: 0.8, opacity: 1 }
    ];
    
    // Track horizontal scroll for each section
    let horizontalScrollData = {};
    
    // Process each project section
    projectSections.forEach(section => {
        const sectionCards = section.querySelectorAll('.item');
        const sectionId = section.id;
        
        // Only initialize if we have cards to work with
        if (!sectionCards.length) return;
        
        // Initialize horizontal scroll tracking for this section
        horizontalScrollData[sectionId] = {
            scrollX: 0,
            isActive: false,
            maxScroll: sectionCards.length * 120 // Adjust multiplier as needed
        };
        
        // Get background section if one is mapped
        const backgroundId = backgroundMap[sectionId];
        const backgroundElement = backgroundId ? document.getElementById(backgroundId) : null;
        
        // If we have a background element for this section
        if (backgroundElement) {
            // Style the background element
            gsap.set(backgroundElement, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: -1
            });
            
            // Clone and insert the background into the project section
            const bgClone = backgroundElement.cloneNode(true);
            bgClone.id = `${backgroundId}-clone`;
            bgClone.style.position = 'absolute';
            bgClone.style.zIndex = '-1';
            section.insertBefore(bgClone, section.firstChild);
            
            // Hide the original background section
            backgroundElement.style.display = 'none';
        }
        
        // Set initial states for cards
        sectionCards.forEach(card => {
            gsap.set(card, { 
                x: window.innerWidth, // Start from right side of screen
                y: -window.innerHeight * 0.1, // Slightly above center
                scale: 1,
                opacity: 0,
                rotation: 0
            });
        });
        
        // Create ScrollTrigger for section pinning only
        ScrollTrigger.create({
            trigger: section,
            pin: true,
            start: "top 5%",
            end: "+=25%", // Reduced from 30% for faster exit
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
        });
        
        // Add horizontal scroll listener when section is active
        const addHorizontalScrollListener = () => {
            const handleHorizontalScroll = (e) => {
                if (!horizontalScrollData[sectionId].isActive) return;
                
                e.preventDefault();
                
                // Update horizontal scroll position
                const delta = e.deltaX || e.deltaY; // Handle both horizontal and vertical wheel
                horizontalScrollData[sectionId].scrollX += delta * 0.7; // Adjust sensitivity
                
                // Clamp scroll position
                horizontalScrollData[sectionId].scrollX = Math.max(0, 
                    Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll)
                );
                
                // Calculate progress and update animation
                const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
                updateHorizontalAnimation(sectionId, progress, sectionCards);
            };
            
            // Add wheel event listener
            section.addEventListener('wheel', handleHorizontalScroll, { passive: false });
            
            // Add touch events for mobile
            let touchStartX = 0;
            let touchStartY = 0;
            
            section.addEventListener('touchstart', (e) => {
                if (!horizontalScrollData[sectionId].isActive) return;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            section.addEventListener('touchmove', (e) => {
                if (!horizontalScrollData[sectionId].isActive) return;
                
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const deltaX = touchStartX - touchX;
                const deltaY = touchStartY - touchY;
                
                // Only handle horizontal swipes (more horizontal than vertical movement)
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    e.preventDefault();
                    
                    horizontalScrollData[sectionId].scrollX += deltaX * 0.5;
                    horizontalScrollData[sectionId].scrollX = Math.max(0, 
                        Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll)
                    );
                    
                    const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
                    updateHorizontalAnimation(sectionId, progress, sectionCards);
                    
                    touchStartX = touchX;
                    touchStartY = touchY;
                }
            }, { passive: false });
        };
        
        // Add horizontal scroll functionality
        addHorizontalScrollListener();
        
        // Set section as active when it's pinned
        ScrollTrigger.create({
            trigger: section,
            start: "top 5%",
            end: "+=25%",
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            onEnter: () => {
                horizontalScrollData[sectionId].isActive = true;
                toggleNavigation(false); // Hide nav
            },
            onLeave: () => {
                horizontalScrollData[sectionId].isActive = false;
                toggleNavigation(true); // Show nav
            },
            onEnterBack: () => {
                horizontalScrollData[sectionId].isActive = true;
                toggleNavigation(false); // Hide nav
            },
            onLeaveBack: () => {
                horizontalScrollData[sectionId].isActive = false;
                toggleNavigation(true); // Show nav
            }
        });
    });

    // Initialize tooltip managers
    const tooltipManagers = {};
    projectSections.forEach(section => {
        const sectionId = section.id;
        tooltipManagers[sectionId] = new ProjectTooltipManager(sectionId);
    });
    
    // Function to update horizontal animation based on progress
    function updateHorizontalAnimation(sectionId, progress, cards) {
        const totalCards = cards.length;
        const progressPerCard = 0.9 / totalCards;
        const tooltipManager = tooltipManagers[sectionId];
        
        // Get viewport dimensions for calculations
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        
        cards.forEach((card, index) => {
            const cardStartProgress = index * progressPerCard;
            const cardEndProgress = (index + 1) * progressPerCard;
            const isLastCard = index === cards.length - 1;
            
            if (progress >= cardStartProgress) {
                const cardProgress = Math.min(1, (progress - cardStartProgress) / progressPerCard);
                
                // Tooltip logic
                if (tooltipManager && index >= 1 && index <= cards.length - 2) {
                const isActiveCard = progress >= cardStartProgress && progress < cardEndProgress;
                
                if (isActiveCard) {
                    // Update description if needed
                    if (tooltipManager.currentCardIndex !== index) {
                        tooltipManager.updateDescription(index);
                    }
                    
                    // Handle description opacity based on card progress
                    if (cardProgress >= 0.05 && cardProgress <= 0.95) {
                        if (cardProgress >= 0.05 && cardProgress <= 0.1) {
                            const fadeProgress = (cardProgress - 0.05) / 0.05;
                            gsap.set(tooltipManager.descriptionEl, { opacity: fadeProgress });
                            // If this is the first tooltip card (index 1) and we're fading in from card 0
                            if (index === 1) {
                                gsap.set(tooltipManager.tooltip, { opacity: fadeProgress });
                            }
                        } else if (cardProgress > 0.1 && cardProgress < 0.9) {
                            gsap.set(tooltipManager.descriptionEl, { opacity: 1 });
                            gsap.set(tooltipManager.tooltip, { opacity: 1 });
                        } else if (cardProgress >= 0.9 && cardProgress <= 0.95) {
                            const fadeProgress = 1 - ((cardProgress - 0.9) / 0.05);
                            gsap.set(tooltipManager.descriptionEl, { opacity: fadeProgress });
                            // If this is the last tooltip card (second-to-last overall card) and we're fading out to last card
                            if (index === cards.length - 2) {
                                gsap.set(tooltipManager.tooltip, { opacity: fadeProgress });
                            }
                        }
                    } else {
                        gsap.set(tooltipManager.descriptionEl, { opacity: 0 });
                        // Fade out tooltip on edge cases
                        if (index === 1 || index === cards.length - 2) {
                            gsap.set(tooltipManager.tooltip, { opacity: 0 });
                        }
                    }
                }
            }
                
                // Your existing card animation code stays the same here...
                if (cardProgress <= 0.6) {
                    // Step 1: Slide in from right to center
                    const slideProgress = cardProgress / 0.6;
                    const startX = 100 * vw;
                    const endX = 0;
                    const currentX = startX + (endX - startX) * slideProgress;
                    
                    gsap.set(card, {
                        x: currentX,
                        y: -10 * vh,
                        scale: 1,
                        opacity: slideProgress,
                        rotation: 0
                    });
                } else {
                    // Step 2: Move to final position
                    const finalProgress = (cardProgress - 0.6) / 0.4;
                    
                    let finalPos;
                    if (isLastCard) {
                        finalPos = { x: '0vw', y: '0vh', rotation: 0, scale: 0.8, opacity: 1 };
                    } else {
                        finalPos = finalPositions[index % finalPositions.length];
                    }
                    
                    const finalX = parseFloat(finalPos.x) * vw;
                    const finalY = parseFloat(finalPos.y) * vh;
                    
                    const currentX = 0 + (finalX - 0) * finalProgress;
                    const currentY = (-10 * vh) + (finalY - (-10 * vh)) * finalProgress;
                    const currentScale = 1 + (finalPos.scale - 1) * finalProgress;
                    const currentOpacity = 1 + (finalPos.opacity - 1) * finalProgress;
                    const currentRotation = 0 + (finalPos.rotation - 0) * finalProgress;
                    
                    gsap.set(card, {
                        x: currentX,
                        y: currentY,
                        scale: currentScale,
                        opacity: currentOpacity,
                        rotation: currentRotation
                    });
                }
            } else {
                // Card hasn't started animating yet
                gsap.set(card, {
                    x: 100 * vw,
                    y: -10 * vh,
                    scale: 1,
                    opacity: 0,
                    rotation: 0
                });
            }
        });

        // Handle tooltip visibility ONCE per frame outside the loop
        if (tooltipManager) {
            const currentActiveCard = Math.floor(progress / progressPerCard);
            const shouldShow = currentActiveCard >= 1 && currentActiveCard <= cards.length - 2;
            
            if (shouldShow && !tooltipManager.isVisible && !tooltipManager.isTransitioning) {
                tooltipManager.showTooltip(currentActiveCard);
            } else if (!shouldShow && tooltipManager.isVisible && !tooltipManager.isTransitioning) {
                tooltipManager.hideTooltip();
            }
        }
    }

    function toggleNavigation(show) {
        const headerContainer = document.getElementById('nav-bar-cont');
        if (headerContainer) {
            gsap.to(headerContainer, {
                opacity: show ? 1 : 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }
});