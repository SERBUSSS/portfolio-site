/**
 * Animates the cards horizontally based on scroll progress.
 * @param {string} sectionId - The ID of the project section.
 * @param {number} progress - The scroll progress (0 to 1).
 * @param {HTMLElement[]} cards - The card elements in this section.
 */

import { tooltipContent } from '../data/tooltipContent.js';
import { cardPositions } from '../data/positions.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

console.log('🔧 containerScroll.js loaded');

/* ======= containerScroll.js ======= */
// logic/containerScroll.js
let wrapper;
let containerPinned = false;
console.log('Initial containerPinned =', containerPinned);

// animations/cardAnimator.js
let cardScrollValue = 0;
let activeProjectId = null;
let cards = [];
window.horizontalScrollData = window.horizontalScrollData || {};
const horizontalScrollData = window.horizontalScrollData;
const PROJECTS_SCROLL_SENSITIVITY = 100;
const PROCESS_SCROLL_SENSITIVITY = 10;

// logic/sectionScrollLogic.js
const sections = document.querySelectorAll('.project-section');
let currentSectionIndex = 0;
let processScrollValue = 0;
let processCards = [];
const processSection = document.querySelector('#process');
const isTouch = 'ontouchstart' in window;
let zonesBound = false;
let wrapperOffsetTop = null;
let canRepin = true;
let pinnedScrollHandler = null;

// logic/navControl.js
let currentCard = 0;
let projectId = null;

// logic/tooltipManager.js
const tooltip = document.querySelector('.card-tooltip');
const tooltipText = tooltip?.querySelector('.tooltip-text');

function handleRightZoneScroll(e) {
  // console.log('RIGHT ZONE SCROLL DETECTED', e, 'activeProjectId:', activeProjectId);
  if (!containerPinned) return;
  e.preventDefault();

  // Use the current active project section ID
  if (activeProjectId) {
    onDesktopHorizontalScroll(activeProjectId, e);
  }
}

function handleLeftZoneScroll(e) {
  /*console.log('👈 handleLeftZoneScroll fired:', 
              'deltaY =', e.deltaY, 
              'containerPinned =', containerPinned);*/
  if (!containerPinned) {
    // console.log('   ↪️  Ignoring because not pinned');
    return;
  }
  e.preventDefault();
  handleSectionSnap(e);
}

function initScrollZones() {
  const leftZone = document.querySelector('.scroll-zone-left');
  const rightZone = document.querySelector('.scroll-zone-right');
  if (leftZone) {
    leftZone.addEventListener('wheel', handleLeftZoneScroll, { passive: false });
  }
  if (rightZone) {
    rightZone.addEventListener('wheel', e => {
      // Use process handler ONLY if process section is active
      if (activeProjectId === 'process') {
        handleProcessScroll('process', e);
      } else {
        onDesktopHorizontalScroll(activeProjectId, e);
      }
    }, { passive: false });
  }
  // Dedicated process section scroll (if user scrolls directly over it)
  if (processSection) {
    processSection.addEventListener('wheel', e => {
      if (isTouch) return;
      handleProcessScroll('process', e);
    }, { passive: false });
  }
}

function isMobile() {
  return window.innerWidth <= 768;
}

function pinContainer() {
  if (containerPinned || !canRepin) {
    console.log('[Pin] Already pinned or canRepin false. Not pinning.');
    return;
  }
  containerPinned = true;
  wrapperOffsetTop = wrapper.offsetTop;
  canRepin = false;
  console.log('[Pin] Pinning container. wrapperOffsetTop:', wrapperOffsetTop);

  // placeholder logic
  console.log('   → inserting placeholder (height:', wrapper.clientHeight, 'px)');
  
  // before binding zones, log them
  const leftZone = document.querySelector('.scroll-zone-left');
  const rightZone = document.querySelector('.scroll-zone-right');
  console.log('   → leftZone element:', leftZone);
  console.log('   → rightZone element:', rightZone);

  if (leftZone) {
    leftZone.style.pointerEvents = 'auto';
    // Remove first to prevent double bind
    leftZone.removeEventListener('wheel', handleLeftZoneScroll);
    leftZone.addEventListener('wheel', handleLeftZoneScroll, { passive: false });
  }
  if (rightZone) {
    rightZone.style.pointerEvents = 'auto';
    rightZone.removeEventListener('wheel', handleRightZoneScroll);
    rightZone.addEventListener('wheel', handleRightZoneScroll, { passive: false });
  }

  if (wrapper && !pinnedScrollHandler) {
    pinnedScrollHandler = function(e) {
      // Only if at top and user tries to scroll UP
      if (wrapper.scrollTop === 0 && e.deltaY < 0) {
        console.log('[Pin] User scrolled up at top, unpinning!');
        unpinContainer();
      }
    };
    wrapper.addEventListener('wheel', pinnedScrollHandler, { passive: false });
  }
}

