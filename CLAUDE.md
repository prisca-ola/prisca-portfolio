# Prisca Olatunji, Portfolio, Project Guide for Claude

## What this is
A personal design portfolio for **Prisca Olatunji** (a creative / product designer).
It is a **static site**: plain HTML + CSS + vanilla JS, no build step, no framework.
This project is **completely separate from the `andara` project** (different folder,
different repo, different GitHub account). Nothing here should ever touch andara.

- Project folder: `C:\Users\USER\OneDrive\Desktop\Portfolio-Prisca`
- Reference/design inspiration the user likes: `aikawakenichi.com` (the swiping hero),
  `osasu.vercel.app/pay4it.html` and `fungidube.com/my-work/kohl` (case study layouts).

## GitHub + deploy
- Personal GitHub account: **prisca-ola** (`Priscaofficial@gmail.com`, name "Prisca").
- Repo already created (empty apart from an initial README): **`prisca-ola/prisca-portfolio`**
  (`https://github.com/prisca-ola/prisca-portfolio.git`). The remote is set on the local repo.
- **Nothing has been pushed yet.** All work is local-only. When pushing, exclude the heavy
  source folders (see below) and confirm we are pushing to the personal account, not andara's.
- `gh` CLI is **not installed**. Push with plain `git`, or the user creates things in the GitHub UI.
- No hosting connected yet. Plan: push to GitHub, then connect **Netlify or Vercel** for a
  permanent public URL. The user must authorize Netlify/Vercel in their own dashboard (use the
  **prisca-ola** account); Claude handles the config side.

## Running the local preview (READ THIS, it drops often)
- **Node is NOT on PATH.** Node binary: `C:/Program Files/nodejs/node.exe`. npm: `npm` (11.x)
  after `export PATH="$PATH:/c/Program Files/nodejs"`.
- Dev server is a tiny static server: **`dev-server.cjs`** on **port 8090**, serving the folder
  with **no-cache headers** (so edits always show on refresh). It is gitignored.
- Start it (background):
  ```bash
  cd "C:/Users/USER/OneDrive/Desktop/Portfolio-Prisca" && "/c/Program Files/nodejs/node.exe" dev-server.cjs
  ```
- **The server dies whenever the session/background process is torn down.** Symptom: the user says
  "localhost isn't working". Fix: check `curl -s -o /dev/null -w '%{http_code}' http://localhost:8090/`,
  and if not 200, restart with the command above (kill a stale listener on 8090 first if needed).
- Live URL for the user: **http://localhost:8090** (localhost only, not public yet).

## Standing user preferences (IMPORTANT)
- **No em dashes** anywhere in output or files. Use commas / colons instead.
- **Explain progress in plain, non-technical (layman) language.**
- **After finishing any build, proactively give the localhost URL.**
- The user iterates visually and gives exact numbers (px). Verify changes by measuring in the
  browser (DOM/computed styles) since screenshots are flaky here; report exact values.

## Design system
- **Font: Satoshi** (Fontshare, weights 300/400/500/700/900). Loaded in each HTML `<head>`.
- **Primary colour: coffee brown.** Light `--primary:#6f4e37`; dark `--primary:#c49a6c`.
- **Light + dark themes**, toggle in the top-right (sun/moon). Stored in
  `localStorage['prisca.theme']`; `data-theme` on `<html>`. Defaults to OS preference.
- **Dark background is a warm off-black `#1a140f`, deliberately NOT pure `#000000`.**
- **8-point spacing scale** in `:root` (`--s1:8` … `--s10:80`). All spacing is a multiple of 8.
- **`--margin: 100px`** page gutter (steps down to 64px <=1180px, 24px <=760px). The top nav and
  the hero card both key off `--margin` so they align left/right at every breakpoint.
- **Custom trailing cursor**: a small coffee ring (12px, grows to 28px over links/buttons/cards)
  that follows the mouse with easing, on top of the native cursor. Mouse-only (ignores touch via
  `pointermove` + `pointerType==='mouse'`). Present on every page (inline in each HTML).

## The home page (`index.html` + `css/style.css` + `js/main.js`)
Home-page scroll sections: **Home / About / Gallery / Contact** (right-side rail dots: Home · About ·
Gallery · Contact). The old "Selected Works" list AND the sticky "Services" section were both removed.

