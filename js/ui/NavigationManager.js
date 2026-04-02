/**
 * Управление навигацией
 * ООО "Волга-Днепр Инжиниринг"
 */

class NavigationManager {
  constructor() {
    this.scrollThreshold = CONFIG.NAVIGATION.SCROLL_HEADER_THRESHOLD;
    this.scrollTopThreshold = CONFIG.NAVIGATION.SCROLL_TOP_THRESHOLD;
    this.navbar = null;
    this.scrollToTopBtn = null;
    this.mobileMenu = null;
    this.scrollHandler = null;
  }

  init() {
    this.navbar = DOMHelper.getElement('navbar');
    this.scrollToTopBtn = DOMHelper.getElement('scrollToTop');
    this.mobileMenu = DOMHelper.getElement('mobileMenu');
    
    this._initSmoothScroll();
    this._initScrollHandler();
    this._initMobileMenu();
    
    this._handleScroll();
  }

  _initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        
        const target = DOMHelper.query(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          this._closeMobileMenu();
        }
      });
    });
  }

  _initScrollHandler() {
    let timeout;
    this.scrollHandler = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => this._handleScroll(), CONFIG.PERFORMANCE.SCROLL_DEBOUNCE_MS);
    };
    
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  _handleScroll() {
    const scrollY = window.scrollY;
    
    if (this.navbar) {
      if (scrollY > this.scrollThreshold) {
        DOMHelper.addClass(this.navbar, 'scrolled');
      } else {
        DOMHelper.removeClass(this.navbar, 'scrolled');
      }
    }
    
    if (this.scrollToTopBtn) {
      if (scrollY > this.scrollTopThreshold) {
        DOMHelper.addClass(this.scrollToTopBtn, 'visible');
      } else {
        DOMHelper.removeClass(this.scrollToTopBtn, 'visible');
      }
    }
  }

  _initMobileMenu() {
    const menuBtn = DOMHelper.query('.mobile-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    const closeBtn = DOMHelper.query('.mobile-menu-close', this.mobileMenu);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.toggleMobileMenu());
    }
  }

  toggleMobileMenu() {
    if (!this.mobileMenu) return;
    
    const isActive = DOMHelper.hasClass(this.mobileMenu, 'active');
    
    if (isActive) {
      DOMHelper.removeClass(this.mobileMenu, 'active');
      DOMHelper.removeClass(this.navbar, 'mobile-menu-open');
      DOMHelper.toggleBodyScroll(false);
    } else {
      DOMHelper.addClass(this.mobileMenu, 'active');
      DOMHelper.addClass(this.navbar, 'mobile-menu-open');
      DOMHelper.toggleBodyScroll(true);
    }
  }

  _closeMobileMenu() {
    if (this.mobileMenu && DOMHelper.hasClass(this.mobileMenu, 'active')) {
      DOMHelper.removeClass(this.mobileMenu, 'active');
      DOMHelper.removeClass(this.navbar, 'mobile-menu-open');
      DOMHelper.toggleBodyScroll(false);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  destroy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}

const navigationManager = new NavigationManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NavigationManager, navigationManager };
}