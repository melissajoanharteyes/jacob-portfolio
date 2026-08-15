# jacob perry — portfolio site

Built from the Figma file "Website" (`deUmbi5IOpAdw48rKsoSRe`). Plain HTML/CSS/JS, no build step — open `index.html` directly, or serve the folder with any static server.

## What's here

- `index.html` — homepage, matches the Figma hero exactly: orange header, bubble
  wordmark, hamburger nav, green content card with the pixel-art slider.
- `work.html`, `studio.html`, `about.html`, `contact.html` — placeholder pages,
  not in the Figma file yet, built to match the homepage's visual system so
  the nav is fully clickable. Each has a dashed "placeholder" note — delete
  that div once you've filled the page with real content.
- `css/style.css` — all design tokens (color, type, shadow, radius) live at
  the top of the file as CSS variables. Change a value once, it updates
  everywhere.
- `js/main.js` — hamburger drawer + slider logic. No dependencies.

## Two things to finish before this is production-ready

### 1. Swap in the real images

The 3 slider images (bar scene, bottles, coffee shop) are temporarily loading
from a Figma-hosted link that **expires about 7 days after this was built**.
To fix permanently:

1. In Figma, select each image layer and **Export → PNG**.
2. Save them into `assets/images/` using these exact filenames:
   - `pixel-bar.png`
   - `many-bottles.png`
   - `coffee-shop.png`
3. That's it — `index.html` already points at these paths first, and only
   falls back to the temporary Figma link if a file is missing.

### 2. Font

The Figma file specifies **"Alba Super,"** an old shareware font (2001,
Font•a•licious). It's now bundled at `assets/fonts/ALBAS___.TTF` and loaded
via `@font-face` in `css/style.css`, with Bubblegum Sans (Google Fonts) kept
as a fallback in `--font-display` in case the font file is ever missing.

## Deploying + connecting your Hover domain

1. Push this folder to a static host — Vercel, Netlify, or GitHub Pages all
   work with zero config for a plain HTML site.
2. Once it's live on the host's default subdomain, follow the DNS steps we
   already covered: add an **A record** (`@`) and a **CNAME record** (`www`)
   in Hover pointing at your host, using the exact values your host's
   "add custom domain" screen gives you.
3. SSL activates automatically once the domain verifies.

## Not yet in this build

- Real content for Work / Studio / About / Contact (case studies, galleries,
  bio, resume link) — these are the placeholder pages above.
- Analytics, SEO meta images, and a favicon.
