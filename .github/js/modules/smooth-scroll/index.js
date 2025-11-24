class SmoothScroll {
  constructor() {
    this.lenis = null;
    this.init();
  }

  init() {
    if (window.lenis) {
      this.lenis = window.lenis;
      this.setupListeners();
    } else {
      const checkLenis = setInterval(() => {
        if (window.lenis) {
          this.lenis = window.lenis;
          this.setupListeners();
          clearInterval(checkLenis);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkLenis);
        if (!this.lenis) {
          console.warn('Lenis not found, using native smooth scroll');
          this.setupNativeScroll();
        }
      }, 5000);
    }
  }

  setupListeners() {
    const links = document.querySelectorAll('[data-smooth-scroll]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        if (!href || !href.startsWith('#')) {
          return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (!targetElement) {
          return;
        }

        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          const closeBtn = document.querySelector('[data-menu-close]');
          if (closeBtn) {
            closeBtn.click();
          } else {
            mobileMenu.classList.remove('is-open');
            const burger = document.querySelector('[data-burger]');
            if (burger) {
              burger.classList.remove('is-active');
            }
            document.body.style.overflow = '';
          }
        }

        if (this.lenis) {
          this.lenis.scrollTo(targetElement, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            offset: -20,
          });
        } else {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  setupNativeScroll() {
    const links = document.querySelectorAll('[data-smooth-scroll]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        if (!href || !href.startsWith('#')) {
          return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (!targetElement) {
          return;
        }

        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          const closeBtn = document.querySelector('[data-menu-close]');
          if (closeBtn) {
            closeBtn.click();
          } else {
            mobileMenu.classList.remove('is-open');
            const burger = document.querySelector('[data-burger]');
            if (burger) {
              burger.classList.remove('is-active');
            }
            document.body.style.overflow = '';
          }
        }

        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  }
}

export default SmoothScroll;

