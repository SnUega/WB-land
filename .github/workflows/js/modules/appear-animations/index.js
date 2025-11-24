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
    this.initHeroAnimations();
    this.initLgCard();
    this.initWbCards();
    this.initSection2();
    this.initSection3Headers();
    this.initSection4();
    this.initSection5();
    this.initSection6();
    this.initSection7();
    this.initSection8();
    this.initSection9();
    this.initFooter();
  }

  createAnimationHandler(config) {
    const isMobile = window.innerWidth <= 768;
    const defaultTriggerStart = isMobile ? 'top 100%' : 'top 80%';
    
    const {
      element,
      initialProps,
      animateProps,
      triggerStart = defaultTriggerStart,
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
          onLeaveCallback();
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
          onLeaveCallback();
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

  animateHeadersCascade(headers, config = {}) {
    const isMobile = window.innerWidth <= 768;
    const {
      direction = 'bottom', // 'bottom' or 'right'
      distance = null, // Can be number or function that returns number
      duration = 1.2,
      ease = 'power2.out',
      cascadeDelay = 0.25,
      triggerStart = isMobile ? 'top 100%' : 'top 85%',
      triggerEnd = 'top top', // Reset when top of element reaches top of viewport (completely out)
      triggerElement = null // If provided, use this as trigger instead of first header
    } = config;

    const validHeaders = headers.filter(el => el !== null);
    if (validHeaders.length === 0) return;

    const getDistance = () => {
      if (typeof distance === 'function') return distance();
      if (distance !== null) return distance;
      return window.innerWidth < 768 ? 40 : window.innerWidth > 1920 ? 50 : 45;
    };

    const dist = getDistance();
    
    const getProps = (index) => {
      const initialProps = direction === 'bottom' 
        ? { opacity: 0, y: dist }
        : { opacity: 0, x: dist };
      
      const animateProps = direction === 'bottom'
        ? { opacity: 1, y: 0, duration, ease, delay: index * cascadeDelay }
        : { opacity: 1, x: 0, duration, ease, delay: index * cascadeDelay };
      
      return { initialProps, animateProps };
    };

    validHeaders.forEach((el) => {
      const { initialProps } = getProps(0);
      gsap.set(el, initialProps);
    });

    const trigger = triggerElement || validHeaders[0];
    
    const animateHeaders = () => {
      validHeaders.forEach((el, index) => {
        gsap.killTweensOf(el);
        const { initialProps, animateProps } = getProps(index);
        gsap.set(el, initialProps);
        gsap.to(el, animateProps);
      });
    };

    const resetHeaders = () => {
      validHeaders.forEach((el) => {
        gsap.killTweensOf(el);
        const dist = getDistance();
        const fadeOutProps = direction === 'bottom' 
          ? { opacity: 0, y: dist * 0.3, duration: 0.4, ease: 'power1.in' }
          : { opacity: 0, x: dist * 0.3, duration: 0.4, ease: 'power1.in' };
        
        gsap.to(el, fadeOutProps).then(() => {
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

  initLgCard() {
    const lgCard = document.querySelector('.lg-card');
    if (!lgCard) return;

    this.createAnimationHandler({
      element: lgCard,
      initialProps: { opacity: 0, scale: 0.85 },
      animateProps: { opacity: 1, scale: 1, duration: 1.6, ease: 'power1.out' },
      triggerStart: 'top 80%',
      triggerEnd: 'bottom top',
      once: false
    });

    this.initLgCardBars(lgCard);

    const cats = lgCard.querySelector('.lg-card__cats');
    const title = lgCard.querySelector('.lg-card__title');
    
    const isMobile = window.innerWidth <= 768;
    this.animateHeadersCascade([cats, title], {
      direction: 'bottom',
      cascadeDelay: 0.25,
      triggerStart: isMobile ? 'top 100%' : 'top 85%',
      triggerEnd: 'top top',
      duration: 1.0
    });

    const listItems = lgCard.querySelectorAll('.lg-card__list li');
    listItems.forEach((item, index) => {
      const distance = window.innerWidth < 768 ? -30 : window.innerWidth > 1920 ? -40 : -35;
      
      const isMobile = window.innerWidth <= 768;
      this.createAnimationHandler({
        element: item,
        initialProps: { opacity: 0, x: distance },
        animateProps: { opacity: 1, x: 0, duration: 1.2, ease: 'power2.out' },
        triggerStart: isMobile ? 'top 100%' : 'top 85%',
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
    
    const isMobile = window.innerWidth <= 768;
    ScrollTrigger.create({
      trigger: barsContainer,
      start: isMobile ? 'top 100%' : 'top 85%',
      end: 'bottom top',
      onEnter: animateBars,
      onEnterBack: animateBars,
      onLeave: resetBars,
      onLeaveBack: resetBars,
      once: false
    });
  }

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
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
        triggerEnd: 'top top',
        delay: 0.3,
        once: false,
        onLeaveCallback: () => {
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

  initSection2() {
    const section2Content = document.querySelector('.section-2__content');
    if (!section2Content) return;

    this.initSection2Headers(section2Content);
    this.initSection2Cards(section2Content);
  }

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

  initSection2Cards(section2) {
    const cards = section2.querySelectorAll('.stat-card');
    if (cards.length === 0) return;

    cards.forEach((card) => {
      const distance = window.innerWidth < 768 ? 40 : window.innerWidth > 1920 ? 60 : 50;
      
      this.createAnimationHandler({
        element: card,
        initialProps: { opacity: 0, scale: 1.1, y: distance },
        animateProps: { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
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
      triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  initSection4() {
    const section4 = document.querySelector('.section-4');
    if (!section4) return;

    this.initSection4Headers(section4);
    this.initSection4SliderCards(section4);
  }

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
      triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  initSection4SliderCards(section4) {
    const sliderItems = section4.querySelectorAll('.section-4__slider-item');
    if (sliderItems.length === 0) return;

    sliderItems.forEach((item, index) => {
      const card = item.querySelector('.slider-card');
      if (!card) return;

      this.createAnimationHandler({
        element: card,
        initialProps: { opacity: 0, scale: 0.2 },
        animateProps: { opacity: 1, scale: 1, duration: 1.8, ease: 'back.out(1.6)' },
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
        triggerEnd: 'top top',
        delay: index * 0.08,
        once: true
      });
    });
  }

  initSection5() {
    const section5 = document.querySelector('.section-5');
    if (!section5) return;

    this.initSection5Headers(section5);
    this.initSection5Elements(section5);
  }

  initSection5Headers(section5) {
    const title = section5.querySelector('.section-5__title');
    const question = section5.querySelector('.section-5__question');
    const desc = section5.querySelector('.section-5__desc');
    const headers = [title, question, desc].filter(el => el !== null);
    
    if (headers.length === 0) return;

    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

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
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
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

  initSection6() {
    const section6 = document.querySelector('.section-6');
    if (!section6) return;

    this.initSection6Headers(section6);
    this.initSection6Features(section6);
  }

  initSection6Headers(section6) {
    const subtitle = section6.querySelector('.section-6__subtitle');
    const title = section6.querySelector('.section-6__title');
    const headers = [subtitle, title].filter(el => el !== null);
    
    if (headers.length === 0) return;

    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

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

    const isMobile = window.innerWidth <= 768;
    ScrollTrigger.create({
      trigger: featuresContainer,
      start: isMobile ? 'top 100%' : 'top 85%',
      onEnter: animateFeatures,
      once: true
    });
  }

  initSection7() {
    const section7 = document.querySelector('.section-7');
    if (!section7) return;

    this.initSection7Headers(section7);
    this.initSection7SliderCards(section7);
    this.initSection7ProductCards(section7);
    this.initSection7CardTitles(section7);
    this.initSection7CardResults(section7);
  }

  initSection7Headers(section7) {
    const subtitle = section7.querySelector('.section-7__subtitle');
    const title = section7.querySelector('.section-7__title');
    const headers = [subtitle, title].filter(el => el !== null);
    
    if (headers.length === 0) return;

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
      triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
      triggerEnd: 'top top',
      duration: 1.2
    });
  }

  initSection7SliderCards(section7) {
    const sliderCards = section7.querySelectorAll('.section-7__card');
    if (sliderCards.length === 0) return;

    sliderCards.forEach((card, index) => {
      this.createAnimationHandler({
        element: card,
        initialProps: {
          opacity: 0,
          scale: 0.65
        },
        animateProps: {
          opacity: 1,
          scale: 1,
          duration: 1.8,
          ease: 'back.out(1.0)',
          delay: index * 0.08
        },
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
        once: true
      });
    });
  }

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
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 85%',
        once: true
      });
    });
  }

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

      const isMobile = window.innerWidth <= 768;
      ScrollTrigger.create({
        trigger: title,
        start: isMobile ? 'top 100%' : 'top 90%',
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

  initSection7CardResults(section7) {
    const resultsContainers = section7.querySelectorAll('.section-7__card-results');
    if (resultsContainers.length === 0) return;

    resultsContainers.forEach((resultsContainer) => {
      // Get all direct children of card-results
      const resultItems = Array.from(resultsContainer.children);
      if (resultItems.length === 0) return;

      resultItems.forEach((item) => {
        gsap.set(item, {
          opacity: 0,
          y: -30
        });
      });

      const animateResults = () => {
        resultItems.forEach((item, index) => {
          gsap.killTweensOf(item);
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.4 + (index * 0.15)
          });
        });
      };

      const isMobile = window.innerWidth <= 768;
      ScrollTrigger.create({
        trigger: resultsContainer,
        start: isMobile ? 'top 100%' : 'top 90%',
        onEnter: animateResults,
        once: true
      });
    });
  }

  initSection8() {
    const section8 = document.querySelector('.section-8');
    if (!section8) return;

    this.initSection8Headers(section8);
  }

  initSection8Headers(section8) {
    const subtitle = section8.querySelector('.section-8__subtitle');
    const title = section8.querySelector('.section-8__title');

    const headers = [subtitle, title].filter(el => el !== null);
    if (headers.length === 0) return;

    this.animateHeadersCascade(headers, {
      direction: 'bottom',
      cascadeDelay: 0.3,
      duration: 1.2
    });
  }

  initSection9() {
    const section9 = document.querySelector('.section-9');
    if (!section9) return;

    this.initSection9Headers(section9);
    this.initSection9Accordion(section9);
  }

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

  initSection9Accordion(section9) {
    const accordionItems = section9.querySelectorAll('.section-9__accordion-item');
    if (accordionItems.length === 0) return;

    accordionItems.forEach((item, index) => {
      const delay = index * 0.05;

      this.createAnimationHandler({
        element: item,
        initialProps: { opacity: 0, scale: 0.2 },
        animateProps: { opacity: 1, scale: 1, duration: 1.8, ease: 'back.out(1.4)' },
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 90%',
        triggerEnd: 'top top',
        delay: delay,
        once: true,
        onLeaveCallback: () => {
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
        triggerStart: window.innerWidth <= 768 ? 'top 100%' : 'top 90%',
        triggerEnd: 'top top',
        delay: delay,
        once: true
      });
    });
  }
}

export default AppearAnimations;
