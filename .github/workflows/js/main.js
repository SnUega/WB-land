import './modules/header-lang/index.js';
import './modules/burger-menu/index.js';
import './modules/modal/index.js';
import './modules/ghost-words/index.js';
import SectionHeadingsAnimation from './modules/section-headings-animation/index.js';
import Section3Animation from './modules/section-3-animation/index.js';
import Section4Slider from './modules/section-4-slider/index.js';
let lenis;
function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
    window.lenis = lenis;
  } else {
    setTimeout(initLenis, 100);
  }
}
function initAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    new SectionHeadingsAnimation();
    new Section3Animation();
  } else {
    setTimeout(initAnimations, 100);
  }
  setTimeout(() => {
    new Section4Slider(window.lenis);
  }, 150);
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
