# TMRW Crew contributor notes

- Static HTML, CSS and vanilla JavaScript. No frontend framework, package manager,
  server code, or build step. Keep changes small and preserve content/design.
- Serve the root with `python3 -m http.server 8000 --bind 127.0.0.1`.
  News, Archive and Portfolio fetch JSON and require HTTP rather than file URLs.
- `data/events.json` is the single event source. `events.js` validates/groups records
  and renders cards; `news.js` and `archive.js` initialise the respective pages.
- `data/media.json` holds Portfolio media. `media.js` validates media/embedded URLs;
  `portfolio.js` renders filters, sections, slideshow and the native video dialog.
  Videos load only after activation; remove iframe contents when the dialog closes.
- `tmrw.js` owns workshop slideshow controls and the shared back-to-top button.
  Scripts use `defer`; do not add duplicate script tags or duplicate click handlers.
- Do not infer missing event dates or invent content. Existing conflicts are retained
  in public notes. See README.md for schemas, date rules and archive semantics.
- `tmrw.css` is the shared stylesheet, with numbered sections and scoped additions.
  Reuse existing card classes and design tokens rather than redesigning the site.
- Team cards use `.member-card.flag-<country>`, `.member-profile`, `.member-info`,
  `.member-name`, `.member-role`, and `.social-links`.
- Keep original `media/`, `events/`, `tmrw crew/`, `flags/`, and `fonts/` assets.
  Compressed WebP derivatives are in `optimized/`; regenerate with
  `python3 scripts/optimise-images.py` (Pillow needed only for regeneration).
  Preserve SEO verification, canonical, Open Graph and Twitter metadata.
- `node --test tests/*.test.cjs` runs dependency-free data/date/URL checks.
  Also check desktop/mobile browsers, keyboard operation, empty/error/no-JS states,
  local asset requests and the existing contact form. Do not submit the real form
  or assert successful delivery without deployment evidence.
