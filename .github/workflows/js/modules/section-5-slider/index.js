class Section5Slider {
  constructor() {
    if (window.innerWidth > 768) {
      return;
    }

    this.slider = document.querySelector('.section-5__slider');
    this.track = document.querySelector('.section-5__slider-track');
    this.cards = document.querySelectorAll('.section-5__slider-track .advantage-card');
    this.pagination = document.querySelector('.section-5__pagination');
    this.cardsContainer = document.querySelector('.section-5__cards');
    
    if (!this.slider || !this.track || !this.cards.length || !this.pagination) {
      return;
    }

    this.currentIndex = 0;
    this.isAnimating = false;
    this.cardWidth = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.maxVerticalSwipe = 30; // Максимальное вертикальное движение для определения горизонтального свайпа
    this.paginationDots = [];
    this.section = document.querySelector('.section-5');

    this.init();
  }

  init() {
    setTimeout(() => {
      this.calculateDimensions();
      this.createPagination();
      this.setupEventListeners();
      this.setupSectionScrollPrevention();
      this.updateSliderPosition();
      this.updatePagination();
    }, 100);

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        return;
      }
      this.calculateDimensions();
      this.updateSliderPosition();
    });
  }

  calculateDimensions() {
    if (this.cards.length === 0 || !this.slider) return;
    const sliderRect = this.slider.getBoundingClientRect();
    this.cardWidth = sliderRect.width;
  }

  createPagination() {
    this.pagination.innerHTML = '';
    this.paginationDots = [];
    
    for (let i = 0; i < this.cards.length; i++) {
      const dot = document.createElement('button');
      dot.className = 'section-5__pagination-dot';
      if (i === 0) {
        dot.classList.add('section-5__pagination-dot--active');
      }
      dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.pagination.appendChild(dot);
      this.paginationDots.push(dot);
    }
  }

  setupEventListeners() {
    let isHorizontalSwipe = false;
    let touchStarted = false;
    let initialTouch = null;
    let swipeDirection = null;
    
    const handleElement = this.cardsContainer || this.slider;
    
    handleElement.addEventListener('touchstart', (e) => {
      initialTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      isHorizontalSwipe = false;
      swipeDirection = null;
      touchStarted = true;
    }, { passive: true });

    handleElement.addEventListener('touchmove', (e) => {
      if (!touchStarted || !initialTouch) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      // Определяем направление свайпа раньше
      const deltaX = Math.abs(currentX - initialTouch.x);
      const deltaY = Math.abs(currentY - initialTouch.y);
      
      // Определяем направление при первом движении
      if (!swipeDirection && (deltaX > 5 || deltaY > 5)) {
        swipeDirection = deltaX > deltaY ? 'horizontal' : 'vertical';
      }
      
      if (swipeDirection === 'horizontal' && deltaX > 10) {
        isHorizontalSwipe = true;
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, { passive: false });

    handleElement.addEventListener('touchend', (e) => {
      if (!touchStarted || !initialTouch) return;
      touchStarted = false;
      
      this.touchEndX = e.changedTouches[0].clientX;
      this.touchEndY = e.changedTouches[0].clientY;
      
      if (isHorizontalSwipe) {
        this.handleSwipe();
      }
      
      isHorizontalSwipe = false;
      swipeDirection = null;
      initialTouch = null;
    }, { passive: true });

    handleElement.addEventListener('touchcancel', () => {
      touchStarted = false;
      isHorizontalSwipe = false;
      swipeDirection = null;
      initialTouch = null;
    }, { passive: true });
  }

  handleSwipe() {
    if (this.isAnimating) return;
    
    const swipeDistanceX = this.touchStartX - this.touchEndX;
    const swipeDistanceY = Math.abs(this.touchStartY - this.touchEndY);
    
    // Проверяем что это горизонтальный свайп
    if (swipeDistanceY > this.maxVerticalSwipe) {
      return; // Вертикальный свайп - игнорируем
    }
    
    if (Math.abs(swipeDistanceX) > this.minSwipeDistance) {
      if (swipeDistanceX > 0) {
        // Свайп влево - следующий слайд
        this.goToNext();
      } else {
        // Свайп вправо - предыдущий слайд
        this.goToPrev();
      }
    }
  }

  goToSlide(index) {
    if (this.isAnimating) return;
    if (index < 0 || index >= this.cards.length) return;
    if (index === this.currentIndex) return;

    this.isAnimating = true;
    this.currentIndex = index;
    
    this.updateSliderPosition();
    this.updatePagination();
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }

  goToNext() {
    if (this.currentIndex >= this.cards.length - 1) return;
    this.goToSlide(this.currentIndex + 1);
  }

  goToPrev() {
    if (this.currentIndex <= 0) return;
    this.goToSlide(this.currentIndex - 1);
  }

  updateSliderPosition() {
    if (!this.track || !this.slider) return;
    
    // Пересчитываем ширину на случай изменения размера (с учетом padding слайдера)
    const sliderRect = this.slider.getBoundingClientRect();
    const sliderWidth = sliderRect.width;
    this.cardWidth = sliderWidth;
    
    // Получаем реальную ширину первой карточки (с учетом CSS flex: 0 0 100%)
    // Это гарантирует, что мы используем правильную ширину для расчета
    if (this.cards.length > 0) {
      const firstCardRect = this.cards[0].getBoundingClientRect();
      this.cardWidth = firstCardRect.width;
    }
    
    // Шаг перелистывания: ширина карточки + gap между карточками
    // Gap добавляется между flex-элементами, поэтому нужно учитывать его в расчете
    const gap = 20; // gap между карточками из CSS
    const cardWithGap = this.cardWidth + gap;
    
    // Рассчитываем offset так, чтобы карточка была полностью видна
    // Для первой карточки (index 0): offset = 0
    // Для каждой следующей: сдвигаем track влево на (index * cardWithGap)
    const targetOffset = -(this.currentIndex * cardWithGap);
    
    // Плавная анимация
    this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.track.style.transform = `translateX(${targetOffset}px)`;
  }

  updatePagination() {
    this.paginationDots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('section-5__pagination-dot--active');
      } else {
        dot.classList.remove('section-5__pagination-dot--active');
      }
    });
  }

  setupSectionScrollPrevention() {
    // Предотвращаем горизонтальный скролл при свайпе вне слайдера
    // Используем CSS touch-action для предотвращения горизонтальной прокрутки
    // JS обработчик нужен только для логики, не для preventDefault
    if (!this.section) return;

    // Добавляем обработчик на уровне document для раннего перехвата
    // но не используем preventDefault, полагаемся на CSS touch-action
    let touchStartX = 0;
    let touchStartY = 0;
    let isTracking = false;

    document.addEventListener('touchstart', (e) => {
      // Проверяем, что касание в секции, но не на слайдере
      if (!this.section.contains(e.target)) {
        return;
      }

      if (this.slider && this.slider.contains(e.target)) {
        return; // Слайдер обрабатывает свои события
      }

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTracking = true;
    }, { passive: true, capture: true });

    document.addEventListener('touchmove', (e) => {
      if (!isTracking) return;

      // Проверяем, что касание все еще в секции, но не на слайдере
      if (!this.section.contains(e.target)) {
        isTracking = false;
        return;
      }

      if (this.slider && this.slider.contains(e.target)) {
        isTracking = false;
        return; // Слайдер обрабатывает свои события
      }

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - touchStartX);
      const deltaY = Math.abs(currentY - touchStartY);

      // Если это явно горизонтальный свайп - CSS touch-action должен предотвратить прокрутку
      // Не используем preventDefault, чтобы избежать ошибок
      if (deltaX > deltaY && deltaX > 10) {
        // CSS touch-action: pan-y должен предотвратить горизонтальную прокрутку
        // Просто отслеживаем для информации
      }
    }, { passive: true, capture: true });

    document.addEventListener('touchend', () => {
      isTracking = false;
    }, { passive: true, capture: true });

    document.addEventListener('touchcancel', () => {
      isTracking = false;
    }, { passive: true, capture: true });
  }
}

export default Section5Slider;

