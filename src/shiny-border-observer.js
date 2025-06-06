class ShinyBorderObserver {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: 0.1 }
    );
  }

  observe(elements) {
    elements.forEach(el => this.observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shiny-border-active');
      } else {
        entry.target.classList.remove('shiny-border-active');
      }
    });
  }
}

// Initialize
const observer = new ShinyBorderObserver();
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.shiny-border');
  observer.observe(elements);
});