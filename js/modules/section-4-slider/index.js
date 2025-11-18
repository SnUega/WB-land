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
    this.scrollSpeed = 0.6;
    this.animationFrameId = null;
    this.lerpSpeed = 0.08;
    this.cardWidth = 0;
    this.cardGap = 20;
    this.visibleCards = 3;
    this.animated = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.minSwipeDistance = 50;
    this.init();
  }
  init() {
    setTimeout(() => {
      this.calculateDimensions();
      this.setupSliderPositioning();
      this.setupEventListeners();
      this.initCardAnimations();
      this.updateSliderPosition();
    }, 100);
    window.addEventListener('resize', () => {
      this.calculateDimensions();
      this.setupSliderPositioning();
      this.updateSliderPosition();
    });
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
  calculateDimensions() {
    if (this.items.length === 0) return;
    const firstCard = this.items[0];
    const cardRect = firstCard.getBoundingClientRect();
    this.cardWidth = cardRect.width || parseFloat(getComputedStyle(firstCard).width);
    if (!this.cardWidth || this.cardWidth === 0) {
      const viewportWidth = window.innerWidth;
      this.cardWidth = Math.max(280, Math.min(400, viewportWidth * 0.3));
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
    this.items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (this.lenis) {
          this.lenis.stop();
        }
      });
      item.addEventListener('mouseleave', () => {
        if (this.lenis) {
          this.lenis.start();
        }
      });
      item.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleWheel(e);
      }, { passive: false });
    });
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
  handleWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.lenis) {
      this.lenis.stop();
    }
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
    const delta = e.deltaY * this.scrollSpeed;
    const maxOffset = this.getMaxOffset();
    this.targetOffset = Math.max(0, Math.min(maxOffset, this.targetOffset + delta));
    this.updateSliderPositionSmooth();
    return false;
  }
  handleSwipe() {
    const swipeDistance = this.touchStartX - this.touchEndX;
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        this.scrollToNext();
      } else {
        this.scrollToPrev();
      }
    }
  }
  scrollToNext() {
    const maxIndex = this.items.length - this.visibleCards;
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
    if (!this.cardWidth) {
      this.calculateDimensions();
    }
    const baseMaxIndex = this.items.length - this.visibleCards;
    const fullStep = this.cardWidth + this.cardGap;
    const partialStep = fullStep * 0.2;
    let offset;
    if (this.currentIndex === 0) {
      offset = 0;
    } else if (this.currentIndex === 1) {
      offset = fullStep * 1.1;
    } else if (this.currentIndex === baseMaxIndex) {
      offset = baseMaxIndex * fullStep + partialStep;
    } else {
      offset = this.currentIndex * fullStep;
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
      rootMargin: '100px 0px'
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
      const maxIndex = this.items.length - this.visibleCards;
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
      this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
      this.nextBtn.style.cursor = this.currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }
  }
}
export default Section4Slider;
