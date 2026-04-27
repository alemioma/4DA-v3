# AI Agent Instructions — 4DA Website

## Project Overview
Static website for 4DA built with HTML, Tailwind CSS v4, and Webpack. Uses runtime HTML includes via `scripts/include.js`.

## AI Agent Skills
Specialized skills are in `.agents/skills/` at the project root. Reference these for domain-specific guidance:
- `tailwindcss-development/` — Tailwind CSS patterns
- `pest-testing/` — Pest PHP testing
- `stripe-*` — Stripe integration patterns

## Global Conventions

### Theme (Light / Dark)
- **Do NOT use** Tailwind's `dark:` prefix classes
- Dark mode uses `body.dark-theme` class applied by `scripts/main.js`
- All dark styles go in `styles/main.css` under `body.dark-theme` selectors
- Theme preference persists in `localStorage`
- Every page (including `pages/`) must support `.dark-theme`

### Responsive Design
- Mobile-first: design for mobile, enhance for tablet (`md:`) and desktop (`lg:`)
- Navbar collapses to hamburger on mobile (`md:hidden` / `md:flex`)
- Grids use responsive breakpoints
- Test on 320px, 768px, and 1024+ viewports

### Routes
- All sub-pages live in `pages/`
- Use absolute paths: `/pages/name.html` (never relative `pages/name.html`)
- Centralized in `config/routes.js` and `scripts/routes.js`
- Sub-pages share the same navbar and footer as index

### HTML Includes
- Partials in `sections/` are loaded via `<div data-include="/sections/file.html">`
- All include paths must be absolute (start with `/`)

---

## Section Prompts

### sections/navbar.html
> Navigation bar shared across ALL pages. Contains:
> - Desktop nav links (Technology, TDPnet, Products & Solutions dropdown, About us)
> - Contact button (links to `/pages/contact.html`)
> - Language dropdown with el-popover (UK flag default)
> - Theme toggle (sun/moon)
> - Mobile hamburger menu with full vertical navigation
> - Logo links to `/`
> When editing: keep both desktop and mobile versions in sync. All hrefs must be absolute paths.

### sections/hero-index1.html
> Hero section for the landing page. Contains video card + 4 feature link cards in a grid.
> Responsive: single column on mobile, 2-column on tablet+.

### sections/solutions.html
> "The Challenge" section with 3 solution cards. Grid layout responsive.

### sections/growth.html
> Growth/metrics section. Full-width with gradient background.

### sections/pricing.html
> "Internally Developed Technology" section. Title + paragraph only (no pricing table).
> Background: radial gradient matching dark theme.

### sections/latest.html
> "4DA Global Holding" section. Title + two paragraphs.
> Background: darker radial gradient than pricing section.

### sections/cta.html
> Call-to-action section with button. Gradient background.

### sections/footer.html
> Shared footer with company links, social icons, legal links.
> Background: `bg-zinc-950`. Dark theme compatible.

### pages/contact.html
> Fully functional contact page with:
> - 4 info cards (Email, Phone, Address, Business Hours)
> - Contact form (name, email, subject, message) → posts to `https://4da.se/contact-handler.php`
> - Clickable email links (`mailto:`) and phone links (`tel:`)
> - Uses semantic CSS classes with `body.dark-theme` overrides in `styles/main.css`
> - Two-column layout on desktop, single column on mobile

### pages/*.html (maintenance pages)
> technology.html, tdpnet.html, products.html, about.html
> Each shows: wrench icon + "Page under maintenance" + "Back to home" link
> Must support dark theme via CSS classes with body.dark-theme overrides in styles/main.css

### developers/
> Developer documentation section. Has its own sidebar, search, and content system.
> Uses separate CSS (`developers/css/style.css`) and JS (`developers/js/app.js`).
> Dark theme uses `body.dark-theme` selectors in `developers/css/style.css`.

### styles/main.css
> Main stylesheet. Tailwind v4 entry point + custom styles + ALL `body.dark-theme` overrides.
> When adding dark mode for any new component, add its `body.dark-theme` rules here.

### scripts/main.js
> Main JavaScript. Handles: mobile menu, product dropdown, language dropdown, theme toggle, pricing tabs.
> Theme toggle adds/removes `.dark-theme` class on `<body>`.

### tests/
> Test suite at `/tests/index.html`. Tests routes, navbar links, includes, and page content.
> Run via dev server. Auto-executes on load.