- **Top nav is all-caps `HOME · ABOUT · RESUME · CONTACT · DESIGN GALLERY`** (`.nav a`:
  `text-transform:uppercase; letter-spacing:0.12em`). **Each nav item is treated as its own page**, so:
  HOME `data-target="home"` (scroll to top on home) · **ABOUT `href="about.html"`** · RESUME
  `href="resume.pdf"` (target=_blank, **file not created yet** — drop `resume.pdf` in root) · CONTACT
  `data-target="contact"` (home section) · **DESIGN GALLERY `href="gallery.html"`**.
- **Nav active state changes ONLY on click, never on scroll** (user: "stop changing to the next nav
  link unless I click"). In `main.js` the IntersectionObserver now calls `setActiveDot()` (rail dots
  still track scroll) but **not** the nav; nav highlight is set by `setActiveNav(id)` in the click
  handler + `setActiveNav("home")` on load. Do not re-add nav highlighting to the observer.
- **Dark canvas + grain**: dark `--bg` dropped to **`#0a0806`** (very dark warm near-black, was
  `#1a140f`), `--surface` `#16110d`. A **fixed film-grain overlay** (`body::before`, same fractalNoise
  recipe as the case studies, `opacity:0.13` dark / `0.05` light, `mix-blend-mode:screen`, `z-index:0`)
  sits under the content — `.scroller` is `position:relative; z-index:1` so it renders above the grain
  (topbar z50 / rail z40 clear it). The shared sheet's `body::before` also lands on `about.html` /
  `gallery.html` (they set `.subpage-main{position:relative;z-index:1}` to stay above it).
- **Scroll snap loosened to `y proximity`** (was `y mandatory`) so tall sections scroll through freely.
- **Shared button `.btn`** (in `css/style.css`): stroke pill — `1.5px solid var(--primary)`,
  transparent, pill radius, arrow SVG that nudges on hover; fills with `--primary` on hover. **This is
  THE button style — reuse it for every CTA** (Get to know me more, View the full gallery, page CTAs).
  `.btn.solid` is the filled variant (used on `about.html`). Keep buttons consistent with `.btn`.
- **Services marquee** (`.marquee` full-bleed band, direct child of `.scroller`, not a `.panel`):
  endless horizontal scroll (`.marquee-track` `animation: marquee 34s linear infinite; translateX
  -50%`, content duplicated 2× for a seamless loop, pauses on hover, disabled for reduced-motion). All-
  caps words: **UI/UX · Product Design · Design Engineer · Prototyping and Interactive Design · Web and
  Mobile Design**, `--primary` bullet separators. Sits between the About and Gallery sections.
- **My Gallery section** (`#gallery`, `.gallery-wrap`): `.gallery-head` (sec-head "My Gallery" +
  `.btn` "View the full gallery" → `gallery.html`) then a **3×3 grid** (`.gallery-grid`
  `repeat(3,1fr)`, 9 `.gallery-card` links → `gallery.html`). Cards are branded placeholders (coffee
  gradient + Fraunces number); swap in `<img>` per card when images exist. `.panel-gallery` is
  `align-items:flex-start` (grows past 100vh). 2-col ≤820px, 1-col ≤520px.

- **Logo**: a plain text wordmark **"priscy"** (`.brand`, lowercase, **Fraunces** 26/600). A circular
  "PO" monogram badge with curved "CREATIVE DESIGNER / VIBE CODER" text was tried and **rejected by the
  user as ugly** — do not bring it back. **Fraunces** (Google Fonts, loaded in `index.html` head) is
  the creative display face, used for the `priscy` wordmark and the About "Hello." heading only;
  everything else stays Satoshi.
- **About section** (`#about`, `.about-hero`): **image LEFT, text RIGHT** (2-col grid `0.92fr 1.08fr`,
  stacks below 820px). Left = `.about-photo` — currently a **branded placeholder** (coffee gradient +
  faded "PO" watermark, `aspect-ratio 4/5`); **swap in the real portrait** by replacing the
  `.about-photo-mark` span with `<img src="assets/prisca.jpg" alt="Prisca Olatunji" />` (the CSS already
  styles `.about-photo img`). Right = `.about-text`: eyebrow "Creative Designer · Vibe Coder" → big
  **"Hello."** (Fraunces) → two bio paragraphs → `.about-focus` pill row (Brand Identity · Web &
  Product Design · Vibe Coding) → **`.btn` "Get to know me more" → `about.html`**. Bio copy is a safe
  placeholder (no fabricated personal facts) — user may refine. Layout mirrors the fungidube.com
  "HELLO" about block the user referenced.

