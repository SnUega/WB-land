// Modal Module
class Modal {
  constructor() {
    this.modals = new Map();
    this.currentModal = null;
    this.init();
  }

  init() {
    // Find all modals
    const modalElements = document.querySelectorAll('[data-modal]');
    modalElements.forEach(modal => {
      const id = modal.getAttribute('data-modal');
      this.modals.set(id, modal);
    });

    // Open buttons
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-modal-open]');
      if (openBtn) {
        const modalId = openBtn.getAttribute('data-modal-open');
        this.open(modalId);
      }
    });

    // Close buttons and overlay
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-modal-close]');
      if (closeBtn) {
        this.close();
      }
    });

    // ESC key
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
    
    // Get scroll position (use saved if exists, otherwise current)
    const scrollY = document.body.dataset.scrollY ? parseInt(document.body.dataset.scrollY) : window.scrollY;
    
    // Block page scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Store scroll position for restore
    document.body.dataset.scrollY = scrollY;
    
    modal.classList.add('is-open');
  }

  close() {
    if (!this.currentModal) return;

    this.currentModal.classList.remove('is-open');
    
    // Restore page scroll
    const scrollY = document.body.dataset.scrollY || 0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    delete document.body.dataset.scrollY;
    
    // Restore scroll position
    window.scrollTo(0, parseInt(scrollY) || 0);
    
    this.currentModal = null;
  }
}

// Form Validation
class FormValidator {
  constructor(form) {
    this.form = form;
    this.fields = form.querySelectorAll('[data-validate]');
    this.errors = {};
    this.init();
  }

  init() {
    // Real-time validation
    this.fields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        if (this.errors[field.name]) {
          this.validateField(field);
        }
      });
    });

    // Form submit
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

    // Required check
    if (field.hasAttribute('required')) {
      if (field.type === 'checkbox' && !value) {
        // Special message for privacy checkbox
        if (name === 'privacy') {
          error = 'Необходимо согласиться с политикой конфиденциальности';
        } else {
          error = 'Это поле обязательно для заполнения';
        }
      } else if (field.type !== 'checkbox' && !value) {
        error = 'Это поле обязательно для заполнения';
      }
    }

    // Email validation
    if (!error && field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Введите корректный email адрес';
      }
    }

    // Phone validation (Russian mobile numbers)
    if (!error && field.type === 'tel' && value) {
      // Remove all non-digit characters except +
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      
      // Check for Russian phone format: +7XXXXXXXXXX or 8XXXXXXXXXX
      let isValid = false;
      
      if (cleanPhone.startsWith('+7')) {
        // Format: +7XXXXXXXXXX (11 digits total, +7 + 10 digits)
        const digits = cleanPhone.substring(2);
        if (digits.length === 10 && /^\d{10}$/.test(digits)) {
          // Check if mobile (starts with 9) or valid landline
          if (digits[0] === '9' || /^[3-8]\d{9}$/.test(digits)) {
            isValid = true;
          }
        }
      } else if (cleanPhone.startsWith('8')) {
        // Format: 8XXXXXXXXXX (11 digits total)
        const digits = cleanPhone.substring(1);
        if (digits.length === 10 && /^\d{10}$/.test(digits)) {
          // Check if mobile (starts with 9) or valid landline
          if (digits[0] === '9' || /^[3-8]\d{9}$/.test(digits)) {
            isValid = true;
          }
        }
      } else if (cleanPhone.startsWith('7')) {
        // Format: 7XXXXXXXXXX (11 digits, without +)
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

    // Name validation (at least 2 words)
    if (!error && name === 'name' && value) {
      const words = value.trim().split(/\s+/);
      if (words.length < 2) {
        error = 'Введите полное имя (минимум имя и фамилия)';
      }
    }

    // Quantity validation (minimum 5)
    if (!error && name === 'quantity') {
      if (!value) {
        // Required check will handle empty value
      } else {
        const quantity = parseInt(value, 10);
        if (isNaN(quantity) || quantity < 5) {
          error = 'Минимальный заказ - 5 выкупов';
        }
      }
    }

    // Select validation (must select an option)
    if (!error && field.tagName === 'SELECT' && field.hasAttribute('required')) {
      if (!value || value === '') {
        error = 'Это поле обязательно для заполнения';
      }
    }

    // Update error state
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
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    // Collect form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Simulate API call (заглушка)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Get saved scroll position (from when modal was opened)
      const savedScrollY = document.body.dataset.scrollY || window.scrollY;
      
      // Close current modal (keep body fixed to preserve scroll position)
      const modal = this.form.closest('.modal');
      if (modal) {
        modal.classList.remove('is-open');
        // Don't restore scroll yet - we're opening another modal
      }
      
      // Reset form
      this.form.reset();
      
      // Open success modal (will use saved scroll position)
      const modalInstance = window.modalInstance || new Modal();
      // Ensure scroll position is saved before opening
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

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const modalInstance = new Modal();
    window.modalInstance = modalInstance;
    
    // Initialize form validators for both forms
    const feedbackForms = document.querySelectorAll('[data-feedback-form]');
    feedbackForms.forEach(form => new FormValidator(form));
    
    const orderForms = document.querySelectorAll('[data-order-form]');
    orderForms.forEach(form => new FormValidator(form));
  });
} else {
  const modalInstance = new Modal();
  window.modalInstance = modalInstance;
  
  // Initialize form validators for both forms
  const feedbackForms = document.querySelectorAll('[data-feedback-form]');
  feedbackForms.forEach(form => new FormValidator(form));
  
  const orderForms = document.querySelectorAll('[data-order-form]');
  orderForms.forEach(form => new FormValidator(form));
}

export default Modal;
export { FormValidator };

