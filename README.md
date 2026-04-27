# 4DA Website

Official website for 4DA, built with HTML, Tailwind CSS v4, and Webpack.

## Quick Start

```bash
pnpm install       # Install dependencies
pnpm start         # Start dev server with hot reload
pnpm run build     # Build for production (output to dist/)
pnpm run serve     # Serve production build locally
```

## Project Structure

```
4DA9/
├── .agents/                  # Agent skills and configuration for AI agents
│   └── skills/               # Specialized environment instructions
│       ├── tailwindcss-development/
│       ├── pest-testing/
│       ├── stripe-best-practices/
│       ├── cashier-stripe-development/
│       ├── inertia-react-development/
│       ├── wayfinder-development/
│       ├── stripe-projects/
│       └── upgrade-stripe/
├── config/                   # Application configuration
│   └── routes.js             # Centralized route definitions
├── css/                      # Compiled CSS output (styles.css)
├── developers/               # Developer documentation section
│   ├── css/
│   │   └── style.css         # Developer docs specific styles
│   ├── js/
│   │   └── app.js            # Developer docs JS (sidebar, search, scroll-spy)
│   └── sections/             # HTML partials for developer docs
├── dist/                     # Production build output
├── img/                      # Image assets
├── js/                       # Application JavaScript (minified)
├── pages/                    # Sub-pages (maintenance placeholders + contact)
│   ├── technology.html       # Technology page (under maintenance)
│   ├── tdpnet.html           # TDPnet page (under maintenance)
│   ├── products.html         # Products & Solutions page (under maintenance)
│   ├── about.html            # About us page (under maintenance)
│   └── contact.html          # Contact page (fully functional)
├── protocol-js/              # Protocol/technical JS files
├── scripts/                  # Utility scripts
│   ├── include.js            # HTML include handler (injects partials)
│   ├── main.js               # Main site JS:
│   │                         #   - initMobileMenu()
│   │                         #   - initLanguageDropdown()
│   │                         #   - initProductsDropdown()
│   │                         #   - initThemeToggle() / setTheme()
│   │                         #   - initPricingMobileTabs()
│   └── routes.js             # Client-side route navigation helpers
├── sections/                 # HTML partials included in pages
│   ├── navbar.html           # Navigation bar (desktop + mobile menu + language + theme)
│   ├── hero-index1.html      # Hero section (video card + 4 links grid)
│   ├── hero.html             # Alternate hero section
│   ├── solutions.html        # Solutions cards section (3 cards + description)
│   ├── growth.html           # Growth section
│   ├── pricing.html          # Pricing / Technology section
│   ├── latest.html           # Latest / Global Holding section
│   ├── cta.html              # Call-to-action section
│   ├── footer.html           # Footer section
│   └── dev-header.html       # Developer header component
├── styles/
│   └── main.css              # Tailwind v4 entry, custom CSS, .dark-theme global overrides
├── tests/                    # Test suite
│   ├── index.html            # Test dashboard (run all tests)
│   └── test.js               # Test logic (routes, links, includes, content)
├── index.html                # Main landing page
├── index2.html               # Developer documentation page
├── 404.html                  # 404 error page
├── webpack.common.js         # Shared Webpack config
├── webpack.config.dev.js     # Development config
├── webpack.config.prod.js    # Production config
└── package.json
```

## Pages and Their Sections

### index.html (Main Landing Page)
Composed of these partials loaded in order:
```
sections/navbar.html        → Navigation bar (desktop + mobile)
sections/hero-index1.html   → Hero with video card + 4 feature links
sections/solutions.html     → "The Challenge" section with 3 cards
sections/growth.html        → Growth section
sections/pricing.html       → Internally Developed Technology section
sections/latest.html        → 4DA Global Holding section
sections/cta.html           → Call-to-action section
sections/footer.html        → Footer
```

### Sub-pages (pages/)
All sub-pages share the same navbar and footer as the index page:

| Page | Path | Status |
|------|------|--------|
| Technology | `/pages/technology.html` | Under maintenance |
| TDPnet | `/pages/tdpnet.html` | Under maintenance |
| Products & Solutions | `/pages/products.html` | Under maintenance |
| About us | `/pages/about.html` | Under maintenance |
| Contact | `/pages/contact.html` | Fully functional (form + contact cards) |

### index2.html (Developer Documentation)
Composed of these partials:
```
sections/navbar.html                 → Shared navigation bar
developers/sections/sidebar.html     → Documentation sidebar (navigation)
developers/sections/search-bar.html  → Search bar component
developers/sections/content.html     → Full documentation content
```

