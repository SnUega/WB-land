// Header Language Dropdown Module
class HeaderLangDropdown {
  constructor() {
    this.langDropdown = document.querySelector('[data-header-lang-dropdown]');
    this.langBtn = this.langDropdown?.querySelector('.header__lang-btn');
    this.langList = this.langDropdown?.querySelector('.header__lang-list');
    this.langOptions = this.langDropdown?.querySelectorAll('[data-lang]');
    this.currentLang = 'rus';

    this.init();
  }

  init() {
    if (!this.langDropdown || !this.langBtn || !this.langList) return;

    // Button click
    this.langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!this.langDropdown.contains(e.target)) {
        this.close();
      }
    });

    // Language selection
    if (this.langOptions) {
      this.langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = option.getAttribute('data-lang');
          this.selectLang(lang);
        });
      });
    }
  }

  toggle() {
    this.langDropdown.classList.toggle('is-open');
  }

  close() {
    this.langDropdown.classList.remove('is-open');
  }

  selectLang(lang) {
    if (this.currentLang === lang) {
      this.close();
      return;
    }

    this.currentLang = lang;
    const langText = lang.toUpperCase();
    const currentLangEl = this.langDropdown.querySelector('.header__lang-current');
    
    if (currentLangEl) {
      currentLangEl.textContent = langText;
    }

    // Update selected option
    if (this.langOptions) {
      this.langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
          option.style.fontWeight = '700';
        } else {
          option.style.fontWeight = '600';
        }
      });
    }

    this.close();
    
    // TODO: Add i18n logic here
    console.log('Language changed to:', lang);
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HeaderLangDropdown();
  });
} else {
  new HeaderLangDropdown();
}

export default HeaderLangDropdown;

