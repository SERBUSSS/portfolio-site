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
const projectsContainer = document.querySelector('.projects-container');
let currentSectionIndex = 0;
let processScrollValue = 0;
let processCards = [];
const processSection = document.querySelector('#process');
const isTouch = 'ontouchstart' in window;
let zonesBound = false;
let wrapperOffsetTop = null;
let canRepin = true;
let pinnedScrollHandler = null;
const SLACK_PX = 0.15 * window.innerHeight;
let lastBodyScroll = 0;
let hasUserInitiatedScroll = false;
let isAligningContainer = false;
let lastScrollTop = 0;

let touchStartX = 0;
let touchStartY = 0;
let touchLastX = 0;
let touchLastY = 0;
let touchActive = false;
let gestureType = null; // 'horizontal' | 'vertical' | null
const HORIZONTAL_THRESHOLD = 10; // px
const VERTICAL_THRESHOLD = 10;   // px

// logic/navControl.js
let currentCard = 0;
let projectId = null;

// logic/tooltipManager.js
const tooltip = document.querySelector('.card-tooltip');
const tooltipText = tooltip?.querySelector('.tooltip-text');

// Gesture direction detection
function getGestureDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > HORIZONTAL_THRESHOLD) return 'horizontal';
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > VERTICAL_THRESHOLD) return 'vertical';
  return null;
}

console.log('[INFO] isMobile:', isMobile());
console.log('[INFO] ontouchstart in window:', 'ontouchstart' in window);
console.log('[INFO] window.innerWidth:', window.innerWidth);

// --- Persistence helpers for process scroll progress ---
function saveProcessScrollState(scrollX) {
  window.processScrollState = scrollX;
  sessionStorage.setItem('processScrollX', scrollX);
}

function restoreProcessScrollState() {
  if (window.processScrollState !== undefined) {
    return window.processScrollState;
  }
  const stored = sessionStorage.getItem('processScrollX');
  return stored !== null ? Number(stored) : 0;
}

function handleRightZoneScroll(e) {
  // console.log('RIGHT ZONE SCROLL DETECTED', e, 'activeProjectId:', activeProjectId);
  if (!containerPinned) {
    e.preventDefault();
    return
  };
  

  // Use the current active project section ID
  if (activeProjectId) {
    onDesktopHorizontalScroll(activeProjectId, e);
  }
}

function setProjectsContainerScrollable(enabled) {
  const projectsContainer = document.querySelector('.projects-container');
  if (!projectsContainer) return;
  projectsContainer.style.overflowY = enabled ? 'auto' : 'hidden';
  projectsContainer.style.touchAction = enabled ? 'auto' : 'auto'; // for mobile
}

function handleLeftZoneScroll(e) {
  if (!containerPinned) {
    e.preventDefault();
    return;
  }

  // BOTTOM EXIT: Only for process section, at 100% progress, scroll down
  if (
    activeProjectId === 'process' &&
    isProcessScrollAtEnd() &&
    e.deltaY > 0
  ) {
    // Only unpin if wrapper is in bottom slack zone
    const rect = wrapper.getBoundingClientRect();
    if (
      rect.bottom >= window.innerHeight - SLACK_PX &&
      rect.bottom <= window.innerHeight + SLACK_PX
    ) {
      unpinContainer();
      return;
    }
  }

  // Top exit: already handled by pinnedScrollHandler on wheel up at top
  handleSectionSnap(e);
}

function initScrollZones() {
  if (isMobile()) return;
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
      
      // Always block native scroll!
      e.preventDefault();
    }, { passive: false });
  }
  // Dedicated process section scroll (if user scrolls directly over it)
  if (processSection) {
    processSection.addEventListener('wheel', e => {
      if (isMobile()) return;
      // Only intercept scroll if process section is at the top of viewport (snapped)
      const rect = processSection.getBoundingClientRect();
      if (Math.abs(rect.top) <= 2) { // Allow 2px leeway
        e.preventDefault();
        handleProcessScroll('process', e);
      }
      // Otherwise, let default scroll snap finish first
    }, { passive: false });
  }

  setZonesEnabled(false);
}