function unpinContainer() {
  if (!containerPinned) {
    console.log('[Unpin] Not pinned, ignoring.');
    return;
  }
  containerPinned = false;
  wrapperOffsetTop = null;
  canRepin = false;
  console.log('[Unpin] Unpinning container.');

  const leftZone = document.querySelector('.scroll-zone-left');
  const rightZone = document.querySelector('.scroll-zone-right');
  if (leftZone) {
    leftZone.removeEventListener('wheel', handleLeftZoneScroll);
    leftZone.style.pointerEvents = 'none';
  }
  if (rightZone) {
    rightZone.removeEventListener('wheel', handleRightZoneScroll);
    rightZone.style.pointerEvents = 'none';
  }

  if (wrapper && pinnedScrollHandler) {
    wrapper.removeEventListener('wheel', pinnedScrollHandler);
    pinnedScrollHandler = null;
  }

  // placeholder removal
  console.log('   → removing placeholder');
}

// --- Helper to smoothly scroll page so wrapper's top aligns with viewport top ---
function alignWrapperToViewportTop(wrapper, topSlackPx) {
  const rect = wrapper.getBoundingClientRect();
  // If wrapper top is not exactly at 0, scroll page so it is
  if (Math.abs(rect.top) > 1) {
    // Get current scroll position
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    // How much to scroll to bring wrapper top to viewport top (0)
    const scrollOffset = rect.top;
    // Only scroll if we’re not already locked
    window.scrollTo({
      top: currentScroll + scrollOffset,
      behavior: 'smooth'
    });
    // You can use gsap.to(window, { scrollTo: ... }) if using GSAP scrollTo plugin
  }
}

function checkContainerLock() {
  const rect = wrapper.getBoundingClientRect();
  const topSlack = 0.15 * window.innerHeight;

  console.log('[Check Lock] rect.top:', rect.top, 'Pinned:', containerPinned, 'canRepin:', canRepin);

  if (!containerPinned && (rect.top < -topSlack || rect.top > topSlack)) {
    canRepin = true;
    console.log('[Check Lock] OUTSIDE slack, not pinned. Setting canRepin = true');
  }

  if (!containerPinned && canRepin && rect.top >= -topSlack && rect.top <= topSlack) {
    console.log('[Check Lock] PINNING. rect.top in slack zone and canRepin');
    pinContainer();
    alignWrapperToViewportTop(wrapper, topSlack);
    return;
  }
}

// logic/tooltipManager.js
function updateTooltip(projectId, index) {
  const content = tooltipContent[projectId]?.cards[index];
  if (tooltipText && content) {
    tooltipText.textContent = content;
  }
}

