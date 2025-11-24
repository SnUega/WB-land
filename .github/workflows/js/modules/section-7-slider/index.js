class Section7Slider {
  constructor() {
    this.slider = document.querySelector('.section-7__slider');
    this.track = document.querySelector('.section-7__slider-track');
    this.items = document.querySelectorAll('.section-7__slider-item');
    this.prevBtn = document.querySelector('.section-7__slider-btn--prev');
    this.nextBtn = document.querySelector('.section-7__slider-btn--next');
    if (!this.slider || !this.track || !this.items.length) {
      return;
    }
    this.currentIndex = 0;
    this.previousIndex = 0;
    this.isAnimating = false;
    this.cardWidth = 0;
    this.cardGap = 20;
    this.visibleCards = 2;
    if (window.innerWidth <= 768) {
      this.visibleCards = 1;
      this.cardGap = 20;
    }
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.currentTranslateX = 0;
    this.init();
  }
  init() {
    this.currentIndex = 0;
    if (this.track) {
      this.track.style.transition = 'none';
      this.track.style.transform = 'translateX(0px)';
      this.track.style.marginLeft = '';
      this.track.style.marginRight = '';
    }
    this.items.forEach((item) => {
      item.style.marginLeft = '';
      item.style.marginRight = '';
      item.style.transition = '';
    });
    setTimeout(() => {
      this.currentIndex = 0;
      this.calculateDimensions();
      this.setupEventListeners();
      this.updateSliderPosition();
      this.updateButtonsState();
      if (this.track) {
        this.track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
      }
    }, 100);
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const wasMobile = this.visibleCards === 1;
        this.calculateDimensions();
        
        const isMobile = window.innerWidth <= 768;
        if (wasMobile !== isMobile) {
          if (isMobile) {
            this.visibleCards = 1;
          const trackStyles = getComputedStyle(this.track);
          const gapValue = trackStyles.gap || '20px';
          this.cardGap = parseFloat(gapValue) || 20;
          this.setupSwipeListeners();
        } else {
          this.visibleCards = 2;
          this.cardGap = 20;
        }
      }
      
      this.updateSliderPosition();
      this.updateButtonsState();
      }, 150);
    }, { passive: true });
  }
  calculateDimensions() {
    if (this.items.length === 0) return;
    const firstCard = this.items[0];
    const cardRect = firstCard.getBoundingClientRect();
    this.cardWidth = cardRect.width || parseFloat(getComputedStyle(firstCard).width);
    
    if (window.innerWidth <= 768) {
      this.visibleCards = 1;
      if (!this.cardWidth || this.cardWidth === 0) {
        const viewportWidth = window.innerWidth;
        this.cardWidth = Math.max(300, Math.min(380, viewportWidth * 0.92));
      }
    } else {
      this.visibleCards = 2;
      if (!this.cardWidth || this.cardWidth === 0) {
        const viewportWidth = window.innerWidth;
        this.cardWidth = Math.max(280, Math.min(820, viewportWidth * 0.572));
      }
    }
  }
  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollToPrev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollToNext());
    }
    
    if (window.innerWidth <= 768 && this.slider) {
      this.setupSwipeListeners();
    }
  }
  
  setupSwipeListeners() {
    this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.slider.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    this.slider.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Mouse события для тестирования на десктопе (опционально)
    this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    this.slider.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.slider.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    this.slider.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
  }
  
  handleTouchStart(e) {
    if (this.isAnimating) return;
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.isDragging = true;
    this.dragStartX = touch.clientX;
    
    const transform = getComputedStyle(this.track).transform;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        this.currentTranslateX = parseFloat(matrix[1].split(',')[4]) || 0;
      }
    } else {
      this.currentTranslateX = 0;
    }
    
    this.track.style.transition = 'none';
  }
  
  handleTouchMove(e) {
    if (!this.isDragging || this.isAnimating) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - this.dragStartX;
    const deltaY = Math.abs(touch.clientY - this.touchStartY);
    
    if (deltaY > Math.abs(deltaX)) {
      this.isDragging = false;
      this.updateSliderPosition();
      return;
    }
    
    e.preventDefault();
    const newTranslateX = this.currentTranslateX + deltaX;
    this.track.style.transform = `translateX(${newTranslateX}px)`;
  }
  
  handleTouchEnd(e) {
    if (!this.isDragging) {
      return;
    }
    
    const touch = e.changedTouches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
    
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = Math.abs(this.touchEndY - this.touchStartY);
    const minSwipeDistance = 50;
    
    this.isDragging = false;
    
    this.track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    if (deltaY > Math.abs(deltaX) || Math.abs(deltaX) < 5) {
      this.updateSliderPosition();
      return;
    }
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        this.scrollToPrev();
      } else {
        this.scrollToNext();
      }
    } else {
      this.updateSliderPosition();
    }
  }
  
  handleMouseDown(e) {
    if (this.isAnimating) return;
    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
    this.isDragging = true;
    this.dragStartX = e.clientX;
    
    const transform = getComputedStyle(this.track).transform;
    if (transform && transform !== 'none') {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        this.currentTranslateX = parseFloat(matrix[1].split(',')[4]) || 0;
      }
    }
    
    this.track.style.transition = 'none';
  }
  
  handleMouseMove(e) {
    if (!this.isDragging || this.isAnimating) return;
    
    const deltaX = e.clientX - this.dragStartX;
    const deltaY = Math.abs(e.clientY - this.touchStartY);
    
    if (deltaY > Math.abs(deltaX)) {
      return;
    }
    
    const newTranslateX = this.currentTranslateX + deltaX;
    this.track.style.transform = `translateX(${newTranslateX}px)`;
  }
  
  handleMouseUp(e) {
    if (!this.isDragging) return;
    
    this.touchEndX = e.clientX;
    this.touchEndY = e.clientY;
    
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = Math.abs(this.touchEndY - this.touchStartY);
    const minSwipeDistance = 50;
    
    this.isDragging = false;
    this.track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
    
    if (deltaY > Math.abs(deltaX)) {
      this.updateSliderPosition();
      return;
    }
    
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        this.scrollToPrev();
      } else {
        this.scrollToNext();
      }
    } else {
      this.updateSliderPosition();
    }
  }
  scrollToPrev() {
    if (this.isAnimating) return;
    if (this.currentIndex <= 0) return;
    this.isAnimating = true;
    this.previousIndex = this.currentIndex;
    this.currentIndex--;
    
    // Synchronize animations
    this.updateSliderPosition();
    this.updateButtonsState();
    
    // Small delay to ensure position update starts, then animate new cards
    setTimeout(() => {
      this.animateVisibleCards();
    }, 50);
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 1200);
  }
  scrollToNext() {
    if (this.isAnimating) return;
    if (this.currentIndex >= this.items.length - this.visibleCards) return;
    this.isAnimating = true;
    this.previousIndex = this.currentIndex;
    this.currentIndex++;
    
    this.updateSliderPosition();
    this.updateButtonsState();
    
    setTimeout(() => {
      this.animateVisibleCards();
    }, 50);
    
    setTimeout(() => {
      this.isAnimating = false;
    }, 1200);
  }
  updateSliderPosition() {
    if (!this.track || !this.slider) return;
    
    if (window.innerWidth <= 768 && this.visibleCards === 1) {
      if (this.isDragging) {
        return;
      }
      
      if (this.items.length > 0) {
        const firstCard = this.items[0];
        const cardRect = firstCard.getBoundingClientRect();
        this.cardWidth = cardRect.width || parseFloat(getComputedStyle(firstCard).width);
        if (!this.cardWidth || this.cardWidth === 0) {
          const viewportWidth = window.innerWidth;
          this.cardWidth = Math.max(300, Math.min(380, viewportWidth * 0.92));
        }
      }
      
      const sliderWidth = this.slider.clientWidth;
      
      const trackStyles = getComputedStyle(this.track);
      const gapValue = trackStyles.gap || '20px';
      const gap = parseFloat(gapValue) || 20;
      this.cardGap = gap;
      
      const centerOffset = (sliderWidth - this.cardWidth) / 2;
      
      const currentCardPosition = this.currentIndex * (this.cardWidth + gap);
      
      const targetOffset = centerOffset - currentCardPosition;
      
      this.items.forEach((item) => {
        item.style.marginLeft = '0px';
        item.style.marginRight = '0px';
      });
      
      this.track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
      this.track.style.transform = `translateX(${targetOffset}px)`;
    } else {
      const sliderRect = this.slider.getBoundingClientRect();
      const sliderWidth = sliderRect.width;
      const viewportWidth = window.innerWidth;
      const cardWithGap = this.cardWidth + this.cardGap;
      const totalVisibleWidth = this.visibleCards * this.cardWidth + (this.visibleCards - 1) * this.cardGap;
      const centerOffset = (sliderWidth - totalVisibleWidth) / 2;
      
      let extraOffset = 0;
      this.items.forEach((item, index) => {
        const isBeforeVisible = index < this.currentIndex;
        const isAfterVisible = index >= this.currentIndex + this.visibleCards;
        const isLastBeforeVisible = index === this.currentIndex - 1;
        const isFirstAfterVisible = index === this.currentIndex + this.visibleCards;
        
        item.style.transition = 'margin 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
        
        if (isLastBeforeVisible) {
          const extraGap = viewportWidth;
          item.style.marginRight = `${extraGap}px`;
          item.style.marginLeft = '0px';
          extraOffset += extraGap;
        } else if (isFirstAfterVisible) {
          item.style.marginLeft = `${viewportWidth}px`;
          item.style.marginRight = '0px';
        } else if (isBeforeVisible || isAfterVisible) {
          item.style.marginLeft = '0px';
          item.style.marginRight = '0px';
        } else {
          item.style.marginLeft = '0px';
          item.style.marginRight = '0px';
        }
      });
      
      const baseOffset = centerOffset - (this.currentIndex * cardWithGap);
      const targetOffset = baseOffset - extraOffset;
      
      this.track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
      this.track.style.transform = `translateX(${targetOffset}px)`;
    }
  }
  updateButtonsState() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex <= 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= this.items.length - this.visibleCards;
    }
  }
  animateVisibleCards() {
    if (typeof gsap === 'undefined') return;
    
    const visibleItems = [];
    for (let i = this.currentIndex; i < this.currentIndex + this.visibleCards && i < this.items.length; i++) {
      visibleItems.push(this.items[i]);
    }
    
    const previousVisibleIndices = [];
    for (let i = this.previousIndex; i < this.previousIndex + this.visibleCards && i < this.items.length; i++) {
      previousVisibleIndices.push(i);
    }
    
    visibleItems.forEach((item, relativeIndex) => {
      const absoluteIndex = this.currentIndex + relativeIndex;
      const isNewCard = !previousVisibleIndices.includes(absoluteIndex);
      
      if (!isNewCard) {
        return;
      }
      
      const delay = relativeIndex * 0.1;
      
      setTimeout(() => {
        this.animateProductCards(item);
      }, delay * 1000);
      
      setTimeout(() => {
        this.animateCardTitle(item);
      }, (delay + 0.3) * 1000);
      
      setTimeout(() => {
        this.animateCardResults(item);
      }, (delay + 0.4) * 1000);
    });
  }
  
  animateCardTitle(item) {
    if (typeof gsap === 'undefined') return;
    const title = item.querySelector('.section-7__card-title');
    if (!title) return;
    
    gsap.killTweensOf(title);
    
    if (typeof ScrollTrigger !== 'undefined') {
      const triggers = ScrollTrigger.getAll().filter(trigger => {
        return trigger.vars && trigger.vars.trigger === title;
      });
      triggers.forEach(trigger => trigger.disable());
    }
    
    gsap.set(title, {
      clearProps: 'all'
    });
    
    title.style.clipPath = 'none';
    title.style.transform = '';
    
    gsap.set(title, {
      opacity: 1,
      scale: 0.85,
      x: 0,
      y: 0,
      transformOrigin: 'center center'
    });
    
    gsap.to(title, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(title, { scale: 1 });
      }
    });
  }
  
  animateCardResults(item) {
    if (typeof gsap === 'undefined') return;
    const resultsContainer = item.querySelector('.section-7__card-results');
    if (!resultsContainer) return;
    
    const resultItems = Array.from(resultsContainer.children);
    if (resultItems.length === 0) return;
    
    resultItems.forEach((resultItem, index) => {
      gsap.killTweensOf(resultItem);
      gsap.set(resultItem, {
        opacity: 0,
        y: -30
      });
      gsap.to(resultItem, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.4 + (index * 0.15)
      });
    });
  }
  
  /**
   * Animate product cards with bubble effect
   */
  animateProductCards(item) {
    if (typeof gsap === 'undefined') return;
    const productCard = item.querySelector('.section-7__card-product .wb-card--section-5');
    if (!productCard) return;
    
    gsap.killTweensOf(productCard);
    gsap.set(productCard, {
      opacity: 0,
      scale: 0.2
    });
    gsap.to(productCard, {
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: 'back.out(1.4)',
      delay: 0.3
    });
  }
}
export default Section7Slider;

