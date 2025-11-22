/**
 * Модуль кастомного dropdown для форм
 */
class FormDropdown {
  constructor(dropdown) {
    this.dropdown = dropdown;
    this.btn = dropdown.querySelector('.form__dropdown-btn');
    this.current = dropdown.querySelector('.form__dropdown-current');
    this.hiddenInput = dropdown.querySelector('input[type="hidden"]');
    this.list = dropdown.querySelector('.form__dropdown-list');
    this.options = dropdown.querySelectorAll('.form__dropdown-option');
    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.btn || !this.current || !this.hiddenInput || !this.list) return;

    // Обработчик клика по кнопке
    this.btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    // Обработчики клика по опциям
    this.options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.select(option);
      });
    });

    // Закрытие при клике вне dropdown
    document.addEventListener('click', (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.close();
      }
    });

    // Закрытие при нажатии Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.dropdown.classList.add('is-open');
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.dropdown.classList.remove('is-open');
  }

  select(option) {
    const value = option.getAttribute('data-value');
    const text = option.textContent.trim();
    
    // Сохраняем data-i18n ключ опции для обновления при смене языка
    const i18nKey = option.getAttribute('data-i18n');
    if (i18nKey) {
      this.current.setAttribute('data-i18n', i18nKey);
    } else {
      this.current.removeAttribute('data-i18n');
    }

    // Обновляем скрытое поле
    this.hiddenInput.value = value;

    // Обновляем отображаемый текст
    this.current.textContent = text;

    // Обновляем состояние опций
    this.options.forEach(opt => {
      opt.classList.remove('is-selected');
    });
    option.classList.add('is-selected');

    // Убираем класс ошибки если был
    this.dropdown.classList.remove('is-error');
    const errorEl = this.dropdown.closest('.form__field')?.querySelector('.form__error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('is-visible');
    }

    // Триггерим событие change для валидации
    this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));

    this.close();
  }
  
  // Метод для обновления текста при смене языка
  updateLanguage() {
    const selectedOption = Array.from(this.options).find(opt => opt.classList.contains('is-selected'));
    if (selectedOption) {
      const i18nKey = selectedOption.getAttribute('data-i18n');
      if (i18nKey && this.current) {
        const translations = window.translations;
        if (translations) {
          this.current.textContent = translations.get(i18nKey);
        }
      }
    }
  }

  getValue() {
    return this.hiddenInput.value;
  }

  setValue(value) {
    const option = Array.from(this.options).find(opt => opt.getAttribute('data-value') === value);
    if (option) {
      this.select(option);
    }
  }
}

// Хранилище экземпляров dropdown для обновления при смене языка
const dropdownInstances = [];

// Инициализация всех dropdown в формах
function initFormDropdowns() {
  const dropdowns = document.querySelectorAll('[data-form-dropdown]');
  dropdowns.forEach(dropdown => {
    const instance = new FormDropdown(dropdown);
    dropdownInstances.push(instance);
  });
}

// Обновление всех dropdown при смене языка
function updateDropdownsLanguage() {
  dropdownInstances.forEach(instance => {
    if (instance && typeof instance.updateLanguage === 'function') {
      instance.updateLanguage();
    }
  });
}

// Слушаем событие смены языка
window.addEventListener('languageChanged', updateDropdownsLanguage);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFormDropdowns);
} else {
  initFormDropdowns();
}

export default FormDropdown;