function showTooltip() {
  gsap.to('.card-tooltip', { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
  gsap.to('.card-nav', { opacity: 1, duration: 0.3, pointerEvents: 'auto' });
}

function hideTooltip() {
  gsap.to('.card-tooltip', { opacity: 0, duration: 0.3, pointerEvents: 'none' });
  gsap.to('.card-nav', { opacity: 0, duration: 0.3, pointerEvents: 'none' });
}

function initTooltip(projectId) {
  showTooltip();
  updateTooltip(projectId, 0); // preview first card
}

// logic/navControl.js
function setNavContext(activeId) {
  projectId = activeId;
  cards = Array.from(document.querySelectorAll(`#${activeId} .card`));
  currentCard = 0;
  updateTooltip(projectId, currentCard);
  setActiveProject(projectId);

  cards.forEach((card) => {
    gsap.set(card, {
      x: '100vw',
      y: '50vh',
      scale: 0.9,
      opacity: 0,
      zIndex: 1,
      pointerEvents: 'none'
    });
  });

  if (!horizontalScrollData[projectId]) {
    horizontalScrollData[projectId] = {
      isActive: true,
      scrollX: 0,
      maxScroll: 1000 // Adjust this value as needed!
    };
  } else {
    horizontalScrollData[projectId].isActive = true;
  }
  Object.keys(horizontalScrollData).forEach(id => {
    if (id !== projectId) horizontalScrollData[id].isActive = false;
  });
}

function goToCard(index) {
  if (!cards[index]) return;
  currentCard = index;
  cards.forEach((card, i) => {
    const progress = Math.max(0, Math.min(1, currentCard - i));
    updateCardProgress(card, projectId, i, progress);
  });
  updateTooltip(projectId, currentCard);
}

function nextCard() {
  if (currentCard < cards.length - 1) {
    goToCard(currentCard + 1);
  }
}

function prevCard() {
  if (currentCard > 0) {
    goToCard(currentCard - 1);
  }
}

function initNavButtons() {
  document.querySelectorAll('.btn-prev').forEach(btn => btn.addEventListener('click', prevCard));
  document.querySelectorAll('.btn-next').forEach(btn => btn.addEventListener('click', nextCard));
}

// logic/sectionScrollLogic.js
function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: 'smooth' });
    currentSectionIndex = index;
  }
}

function handleSectionSnap(event) {
  const delta = event.deltaY;

  if (Math.abs(delta) < 30) return; // prevent micro scrolls

  if (delta > 0 && currentSectionIndex < sections.length - 1) {
    scrollToSection(currentSectionIndex + 1);
  } else if (delta < 0 && currentSectionIndex > 0) {
    scrollToSection(currentSectionIndex - 1);
  }
}

function initSectionObserver() {
  const observerOptions = {
    threshold: 0.6,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const projectId = section.getAttribute('id');
      const tooltipContainer = document.querySelector(`#tooltip-${projectId}`);

      if (!containerPinned) return;

      if (entry.isIntersecting) {
        if (tooltipContainer) tooltipContainer.classList.remove('hidden');
        initTooltip(projectId);
        setNavContext(projectId);

        const cards = section.querySelectorAll('.card');
        const initialProgress = isMobile() ? 0.15 : 0.3;
        cards.forEach((card, index) => {
          const progress = Math.max(0, Math.min(1, 0.2 - index));
          updateCardProgress(card, projectId, index, progress);
        });
        setTimeout(() => {
          cards.forEach((card, index) => {
            updateCardProgress(card, projectId, index, 0); // keep all at 0% progress initially
            card.style.pointerEvents = 'none';
          });
        }, 50);
      } else {
        if (tooltipContainer) tooltipContainer.classList.add('hidden');
        hideTooltip();
      }
    });
  }, observerOptions);

  document.querySelectorAll('.project-section').forEach(section => {
    observer.observe(section);
  });
}

function setupProcessCards() {
  const container = processSection?.querySelector('.process-cards-container');
  if (!container) return;
  processCards = Array.from(container.querySelectorAll('.process-card'));
  processScrollValue = 0;
}

function animateProcessCards(sectionId, progress, cards) {
    const isMobileDevice = window.innerWidth <= 768;
    const deviceKey = isMobileDevice ? 'mobile' : 'desktop';
    const positions = (cardPositions[sectionId] && cardPositions[sectionId][deviceKey]) || [];

    const totalCards = cards.length;
    const positionsCount = positions.length;
    const progressPerCard = 0.9 / totalCards;

    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    cards.forEach((card, index) => {
        const cardStart = index * progressPerCard;
        const cardProgress = Math.min(1, Math.max(0, (progress - cardStart) / progressPerCard));
        const posIndex = Math.min(index, positionsCount - 1);
        const finalPos = positions[posIndex] || { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 };

        const finalX = parseFloat(finalPos.x) * vw;
        const finalY = parseFloat(finalPos.y) * vh;
        const finalScale = parseFloat(finalPos.scale);
        const finalOpacity = parseFloat(finalPos.opacity);
        const finalRotation = parseFloat(finalPos.rotation);

        if (cardProgress === 0) {
            // Start below viewport
            gsap.set(card, {
                x: screenCenterX - card.offsetWidth / 2,
                y: window.innerHeight + card.offsetHeight / 2,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true
            });
        } else if (cardProgress <= 0.6) {
            // Phase 1: slide from below to center
            const t = cardProgress / 0.6;
            const startY = window.innerHeight + card.offsetHeight / 2;
            const endY = screenCenterY;
            const currentY = startY + (endY - startY) * t;
            gsap.set(card, {
                x: screenCenterX - card.offsetWidth / 2,
                y: currentY - card.offsetHeight / 2,
                scale: 1,
                opacity: t,
                rotation: 0,
                force3D: true
            });
        } else {
            // Phase 2: center to final position (from data)
            const t = (cardProgress - 0.6) / 0.4;
            const startX = screenCenterX - card.offsetWidth / 2;
            const startY = screenCenterY - card.offsetHeight / 2;
            const endX = screenCenterX + finalX - card.offsetWidth / 2;
            const endY = screenCenterY + finalY - card.offsetHeight / 2;
            const currentX = startX + (endX - startX) * t;
            const currentY = startY + (endY - startY) * t;
            const currentScale = 1 + (finalScale - 1) * t;
            const currentOpacity = 1 + (finalOpacity - 1) * t;
            const currentRotation = 0 + (finalRotation - 0) * t;

            gsap.set(card, {
                x: currentX,
                y: currentY,
                scale: currentScale,
                opacity: currentOpacity,
                rotation: currentRotation,
                force3D: true
            });
        }
    });
}

