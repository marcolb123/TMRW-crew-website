<!-- .github/copilot-instructions.md
This file guides AI coding agents so they can be immediately productive in this repo.
Keep it concise and concrete — reference real files and patterns found in this project.
-->

# TMRW Crew — AI contributor notes

Quick summary
- Static, single-page / multi-HTML website (pure HTML + CSS, light JS). No build system or server code.
- Primary files: `index.html`, `team.html`, `Portfolio.html`, `tmrw.css`. `tmrw.js` currently empty; small inline scripts live in `Portfolio.html`.

How to preview (Windows / PowerShell)
- Open pages directly in a browser (no build step required):
  - PowerShell: run `ii .\index.html` or `Invoke-Item .\index.html` from the repository root.

Big-picture architecture & rationale
- Design is static and asset-driven: content is authored directly in HTML files and styled with a single CSS file `tmrw.css`.
- Images and media live in `media/`, `flags/`, and the `tmrw crew/` folders. Fonts are self-hosted in `fonts/`.
- Videos are embedded via Google Drive file IDs in `Portfolio.html` (function `openVideo(fileId)` sets an iframe src to `https://drive.google.com/file/d/<id>/preview`).

Project-specific conventions and patterns (concrete)
- CSS is organized with numbered comment sections in `tmrw.css` (e.g. "1) Root design tokens", "7) Member card"). When adding styles, put them in the appropriate numbered region and keep the comment pattern.
- Design tokens: colors and accents live in `:root` of `tmrw.css`. Prefer those vars when changing colors.
- Member blocks (team members) follow this HTML structure in `team.html`:
  - A `div.member-card` wrapper with a country flag class like `flag-philippines`.
  - Inside: `div.member-profile > img.member-image` and `div.member-info` containing `h3.member-name`, `div.member-role`, and `.social-links`.
  - Example file: `team.html` — add new members by copying an existing `member-card` block and updating image paths and text.
- Flag backgrounds: CSS maps classes `flag-<country>` to background images via `::before` in `tmrw.css`. To add a new flag, put the image into `flags/` and add a `.flag-xxx::before { background-image: url('flags/xxx.jpg'); }` rule.
- Asset paths contain spaces (e.g., `tmrw crew/instagram logo.png`). Prefer replacing spaces with hyphens/underscores when adding new assets; if you must use spaces, use forward slashes in HTML (`tmrw crew/photo.jpg`) — browsers tolerate them but keep URLs consistent.
- JS placement: small page scripts are inline in `Portfolio.html` (slideshow and `openVideo`). `tmrw.js` exists but is empty; if moving inline functions to `tmrw.js`, update all `onclick` attributes accordingly or replace them with event listeners. Be careful: current HTML uses inline `onclick="openVideo('<id>')"` anchors that return false to prevent navigation (see `Notepad++/Understanding my JS code.txt`).

Integration points & external dependencies
- Google Drive: video preview via file IDs (no API key required for the current preview iframe pattern). Keep the fileId list in `Portfolio.html`.
- Social links: Instagram only, implemented as simple anchor tags to external URLs (no API integrations).

Editing / change rules for automated agents
- Do not remove or rename the `fonts/`, `flags/`, or `media/` directories without checking references in HTML and `tmrw.css`.
- Preserve SEO meta tags in `index.html` (OpenGraph/Twitter/Bing meta tags) unless explicitly instructed to change site-wide metadata.
- Avoid large refactors: this is a small, static site — prefer minimal, backwards-compatible edits (add new member blocks, small CSS tweaks, fix broken image paths).

Examples (concrete edits you can perform)
- Add member: copy one `div.member-card` in `team.html`, update `class="member-card flag-<country>"`, set `img` src in `member-profile`, update `member-name` and `member-role` text, and add `.flag-<country>` rule in `tmrw.css` if needed.
- Add video: in `Portfolio.html` add a new thumbnail container and call `openVideo('<drive-file-id>')` — no extra JS required.
- Replace inline JS safely: move function `openVideo` from `Portfolio.html` into `tmrw.js`, then either keep the inline `onclick` handlers (they'll work if `tmrw.js` is included) or convert anchors to use `data-fileid` attributes and add an event listener in `tmrw.js`.

What not to do
- Don't assume a node/npm toolchain — there is none. Don't add one unless the user requests it.
- Don't automatically rename many files (especially those with spaces) — that can break links. If you do rename, update all references.

Where to find patterns / key files
- `index.html`, `team.html`, `Portfolio.html` — primary HTML content and examples of member blocks and media integrations
- `tmrw.css` — central stylesheet; follow its numbered comment sections and `:root` tokens
- `tmrw.js` — currently empty; used for future JS placement
- `flags/`, `media/`, `fonts/`, `tmrw crew/` — asset folders (images & fonts)
- `Notepad++/Understanding my JS code.txt` — explains why inline links use `return false;` after `onclick`

If anything is unclear or you want me to expand this to include automated tests or a small dev server, tell me which area to focus on (JS refactor, accessibility, or asset cleanup) and I will update this file.

-- End
