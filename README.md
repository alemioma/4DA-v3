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
├── .agents/                  # Agent skills and configuration
│   └── skills/               # Specialized environment instructions
├── css/                      # Compiled CSS output (styles.css)
├── developers/               # Developer documentation section
│   ├── css/
│   │   └── style.css         # Developer docs specific styles
│   ├── js/
│   │   └── app.js            # Developer docs JS (sidebar, search, scroll-spy)
│   └── sections/             # HTML partials for developer docs
│       ├── sidebar.html      # Developer sidebar navigation
│       ├── content.html      # Full developer documentation content
│       └── search-bar.html   # Developer search bar component
├── dist/                     # Production build output
├── img/                      # Image assets
├── js/                       # Application JavaScript (minified)
│   └── app.js
├── protocol-js/              # Protocol/technical JS files
├── scripts/                  # Utility scripts
│   ├── include.js            # HTML include handler (injects partials)
│   └── main.js               # Main site JS:
│                             #   - initMobileMenu()
│                             #   - initLanguageDropdown()
│                             #   - initProductsDropdown()
│                             #   - initThemeToggle() / setTheme()
│                             #   - initPricingMobileTabs()
├── sections/                 # HTML partials included in pages
│   ├── navbar.html           # Navigation bar (desktop + mobile menu)
│   ├── hero-index1.html      # Hero section (video card + 4 links grid)
│   ├── hero.html             # Alternate hero section
│   ├── solutions.html        # Solutions cards section (3 cards + description)
│   ├── growth.html           # Growth section
│   ├── pricing.html          # Pricing section
│   ├── latest.html           # Latest news/updates section
│   ├── cta.html              # Call-to-action section
│   ├── footer.html           # Footer section
│   └── dev-header.html       # Developer header component
├── styles/
│   └── main.css              # Tailwind v4 entry, custom CSS, dark-theme overrides
├── index.html                # Main landing page
├── index2.html               # Developer documentation page
├── 404.html                  # 404 error page
├── favicon.ico               # Favicon
├── icon.png / icon.svg       # App icons
├── site.webmanifest          # PWA manifest
├── robots.txt                # Robots directive
├── LICENSE.txt               # License file
├── webpack.common.js         # Shared Webpack config
├── webpack.config.dev.js     # Development config
├── webpack.config.prod.js    # Production config
└── package.json
```

## Pages and Their Sections

### index.html (Main Landing Page)
Composed of these partials loaded in order:
```
sections/navbar.html        → Navigation bar
sections/hero-index1.html   → Hero with video card + 4 feature links
sections/solutions.html     → "The Challenge" section with 3 cards
sections/growth.html        → Growth section
sections/pricing.html       → Pricing section
sections/latest.html        → Latest updates section
sections/cta.html           → Call-to-action section
sections/footer.html        → Footer
```

### index2.html (Developer Documentation)
Composed of these partials:
```
sections/navbar.html                 → Shared navigation bar
developers/sections/sidebar.html     → Documentation sidebar (navigation)
developers/sections/search-bar.html  → Search bar component
developers/sections/content.html     → Full documentation content including:
                                       - Introduction / Why Maya
                                       - Maya capabilities
                                       - TDPNet explanation
                                       - Pricing table
                                       - Quickstart guide
                                       - SDKs (JS, Python, PHP)
                                       - Authentication
                                       - Pagination
                                       - Errors
                                       - Webhooks
                                       - Resources (Contacts, Conversations, Messages, Groups, Attachments)
```

## How the Site Works

### HTML Includes
Pages use `<div data-include="path/to/partial.html">` attributes. The `scripts/include.js` script fetches and injects these HTML partials at runtime.

### Dark Mode
- Toggled via `#themeToggle` button in navbar
- Applies `.dark-theme` class to `<body>`
- All dark-mode styles are in `styles/main.css` under `body.dark-theme` selectors
- **Do not use** Tailwind's `dark:` utility — the project uses manual `.dark-theme` overrides

### Navbar
- `sections/navbar.html` contains both desktop and mobile menu
- Mobile menu: `[data-mobile-menu-toggle]` button toggles `[data-mobile-menu]`
- Language dropdown: `[data-lang-dropdown]` wrapper
- Products & Solutions dropdown: `[data-dropdown]` wrapper + `[data-dropdown-toggle="id"]`
- Logo 4DA is a link to home (`href="/"`)

### Build System
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- Sources configured in `styles/main.css`:
  - `sections/*.html`
  - `*.html`
  - `scripts/*.js`
  - `developers/**/*.html`
- Webpack copies `sections/` and `scripts/` into `dist/` for production

## Continuing Work

1. Edit files in `sections/` for content/layout changes on the main page
2. Edit `developers/sections/` for documentation changes
3. Edit `styles/main.css` for styling (follow `body.dark-theme` pattern)
4. Edit `scripts/main.js` for interactivity (menus, dropdowns, theme toggle)
5. Run `pnpm start` for live preview, then `pnpm run build` when done

## Git

```bash
git remote add origin https://github.com/alemioma/4DA-v3.git
git branch -M main
git add . && git commit -m "message"
git push -u origin main
```
