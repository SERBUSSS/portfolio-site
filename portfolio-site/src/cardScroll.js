// Ensure GSAP is loaded
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
} else {
  console.error("GSAP not found. Make sure it's included in your project.");
  // Handle the case where GSAP is not available, perhaps by providing a fallback
  // or preventing further execution of the script.
}


let tl; // Declare tl outside to make it accessible in the resize handler

function initializeCardScroll() {
  const cards = document.querySelectorAll(".card");
  if (!cards || cards.length === 0) {
      console.error("No card elements found. Make sure includeHTML has finished.");
      return;
  }

  const cardsContainer = document.querySelector("#cards-container");
  const windowHeight = window.innerHeight;
  const cardHeight = cards[0].offsetHeight;
  const initialY = windowHeight - cardHeight / 2;

  gsap.set(cards, {
      y: initialY,
      opacity: 0,
      scale: 1,
      rotation: 0,
      zIndex: (i) => cards.length - i
  });

  gsap.set(cards[0], { opacity: 1 });

  const rotations = [5, -7, 4, -6, 8, -5];
  const stackOffsets = [0, -10, -20, -30, -40, -50];


  tl = gsap.timeline({ // Now tl is assigned within the function
      scrollTrigger: {
          trigger: "#scroll-height",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: cardsContainer,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
              const activeIndex = Math.min(
                  Math.floor(self.progress * cards.length),
                  cards.length - 1
              );

              cards.forEach((card, i) => {
                  if (i === activeIndex) {
                      card.classList.add("card-active");
                  } else {
                      card.classList.remove("card-active");
                  }
              });
          }
      }
  });


  const sectionDuration = 1 / cards.length;

  cards.forEach((card, index) => {
      // ... (rest of the animation code remains the same)
  });


  window.addEventListener("resize", () => {
      if (tl && tl.scrollTrigger) {
          const progress = ScrollTrigger.getById(tl.scrollTrigger.id)?.progress;

          if (progress !== undefined) {
              // Previous resize logic using progress
              const newWindowHeight = window.innerHeight;
              const newCardHeight = cards[0].offsetHeight;
              const newInitialY = newWindowHeight - newCardHeight / 2;

              cards.forEach((card, index) => {
                  const cardIndex = Math.floor(progress * cards.length);

                  if (index > cardIndex) {
                      gsap.set(card, { y: newInitialY });
                  }
              });
          } else {
              console.warn("ScrollTrigger progress is undefined during resize. Possibly before initialization.");
          }

          ScrollTrigger.refresh(); // Keep this line to refresh ScrollTrigger
      }
  });


  if ('ontouchstart' in window || navigator.maxTouchPoints) {
      document.body.style.touchAction = "pan-y";
      document.documentElement.style.touchAction = "pan-y";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  includeHTML().then(initializeCardScroll);
});

