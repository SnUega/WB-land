// Universal Section Headings Animation with ScrollTrigger
// GSAP и ScrollTrigger должны быть подключены через CDN

class SectionHeadingsAnimation {
  constructor() {
    // Проверяем наличие GSAP
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }

  init() {
    // Находим все секции (включая hero-section)
    const sections = document.querySelectorAll('section[class^="section-"], section.hero-section');

    sections.forEach((section) => {
      // Определяем селекторы заголовков для каждой секции
      const headingSelectors = this.getHeadingSelectors(section);
      
      if (headingSelectors.length === 0) return;

      // Получаем элементы заголовков
      const headings = headingSelectors
        .map((selector) => section.querySelector(selector))
        .filter((el) => el !== null);

      if (headings.length === 0) return;

      // Устанавливаем начальное состояние
      gsap.set(headings, {
        opacity: 0,
        y: -40,
      });

      // Создаем timeline для каскадного появления
      const tl = gsap.timeline({
        paused: true, // Начинаем с паузы
      });

      // Каскадное появление с плавной анимацией (по очереди с задержками)
      headings.forEach((heading, index) => {
        const duration = gsap.utils.random(1.6, 2.2);
        const delay = index * 0.15; // Задержка между элементами (150ms)

        tl.to(
          heading,
          {
            opacity: 1,
            y: 0,
            duration: duration,
            ease: 'power3.out',
          },
          delay // Каждый следующий элемент начинается с задержкой
        );
      });

      // Для hero-section запускаем анимацию сразу при загрузке
      const isHero = section.classList.contains('hero-section');
      
      // Для hero запускаем сразу, для остальных - при скролле
      if (isHero) {
        // Небольшая задержка для hero, чтобы страница успела загрузиться
        setTimeout(() => {
          if (tl.progress() === 0) {
            tl.play();
          }
        }, 300);
      } else {
        // Для остальных секций используем ScrollTrigger
        ScrollTrigger.create({
          trigger: section,
          start: 'top 75%',
          end: 'bottom 25%',
          onEnter: () => {
            if (tl.progress() === 0) {
              tl.play();
            }
          },
          onEnterBack: () => {
            if (tl.progress() === 0) {
              tl.play();
            }
          },
          once: false, // Разрешаем повторный запуск при возврате
        });
      }
    });

    // Обрабатываем секцию-2 отдельно, так как она находится внутри hero-section
    const section2Content = document.querySelector('.section-2__content');
    if (section2Content) {
      const section2Headings = [
        '.section-2__subtitle',
        '.section-2__title',
        '.section-2__desc',
      ]
        .map((selector) => section2Content.querySelector(selector))
        .filter((el) => el !== null);

      if (section2Headings.length > 0) {
        // Устанавливаем начальное состояние
        gsap.set(section2Headings, {
          opacity: 0,
          y: -40,
        });

        // Создаем timeline для каскадного появления
        const tl2 = gsap.timeline({
          paused: true,
        });

        // Каскадное появление
        section2Headings.forEach((heading, index) => {
          const duration = gsap.utils.random(1.6, 2.2);
          const delay = index * 0.15;

          tl2.to(
            heading,
            {
              opacity: 1,
              y: 0,
              duration: duration,
              ease: 'power3.out',
            },
            delay
          );
        });

        // Используем ScrollTrigger для секции-2
        ScrollTrigger.create({
          trigger: section2Content,
          start: 'top 75%',
          end: 'bottom 25%',
          onEnter: () => {
            if (tl2.progress() === 0) {
              tl2.play();
            }
          },
          onEnterBack: () => {
            if (tl2.progress() === 0) {
              tl2.play();
            }
          },
          once: false,
        });
      }
    }
  }

  getHeadingSelectors(section) {
    const classList = Array.from(section.classList);
    
    // Проверяем hero-section
    if (section.classList.contains('hero-section')) {
      return [
        '.hero__title',
        '.hero__desc',
      ];
    }

    const sectionClass = classList.find((cls) => cls.startsWith('section-'));

    if (!sectionClass) return [];

    // Определяем селекторы в зависимости от секции
    const selectorsMap = {
      'section-2': [
        '.section-2__subtitle',
        '.section-2__title',
        '.section-2__desc',
      ],
      'section-3': [
        '.section-3__title',
        '.section-3__question',
        '.section-3__responses',
      ],
      'section-4': [
        '.section-4__title',
        '.section-4__question',
        '.section-4__desc',
      ],
      'section-5': [
        '.section-5__title',
        '.section-5__question',
        '.section-5__desc',
      ],
      'section-6': [
        '.section-6__subtitle',
        '.section-6__title',
      ],
    };

    return selectorsMap[sectionClass] || [];
  }
}

export default SectionHeadingsAnimation;

