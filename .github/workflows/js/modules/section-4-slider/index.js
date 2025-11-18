// Section 4 Slider
class Section4Slider {
  constructor() {
    this.slider = document.querySelector('.section-4__slider');
    this.track = document.querySelector('.section-4__slider-track');
    this.items = document.querySelectorAll('.section-4__slider-item');
    this.prevBtn = document.querySelector('.section-4__slider-btn--prev');
    this.nextBtn = document.querySelector('.section-4__slider-btn--next');
    
    if (!this.slider || !this.track || !this.items.length) {
      return;
    }

    this.currentIndex = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;
    
    // Для плавной прокрутки
    this.currentOffset = 0; // Текущее смещение в пикселях
    this.targetOffset = 0; // Целевое смещение
    this.scrollSpeed = 0.5; // Скорость прокрутки (коэффициент для deltaY)
    this.animationFrameId = null; // ID для requestAnimationFrame
    
    // Настройки
    this.cardWidth = 0;
    this.cardGap = 20; // gap между карточками
    this.visibleCards = 3; // изначально видно 3 карточки
    
    // Для анимации появления
    this.animated = false;
    
    // Для свайпа
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;
    
    this.init();
  }

  init() {
    // Ждем немного для применения стилей
    setTimeout(() => {
      this.calculateDimensions();
      this.setupSliderPositioning();
      this.setupEventListeners();
      this.initCardAnimations();
      this.updateSliderPosition();
    }, 100);
    
    // Обновляем размеры при изменении размера окна
    window.addEventListener('resize', () => {
      this.calculateDimensions();
      this.setupSliderPositioning();
      this.updateSliderPosition();
    });
    
    // Обновляем позицию при скролле (на случай, если секция двигается)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.setupSliderPositioning();
      }, 10);
    }, { passive: true });
  }

  setupSliderPositioning() {
    if (!this.slider) return;
    
    // Получаем текущую позицию слайдера относительно viewport
    const sliderRect = this.slider.getBoundingClientRect();
    // Вычисляем смещение для выравнивания слайдера по границам viewport
    // left должен быть на 0 viewport, поэтому смещаем на -sliderRect.left
    const leftOffset = -sliderRect.left;
    
    // Получаем родителя (section-4__content или section-4__main)
    const parent = this.slider.parentElement;
    if (!parent) return;
    
    const parentRect = parent.getBoundingClientRect();
    // Вычисляем смещение от родителя до viewport
    const parentLeftOffset = -parentRect.left;
    
    // Устанавливаем позицию и ширину
    this.slider.style.position = 'absolute';
    // Смещаем от текущей позиции родителя на leftOffset
    this.slider.style.left = `${parentLeftOffset}px`;
    this.slider.style.right = 'auto';
    this.slider.style.width = '100vw';
    this.slider.style.transform = 'none';
    this.slider.style.marginLeft = '0';
    this.slider.style.marginRight = '0';
  }

  calculateDimensions() {
    if (this.items.length === 0) return;
    
    // Получаем ширину первой карточки из computed style или getBoundingClientRect
    const firstCard = this.items[0];
    const cardRect = firstCard.getBoundingClientRect();
    this.cardWidth = cardRect.width || parseFloat(getComputedStyle(firstCard).width);
    
    // Если ширина еще не определена, используем clamp значение как fallback
    if (!this.cardWidth || this.cardWidth === 0) {
      const viewportWidth = window.innerWidth;
      // Примерное значение из CSS: clamp(280px, 30vw, 400px)
      this.cardWidth = Math.max(280, Math.min(400, viewportWidth * 0.3));
    }
    
    // Вычисляем общую ширину трека
    const totalWidth = this.items.length * (this.cardWidth + this.cardGap) - this.cardGap;
    this.track.style.width = `${totalWidth}px`;
  }

  setupEventListeners() {
    // Кнопки навигации
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollToPrev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollToNext());
    }

    // Колесико мыши - только на карточках
    this.items.forEach(item => {
      item.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.handleWheel(e);
      }, { passive: false });
    });

    // Свайп для тач-устройств
    this.slider.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.slider.addEventListener('touchmove', (e) => {
      // Предотвращаем стандартную прокрутку при свайпе
      if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
        e.preventDefault();
      }
    }, { passive: false });

    this.slider.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleWheel(e) {
    e.preventDefault();
    
    // Инициализируем targetOffset если еще не инициализирован
    if (this.targetOffset === undefined || this.currentOffset === undefined) {
      this.calculateDimensions();
      const baseMaxIndex = this.items.length - this.visibleCards;
      const fullStep = this.cardWidth + this.cardGap;
      const partialStep = fullStep * 0.2;
      this.targetOffset = this.currentIndex * fullStep;
      if (this.currentIndex > baseMaxIndex) {
        this.targetOffset = baseMaxIndex * fullStep + partialStep;
      }
      this.currentOffset = this.targetOffset;
    }
    
    // Плавная прокрутка на основе deltaY
    const delta = e.deltaY * this.scrollSpeed;
    const maxOffset = this.getMaxOffset();
    
    // Обновляем целевое смещение (изменяем знак для правильного направления)
    this.targetOffset = Math.max(0, Math.min(maxOffset, this.targetOffset + delta));
    
    // Плавно обновляем позицию
    this.updateSliderPositionSmooth();
  }

  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;
    
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        // Свайп влево - следующий слайд
        this.scrollToNext();
      } else {
        // Свайп вправо - предыдущий слайд
        this.scrollToPrev();
      }
    }
  }

  scrollToNext() {
    // Убираем 3-й шаг, делаем только 2 шага с увеличенным путем
    const maxIndex = this.items.length - this.visibleCards; // Теперь maxIndex = 2, но последний шаг будет увеличен
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateSliderPosition();
    }
  }

  scrollToPrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSliderPosition();
    }
  }

  getMaxOffset() {
    if (!this.cardWidth) {
      this.calculateDimensions();
    }
    const baseMaxIndex = this.items.length - this.visibleCards;
    const fullStep = this.cardWidth + this.cardGap;
    const partialStep = fullStep * 0.2;
    return baseMaxIndex * fullStep + partialStep;
  }

  updateSliderPosition() {
    if (!this.track) return;
    
    // Убеждаемся, что размеры рассчитаны
    if (!this.cardWidth) {
      this.calculateDimensions();
    }
    
    // Вычисляем смещение для текущей позиции
    const baseMaxIndex = this.items.length - this.visibleCards; // = 2
    const fullStep = this.cardWidth + this.cardGap;
    const partialStep = fullStep * 0.2;
    // Текущий конец пути: baseMaxIndex * fullStep + partialStep = 2.2 * fullStep
    // Убираем 3-й шаг, распределяем путь на 2 шага
    // Шаг 1: немного увеличен (1.1 * fullStep)
    // Шаг 2: до конца (2.2 * fullStep)
    let offset;
    
    if (this.currentIndex === 0) {
      // Начальная позиция
      offset = 0;
    } else if (this.currentIndex === 1) {
      // Первый шаг: немного увеличен
      offset = fullStep * 1.1;
    } else if (this.currentIndex === baseMaxIndex) {
      // Второй шаг (последний): доходим до конца
      offset = baseMaxIndex * fullStep + partialStep; // 2.2 * fullStep
    } else {
      // Обычное смещение для промежуточных шагов (на случай если их больше)
      offset = this.currentIndex * fullStep;
    }
    
    this.targetOffset = offset;
    this.currentOffset = offset;
    
    // Применяем плавное смещение через transform
    this.track.style.transform = `translateX(-${offset}px)`;
    this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Обновляем состояние кнопок
    this.updateButtonsState();
  }

  updateSliderPositionSmooth() {
    if (!this.track) return;
    
    // Отменяем предыдущий кадр анимации, если есть
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    const animate = () => {
      // Плавная интерполяция к целевому смещению
      const diff = this.targetOffset - this.currentOffset;
      
      if (Math.abs(diff) > 0.1) {
        this.currentOffset += diff * 0.15; // Коэффициент плавности
        
        // Применяем смещение
        this.track.style.transform = `translateX(-${this.currentOffset}px)`;
        this.track.style.transition = 'transform 0.1s ease-out';
        
        // Обновляем currentIndex для кнопок
        const fullStep = this.cardWidth + this.cardGap;
        this.currentIndex = Math.round(this.currentOffset / fullStep);
        
        // Обновляем состояние кнопок
        this.updateButtonsState();
        
        // Продолжаем анимацию
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        // Достигли цели, останавливаем анимацию
        this.currentOffset = this.targetOffset;
        this.track.style.transform = `translateX(-${this.currentOffset}px)`;
        this.animationFrameId = null;
      }
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  initCardAnimations() {
    // Инициализируем карточки как скрытые
    // Используем scale(0.94) вместо scale(0.3), чтобы максимальное увеличение было ~8-9px с каждой стороны
    // (при ширине карточки ~300-400px, scale 0.94 даст увеличение примерно на 6-8% = 18-32px, но мы хотим 8-9px)
    // Для карточки шириной ~350px: увеличение на 8px = 16px общее = 16/350 ≈ 0.045, значит scale ≈ 0.955
    // Используем scale(0.955) для более точного контроля
    this.items.forEach((item, index) => {
      const card = item.querySelector('.slider-card');
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92)'; // Увеличиваем "дыхание" для более заметного эффекта
        card.style.transition = 'none';
      }
    });

    // Используем Intersection Observer для анимации при попадании в зону просмотра
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = entry.target.closest('.section-4__slider-item');
          if (item && !item.dataset.animated) {
            item.dataset.animated = 'true';
            this.animateCard(item);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '100px 0px' // Начинаем анимацию немного раньше
    });

    // Наблюдаем за каждой карточкой отдельно
    this.items.forEach(item => {
      const card = item.querySelector('.slider-card');
      if (card) {
        observer.observe(card);
      }
    });
  }

  animateCard(item) {
    const card = item.querySelector('.slider-card');
    if (!card) return;

    // Получаем индекс карточки для каскадной анимации (слева направо)
    const index = Array.from(this.items).indexOf(item);
    const delay = index * 0.1; // Задержка для каскадного эффекта (0.1s между карточками)

    // Применяем анимацию как у модального окна
    setTimeout(() => {
      card.style.transition = 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.8s';
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, delay * 1000);
  }

  updateButtonsState() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
      this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
      this.prevBtn.style.cursor = this.currentIndex === 0 ? 'not-allowed' : 'pointer';
    }
    
    if (this.nextBtn) {
      // Теперь maxIndex = baseMaxIndex (без +1), так как убрали 3-й шаг
      const maxIndex = this.items.length - this.visibleCards;
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
      this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
      this.nextBtn.style.cursor = this.currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
  }
}

export default Section4Slider;

