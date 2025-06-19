/* ======= containerScroll.js ======= */
// logic/containerScroll.js
let wrapper;
let containerPinned = false;

function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  document.body.style.overflow = '';
}

function pinContainer() {
  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  lockBodyScroll();
  containerPinned = true;
}

function unpinContainer() {
  wrapper.style.position = 'relative';
  unlockBodyScroll();
  containerPinned = false;
}

function checkContainerLock(scrollY) {
  const top = wrapper.offsetTop;
  const height = wrapper.offsetHeight;
  const bottom = top + height;

  if (!containerPinned && scrollY >= top && scrollY < bottom) {
    pinContainer();
  } else if (containerPinned && (scrollY < top || scrollY >= bottom)) {
    unpinContainer();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  wrapper = document.querySelector('.project-wrapper');
  if (!wrapper) return;
  window.addEventListener('scroll', () => {
    checkContainerLock(window.scrollY);
  });
});

export { pinContainer, unpinContainer, containerPinned };