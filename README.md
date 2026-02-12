# Luma Life Website Demo

A segregated, maintainable version of the Luma Life website (lumalife.de). The original single-file HTML has been split into a clear folder structure for easier debugging and readability.

## Project Structure

```
flai-website-demo/
├── index.html              # Main HTML document
├── README.md               # This file
├── css/                    # Stylesheets (extracted from inline styles)
│   ├── base.css            # Reset, variables, layout utilities
│   ├── components.css      # Components (emoji, cards, promo box, social links)
│   ├── header.css          # Header/navigation styles
│   ├── intro-loading.css   # Page loading animation
│   ├── elementor.css       # Elementor-specific (lazyload, etc.)
│   └── inline-elements.css # Element-specific overrides
├── js/                     # JavaScript (extracted from inline scripts)
│   ├── init.js             # Page init (render class, pix-loaded)
│   └── lazyload.js         # Elementor background lazyload observer
├── partials/               # Reusable HTML partials (for reference)
│   └── main-sections.html  # Challenge/stats section markup
```

## How to Run

1. **With a local server** (recommended – required for external resources):
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   # or
   php -S localhost:8000
   ```
   Then open `http://localhost:8000` in your browser.

2. **Direct file open**:
   You can open `index.html` directly in a browser, but external assets (Bootstrap, Elementor CSS/JS, images) must load from lumalife.de, so an internet connection is required.

## Dependencies

- **External (loaded from lumalife.de)**:
  - Bootstrap CSS
  - Pixfort/Elementor theme styles
  - jQuery
  - Theme and Elementor JavaScript

- **Local**:
  - All extracted CSS in `css/`
  - All extracted JS in `js/`

## File Purposes

| File | Purpose |
|------|---------|
| `css/base.css` | CSS variables, reset, layout utilities |
| `css/components.css` | Emoji, recent posts, promo box, categories, social links |
| `css/header.css` | Header/nav CSS variables and styles |
| `css/intro-loading.css` | Page load overlay and transition |
| `css/elementor.css` | Lazyload background image behavior |
| `css/inline-elements.css` | Element-specific image/size overrides |
| `js/init.js` | Adds `render` and `pix-loaded` classes on DOMContentLoaded |
| `js/lazyload.js` | IntersectionObserver for Elementor background lazyload |

## Modifying Content

- **HTML**: Edit `index.html` for structure and content.
- **Styles**: Edit files in `css/`; keep base/layout in `base.css` and component styles in `components.css`.
- **Scripts**: Edit files in `js/`; add new scripts and reference them in `index.html`.

## Original Source

Based on the Luma Life website at https://lumalife.de/ – KI-gestützte Unterstützung für Menschen mit Demenz.
