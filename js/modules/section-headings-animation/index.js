class SectionHeadingsAnimation {
  constructor() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    this.init();
  }
  init() {
    const sections = document.querySelectorAll('section[class^="section-"], section.hero-section');
    sections.forEach((section) => {
      const headingSelectors = this.getHeadingSelectors(section);
      if (headingSelectors.length === 0) return;
      const headings = headingSelectors
        .map((selector) => section.querySelector(selector))
        .filter((el) => el !== null && !el.dataset.animationDisabled);
      if (headings.length === 0) return;
      gsap.set(headings, {
        opacity: 0,
        y: -40,
      });
      const tl = gsap.timeline({
        paused: true, // Начинаем с паузы
      });
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
      const isHero = section.classList.contains('hero-section');
      if (isHero) {
        setTimeout(() => {
          if (tl.progress() === 0) {
            tl.play();
          }
        }, 300);
      } else {
        const isMobile = window.innerWidth <= 768;
        ScrollTrigger.create({
          trigger: section,
          start: isMobile ? 'top 100%' : 'top 75%',
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
        gsap.set(section2Headings, {
          opacity: 0,
          y: -40,
        });
        const tl2 = gsap.timeline({
          paused: true,
        });
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
        const isMobile = window.innerWidth <= 768;
        ScrollTrigger.create({
          trigger: section2Content,
          start: isMobile ? 'top 85%' : 'top 75%',
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
    if (section.classList.contains('hero-section')) {
      return [
        '.hero__title',
        '.hero__desc',
      ];
    }
    const sectionClass = classList.find((cls) => cls.startsWith('section-'));
    if (!sectionClass) return [];
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
