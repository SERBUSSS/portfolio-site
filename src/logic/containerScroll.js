import { tooltipContent } from '../data/tooltipContent.js';
import { cardPositions } from '../data/positions.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ======= containerScroll.js ======= */
// logic/containerScroll.js
let wrapper;
let containerPinned = false;
let wrapperPlaceholder = null;

// animations/cardAnimator.js
let currentCardIndex = 0;
let cardScrollValue = 0;
let activeProjectId = null;
let cards = [];

// logic/sectionScrollLogic.js
const sections = document.querySelectorAll('.project-section');
let currentSectionIndex = 0;
let processScrollValue = 0;
let processCards = [];
const processSection = document.querySelector('#process');
const isTouch = 'ontouchstart' in window;

// logic/navControl.js
let currentCard = 0;
let projectId = null;

// logic/tooltipManager.js
const tooltip = document.querySelector('.card-tooltip');
const tooltipText = tooltip?.querySelector('.tooltip-text');

const handleRightZoneScroll = (e) => {
  e.preventDefault(); // stop page from scrolling
  onDesktopHorizontalScroll(e);
  console.log('[RIGHT ZONE] Scroll Triggered');
};

const handleLeftZoneScroll = (e) => {
  e.preventDefault(); // stop page from scrolling
  handleSectionSnap(e);
};

function blockScroll(e) {
  if (containerPinned && !e.target.closest('.scroll-zone-left, .scroll-zone-right')) {
    e.preventDefault();
  }
}

function isMobile() {
  return window.innerWidth <= 768;
}

function pinContainer() {
  if (containerPinned) return;
  document.querySelector('.projects-container').style.overflowY = 'scroll';

  window.addEventListener('wheel', blockScroll, { passive: false });

  console.log('📌 Container pinned');
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.width = '100%';
  document.body.style.overflow = 'hidden';
  containerPinned = true;

  // Insert placeholder to preserve scroll space
  wrapperPlaceholder = document.createElement('div');
  wrapperPlaceholder.style.height = `${wrapper.offsetHeight}px`;
  wrapper.parentNode.insertBefore(wrapperPlaceholder, wrapper);

  const leftZone = document.querySelector('.scroll-zone-left');
  const rightZone = document.querySelector('.scroll-zone-right');

  if (leftZone) {
    leftZone.style.pointerEvents = 'auto';
    leftZone.addEventListener('wheel', handleSectionSnap, { passive: false });
  }

  if (rightZone && !isMobile()) {
    rightZone.style.pointerEvents = 'auto';
    rightZone.addEventListener('wheel', handleRightZoneScroll, { passive: false });
    console.log('🟢 Bound rightZone scroll');
  }
}

function unpinContainer() {
  document.querySelector('.projects-container').style.overflowY = 'hidden';

  window.removeEventListener('wheel', blockScroll);

  if (wrapperPlaceholder) {
    wrapperPlaceholder.remove();
    wrapperPlaceholder = null;
  }

  console.log('🔓 Container unpinned');
  wrapper.style.position = 'relative';
  document.body.style.overflow = '';
  containerPinned = false;

  const leftZone = document.querySelector('.scroll-zone-left');
  const rightZone = document.querySelector('.scroll-zone-right');

  if (leftZone) {
    leftZone.removeEventListener('wheel', handleSectionSnap);
    leftZone.style.pointerEvents = 'none';
  }

  if (rightZone && !isMobile()) {
    rightZone.removeEventListener('wheel', handleRightZoneScroll);
    rightZone.style.pointerEvents = 'none';
    console.log('🔴 Unbound rightZone scroll');
  }
}

