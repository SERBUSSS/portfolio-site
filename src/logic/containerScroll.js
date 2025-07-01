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
// Card snap state per section
window.cardSnapState = window.cardSnapState || {};
let cardScrollValue = 0;
let activeProjectId = null;
let cards = [];
window.horizontalScrollData = window.horizontalScrollData || {};
const horizontalScrollData = window.horizontalScrollData;
const PROJECTS_SCROLL_SENSITIVITY = 100;
const MOBILE_SCROLL_SENSITIVITY = 1;
const PROCESS_SCROLL_SENSITIVITY = 10;
const PERSIST_SCROLL_PROGRESS = false; // set to true for persistence
const PREVIEW_WIDTH = 0.25;

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

// ================================================
// Container Pinning & Page Locking
// ================================================
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

function setProjectsContainerScrollable(enabled) {
  const projectsContainer = document.querySelector('.projects-container');
  if (!projectsContainer) return;
  projectsContainer.style.overflowY = enabled ? 'auto' : 'hidden';
  projectsContainer.style.touchAction = enabled ? 'auto' : 'auto'; // for mobile
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
  fadeOutNavBar();
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

  // --- TOOLTIP FIX ---
  if (bestSectionId && bestSectionId !== 'process') {
    showProjectTooltip(bestSectionId);
    // Find cards in that section
    const cards = Array.from(document.querySelectorAll(`#${bestSectionId} .item.card`));
    // Progress for first card (index 0)
    updateTooltipContent(bestSectionId, 0, 0);
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
  fadeInNavBar();
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

// ================================================
// Scroll Zone Logic
// ================================================
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

function handleRightZoneScroll(e) {
  // console.log('RIGHT ZONE SCROLL DETECTED', e, 'activeProjectId:', activeProjectId);
  if (!containerPinned) {
    e.preventDefault();
    e.stopPropagation();
    return
  };

  // Use the current active project section ID
  if (activeProjectId) {
    onDesktopHorizontalScroll(activeProjectId, e);
    e.stopPropagation();
  }
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

// ================================================
// Section Scrolling & Snap (Vertical Navigation)
// ================================================
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

      // --- Card fade in/out logic ---
      let cardSelector = sectionId === 'process' ? '.process-card' : '.item.card';
      let cards = Array.from(section.querySelectorAll(cardSelector));
      if (cards.length) {
        if (entry.isIntersecting) {
          gsap.to(cards, { opacity: 1, duration: 1, overwrite: 'auto' });
        } else {
          gsap.to(cards, { opacity: 0, duration: 1, overwrite: 'auto' });
        }
      }

      if (!containerPinned) return;

      if (entry.isIntersecting) {
        showProjectTooltip(sectionId);
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
        hideAllProjectTooltips();
        hideTooltip();
        // --- Save the project scroll state on exit! ---
        if (sectionId !== 'process') {
          saveProjectScrollState(sectionId, horizontalScrollData[sectionId]?.scrollX || 0);
        }
        // NO card animation/reset here: cards remain where they were, just faded out!
      }
    });
  }, observerOptions);

  document.querySelectorAll('.project-section').forEach(section => {
    observer.observe(section);
  });
}

// ================================================
// Tooltip Management
// ================================================

function showProjectTooltip(projectId) {
  document.querySelectorAll('.project-tooltip-container').forEach(tooltip => {
    tooltip.classList.remove('visible');
    tooltip.style.display = 'none';
    tooltip._lastTooltipIndex = undefined;
  });
  const tooltip = document.querySelector(`#tooltip-${projectId}`);
  if (tooltip) {
    tooltip.classList.add('visible');
    tooltip.style.display = 'inline-flex';
    tooltip._lastTooltipIndex = undefined; // <-- reset for new section
  }
}

function hideAllProjectTooltips() {
  document.querySelectorAll('.project-tooltip-container').forEach(tooltip => {
    tooltip.classList.remove('visible');
    tooltip.style.display = 'none';
  });
}

