class BackToTop {
  constructor() {
    this.button = document.querySelector('[data-back-to-top]');
    this.hero = document.querySelector('.hero-section');
    this.section2 = document.getElementById('section-2');
    this.lenis = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    if (!this.button) return;

    if (this.hero) {
      const heroRect = this.hero.getBoundingClientRect();
      const heroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
      if (heroVisible) {
        this.hideButton();
      } else if (this.section2) {
        const section2Rect = this.section2.getBoundingClientRect();
        if (section2Rect.top < window.innerHeight * 0.8) {
          setTimeout(() => this.showButton(), 100);
        }
      }
    }

    if (this.section2) {
      this.setupIntersectionObserver();
    } else {
      this.setupScrollListener();
    }

    if (window.lenis) {
      this.lenis = window.lenis;
    } else {
      const checkLenis = setInterval(() => {
        if (window.lenis) {
          this.lenis = window.lenis;
          clearInterval(checkLenis);
        }
      }, 100);
    }

    // Обработчик клика
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === this.hero) {
            if (entry.isIntersecting) {
              this.hideButton();
            }
          } else if (entry.target === this.section2) {
            if (entry.isIntersecting && !this.isVisible) {
              this.showButton();
            } else if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
              if (!this.isVisible) {
                this.showButton();
              }
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px',
      }
    );

    if (this.hero) {
      observer.observe(this.hero);
    }
    if (this.section2) {
      observer.observe(this.section2);
    }
  }

  setupScrollListener() {
    let ticking = false;
    const checkScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section2Top = this.section2 ? this.section2.getBoundingClientRect().top : 0;
          const scrollY = this.lenis ? this.lenis.scroll : window.scrollY;
          
          if (section2Top < window.innerHeight * 0.5 || scrollY > 600) {
            if (!this.isVisible) {
              this.showButton();
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    if (this.lenis) {
      this.lenis.on('scroll', checkScroll);
    } else {
      window.addEventListener('scroll', checkScroll, { passive: true });
    }
  }

  showButton() {
    if (this.isVisible) return;
    this.isVisible = true;
    this.button.classList.add('is-visible', 'bubble-appear');
    
    setTimeout(() => {
      this.button.classList.remove('bubble-appear');
    }, 600);
  }

  hideButton() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.button.classList.remove('is-visible', 'bubble-appear');
  }

  scrollToTop() {
    if (this.lenis) {
      this.lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}

export default BackToTop;

