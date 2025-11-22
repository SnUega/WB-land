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
    
    let scrollY;
    if (document.body.dataset.scrollY) {
      scrollY = parseInt(document.body.dataset.scrollY);
    } else if (window.lenis) {
      scrollY = window.lenis.scroll;
    } else {
      scrollY = window.scrollY;
    }
    
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
    
    // Сохраняем позицию скролла ПЕРЕД удалением стилей
    const savedScrollY = document.body.dataset.scrollY 
      ? parseInt(document.body.dataset.scrollY) 
      : (window.lenis ? window.lenis.scroll : window.scrollY);
    
    // Удаляем класс модального окна
    this.currentModal.classList.remove('is-open');
    
    // Удаляем сохраненную позицию
    delete document.body.dataset.scrollY;
    
    // Восстанавливаем стили body
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Восстанавливаем позицию скролла
    // Используем синхронную установку скролла для предотвращения сброса
    if (window.lenis) {
      // Если используется Lenis, сначала запускаем его и устанавливаем позицию
      window.lenis.start();
      window.lenis.scrollTo(savedScrollY, { 
        immediate: true,
        duration: 0
      });
      // Также устанавливаем нативный скролл для надежности
      window.scrollTo(0, savedScrollY);
      document.documentElement.scrollTop = savedScrollY;
    } else {
      // Если Lenis не используется, просто устанавливаем нативный скролл
      window.scrollTo(0, savedScrollY);
      document.documentElement.scrollTop = savedScrollY;
    }
    
    // Дополнительная проверка через RAF для гарантии
    requestAnimationFrame(() => {
      if (window.lenis && Math.abs(window.lenis.scroll - savedScrollY) > 1) {
        window.lenis.scrollTo(savedScrollY, { 
          immediate: true,
          duration: 0
        });
      }
      if (Math.abs(window.scrollY - savedScrollY) > 1) {
        window.scrollTo(0, savedScrollY);
        document.documentElement.scrollTop = savedScrollY;
      }
    });
    
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
    const translations = window.translations;
    let error = '';
    if (field.hasAttribute('required')) {
      if (field.type === 'checkbox' && !value) {
        if (name === 'privacy') {
          error = translations.get('form.error.privacy');
        } else {
          error = translations.get('form.error.required');
        }
      } else if (field.type !== 'checkbox' && !value) {
        error = translations.get('form.error.required');
      }
    }
    if (!error && field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = translations.get('form.error.email');
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
        error = translations.get('form.error.phone');
      }
    }
    if (!error && name === 'name' && value) {
      const words = value.trim().split(/\s+/);
      if (words.length < 2) {
        error = translations.get('form.error.name');
      }
    }
    if (!error && name === 'quantity') {
      if (!value) {
      } else {
        const quantity = parseInt(value, 10);
        if (isNaN(quantity) || quantity < 5) {
          error = translations.get('form.error.quantity');
        }
      }
    }
    if (!error && field.tagName === 'SELECT' && field.hasAttribute('required')) {
      if (!value || value === '') {
        error = translations.get('form.error.required');
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
    const translations = window.translations;
    // Сохраняем оригинальный текст из data-i18n, если есть
    const originalTextKey = submitBtn.getAttribute('data-i18n');
    const originalText = originalTextKey ? translations.get(originalTextKey) : submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = translations.get('form.sending');
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Сохраняем позицию скролла перед закрытием модального окна
      const savedScrollY = document.body.dataset.scrollY 
        ? parseInt(document.body.dataset.scrollY) 
        : (window.lenis ? window.lenis.scroll : window.scrollY);
      
      const modal = this.form.closest('.modal');
      const modalInstance = window.modalInstance || new Modal();
      
      // Закрываем текущее модальное окно, сохраняя позицию
      if (modal && modalInstance.currentModal === modal) {
        if (modalInstance.modalRafId) {
          cancelAnimationFrame(modalInstance.modalRafId);
          modalInstance.modalRafId = null;
        }
        if (modalInstance.modalLenis) {
          modalInstance.modalLenis.destroy();
          modalInstance.modalLenis = null;
        }
        modal.classList.remove('is-open');
        modalInstance.currentModal = null;
        
        // Восстанавливаем стили body
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Восстанавливаем позицию скролла
        // Используем синхронную установку скролла для предотвращения сброса
        if (window.lenis) {
          // Если используется Lenis, сначала запускаем его и устанавливаем позицию
          window.lenis.start();
          window.lenis.scrollTo(savedScrollY, { 
            immediate: true,
            duration: 0
          });
          // Также устанавливаем нативный скролл для надежности
          window.scrollTo(0, savedScrollY);
          document.documentElement.scrollTop = savedScrollY;
        } else {
          // Если Lenis не используется, просто устанавливаем нативный скролл
          window.scrollTo(0, savedScrollY);
          document.documentElement.scrollTop = savedScrollY;
        }
        
        // Дополнительная проверка через RAF для гарантии
        requestAnimationFrame(() => {
          if (window.lenis && Math.abs(window.lenis.scroll - savedScrollY) > 1) {
            window.lenis.scrollTo(savedScrollY, { 
              immediate: true,
              duration: 0
            });
          }
          if (Math.abs(window.scrollY - savedScrollY) > 1) {
            window.scrollTo(0, savedScrollY);
            document.documentElement.scrollTop = savedScrollY;
          }
        });
      }
      
      this.form.reset();
      
      // Открываем модальное окно успеха, сохраняя позицию скролла
      // Не перезаписываем dataset.scrollY, чтобы позиция сохранилась
      if (!document.body.dataset.scrollY) {
        document.body.dataset.scrollY = savedScrollY;
      }
      modalInstance.open('success');
    } catch (error) {
      console.error('Form submission error:', error);
      const translations = window.translations;
      submitBtn.textContent = translations.get('form.error.sending');
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