function checkContainerLock() {
  const rect = wrapper.getBoundingClientRect();
  if (!containerPinned && rect.top <= 0) {
    pinContainer();
  } else if (containerPinned && rect.top > 0) {
    unpinContainer();
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

function initSectionSnapZones() {
  const leftZone = document.querySelector('.scroll-zone-left');

  if (leftZone) {
    leftZone.addEventListener('wheel', handleSectionSnap);
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
  processCards = Array.from(container.querySelectorAll('.card'));
  processScrollValue = 0;
}

function animateProcessCards() {
  processCards.forEach((card, index) => {
    const progress = Math.max(0, Math.min(1, processScrollValue - index));
    updateCardProgress(card, 'process', index, progress);
  });
}

function handleProcessScroll(event) {
  const delta = Math.sign(event.deltaY);
  const maxScroll = processCards.length;

  processScrollValue += delta * 0.1;
  processScrollValue = Math.max(0, Math.min(maxScroll, processScrollValue));

  animateProcessCards();

  const isLastCardFullyIn = processScrollValue >= processCards.length;
  const isFirstCardAtStart = processScrollValue <= 0;

  if (isLastCardFullyIn) {
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
  }

  if (isFirstCardAtStart && delta < 0) {
    document.body.style.overflow = '';
  }
}

function initProcessScroll() {
  setupProcessCards();
  if (!processSection) return;

  processSection.addEventListener('wheel', (e) => {
    if (isTouch) return;
    e.preventDefault();
    handleProcessScroll(e);
  });
}

// animations/cardAnimator.js
function getCardConfig(projectId, index) {
  const device = isMobile() ? 'mobile' : 'desktop';
  return positions[projectId]?.[device]?.[index];
}

function animateCard(cardEl, fromPos, toCenter, toFinal, progress) {
  const tl = gsap.timeline({ paused: true });

  const parseX = (v) => `${parseFloat(v)}vw`;
  const parseY = (v) => `${parseFloat(v)}vh`;

  tl.fromTo(cardEl, {
    x: parseX(fromPos.x),
    y: parseY(fromPos.y),
    scale: fromPos.scale,
    opacity: fromPos.opacity,
    rotation: fromPos.rotation,
  }, {
    x: parseX(toCenter.x),
    y: parseY(toCenter.y),
    scale: toCenter.scale,
    opacity: toCenter.opacity,
    rotation: toCenter.rotation,
    duration: 0.5,
  });

  tl.to(cardEl, {
    x: parseX(toFinal.x),
    y: parseY(toFinal.y),
    scale: toFinal.scale,
    opacity: toFinal.opacity,
    rotation: toFinal.rotation,
    duration: 0.5,
  });

  tl.progress(progress);

  console.log(`[animateCard] progress=${progress}, from=`, fromPos, 'final=', toFinal);
}

function updateCardProgress(cardEl, projectId, index, scrollValue) {
  const device = isMobile() ? 'mobile' : 'desktop';
  const final = cardPositions[projectId]?.[device]?.[index];

  if (!final) {
    console.warn('Missing final card position', { projectId, device, index });
    return;
  }

  // infer initial and center positions
  const isProcess = projectId === 'process';

  const from = {
    x: isProcess ? 0 : '110vw',
    y: isProcess ? '110vh' : 0,
    scale: 0.5,
    opacity: 0,
    rotation: 0
  };

  const center = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: 0
  };

  animateCard(cardEl, from, center, final, scrollValue);
}

function setActiveProject(projectId) {
  activeProjectId = projectId;
  cards = Array.from(document.querySelectorAll(`#${projectId} .card`));
  cardScrollValue = 0;
}

function onDesktopHorizontalScroll(event) {
  console.log('[onDesktopHorizontalScroll]', { containerPinned, cardsLength: cards.length, activeProjectId });
  if (!containerPinned) return;

  // Use horizontal delta if significant, otherwise vertical
  let delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  const direction = Math.sign(delta);
  if (!cards.length || !activeProjectId) return;

  cardScrollValue += direction * 0.05; // tune this value
  const maxProgress = cards.length - 1;
  cardScrollValue = Math.max(0, Math.min(cardScrollValue, maxProgress));

  cards.forEach((card, index) => {
    const progress = Math.max(0, Math.min(1, cardScrollValue - index));
    console.log('[ScrollZone] Cards:', cards.length, 'Project:', activeProjectId);
    updateCardProgress(card, activeProjectId, index, progress);
    if (!cards.length) {
      console.warn('[onDesktopHorizontalScroll] No cards found for project:', activeProjectId);
      return;
    }
  });

  console.log('[onDesktopHorizontalScroll] Fired with delta', event.deltaY);
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

document.addEventListener('DOMContentLoaded', initCardScrollHandlers);

document.addEventListener('DOMContentLoaded', () => {
  initSectionSnapZones();
  initSectionObserver();
  initProcessScroll();
});

document.addEventListener('DOMContentLoaded', initNavButtons);

document.addEventListener('DOMContentLoaded', () => {
  wrapper = document.querySelector('.projects-wrapper');
  console.log('📦 wrapper found:', wrapper);
  if (!wrapper) return;
  window.addEventListener('scroll', () => {
    checkContainerLock(window.scrollY);
  });
});