function updateTooltipContent(projectId, cardIndex, cardProgress) {
  const tooltip = document.querySelector(`#tooltip-${projectId}`);
  if (!tooltip) {
    console.warn(`[tooltip] Tooltip not found for projectId=${projectId}`);
    return;
  }
  const contentEl = tooltip.querySelector('.tooltip-description');
  if (!contentEl) {
    console.warn(`[tooltip] .tooltip-description not found for projectId=${projectId}`);
    return;
  }

  // Snap mode: always show content fully visible!
  contentEl.style.opacity = '1';

  let lastIndex = tooltip.dataset.tooltipIndex !== undefined
    ? parseInt(tooltip.dataset.tooltipIndex, 10)
    : null;

  // --- Detect device type ---
  const isMobile = window.innerWidth <= 768;
  const deviceKey = isMobile ? 'mobile' : 'desktop';

  // --- Get card content from tooltipContent ---
  const section = tooltipContent[projectId];
  let cardContent = '';

  if (section && section.cards && section.cards[deviceKey]) {
    cardContent = section.cards[deviceKey][cardIndex];
  }

  if (lastIndex !== cardIndex) {
    if (cardIndex === 0) {
      if (!tooltip.dataset.originalHtml) {
        tooltip.dataset.originalHtml = contentEl.innerHTML;
      }
      contentEl.innerHTML = tooltip.dataset.originalHtml;
    } else if (cardContent !== undefined && cardContent !== null && String(cardContent).trim() !== '') {
      contentEl.textContent = cardContent;
    } else {
      contentEl.textContent = '(No content for this card)';
    }
    tooltip.dataset.tooltipIndex = cardIndex;
  }

  // Always keep the dataset updated
  tooltip.dataset.tooltipIndex = cardIndex;
}

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

// ================================================
// Navigation Control (Card Navigation)
// ================================================
function setNavContext(activeId) {
  projectId = activeId;
  cards = Array.from(document.querySelectorAll(`#${activeId} .card`));
  currentCard = 0;
  updateTooltip(projectId, currentCard);
  setActiveProject(projectId);

  if (projectId !== 'process') {
    let state = getCardSnapState(projectId, cards.length);
    state.cardIndex = 0;
    state.phase = 0;
    setCardSnapState(projectId, state);

    // --- Restore scroll and immediately animate cards on section entry! ---
    const savedScroll = restoreProjectScrollState(activeId);
    horizontalScrollData[activeId].scrollX = savedScroll;
    const progress = savedScroll / horizontalScrollData[activeId].maxScroll;
    const itemCards = Array.from(document.querySelectorAll(`#${activeId} .item.card`));

    if (isMobile()) {
    const wrapper = document.querySelector(`#${activeId} .card-wrapper`);
    if (wrapper) {
      wrapper.scrollLeft = horizontalScrollData[activeId].scrollX;
      console.log('[MOBILE] setNavContext restores scrollLeft:', horizontalScrollData[activeId].scrollX);
    }
  }

    if (savedScroll === 0) {
      // No previous progress: animate to preview position
      const previewTarget = PREVIEW_WIDTH * (0.9 / cards.length) * horizontalScrollData[activeId].maxScroll;
      gsap.to(horizontalScrollData[activeId], {
        scrollX: previewTarget,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => {
          updateHorizontalAnimation(
            activeId,
            horizontalScrollData[activeId].scrollX / horizontalScrollData[activeId].maxScroll,
            itemCards
          );
        }
      });
    } else {
      // Restore last scroll state
      updateHorizontalAnimation(activeId, progress, itemCards);
    }
  }

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
  document.querySelectorAll('.btn-prev').forEach(btn => btn.addEventListener('click', () => {
    if (activeProjectId && activeProjectId !== 'process') {
      snapCardScroll(activeProjectId, "prev");
    }
  }));
  document.querySelectorAll('.btn-next').forEach(btn => btn.addEventListener('click', () => {
    if (activeProjectId && activeProjectId !== 'process') {
      snapCardScroll(activeProjectId, "next");
    }
  }));
}

