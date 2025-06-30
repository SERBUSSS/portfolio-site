// COMPLETE REWRITE of containerScrollManager.js
// Focus on seamless integration without extra scrollbars

let containerState = {
    isActive: false,
    currentSection: null,
    sections: [],
    isPinned: false
};

class ContainerScrollManager {
    constructor() {
        this.container = document.querySelector('.projects-container');
        this.sections = Array.from(this.container.querySelectorAll('.project-section'));
        this.scrollTriggerInstance = null;
        this.currentSectionIndex = 0;
        
        this.init();
    }

    init() {
        // Make container seamless - remove internal scrolling
        this.setupSeamlessContainer();
        this.setupScrollTrigger();
    }

    setupSeamlessContainer() {
        // Remove container's own scrolling ability
        gsap.set(this.container, {
            overflow: 'visible',
            height: 'auto',
            scrollSnapType: 'none'
        });

        // Position sections normally in document flow initially
        this.sections.forEach((section, index) => {
            gsap.set(section, {
                position: 'relative',
                height: '100vh',
                width: '100%'
            });
        });
    }

    setupScrollTrigger() {
        // Pin the entire container when it reaches viewport top
        this.scrollTriggerInstance = ScrollTrigger.create({
            trigger: this.container,
            pin: true,
            start: "top top",
            end: `+=${this.sections.length * 100}vh`, // Total height for all sections
            scrub: false,
            onEnter: () => this.enterContainer(),
            onLeave: () => this.exitContainer(),
            onUpdate: (self) => this.handleContainerScroll(self)
        });
    }

    enterContainer() {
        console.log('Entering container');
        containerState.isActive = true;
        containerState.isPinned = true;
        
        // Convert sections to absolute positioning for manual control
        this.sections.forEach((section, index) => {
            gsap.set(section, {
                position: 'absolute',
                top: '0%',
                left: '0%',
                width: '100%',
                height: '100vh',
                zIndex: index === 0 ? 10 : 1
            });
        });

        // Start with first section
        this.snapToSection(0);
    }

    exitContainer() {
        console.log('Exiting container');
        containerState.isActive = false;
        containerState.isPinned = false;
        
        // Restore normal document flow
        this.sections.forEach((section) => {
            gsap.set(section, {
                position: 'relative',
                top: 'auto',
                left: 'auto',
                zIndex: 'auto'
            });
        });
    }

    handleContainerScroll(self) {
        if (!containerState.isPinned) return;
        
        // Calculate which section should be active based on scroll progress
        const progress = self.progress;
        const sectionIndex = Math.floor(progress * this.sections.length);
        const clampedIndex = Math.max(0, Math.min(this.sections.length - 1, sectionIndex));
        
        if (clampedIndex !== this.currentSectionIndex) {
            this.snapToSection(clampedIndex);
        }
    }

    snapToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        const prevIndex = this.currentSectionIndex;
        this.currentSectionIndex = index;
        const activeSection = this.sections[index];
        const sectionId = activeSection.id;
        
        console.log(`Snapping to section: ${sectionId}`);
        
        // Hide all sections first
        this.sections.forEach((section, i) => {
            if (i !== index) {
                gsap.set(section, { 
                    zIndex: 1,
                    opacity: 0,
                    pointerEvents: 'none'
                });
                
                // Deactivate section
                if (section.id.startsWith('project-')) {
                    this.deactivateProjectSection(section.id);
                }
            }
        });
        
        // Show active section
        gsap.set(activeSection, { 
            zIndex: 10,
            opacity: 1,
            pointerEvents: 'auto'
        });
        
        // Update state
        containerState.currentSection = sectionId;
        
        // Activate section
        if (sectionId.startsWith('project-')) {
            this.activateProjectSection(sectionId);
        } else if (sectionId === 'process') {
            this.activateProcessSection();
        }
        
        // Handle navigation visibility
        this.updateNavigation(sectionId);
    }

    activateProjectSection(sectionId) {
        console.log(`Activating project section: ${sectionId}`);
        
        // Activate horizontal scroll
        if (window.horizontalScrollData && window.horizontalScrollData[sectionId]) {
            window.horizontalScrollData[sectionId].isActive = true;
        }
        
        // Activate scroll zones
        if (window.activateScrollZones) {
            window.activateScrollZones(sectionId);
        }
        
        // Show auto preview after delay
        setTimeout(() => {
            if (window.showAutoPreview && containerState.currentSection === sectionId) {
                const section = document.getElementById(sectionId);
                const cards = section.querySelectorAll('.item');
                if (cards.length > 0) {
                    window.showAutoPreview(sectionId, Array.from(cards));
                }
            }
        }, 500);
    }

    deactivateProjectSection(sectionId) {
        // Deactivate horizontal scroll
        if (window.horizontalScrollData && window.horizontalScrollData[sectionId]) {
            window.horizontalScrollData[sectionId].isActive = false;
        }
        
        // Deactivate scroll zones
        if (window.deactivateScrollZones) {
            window.deactivateScrollZones(sectionId);
        }
        
        // Hide navigation
        if (window.hideNavigation) {
            window.hideNavigation(sectionId);
        }
    }

    activateProcessSection() {
        console.log('Activating process section');
        // Process section activation will be handled by cardScrollType2.js
        // when it detects container state
    }

    updateNavigation(sectionId) {
        const headerContainer = document.getElementById('nav-bar-cont');
        if (!headerContainer) return;
        
        if (sectionId.startsWith('project-')) {
            // Hide navbar for project sections (tooltips need space)
            gsap.to(headerContainer, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        } else if (sectionId === 'process') {
            // Show navbar for process section
            gsap.to(headerContainer, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }

    // Public methods for external navigation
    navigateToSection(direction) {
        let targetIndex;
        
        if (direction === 'next') {
            targetIndex = Math.min(this.currentSectionIndex + 1, this.sections.length - 1);
        } else if (direction === 'prev') {
            targetIndex = Math.max(this.currentSectionIndex - 1, 0);
        }
        
        if (targetIndex !== undefined && targetIndex !== this.currentSectionIndex) {
            this.snapToSection(targetIndex);
        }
        
        // Check if we should exit container
        if (direction === 'next' && this.currentSectionIndex === this.sections.length - 1) {
            // At last section, check if process animation is complete
            if (window.processState?.cardsInFinalPosition) {
                this.exitContainerToPage();
            }
        } else if (direction === 'prev' && this.currentSectionIndex === 0) {
            // At first section, exit container upward
            this.exitContainerToPage();
        }
    }

    exitContainerToPage() {
        // Force exit from pinned state
        if (this.scrollTriggerInstance) {
            // Calculate position to unpin
            const scrollY = this.scrollTriggerInstance.start - 100;
            gsap.to(window, {
                scrollTo: scrollY,
                duration: 0.8,
                ease: "power2.inOut"
            });
        }
    }

    // Method for process section to signal completion
    setProcessAnimationComplete(isComplete) {
        if (window.processState) {
            window.processState.cardsInFinalPosition = isComplete;
        }
        
        if (isComplete && containerState.currentSection === 'process') {
            // Allow navigation to exit
            console.log('Process animation complete - ready to exit');
        }
    }
}

// Initialize when site loads
window.addEventListener('siteLoaded', function() {
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        window.containerScrollManager = new ContainerScrollManager();
        window.containerState = containerState;
    }
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContainerScrollManager, containerState };
}