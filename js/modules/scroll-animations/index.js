class ScrollAnimations {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Headings animations
    this.initHeadings();
    
    // Section-3 graphs and numbers (repeat on each viewport entry)
    this.initRepeatAnimations();
    
    // Cards section-2
    this.initSection2Cards();
    
    // Cards section-7 slider
    this.initSection7Cards();
    
    // Section-6 features
    this.initSection6Features();
    
    // Badges section-5
    this.initSection5Badges();
    
    // Product cards (wb-card) - bubble effect
    this.initProductCards();
    
    // Other cards (only first appearance)
    this.initCardsOnce();
  }

  createObserver(options, callback, repeat = false) {
    const key = JSON.stringify(options);
    if (this.observers.has(key)) {
      return this.observers.get(key);
    }

    // Track if this is the first check to add delay for initially visible elements
    let isFirstCheck = true;
    const initialCheck = () => {
      setTimeout(() => {
        isFirstCheck = false;
      }, 300);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialCheck);
    } else {
      initialCheck();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (repeat || !entry.target.dataset.animated) {
            // If first check and element is already visible, add small delay
            if (isFirstCheck && entry.boundingClientRect.top < window.innerHeight) {
              setTimeout(() => {
                callback(entry.target);
                if (!repeat) {
                  entry.target.dataset.animated = 'true';
                }
              }, 100);
            } else {
              callback(entry.target);
              if (!repeat) {
                entry.target.dataset.animated = 'true';
              }
            }
          }
        } else if (repeat) {
          // Reset animation when element leaves viewport for repeat animations
          entry.target.classList.remove('is-visible');
        }
      });
    }, options);

    this.observers.set(key, observer);
    return observer;
  }

  initHeadings() {
    // Use specific selectors to avoid conflicts with GSAP animations
    const headingSelectors = [
      '.section-2__subtitle', '.section-2__title', '.section-2__desc',
      '.section-3__title', '.section-3__question', '.section-3__responses',
      '.section-4__title', '.section-4__question', '.section-4__desc',
      '.section-5__title', '.section-5__question', '.section-5__desc',
      '.section-6__subtitle', '.section-6__title',
      '.section-7__title', '.section-8__subtitle', '.section-8__title',
      '.hero__title', '.hero__desc'
    ];
    
    const headings = [];
    headingSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Disable GSAP animations for these headings
        el.dataset.animationDisabled = 'true';
        headings.push(el);
      });
    });
    
    headings.forEach((heading) => {
      const classList = Array.from(heading.classList);
      
      // Special cases
      const isHeroHeading = (heading.classList.contains('hero__title') || heading.classList.contains('hero__desc'));
      const isSection2Heading = heading.classList.contains('section-2__subtitle') || heading.classList.contains('section-2__title') || heading.classList.contains('section-2__desc');
      const isSection7Heading = heading.classList.contains('section-7__title');
      
      // Determine alignment and add appropriate class
      let animationClass = 'animate-heading-center'; // default: bottom to top
      
      if (isHeroHeading) {
        // Hero: right to left
        animationClass = 'animate-heading-right';
      } else if (isSection7Heading) {
        // Section-7: right to left with more smoothness and offset
        animationClass = 'animate-heading-right-smooth';
      } else if (isSection2Heading) {
        // Section-2: top to bottom
        animationClass = 'animate-heading-top';
      }
      // All others (3,4,5,6,8): bottom to top (default)
      
      heading.classList.add(animationClass);
    });

    // Track if this is the first check to add delay for initially visible elements
    let isFirstCheck = true;
    const initialCheck = () => {
      setTimeout(() => {
        isFirstCheck = false;
      }, 300);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialCheck);
    } else {
      initialCheck();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Check if element is in hero section for longer delay
          const isHeroElement = entry.target.closest('.hero-section');
          const delayTime = isHeroElement ? 400 : 100;
          
          // Reset animation state first
          entry.target.classList.remove('is-visible');
          // Force reflow to ensure animation resets
          void entry.target.offsetWidth;
          
          // If first check and element is already visible, add delay
          const shouldDelay = isFirstCheck && entry.boundingClientRect.top < window.innerHeight;
          if (shouldDelay) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delayTime);
          } else {
            // Add visible class to trigger animation immediately
            entry.target.classList.add('is-visible');
          }
        } else {
          // Reset when leaving viewport for repeat animations (all headings should repeat)
          entry.target.classList.remove('is-visible');
          // Force reflow to ensure animation resets for next time
          void entry.target.offsetWidth;
        }
      });
    }, { threshold: 0.1, rootMargin: '50px 0px' });

    headings.forEach((heading) => {
      observer.observe(heading);
    });
  }

  initRepeatAnimations() {
    // Section-3 graphs and numbers
    const section3Elements = document.querySelectorAll('.section-3__chart, .section-3__responses-number, .section-3__chart-grid, .section-3__chart-axis');
    
    section3Elements.forEach((el) => {
      el.classList.add('animate-repeat-on-scroll');
    });

    // Track if this is the first check to add delay for initially visible elements
    let isFirstCheck = true;
    const initialCheck = () => {
      setTimeout(() => {
        isFirstCheck = false;
      }, 300);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialCheck);
    } else {
      initialCheck();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Reset animation state first
          entry.target.classList.remove('is-visible');
          // Force reflow to ensure animation resets
          void entry.target.offsetWidth;
          
          // If first check and element is already visible, add small delay
          if (isFirstCheck && entry.boundingClientRect.top < window.innerHeight) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, 100);
          } else {
            // Add visible class to trigger animation immediately
            entry.target.classList.add('is-visible');
          }
        } else {
          // Reset when leaving viewport for repeat animations
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '50px 0px' });

    section3Elements.forEach((el) => {
      observer.observe(el);
    });
  }

  initSection2Cards() {
    const cards = document.querySelectorAll('.section-2 [class*="card"], .section-2 [class*="item"]');
    
    cards.forEach((card) => {
      card.classList.add('animate-card-section-2');
    });

    const observer = this.createObserver(
      { threshold: 0.1, rootMargin: '100px 0px' },
      (element) => {
        element.classList.add('is-visible');
      },
      false // Only first appearance
    );

    cards.forEach((card) => {
      observer.observe(card);
    });
  }

  initSection7Cards() {
    const cards = document.querySelectorAll('.section-7__slider-item .section-7__card');
    
    cards.forEach((card, index) => {
      card.classList.add('animate-card-section-7');
    });

    // Track if this is the first check to add delay for initially visible elements
    let isFirstCheck = true;
    const initialCheck = () => {
      setTimeout(() => {
        isFirstCheck = false;
      }, 300);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialCheck);
    } else {
      initialCheck();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!entry.target.dataset.animated) {
            const index = Array.from(entry.target.parentElement.parentElement.querySelectorAll('.section-7__slider-item')).indexOf(entry.target.parentElement);
            const delay = index * 100;
            
            // If first check and element is already visible, add small delay
            if (isFirstCheck && entry.boundingClientRect.top < window.innerHeight) {
              setTimeout(() => {
                entry.target.classList.add('is-visible');
                entry.target.dataset.animated = 'true';
              }, 100 + delay);
            } else {
              setTimeout(() => {
                entry.target.classList.add('is-visible');
                entry.target.dataset.animated = 'true';
              }, delay);
            }
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '100px 0px' });

    cards.forEach((card) => {
      observer.observe(card);
    });
  }

  initSection6Features() {
    const features = document.querySelectorAll('.section-6__feature');
    
    features.forEach((feature) => {
      feature.classList.add('animate-feature-section-6');
    });

    const observer = this.createObserver(
      { threshold: 0.1, rootMargin: '100px 0px' },
      (element) => {
        const features = Array.from(document.querySelectorAll('.section-6__feature'));
        const index = features.indexOf(element);
        const delay = index * 80; // Cascade delay
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
      },
      true // Repeat on each viewport entry
    );

    features.forEach((feature) => {
      observer.observe(feature);
    });
  }

  initSection5Badges() {
    // Group 1: cards and badges 1 and 2 (first)
    const group1 = [
      ...document.querySelectorAll('.section-5 .wb-card--section-5-1'),
      ...document.querySelectorAll('.section-5 .wb-card--section-5-2'),
      ...document.querySelectorAll('.section-5 .advantage-card--1'),
      ...document.querySelectorAll('.section-5 .advantage-card--2')
    ];
    
    // Group 2: badge 3 and cream.png (second)
    const group2 = [
      ...document.querySelectorAll('.section-5 .advantage-card--3'),
      ...document.querySelectorAll('.section-5 .section-5__product-img--cream')
    ];
    
    // Group 3: badge 4 and cream-2.png (third)
    const group3 = [
      ...document.querySelectorAll('.section-5 .advantage-card--4'),
      ...document.querySelectorAll('.section-5 .section-5__product-img--cream-2')
    ];
    
    // Combine all elements
    const allElements = [...group1, ...group2, ...group3];
    
    allElements.forEach((element) => {
      element.classList.add('animate-badge-section-5');
    });

    const observer = this.createObserver(
      { threshold: 0.1, rootMargin: '100px 0px' },
      (element) => {
        // Determine which group the element belongs to
        let delay = 0;
        if (group1.includes(element)) {
          delay = 0;
        } else if (group2.includes(element)) {
          delay = 300; // 300ms after group 1
        } else if (group3.includes(element)) {
          delay = 600; // 600ms after group 1 (300ms after group 2)
        }
        
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
      },
      true // Repeat on each viewport entry
    );

    allElements.forEach((element) => {
      observer.observe(element);
    });
  }

  initProductCards() {
    // All wb-card elements on the page (except section-5 which are already animated)
    const productCards = document.querySelectorAll('.wb-card:not(.section-5 .wb-card)');
    
    productCards.forEach((card) => {
      // Skip if already has animation class
      if (!card.classList.toString().match(/animate-/)) {
        card.classList.add('animate-badge-section-5');
      }
    });

    const observer = this.createObserver(
      { threshold: 0.1, rootMargin: '100px 0px' },
      (element) => {
        element.classList.add('is-visible');
      },
      true // Repeat on each viewport entry
    );

    productCards.forEach((card) => {
      observer.observe(card);
    });
  }

  initCardsOnce() {
    // Other cards that should animate on each viewport entry (excluding section-2, section-4, section-7 cards and wb-card which are handled separately)
    const cards = document.querySelectorAll('[class*="card"]:not(.section-2 [class*="card"]):not(.section-7__card):not(.section-4 [class*="card"]):not(.wb-card)');
    
    cards.forEach((card) => {
      // Skip if already has animation class
      if (!card.classList.toString().match(/animate-/)) {
        card.classList.add('animate-card-once');
      }
    });

    const observer = this.createObserver(
      { threshold: 0.1, rootMargin: '100px 0px' },
      (element) => {
        element.classList.add('is-visible');
      },
      true // Repeat on each viewport entry
    );

    cards.forEach((card) => {
      observer.observe(card);
    });
  }
}

export default ScrollAnimations;

