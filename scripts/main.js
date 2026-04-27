console.log('%c✅ 4DA website clone loaded successfully with Tailwind v4', 'color: #a855f7; font-weight: bold;');

function initPricingMobileTabs() {
  const pricingRoot = document.querySelector('[data-pricing-mobile]');
  if (!pricingRoot) {
    return;
  }

  const tabsContainer = pricingRoot.querySelector('[data-pricing-mobile-tabs]');
  const panelContainer = pricingRoot.querySelector('[data-pricing-mobile-panels]');
  if (!tabsContainer || !panelContainer) {
    return;
  }

  const allPlans = [
    { key: 'acadmy', label: 'Acadmy $7' },
    { key: 'core', label: 'Core $15' },
    { key: 'builder', label: 'Builder $25' },
    { key: 'devops', label: 'Ops $60' },
  ];

  let activePlan = 'acadmy';

  const setActivePanel = () => {
    const panels = panelContainer.querySelectorAll('[data-plan]');
    panels.forEach((panel) => {
      panel.hidden = panel.getAttribute('data-plan') !== activePlan;
    });
  };

  const renderTabs = () => {
    const inactivePlans = allPlans.filter((plan) => plan.key !== activePlan);
    tabsContainer.innerHTML = inactivePlans
      .map(
        (plan) =>
          `<button type="button" data-plan-button="${plan.key}" class="shrink-0 rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white not-focus-visible:focus:outline-none">${plan.label}</button>`
      )
      .join('');

    tabsContainer.querySelectorAll('[data-plan-button]').forEach((button) => {
      button.addEventListener('click', () => {
        activePlan = button.getAttribute('data-plan-button') || 'acadmy';
        setActivePanel();
        renderTabs();
      });
    });
  };

  setActivePanel();
  renderTabs();
}

function initLanguageDropdown() {
  function updateAllButtons(flag, label) {
    document.querySelectorAll('button[popovertarget]').forEach((btn) => {
      btn.querySelectorAll('[data-lang-flag]').forEach(el => { el.textContent = flag; });
      btn.querySelectorAll('[data-lang-label]').forEach(el => { el.textContent = label; });
    });
  }

  document.querySelectorAll('.lang-option').forEach((item) => {
    if (item.dataset.langBound === 'true') return;
    item.dataset.langBound = 'true';
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const flag = item.getAttribute('data-lang-flag');
      const label = item.getAttribute('data-lang-label');
      const lang = item.getAttribute('data-lang-select');
      if (flag && label && lang) {
        localStorage.setItem('lang', lang);
        updateAllButtons(flag, label);
      }
    });
  });

  const savedLang = localStorage.getItem('lang') || 'en';
  const options = document.querySelectorAll('.lang-option[data-lang-select]');
  for (const opt of options) {
    if (opt.getAttribute('data-lang-select') === savedLang) {
      updateAllButtons(opt.getAttribute('data-lang-flag'), opt.getAttribute('data-lang-label'));
      break;
    }
  }
}

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  document.querySelectorAll('#themeToggle').forEach((button) => {
    button.setAttribute('aria-pressed', String(isDark));
  });
}

function initMobileMenu() {
  const nav = document.querySelector('[data-mobile-nav]');
  if (!nav) {
    return;
  }

  const toggleButton = nav.querySelector('[data-mobile-menu-toggle]');
  const menu = nav.querySelector('[data-mobile-menu]');
  if (!toggleButton || !menu) {
    return;
  }

  if (toggleButton.dataset.bound === 'true') {
    return;
  }

  const openIcon = toggleButton.querySelector('[data-menu-icon="open"]');
  const closeIcon = toggleButton.querySelector('[data-menu-icon="close"]');

  const setMenuState = (isOpen) => {
    menu.classList.toggle('hidden', !isOpen);
    toggleButton.setAttribute('aria-expanded', String(isOpen));
    if (openIcon) {
      openIcon.style.display = isOpen ? 'none' : '';
    }
    if (closeIcon) {
      closeIcon.style.display = isOpen ? '' : 'none';
    }
  };

  toggleButton.dataset.bound = 'true';

  const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';
  setMenuState(isOpen);

  toggleButton.addEventListener('click', () => {
    const isCurrentlyOpen = toggleButton.getAttribute('aria-expanded') === 'true';
    setMenuState(!isCurrentlyOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      setMenuState(false);
    }
  });
}

function initProductsDropdown() {
  document.querySelectorAll('[data-dropdown]').forEach((wrapper) => {
    const button = wrapper.querySelector('[data-dropdown-toggle]');
    const menuId = button?.getAttribute('data-dropdown-toggle');
    const menu = menuId ? document.getElementById(menuId) : null;
    if (!button || !menu || button.dataset.bound === 'true') {
      return;
    }

    button.dataset.bound = 'true';

    const closeMenu = () => {
      menu.classList.add('hidden');
      button.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = (event) => {
      event.stopPropagation();
      const isHidden = menu.classList.contains('hidden');
      document.querySelectorAll('[data-dropdown]').forEach((w) => {
        const mId = w.querySelector('[data-dropdown-toggle]')?.getAttribute('data-dropdown-toggle');
        const m = mId ? document.getElementById(mId) : null;
        if (m) m.classList.add('hidden');
        const b = w.querySelector('[data-dropdown-toggle]');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (isHidden) {
        menu.classList.remove('hidden');
        button.setAttribute('aria-expanded', 'true');
      } else {
        closeMenu();
      }
    };

    button.addEventListener('click', toggleMenu);

    document.addEventListener('click', (event) => {
      if (!wrapper.contains(event.target)) {
        closeMenu();
      }
    });

    menu.querySelectorAll('a').forEach((item) => {
      item.addEventListener('click', closeMenu);
    });
  });
}

function initThemeToggle() {
  const storedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  document.querySelectorAll('#themeToggle').forEach((button) => {
    if (button.dataset.bound === 'true') {
      return;
    }

    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      setTheme(isDark ? 'light' : 'dark');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPricingMobileTabs();
  initLanguageDropdown();
  initProductsDropdown();
  initThemeToggle();
  initMobileMenu();
});

document.addEventListener('includes:loaded', () => {
  initPricingMobileTabs();
  initLanguageDropdown();
  initProductsDropdown();
  initThemeToggle();
  initMobileMenu();
});
