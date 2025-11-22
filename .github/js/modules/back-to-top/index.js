/**
 * Модуль кнопки "Вернуться наверх"
 * Показывает кнопку при достижении секции 2 с эффектом пузыря
 */
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

    // Проверяем начальное состояние
    if (this.hero) {
      const heroRect = this.hero.getBoundingClientRect();
      const heroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
      if (heroVisible) {
        // Hero видна - кнопка должна быть скрыта
        this.hideButton();
      } else if (this.section2) {
        const section2Rect = this.section2.getBoundingClientRect();
        if (section2Rect.top < window.innerHeight * 0.8) {
          // Секция 2 уже видна - показываем кнопку
          setTimeout(() => this.showButton(), 100);
        }
      }
    }

    // Используем Intersection Observer для отслеживания секции 2
    if (this.section2) {
      this.setupIntersectionObserver();
    } else {
      // Fallback: показываем при скролле
      this.setupScrollListener();
    }

    // Ждем инициализации Lenis для прокрутки
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
    // Наблюдаем за hero и section-2
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === this.hero) {
            // Если hero видна - скрываем кнопку
            if (entry.isIntersecting) {
              this.hideButton();
            }
          } else if (entry.target === this.section2) {
            // Если section-2 видна - показываем кнопку
            if (entry.isIntersecting && !this.isVisible) {
              this.showButton();
            } else if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
              // Проскроллили мимо section-2 - показываем кнопку
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
    // Fallback: определяем позицию секции 2 и показываем кнопку
    let ticking = false;
    const checkScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const section2Top = this.section2 ? this.section2.getBoundingClientRect().top : 0;
          const scrollY = this.lenis ? this.lenis.scroll : window.scrollY;
          
          // Показываем когда секция 2 видна или когда проскроллили мимо секции 2
          // После секции 2 кнопка всегда видна
          if (section2Top < window.innerHeight * 0.5 || scrollY > 600) {
            if (!this.isVisible) {
              this.showButton();
            }
            // Не скрываем кнопку после секции 2
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
    
    // Убираем класс анимации после завершения
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
      // Плавная прокрутка через Lenis
      this.lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Fallback на нативную прокрутку
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
}

export default BackToTop;

