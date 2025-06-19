// logic/sectionScrollLogic.js
import { initTooltip, hideTooltip } from './tooltipManager.js';
import { setNavContext, goToCard } from './navControl.js';
import { isMobile } from '../utils/deviceCheck.js';
import { updateCardProgress } from '../animations/cardAnimator.js';

const sections = document.querySelectorAll('.project-section');
let currentSectionIndex = 0;
let processScrollValue = 0;
let processCards = [];
const processSection = document.querySelector('#process');
const isTouch = 'ontouchstart' in window;

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
  const rightZone = document.querySelector('.scroll-zone-right');

  if (leftZone) {
    leftZone.addEventListener('wheel', handleSectionSnap);
  }

  if (rightZone) {
    rightZone.addEventListener('wheel', (e) => e.preventDefault()); // block scroll if needed
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
        goToCard(0);
        setTimeout(() => {
          cards.forEach((card, index) => {
            const progress = Math.max(0, Math.min(1, initialProgress - index));
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

document.addEventListener('DOMContentLoaded', () => {
  initSectionSnapZones();
  initSectionObserver();
  initProcessScroll();
});

export { scrollToSection, currentSectionIndex };
