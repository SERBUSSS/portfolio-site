// logic/tooltipManager.js
import { isMobile } from '../utils/deviceCheck.js';
import { tooltipContent } from '../data/tooltipContent.js';
import gsap from 'gsap';

const tooltip = document.querySelector('.card-tooltip');
const tooltipText = tooltip?.querySelector('.tooltip-text');

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

export { updateTooltip, showTooltip, hideTooltip, initTooltip };