### Sub-pages: `about.html` + `gallery.html` (nav-as-pages)
Two standalone pages the nav links to, both **sharing `css/style.css`** (tokens, `.topbar`, `.nav`,
`.btn`, `.about-*`, grain, cursor) rather than a bespoke stylesheet. Each **overrides the shared
scroll lock** (`html,body{height:auto;overflow:visible}`) since the home sheet sets `body{overflow:
hidden}` for the snap scroller, and sets `.subpage-main{position:relative;z-index:1}` to sit above the
grain. They do **not** load `js/main.js` (which needs `#scroller`/`#stack`); instead each inlines the
theme-toggle + custom-cursor scripts (same pattern as the case-study pages). Shared top nav with the
current page's link marked `.active`. Theme is shared via `localStorage['prisca.theme']`.
- **`about.html`**: expanded About — `.about-hero` (photo left / text right, reusing home classes),
  three bio paragraphs, `.about-focus` pills, `.about-cta` with `.btn.solid` "Work with me" (→
  `index.html#contact`) + `.btn` "See my gallery" (→ `gallery.html`). Photo is the same PO placeholder.
- **`gallery.html`**: the Design Gallery page — `.gal-grid` `repeat(3,1fr)` of `.gal-item` tiles with
  **varied aspect ratios** (`.t` 3/4 · `.s` 4/3 · `.w` 1/1) for rhythm, branded placeholders, "Back
  home" `.btn`. Real images go in `works/gallery/` (swap the `.m` number span for an `<img>`).

The hero is the main feature:

- **Stacked card deck** (not the original 3D cylinder, which was replaced). A wide front card with
  the others stacked behind it, peeking at the bottom. Data is the `WORKS` array in `main.js`:
  ```js
  var WORKS = [
    { title: "Ajo",     img: "works/ajo.png",      link: "ajo.html" },
    { title: "Kinetyq", img: "works/kinetyq.webp", link: "kinetyq.html" },
    { title: "Edibles", img: "works/edibles.webp", link: "edibles.html" },
  ];
  ```
  Add a project by appending `{ title, img, link }`. Each card shows the image + a centred caption:
  **title 56px / weight 900**, **"View project" 20px / weight 500**, 24px apart, over a
  **center-weighted radial scrim** (`.card-cap` background: `radial-gradient(ellipse 84% 74% at
  center, rgba(0,0,0,.74) → .52 @52% → .24 @100%)`). The scrim is darkest behind the caption and
  fades to the corners, so a busy mockup (its own centred text + browser chrome) recedes and the
  caption reads cleanly. (Replaced the old flat `rgba(0,0,0,.18)` veil, which clashed with the new
  Kinetyq browser-mockup card.) "View project" does a small shake on hover; the cursor also expands.
- **Card size**: `.stack-stage` width `calc(100% - 128px)` (**64px gutter each side**), height
  **`700px`** on desktop. Wide rectangles. Below 760px the mobile block overrides to
  `width: calc(100% - 2*var(--margin))` (24px gutter) + `height: 40vh`. Note the card gutter (64px)
  is now intentionally narrower than the desktop nav gutter (`--margin` 100px), so cards sit wider
  than the nav, per the user's request.
- **Behaviour**: auto-advances every **3000 ms** (`AUTO_MS`), loops, **pauses on hover**. The
  `< >` arrows step (and reset the timer). Clicking a card: if it has `link`, navigate there;
  else scroll to Works.
- The giant "PRISCA OLATUNJI" wordmark was **removed** from the hero (redundant with the nav
  brand). The `.hero-word` CSS still exists but is unused/harmless.

## Case study pages (the current focus)
Each project card links to its own full case study HTML page at the repo root. There are **two
different formats** in use:

