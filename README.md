# Flora — Florist Landing Page

A pixel-perfect, single-page florist landing reproduced strictly from a Figma
design. Pure **HTML + CSS + vanilla JavaScript** — no build step, no framework,
and nothing to `npm install`.

## Tech stack

- **HTML5** — semantic markup (landmarks, headings, lists, `figure`/`blockquote`)
- **CSS3** — Mobile-First, custom properties (design tokens in `:root`), Flexbox & Grid
- **Vanilla JavaScript** — burger menu + two carousels, **zero libraries**
- **modern-normalize** — loaded via CDN (no npm)
- **Fonts** — Hanuman + Roboto via Google Fonts
- **Design** — reproduced from a Figma macet

## Features

- **Responsive** — three breakpoints: mobile `375`, tablet `768`, desktop `1440`
  (Mobile-First cascade: base → `@media (min-width: 768px)` → `@media (min-width: 1440px)`)
- **Burger menu** — accessible toggle (`aria-expanded`, `Escape`, outside-click,
  reset on resize to desktop)
- **Sliders** — Bestsellers & Feedbacks carousels in vanilla JS: arrow buttons,
  dynamic pagination dots, keyboard (`←`/`→`), and horizontal touch-swipe
- **Accessibility** — ARIA roles/labels, keyboard support,
  `prefers-reduced-motion`, and a `@media (scripting: none)` no-JS fallback that
  keeps every card visible
- **Performance** — retina images (`srcset` 1×/2×), lazy-loading below the fold,
  explicit `width`/`height` to avoid layout shift
- **Icons** — inline SVG sprite, so `<use href="#icon-…">` renders even from `file://`
- **Standards** — W3C-valid HTML (Nu) and CSS (Jigsaw)

## Getting started

No build and no install — just open the page:

```bash
# macOS — open directly in the default browser
open index.html

# …or serve it with any static server, e.g.:
python3 -m http.server   # then visit http://localhost:8000
```

## Live demo

Open `index.html` directly, or deploy the `flora-project/` folder to any static
host (e.g. GitHub Pages — serve the folder as the site root).

## Project structure

```
flora-project/
├─ index.html        # markup + inline SVG sprite
├─ css/
│  └─ styles.css     # design tokens (:root) + Mobile-First styles
├─ js/
│  └─ main.js        # burger menu + sliders (vanilla)
├─ images/           # photos (x1/x2), logo, decor, favicons
└─ README.md
```

## Validation

- **HTML** — [validator.w3.org/nu](https://validator.w3.org/nu/) → 0 errors / 0 warnings
- **CSS** — [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/) → 0 errors
