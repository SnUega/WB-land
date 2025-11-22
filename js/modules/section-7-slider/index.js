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
    this.previousIndex = 0; // Track previous index to detect new cards
    this.isAnimating = false;
    this.cardWidth = 0;
    this.cardGap = 20;
    this.visibleCards = 2;
    this.init();
  }
  init() {
    setTimeout(() => {
      this.calculateDimensions();
      this.setupEventListeners();
      this.updateSliderPosition();
      this.updateButtonsState();
    }, 100);
    window.addEventListener('resize', () => {
      this.calculateDimensions();
      this.updateSliderPosition();
    });
  }
  calculateDimensions() {
    if (this.items.length === 0) return;
    const firstCard = this.items[0];
    const cardRect = firstCard.getBoundingClientRect();
    this.cardWidth = cardRect.width || parseFloat(getComputedStyle(firstCard).width);
    if (!this.cardWidth || this.cardWidth === 0) {
      const viewportWidth = window.innerWidth;
      this.cardWidth = Math.max(280, Math.min(820, viewportWidth * 0.572));
    }
  }
  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollToPrev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollToNext());
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
  updateSliderPosition() {
    if (!this.track || !this.slider) return;
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
      
      // Slower, smoother transition timing
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
    
    // Slower, smoother track animation
    this.track.style.transition = 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1)';
    this.track.style.transform = `translateX(${targetOffset}px)`;
  }
  updateButtonsState() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex <= 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= this.items.length - this.visibleCards;
    }
  }
  /**
   * Animate visible cards with bubble effect when slider changes
   * Only animates elements inside NEW cards, not cards that are just shifting position
   */
  animateVisibleCards() {
    if (typeof gsap === 'undefined') return;
    
    // Get currently visible cards
    const visibleItems = [];
    for (let i = this.currentIndex; i < this.currentIndex + this.visibleCards && i < this.items.length; i++) {
      visibleItems.push(this.items[i]);
    }
    
    // Get previously visible cards to detect which are new
    const previousVisibleIndices = [];
    for (let i = this.previousIndex; i < this.previousIndex + this.visibleCards && i < this.items.length; i++) {
      previousVisibleIndices.push(i);
    }
    
    // Only animate cards that are NEW (not in previous visible set)
    visibleItems.forEach((item, relativeIndex) => {
      const absoluteIndex = this.currentIndex + relativeIndex;
      const isNewCard = !previousVisibleIndices.includes(absoluteIndex);
      
      if (!isNewCard) {
        // Card is just shifting position, don't animate
        return;
      }
      
      // New card - animate with synchronized timing
      const delay = relativeIndex * 0.1; // Slightly increased delay for better sync
      
      // Animate product card with bubble effect
      setTimeout(() => {
        this.animateProductCards(item);
      }, delay * 1000);
      
      // Animate title with delay
      setTimeout(() => {
        this.animateCardTitle(item);
      }, (delay + 0.3) * 1000);
      
      // Animate results with delay
      setTimeout(() => {
        this.animateCardResults(item);
      }, (delay + 0.4) * 1000);
    });
  }
  
  /**
   * Animate card title - simple smooth scale from 0.85 to 1
   */
  animateCardTitle(item) {
    if (typeof gsap === 'undefined') return;
    const title = item.querySelector('.section-7__card-title');
    if (!title) return;
    
    // Kill any existing animations and reset any transforms
    gsap.killTweensOf(title);
    
    // Disable ScrollTrigger for this title to prevent conflicts
    if (typeof ScrollTrigger !== 'undefined') {
      const triggers = ScrollTrigger.getAll().filter(trigger => {
        return trigger.vars && trigger.vars.trigger === title;
      });
      triggers.forEach(trigger => trigger.disable());
    }
    
    // Clear all GSAP properties and reset transforms
    gsap.set(title, {
      clearProps: 'all'
    });
    
    // Remove any clipPath and reset styles
    title.style.clipPath = 'none';
    title.style.transform = '';
    
    // Set initial state - simple scale (ensure it's visible)
    gsap.set(title, {
      opacity: 1,
      scale: 0.85,
      x: 0,
      y: 0,
      transformOrigin: 'center center'
    });
    
    // Animate from 0.85 to 1 - simple and smooth
    gsap.to(title, {
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        // Ensure final state
        gsap.set(title, { scale: 1 });
      }
    });
  }
  
  /**
   * Animate card results with cascade
   */
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