### `ajo.html` — "full design image" format (COMPLETE)
The Ajó case study was delivered as one giant exported design image. It is sliced into **12
seamless WebP sections** (`works/ajo/part-00.webp … part-11.webp`) stacked full-width (max-width
1440, centred) on a dark `#1a1a1a` frame, with the portfolio top bar (back button), custom cursor,
scroll, and a "Back to all work" button. Images have `width`/`height` attrs (reserve space) +
`loading="lazy"`. Total ~1.9 MB (compressed from ~23 MB). Note the design's own hero reads
"Ajoo Mobile App".

### `kinetyq.html` — "structured case study" format (CURRENT, richer)
Built from separate page screenshots + a mockup, styled uniquely (**dark-navy page bg
`--nv:#010D16`** — deliberately darker than the mockup imagery, which is left as-is so the browser-
chrome design cards read a touch lighter than the frame; **gold `#f4b740` accent**, Satoshi),
synthesising the osasu + fungidube references. Current structure, top to bottom:
1. **Full-bleed case-study cover hero** — `works/kinetyq/hero.webp` (2076x1300) edge to edge, NO
   HTML text overlay. This image is the **top slice of the user's composed `kINETYQ casestudy.png`**
   (the KinetyQ wordmark banner + the "Know Where Every Vehicle Is" landing hero shown inside a
   macOS browser frame), cropped at y=0..1300 (stops just before the source's own Description/meta
   panel, which we do NOT use, the HTML meta row/columns below are the real ones). An `sr-only` h1
   exists for SEO.
