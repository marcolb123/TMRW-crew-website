# TMRW Crew Website

This repository contains the official website for **TMRW Crew**, a Scottish-based street dance collective.  
The site showcases our story, team members, media portfolio, and connects the community to our work.

---

## 🌟 Features

- **Home / About**: Origins of TMRW Crew, mission, and story:contentReference[oaicite:4]{index=4}.
- **Team Page**: Profiles and biographies of members with photos, social links, and country flag themes:contentReference[oaicite:5]{index=5}.
- **Portfolio**: Media gallery including videos (embedded from Google Drive) and photo slideshows:contentReference[oaicite:6]{index=6}.
- **Responsive Design**: CSS styled with custom fonts (Bauhaus 93, Impact, Tw Cen MT) and responsive layout for mobile and desktop:contentReference[oaicite:7]{index=7}.
- **SEO Optimised**: Meta tags for Google, Bing, Twitter, and Open Graph previews:contentReference[oaicite:8]{index=8}.
- **Social Integration**: Links to crew and individual Instagram accounts.

---

## 📂 Project Structure

- `index.html` → About page with crew history and mission  
- `team.html` → Member biographies, social links, and footer contact section  
- `Portfolio.html` → Media gallery with videos & slideshow photos  
- `tmrw.css` → Stylesheet (layout, typography, responsiveness, member cards, nav, footer)  
- `media/` → Images, photos, and thumbnails  
- `tmrw crew/` → Logos and crew images  
- `flags/` → Country flag backgrounds for member cards

---


## Maintaining News and Events

News cards come from **`data/events.json`**, not repeated HTML. Serve the repository
with `python3 -m http.server 8000 --bind 127.0.0.1`; opening the HTML as a local file
will not reliably allow JSON loading. No installation or build is required.

To add a record, copy an existing JSON object and give it a unique lowercase,
hyphenated `id`. Keep all array fields (empty arrays are fine). Supported categories
are `performance`, `battle`, `workshop`, `class`, and `announcement`.

- `title`, `location`, `description` (paragraph array), `cover` (`src` and `alt`),
  and `links` (`label` and `url`) supply the card content. Text is rendered safely,
  without HTML. `schedule` is an array of human-readable schedule lines.
- `date` and optional `endDate` are verified `YYYY-MM-DD` dates, or `null` when
  unknown. Upcoming includes today and events through their end date, using
  Europe/London. Earlier events appear in Past Events, newest first. This says
  nothing about whether a past event actually took place.
- `recurring: true` keeps classes in Regular Classes until a known `endDate` has
  passed. Do not invent dates for a weekly schedule. `scheduleNote` and `dateNote`
  surface uncertainty. Existing schedules have not been independently reconfirmed.
- Undated one-off events appear under Dates to Confirm. Announcements stay separate.
- `gallery`, `youtube`, `instagram`, and `participants` are string arrays reserved
  for shared archive/media use; there is no separate archive copy of an event.
- `#event-<id>` links directly to a rendered card. Existing News section links and
  the workshop gallery remain supported. Commented-out events were not republished.

The migrated records retain conflicting source dates in notes rather than choosing
one. Crossroads, Marco/Lisa, Three60, Popping/Locking and Ursula need organiser
confirmation. No new event information has been supplied.

Run dependency-free data/date checks with `node --test tests/events.test.cjs`
(Node is only needed for these optional developer tests). Check News in a browser
at desktop/mobile widths, including JSON failure and JavaScript-disabled states.

### Event archive

`archive.html` reads the same event records and shared card renderer as News.
Past dates and an explicitly verified `"status": "completed"` place records in
its category-filtered archive. Optional status values are `scheduled`, `completed`,
and `cancelled`; date sorting alone never asserts that an event actually happened.
An undated recurring class can be explicitly completed to archive it. A cancelled
future event remains in its date section with a visible cancelled label.

Archive cards additionally display the existing record's gallery, YouTube and
Instagram links, and participants. No third-party embeds load automatically.
Use `archive.html#event-<id>` for direct event links. Until uncertain source dates
are confirmed or completion is verified, the archive correctly has no entries.

### Maintaining Portfolio media

`data/media.json` contains the original three Google Drive videos and five
slideshow photos. Each record has a unique `id`, `title`, `type` (`photo` or
`video`), `provider` (`local`, `google-drive`, `youtube`, or `instagram`), `url`,
optional `thumbnail`, `featured` boolean, optional `category` (`performance`,
`battle`, `workshop`), and optional `eventId` referencing `events.json`.

Set `featured: true` only for work you choose to feature. Set categories only when
verified. No categories, featured selections, YouTube URLs, or Instagram video
URLs were invented for the original media. The corresponding sections remain
empty until content is supplied. Event-linked media inherits its event category
when no media category is specified, and its event link leads to News or Archive
according to the event's dates/status. Unknown event IDs do not create broken links.

The page supports format/category filtering and keeps the photography slideshow.
Google Drive and YouTube players load only on pressing Play. YouTube uses the
privacy-enhanced player host. Instagram videos remain ordinary external links,
with no embed script loaded. Closing the native video dialog (including Escape)
unloads playback and restores keyboard focus. Original external video links remain
available alongside Play buttons. External playback still depends on provider
availability, permissions, and browser/network policy.

Run `node --test tests/*.test.cjs` for all dependency-free data and URL tests.

### Image performance and site checks

Pages use 51 WebP derivatives in `optimized/` (4.3 MB total versus 44.4 MB for
their original assets). Originals remain in place; Portfolio photography links
open the original full-size images. These figures measure the asset set, not a
whole-page network benchmark. Images reserve intrinsic dimensions where known,
non-header images load lazily, and fonts use `font-display: swap`.

To regenerate derivatives after replacing original images, run
`python3 scripts/optimise-images.py` with Pillow available in your development
environment. It keeps orientation, limits dimensions to 1600 × 1600, and writes
WebP at quality 88 without altering originals. Update data/HTML width and height
attributes if the new source aspect ratio changes. The deployed site needs only
committed static files, without Python, Pillow or Node.

Site checks cover local asset paths, navigation consistency, duplicate script
inclusion, page headings, data, dates and video URL handling. Browser validation
also covers 320 px, 375 px and desktop layouts, loaded images and their declared
sizes, keyboard skip links, reduced motion, slideshow controls, dialog Escape/focus,
JSON failure and JavaScript-disabled messages. The existing Netlify contact form
is preserved; its declared honeypot now has a matching hidden input. Form delivery
and third-party video playback need deployment/provider checks and have not been
asserted from the local static server.