// ================================================
// Horizontal Scroll & Card Snap (Projects)
// ================================================
// Snap card scroll in given direction, updating phase and card index as needed.
function snapCardScroll(sectionId, direction, animationDuration = 0.8, delta = 50) {
  const cards = Array.from(document.querySelectorAll(`#${sectionId} .item.card`));
  if (!cards.length) return;
  const totalCards = cards.length;
  let state = getCardSnapState(sectionId, totalCards);

  if (state.animating) return;
  state.animating = true;

  // Work with latest scrollX to derive current index/progress
  const maxScroll = horizontalScrollData[sectionId].maxScroll;
  let currentProgress = horizontalScrollData[sectionId].scrollX / maxScroll;
  const isMobile = window.innerWidth <= 768;
  const progressPerCard = 0.9 / totalCards;
  const previewRatio = isMobile ? 0.15 : 0.3;
  const phase1End = 0.6 * progressPerCard;
  const previewEnd = previewRatio * phase1End;

  // Figure out the current snap index based on scrollX (not stale state)
  let cardIndex = Math.round((currentProgress - phase1End) / progressPerCard);
  cardIndex = Math.max(-1, Math.min(cardIndex, totalCards - 1));
  // (you may want to refine this logic further for edge cases)

  // Use state.cardIndex or cardIndex from scroll, whichever is higher
  state.cardIndex = typeof state.cardIndex === 'number' ? state.cardIndex : cardIndex;

  // --- SNAP NAVIGATION LOGIC ---
  if (direction === "next") {
    if (state.cardIndex === -1) {
      state.cardIndex = 0;
    } else if (state.cardIndex < totalCards) {
      state.cardIndex++;
    }
  } else if (direction === "prev") {
    if (state.cardIndex > -1) state.cardIndex--;
  }

  // ---- Mobile-specific: Also sync .card-wrapper scrollLeft if on mobile
  if (isMobile) {
    const wrapper = document.querySelector(`#${sectionId} .card-wrapper`);
    if (wrapper) {
      wrapper.scrollLeft = targetScrollX;
      console.log('[MOBILE] snapCardScroll sets wrapper.scrollLeft:', targetScrollX);
    }
  }

  // --- CALCULATE THE SNAP TARGET PROGRESS ---
  let targetProgress;
  if (state.cardIndex === -1) {
    targetProgress = previewEnd;
  } else if (state.cardIndex === 0) {
    targetProgress = phase1End;
  } else if (state.cardIndex >= totalCards) {
    targetProgress = 0.9;
  } else {
    targetProgress = state.cardIndex * progressPerCard + phase1End;
  }
  targetProgress = Math.max(0, Math.min(targetProgress, 0.9));
  const targetScrollX = targetProgress * maxScroll;
  const animDuration = animationDuration ?? (delta > 120 ? 0.6 : 1.0);
  const easeType = direction === "prev" ? "power2.inOut" : "power2.out";

  // ---- ALWAYS UPDATE horizontalScrollData BEFORE GSAP for instant sync
  horizontalScrollData[sectionId].scrollX = targetScrollX;
  saveProjectScrollState(sectionId, targetScrollX);

  gsap.to(horizontalScrollData[sectionId], {
    scrollX: targetScrollX,
    duration: animDuration,
    ease: easeType,
    onUpdate: () => {
      const p = horizontalScrollData[sectionId].scrollX / maxScroll;
      updateHorizontalAnimation(sectionId, p, cards);
      saveProjectScrollState(sectionId, horizontalScrollData[sectionId].scrollX);
    },
    onComplete: () => {
      horizontalScrollData[sectionId].scrollX = targetScrollX;
      saveProjectScrollState(sectionId, targetScrollX);
      // Update state.cardIndex and animating flag
      setCardSnapState(sectionId, { cardIndex: state.cardIndex, animating: false });
    }
  });

  // ---- Mobile-specific: Also sync .card-wrapper scrollLeft if on mobile
  if (isMobile) {
    const wrapper = document.querySelector(`#${sectionId} .card-wrapper`);
    if (wrapper) {
      wrapper.scrollLeft = targetScrollX;
      console.log('[MOBILE] snapCardScroll sets wrapper.scrollLeft:', targetScrollX);
    }
  }

  setCardSnapState(sectionId, state);
}

