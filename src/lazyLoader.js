class LazyScriptLoader {
  constructor() {
    this.loadedScripts = new Set();
    this.loadingPromises = new Map();
  }

  async loadScript(name, path) {
    if (this.loadedScripts.has(name)) return;
    
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }

    const promise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = path;
      script.onload = () => {
        this.loadedScripts.add(name);
        resolve();
      };
      document.head.appendChild(script);
    });

    this.loadingPromises.set(name, promise);
    return promise;
  }

  async loadGSAP() {
    await this.loadScript('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
    await this.loadScript('scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js');
    window.dispatchEvent(new CustomEvent('siteLoaded'));
  }
}

const loader = new LazyScriptLoader();

// Load GSAP when user scrolls OR after 2 seconds
let gsapLoaded = false;
const loadGSAP = () => {
  if (!gsapLoaded) {
    gsapLoaded = true;
    loader.loadGSAP();
  }
};

window.addEventListener('scroll', loadGSAP, { once: true });
setTimeout(loadGSAP, 2000);