function handleProcessScroll(sectionId, e) {
  if (!horizontalScrollData[sectionId] || !horizontalScrollData[sectionId].isActive) return;
  e.preventDefault();
  const delta = e.deltaY;
  horizontalScrollData[sectionId].scrollX += delta / PROCESS_SCROLL_SENSITIVITY;
  horizontalScrollData[sectionId].scrollX = Math.max(0, Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll));
  const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
  const cards = Array.from(document.querySelectorAll(`#${sectionId} .process-card`));
  animateProcessCards(sectionId, progress, cards);
}

function initProcessScroll() {
  setupProcessCards();
  if (!processSection) return;

  processSection.addEventListener('wheel', (e) => {
    if (isTouch) return;
    e.preventDefault();
    handleProcessScroll('process', e);
  });

  if (!horizontalScrollData['process']) {
    horizontalScrollData['process'] = {
      isActive: true,
      scrollX: 0,
      maxScroll: 1000 // or whatever feels right for your process card count!
    };
  } else {
    horizontalScrollData['process'].isActive = true;
  }
}

// animations/cardAnimator.js
function getCardConfig(projectId, index) {
  const device = isMobile() ? 'mobile' : 'desktop';
  return positions[projectId]?.[device]?.[index];
}

function updateHorizontalAnimation(sectionId, progress, cards) {
    console.log('🔵 updateHorizontalAnimation running', sectionId, cards.length);
    if (sectionId === 'process') return;

    const isMobile = window.innerWidth <= 768;
    const deviceKey = isMobile ? 'mobile' : 'desktop';
    const projectPositions = (cardPositions[sectionId] && cardPositions[sectionId][deviceKey]) || [];

    const totalCards = cards.length;
    const positionsCount = projectPositions.length;
    const progressPerCard = 0.9 / totalCards;
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;

    // Calculate the screen center ONCE
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    cards.forEach((card, index) => {
        const cardStartProgress = index * progressPerCard;
        const posIndex = Math.min(index, positionsCount - 1);
        const finalPos = projectPositions[posIndex] || { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 };

        const finalX = parseFloat(finalPos.x) * vw;
        const finalY = parseFloat(finalPos.y) * vh;
        const finalScale = parseFloat(finalPos.scale);
        const finalOpacity = parseFloat(finalPos.opacity);
        const finalRotation = parseFloat(finalPos.rotation);

        // Calculate progress for this card
        const cardProgress = Math.max(0, Math.min(1, (progress - cardStartProgress) / progressPerCard));

        if (cardProgress === 0) {
            // Before animation
            gsap.set(card, {
                x: window.innerWidth - card.offsetWidth / 2,
                y: screenCenterY - card.offsetHeight / 2,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true,
            });
        } else if (cardProgress <= 0.6) {
            // PHASE 1: Slide from right to center of screen (not up/down)
            const slide = cardProgress / 0.6;
            const startX = window.innerWidth + card.offsetWidth / 2;
            const endX = screenCenterX;
            const currentX = startX + (endX - startX) * slide;
            gsap.set(card, {
                x: currentX - card.offsetWidth / 2,
                y: screenCenterY - card.offsetHeight / 2,
                scale: 1,
                opacity: slide,
                rotation: 0,
                force3D: true,
            });
        } else {
            // PHASE 2: From center to final position (offset from center)
            const lerp = (cardProgress - 0.6) / 0.4;
            const targetX = screenCenterX + finalX;
            const targetY = screenCenterY + finalY;
            const currentX = screenCenterX + (targetX - screenCenterX) * lerp - card.offsetWidth / 2;
            const currentY = screenCenterY + (targetY - screenCenterY) * lerp - card.offsetHeight / 2;
            const currentScale = 1 + (finalScale - 1) * lerp;
            const currentOpacity = 1 + (finalOpacity - 1) * lerp;
            const currentRotation = 0 + (finalRotation - 0) * lerp;

            gsap.set(card, {
                x: currentX,
                y: currentY,
                scale: currentScale,
                opacity: currentOpacity,
                rotation: currentRotation,
                force3D: true,
            });
        }
    });
}

