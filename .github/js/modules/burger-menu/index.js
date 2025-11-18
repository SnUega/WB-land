class BurgerMenu {
  constructor() {
    this.burger = document.querySelector('[data-burger]');
    this.menu = document.querySelector('[data-mobile-menu]');
    this.closeBtn = document.querySelector('[data-menu-close]');
    this.langDropdown = document.querySelector('[data-lang-dropdown]');
    this.langBtn = this.langDropdown?.querySelector('.mobile-menu__lang-btn');
    this.langList = this.langDropdown?.querySelector('.mobile-menu__lang-list');
    this.langOptions = this.langDropdown?.querySelectorAll('[data-lang]');
    this.currentLang = 'rus';
    this.isOpen = false;
    this.init();
  }
  init() {
    if (!this.burger || !this.menu) return;
    this.burger.addEventListener('click', () => this.toggle());
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    this.menu.addEventListener('click', (e) => {
      if (e.target === this.menu) {
        this.close();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    if (this.langBtn && this.langList) {
      this.langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLangDropdown();
      });
      document.addEventListener('click', (e) => {
        if (!this.langDropdown.contains(e.target)) {
          this.closeLangDropdown();
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
    }
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
    this.burger.classList.add('is-active');
    this.menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.burger.classList.remove('is-active');
    this.menu.classList.remove('is-open');
    document.body.style.overflow = '';
    this.closeLangDropdown();
  }
  toggleLangDropdown() {
    this.langDropdown.classList.toggle('is-open');
  }
  closeLangDropdown() {
    this.langDropdown.classList.remove('is-open');
  }
  selectLang(lang) {
    if (this.currentLang === lang) {
      this.closeLangDropdown();
      return;
    }
    this.currentLang = lang;
    const langText = lang.toUpperCase();
    const currentLangEl = this.langDropdown.querySelector('.mobile-menu__lang-current');
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
    this.closeLangDropdown();
    console.log('Language changed to:', lang);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new BurgerMenu();
  });
} else {
  new BurgerMenu();
}
export default BurgerMenu;
