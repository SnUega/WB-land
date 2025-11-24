class PreventHorizontalScroll {
  constructor() {
    if (window.innerWidth > 768) {
      return;
    }
    this.init();
  }

  init() {
    let touchStartX = 0;
    let touchStartY = 0;
    let isTracking = false;

    document.addEventListener('touchstart', (e) => {
      const target = e.target;
      
      if (this.isSliderElement(target)) {
        return;
      }

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isTracking = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isTracking) return;

      const target = e.target;
      
      if (this.isSliderElement(target)) {
        isTracking = false;
        return;
      }

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = Math.abs(currentX - touchStartX);
      const deltaY = Math.abs(currentY - touchStartY);

      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
        isTracking = false;
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      isTracking = false;
    }, { passive: true });

    document.addEventListener('touchcancel', () => {
      isTracking = false;
    }, { passive: true });
  }

  isSliderElement(element) {
    if (!element) return false;
    
    const sliderSelectors = [
      '.section-4__slider',
      '.section-4__slider-track',
      '.section-4__slider-item',
      '.section-7__slider',
      '.section-7__slider-track',
      '.section-7__slider-item',
      '.section-5__slider',
      '.section-5__slider-track',
      '.section-5__slider-item',
      '.section-2__slider',
      '.section-2__slider-track',
      '.section-2__slider-item'
    ];

    for (const selector of sliderSelectors) {
      if (element.closest && element.closest(selector)) {
        return true;
      }
      if (element.matches && element.matches(selector)) {
        return true;
      }
    }

    return false;
  }
}

export default PreventHorizontalScroll;

