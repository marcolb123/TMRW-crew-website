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
  Europe/London. Earlier events appear in the archive. News shows new additions first; Archive uses event dates, newest first, with unknown dates last. This says
  nothing about whether a past event actually took place.
- `recurring: true` keeps classes in Regular Classes until a known `endDate` has
  passed. Do not invent dates for a weekly schedule. `scheduleNote` and `dateNote`
  surface uncertainty. Existing schedules have not been independently reconfirmed.
- Use `archived: true` to place an event in the archive even when its date is unknown. Announcements stay separate.
- `gallery`, `youtube`, `instagram`, and `participants` are string arrays reserved
  for shared archive/media use; there is no separate archive copy of an event.
- `#event-<id>` links directly to a rendered card. The separate Workshop Gallery has been removed. Commented-out events were not republished.

Crossroads, Marco/Lisa and Three60 are confirmed completed and archived, without
booking links or date-confirmation notices. Exact machine-readable dates remain
blank where uncertain. Popping/Locking and Ursula retain their schedule review notes.

Run dependency-free data/date checks with `node --test tests/events.test.cjs`
(Node is only needed for these optional developer tests). Check News in a browser
at desktop/mobile widths, including JSON failure and JavaScript-disabled states.

### Event archive

`archive.html` reads the same event records and shared card renderer as News.
The archive is one collection showing previous crew events, ordered by event date
newest first. Unknown dates follow dated events; equal dates retain newest-addition
order. There are no category/media filters.

Use `"archived": true` to archive a record without inventing or confirming its
date. Crossroads, Marco/Lisa and Three60 have been moved there by request. Their
completion has since been confirmed and their booking links removed. Past dated events and explicitly completed
records also appear here. The four regular class listings remain on News.
Optional status values remain `scheduled`, `completed`, and `cancelled`.

Archive cards can display a record's gallery, YouTube and Instagram links, and
participants together. No third-party embeds load automatically. Use
`archive.html#event-<id>` for event links. The standalone Workshop Gallery and poster
have been removed; historical workshop event records remain in the event collection.

### Maintaining Portfolio media

`data/media.json` contains the original three Google Drive videos and five
slideshow photos. Each record has a unique `id`, `title`, `type` (`photo` or
`video`), `provider` (`local`, `google-drive`, `youtube`, or `instagram`), `url`,
optional `thumbnail`, and intrinsic `width`/`height` where known. Existing
`featured`, `category` and `eventId` metadata is retained for future editing,
but does not create any sections, filters or event links in the gallery.

The Media page contains only **Videos** and **Photos**, with newly appended items first. Videos
from all providers share the same section. There are no featured, event archive,
provider, performance, battle or workshop sections and no sorting controls.

YouTube videos automatically use the standard YouTube thumbnail when no custom
image is selected. Custom uploaded previews take precedence. Thumbnails load lazily;
if an image fails, the video title and Play button remain available.
Google Drive and YouTube players load only on pressing Play. YouTube uses the
privacy-enhanced player host. Instagram videos remain ordinary external links,
with no embed script loaded. Closing the native video dialog (including Escape)
unloads playback and restores keyboard focus. Photography keeps its slideshow
and links to full-size originals. It preloads the immediate neighbouring photos
and waits for decoding before replacing the visible image, retaining the current
photo during slow downloads. Rapid clicks always keep the latest selection.
The Media page fetches only its media data,
not the event collection.

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

### Admin editing without website accounts

A [Pages CMS](https://app.pagescms.org) configuration is included in `.pages.yml`.
It provides forms for events/classes, archived events, videos and photos, plus
image uploads. Use GitHub sign-in to edit; visitors need no accounts and the site
needs no database or new backend. See [the setup and editing guide](docs/ADMIN_EDITOR.md)
for the one-time app authorisation, branch/deployment settings, and daily workflow.

`published: false` hides an event or media item without deleting its JSON record.
An omitted Published property keeps existing content visible. Optional empty fields
may be omitted by the editor; the site normalises those saves. A photo's `url` may
be omitted when its uploaded `thumbnail` is also the desired original image.
New uploads are stored in `uploads/` and should be compressed before uploading.

### Page layouts

Headers, navigation and section spacing are compact. Desktop pages use a wider
content area: the story flows into two columns, Team and Archive use two-column
layouts on large screens, and Videos/Photos sit alongside each other. Layouts
stack on smaller screens and images keep their natural proportions.
