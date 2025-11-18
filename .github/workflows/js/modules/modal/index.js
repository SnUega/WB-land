class Modal {
  constructor() {
    this.modals = new Map();
    this.currentModal = null;
    this.modalLenis = null;
    this.modalRafId = null;
    this.init();
  }
  init() {
    const modalElements = document.querySelectorAll('[data-modal]');
    modalElements.forEach(modal => {
      const id = modal.getAttribute('data-modal');
      this.modals.set(id, modal);
    });
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) {
        const modalId = openBtn.getAttribute('data-modal-open');
        this.open(modalId);
      }
    });
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        this.close();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.close();
      }
    });
  }
  open(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return;
    this.currentModal = modal;
    const scrollY = document.body.dataset.scrollY ? parseInt(document.body.dataset.scrollY) : window.scrollY;
    
    if (window.lenis) {
      window.lenis.stop();
    }
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.dataset.scrollY = scrollY;
    modal.classList.add('is-open');
    
    const modalContent = modal.querySelector('.modal__content');
    if (modalContent && typeof Lenis !== 'undefined') {
      this.modalLenis = new Lenis({
        wrapper: modalContent,
        content: modalContent,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });
      
      this.modalRafId = null;
      const raf = (time) => {
        this.modalLenis.raf(time);
        this.modalRafId = requestAnimationFrame(raf);
      };
      this.modalRafId = requestAnimationFrame(raf);
    }
  }
  close() {
    if (!this.currentModal) return;
    
    if (this.modalRafId) {
      cancelAnimationFrame(this.modalRafId);
      this.modalRafId = null;
    }
    
    if (this.modalLenis) {
      this.modalLenis.destroy();
      this.modalLenis = null;
    }
    
    this.currentModal.classList.remove('is-open');
    const scrollY = document.body.dataset.scrollY || 0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    delete document.body.dataset.scrollY;
    
    if (window.lenis) {
      window.lenis.start();
      window.lenis.scrollTo(parseInt(scrollY) || 0, { immediate: true });
    } else {
      window.scrollTo(0, parseInt(scrollY) || 0);
    }
    
    this.currentModal = null;
  }
}
class FormValidator {
  constructor(form) {
    this.form = form;
    this.fields = form.querySelectorAll('[data-validate]');
    this.errors = {};
    this.init();
  }
  init() {
    this.fields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        if (this.errors[field.name]) {
          this.validateField(field);
        }
      });
    });
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.submit();
      }
    });
  }
  validateField(field) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const name = field.name;
    let error = '';
    if (field.hasAttribute('required')) {
      if (field.type === 'checkbox' && !value) {
        if (name === 'privacy') {
          error = 'Необходимо согласиться с политикой конфиденциальности';
        } else {
          error = 'Это поле обязательно для заполнения';
        }
      } else if (field.type !== 'checkbox' && !value) {
        error = 'Это поле обязательно для заполнения';
      }
    }
    if (!error && field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Введите корректный email адрес';
      }
    }
    if (!error && field.type === 'tel' && value) {
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      let isValid = false;
      if (cleanPhone.startsWith('+7')) {
        const digits = cleanPhone.substring(2);
        if (digits.length === 10 && /^\d{10}$/.test(digits)) {
          if (digits[0] === '9' || /^[3-8]\d{9}$/.test(digits)) {
            isValid = true;
          }
        }
      } else if (cleanPhone.startsWith('8')) {
        const digits = cleanPhone.substring(1);
        if (digits.length === 10 && /^\d{10}$/.test(digits)) {
          if (digits[0] === '9' || /^[3-8]\d{9}$/.test(digits)) {
            isValid = true;
          }
        }
      } else if (cleanPhone.startsWith('7')) {
        const digits = cleanPhone.substring(1);
        if (digits.length === 10 && /^\d{10}$/.test(digits)) {
          if (digits[0] === '9' || /^[3-8]\d{9}$/.test(digits)) {
            isValid = true;
          }
        }
      }
      if (!isValid) {
        error = 'Введите корректный номер телефона (например: +7 999 123 45 67)';
      }
    }
    if (!error && name === 'name' && value) {
      const words = value.trim().split(/\s+/);
      if (words.length < 2) {
        error = 'Введите полное имя (минимум имя и фамилия)';
      }
    }
    if (!error && name === 'quantity') {
      if (!value) {
      } else {
        const quantity = parseInt(value, 10);
        if (isNaN(quantity) || quantity < 5) {
          error = 'Минимальный заказ - 5 выкупов';
        }
      }
    }
    if (!error && field.tagName === 'SELECT' && field.hasAttribute('required')) {
      if (!value || value === '') {
        error = 'Это поле обязательно для заполнения';
      }
    }
    if (error) {
      this.errors[name] = error;
      this.showError(field, error);
    } else {
      delete this.errors[name];
      this.hideError(field);
    }
    return !error;
  }
  validate() {
    let isValid = true;
    this.fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }
  showError(field, message) {
    field.classList.add('is-error');
    const errorEl = field.closest('.form__field')?.querySelector('.form__error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('is-visible');
    }
  }
  hideError(field) {
    field.classList.remove('is-error');
    const errorEl = field.closest('.form__field')?.querySelector('.form__error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }
  }
  async submit() {
    const submitBtn = this.form.querySelector('.form__submit');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      const savedScrollY = document.body.dataset.scrollY || window.scrollY;
      const modal = this.form.closest('.modal');
      if (modal) {
        modal.classList.remove('is-open');
      }
      this.form.reset();
      const modalInstance = window.modalInstance || new Modal();
      if (!document.body.dataset.scrollY) {
        document.body.dataset.scrollY = savedScrollY;
      }
      modalInstance.open('success');
    } catch (error) {
      console.error('Form submission error:', error);
      submitBtn.textContent = 'Ошибка отправки';
      submitBtn.style.background = 'linear-gradient(180deg, #FF3C3D 0%, #e63939 100%)';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 2000);
    }
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const modalInstance = new Modal();
    window.modalInstance = modalInstance;
    const feedbackForms = document.querySelectorAll('[data-feedback-form]');
    feedbackForms.forEach(form => new FormValidator(form));
    const orderForms = document.querySelectorAll('[data-order-form]');
    orderForms.forEach(form => new FormValidator(form));
  });
} else {
  const modalInstance = new Modal();
  window.modalInstance = modalInstance;
  const feedbackForms = document.querySelectorAll('[data-feedback-form]');
  feedbackForms.forEach(form => new FormValidator(form));
  const orderForms = document.querySelectorAll('[data-order-form]');
  orderForms.forEach(form => new FormValidator(form));
}
export default Modal;
export { FormValidator };
