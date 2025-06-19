/* ======= containerScroll.js ======= */
// logic/containerScroll.js

let containerPinned = false;
const container = document.querySelector('.projects-container');

function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  document.body.style.overflow = '';
}

function pinContainer() {
  container.style.position = 'fixed';
  container.style.top = '0';
  lockBodyScroll();
  containerPinned = true;
}

function unpinContainer() {
  container.style.position = 'relative';
  unlockBodyScroll();
  containerPinned = false;
}

function checkContainerLock(scrollY) {
  const top = container.offsetTop;
  const height = container.offsetHeight;
  const bottom = top + height;

  if (!containerPinned && scrollY >= top && scrollY < bottom) {
    pinContainer();
  } else if (containerPinned && (scrollY < top || scrollY >= bottom)) {
    unpinContainer();
  }
}

window.addEventListener('scroll', () => {
  checkContainerLock(window.scrollY);
});

export { pinContainer, unpinContainer, containerPinned };