## How the Site Works

### HTML Includes
Pages use `<div data-include="path/to/partial.html">` attributes. The `scripts/include.js` script fetches and injects these HTML partials at runtime. Paths are absolute (e.g., `/sections/navbar.html`) so they work from any subdirectory.

### Global Theme (Light / Dark)
- **Toggle**: `#themeToggle` button in navbar
- **Mechanism**: Applies `.dark-theme` class to `<body>`
- **All dark-mode styles** are in `styles/main.css` under `body.dark-theme` selectors
- **Important**: Do NOT use Tailwind's `dark:` utility classes — the project uses manual `.dark-theme` CSS overrides
- **Persistence**: Theme preference saved in `localStorage`
- **Scope**: Global — applies to all pages including sub-pages in `pages/`
- **Sub-pages** use semantic CSS classes (e.g., `contact-card`, `contact-input`) with corresponding `body.dark-theme` overrides in `styles/main.css`

### Responsive Design
The site is fully responsive for desktop, tablet, and mobile:

- **Navbar**: Desktop navigation collapses to hamburger menu on mobile (`md:hidden` / `md:flex`)
- **Mobile menu**: `[data-mobile-menu-toggle]` button toggles `[data-mobile-menu]` with animated icon swap
- **Grid layouts**: Use responsive breakpoints (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- **Pricing table**: Desktop `<table>` hides on mobile, replaced by tabbed card view (`data-pricing-mobile`)
- **Contact page**: Two-column layout stacks to single column on mobile (`lg:grid-cols-2`)
- **All sections** should use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) and test on multiple viewports

### Navbar
- `sections/navbar.html` contains both desktop and mobile menu
- **Desktop links**: Technology, TDPnet, Products & Solutions (dropdown), About us, Contact
- **Language dropdown**: `<el-popover>` from `@tailwindplus/elements` with UK flag (🇬🇧) default
- **Products dropdown**: `[data-dropdown]` wrapper + `[data-dropdown-toggle="id"]`
- **Theme toggle**: Sun/moon icon button
- **Mobile menu**: Full-width vertical menu with all links + theme + language

### Route System
Routes are centralized in:
- `config/routes.js` — Route definitions (Node.js compatible)
- `scripts/routes.js` — Client-side navigation helpers (`navigate()`, `getRoute()`)
- All navbar links use absolute paths (`/pages/...`) to work from any subdirectory

### Build System
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- Sources configured in `styles/main.css`:
  - `sections/*.html`
  - `*.html`
  - `scripts/*.js`
  - `developers/**/*.html`
- Webpack copies `sections/` and `scripts/` into `dist/` for production

### AI Agent Skills
Specialized skills for AI agents are located in `.agents/skills/` at the project root:
- `tailwindcss-development/` — Tailwind CSS patterns and conventions
- `pest-testing/` — Pest PHP testing patterns
- `stripe-best-practices/` — Stripe integration best practices
- `cashier-stripe-development/` — Laravel Cashier + Stripe patterns
- `inertia-react-development/` — Inertia.js + React patterns
- `wayfinder-development/` — Wayfinder routing patterns
- `stripe-projects/` — Stripe project configurations
- `upgrade-stripe/` — Stripe upgrade procedures

When working on this project, AI agents should reference these skills for domain-specific guidance.

### Test Suite
Run the test suite by opening `/tests/index.html` while the dev server is running:

| Test Category | What It Checks |
|---------------|----------------|
| **Route Validation** | Each defined route returns HTTP 200 |
| **Navbar Links** | All navbar links resolve to valid pages |
| **Include Sections** | `navbar.html` and `footer.html` are accessible; all pages reference them |
| **Page Content** | Maintenance pages contain expected text; contact page has form |

Tests auto-run on page load. A "Run All Tests" button re-executes them.

## Continuing Work

1. Edit files in `sections/` for content/layout changes on the main page
2. Edit `pages/` for sub-page content
3. Edit `developers/sections/` for documentation changes
4. Edit `styles/main.css` for styling (follow `body.dark-theme` pattern for dark mode)
5. Edit `scripts/main.js` for interactivity (menus, dropdowns, theme toggle)
6. Add new routes to `config/routes.js` and `scripts/routes.js`
7. Run `pnpm start` for live preview, then `pnpm run build` when done
8. Run tests at `/tests/index.html` to validate all routes and includes

## Git

```bash
git remote add origin https://github.com/alemioma/4DA-v3.git
git branch -M main
git add . && git commit -m "message"
git push -u origin main
```