function getCardSnapState(sectionId, totalCards) {
  if (!window.cardSnapState[sectionId]) {
    window.cardSnapState[sectionId] = {
      snapIndex: -1, // -1 = preview, 0...N-1 = snapped to card
      animating: false
    };
  }
  let state = window.cardSnapState[sectionId];
  state.snapIndex = Math.max(-1, Math.min(state.snapIndex, totalCards - 1));
  return state;
}

function setCardSnapState(sectionId, newState) {
  window.cardSnapState[sectionId] = { ...window.cardSnapState[sectionId], ...newState };
}

// --- Project scroll handler (horizontal, for project1-4) ---
function handleProjectScroll(sectionId, e) {
  // Skip if process
  if (sectionId === 'process') return;
  if (!horizontalScrollData[sectionId] || !horizontalScrollData[sectionId].isActive) return;
  e.preventDefault();

  // Use the GSAP scrollX as source of truth for progress
  const delta = e.deltaX || e.deltaY;
  horizontalScrollData[sectionId].scrollX += delta / PROJECTS_SCROLL_SENSITIVITY;
  horizontalScrollData[sectionId].scrollX = Math.max(0, Math.min(horizontalScrollData[sectionId].scrollX, horizontalScrollData[sectionId].maxScroll));
  saveProjectScrollState(sectionId, horizontalScrollData[sectionId].scrollX);

  // Save for refresh/session
  saveProjectScrollState(sectionId, horizontalScrollData[sectionId].scrollX);

  // Animate cards
  const cards = Array.from(document.querySelectorAll(`#${sectionId} .item.card`));
  const progress = horizontalScrollData[sectionId].scrollX / horizontalScrollData[sectionId].maxScroll;
  updateHorizontalAnimation(sectionId, progress, cards);
}

