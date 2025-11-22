class AppearAnimations {
  constructor() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    // Hero section animations (first)
    this.initHeroAnimations();
    
    // LG card animations (second)
    this.initLgCard();
    
    // WB cards animations (third, with delay after lg-card)
    this.initWbCards();
    
    // Section-2 animations
    this.initSection2();
    
    // Section-3 animations (headers only, charts already animated)
    this.initSection3Headers();
    
    // Section-4 animations
    this.initSection4();
    
    // Section-5 animations
    this.initSection5();
    
    // Section-6 animations
    this.initSection6();
    
    // Section-7 animations
    this.initSection7();
    
    // Section-8 animations
    this.initSection8();
    
    // Section-9 animations
    this.initSection9();
    
    // Footer animations
    this.initFooter();
  }

  /**
   * Create reusable ScrollTrigger handlers for single element animations
   * Elements reset only when completely out of viewport (end: 'bottom top')
   */
  createAnimationHandler(config) {
    const {
      element,
      initialProps,
      animateProps,
      triggerStart = 'top 80%',
      triggerEnd = 'bottom top',
      delay = 0,
      once = false,
      onEnterCallback = null,
      onLeaveCallback = null
    } = config;

    gsap.set(element, initialProps);

    const handlers = {
      onEnter: () => {
        gsap.killTweensOf(element);
        gsap.set(element, initialProps);
        const animProps = { ...animateProps, delay };
        if (onEnterCallback) onEnterCallback();
        gsap.to(element, animProps);
      },
      onEnterBack: () => {
        gsap.killTweensOf(element);
        gsap.set(element, initialProps);
        const animProps = { ...animateProps, delay };
        if (onEnterCallback) onEnterCallback();
        gsap.to(element, animProps);
      }
    };

    if (!once) {
      handlers.onLeave = () => {
        gsap.killTweensOf(element);
        if (onLeaveCallback) {
          // Execute callback first (fade out), then reset
          onLeaveCallback();
          // Reset after fade out completes
          gsap.delayedCall(0.4, () => {
            gsap.set(element, initialProps);
          });
        } else {
          gsap.set(element, initialProps);
        }
      };
      handlers.onLeaveBack = () => {
        gsap.killTweensOf(element);
        if (onLeaveCallback) {
          // Execute callback first (fade out), then reset
          onLeaveCallback();
          // Reset after fade out completes
          gsap.delayedCall(0.4, () => {
            gsap.set(element, initialProps);
          });
        } else {
          gsap.set(element, initialProps);
        }
      };
    }

    ScrollTrigger.create({
      trigger: element,
      start: triggerStart,
      end: triggerEnd,
      ...handlers,
      once
    });
  }

  /**
   * Universal function to animate headers with cascade effect
   * Used for all header animations (hero, section-2, section-3, section-4, lg-card)
   */
  animateHeadersCascade(headers, config = {}) {
    const {
      direction = 'bottom', // 'bottom' or 'right'
      distance = null, // Can be number or function that returns number
      duration = 1.2,
      ease = 'power2.out',
      cascadeDelay = 0.25,
      triggerStart = 'top 85%',
      triggerEnd = 'top top', // Reset when top of element reaches top of viewport (completely out)
      triggerElement = null // If provided, use this as trigger instead of first header
    } = config;

    const validHeaders = headers.filter(el => el !== null);
    if (validHeaders.length === 0) return;

    // Get distance - support both function and number
    const getDistance = () => {
      if (typeof distance === 'function') return distance();
      if (distance !== null) return distance;
      return window.innerWidth < 768 ? 40 : window.innerWidth > 1920 ? 50 : 45;
    };

    const dist = getDistance();
    
    // Helper to get initial and animate props
    const getProps = (index) => {
      const initialProps = direction === 'bottom' 
        ? { opacity: 0, y: dist }
        : { opacity: 0, x: dist };
      
      const animateProps = direction === 'bottom'
        ? { opacity: 1, y: 0, duration, ease, delay: index * cascadeDelay }
        : { opacity: 1, x: 0, duration, ease, delay: index * cascadeDelay };
      
      return { initialProps, animateProps };
    };

    // Set initial state for all headers
    validHeaders.forEach((el) => {
      const { initialProps } = getProps(0);
      gsap.set(el, initialProps);
    });

    // Use provided trigger or first header
    const trigger = triggerElement || validHeaders[0];
    
    // Common animation function
    const animateHeaders = () => {
      validHeaders.forEach((el, index) => {
        gsap.killTweensOf(el);
        const { initialProps, animateProps } = getProps(index);
        gsap.set(el, initialProps);
        gsap.to(el, animateProps);
      });
    };

    // Common reset function with smooth fade out
    const resetHeaders = () => {
      validHeaders.forEach((el) => {
        gsap.killTweensOf(el);
        // Smooth fade out animation
        const dist = getDistance();
        const fadeOutProps = direction === 'bottom' 
          ? { opacity: 0, y: dist * 0.3, duration: 0.4, ease: 'power1.in' }
          : { opacity: 0, x: dist * 0.3, duration: 0.4, ease: 'power1.in' };
        
        gsap.to(el, fadeOutProps).then(() => {
          // Reset to initial state after fade out
          const { initialProps } = getProps(0);
          gsap.set(el, initialProps);
        });
      });
    };
    
    ScrollTrigger.create({
      trigger: trigger,
      start: triggerStart,
      end: triggerEnd,
      onEnter: animateHeaders,
      onEnterBack: animateHeaders,
      onLeave: resetHeaders,
      onLeaveBack: resetHeaders,
      once: false
    });
  }

  /**
   * Hero section: title and desc
   * Slide from right with fade, uses universal cascade function
   */
  initHeroAnimations() {
    const heroTitle = document.querySelector('.hero__title');
    const heroDesc = document.querySelector('.hero__desc');
    const headers = [heroTitle, heroDesc].filter(el => el !== null);
    
    if (headers.length === 0) return;

    const getHeroDistance = () => {
      const vw = window.innerWidth;
      if (vw < 768) return 60;
      if (vw > 1920) return 80;
      return 60 + ((vw - 768) / (1920 - 768)) * 20;
    };

    this.animateHeadersCascade(headers, {
      direction: 'right',
      distance: getHeroDistance,
      cascadeDelay: 0.25,
      triggerStart: 'top 80%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  /**
   * LG card: complex animations
   */
  initLgCard() {
    const lgCard = document.querySelector('.lg-card');
    if (!lgCard) return;

    // LG card itself - bubble effect
    this.createAnimationHandler({
      element: lgCard,
      initialProps: { opacity: 0, scale: 0.85 },
      animateProps: { opacity: 1, scale: 1, duration: 1.6, ease: 'power1.out' },
      triggerStart: 'top 80%',
      triggerEnd: 'bottom top',
      once: false
    });

    // Bars - animate from zero height
    this.initLgCardBars(lgCard);

    // Cats and title - slide from bottom with cascade
    const cats = lgCard.querySelector('.lg-card__cats');
    const title = lgCard.querySelector('.lg-card__title');
    
    this.animateHeadersCascade([cats, title], {
      direction: 'bottom',
      cascadeDelay: 0.25,
      triggerStart: 'top 85%',
      triggerEnd: 'top top',
      duration: 1.0
    });

    // List items with cascade - slide from left
    const listItems = lgCard.querySelectorAll('.lg-card__list li');
    listItems.forEach((item, index) => {
      const distance = window.innerWidth < 768 ? -30 : window.innerWidth > 1920 ? -40 : -35;
      
      this.createAnimationHandler({
        element: item,
        initialProps: { opacity: 0, x: distance },
        animateProps: { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' },
        triggerStart: 'top 85%',
        triggerEnd: 'bottom top',
        delay: index * 0.2,
        once: false,
        onEnterCallback: () => {
          const check = item.querySelector('.check');
          if (check) this.animateCheckIcon(check, index * 0.2);
        },
        onLeaveCallback: () => {
          const check = item.querySelector('.check');
          if (check) {
            gsap.killTweensOf(check);
            gsap.set(check, { opacity: 0, clipPath: 'inset(0 100% 0 0)' });
          }
        }
      });
    });
  }

  /**
   * Animate check icon with drawing effect
   */
  animateCheckIcon(check, delay = 0) {
    gsap.set(check, {
      opacity: 0,
      clipPath: 'inset(0 100% 0 0)'
    });
    
    gsap.to(check, {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.1,
      ease: 'power1.out',
      delay: delay + 0.15
    });
  }

  /**
   * LG card bars: animate from zero height using scaleY
   */
  initLgCardBars(lgCard) {
    const barsContainer = lgCard.querySelector('.bars');
    if (!barsContainer) return;

    const bars = Array.from(barsContainer.querySelectorAll('span'));
    if (bars.length === 0) return;
    
    const barsData = bars.map((bar, index) => {
      let delay = 0;
      if (index === 6 || index === 8 || index === 10 || index === 11) delay = 0;
      else if (index === 5 || index === 7 || index === 9) delay = 0.2;
      else if (index === 0) delay = 0.6;
      else delay = 0.4;
      return { bar, delay };
    });

    bars.forEach((bar) => {
      gsap.set(bar, { scaleY: 0, transformOrigin: 'bottom center' });
    });

    const animateBars = () => {
      bars.forEach((bar) => gsap.set(bar, { scaleY: 0 }));
      barsData.forEach(({ bar, delay }) => {
        gsap.to(bar, { scaleY: 1, duration: 1.5, ease: 'power1.out', delay });
      });
    };

    const resetBars = () => {
      bars.forEach((bar) => {
        gsap.killTweensOf(bar);
        gsap.set(bar, { scaleY: 0 });
      });
    };
    
    ScrollTrigger.create({
      trigger: barsContainer,
      start: 'top 85%',
      end: 'bottom top',
      onEnter: animateBars,
      onEnterBack: animateBars,
      onLeave: resetBars,
      onLeaveBack: resetBars,
      once: false
    });
  }

  /**
   * WB cards: bubble effect
   */
  initWbCards() {
    const allWbCards = document.querySelectorAll('.wb-card');
    const wbCards = Array.from(allWbCards).filter((card) => {
      const section = card.closest('.section-2, .section-4, .section-7');
      return !section;
    });
    
    wbCards.forEach((card) => {
      this.createAnimationHandler({
        element: card,
        initialProps: { opacity: 0, scale: 0.2 },
        animateProps: { opacity: 1, scale: 1, duration: 1.8, ease: 'back.out(1.4)' },
        triggerStart: 'top 85%',
        triggerEnd: 'top top',
        delay: 0.3,
        once: false,
        onLeaveCallback: () => {
          // Smooth fade out for wb-cards
          gsap.to(card, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: 'power1.in'
          });
        }
      });
    });
  }

  /**
   * Section-2 animations
   */
  initSection2() {
    const section2Content = document.querySelector('.section-2__content');
    if (!section2Content) return;

    this.initSection2Headers(section2Content);
    this.initSection2Cards(section2Content);
  }

  /**
   * Section-2 headers: same animation as hero (right to left) with cascade
   * Uses universal cascade function
   */
  initSection2Headers(section2) {
    const headerLeft = section2.querySelector('.section-2__header-left');
    if (!headerLeft) return;

    const subtitle = headerLeft.querySelector('.section-2__subtitle');
    const title = headerLeft.querySelector('.section-2__title');
    const desc = headerLeft.querySelector('.section-2__desc');
    const headers = [subtitle, title, desc].filter(el => el !== null);
    
    if (headers.length === 0) return;

    const getHeroDistance = () => {
      const vw = window.innerWidth;
      if (vw < 768) return 60;
      if (vw > 1920) return 80;
      return 60 + ((vw - 768) / (1920 - 768)) * 20;
    };

    this.animateHeadersCascade(headers, {
      direction: 'right',
      distance: getHeroDistance,
      cascadeDelay: 0.25,
      triggerStart: 'top 80%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  /**
   * Section-2 cards: simultaneously, from slight scale up with bottom to top shift and fade
   */
  initSection2Cards(section2) {
    const cards = section2.querySelectorAll('.stat-card');
    if (cards.length === 0) return;

    cards.forEach((card) => {
      const distance = window.innerWidth < 768 ? 40 : window.innerWidth > 1920 ? 60 : 50;
      
      this.createAnimationHandler({
        element: card,
        initialProps: { opacity: 0, scale: 1.1, y: distance },
        animateProps: { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        triggerStart: 'top 85%',
        triggerEnd: 'bottom top',
        once: false,
        onEnterCallback: () => this.animateSection2CardContent(card, 0.2),
        onLeaveCallback: () => {
          const header = card.querySelector('.stat-card__header');
          const valueWrapper = card.querySelector('.stat-card__value-wrapper');
          const listItems = card.querySelectorAll('.stat-card__list-item');
          [header, valueWrapper, ...listItems].forEach(el => {
            if (el) {
              gsap.killTweensOf(el);
              gsap.set(el, { opacity: 0, y: -20 });
            }
          });
        }
      });
    });
  }

  /**
   * Animate content inside section-2 cards: cascade top to bottom
   */
  animateSection2CardContent(card, baseDelay = 0) {
    const header = card.querySelector('.stat-card__header');
    const valueWrapper = card.querySelector('.stat-card__value-wrapper');
    const listItems = card.querySelectorAll('.stat-card__list-item');
    
    const contentElements = [];
    if (header) contentElements.push(header);
    if (valueWrapper) contentElements.push(valueWrapper);
    listItems.forEach(item => contentElements.push(item));
    
    contentElements.forEach((el) => {
      gsap.killTweensOf(el);
      gsap.set(el, { opacity: 0, y: -20 });
    });
    
    contentElements.forEach((el, index) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        delay: baseDelay + (index * 0.2)
      });
    });
  }

  /**
   * Section-3 headers: slide from bottom with fade and cascade
   * Uses universal cascade function
   */
  initSection3Headers() {
    const section3 = document.querySelector('.section-3');
    if (!section3) return;

    const title = section3.querySelector('.section-3__title');
    const question = section3.querySelector('.section-3__question');
    const responses = section3.querySelector('.section-3__responses');
    const headers = [title, question, responses].filter(el => el !== null);
    
    if (headers.length === 0) return;

    // Use first header as trigger for better onEnterBack behavior
    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      triggerStart: 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  /**
   * Section-4 animations
   */
  initSection4() {
    const section4 = document.querySelector('.section-4');
    if (!section4) return;

    this.initSection4Headers(section4);
    this.initSection4SliderCards(section4);
  }

  /**
   * Section-4 headers: slide from bottom with fade and cascade
   * Uses universal cascade function
   */
  initSection4Headers(section4) {
    const title = section4.querySelector('.section-4__title');
    const question = section4.querySelector('.section-4__question');
    const desc = section4.querySelector('.section-4__desc');
    const headers = [title, question, desc].filter(el => el !== null);
    
    if (headers.length === 0) return;

    // Use first header as trigger for better onEnterBack behavior
    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      triggerStart: 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  /**
   * Section-4 slider cards: bubble effect with cascade (same as wb-cards but with increased amplitude)
   */
  initSection4SliderCards(section4) {
    const sliderItems = section4.querySelectorAll('.section-4__slider-item');
    if (sliderItems.length === 0) return;

    sliderItems.forEach((item, index) => {
      const card = item.querySelector('.slider-card');
      if (!card) return;

      // Bubble effect with increased amplitude
      this.createAnimationHandler({
        element: card,
        initialProps: { opacity: 0, scale: 0.2 },
        animateProps: { opacity: 1, scale: 1, duration: 1.8, ease: 'back.out(1.6)' },
        triggerStart: 'top 85%',
        triggerEnd: 'top top',
        delay: index * 0.08,
        once: true
      });
    });
  }

  /**
   * Section-5 animations
   */
  initSection5() {
    const section5 = document.querySelector('.section-5');
    if (!section5) return;

    // Headers: same animation as section-3 and section-4
    this.initSection5Headers(section5);
    
    // Elements with bubble effect in cascade groups
    this.initSection5Elements(section5);
  }

  /**
   * Section-5 headers: same animation as section-3 and section-4
   */
  initSection5Headers(section5) {
    const title = section5.querySelector('.section-5__title');
    const question = section5.querySelector('.section-5__question');
    const desc = section5.querySelector('.section-5__desc');
    const headers = [title, question, desc].filter(el => el !== null);
    
    if (headers.length === 0) return;

    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      triggerStart: 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  /**
   * Section-5 elements: bubble effect with precise cascade order
   * Exclude: woman.png, scarf.png, bag-1.png
   */
  initSection5Elements(section5) {
    // Define elements in exact order with their delays
    const elements = [
      { selector: '.advantage-card--1', delay: 0 }, // 1 - бейдж-1
      { selector: '.section-5__product-img--cream', delay: 0.1 }, // 2 - cream.png (минимальная задержка)
      { selector: '.wb-card--section-5-2', delay: 0.15 }, // 3 - карточка товаров (ботинки) (почти без задержки)
      { selector: '.advantage-card--2', delay: 0.3 }, // 4 - бейдж-2 (небольшая задержка но маленькая)
      { selector: '.advantage-card--3', delay: 0.35 }, // 5 - бейдж-3 (почти нету задержки)
      { selector: '.wb-card--section-5-1', delay: 0.4 }, // 6 - карточка товара (сумочка) (почти нету задержки)
      { selector: '.advantage-card--4', delay: 0.6 }, // 7 - бейдж-4 (небольшая задержка)
      { selector: '.section-5__product-img--cream-2', delay: 0.7 } // 8 - cream-2.png
    ];

    elements.forEach(({ selector, delay }) => {
      const element = section5.querySelector(selector);
      if (!element) return;

      this.createAnimationHandler({
        element: element,
        initialProps: { opacity: 0, scale: 0.2 },
        animateProps: { opacity: 1, scale: 1, duration: 1.8, ease: 'back.out(1.4)' },
        triggerStart: 'top 85%',
        triggerEnd: 'top top',
        delay: delay,
        once: false,
        onLeaveCallback: () => {
          // Smooth fade out
          gsap.to(element, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: 'power1.in'
          });
        }
      });
    });
  }

  /**
   * Section-6 animations
   */
  initSection6() {
    const section6 = document.querySelector('.section-6');
    if (!section6) return;

    // Headers: same animation as section-3, 4, 5
    this.initSection6Headers(section6);
    
    // Features: embossed text effect animation
    this.initSection6Features(section6);
  }

  /**
   * Section-6 headers: same animation as section-3, 4, 5
   */
  initSection6Headers(section6) {
    const subtitle = section6.querySelector('.section-6__subtitle');
    const title = section6.querySelector('.section-6__title');
    const headers = [subtitle, title].filter(el => el !== null);
    
    if (headers.length === 0) return;

    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      triggerStart: 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  /**
   * Section-6 features: embossed text effect (appear from scale up with pressing effect)
   * All features animate simultaneously
   */
  initSection6Features(section6) {
    const features = section6.querySelectorAll('.section-6__feature');
    if (features.length === 0) return;

    const featuresContainer = section6.querySelector('.section-6__features');
    if (!featuresContainer) return;

    const animateFeatures = () => {
      features.forEach((feature) => {
        gsap.killTweensOf(feature);
        gsap.set(feature, {
          opacity: 0,
          scale: 1.3,
          x: 0,
          y: -20,
          textShadow: '0px 0px 0px rgba(255,255,255,0)'
        });
        gsap.to(feature, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          textShadow: '2px 2px 2px rgba(255,255,255,0.3)',
          duration: 1.0,
          ease: 'power2.out'
        });
      });
    };

    const resetFeatures = () => {
      features.forEach((feature) => {
        gsap.killTweensOf(feature);
        gsap.set(feature, {
          opacity: 0,
          scale: 1.3,
          x: 0,
          y: -20,
          textShadow: '0px 0px 0px rgba(255,255,255,0)'
        });
      });
    };

    ScrollTrigger.create({
      trigger: featuresContainer,
      start: 'top 85%',
      onEnter: animateFeatures,
      once: true
    });
  }

  /**
   * Section-7 animations
   */
  initSection7() {
    const section7 = document.querySelector('.section-7');
    if (!section7) return;

    // Headers: same animation as hero and section-2 (right to left)
    this.initSection7Headers(section7);
    
    // Slider cards: bubble effect, only on first appearance
    this.initSection7SliderCards(section7);
    
    // Product cards inside slider: bubble effect (reuse common animation)
    this.initSection7ProductCards(section7);
    
    // Card titles: appear from bottom like peeking over a fence
    this.initSection7CardTitles(section7);
    
    // Card results: cascade from top to bottom
    this.initSection7CardResults(section7);
  }

  /**
   * Section-7 headers: same animation as hero and section-2 (right to left)
   */
  initSection7Headers(section7) {
    const subtitle = section7.querySelector('.section-7__subtitle');
    const title = section7.querySelector('.section-7__title');
    const headers = [subtitle, title].filter(el => el !== null);
    
    if (headers.length === 0) return;

    // Get adaptive distance function from hero
    const getHeroDistance = () => {
      const baseDistance = 50;
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 768) {
        return baseDistance * 0.6;
      } else if (viewportWidth < 1024) {
        return baseDistance * 0.8;
      }
      return baseDistance;
    };

    this.animateHeadersCascade(headers, {
      direction: 'right',
      distance: getHeroDistance,
      cascadeDelay: 0.25,
      triggerStart: 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  /**
   * Section-7 slider cards: bubble effect with reduced amplitude, only on first appearance
   */
  initSection7SliderCards(section7) {
    const sliderCards = section7.querySelectorAll('.section-7__card');
    if (sliderCards.length === 0) return;

    sliderCards.forEach((card, index) => {
      this.createAnimationHandler({
        element: card,
        initialProps: {
          opacity: 0,
          scale: 0.65 // Increased from 0.5 to make cards larger at start
        },
        animateProps: {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: 'back.out(1.0)', // Reduced amplitude further to prevent overlap
          delay: index * 0.08
        },
        triggerStart: 'top 85%',
        once: true
      });
    });
  }

  /**
   * Section-7 product cards: reuse common bubble animation
   */
  initSection7ProductCards(section7) {
    const productCards = section7.querySelectorAll('.section-7__card-product .wb-card--section-5');
    if (productCards.length === 0) return;

    productCards.forEach((card) => {
      this.createAnimationHandler({
        element: card,
        initialProps: {
          opacity: 0,
          scale: 0.2
        },
        animateProps: {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: 'back.out(1.4)',
          delay: 0.3
        },
        triggerStart: 'top 85%',
        once: true
      });
    });
  }

  /**
   * Section-7 card titles: appear from bottom like peeking over a fence/curtain
   */
  initSection7CardTitles(section7) {
    const cardTitles = section7.querySelectorAll('.section-7__card-title');
    if (cardTitles.length === 0) return;

    cardTitles.forEach((title) => {
      // Use y transform for better compatibility
      gsap.set(title, {
        opacity: 0,
        y: 30,
        clipPath: 'inset(100% 0 0 0)' // Fully hidden from bottom
      });

      ScrollTrigger.create({
        trigger: title,
        start: 'top 90%',
        onEnter: () => {
          // Check if title is already animated (has data attribute)
          if (title.dataset.animated === 'true') return;
          
          gsap.killTweensOf(title);
          gsap.to(title, {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.16, // Increased by 0.16s
            ease: 'power1.out', // Smoother easing
            delay: 0.3, // Delay after card appears
            onComplete: () => {
              title.dataset.animated = 'true';
            }
          });
        },
        once: true
      });
    });
  }

  /**
   * Section-7 card results: cascade from top to bottom with fade
   */
  initSection7CardResults(section7) {
    const resultsContainers = section7.querySelectorAll('.section-7__card-results');
    if (resultsContainers.length === 0) return;

    resultsContainers.forEach((resultsContainer) => {
      // Get all direct children of card-results
      const resultItems = Array.from(resultsContainer.children);
      if (resultItems.length === 0) return;

      // Set initial state for all items
      resultItems.forEach((item) => {
        gsap.set(item, {
          opacity: 0,
          y: -30
        });
      });

      // Use container as trigger for unified cascade
      const animateResults = () => {
        resultItems.forEach((item, index) => {
          gsap.killTweensOf(item);
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.4 + (index * 0.15) // Start after card and title appear
          });
        });
      };

      ScrollTrigger.create({
        trigger: resultsContainer,
        start: 'top 90%',
        onEnter: animateResults,
        once: true
      });
    });
  }

  /**
   * Section-8 animations
   */
  initSection8() {
    const section8 = document.querySelector('.section-8');
    if (!section8) return;

    // Headers: same animation as sections 3, 4, 5, 6 (bottom to top)
    this.initSection8Headers(section8);
  }

  /**
   * Section-8 headers: same animation as sections 3, 4, 5, 6
   * Note: description is excluded from animation
   */
  initSection8Headers(section8) {
    const subtitle = section8.querySelector('.section-8__subtitle');
    const title = section8.querySelector('.section-8__title');
    // description excluded from animation per user request

    const headers = [subtitle, title].filter(el => el !== null);
    if (headers.length === 0) return;

    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      duration: 1.2
    });
  }

  /**
   * Section-9 animations
   */
  initSection9() {
    const section9 = document.querySelector('.section-9');
    if (!section9) return;

    // Headers: same animation as sections 3, 4, 5, 6, 8
    this.initSection9Headers(section9);
    this.initSection9Accordion(section9);
  }

  /**
   * Section-9 headers: same animation as sections 3, 4, 5, 6, 8
   */
  initSection9Headers(section9) {
    const title = section9.querySelector('.section-9__title');
    const desc = section9.querySelector('.section-9__desc');

    const headers = [title, desc].filter(el => el !== null);
    if (headers.length === 0) return;

    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      duration: 1.2
    });
  }

  /**
   * Section-9 accordion items: bubble effect with cascade from top to bottom
   */
  initSection9Accordion(section9) {
    const accordionItems = section9.querySelectorAll('.section-9__accordion-item');
    if (accordionItems.length === 0) return;

    accordionItems.forEach((item, index) => {
      const delay = index * 0.05; // Cascade from top to bottom (reduced delay)

      this.createAnimationHandler({
        element: item,
        initialProps: { opacity: 0, scale: 0.2 },
        animateProps: { opacity: 1, scale: 1, duration: 1.8, ease: 'back.out(1.4)' },
        triggerStart: 'top 90%', // Start earlier
        triggerEnd: 'top top',
        delay: delay,
        once: true,
        onLeaveCallback: () => {
          // Smooth fade out
          gsap.to(item, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: 'power1.in'
          });
        }
      });
    });
  }

  /**
   * Footer animations: cascade from top to bottom with fade and slight scale
   */
  initFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const footerElements = [
      footer.querySelector('.footer__desc'),
      footer.querySelector('.footer__phone'),
      footer.querySelector('.footer__contacts'),
      footer.querySelector('.footer__legal')
    ].filter(el => el !== null);

    footerElements.forEach((element, index) => {
      const delay = index * 0.1;

      this.createAnimationHandler({
        element: element,
        initialProps: { opacity: 0, y: -20, scale: 0.95 },
        animateProps: { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
        triggerStart: 'top 90%',
        triggerEnd: 'top top',
        delay: delay,
        once: true
      });
    });
  }
}

export default AppearAnimations;
