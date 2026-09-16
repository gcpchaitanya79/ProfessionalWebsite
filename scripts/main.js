(() => {
  'use strict';

  /* ------------------------------------------------------------------ *
   * Mobile navigation toggle
   * ------------------------------------------------------------------ */
  const initMobileNav = () => {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.primary-nav');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    };

    const openMenu = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    nav.addEventListener('click', (event) => {
      if (event.target.matches('.nav-link')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', (event) => {
      const isOpen = nav.classList.contains('is-open');
      if (isOpen && !nav.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });
  };

  /* ------------------------------------------------------------------ *
   * Sticky header shadow
   * ------------------------------------------------------------------ */
  const initStickyHeader = () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const updateHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
  };

  /* ------------------------------------------------------------------ *
   * Scroll-spy — highlights the nav link for the section in view.
   * Safe no-op until page sections with [id] exist inside <main>.
   * ------------------------------------------------------------------ */
  const initScrollSpy = () => {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const setActiveLink = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  };

  /* ------------------------------------------------------------------ *
   * Theme toggle (light / dark), persisted to localStorage
   * ------------------------------------------------------------------ */
  const THEME_STORAGE_KEY = 'theme';

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme, toggle) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  };

  const initThemeToggle = () => {
    const toggle = document.getElementById('theme-toggle');
    applyTheme(getPreferredTheme(), toggle);
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme, toggle);
    });
  };

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initStickyHeader();
    initScrollSpy();
  });
})();
