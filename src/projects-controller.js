// Projects Animation Controller - Phase 1: Foundation Setup

const cardPositions = {
    'project-1': {
        desktop: [
            { x: '-20', y: '-20', rotation: -30, scale: 0.7, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.8, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.8, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.8, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.82, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.81, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.78, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.8, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.82, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.79, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.8, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.8, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.82, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.8, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.78, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.8, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.8, opacity: 1 }
        ],
        mobile: [
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.65, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.7, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.7, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.65, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.65, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.67, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.55, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.5, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.5, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ]
    },
    'project-2': { 
        desktop: [
            // Different layout for project 2 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ], 
        mobile: [
            // Different layout for project 2 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ] 
    },
    'project-3': { 
        desktop: [
            // Tighter spiral layout for project 3
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ], 
        mobile: [
            // Tighter spiral layout for project 3
            { x: '-20', y: '-20', rotation: -30, scale: 0.45, opacity: 1 },
            { x: '0', y: '-25', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '20', y: '-20', rotation: 30, scale: 0.45, opacity: 1 },
            { x: '25', y: '0', rotation: 25, scale: 0.55, opacity: 1 },
            { x: '20', y: '20', rotation: 20, scale: 0.5, opacity: 1 },
            { x: '0', y: '25', rotation: 0, scale: 0.55, opacity: 1 },
            { x: '-20', y: '20', rotation: -20, scale: 0.5, opacity: 1 },
            { x: '-25', y: '0', rotation: -25, scale: 0.55, opacity: 1 },
            { x: '-10', y: '-10', rotation: -35, scale: 0.4, opacity: 1 },
            { x: '10', y: '-10', rotation: 35, scale: 0.4, opacity: 1 },
            { x: '15', y: '5', rotation: 22, scale: 0.52, opacity: 1 },
            { x: '5', y: '15', rotation: 10, scale: 0.51, opacity: 1 },
            { x: '-5', y: '15', rotation: -10, scale: 0.51, opacity: 1 },
            { x: '-15', y: '5', rotation: -22, scale: 0.52, opacity: 1 },
            { x: '-5', y: '-15', rotation: -28, scale: 0.43, opacity: 1 },
            { x: '5', y: '-15', rotation: 28, scale: 0.43, opacity: 1 },
            { x: '0', y: '10', rotation: 0, scale: 0.53, opacity: 1 }
        ] 
    },
    'project-4': { 
        desktop: [
            // Different layout for project 4 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ], 
        mobile: [
            // Different layout for project 4 - maybe more circular
            { x: '-25', y: '-25', rotation: -20, scale: 0.4, opacity: 1 },
            { x: '0', y: '-30', rotation: 0, scale: 0.45, opacity: 1 },
            { x: '25', y: '-25', rotation: 20, scale: 0.4, opacity: 1 },
            { x: '30', y: '0', rotation: 15, scale: 0.5, opacity: 1 },
            { x: '25', y: '25', rotation: 10, scale: 0.45, opacity: 1 },
            { x: '0', y: '30', rotation: 0, scale: 0.5, opacity: 1 },
            { x: '-25', y: '25', rotation: -10, scale: 0.45, opacity: 1 },
            { x: '-30', y: '0', rotation: -15, scale: 0.5, opacity: 1 },
            // Add more positions as needed for project 2
            { x: '-15', y: '-15', rotation: -25, scale: 0.4, opacity: 1 },
            { x: '15', y: '-15', rotation: 25, scale: 0.4, opacity: 1 },
            { x: '20', y: '10', rotation: 12, scale: 0.48, opacity: 1 },
            { x: '10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-10', y: '20', rotation: 0, scale: 0.47, opacity: 1 },
            { x: '-20', y: '10', rotation: -12, scale: 0.48, opacity: 1 },
            { x: '-15', y: '-5', rotation: -18, scale: 0.46, opacity: 1 },
            { x: '15', y: '-5', rotation: 18, scale: 0.46, opacity: 1 },
            { x: '0', y: '15', rotation: 0, scale: 0.49, opacity: 1 },
            { x: '8', y: '-20', rotation: 8, scale: 0.42, opacity: 1 },
            { x: '-8', y: '-20', rotation: -8, scale: 0.42, opacity: 1 }
        ] 
    },
    'process': {
        desktop: [
            { x: 0, y: -15, scale: 0.9, opacity: 1, rotation: -2 },
            { x: 0, y: -5, scale: 0.95, opacity: 1, rotation: 1 },
            { x: 0, y: 5, scale: 0.92, opacity: 1, rotation: -1 },
            { x: 0, y: 15, scale: 0.88, opacity: 1, rotation: 2 }
        ],
        mobile: [
            { x: 0, y: -15, scale: 0.95, opacity: 1, rotation: -1 },
            { x: 0, y: -5, scale: 1.0, opacity: 1, rotation: 0 },
            { x: 0, y: 5, scale: 0.97, opacity: 1, rotation: 1 },
            { x: 0, y: 15, scale: 0.93, opacity: 1, rotation: -1 }
        ]
    }
};

const TOOLTIP_DATA = {
  "project-1": [
    { name: "Si Punct Media", description: "Card 1 desc..." },
    { name: "Another Project", description: "Card 2 desc..." }
  ],
  // etc.
};

const tooltipContent = {
  'project-1': {
    projectName: 'Si Punct Media',
    cards: [
      null, // Index 0 - no tooltip (brief card)
      'Brand logo and identity design',
      'Brand color palette showcase',
      'Typography selection',
      'Social media toolkit landing page, hero section design',
      'Product introduction and benefits overview',
      'Detailed breakdown of toolkit contents and services',
      'Bonus materials and brand customization documents',
      'Success guide for client acquisition strategies',
      'Pricing and package details presentation',
      'Lead magnet and email capture system',
      'Client proposal document cover page design',
      'Client proposal document pricing pages design',
      'Client proposal document customer reviews design',
      '8-Step checklist for a successful discovery call'
    ]
  },
  'project-2': {
    projectName: 'EnergNature',
    cards: [
      null, // Index 0 - no tooltip
      'Brand logomark',
      'Brand logo and identity design',
      'Typography selection',
      'Product page low-fidelity design, key sections (desktop - 1)',
      'Product page low-fidelity design, key sections (desktop - 2)',
      'Product page low-fidelity design, key sections (desktop - 3)',
      'Product page low-fidelity design, key sections (desktop - 4)',
      'Product page high-fidelity design, key sections (desktop - 1)',
      'Product page high-fidelity design, key sections (desktop - 2)',
      'Product page high-fidelity design, key sections (desktop - 3)',
      'Product page high-fidelity design, key sections (desktop - 4)',
      'Product page high-fidelity design, key sections (desktop - 5)',
      'Product page high-fidelity design, key sections (desktop - 6)',
      'Product page high-fidelity design, key sections (mobile - 1)',
      'Product page high-fidelity design, key sections (mobile - 2)',
      'Product page high-fidelity design, key sections (mobile - 3)',
      'Product page high-fidelity design, key sections (mobile - 4)',
      'Enhanced product creative to boost cart value'
    ]
  },
  'project-3': {
    projectName: 'A&D Performance',
    cards: [
      null, // Index 0 - no tooltip
      'Header Navigation Menu Enhancement',
      'Shopping Cart Interface Redesign',
      'Checkout Process Optimization',
      'Homepage One-Time Offer Integration',
      'Turkesterone Product Page Redesign',
      'Subscription-Optimized Product Page Layout',
      'Purchase Interface for Subscription Conversion',
      'Height Enhancement Marketing Campaign (1)',
      'Height Enhancement Marketing Campaign (2)',
      'Height Enhancement Marketing Campaign (3)', 
      'Height Enhancement Marketing Campaign (4)',
      'Strength Enhancement Marketing Campaign (1)',
      'Strength Enhancement Marketing Campaign (2)',
      'Strength Enhancement Marketing Campaign (3)',
      'Strength Enhancement Marketing Campaign (4)'
    ]
  },
  'project-4': {
    projectName: 'Casamare',
    cards: [
      null, // Index 0 - no tooltip
      'Brand logo design',
      'Typography system and font selection',
      'Brand color palette showcase',
      'New user registration flow wireframe concept',
      'Email signup process wireframe design',
      'Account creation workflow wireframe structure',
      'Homepage layout wireframe (1)',
      'Homepage layout wireframe (2)',
      'Product page wireframe structure and flow',
      'New user registration high-fidelity interface',
      'Email signup process high-fidelity design',
      'Account creation workflow high-fidelity interface',
      'Homepage high-fidelity design (1)',
      'Homepage high-fidelity design (2)',
      'Product page high-fidelity design and layout',
      'Shopping cart interface high-fidelity design',
      'Checkout process steps 1-2: contact and shipping information',
      'Checkout process step 3: payment and billing interface'
    ]
  }
};

class ProjectsController {
  constructor() {
    // Core properties
    this.container = document.querySelector('.projects-container');
    this.sections = Array.from(document.querySelectorAll('.section'));
    this.projectSections = Array.from(document.querySelectorAll('.project-section'));
    this.processSection = document.querySelector('#process');
    
    // State management
    this.isLocked = false;
    this.currentSectionIndex = 0;
    this.deviceType = this.getDeviceType();
    this.scrollPosition = 0;
    
    // Card collections per section
    this.sectionCards = {};
    this.cardStates = {};
    
    // Animation states
    this.animationProgress = {};
    this.currentAnimatingCard = {};

    // Phase 2 properties
    this.scrollAccumulator = { x: 0, y: 0 }
    this.scrollThreshold = 100 // pixels needed for one card animation
    this.lastScrollTime = 0
    this.scrollDebounceDelay = 16 // ~60fps

    // Phase 3: Animation properties
    this.cardAnimator = null;
    this.animationQueue = [];
    this.isAnimating = false;

    // Initialize
    this.init();    

    // Initialize after existing Phase 1 init
    this.initScrollManagement();

    this.initAnimationEngine();
  }
  
  init() {
    // Set up card collections
    this.initializeCards();
    
    // Set up device detection
    this.setupDeviceDetection();
    
    // Set up container locking
    this.setupContainerLocking();
    
    // Set initial states
    this.setInitialStates();
    
    console.log('ProjectsController initialized', {
      sections: this.sections.length,
      cards: this.sectionCards,
      device: this.deviceType
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const direction = e.currentTarget.dataset.direction;
        const container = e.currentTarget.closest('.project-tooltip-container');
        const sectionId = container?.dataset.projectId;
        const section = document.getElementById(sectionId);
        
        if (section && direction) {
          controller.animateNextCard(section, direction);
        }
      });
    });
  }
  
  initializeCards() {
    this.sections.forEach(section => {
      const sectionId = section.id;
      const container = section.querySelector('.cards-container');
      
      if (container) {
        const cards = Array.from(container.querySelectorAll('.item.card'));
        
        // Store cards reference
        this.sectionCards[sectionId] = cards;
        
        // Initialize states for each card
        this.cardStates[sectionId] = cards.map((card, index) => ({
          index,
          progress: 0,
          isCompleted: false,
          isAnimating: false
        }));
        
        // Add data attributes if not present
        cards.forEach((card, index) => {
          if (!card.hasAttribute('data-card-index')) {
            card.setAttribute('data-card-index', index);
          }
        });
        
        // Set total cards on container
        container.setAttribute('data-total-cards', cards.length);
      }
    });
  }

  initAnimationEngine() {
    console.log('[ProjectsController] Initializing animation engine');
    this.cardAnimator = new CardAnimator(this);
  }
  
  setupDeviceDetection() {
    // Set initial device class
    this.updateDeviceType();
    
    // Update on resize (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newDeviceType = this.getDeviceType();
        if (newDeviceType !== this.deviceType) {
          this.deviceType = newDeviceType;
          this.updateDeviceType();
          this.handleDeviceChange();
        }
      }, 250);
    });
  }
  
  getDeviceType() {
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  }
  
  updateDeviceType() {
    document.body.classList.remove('is-mobile', 'is-desktop');
    document.body.classList.add(`is-${this.deviceType}`);
  }
  
  handleDeviceChange() {
    console.log('Device changed to:', this.deviceType);
    // Re-apply positions for cards that are already animated
    // This will be implemented in animation phase
  }
  
  setupContainerLocking() {
    // Main scroll listener
    window.addEventListener('scroll', this.handlePageScroll.bind(this));
  }
  
  handlePageScroll() {
    const containerRect = this.container.getBoundingClientRect();
    
    // Check if we should lock the container
    if (!this.isLocked && containerRect.top <= 0) {
      this.lockContainer();
    }
    
    // Store scroll position for unlock calculations
    if (!this.isLocked) {
      this.scrollPosition = window.pageYOffset;
    }
  }
  
  lockContainer() {
    // Store current scroll position
    this.lockScrollPosition = window.pageYOffset;
    
    // Calculate offset to maintain visual position
    const containerTop = this.container.offsetTop;
    this.scrollOffset = this.lockScrollPosition - containerTop;
    
    // Apply locked state
    this.container.classList.add('locked');
    this.isLocked = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.lockScrollPosition}px`;
    document.body.style.width = '100%';
    
    console.log('Container locked at scroll position:', this.lockScrollPosition);
    
    // Enable internal scrolling (will be implemented in scroll management phase)
    this.enableInternalScroll();
  }
  
  unlockContainer() {
    // Remove locked state
    this.container.classList.remove('locked');
    this.isLocked = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Calculate where to scroll to maintain visual continuity
    const unlockScrollPosition = this.calculateUnlockPosition();
    window.scrollTo(0, unlockScrollPosition);
    
    console.log('Container unlocked, scrolling to:', unlockScrollPosition);
    
    // Disable internal scrolling
    this.disableInternalScroll();

    this.fadeTooltip(this.getCurrentSection().id, false);
  }
  
  calculateUnlockPosition() {
    // This will be refined based on process section completion
    // For now, return to where we locked + container height
    return this.lockScrollPosition + this.container.offsetHeight;
  }
  
  enableInternalScroll() {
    // Placeholder for internal scroll system
    // Will be implemented in Phase 2
    console.log('Internal scroll enabled');
  }
  
  disableInternalScroll() {
    // Placeholder for internal scroll system
    // Will be implemented in Phase 2
    console.log('Internal scroll disabled');
  }
  
  setInitialStates() {
    // Mark first section as active
    this.sections[0].classList.add('active-section');
    
    // Set initial positions for all cards (already done by CSS)
    // Additional setup will be added as needed
  }
  
  // Utility method to get current active section
  getCurrentSection() {
    return this.sections[this.currentSectionIndex];
  }
  
  // Method to check if section is process section
  isProcessSection(section) {
    return section.id === 'process';
  }

  initScrollManagement() {
    console.log('[ProjectsController] Initializing scroll management')
    
    // Create drag handler for locked container
    this.dragHandler = new DragHandler(
      this.container,
      this.handleScroll.bind(this)
    )
    
    // Add wheel event listener
    this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false })
    
    console.log('[ProjectsController] Scroll management initialized')
  }

  handleWheel(e) {
    if (!this.isLocked) return
    
    e.preventDefault()
    const now = Date.now()
    
    // Debounce for performance
    if (now - this.lastScrollTime < this.scrollDebounceDelay) return
    this.lastScrollTime = now
    
    // Determine scroll direction
    const direction = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? 'horizontal' : 'vertical'
    const delta = direction === 'horizontal' ? e.deltaX : e.deltaY
    
    console.log('[Wheel Event]', { direction, delta, deltaX: e.deltaX, deltaY: e.deltaY })
    
    this.handleScroll(delta, direction)
  }

  handleScroll(delta, direction) {
    if (!this.isLocked) {
      console.log('[handleScroll] Container not locked, ignoring scroll')
      return
    }
    
    const activeSection = this.getActiveSection()
    if (!activeSection) {
      console.log('[handleScroll] No active section found')
      return
    }
    
    console.log('[handleScroll]', {
      delta,
      direction,
      activeSection: activeSection.id,
      isProjectSection: activeSection.classList.contains('project-section'),
      isProcessSection: activeSection.classList.contains('scroll-section-2')
    })
    
    // Route to appropriate handler
    if (this.scrollMode === 'section') {
      this.handleVerticalSectionScroll(delta);
    } else if (this.scrollMode === 'cards') {
      this.handleHorizontalScroll(delta, activeSection);
    }

    if (this.isProcessSection(activeSection)) {
      const firstCardState = this.cardStates['process'][0];
      if (firstCardState.progress > 0 && direction === 'vertical') {
        // Lock to process scroll
        this.handleVerticalScroll(delta, activeSection);
        return;
      }
      if (firstCardState.progress === 0 && delta < 0) {
        this.unlockContainer();
        return;
      }
    }
  }

  handleHorizontalScroll(delta, section) {
    console.log('[handleHorizontalScroll] Processing horizontal scroll:', delta)
    
    // Accumulate scroll
    this.scrollAccumulator.x += delta
    
    // Check if we've scrolled enough for a card change
    if (Math.abs(this.scrollAccumulator.x) >= this.scrollThreshold) {
      const direction = this.scrollAccumulator.x > 0 ? 'next' : 'prev'
      console.log('[handleHorizontalScroll] Threshold reached, animating:', direction)
      
      // Trigger card animation (placeholder - will implement in Phase 3)
      this.animateNextCard(section, direction)
      
      // Reset accumulator
      this.scrollAccumulator.x = 0
    }
  }

  handleVerticalScroll(delta, section) {
    console.log('[handleVerticalScroll] Processing vertical scroll:', delta)
    
    // For process section, vertical scroll controls cards
    this.scrollAccumulator.y += delta
    
    if (Math.abs(this.scrollAccumulator.y) >= this.scrollThreshold) {
      const direction = this.scrollAccumulator.y > 0 ? 'next' : 'prev'
      console.log('[handleVerticalScroll] Threshold reached, animating:', direction)
      
      // Trigger card animation (placeholder - will implement in Phase 3)
      this.animateNextCard(section, direction)
      
      // Reset accumulator
      this.scrollAccumulator.y = 0
    }
  }

  handleVerticalSectionScroll(delta) {
    console.log('[handleVerticalSectionScroll] Section navigation:', delta)
    
    // Accumulate for section changes
    this.scrollAccumulator.y += delta
    
    // Higher threshold for section changes
    const sectionThreshold = 200
    
    if (Math.abs(this.scrollAccumulator.y) >= sectionThreshold) {
      const direction = this.scrollAccumulator.y > 0 ? 'next' : 'prev'
      console.log('[handleVerticalSectionScroll] Section change triggered:', direction)
      
      // Navigate sections (placeholder - will implement with GSAP ScrollTrigger)
      this.navigateSection(direction)
      
      // Reset accumulator
      this.scrollAccumulator.y = 0
    }
  }

  // Placeholder methods for Phase 3
  animateNextCard(section, direction) {
    console.log('[animateNextCard] Starting animation', { section: section.id, direction });
    
    const sectionId = section.id;
    const cards = this.sectionCards[sectionId];
    if (!cards || cards.length === 0) return;
    
    // Get current card index for this section
    const currentIndex = this.getCurrentCardIndex(sectionId);
    let targetIndex = currentIndex;
    
    if (direction === 'next' && currentIndex < cards.length - 1) {
      targetIndex = currentIndex + 1;
    } else if (direction === 'prev' && currentIndex > -1) {
      targetIndex = currentIndex - 1;
    }
    
    console.log('[animateNextCard] Current:', currentIndex, 'Target:', targetIndex);
    
    if (targetIndex !== currentIndex && targetIndex >= 0 && targetIndex < cards.length) {
      this.cardAnimator.animateCard(sectionId, targetIndex, direction);
    }
  }

  getCurrentCardIndex(sectionId) {
    const states = this.cardStates[sectionId];
    if (!states) return -1;
    
    // Find the last completed card
    for (let i = states.length - 1; i >= 0; i--) {
      if (states[i].isCompleted) return i;
    }
    return -1;
  }

  navigateSection(direction) {
    const oldSection = this.getCurrentSection();
    const oldSectionId = oldSection.id;

    // Determine next section index
    const nextIndex = direction === 'next'
      ? Math.min(this.currentSectionIndex + 1, this.sections.length - 1)
      : Math.max(this.currentSectionIndex - 1, 0);

    const newSection = this.sections[nextIndex];
    const newSectionId = newSection.id;

    if (oldSectionId !== newSectionId) {
      // Mark active section
      oldSection.classList.remove('active-section');
      newSection.classList.add('active-section');
      this.currentSectionIndex = nextIndex;

      // 🔥 Fade tooltips
      this.fadeTooltip(oldSectionId, false);  // hide old
      if (newSection.classList.contains('project-section')) {
        this.fadeTooltip(newSectionId, true); // show new
      }
    }
  }

  getActiveSection() {
    // Find section that's currently in view
    const sections = this.container.querySelectorAll('.section')
    return Array.from(sections).find(section => {
      const rect = section.getBoundingClientRect()
      return rect.top <= 100 && rect.bottom >= 100
    })
  }

  destroy() {
    // Clean up Phase 2 additions
    if (this.dragHandler) {
      this.dragHandler.destroy()
    }
    this.container.removeEventListener('wheel', this.handleWheel)
  }

  setScrollMode(mode) {
    this.scrollMode = mode; // 'section' or 'cards'
  }

  updateTooltip(sectionId, cardIndex) {
    const container = document.querySelector(`[data-project-id="${sectionId}"]`);
    if (!container) return;

    const nameEl = container.querySelector('.tooltip-name');
    const descEl = container.querySelector('.tooltip-description');
    const sectionData = tooltipContent[sectionId];

    if (!sectionData) return;

    // Always show project name
    if (nameEl) nameEl.textContent = sectionData.projectName || '';

    // Show card description if available
    const description = sectionData.cards?.[cardIndex];
    if (descEl) {
      if (description) {
        descEl.textContent = description;
        descEl.style.display = '';
      } else {
        descEl.textContent = '';
        descEl.style.display = 'none'; // Hide if null
      }
    }
  }

  fadeTooltip(sectionId, show) {
    const container = document.querySelector(`[data-project-id="${sectionId}"]`);
    if (!container) return;

    gsap.to(container, {
      autoAlpha: show ? 1 : 0,
      display: show ? 'flex' : 'none',
      duration: 0.3
    });
  }
}

class DragHandler {
  constructor(container, onDrag) {
    this.container = container
    this.onDrag = onDrag
    this.isActive = false
    this.startX = 0
    this.startY = 0
    this.currentX = 0
    this.currentY = 0
    this.deltaX = 0
    this.deltaY = 0
    
    this.bindEvents()
  }

  bindEvents() {
    // Mouse events
    this.container.addEventListener('mousedown', this.handleStart.bind(this))
    document.addEventListener('mousemove', this.handleMove.bind(this))
    document.addEventListener('mouseup', this.handleEnd.bind(this))
    
    // Touch events
    this.container.addEventListener('touchstart', this.handleStart.bind(this), { passive: false })
    this.container.addEventListener('touchmove', this.handleMove.bind(this), { passive: false })
    this.container.addEventListener('touchend', this.handleEnd.bind(this))
    
    console.log('[DragHandler] Events bound to container')
  }

  handleStart(e) {
    // Don't start drag on buttons or interactive elements
    if (e.target.closest('button, a, input, textarea')) return
    
    this.isActive = true
    const point = e.touches ? e.touches[0] : e
    
    this.startX = point.clientX
    this.startY = point.clientY
    this.currentX = this.startX
    this.currentY = this.startY
    
    this.container.classList.add('drag-active')
    console.log('[DragHandler] Drag started at:', this.startX, this.startY)
  }

  handleMove(e) {
    if (!this.isActive) return
    
    e.preventDefault()
    const point = e.touches ? e.touches[0] : e
    
    this.deltaX = point.clientX - this.currentX
    this.deltaY = point.clientY - this.currentY
    
    this.currentX = point.clientX
    this.currentY = point.clientY
    
    // Determine direction based on larger delta
    const direction = Math.abs(this.deltaX) > Math.abs(this.deltaY) ? 'horizontal' : 'vertical'
    const delta = direction === 'horizontal' ? this.deltaX : this.deltaY
    
    console.log('[DragHandler] Move:', { direction, delta, deltaX: this.deltaX, deltaY: this.deltaY })
    
    // Call the drag callback
    this.onDrag(delta, direction)
  }

  handleEnd() {
    if (!this.isActive) return
    
    this.isActive = false
    this.container.classList.remove('drag-active')
    
    const totalDeltaX = this.currentX - this.startX
    const totalDeltaY = this.currentY - this.startY
    
    console.log('[DragHandler] Drag ended. Total movement:', { totalDeltaX, totalDeltaY })
  }

  destroy() {
    this.container.removeEventListener('mousedown', this.handleStart)
    document.removeEventListener('mousemove', this.handleMove)
    document.removeEventListener('mouseup', this.handleEnd)
    this.container.removeEventListener('touchstart', this.handleStart)
    this.container.removeEventListener('touchmove', this.handleMove)
    this.container.removeEventListener('touchend', this.handleEnd)
  }
}

class CardAnimator {
  constructor(controller) {
    this.controller = controller;
    this.animationDuration = 800; // ms
    this.animations = {};
  }

  animateCard(sectionId, cardIndex, direction) {
    const card = this.controller.sectionCards[sectionId][cardIndex];
    const state = this.controller.cardStates[sectionId][cardIndex];
    
    if (!card || state.isAnimating) {
      console.log('[CardAnimator] Card not found or already animating');
      return;
    }

    console.log('[CardAnimator] Starting animation for card', cardIndex);
    
    // Mark as animating
    state.isAnimating = true;
    card.classList.add('card-animating');
    
    // Determine target progress
    const targetProgress = direction === 'next' ? 1 : 0;
    const startProgress = state.progress;
    
    // Use GSAP for smooth animation
    if (window.gsap) {
      this.animateWithGSAP(card, state, startProgress, targetProgress, sectionId, cardIndex);
    } else {
      // Fallback animation
      this.animateWithRAF(card, state, startProgress, targetProgress, sectionId, cardIndex);
    }

    const previewProgress = this.controller.deviceType === 'mobile' ? 0.15 : 0.3;
    if (cardIndex === 0 && direction === 'next' && startProgress === 0) {
      targetProgress = previewProgress;
    }
  }

  animateWithGSAP(card, state, startProgress, targetProgress, sectionId, cardIndex) {
    const animationId = `${sectionId}-${cardIndex}`;
    
    // Kill any existing animation
    if (this.animations[animationId]) {
      this.animations[animationId].kill();
    }
    
    // Create progress object for GSAP to animate
    const progressObj = { progress: startProgress };
    
    this.animations[animationId] = gsap.to(progressObj, {
      progress: targetProgress,
      duration: this.animationDuration / 1000,
      ease: "power2.inOut",
      onUpdate: () => {
        state.progress = progressObj.progress;
        this.applyProgress(card, progressObj.progress, sectionId);
      },
      onComplete: () => {
        state.isAnimating = false;
        state.isCompleted = targetProgress === 1;
        state.progress = targetProgress;
        
        card.classList.remove('card-animating');
        if (state.isCompleted) {
          card.classList.add('card-completed');
        } else {
          card.classList.remove('card-completed');
        }
        
        console.log('[CardAnimator] Animation complete', { cardIndex, completed: state.isCompleted });
        
        // Check if this was the last card in process section
        if (sectionId === 'process' && this.isLastProcessCard(cardIndex)) {
          this.controller.unlockContainer();
        }

        this.controller.updateTooltip(sectionId, cardIndex);
      }
    });
  }

  animateWithRAF(card, state, startProgress, targetProgress, sectionId, cardIndex) {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);
      
      // Ease function
      const easeProgress = this.easeInOutQuad(progress);
      
      // Calculate current progress
      const currentProgress = startProgress + (targetProgress - startProgress) * easeProgress;
      state.progress = currentProgress;
      
      // Apply transform
      this.applyProgress(card, currentProgress, sectionId);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        state.isAnimating = false;
        state.isCompleted = targetProgress === 1;
        card.classList.remove('card-animating');
        if (state.isCompleted) {
          card.classList.add('card-completed');
        }
      }
    };
    
    requestAnimationFrame(animate);
  }

  applyProgress(card, progress, sectionId) {
    const isProjectSection = sectionId !== 'process';
    
    // 2-step animation calculation
    let transform;
    
    if (progress <= 0) {
      // Initial position
      transform = isProjectSection ? 'translateX(110vw)' : 'translateY(110vh)';
    } else if (progress >= 1) {
      // Final position (to be implemented with cardPositions data)
      transform = this.getFinalTransform(card, sectionId);
    } else {
      // Animate between initial -> center -> final
      if (progress <= 0.5) {
        // First half: initial to center
        const halfProgress = progress * 2;
        if (isProjectSection) {
          const x = 110 - (110 + 50) * halfProgress;
          const y = -50 * halfProgress;
          transform = `translateX(${x}vw) translateY(${y}vh)`;
        } else {
          const y = 110 - (110 + 50) * halfProgress;
          const x = -50 * halfProgress;
          transform = `translateX(${x}vw) translateY(${y}vh)`;
        }
      } else {
        // Second half: center to final
        const halfProgress = (progress - 0.5) * 2;
        // For now, just move to a spread position
        // This will use cardPositions data in the final implementation
        const finalX = (Math.random() - 0.5) * 40;
        const finalY = (Math.random() - 0.5) * 40;
        const x = -50 + (finalX + 50) * halfProgress;
        const y = -50 + (finalY + 50) * halfProgress;
        transform = `translateX(${x}vw) translateY(${y}vh)`;
      }
    }
    
    card.style.transform = transform;
  }

  getFinalTransform(card, sectionId) {
    const index = parseInt(card.dataset.cardIndex);
    const device = this.controller.deviceType;
    const pos = cardPositions[sectionId]?.[device]?.[index];
    if (!pos) return '';

    const { x, y, scale, opacity, rotation } = pos;
    card.style.opacity = opacity;
    return `translate(${x}vw, ${y}vh) scale(${scale}) rotate(${rotation}deg)`;
  }

  isLastProcessCard(cardIndex) {
    const processCards = this.controller.sectionCards['process'];
    return processCards && cardIndex === processCards.length - 1;
  }

  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}

document.querySelector('.left-zone').addEventListener('mouseenter', () => {
  controller.setScrollMode('section');
});
document.querySelector('.right-zone').addEventListener('mouseenter', () => {
  controller.setScrollMode('cards');
});

// Initialize when DOM is ready and GSAP is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initController);
} else {
  initController();
}

function initController() {
  // Wait for GSAP to load (from your lazy loader)
  if (window.gsap && window.ScrollTrigger) {
    window.projectsController = new ProjectsController();
  } else {
    window.addEventListener('siteLoaded', () => {
      window.projectsController = new ProjectsController();
    });
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const direction = e.currentTarget.dataset.direction;
      const tooltipContainer = e.currentTarget.closest('.project-tooltip-container');
      const sectionId = tooltipContainer?.dataset.projectId;
      const sectionEl = document.getElementById(sectionId);
      
      if (sectionEl && direction) {
        controller.animateNextCard(sectionEl, direction);
      }
    });
  });
}