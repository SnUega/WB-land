/**
 * Модуль плавной прокрутки через Lenis
 * Обрабатывает клики по ссылкам с data-smooth-scroll
 */
class SmoothScroll {
  constructor() {
    this.lenis = null;
    this.init();
  }

  init() {
    // Ждем инициализации Lenis
    if (window.lenis) {
      this.lenis = window.lenis;
      this.setupListeners();
    } else {
      // Если Lenis еще не инициализирован, ждем
      const checkLenis = setInterval(() => {
        if (window.lenis) {
          this.lenis = window.lenis;
          this.setupListeners();
          clearInterval(checkLenis);
        }
      }, 100);

      // Таймаут на случай, если Lenis не загрузится
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
    // Обработка всех ссылок с data-smooth-scroll
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

        // Закрываем мобильное меню, если открыто
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          const closeBtn = document.querySelector('[data-menu-close]');
          if (closeBtn) {
            closeBtn.click();
          } else {
            // Fallback: закрываем через класс
            mobileMenu.classList.remove('is-open');
            const burger = document.querySelector('[data-burger]');
            if (burger) {
              burger.classList.remove('is-active');
            }
            document.body.style.overflow = '';
          }
        }

        // Плавная прокрутка через Lenis
        if (this.lenis) {
          this.lenis.scrollTo(targetElement, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            offset: -20, // Небольшой отступ сверху
          });
        } else {
          // Fallback на нативную прокрутку
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  setupNativeScroll() {
    // Fallback для нативной плавной прокрутки
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

        // Закрываем мобильное меню
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

        // Нативная плавная прокрутка
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
  }
}

export default SmoothScroll;

