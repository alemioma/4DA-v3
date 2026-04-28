(function() {
  'use strict';

  const devNav = {
    searchOpen: false,
    currentPage: 'introduction',
    sidebarOpen: false,

    init() {
      this.cacheElements();
      this.bindEvents();
      this.initScrollSpy();
    },

    cacheElements() {
      this.sidebar = document.querySelector('[data-dev-sidebar]');
      this.sidebarToggle = document.querySelector('[data-dev-sidebar-toggle]');
      this.sidebarOverlay = document.querySelector('[data-dev-sidebar-overlay]');
      this.searchBtn = document.querySelector('[data-dev-search-toggle]');
      this.searchOverlay = document.querySelector('[data-dev-search-overlay]');
      this.searchDialog = document.querySelector('[data-dev-search-dialog]');
      this.searchInput = document.querySelector('[data-dev-search-input]');
      this.searchResults = document.querySelector('[data-dev-search-results]');
      this.navLinks = document.querySelectorAll('[data-dev-nav-link]');
    },

    bindEvents() {
      if (this.sidebarToggle) {
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
      }

      if (this.sidebarOverlay) {
        this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
      }

      if (this.searchBtn) {
        this.searchBtn.addEventListener('click', () => this.openSearch());
      }

      if (this.searchOverlay) {
        this.searchOverlay.addEventListener('click', () => this.closeSearch());
      }

      if (this.searchInput) {
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') this.closeSearch();
        });
      }

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.toggleSearch();
        }
      });

      this.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          this.setActivePage(link.dataset.page);
          this.closeSidebar();
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.searchOpen) {
          this.closeSearch();
        }
        if (e.key === 'Escape' && this.sidebarOpen) {
          this.closeSidebar();
        }
      });

      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
          this.closeSidebar();
        }
      });
    },

    toggleSearch() {
      if (this.searchOpen) {
        this.closeSearch();
      } else {
        this.openSearch();
      }
    },

    toggleSidebar() {
      if (this.sidebarOpen) {
        this.closeSidebar();
      } else {
        this.openSidebar();
      }
    },

    openSidebar() {
      this.sidebarOpen = true;
      if (this.sidebar) {
        this.sidebar.classList.add('open');
      }
      if (this.sidebarOverlay) {
        this.sidebarOverlay.classList.add('open');
      }
      if (this.sidebarToggle) {
        this.sidebarToggle.setAttribute('aria-expanded', 'true');
        const openIcon = this.sidebarToggle.querySelector('.dev-sidebar-toggle-icon-open');
        const closeIcon = this.sidebarToggle.querySelector('.dev-sidebar-toggle-icon-close');
        if (openIcon) openIcon.style.display = 'none';
        if (closeIcon) closeIcon.style.display = '';
      }
    },

    closeSidebar() {
      this.sidebarOpen = false;
      if (this.sidebar) {
        this.sidebar.classList.remove('open');
      }
      if (this.sidebarOverlay) {
        this.sidebarOverlay.classList.remove('open');
      }
      if (this.sidebarToggle) {
        this.sidebarToggle.setAttribute('aria-expanded', 'false');
        const openIcon = this.sidebarToggle.querySelector('.dev-sidebar-toggle-icon-open');
        const closeIcon = this.sidebarToggle.querySelector('.dev-sidebar-toggle-icon-close');
        if (openIcon) openIcon.style.display = '';
        if (closeIcon) closeIcon.style.display = 'none';
      }
    },

    openSearch() {
      this.searchOpen = true;
      if (this.searchOverlay) {
        this.searchOverlay.classList.add('open');
      }
      if (this.searchDialog) {
        this.searchDialog.style.display = 'block';
      }
      if (this.searchInput) {
        setTimeout(() => this.searchInput.focus(), 100);
      }
    },

    closeSearch() {
      this.searchOpen = false;
      if (this.searchOverlay) {
        this.searchOverlay.classList.remove('open');
      }
      if (this.searchDialog) {
        this.searchDialog.style.display = 'none';
      }
      if (this.searchInput) {
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
      }
    },

    handleSearch(query) {
      if (!query.trim()) {
        this.searchResults.innerHTML = '';
        return;
      }

      const q = query.toLowerCase();
      const results = this.searchPages.filter(page =>
        page.title.toLowerCase().includes(q) ||
        page.content.toLowerCase().includes(q)
      ).slice(0, 8);

      if (results.length === 0) {
        this.searchResults.innerHTML = `
          <div style="padding: 1.5rem; text-align: center; color: rgb(113 113 122);">
            <p>No results found for "${query}"</p>
          </div>
        `;
        return;
      }

      this.searchResults.innerHTML = results.map((result, i) => `
        <a href="#${result.id}" class="dev-search-result${i === 0 ? ' selected' : ''}" data-search-result>
          <div class="dev-search-result-title">${this.highlightMatch(result.title, query)}</div>
          <div class="dev-search-result-path">${result.section}</div>
        </a>
      `).join('');

      this.searchResults.querySelectorAll('[data-search-result]').forEach(result => {
        result.addEventListener('click', () => this.closeSearch());
      });
    },

    highlightMatch(text, query) {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark style="background: transparent; color: rgb(16 185 129); font-weight: 600;">$1</mark>');
    },

    setActivePage(pageId) {
      this.currentPage = pageId;
      this.navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
      });
    },

    initScrollSpy() {
      const sections = document.querySelectorAll('.dev-content-inner section[id], .dev-content-inner [id]');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const pageId = entry.target.id;
            if (this.navLinks.some(link => link.dataset.page === pageId)) {
              this.setActivePage(pageId);
              history.replaceState(null, '', `#${pageId}`);
            }
          }
        });
      }, {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      });

      sections.forEach(section => {
        if (section.id) {
          observer.observe(section);
        }
      });
    },

    searchPages: [
      { id: 'introduction', title: 'Introduction', section: 'Guides', content: 'Use the 4DA API to access contacts, conversations, group messages' },
      { id: 'maya', title: 'Maya', section: 'Guides', content: 'With Maya you can create solutions deploy operational logic access Service Point capabilities' },
      { id: 'tdpnet', title: 'TDPNet', section: 'Guides', content: 'TDPNet separates infrastructure from final value bridges edges routing service points' },
      { id: 'pricing', title: 'Pricing', section: 'Guides', content: 'Pricing plans Acadmy Core Builder DevOps comparison features' },
      { id: 'quickstart', title: 'Quickstart', section: 'Guides', content: 'Get set up and ready to use the 4DA API make your first request' },
      { id: 'sdks', title: 'SDKs', section: 'Guides', content: 'First-party SDKs JavaScript TypeScript Python PHP installation' },
      { id: 'authentication', title: 'Authentication', section: 'Guides', content: 'API keys authenticate requests bearer token live test keys' },
      { id: 'pagination', title: 'Pagination', section: 'Guides', content: 'Cursor-based pagination limit cursor parameters' },
      { id: 'errors', title: 'Errors', section: 'Guides', content: 'HTTP status codes error response format 400 401 403 404 429 500' },
      { id: 'webhooks', title: 'Webhooks', section: 'Guides', content: 'Real-time notifications event types signature verification' },
      { id: 'contacts', title: 'Contacts', section: 'Resources', content: 'Contact object create list retrieve update delete' },
      { id: 'conversations', title: 'Conversations', section: 'Resources', content: 'Conversation object thread communication create list update' },
      { id: 'messages', title: 'Messages', section: 'Resources', content: 'Message object send list retrieve within conversation' },
      { id: 'groups', title: 'Groups', section: 'Resources', content: 'Group object collection contacts create list update delete' },
      { id: 'attachments', title: 'Attachments', section: 'Resources', content: 'Attachment object file upload retrieve delete' },
    ]
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => devNav.init());
  } else {
    devNav.init();
  }

  document.addEventListener('includes:loaded', () => {
    devNav.init();
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && devNav.navLinks.some(link => link.dataset.page === hash)) {
      devNav.setActivePage(hash);
    }
  });

  if (window.location.hash) {
    const hash = window.location.hash.slice(1);
    if (hash && devNav.navLinks.some(link => link.dataset.page === hash)) {
      devNav.setActivePage(hash);
    }
  }
})();