function isMobile() {
  return window.innerWidth <= 768;
}

function setPageScrollLocked(locked) {
  if (locked) {
    lastBodyScroll = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lastBodyScroll}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, lastBodyScroll);
  }
}

function enableUserScrollFlag() { hasUserInitiatedScroll = true; }

function getMostVisibleProjectSection() {
  let maxVisible = 0;
  let bestSection = null;
  document.querySelectorAll('.project-section').forEach(section => {
    const rect = section.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    if (visibleHeight > maxVisible && visibleHeight > 0) {
      maxVisible = visibleHeight;
      bestSection = section;
    }
  });
  return bestSection ? bestSection.getAttribute('id') : null;
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
  setZonesEnabled(true);
  setProjectsContainerScrollable(true);
  setPageScrollLocked(true);
  // if (wrapper) wrapper.classList.add('pinned');

  if (activeProjectId === 'process' && isWrapperBottomInSlack()) {
    // Always set process cards to max scroll if entering from bottom
    horizontalScrollData['process'].scrollX = horizontalScrollData['process'].maxScroll;
    saveProcessScrollState(horizontalScrollData['process'].scrollX);
    const cards = Array.from(document.querySelectorAll(`#process .process-card`));
    animateProcessCards('process', 1, cards);
  }

  const bestSectionId = getMostVisibleProjectSection();
  if (!activeProjectId && bestSectionId) {
    setNavContext(bestSectionId);
    console.log('[PIN] Set activeProjectId to most visible:', bestSectionId);
  }

  if (isMobile()) return;

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
  setZonesEnabled(false);
  setProjectsContainerScrollable(false);
  setPageScrollLocked(false);
  // if (wrapper) wrapper.classList.remove('pinned');

  if (activeProjectId === 'process' && isProcessScrollAtEnd()) {
    const nextSection = wrapper.nextElementSibling;
    if (nextSection) {
      setTimeout(() => {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }, 30);
    }
  }

  if (isMobile()) return;

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
  if (!hasUserInitiatedScroll) return;
  if (isAligningContainer) return;
  const rect = wrapper.getBoundingClientRect();
  const topSlack = SLACK_PX;
  const bottomSlack = SLACK_PX;

  // Top pin
  if (!containerPinned && canRepin && rect.top >= -topSlack && rect.top <= topSlack) {
    // 1. Align wrapper's top to viewport top (smooth scroll)
    isAligningContainer = true;
    alignWrapperToViewportTop(wrapper, topSlack);
    // 2. Wait for scroll to finish, then pin and lock body scroll
    setTimeout(() => {
      // Confirm we are still in the zone after the scroll
      const afterRect = wrapper.getBoundingClientRect();
      if (afterRect.top >= -topSlack && afterRect.top <= topSlack) {
        pinContainer();
      }
      isAligningContainer = false;
    }, 350); // adjust duration to match smooth scroll
    return;
  }

  // Bottom pin
  if (!containerPinned && canRepin && isWrapperBottomInSlack()) {
    // 1. Align wrapper's bottom to viewport bottom (smooth scroll)
    isAligningContainer = true;
    const scrollOffset = rect.bottom - window.innerHeight;
    if (Math.abs(scrollOffset) > 1) {
      window.scrollTo({
        top: (window.scrollY || document.documentElement.scrollTop) + scrollOffset,
        behavior: 'smooth'
      });
    }
    // 2. Wait for scroll to finish, then pin and lock body scroll
    setTimeout(() => {
      const afterRect = wrapper.getBoundingClientRect();
      if (
        afterRect.bottom >= window.innerHeight - bottomSlack &&
        afterRect.bottom <= window.innerHeight + bottomSlack
      ) {
        pinContainer();
      }
      isAligningContainer = false;
    }, 350); // adjust as above
    return;
  }

  // Out of slack: reset canRepin if fully out of zone
  if (!containerPinned && (rect.top < -topSlack || rect.top > topSlack)) {
    canRepin = true;
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

  if (!horizontalScrollData[projectId]) {
    horizontalScrollData[projectId] = {
      isActive: true,
      scrollX: 0,
      maxScroll: 1000
    };
  } else {
    horizontalScrollData[projectId].isActive = true;
  }
  Object.keys(horizontalScrollData).forEach(id => {
    if (id !== projectId) horizontalScrollData[id].isActive = false;
  });

  // --- Restore scroll and immediately animate cards on section entry! ---
  const savedScroll = restoreProjectScrollState(activeId);
  horizontalScrollData[activeId].scrollX = savedScroll;
  const progress = savedScroll / horizontalScrollData[activeId].maxScroll;
  const itemCards = Array.from(document.querySelectorAll(`#${activeId} .item.card`));
  updateHorizontalAnimation(activeId, progress, itemCards);
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
  const observerOptions = { threshold: 0.6 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const sectionId = section.getAttribute('id');
      const tooltipContainer = document.querySelector(`#tooltip-${sectionId}`);

      if (!containerPinned) return;

      if (entry.isIntersecting) {
        if (tooltipContainer) tooltipContainer.classList.remove('hidden');
        console.log('[SECTION OBSERVER] Section in view:', sectionId);
        initTooltip(sectionId);
        setNavContext(sectionId);

        if (sectionId === 'process') {
          const scrollX = restoreProcessScrollState();
          horizontalScrollData['process'].scrollX = scrollX;
          const cards = Array.from(section.querySelectorAll('.process-card'));
          const progress = scrollX / horizontalScrollData['process'].maxScroll;
          animateProcessCards('process', progress, cards);
        } else {
          const scrollX = restoreProjectScrollState(sectionId);
          horizontalScrollData[sectionId].scrollX = scrollX;
          const cards = Array.from(section.querySelectorAll('.item.card'));
          const progress = scrollX / horizontalScrollData[sectionId].maxScroll;
          updateHorizontalAnimation(sectionId, progress, cards);
        }
      } else {
        if (tooltipContainer) tooltipContainer.classList.add('hidden');
        hideTooltip();
        // --- Save the project scroll state on exit! ---
        if (sectionId !== 'process') {
          saveProjectScrollState(sectionId, horizontalScrollData[sectionId]?.scrollX || 0);
        }
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

    // Use first card as a reference for offset (for consistent anchoring)
    const cardHeight = cards[0]?.offsetHeight || 100;
    const cardWidth = cards[0]?.offsetWidth || 100;

    cards.forEach((card, index) => {
        const cardStart = index * progressPerCard;
        const cardProgress = Math.min(1, Math.max(0, (progress - cardStart) / progressPerCard));
        const posIndex = Math.min(index, positionsCount - 1);
        const finalPos = positions[posIndex] || { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 };

        // Precompute all anchor points
        const finalX = parseFloat(finalPos.x) * vw;
        const finalY = parseFloat(finalPos.y) * vh;
        const finalScale = parseFloat(finalPos.scale);
        const finalOpacity = parseFloat(finalPos.opacity);
        const finalRotation = parseFloat(finalPos.rotation);

        if (cardProgress === 0) {
            // Start below viewport, centered horizontally
            gsap.set(card, {
                x: screenCenterX - cardWidth / 2,
                y: window.innerHeight + cardHeight / 2 - cardHeight / 2,
                scale: 1,
                opacity: 0,
                rotation: 0,
                force3D: true,
            });
        } else if (cardProgress <= 0.6) {
            // Phase 1: slide from below to center (all cards animate to center)
            const t = cardProgress / 0.6;
            const startY = window.innerHeight + cardHeight / 2;
            const endY = screenCenterY;
            const currentY = startY + (endY - startY) * t;
            gsap.set(card, {
                x: screenCenterX - cardWidth / 2,
                y: currentY - cardHeight / 2,
                scale: 1,
                opacity: t,
                rotation: 0,
                force3D: true,
            });
        } else {
            // Phase 2: center to final position (relative to center!)
            const t = (cardProgress - 0.6) / 0.4;
            const startX = screenCenterX;
            const startY = screenCenterY;
            const endX = screenCenterX + finalX;
            const endY = screenCenterY + finalY;
            const currentX = startX + (endX - startX) * t;
            const currentY = startY + (endY - startY) * t;
            const currentScale = 1 + (finalScale - 1) * t;
            const currentOpacity = 1 + (finalOpacity - 1) * t;
            const currentRotation = 0 + (finalRotation - 0) * t;

            gsap.set(card, {
                x: currentX - cardWidth / 2,
                y: currentY - cardHeight / 2,
                scale: currentScale,
                opacity: currentOpacity,
                rotation: currentRotation,
                force3D: true,
            });
        }
    });
}

function handleProcessScroll(sectionId, e) {
  if (!containerPinned || !horizontalScrollData[sectionId] || !horizontalScrollData[sectionId].isActive) {
    // Only allow default scroll when NOT pinned or not in process
    return;
  }
  // Always block native scroll when pinned in process section!
  e.preventDefault();

  const delta = e.deltaY;

  // unpin at the end
  if (
    containerPinned &&
    sectionId === 'process' &&
    isProcessScrollAtEnd() &&
    delta > 0
  ) {
    const rect = wrapper.getBoundingClientRect();
    if (
      rect.bottom >= window.innerHeight - SLACK_PX &&
      rect.bottom <= window.innerHeight + SLACK_PX
    ) {
      unpinContainer();
      return;
    }
    // If not in slack, just block scroll, do nothing else!
    return;
  }

  // Animate cards as normal:
  horizontalScrollData[sectionId].scrollX += delta / PROCESS_SCROLL_SENSITIVITY;
  horizontalScrollData[sectionId].scrollX = Math.max(0, Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll));
  saveProcessScrollState(horizontalScrollData[sectionId].scrollX);
  const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
  const cards = Array.from(document.querySelectorAll(`#${sectionId} .process-card`));
  animateProcessCards(sectionId, progress, cards);
}

function setZonesEnabled(enabled) {
  if (isMobile()) return;

  const leftZone = document.querySelector('.scroll-zone-left');
  const rightZone = document.querySelector('.scroll-zone-right');
  if (leftZone) {
    leftZone.style.pointerEvents = enabled ? 'auto' : 'none';
    leftZone.style.opacity = enabled ? '1' : '0.4';
    leftZone.style.cursor = enabled ? 'pointer' : 'default';
  }
  if (rightZone) {
    rightZone.style.pointerEvents = enabled ? 'auto' : 'none';
    rightZone.style.opacity = enabled ? '1' : '0.4';
    rightZone.style.cursor = enabled ? 'pointer' : 'default';
  }
}

function saveProjectScrollState(sectionId, scrollX) {
  if (!window.projectScrollState) window.projectScrollState = {};
  window.projectScrollState[sectionId] = scrollX;
  sessionStorage.setItem(`projectScrollX_${sectionId}`, scrollX);
}

function restoreProjectScrollState(sectionId) {
  if (window.projectScrollState && window.projectScrollState[sectionId] !== undefined) {
    return window.projectScrollState[sectionId];
  }
  const stored = sessionStorage.getItem(`projectScrollX_${sectionId}`);
  return stored !== null ? Number(stored) : 0;
}

// --- Project scroll handler (horizontal, for project1-4) ---
function handleProjectScroll(sectionId, e) {
  // Skip if process
  if (sectionId === 'process') return;
  if (!horizontalScrollData[sectionId] || !horizontalScrollData[sectionId].isActive) return;
  e.preventDefault();

  // Scroll delta (mousewheel or trackpad)
  const delta = e.deltaX || e.deltaY; // Use X for horizontal devices, else fallback
  horizontalScrollData[sectionId].scrollX += delta / PROJECTS_SCROLL_SENSITIVITY;
  horizontalScrollData[sectionId].scrollX = Math.max(0, Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll));

  // Save for refresh/session
  saveProjectScrollState(sectionId, horizontalScrollData[sectionId].scrollX);

  // Animate cards
  const cards = Array.from(document.querySelectorAll(`#${sectionId} .item.card`));
  const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
  updateHorizontalAnimation(sectionId, progress, cards);
}

// --- Initialize state for all projects (run on DOMContentLoaded) ---
function initProjectScroll() {
  document.querySelectorAll('.project-section').forEach(section => {
    const sectionId = section.getAttribute('id');
    if (sectionId === 'process') return;
    // Initialize state
    if (!horizontalScrollData[sectionId]) {
      horizontalScrollData[sectionId] = {
        isActive: true,
        scrollX: 0,
        maxScroll: 1000 // Tune as needed!
      };
    } else {
      horizontalScrollData[sectionId].isActive = true;
    }
    // Restore scroll state if available
    const restored = restoreProjectScrollState(sectionId);
    horizontalScrollData[sectionId].scrollX = restored;
    // Animate cards to initial/last position
    const cards = Array.from(document.querySelectorAll(`#${sectionId} .item.card`));
    const progress = restored / horizontalScrollData[sectionId].maxScroll;
    updateHorizontalAnimation(sectionId, progress, cards);
    // Listen for wheel on right scroll zone ONLY for project sections
    const rightZone = document.querySelector('.scroll-zone-right');
    if (rightZone) {
      // Remove previous listener (prevents stacking)
      rightZone.removeEventListener('wheel', rightZone._projectScrollHandler);
      // Handler must use this section's id
      rightZone._projectScrollHandler = function(e) {
        // Only if this section is active
        if (activeProjectId === sectionId) {
          handleProjectScroll(sectionId, e);
        }
      };
      rightZone.addEventListener('wheel', rightZone._projectScrollHandler, { passive: false });
    }
  });
}

function initProcessScroll() {
  setupProcessCards();
  if (!processSection) return;

  if (!horizontalScrollData['process']) {
    horizontalScrollData['process'] = {
      isActive: true,
      scrollX: 0,
      maxScroll: 1000 // or whatever feels right for your process card count!
    };
  } else {
    horizontalScrollData['process'].isActive = true;
  }

  // --- Restore process scroll state ---
  const restored = restoreProcessScrollState();
  horizontalScrollData['process'].scrollX = restored;
  const cards = Array.from(document.querySelectorAll('#process .process-card'));
  const progress = restored / horizontalScrollData['process'].maxScroll;
  animateProcessCards('process', progress, cards);

  // Listen for scroll
  processSection.addEventListener('wheel', (e) => {
    if (isMobile()) return;
    e.preventDefault();
    handleProcessScroll('process', e);
  });
}

// --- Helper: get if we're near the bottom of the wrapper (for bottom enter) ---
function isWrapperBottomInSlack() {
  const rect = wrapper.getBoundingClientRect();
  const slackZone = SLACK_PX;
  return (
    !containerPinned &&
    rect.bottom >= window.innerHeight - slackZone &&
    rect.bottom <= window.innerHeight + slackZone
  );
}

// --- Helper: get if we're at the bottom of process scroll (for exit) ---
function isProcessScrollAtEnd() {
  if (!horizontalScrollData['process']) return false;
  // allow some floating point slack
  return horizontalScrollData['process'].scrollX >= horizontalScrollData['process'].maxScroll - 1;
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
  console.log('[ACTIVE PROJECT] Set:', projectId);
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

function setupGestureHandlers() {
  const container = document.querySelector('.projects-container');
  if (!container) return;

  // State for mouse/touch
  let isDragging = false;
  let gesturePointer = null; // 'mouse' | 'touch'
  let dragStartX = 0, dragStartY = 0, lastX = 0, lastY = 0;
  let gestureTypeLocal = null;

  // Unify gesture detection
  function detectGesture(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > HORIZONTAL_THRESHOLD) return 'horizontal';
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > VERTICAL_THRESHOLD) return 'vertical';
    return null;
  }

  // Mouse down
  container.addEventListener('mousedown', function(e) {
    if (e.button !== 0) return;
    isDragging = true;
    gesturePointer = 'mouse';
    dragStartX = lastX = e.clientX;
    dragStartY = lastY = e.clientY;
    gestureTypeLocal = null;
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', function(e) {
    if (!isDragging || gesturePointer !== 'mouse') return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (!gestureTypeLocal) gestureTypeLocal = detectGesture(dx, dy);


    if (!containerPinned) return;

    // --- PROJECTS ---
    if (activeProjectId && activeProjectId !== 'process') {
      if (gestureTypeLocal === 'horizontal') {
        e.preventDefault?.();
        let scrollDelta = e.clientX - lastX;
        horizontalScrollData[activeProjectId].scrollX -= scrollDelta;
        horizontalScrollData[activeProjectId].scrollX = Math.max(0, Math.min(horizontalScrollData[activeProjectId].scrollX, horizontalScrollData[activeProjectId].maxScroll));
        saveProjectScrollState(activeProjectId, horizontalScrollData[activeProjectId].scrollX);
        const cards = Array.from(document.querySelectorAll(`#${activeProjectId} .item.card`));
        const progress = horizontalScrollData[activeProjectId].scrollX / horizontalScrollData[activeProjectId].maxScroll;
        updateHorizontalAnimation(activeProjectId, progress, cards);
      }
    }

    // --- PROCESS ---
    if (activeProjectId === 'process') {
      if (gestureTypeLocal === 'vertical') {
        // Always block vertical scroll while pinned on process!
        e.preventDefault?.();

        const cards = Array.from(document.querySelectorAll(`#process .process-card`));
        const maxScroll = horizontalScrollData['process'].maxScroll;
        const prevScrollX = horizontalScrollData['process'].scrollX;
        let scrollDelta = e.clientY - lastY;

        // UNPIN ONLY IF: At max, and dragging down
        if (
          prevScrollX >= maxScroll - 1 &&
          scrollDelta < 0
        ) {
          const rect = wrapper.getBoundingClientRect();
          if (
            rect.bottom >= window.innerHeight - SLACK_PX &&
            rect.bottom <= window.innerHeight + SLACK_PX
          ) {
            unpinContainer();
            lastX = e.clientX;
            lastY = e.clientY;
            return;
          }
        }

        // Always allow reverse (up) or less than max
        let scrollX = prevScrollX - scrollDelta;
        scrollX = Math.max(0, Math.min(maxScroll, scrollX));
        if (scrollX !== prevScrollX) {
          horizontalScrollData['process'].scrollX = scrollX;
          saveProcessScrollState(scrollX);
          const progress = scrollX / maxScroll;
          animateProcessCards('process', progress, cards);
        }
      }
    }

    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener('mouseup', function(e) {
    if (!isDragging) return;
    isDragging = false;
    gesturePointer = null;
    gestureTypeLocal = null;
    document.body.style.userSelect = '';
  });

  // Touch start
  container.addEventListener('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    isDragging = true;
    gesturePointer = 'touch';
    dragStartX = lastX = e.touches[0].clientX;
    dragStartY = lastY = e.touches[0].clientY;
    gestureTypeLocal = null;
  }, { passive: true });

  container.addEventListener('touchmove', function(e) {
    if (!isDragging || gesturePointer !== 'touch' || e.touches.length !== 1) return;
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const dx = touchX - dragStartX;
    const dy = touchY - dragStartY;
    if (!gestureTypeLocal) gestureTypeLocal = detectGesture(dx, dy);

    if (!containerPinned) return;
    
    if (
      isMobile() &&
      containerPinned &&
      projectsContainer.scrollTop === 0 &&
      (touchY - lastY) > 8 // user dragged up by at least 8px
    ) {
      unpinContainer();
    }

    if (activeProjectId && activeProjectId !== 'process') {
      if (gestureTypeLocal === 'horizontal') {
        e.preventDefault();
        let scrollDelta = touchX - lastX;
        horizontalScrollData[activeProjectId].scrollX -= scrollDelta;
        horizontalScrollData[activeProjectId].scrollX = Math.max(0, Math.min(horizontalScrollData[activeProjectId].scrollX, horizontalScrollData[activeProjectId].maxScroll));
        saveProjectScrollState(activeProjectId, horizontalScrollData[activeProjectId].scrollX);
        const cards = Array.from(document.querySelectorAll(`#${activeProjectId} .item.card`));
        const progress = horizontalScrollData[activeProjectId].scrollX / horizontalScrollData[activeProjectId].maxScroll;
        updateHorizontalAnimation(activeProjectId, progress, cards);
      }
    }
    if (activeProjectId === 'process') {
      if (gestureTypeLocal === 'vertical') {
        const cards = Array.from(document.querySelectorAll(`#process .process-card`));
        const maxScroll = horizontalScrollData['process'].maxScroll;
        const prevScrollX = horizontalScrollData['process'].scrollX;
        let scrollDelta = touchY - lastY;

        // --- UNPIN ONLY IF: At max, and user is dragging DOWN ---
        if (
          prevScrollX >= maxScroll - 1 &&
          scrollDelta < 0 // only on drag down
        ) {
          const rect = wrapper.getBoundingClientRect();
          if (
            rect.bottom >= window.innerHeight - SLACK_PX &&
            rect.bottom <= window.innerHeight + SLACK_PX
          ) {
            unpinContainer();
            lastX = touchX;
            lastY = touchY;
            return;
          }
        }

        // Always allow user to scroll UP (or before max) to reverse progress
        let scrollX = prevScrollX - scrollDelta;
        scrollX = Math.max(0, Math.min(maxScroll, scrollX));
        if (scrollX !== prevScrollX) {
          e.preventDefault();
          horizontalScrollData['process'].scrollX = scrollX;
          saveProcessScrollState(scrollX);
          const progress = scrollX / maxScroll;
          animateProcessCards('process', progress, cards);
        }
      }
    }
    lastX = touchX;
    lastY = touchY;
  }, { passive: false });

  container.addEventListener('touchend', function(e) {
    if (!isDragging) return;
    isDragging = false;
    gesturePointer = null;
    gestureTypeLocal = null;
  }, { passive: true });
}

['.scroll-zone-left', '.scroll-zone-right'].forEach(sel => {
  const el = document.querySelector(sel);
  if (el) {
    el.addEventListener('wheel', e => {
      //console.log(🌐 wheel event on ${sel}, 'deltaY =', e.deltaY);
    }, { passive: true });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initNavButtons();
  initScrollZones();
  initSectionObserver();
  initProcessScroll();
  initProjectScroll();
  initCardScrollHandlers();
  setProjectsContainerScrollable(false);
  setPageScrollLocked(false);
  setupGestureHandlers();
});

window.addEventListener('beforeunload', () => {
  setPageScrollLocked(false);
  delete window.processScrollState;
  sessionStorage.removeItem('processScrollX');
});

document.addEventListener('DOMContentLoaded', () => {
  wrapper = document.querySelector('.projects-wrapper');
  if (!wrapper) return;
  window.addEventListener('scroll', checkContainerLock);
  window.addEventListener('wheel', checkContainerLock, { passive: true });
  window.addEventListener('touchmove', checkContainerLock, { passive: true });
  // Set up user-initiated flag
  document.addEventListener('wheel', enableUserScrollFlag, { passive: true });
  document.addEventListener('touchmove', enableUserScrollFlag, { passive: true });
  document.addEventListener('keydown', e => {
    if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key)) {
      hasUserInitiatedScroll = true;
    }
  });

  // Remove scroll zones on mobile completely
  if (isMobile()) {
    document.querySelectorAll('.scroll-zone-left, .scroll-zone-right').forEach(zone => {
      zone.parentNode?.removeChild(zone);
    });
  }

  if (isMobile()) {
    const projectsContainer = document.querySelector('.projects-container');
    if (projectsContainer) {
      projectsContainer.addEventListener('scroll', function() {
        if (containerPinned && projectsContainer.scrollTop === 0 && lastScrollTop > 0) {
          unpinContainer();
        }
        lastScrollTop = projectsContainer.scrollTop;
      });
    }
  }
});

window.addEventListener('beforeunload', () => {
  delete window.processScrollState;
  sessionStorage.removeItem('processScrollX');
});