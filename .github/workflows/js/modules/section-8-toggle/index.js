class Section8Toggle {
  constructor() {
    this.toggle = document.querySelector('.section-8__toggle');
    this.items = document.querySelectorAll('.section-8__item');
    this.description = document.querySelector('.section-8__description');
    this.minimum = document.querySelector('.section-8__minimum');
    this.toggleOptions = document.querySelectorAll('.section-8__toggle-option');
    if (!this.toggle || !this.items.length) return;
    this.isActive = false;
    this.init();
  }
  init() {
    this.toggle.addEventListener('click', () => {
      this.handleToggle();
    });
  }
  handleToggle() {
    this.isActive = !this.isActive;
    this.toggle.classList.toggle('is-active');
    
    // Переключение активного option
    this.toggleOptions.forEach((option, index) => {
      if (this.isActive) {
        option.classList.toggle('section-8__toggle-option--active', index === 1);
      } else {
        option.classList.toggle('section-8__toggle-option--active', index === 0);
      }
    });
    
    // Animate items out, then update text and animate in
    this.animateOut();
  }
  
  animateOut() {
    // Animate items out: cascade from top to bottom, scale up and move UP (swapped)
    this.items.forEach((item, index) => {
      const delay = index * 0.05; // Cascade from top to bottom
      item.style.transition = `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`;
      item.style.opacity = '0';
      item.style.transform = 'translateY(-20px) scale(1.15)'; // Scale up and move UP
    });
    
    // After animation completes, update text and animate in
    // Slightly increased delay for smoother transition
    const maxDelay = Math.max(...Array.from(this.items).map((_, index) => index * 0.05));
    setTimeout(() => {
      this.updateText();
      this.animateIn();
    }, (400 + maxDelay * 1000) * 1.05);
  }
  
  animateIn() {
    // Reset items for animation in: start from below with scale up (swapped)
    this.items.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px) scale(1.15)'; // Start from below with scale up
    });
    
    // Animate items in: cascade from bottom to top, scale down to normal and move DOWN
    // Reverse order for bottom-to-top cascade
    const itemsArray = Array.from(this.items).reverse();
    itemsArray.forEach((item, index) => {
      setTimeout(() => {
        item.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0) scale(1)'; // Move DOWN and scale to normal
      }, index * 50);
    });
  }
  updateText() {
    // Замена текста "выкупов" на "отзывов" и наоборот
    const unitElements = document.querySelectorAll('.section-8__item-unit');
    unitElements.forEach((element) => {
      if (this.isActive) {
        element.textContent = element.textContent.replace('выкупов', 'отзывов');
      } else {
        element.textContent = element.textContent.replace('отзывов', 'выкупов');
      }
    });
    
    // Замена в минимальном заказе
    if (this.minimum) {
      if (this.isActive) {
        this.minimum.textContent = this.minimum.textContent.replace('выкупов', 'отзывов');
      } else {
        this.minimum.textContent = this.minimum.textContent.replace('отзывов', 'выкупов');
      }
    }
  }
  // Анимации появления временно отключены
  // animateOut() { ... }
  // animateIn() { ... }
}
export default Section8Toggle;