2. **Intro panel** (`.cs-intro`, matches the layout in the user's `kINETYQ casestudy.png`): a
   two-column grid, left = **Description** (bold white `h2` + body paragraph, the real Kinetyq
   product blurb), right = **fields grid** (`.cs-facts`, 2x2): **Category** Visual Design /
   **Duration** 2025 - 2026 / **Designer** Prisca Olatunji / **Services** UI Design, Claude-Code.
   Stacks to 1 column below 820px. (The old Role/Length/Year meta row + the 3-column
   Description/Problem/Solution layout were REPLACED by this to match the user's own format. No
   gold accent in this panel, white heading + gray labels + white values, per the source image.)
3. **Dashed-stroke gold "View the live site" button** (transparent, fills on hover) before the designs.
4. **"THE DESIGNS"** label, then the page screenshots as **elevated cards**: each `.cs-screen` has
   rounded corners (14px) + shadow + spacing, floating on the navy (the designs' own navy tops
   blend with the frame). No section numbers.
5. "Back to all work" button.

Design page images: `works/kinetyq/part-00…05.webp` in nav order
**home / features / pricing / tracking / about / contact** (2160px wide). **Each design card now
has the macOS browser chrome composited on top** (a Safari-style bar with traffic-light dots +
`KinetyQ.com` URL). Source chrome is `kinetyq-casestudy/Dark.png` (5295x144); the compositor
resizes it to the design width and stacks it flush above the screenshot, then the card is exported
to WebP (the `.cs-screen` CSS rounds the whole card 14px, so the bar's top corners round cleanly).
Card mockup (home-deck thumbnail): `works/kinetyq.webp` (1600x707), regenerated from
`kinetyq-casestudy/mockup new.png` (5760x2545) = the "Know Where Every Vehicle Is" hero shown in a
single macOS browser frame. (This REPLACED the older two-window "Smarter Fleet Visibility"
`mockup.png`; that file is still in the source folder but unused.) Hero: `works/kinetyq/hero.webp`
(2076x1300, see above).

**Asset build (regeneration).** Both the hero and the 6 browser-topped design cards are generated
with `sharp` from the raw PNGs in `kinetyq-casestudy/` (`home page.png`, `features.png`,
`Pricing.png`, `Tracking.png`, `about us.png`, `contact us.png`, `Dark.png`, `kINETYQ casestudy.png`).
Compositor: resize `Dark.png` to the 4320px design width (bar becomes 4320x117), stack it at top:0
with the design at top:117 on a `#011825` canvas, then resize the whole thing to 2160px wide and
`.webp({quality:82})`. Hero: `extract` y=0..1300 from `kINETYQ casestudy.png` then `.webp({quality:84})`.
The `kinetyq-casestudy/` PNGs are SOURCE ONLY (heavy, do not commit).

**Still placeholder / TODO on kinetyq:** the **live-site link is `#`** and needs the real URL. The
Description body + the Category/Duration/Designer/Services fields are filled in (from the user's
casestudy image + product copy) but the user may still refine them. Note: the user is separately
fixing the Description text baked into the source `kINETYQ casestudy.png` (it currently shows leftover
Ajó copy), that image's own meta panel is NOT used by the site, so it does not affect the page.

### `edibles.html` — "structured case study" format (STARTER, green-themed)
Third project, same structure as `kinetyq.html` but themed **very-dark green** (page bg
`--nv:#020E04`, chosen for text readability; accent `--gold` repurposed to leaf-green `#56d766`; ink
`#eef7ef` / `#b4d0b7`). A **subtle film-grain overlay** sits on the canvas like the Ajó case study:
`.cs-body::before` is a `position:fixed` full-viewport layer with an inline `feTurbulence`
fractalNoise SVG data-URI (`baseFrequency 0.8`, desaturated), `opacity:0.13`,
`mix-blend-mode:screen`, `z-index:0`; `.cs-topbar` + `.cs-main` are `position:relative; z-index:1`
so content stays above the grain. **Same grain is on `kinetyq.html` now** (identical block, over its
`#010D16` navy). Edibles is a food-commerce app (vendor dashboard, accept/decline orders,
register-as-vendor). Page structure:
- **Full-bleed screen-composition hero** (`works/edibles/hero.webp`, 2400x1500, same 5-phone showcase
  as the deck card, see below). **`.cs-main` has `padding-top:0`** (the `.cs-topbar` is in-flow /
  `position:relative`, so the old `padding-top:var(--topbar-h)` double-spaced it), hero now sits
  flush (0px) under the header.
- Description + fields grid (Category/Duration/Designer/Services) + dashed "View the live site" button.
- **"THE DESIGNS" section, grouped by audience then ordered by the app's bottom-nav.** Two
  `.cs-group` headings (green-dot): **Vendor** (22 screens) and **End users** (20 screens). Inside
  each, screens are split into **nav sub-sections** (`.cs-sub` with a small uppercase `.cs-subhead`
  label), **each sub-section starting on its own row** so the flow reads in nav order:
  - **Vendor**: Onboarding (6) → Home (5) → Events (4) → Menu (3) → Wallet (3) → Insights (1).
    Vendor deliberately **starts with the onboarding flow** (splash → phone → OTP → personal /
    restaurant details → upload photo), then the bottom-nav tabs.
  - **End users**: Home (3) → Search (2) → Routine (3) → Wallet (8) → Profile (4).
  Each row is a **3-across** `.cs-shots` grid (`repeat(3,1fr)`; 2-col ≤860px, 1-col ≤520px). Each
  `.cs-shot` is a raw app screen at a uniform phone aspect (`aspect-ratio:820/1776;
  object-fit:cover; object-position:top` so taller screens crop at the bottom and rows align) + 18px
  radius + shadow. Assets: `works/edibles/vendor/01..22-*.webp` + `works/edibles/enduser/01..20-*.webp`
  (820w each, order-prefixed). **Rebuild both the webp AND the section HTML from one script:**
  `Edibles/build_designs.cjs` holds the `VENDOR` / `ENDUSER` group arrays (label + ordered filenames);
  it wipes+regenerates the webp dirs and emits `vendor_fragment.html` / `enduser_fragment.html` (paste
  between the `.cs-group` headings). (The older `convert_shots.cjs` is superseded by this.)
- Back button.

**Home-deck card + hero image** (both from one composition): NOT the illustration mockup, it is a
custom **5-screen phone showcase** (GYMBFF-reference style) composed with `sharp` from the real
screens in `Edibles/Vendor/` + `Edibles/End users/` (currently: Viewing reviews · Creating an
event-1 · Accepted orders · Send money to friends · Success Screen, left→right in an arc). Each raw
1500x3248 screen is rounded + wrapped in a dark bezel + soft shadow and fanned on a green **radial
gradient that fades to the page bg `#020E04` at the edges** (`#0c3f10`→`#061c0a`→`#020E04`) so the
full-bleed hero has no seam; NO baked-in title (the deck's `.card-cap` adds "Edibles / View project"
over the centre scrim). **Phones are sized with vertical margin** (union bbox ~y[164..1320] of the
1500-tall canvas) so the deck card's `object-fit:cover` never crops phone tops, even at wide
(~1.9-aspect) viewports. `Edibles/compose_edibles.cjs` is the single source: its `P[]` array holds
each phone's screen key + innerW + centre-x + bottom-line; it writes `edibles_card_full.png` and
**deploys both** `works/edibles.webp` (1920w) and `works/edibles/hero.webp` (2400w native). The
illustration `edibles mockup.png` is now UNUSED (kept in source only). **TODO:** real live URL,
copy review (the "THE DESIGNS" section is now built, see above). Source `Edibles/` PNGs are
SOURCE ONLY (do not commit).

**sharp gotcha (learned here):** sharp always runs `.resize()` BEFORE `.composite()` regardless of
chain order, so `sharp(base).composite([overlay]).resize(w)` shrinks the base first and then throws
"Image to composite must have same dimensions or smaller". Composite at full size to a buffer, then
resize in a separate `sharp(buffer)` pipeline.

**Shared case-study gotcha:** the shared `css/style.css` sets `body { overflow: hidden }` for the
snap home page. Every case study page must re-enable scrolling with
`html { height:auto; overflow:visible }` and `.cs-body { overflow-y: visible; height:auto }` or it
will be stuck. Each case study page is otherwise self-contained (inline `<style>` + inline theme +
cursor scripts), and only links `css/style.css` for tokens/fonts/cursor styles.

## Image pipeline (how the WebP assets were made)
No image tools are installed globally. The conversion used **`sharp`** and **`pngjs`** installed in
the session scratchpad (which is EPHEMERAL — a new session must reinstall):
```bash
export PATH="$PATH:/c/Program Files/nodejs"
cd <a scratch dir> && npm init -y && npm install sharp pngjs
```
- `pngjs` was used to slice one tall PNG into seamless strips (pure-JS decode/encode).
- `sharp` converts PNG -> WebP (`.webp({quality:82})`), resizes (`.resize({width})`), and reads
  metadata. WebP gave ~90%+ size savings with crisp text. **Node on Windows needs `C:/...` paths,
  not the Git-Bash `/c/...` form.**
- Heavy originals live in `ajo casestudy/`, `kinetyq-casestudy/` and `Edibles/` (tens of MB each).
  These are SOURCE ONLY — **do not ship them to GitHub** (add to `.gitignore` before pushing).

## Key files
| Path | Purpose |
|---|---|
| `index.html` | Home page (hero card deck, About, services marquee, My Gallery 3×3, Contact) |
| `about.html` | Standalone About page (nav "ABOUT"); shares `css/style.css`, inline theme+cursor |
| `gallery.html` | Standalone Design Gallery page (nav "DESIGN GALLERY"); shares `css/style.css` |
| `css/style.css` | All shared styles: tokens, themes, hero deck, cursor, topbar, `.btn`, marquee, gallery |
| `js/main.js` | Theme toggle, scroll progress, `WORKS` deck carousel, custom cursor |
| `ajo.html` | Ajó case study (12 stacked WebP sections, dark frame) |
| `kinetyq.html` | Kinetyq case study (mockup hero + horizontal sections + elevated designs) |
| `edibles.html` | Edibles case study (green-themed starter: mockup hero + intro panel; designs TBD) |
| `works/ajo.png` | Ajó card image (also the deck thumbnail) |
| `works/kinetyq.webp` | Kinetyq card image (the mockup) |
| `works/edibles.webp` | Edibles card image (the mockup) |
| `works/ajo/part-*.webp` | Ajó case study sections (12) |
| `works/kinetyq/part-*.webp` + `hero.webp` | Kinetyq case study pages (6) + hero |
| `works/edibles/hero.webp` | Edibles case study hero (the mockup, 2400x1600) |
| `dev-server.cjs` | Local static server, port 8090, no-cache (gitignored) |
| `ajo casestudy/`, `kinetyq-casestudy/`, `Edibles/` | Heavy source PNGs (do NOT commit) |

## Open next steps
- Get the real **copy + live URL** for the Kinetyq case study and drop them in.
- **Edibles**: real live URL + copy review (hero, description, and the Vendor/End-users "THE
  DESIGNS" grids are all built now).
- Decide whether to give **Ajó** the same structured layout as Kinetyq (currently it is the
  single full-image format).
- **Push to GitHub** (`prisca-ola/prisca-portfolio`), excluding the heavy source folders.
- Then wire up **Netlify/Vercel** for a permanent public link.
