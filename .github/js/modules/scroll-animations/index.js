class ScrollAnimations {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    this.initHeadings();
    this.initRepeatAnimations();
    this.initSection2Cards();
    this.initSection7Cards();
    this.initSection6Features();
    this.initSection5Badges();
    this.initProductCards();
    this.initCardsOnce();
  }

  createObserver(options, callback, repeat = false) {
    const key = JSON.stringify(options);
    if (this.observers.has(key)) {
      return this.observers.get(key);
    }

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
          entry.target.classList.remove('is-visible');
        }
      });
    }, options);

    this.observers.set(key, observer);
    return observer;
  }

  initHeadings() {
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
        el.dataset.animationDisabled = 'true';
        headings.push(el);
      });
    });
    
    headings.forEach((heading) => {
      const classList = Array.from(heading.classList);
      
      const isHeroHeading = (heading.classList.contains('hero__title') || heading.classList.contains('hero__desc'));
      const isSection2Heading = heading.classList.contains('section-2__subtitle') || heading.classList.contains('section-2__title') || heading.classList.contains('section-2__desc');
      const isSection7Heading = heading.classList.contains('section-7__title');
      
      let animationClass = 'animate-heading-center';
      
      if (isHeroHeading) {
        animationClass = 'animate-heading-right';
      } else if (isSection7Heading) {
        animationClass = 'animate-heading-right-smooth';
      } else if (isSection2Heading) {
        animationClass = 'animate-heading-top';
      }
      
      heading.classList.add(animationClass);
    });

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
          const isHeroElement = entry.target.closest('.hero-section');
          const delayTime = isHeroElement ? 400 : 100;
          
          entry.target.classList.remove('is-visible');
          void entry.target.offsetWidth;
          
          const shouldDelay = isFirstCheck && entry.boundingClientRect.top < window.innerHeight;
          if (shouldDelay) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delayTime);
          } else {
            entry.target.classList.add('is-visible');
          }
        } else {
          entry.target.classList.remove('is-visible');
          void entry.target.offsetWidth;
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: window.innerWidth <= 768 ? '150px 0px' : '50px 0px' 
    });

    headings.forEach((heading) => {
      observer.observe(heading);
    });
  }

  initRepeatAnimations() {
    const section3Elements = document.querySelectorAll('.section-3__chart, .section-3__responses-number, .section-3__chart-grid, .section-3__chart-axis');
    
    section3Elements.forEach((el) => {
      el.classList.add('animate-repeat-on-scroll');
    });

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
          entry.target.classList.remove('is-visible');
          void entry.target.offsetWidth;
          
          if (isFirstCheck && entry.boundingClientRect.top < window.innerHeight) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, 100);
          } else {
            entry.target.classList.add('is-visible');
          }
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { 
      threshold: 0.1, 
      rootMargin: window.innerWidth <= 768 ? '150px 0px' : '50px 0px' 
    });

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
      { 
        threshold: 0.1, 
        rootMargin: window.innerWidth <= 768 ? '200px 0px' : '100px 0px' 
      },
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
    }, { 
      threshold: 0.1, 
      rootMargin: window.innerWidth <= 768 ? '200px 0px' : '100px 0px' 
    });

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
      { 
        threshold: 0.1, 
        rootMargin: window.innerWidth <= 768 ? '200px 0px' : '100px 0px' 
      },
      (element) => {
        const features = Array.from(document.querySelectorAll('.section-6__feature'));
        const index = features.indexOf(element);
        const delay = index * 80;
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
      },
      true
    );

    features.forEach((feature) => {
      observer.observe(feature);
    });
  }

  initSection5Badges() {
    const group1 = [
      ...document.querySelectorAll('.section-5 .wb-card--section-5-1'),
      ...document.querySelectorAll('.section-5 .wb-card--section-5-2'),
      ...document.querySelectorAll('.section-5 .advantage-card--1'),
      ...document.querySelectorAll('.section-5 .advantage-card--2')
    ];
    
    const group2 = [
      ...document.querySelectorAll('.section-5 .advantage-card--3'),
      ...document.querySelectorAll('.section-5 .section-5__product-img--cream')
    ];
    
    const group3 = [
      ...document.querySelectorAll('.section-5 .advantage-card--4'),
      ...document.querySelectorAll('.section-5 .section-5__product-img--cream-2')
    ];
    
    const allElements = [...group1, ...group2, ...group3];
    
    allElements.forEach((element) => {
      element.classList.add('animate-badge-section-5');
    });

    const observer = this.createObserver(
      { 
        threshold: 0.1, 
        rootMargin: window.innerWidth <= 768 ? '200px 0px' : '100px 0px' 
      },
      (element) => {
        let delay = 0;
        if (group1.includes(element)) {
          delay = 0;
        } else if (group2.includes(element)) {
          delay = 300;
        } else if (group3.includes(element)) {
          delay = 600;
        }
        
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
      },
      true
    );

    allElements.forEach((element) => {
      observer.observe(element);
    });
  }

  initProductCards() {
    const productCards = document.querySelectorAll('.wb-card:not(.section-5 .wb-card)');
    
    productCards.forEach((card) => {
      if (!card.classList.toString().match(/animate-/)) {
        card.classList.add('animate-badge-section-5');
      }
    });

    const observer = this.createObserver(
      { 
        threshold: 0.1, 
        rootMargin: window.innerWidth <= 768 ? '200px 0px' : '100px 0px' 
      },
      (element) => {
        element.classList.add('is-visible');
      },
      true
    );

    productCards.forEach((card) => {
      observer.observe(card);
    });
  }

  initCardsOnce() {
    const cards = document.querySelectorAll('[class*="card"]:not(.section-2 [class*="card"]):not(.section-7__card):not(.section-4 [class*="card"]):not(.wb-card)');
    
    cards.forEach((card) => {
      if (!card.classList.toString().match(/animate-/)) {
        card.classList.add('animate-card-once');
      }
    });

    const observer = this.createObserver(
      { 
        threshold: 0.1, 
        rootMargin: window.innerWidth <= 768 ? '200px 0px' : '100px 0px' 
      },
      (element) => {
        element.classList.add('is-visible');
      },
      true
    );

    cards.forEach((card) => {
      observer.observe(card);
    });
  }
}

export default ScrollAnimations;

