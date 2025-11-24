class HeaderLang {
  constructor() {
    this.langDropdown = document.querySelector('[data-header-lang-dropdown]');
    this.langBtn = this.langDropdown?.querySelector('.header__lang-btn');
    this.langList = this.langDropdown?.querySelector('.header__lang-list');
    this.langOptions = this.langDropdown?.querySelectorAll('[data-lang]');
    this.init();
  }

  init() {
    if (!this.langDropdown || !this.langBtn || !this.langList) return;

    if (window.translations) {
      const currentLang = window.translations.getCurrentLang();
      this.updateCurrentLang(currentLang);
    }

    this.langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    document.addEventListener('click', (e) => {
      if (!this.langDropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });

    if (this.langOptions) {
      this.langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = option.getAttribute('data-lang');
          this.selectLang(lang);
        });
      });
    }

    window.addEventListener('languageChanged', (e) => {
      this.updateCurrentLang(e.detail.lang);
    });
  }

  toggleDropdown() {
    this.langDropdown.classList.toggle('is-open');
  }

  closeDropdown() {
    this.langDropdown.classList.remove('is-open');
  }

  selectLang(lang) {
    const currentLang = window.translations?.getCurrentLang() || 'rus';
    if (currentLang === lang) {
      this.closeDropdown();
      return;
    }

    if (window.translations) {
      window.translations.setLanguage(lang);
    }

    this.updateCurrentLang(lang);
    this.closeDropdown();
  }

  updateCurrentLang(lang) {
    const langText = lang.toUpperCase();
    const currentLangEl = this.langDropdown.querySelector('.header__lang-current');
    if (currentLangEl) {
      currentLangEl.textContent = langText;
    }

    if (this.langOptions) {
      this.langOptions.forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
          option.style.fontWeight = '700';
        } else {
          option.style.fontWeight = '600';
        }
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HeaderLang();
  });
} else {
  new HeaderLang();
}

export default HeaderLang;
