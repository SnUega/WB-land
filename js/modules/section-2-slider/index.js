class Section2Slider {
  constructor() {
    if (window.innerWidth > 768) {
      return;
    }

    this.slider = document.querySelector('.section-2__slider');
    this.track = document.querySelector('.section-2__slider-track');
    this.cards = document.querySelectorAll('.section-2__slider-track .stat-card');
    this.pagination = document.querySelector('.section-2__pagination');
    this.cardsContainer = document.querySelector('.section-2__cards');
    
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

    this.init();
  }

  init() {
    setTimeout(() => {
      this.calculateDimensions();
      this.createPagination();
      this.setupEventListeners();
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
    if (this.cards.length === 0) return;
    const sliderRect = this.slider.getBoundingClientRect();
    this.cardWidth = sliderRect.width;
    
    this.cards.forEach(card => {
      card.style.width = `${this.cardWidth}px`;
      card.style.flexShrink = '0';
    });
  }

  createPagination() {
    this.pagination.innerHTML = '';
    this.paginationDots = [];
    
    for (let i = 0; i < this.cards.length; i++) {
      const dot = document.createElement('button');
      dot.className = 'section-2__pagination-dot';
      if (i === 0) {
        dot.classList.add('section-2__pagination-dot--active');
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
    
    if (swipeDistanceY > this.maxVerticalSwipe) {
      return;
    }
    
    if (Math.abs(swipeDistanceX) > this.minSwipeDistance) {
      if (swipeDistanceX > 0) {
        this.goToNext();
      } else {
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
    
    const sliderWidth = this.slider.getBoundingClientRect().width;
    this.cardWidth = sliderWidth;
    
    const cardWithGap = this.cardWidth + 20;
    const targetOffset = -(this.currentIndex * cardWithGap);
    
    this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.track.style.transform = `translateX(${targetOffset}px)`;
  }

  updatePagination() {
    this.paginationDots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('section-2__pagination-dot--active');
      } else {
        dot.classList.remove('section-2__pagination-dot--active');
      }
    });
  }
}

export default Section2Slider;

