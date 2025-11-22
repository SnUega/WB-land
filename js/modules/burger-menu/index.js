class BurgerMenu {
  constructor() {
    this.burger = document.querySelector('[data-burger]');
    this.menu = document.querySelector('[data-mobile-menu]');
    this.closeBtn = document.querySelector('[data-menu-close]');
    this.langDropdown = document.querySelector('[data-lang-dropdown]');
    this.langBtn = this.langDropdown?.querySelector('.mobile-menu__lang-btn');
    this.langList = this.langDropdown?.querySelector('.mobile-menu__lang-list');
    this.langOptions = this.langDropdown?.querySelectorAll('[data-lang]');
    this.scrollHint = null;
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
    
    // Initialize current language from translations
    if (window.translations && this.langDropdown) {
      const currentLang = window.translations.getCurrentLang();
      this.updateCurrentLang(currentLang);
    }
    
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
    
    // Listen for language changes from other modules
    window.addEventListener('languageChanged', (e) => {
      if (this.langDropdown) {
        this.updateCurrentLang(e.detail.lang);
      }
    });
  }
  
  updateCurrentLang(lang) {
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
    
    // Show scroll hint for tablets after a short delay
    this.showScrollHint();
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
    const currentLang = window.translations?.getCurrentLang() || 'rus';
    if (currentLang === lang) {
      this.closeLangDropdown();
      return;
    }
    
    // Change language through translations module
    if (window.translations) {
      window.translations.setLanguage(lang);
    }
    
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
  }

  showScrollHint() {
    // Only show hint on tablets (landscape orientation, 769px - 1366px)
    if (window.innerWidth < 769 || window.innerWidth > 1366) {
      return;
    }
    
    if (window.matchMedia('(orientation: landscape)').matches) {
      // Check if menu content is scrollable
      const menuNav = this.menu.querySelector('.mobile-menu__nav');
      if (!menuNav) return;
      
      // Wait a bit for menu to fully open
      setTimeout(() => {
        const isScrollable = menuNav.scrollHeight > menuNav.clientHeight;
        if (isScrollable && !this.scrollHint) {
          this.createScrollHint();
        }
      }, 500);
    }
  }

  createScrollHint() {
    const menuNav = this.menu.querySelector('.mobile-menu__nav');
    if (!menuNav) return;
    
    // Remove existing hint if any
    if (this.scrollHint) {
      this.scrollHint.remove();
      this.scrollHint = null;
    }
    
    this.scrollHint = document.createElement('div');
    this.scrollHint.className = 'mobile-menu__scroll-hint';
    this.scrollHint.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2L8 14M8 14L2 8M8 14L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    
    menuNav.appendChild(this.scrollHint);
    
    // Show/hide hint based on scroll position
    let hideTimeout;
    const checkScrollPosition = () => {
      const scrollTop = menuNav.scrollTop;
      const scrollHeight = menuNav.scrollHeight;
      const clientHeight = menuNav.clientHeight;
      const isAtTop = scrollTop < 50; // Near top
      const isScrollable = scrollHeight > clientHeight;
      
      if (!isScrollable) {
        // Not scrollable, hide hint
        if (this.scrollHint) {
          this.scrollHint.style.opacity = '0';
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            if (this.scrollHint) {
              this.scrollHint.remove();
              this.scrollHint = null;
            }
          }, 300);
        }
        return;
      }
      
      if (isAtTop) {
        // At top, show hint
        if (this.scrollHint) {
          this.scrollHint.style.opacity = '1';
        } else {
          // Recreate hint if it was removed
          this.createScrollHint();
        }
      } else {
        // Scrolled down, hide hint
        if (this.scrollHint) {
          this.scrollHint.style.opacity = '0';
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(() => {
            if (this.scrollHint && menuNav.scrollTop > 50) {
              this.scrollHint.remove();
              this.scrollHint = null;
            }
          }, 300);
        }
      }
    };
    
    // Check scroll position on scroll
    menuNav.addEventListener('scroll', checkScrollPosition, { passive: true });
    
    // Initial check
    checkScrollPosition();
    
    // Auto-hide after 5 seconds if still at top
    setTimeout(() => {
      if (this.scrollHint && menuNav.scrollTop < 50) {
        this.scrollHint.style.opacity = '0';
        setTimeout(() => {
          if (this.scrollHint && menuNav.scrollTop < 50) {
            this.scrollHint.remove();
            this.scrollHint = null;
          }
        }, 300);
      }
    }, 5000);
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
