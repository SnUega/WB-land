import './modules/translations/index.js';
import './modules/header-lang/index.js';
import './modules/burger-menu/index.js';
import './modules/modal/index.js';
import './modules/ghost-words/index.js';
import './modules/form-dropdown/index.js';
import TabletPortraitOverlay from './modules/tablet-portrait-overlay/index.js';
import SmoothScroll from './modules/smooth-scroll/index.js';
import BackToTop from './modules/back-to-top/index.js';
import Section3Animation from './modules/section-3-animation/index.js';
import Section4Slider from './modules/section-4-slider/index.js';
import Section2Slider from './modules/section-2-slider/index.js';
import Section5Slider from './modules/section-5-slider/index.js';
import Section7Cards from './modules/section-7-cards/index.js';
import Section7Slider from './modules/section-7-slider/index.js';
import Section8Toggle from './modules/section-8-toggle/index.js';
import Section9Accordion from './modules/section-9-accordion/index.js';
import AppearAnimations from './modules/appear-animations/index.js';
import PreventHorizontalScroll from './modules/prevent-horizontal-scroll/index.js';
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
  new SmoothScroll();
  new BackToTop();
  new AppearAnimations();
  new PreventHorizontalScroll();
  
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    new Section3Animation();
  } else {
    setTimeout(initAnimations, 100);
  }
  setTimeout(() => {
    new Section4Slider(window.lenis);
  }, 150);
  new Section7Cards();
  new Section7Slider();
  new Section8Toggle();
  new Section9Accordion();
  new TabletPortraitOverlay();
  new Section2Slider();
  new Section5Slider();
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