function updateHorizontalAnimation(sectionId, progress, cards) {
    if (sectionId === 'process') return;

    const isMobile = window.innerWidth <= 768;
    const previewRatio = isMobile ? 0.15 : 0.3;

    const deviceKey = isMobile ? 'mobile' : 'desktop';
    const projectPositions = (cardPositions[sectionId] && cardPositions[sectionId][deviceKey]) || [];
    const totalCards = cards.length;
    const positionsCount = projectPositions.length;
    const progressPerCard = 0.9 / totalCards;
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
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

        // CARD 0: Special preview/phase1 logic
        if (index === 0) {
            const phase1Start = 0;
            const phase1End = 0.6 * progressPerCard;
            const previewEnd = previewRatio * (phase1End - phase1Start); // preview phase [0, previewEnd]

            if (progress < previewEnd) {
                // Preview phase: from initial position to preview point (15/30% of the way to center)
                const t = progress / previewEnd;
                const startX = window.innerWidth + card.offsetWidth / 2;
                const previewX = startX + (screenCenterX - startX) * previewRatio;
                gsap.set(card, {
                    x: startX + (previewX - startX) * t - card.offsetWidth / 2,
                    y: screenCenterY - card.offsetHeight / 2,
                    scale: 1,
                    opacity: t,
                    rotation: 0,
                    force3D: true,
                });
                return;
            }
            if (progress >= previewEnd && progress < phase1End) {
                // Phase 1 remainder: from preview point to center
                const t = (progress - previewEnd) / (phase1End - previewEnd);
                const startX = window.innerWidth + card.offsetWidth / 2 + (screenCenterX - (window.innerWidth + card.offsetWidth / 2)) * previewRatio;
                const endX = screenCenterX;
                gsap.set(card, {
                    x: startX + (endX - startX) * t - card.offsetWidth / 2,
                    y: screenCenterY - card.offsetHeight / 2,
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    force3D: true,
                });
                return;
            }
        }

        // All cards (including card 0 after phase1): normal logic
        const cardProgress = Math.max(0, Math.min(1, (progress - cardStartProgress) / progressPerCard));
        if (cardProgress <= 0.6) {
            // Phase 1: right to center
            const t = cardProgress / 0.6;
            const startX = window.innerWidth + card.offsetWidth / 2;
            const endX = screenCenterX;
            gsap.set(card, {
                x: startX + (endX - startX) * t - card.offsetWidth / 2,
                y: screenCenterY - card.offsetHeight / 2,
                scale: 1,
                opacity: t,
                rotation: 0,
                force3D: true,
            });
        } else {
            // Phase 2: center to final
            const t = (cardProgress - 0.6) / 0.4;
            const targetX = screenCenterX + finalX;
            const targetY = screenCenterY + finalY;
            const currentX = screenCenterX + (targetX - screenCenterX) * t - card.offsetWidth / 2;
            const currentY = screenCenterY + (targetY - screenCenterY) * t - card.offsetHeight / 2;
            const currentScale = 1 + (finalScale - 1) * t;
            const currentOpacity = 1 + (finalOpacity - 1) * t;
            const currentRotation = 0 + (finalRotation - 0) * t;
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

    // Tooltip logic unchanged
    if (sectionId !== 'process' && cards.length > 0) {
        const progressPerCard = 0.9 / cards.length;
        let activeCardIndex = 0, activeCardProgress = 0;
        for (let i = 0; i < cards.length; i++) {
            const cardStart = i * progressPerCard;
            const cardEnd = cardStart + progressPerCard;
            if (progress >= cardStart && progress < cardEnd) {
                activeCardIndex = i;
                activeCardProgress = (progress - cardStart) / progressPerCard;
                break;
            }
            if (progress >= (1 - progressPerCard)) {
                activeCardIndex = cards.length - 1;
                activeCardProgress = 1;
                break;
            }
        }
        updateTooltipContent(sectionId, activeCardIndex, activeCardProgress);
    }
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
  if (!horizontalScrollData[sectionId] || !horizontalScrollData[sectionId].isActive) return;
  if (sectionId === 'process') return;

  e.preventDefault();
  if (window.cardSnapState[sectionId]?.animating) return;

  const delta = Math.abs(e.deltaX || e.deltaY);
  if (delta < 30) return;

  const direction = (e.deltaX || e.deltaY) > 0 ? "next" : "prev";
  let animDuration = delta > 120 ? 0.35 : 0.9;
  snapCardScroll(sectionId, direction, animDuration);
}

function onMobileHorizontalScroll() {
  if (!isMobile() || !activeProjectId) return;

  const wrapper = document.querySelector(`#${activeProjectId} .card-wrapper`);
  if (!wrapper) return;
  const scrollLeft = wrapper.scrollLeft;

  // Sync to state for snap/nav consistency
  horizontalScrollData[activeProjectId].scrollX = scrollLeft;
  saveProjectScrollState(activeProjectId, scrollLeft);

  // Calculate progress for card animation
  const maxScroll = horizontalScrollData[activeProjectId].maxScroll;
  const progress = scrollLeft / maxScroll;

  const cards = Array.from(document.querySelectorAll(`#${activeProjectId} .item.card`));
  // Log scroll positions and data
  console.log('[MOBILE] onMobileHorizontalScroll', {
    scrollLeft,
    maxScroll,
    progress,
    horizontalScrollData: { ...horizontalScrollData[activeProjectId] }
  });

  updateHorizontalAnimation(activeProjectId, progress, cards);
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

// ================================================
// Process Card Animation
// ================================================
function setupProcessCards() {
  const container = processSection?.querySelector('.process-cards-container');
  if (!container) return;
  processCards = Array.from(container.querySelectorAll('.process-card'));
  processScrollValue = 0;
}

function animateProcessCards(sectionId, progress, cards) {
  const container = document.querySelector(`#${sectionId} .process-cards-container`);
  if (!container) return;

  const isMobileDevice = window.innerWidth <= 768;
  const deviceKey = isMobileDevice ? 'mobile' : 'desktop';
  const positions = (cardPositions[sectionId] && cardPositions[sectionId][deviceKey]) || [];

  const totalCards = cards.length;
  const positionsCount = positions.length;
  const progressPerCard = 0.9 / totalCards;

  // Reference: the container, not the viewport!
  const containerRect = container.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  // Fallbacks for card size
  const cardHeight = cards[0]?.offsetHeight || 100;
  const cardWidth = cards[0]?.offsetWidth || 100;

  cards.forEach((card, index) => {
    gsap.set(card, { transformOrigin: "50% 50%" });

    // Always absolutely position (optional: use CSS instead)
    card.style.position = 'absolute';
    card.style.top = '0';
    card.style.left = '0';

    const cardStart = index * progressPerCard;
    const cardProgress = Math.min(1, Math.max(0, (progress - cardStart) / progressPerCard));
    const posIndex = Math.min(index, positionsCount - 1);
    const finalPos = positions[posIndex] || { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 };

    // Relative to container
    const finalX = parseFloat(finalPos.x) * (containerWidth / 100); // assumes x is % of container width
    const finalY = parseFloat(finalPos.y) * (containerHeight / 100);
    const finalScale = parseFloat(finalPos.scale);
    const finalOpacity = parseFloat(finalPos.opacity);
    const finalRotation = parseFloat(finalPos.rotation);

    if (cardProgress === 0) {
      // Start below container, centered horizontally
      gsap.set(card, {
        x: centerX - cardWidth / 2,
        y: containerHeight + cardHeight, // below container bottom
        scale: 1,
        opacity: 0,
        rotation: 0,
        force3D: true,
      });
    } else if (cardProgress <= 0.6) {
      // Slide from below to center (all cards to center)
      const t = cardProgress / 0.6;
      const startY = containerHeight + cardHeight;
      const endY = centerY;
      const currentY = startY + (endY - startY) * t;
      gsap.set(card, {
        x: centerX - cardWidth / 2,
        y: currentY - cardHeight / 2,
        scale: 1,
        opacity: t,
        rotation: 0,
        force3D: true,
      });
    } else {
      // Center to final position (relative to container)
      const t = (cardProgress - 0.6) / 0.4;
      const startX = centerX;
      const startY = centerY;
      const endX = centerX + finalX;
      const endY = centerY + finalY;
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

// --- Helper: get if we're at the bottom of process scroll (for exit) ---
function isProcessScrollAtEnd() {
  if (!horizontalScrollData['process']) return false;
  // allow some floating point slack
  return horizontalScrollData['process'].scrollX >= horizontalScrollData['process'].maxScroll - 1;
}

// ================================================
// Scroll State Persistence
// ================================================
function saveProjectScrollState(sectionId, scrollX) {
  window.projectScrollState = window.projectScrollState || {};
  window.projectScrollState[sectionId] = scrollX;
  if (PERSIST_SCROLL_PROGRESS) {
    sessionStorage.setItem(`projectScrollX_${sectionId}`, scrollX);
  }
}

function restoreProjectScrollState(sectionId) {
  if (window.projectScrollState && window.projectScrollState[sectionId] !== undefined) {
    return window.projectScrollState[sectionId];
  }
  if (PERSIST_SCROLL_PROGRESS) {
    const stored = sessionStorage.getItem(`projectScrollX_${sectionId}`);
    return stored !== null ? Number(stored) : 0;
  }
  return 0;
}

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

// ================================================
// Gesture & Input Handling
// ================================================
// Gesture direction detection
function getGestureDirection(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > HORIZONTAL_THRESHOLD) return 'horizontal';
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > VERTICAL_THRESHOLD) return 'vertical';
  return null;
}

function enableUserScrollFlag() { hasUserInitiatedScroll = true; }

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

    // --- PROJECTS (horizontal drag progress on mobile) ---
    if (activeProjectId && activeProjectId !== 'process' && isMobile() && gestureTypeLocal === 'horizontal') {
      e.preventDefault?.();
      let scrollDelta = e.clientX - lastX;
      horizontalScrollData[activeProjectId].scrollX -= scrollDelta / MOBILE_SCROLL_SENSITIVITY;
      horizontalScrollData[activeProjectId].scrollX = Math.max(0, Math.min(horizontalScrollData[activeProjectId].scrollX, horizontalScrollData[activeProjectId].maxScroll));
      saveProjectScrollState(activeProjectId, horizontalScrollData[activeProjectId].scrollX);
      const cards = Array.from(document.querySelectorAll(`#${activeProjectId} .item.card`));
      const progress = horizontalScrollData[activeProjectId].scrollX / horizontalScrollData[activeProjectId].maxScroll;
      updateHorizontalAnimation(activeProjectId, progress, cards);
    }

    // --- PROCESS section (vertical) ---
    if (activeProjectId === 'process' && gestureTypeLocal === 'vertical') {
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

      let scrollX = prevScrollX - scrollDelta;
      scrollX = Math.max(0, Math.min(maxScroll, scrollX));
      if (scrollX !== prevScrollX) {
        horizontalScrollData['process'].scrollX = scrollX;
        saveProcessScrollState(scrollX);
        const progress = scrollX / maxScroll;
        animateProcessCards('process', progress, cards);
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

    // --- PROJECTS (horizontal drag progress on mobile) ---
    if (activeProjectId && activeProjectId !== 'process' && isMobile() && gestureTypeLocal === 'horizontal') {
      e.preventDefault();
      let scrollDelta = touchX - lastX;
      horizontalScrollData[activeProjectId].scrollX -= scrollDelta / MOBILE_SCROLL_SENSITIVITY;
      horizontalScrollData[activeProjectId].scrollX = Math.max(0, Math.min(horizontalScrollData[activeProjectId].scrollX, horizontalScrollData[activeProjectId].maxScroll));
      saveProjectScrollState(activeProjectId, horizontalScrollData[activeProjectId].scrollX);
      const cards = Array.from(document.querySelectorAll(`#${activeProjectId} .item.card`));
      const progress = horizontalScrollData[activeProjectId].scrollX / horizontalScrollData[activeProjectId].maxScroll;
      updateHorizontalAnimation(activeProjectId, progress, cards);
    }

    // --- PROCESS section (vertical) ---
    if (activeProjectId === 'process' && gestureTypeLocal === 'vertical') {
      const cards = Array.from(document.querySelectorAll(`#process .process-card`));
      const maxScroll = horizontalScrollData['process'].maxScroll;
      const prevScrollX = horizontalScrollData['process'].scrollX;
      let scrollDelta = touchY - lastY;

      // UNPIN ONLY IF: At max, and user is dragging DOWN
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
          lastX = touchX;
          lastY = touchY;
          return;
        }
      }

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

// ================================================
// Utility Functions
// ================================================
function isMobile() {
  return window.innerWidth <= 768;
}

function fadeOutNavBar() {
  const navBarCont = document.getElementById('nav-bar-cont');
  if (navBarCont && !navBarCont.classList.contains('nav-fade-out')) {
    navBarCont.classList.add('nav-fade-out');
  }
}

function fadeInNavBar() {
  const navBarCont = document.getElementById('nav-bar-cont');
  if (navBarCont && navBarCont.classList.contains('nav-fade-out')) {
    navBarCont.classList.remove('nav-fade-out');
  }
}

console.log('[INFO] isMobile:', isMobile());
console.log('[INFO] ontouchstart in window:', 'ontouchstart' in window);
console.log('[INFO] window.innerWidth:', window.innerWidth);

// animations/cardAnimator.js
function getCardConfig(projectId, index) {
  const device = isMobile() ? 'mobile' : 'desktop';
  return positions[projectId]?.[device]?.[index];
}

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