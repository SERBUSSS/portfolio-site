// animations/cardAnimator.js
import { isMobile } from '../utils/deviceCheck.js';
import { positions } from '../data/positions.js';
import gsap from 'gsap';

let currentCardIndex = 0;
let cardScrollValue = 0;
let activeProjectId = null;
let cards = [];

function getCardConfig(projectId, index) {
  const device = isMobile() ? 'mobile' : 'desktop';
  return positions[projectId]?.[index]?.[device];
}

function animateCard(cardEl, fromPos, toCenter, toFinal, progress) {
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(cardEl, {
    x: fromPos.x,
    y: fromPos.y,
    scale: fromPos.scale,
    opacity: fromPos.opacity,
    rotation: fromPos.rotation,
  }, {
    x: toCenter.x,
    y: toCenter.y,
    scale: toCenter.scale,
    opacity: toCenter.opacity,
    rotation: toCenter.rotation,
    duration: 0.5,
  });

  tl.to(cardEl, {
    x: toFinal.x,
    y: toFinal.y,
    scale: toFinal.scale,
    opacity: toFinal.opacity,
    rotation: toFinal.rotation,
    duration: 0.5,
  });

  tl.progress(progress);
}

function updateCardProgress(cardEl, projectId, index, scrollValue) {
  const config = getCardConfig(projectId, index);
  if (!config) return;

  const from = config.initial;
  const center = config.center;
  const final = config.final;

  animateCard(cardEl, from, center, final, scrollValue);
}

function setActiveProject(projectId) {
  activeProjectId = projectId;
  cards = Array.from(document.querySelectorAll(`#${projectId} .card`));
  cardScrollValue = 0;
}

function onDesktopHorizontalScroll(event) {
  const direction = Math.sign(event.deltaY);
  if (!cards.length || !activeProjectId) return;

  cardScrollValue += direction * 0.1; // tune this value
  cardScrollValue = Math.max(0, Math.min(cardScrollValue, cards.length));

  cards.forEach((card, index) => {
    const progress = Math.max(0, Math.min(1, cardScrollValue - index));
    updateCardProgress(card, activeProjectId, index, progress);
  });
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
  const rightZone = document.querySelector('.scroll-zone-right');
  if (rightZone && !isMobile()) {
    rightZone.addEventListener('wheel', onDesktopHorizontalScroll);
  }

  if (isMobile()) {
    document.querySelectorAll('.card-wrapper').forEach(wrapper => {
      wrapper.addEventListener('scroll', onMobileHorizontalScroll);
    });
  }
}

document.addEventListener('DOMContentLoaded', initCardScrollHandlers);

export { updateCardProgress, setActiveProject }