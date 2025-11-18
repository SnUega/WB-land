// Main JS
import './modules/header-lang/index.js';
import './modules/burger-menu/index.js';
import './modules/modal/index.js';
import './modules/ghost-words/index.js';
import SectionHeadingsAnimation from './modules/section-headings-animation/index.js';
import Section3Animation from './modules/section-3-animation/index.js';
import Section4Slider from './modules/section-4-slider/index.js';
// Card clip-path теперь реализован через CSS, JavaScript модуль не нужен
// import CardClipManager from './modules/card-clip/index.js';
// new CardClipManager();

// Initialize Lenis Smooth Scroll
let lenis;

function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Интеграция с GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      // Если GSAP не загружен, используем requestAnimationFrame
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } else {
    // Ждем загрузки Lenis
    setTimeout(initLenis, 100);
  }
}

// Initialize animations after DOM and GSAP are ready
function initAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    new SectionHeadingsAnimation();
    new Section3Animation();
  } else {
    // Ждем загрузки GSAP
    setTimeout(initAnimations, 100);
  }
  
  // Инициализируем слайдер секции-4 (не требует GSAP)
  new Section4Slider();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initAnimations();
  });
} else {
  initLenis();
  initAnimations();
}

