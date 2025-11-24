class TabletPortraitOverlay {
  constructor() {
    this.overlay = document.getElementById('tablet-portrait-overlay');
    if (!this.overlay) return;

    this.init();
  }

  init() {
    this.checkOrientation();
    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.checkOrientation();
      }, 100);
    });

    window.addEventListener('resize', () => {
      this.checkOrientation();
    });
  }

  checkOrientation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    
    const isTablet = width >= 481 && width <= 1024;
    
    if (isTablet && isPortrait) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    if (this.overlay) {
      this.overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    }
  }

  hide() {
    if (this.overlay) {
      this.overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  }
}

export default TabletPortraitOverlay;