function updateCardProgress(sectionId, scrollValue) {
  if (!horizontalScrollData[sectionId]) return;
  horizontalScrollData[sectionId].scrollX = scrollValue;
  let cards;
  let progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;

  if (sectionId === 'process') {
    cards = Array.from(document.querySelectorAll(`#${sectionId} .process-card`));
    animateProcessCards(sectionId, progress, cards);
  } else {
    cards = Array.from(document.querySelectorAll(`#${sectionId} .item.card`));
    updateHorizontalAnimation(sectionId, progress, cards);
  }
}

function setActiveProject(projectId) {
  activeProjectId = projectId;
  cards = Array.from(document.querySelectorAll(`#${projectId} .card`));
  cardScrollValue = 0;
}

function onDesktopHorizontalScroll(sectionId, e) {
  // Never handle process section here!
  if (!horizontalScrollData[sectionId] || !horizontalScrollData[sectionId].isActive) return;
  if (sectionId === 'process') return;

  e.preventDefault();
  const delta = e.deltaX || e.deltaY;
  horizontalScrollData[sectionId].scrollX += delta / PROJECTS_SCROLL_SENSITIVITY;
  horizontalScrollData[sectionId].scrollX = Math.max(0, Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll));
  const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
  const cards = Array.from(document.querySelectorAll(`#${sectionId} .item.card`));
  updateHorizontalAnimation(sectionId, progress, cards);
}

function onMobileHorizontalScroll() {
  if (!isMobile() || !activeProjectId) return;

  const wrapper = document.querySelector(`#${activeProjectId} .card-wrapper`);
  const scrollLeft = wrapper.scrollLeft;
  const cardWidth = wrapper.clientWidth;

  cards.forEach((card, index) => {
    const relProgress = (scrollLeft / cardWidth) - index;
    const progress = Math.max(0, Math.min(1, relProgress));
    updateCardProgress(card, activeProjectId, index, progress);
  });
}

function initCardScrollHandlers() {
  if (isMobile()) {
    document.querySelectorAll('.card-wrapper').forEach(wrapper => {
      wrapper.addEventListener('scroll', onMobileHorizontalScroll);
    });
  }
}

['.scroll-zone-left', '.scroll-zone-right'].forEach(sel => {
  const el = document.querySelector(sel);
  if (el) {
    el.addEventListener('wheel', e => {
      //console.log(🌐 wheel event on ${sel}, 'deltaY =', e.deltaY);
    }, { passive: true });
  }
});

document.addEventListener('DOMContentLoaded', initCardScrollHandlers);

document.addEventListener('DOMContentLoaded', () => {
  initSectionObserver();
  initProcessScroll();
});

document.addEventListener('DOMContentLoaded', initNavButtons);
document.addEventListener('DOMContentLoaded', initScrollZones);

document.addEventListener('DOMContentLoaded', () => {
  wrapper = document.querySelector('.projects-wrapper');
  if (!wrapper) return;
  // existing scroll listener:
  window.addEventListener('scroll', () => {
    checkContainerLock();
  });
  // watch all pointer-driven scroll events so pinContainer() can run immediately
  window.addEventListener('scroll',  checkContainerLock);
  window.addEventListener('wheel',   checkContainerLock, { passive: true });
  window.addEventListener('touchmove', checkContainerLock, { passive: true });
});