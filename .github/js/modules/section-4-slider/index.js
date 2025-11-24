class Section4Slider {
  constructor(lenisInstance) {
    this.slider = document.querySelector('.section-4__slider');
    this.track = document.querySelector('.section-4__slider-track');
    this.items = document.querySelectorAll('.section-4__slider-item');
    this.prevBtn = document.querySelector('.section-4__slider-btn--prev');
    this.nextBtn = document.querySelector('.section-4__slider-btn--next');
    if (!this.slider || !this.track || !this.items.length) {
      return;
    }
    this.lenis = lenisInstance || window.lenis;
    this.currentIndex = 0;
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.currentOffset = 0;
    this.targetOffset = 0;
    this.animationFrameId = null;
    this.lerpSpeed = 0.08;
    this.cardWidth = 0;
    this.cardGap = 20;
    this.visibleCards = 3;
    this.animated = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 50;
    this.maxVerticalSwipe = 30;
    this.init();
  }
  init() {
    setTimeout(() => {
      this.calculateDimensions();
      this.setupSliderPositioning();
      this.setupEventListeners();
      this.updateSliderPosition();
    }, 100);
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.calculateDimensions();
        this.setupSliderPositioning();
        this.updateSliderPosition();
      }, 150);
    }, { passive: true });
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
    const sliderRect = this.slider.getBoundingClientRect();
    const leftOffset = -sliderRect.left;
    const parent = this.slider.parentElement;
    if (!parent) return;
    const parentRect = parent.getBoundingClientRect();
    const parentLeftOffset = -parentRect.left;
    this.slider.style.position = 'absolute';
    this.slider.style.left = `${parentLeftOffset}px`;
    this.slider.style.right = 'auto';
    this.slider.style.width = '100vw';
    this.slider.style.transform = 'none';
    this.slider.style.marginLeft = '0';
    this.slider.style.marginRight = '0';
  }
  getBreakpoint() {
    const width = window.innerWidth;
    const isLandscape = window.innerHeight < window.innerWidth;
    
    if (width <= 768) return 'mobile';
    
    if (!isLandscape) return 'desktop';
    
    if (width <= 1024) return 'mini';
    if (width >= 1025 && width <= 1180) return 'air';
    if (width >= 1181 && width <= 1366) return 'pro';
    if (width >= 1440 && width <= 1600) return 'macbook';
    
    return 'desktop';
  }
  getEffectiveVisibleCards() {
    const breakpoint = this.getBreakpoint();
    if (breakpoint === 'mobile') return 1;
    return (breakpoint === 'air' || breakpoint === 'mini') ? 2 : 3;
  }
  calculateDimensions() {
    if (this.items.length === 0) return;
    const firstCard = this.items[0];
    const cardRect = firstCard.getBoundingClientRect();
    this.cardWidth = cardRect.width || parseFloat(getComputedStyle(firstCard).width);
    if (!this.cardWidth || this.cardWidth === 0) {
      const viewportWidth = window.innerWidth;
      const breakpoint = this.getBreakpoint();
      if (breakpoint === 'mobile') {
        this.cardWidth = viewportWidth - 70;
      } else {
        this.cardWidth = Math.max(280, Math.min(400, viewportWidth * 0.3));
      }
    }
    const totalWidth = this.items.length * (this.cardWidth + this.cardGap) - this.cardGap;
    this.track.style.width = `${totalWidth}px`;
  }
  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollToPrev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollToNext());
    }
    
    const breakpoint = this.getBreakpoint();
    if (breakpoint === 'mobile') {
      let isHorizontalSwipe = false;
      let touchStarted = false;
      let initialTouch = null;
      let swipeDirection = null;
      
      const handleElement = this.track || this.slider;
      
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
        
        const deltaX = Math.abs(currentX - initialTouch.x);
        const deltaY = Math.abs(currentY - initialTouch.y);
        
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
    } else {
      this.slider.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
      }, { passive: true });
      this.slider.addEventListener('touchmove', (e) => {
        if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
          e.preventDefault();
        }
      }, { passive: false });
      this.slider.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].clientX;
        this.handleSwipe();
      }, { passive: true });
    }
  }
  handleSwipe() {
    const swipeDistanceX = this.touchStartX - this.touchEndX;
    const swipeDistanceY = Math.abs(this.touchStartY - this.touchEndY);
    
    if (swipeDistanceY > this.maxVerticalSwipe) {
      return;
    }
    
    if (Math.abs(swipeDistanceX) > this.minSwipeDistance) {
      if (swipeDistanceX > 0) {
        this.scrollToNext();
      } else {
        this.scrollToPrev();
      }
    }
  }
  scrollToNext() {
    const effectiveVisibleCards = this.getEffectiveVisibleCards();
    const maxIndex = this.items.length - effectiveVisibleCards;
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
    const effectiveVisibleCards = this.getEffectiveVisibleCards();
    const baseMaxIndex = this.items.length - effectiveVisibleCards;
    const fullStep = this.cardWidth + this.cardGap;
    const breakpoint = this.getBreakpoint();
    
    let partialStep = fullStep * 0.2;
    if (breakpoint === 'mobile') {
      partialStep = fullStep * 0.001;
    } else if (breakpoint === 'mini') {
      partialStep = fullStep * 0.33;
    } else if (breakpoint === 'pro') {
      partialStep = fullStep * 0.85;
    } else if (breakpoint === 'macbook') {
      partialStep = fullStep * 0.75;
    }
    
    return baseMaxIndex * fullStep + partialStep;
  }
  updateSliderPosition() {
    if (!this.track) return;
    if (!this.cardWidth) {
      this.calculateDimensions();
    }
    const effectiveVisibleCards = this.getEffectiveVisibleCards();
    const baseMaxIndex = this.items.length - effectiveVisibleCards;
    const fullStep = this.cardWidth + this.cardGap;
    const breakpoint = this.getBreakpoint();
    
    let partialStep = fullStep * 0.2;
    if (breakpoint === 'mobile') {
      partialStep = fullStep * 0.001;
    } else if (breakpoint === 'mini') {
      partialStep = fullStep * 0.33;
    } else if (breakpoint === 'pro') {
      partialStep = fullStep * 0.85;
    } else if (breakpoint === 'macbook') {
      partialStep = fullStep * 0.75;
    }
    
    let stepBonus = 0;
    if (breakpoint === 'mobile') {
      stepBonus = 5;
    } else if (breakpoint === 'mini') {
      stepBonus = 22;
    } else if (breakpoint === 'pro') {
      stepBonus = 9;
    } else if (breakpoint === 'macbook') {
      stepBonus = 12.5;
    }
    
    let offset;
    if (this.currentIndex === 0) {
      offset = 0;
    } else if (this.currentIndex === 1) {
      if (breakpoint === 'mobile') {
        offset = fullStep + stepBonus;
      } else {
        offset = fullStep * 1.1 + (stepBonus * this.currentIndex);
      }
    } else if (this.currentIndex === baseMaxIndex) {
      if (breakpoint === 'mobile') {
        const firstStepOffset = fullStep + stepBonus;
        const baseOffset = firstStepOffset + (baseMaxIndex - 0.9) * (fullStep + stepBonus) + partialStep;
        offset = baseOffset - (this.cardWidth * 0.3);
      } else {
        offset = baseMaxIndex * fullStep + partialStep + (stepBonus * this.currentIndex);
      }
    } else {
      if (breakpoint === 'mobile') {
        const firstStepOffset = fullStep + stepBonus;
        if (this.currentIndex === 2) {
          offset = firstStepOffset + (fullStep + stepBonus) * 0.9;
        } else if (this.currentIndex === 3) {
          offset = firstStepOffset + (fullStep + stepBonus) * 0.9 + (fullStep + stepBonus) * 0.9;
        } else {
          offset = firstStepOffset + (this.currentIndex - 1) * (fullStep + stepBonus);
        }
      } else {
        offset = this.currentIndex * fullStep + (stepBonus * this.currentIndex);
      }
    }
    this.targetOffset = offset;
    this.currentOffset = offset;
    this.track.style.transform = `translateX(-${offset}px)`;
    this.track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    this.updateButtonsState();
  }
  updateSliderPositionSmooth() {
    if (!this.track) return;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    const animate = () => {
      const diff = this.targetOffset - this.currentOffset;
      if (Math.abs(diff) > 0.05) {
        const distance = Math.abs(diff);
        const dynamicLerp = Math.min(this.lerpSpeed, distance * 0.001 + this.lerpSpeed * 0.5);
        this.currentOffset += diff * dynamicLerp;
        this.track.style.transform = `translateX(-${this.currentOffset}px)`;
        this.track.style.transition = 'none';
        const fullStep = this.cardWidth + this.cardGap;
        this.currentIndex = Math.round(this.currentOffset / fullStep);
        this.updateButtonsState();
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.currentOffset = this.targetOffset;
        this.track.style.transform = `translateX(-${this.currentOffset}px)`;
        this.track.style.transition = 'none';
        this.animationFrameId = null;
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }
  initCardAnimations() {
    this.items.forEach((item, index) => {
      const card = item.querySelector('.slider-card');
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.92)';
        card.style.transition = 'none';
      }
    });
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
      rootMargin: window.innerWidth <= 768 ? '200px 0px' : '100px 0px'
    });
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
    const index = Array.from(this.items).indexOf(item);
    const delay = index * 0.1;
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
      const effectiveVisibleCards = this.getEffectiveVisibleCards();
      const maxIndex = this.items.length - effectiveVisibleCards;
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
      this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
      this.nextBtn.style.cursor = this.currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
  }
}
export default Section4Slider;
