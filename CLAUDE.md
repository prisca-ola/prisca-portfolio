# Prisca Olatunji, Portfolio, Project Guide for Claude

## What this is
A personal design portfolio for **Prisca Olatunji** (UX/UI + product designer).
**Static site**: plain HTML + CSS + vanilla JS, no build step, no framework.
**Completely separate from the `andara` project** (different folder, repo, GitHub account).
Nothing here should ever touch andara.

- Project folder: `C:\Users\USER\OneDrive\Desktop\Portfolio-Prisca`
- The site was rebuilt to match the user's **former Framer portfolio** (`priscy.framer.website`).
  When in doubt about layout/interaction, that site is the reference. Other references the user
  cites: `osasu.vercel.app/pay4it.html` (case-study prev/next nav), `fungidube.com` (testimonial
  frame + about split-name hero).

## GitHub + deploy
- Personal GitHub account: **prisca-ola**. Repo: **`prisca-ola/prisca-portfolio`**
  (`https://github.com/prisca-ola/prisca-portfolio.git`), remote set on the local repo, branch `main`.
- **Work is pushed** (commit history exists). Push with plain `git` (`gh` CLI not installed).
- **No hosting/CI is connected in this environment** — there is no `netlify.toml` / `vercel.json` /
  `CNAME` / `.github` / `.netlify` / `.vercel`, and no netlify/vercel/gh CLI. So Claude **cannot run a
  deploy step**. If the repo is connected to Netlify/Vercel/Pages via the user's dashboard, a push
  auto-deploys; otherwise the user must connect it once. Always tell the user this after pushing.
- **Before committing, keep heavy source folders out of git.** `.gitignore` already ignores (root-
  anchored) `/Design gallery/`, `/Legalpedia/`, `/Edibles/`, `/testimonial back image/`,
  `ajo casestudy/`, `kinetyq-casestudy/`, `node_modules/`, `dev-server.cjs`, and `/assets/*.jpg|*.png|*.JPG`.
  **Gotcha:** Windows git is case-insensitive, so an unanchored `Legalpedia/` also matched
  `works/legalpedia/` and dropped shipped images — always anchor source-folder ignores with a leading
  slash (`/Legalpedia/`). After `git add -A`, sanity-check the largest staged files and that the
  source folders are still ignored.

## Running the local preview (drops often)
- Node works via the Bash tool (`node` resolves; v24). Dev server: **`dev-server.cjs`** on **port
  8090**, no-cache headers, serves the folder. It is gitignored.
- Start (background): `cd "C:/Users/USER/OneDrive/Desktop/Portfolio-Prisca" && node dev-server.cjs`
- **The server dies when the background process is torn down.** If the user says "localhost isn't
  working", check `curl -s -o /dev/null -w "%{http_code}" http://localhost:8090/index.html`; if not
  200, restart. Live URL for the user: **http://localhost:8090**.
- **Preview-pane screenshots are very flaky** (often composite blank/lagged, especially lower
  sections and the navy case studies). **Verify via the DOM** (`javascript_tool` reading computed
  styles / element state) — that is authoritative. Hero screenshots usually work; lower ones often don't.

## Standing user preferences (IMPORTANT)
- **No em dashes** anywhere in output or files. Use commas / colons instead.
- **Explain progress in plain, non-technical (layman) language.**
- **After finishing any build, proactively give the localhost URL.**
- The user iterates visually and gives exact numbers (px). Measure changes in the browser and report
  exact values. When rebuilding to match the Framer site, study its layout AND interactions first.
- **Do NOT save the raw pasted images** — Claude cannot write a pasted image to disk; wire the `<img>`
  to a path and ask the user to drop the file in (this recurs for the About/hero portrait).

## Design system (CURRENT)
- **Font: Montserrat, everywhere.** Loaded via `@import` at the top of `css/style.css`
  (weights 300-800). `--font: "Montserrat", system-ui, sans-serif`. A global override
  **`body * { font-family: var(--font) !important; }`** in `style.css` forces Montserrat over any
  inline `font-family` (older pages still declare "Clash Display" / "Fraunces" / "Satoshi" inline; the
  override wins, and the old font `<link>`s are harmless leftovers). The user was firm: **one font,
  Montserrat, on the entire platform** — do not introduce a second typeface.
- **Primary colour: orange.** Light `--primary:#e35e1b`; dark `--primary:#f26a2c` (`--primary-strong`
  the darker end). Replaced the old coffee-brown. The **background stays a dark warm near-black**
  (dark theme `--bg:#050302`, `--surface:#0f0b07`) with **film grain** (`body::before`, fractalNoise
  SVG, `opacity:0.2` dark, `mix-blend-mode:screen`).
- **`--margin: 64px`** default page gutter (matches the hero-card gutter). Steps to **16px on mobile**
  (`@media (max-width:760px){:root{--margin:16px}}`). This is THE consistent side margin site-wide.
- **Navigation is a hamburger + full-screen menu overlay** (NOT a horizontal nav — that was removed).
  `.menu-btn` top-right (animates to an X), `.menu-overlay` fills the screen with big vertical links
  that stagger in: **Home · About me · Resume · Contact · Design Gallery** →
  `index.html` / `about.html` / `resume.pdf` (file not created yet) / `contact.html` / `gallery.html`.
  Markup + `.menu-*` styles are shared (in `style.css`); each page inlines a small menu-toggle IIFE.
- **Button `.btn` is filled orange** (solid `--primary`, white text, `border-radius:10px`, `height:54px`,
  brightness+lift on hover, keeps its arrow SVG). This mirrors the contact-page submit and is **THE
  button** — reuse it for every CTA. (It used to be a stroke pill; the user preferred the filled look.)
- **Custom trailing cursor** (`.cursor-dot`, grows over interactive elements) on every page, inline.
- The pages that reproduce the Framer look (home, about, contact) run **fixed dark, no theme toggle**
  (`<html data-theme="dark">`, canvas ~`#161616`-`#1c1c1c`). The theme toggle still exists on the
  case-study pages only.

## Home page (`index.html`) — rebuilt to match the Framer home
**Normal-scroll page (NOT scroll-snap).** It no longer uses `js/main.js` (that had the old card-deck
+ scroller); all scripts are **inline**: menu, footer-year, hero-shrink, testimonials carousel, FAQ
accordion, cursor. Home-specific styles live in an inline `<style>` (`.hm-*`), tokens/menu/buttons/
testimonials/footer come from `css/style.css`. Sections top to bottom:

1. **Hero** (`.hm-hero`) — full-bleed **grayscale portrait** (`assets/prisca.webp`, `filter:grayscale(1)`)
   with **"Prisca Olatunji"** overlaid large (Montserrat), "Scroll to explore" (left) + filled "Work
   with me" button (right, → `contact.html`). **Interaction: the hero shrinks into a rounded card on
   scroll** (exactly like the Framer site). Implemented as `.hm-hero{height:170vh}` (150/140vh on
   mobile) with a `.hm-hero-pin{position:sticky;top:0;height:100vh}` holding `.hm-hero-frame`; an inline
   scroll IIFE maps scroll progress → `transform:scale(1 → 0.84)` + `border-radius:0 → 28px` on the
   frame, revealing the dark canvas around it. Keep this effect.
2. **Works** (`.hm-works`) — "Works" heading + "View all" (→ `gallery.html`), then a **2-col grid of
   big project cards** (`.hm-card`, image + name + arrow, image zooms on hover). Order:
   **Ajo · Legalpedia · Kinetyq · Edibles**, each → its case-study page. Card images are the case-study
   heroes: `works/ajo-hero.webp`, `works/legalpedia/hero.webp`, `works/kinetyq/hero.webp`,
   `works/edibles/hero.webp`. 1-col on mobile.
3. **"I am…"** (`.hm-iam`) — orange "I am…" heading (left) + the UX/UI bio paragraph (right). 1-col mobile.
4. **Testimonials** (`.panel-testi.hm-testi`, `.testi-*` from `style.css`) — a **black card that floats
   on a full-bleed background photo** (`works/testi-bg.webp`, currently the user's Figma-workspace
   photo) under a **strong dark overlay** (`.panel-testi::before`: `linear-gradient(rgba(8,8,10,.74)…)`
   over the image). Inside: PREV/NEXT rail, "What others have to say" heading, quote, client name/role,
   and a **circular initials avatar** (not a project image). Carousel data is the inline `TESTI` array
   (David Atuma / Agbo Osayande). To swap the backdrop, replace `works/testi-bg.webp`.
5. **FAQ** (`.hm-faq`, `#faq`) — centred 720px column. Title is two lines: **"Have any question?" (52px)**
   over **"I have some answers" (24px)** with **8px** gap (`.hm-faq-title{display:flex;flex-direction:
   column;gap:8px}`, `.hm-faq-t1`/`.hm-faq-t2`; scale down at ≤520px). Then an **accordion** of 8
   questions styled like the **contact-page input fields** (dark `#0c0c0c` fill, `rgba(255,255,255,.12)`
   border, question text in the muted placeholder colour that brightens on hover/open, orange **+ that
   rotates to ×**). Answers are currently placeholder ("Answer coming soon.") — **the user will send
   the real answers**; drop each into its `.faq-a-inner`.
6. **Footer** (`.hm-foot-wrap` > `.site-footer`) — the **current site footer** (kept, NOT the Framer
   "Let's Talk" one): `.ft-cta` ("READY FOR US TO CREATE / SOME WHOLESOME MAGIC / TOGETHER? LET'S TALK!"
   + orange "Let's Collaborate" mailto) · `.ft-info` (Email/Phone card + Quick Links) · `.ft-socials`
   (Resume + LinkedIn) · copyright. LinkedIn/Twitter hrefs are still `#` placeholders.

Removed from the old home: the rotating card-deck hero, the old About section, the services marquee,
and the "Selected Projects" dotted-frame gallery (superseded by the Works section).

## Sub-pages (rebuilt to match the Framer site)
All share `css/style.css` (tokens, menu, buttons, cursor) and set `html,body{height:auto;overflow:visible}`.
- **`about.html`** — rebuilt to the Framer About: **hero with the name split "Prisca" / "Olatunji"
  overlapping ON TOP of the photo** (`z-index` above the portrait), scroll cue; **philosophy** statement;
  **story** (photo + narrative + "Contact me" `.btn` → `contact.html`); **"What you will find in me"**
  = a **sticky stacked-card** list (Creative Design · Strategic Thinking · Curiosity & Growth ·
  Ownership) with slight rotation, **no shadow**; then the **home-style footer**. Dark `#212121`, grain,
  hamburger, cursor. Uses `assets/prisca.webp` for both photos (user can supply a second).
- **`contact.html`** — Framer contact, **centred** ~520px column: **"Let's talk"** heading, then **filled
  dark cards** (`--card:#0c0c0c`, darker than the page, no stroke) for Email + Phone (full width) and a
  2×2 of **LinkedIn · Behance · Resume · Twitter** (icons), a **"Send me a message" form** (Name; Email +
  Phone; Message; **orange Submit**, `.ct-submit`) — **the form is a front-end stub** (validates + shows
  a note; wire to Formspree/Netlify Forms to actually send) — and a **"Prisca Olatunji" name marquee**.
  The site's **input-field style lives here** (`.ct-form input/textarea`): the FAQ reuses that look.
  LinkedIn/Behance/Twitter hrefs are `#` placeholders.
- **`gallery.html`** — "Design Gallery" page; `.gal-grid` of placeholder tiles (varied aspect ratios).
  Still placeholders — the real gallery projects (Toteez, Shelters of Light, Shecluded, Carina) are not
  on a live page since the home Works section replaced the old on-home gallery. **Open task:** put those
  four on `gallery.html` so "View all" shows real work.

## Case study pages
Four projects, each a self-contained page at the repo root, linking `css/style.css` only for
tokens/fonts/cursor. **Shared gotcha:** re-enable scroll (`html{height:auto;overflow:visible}` +
`.cs-body{overflow-y:visible;height:auto}`) or the page is stuck (the shared sheet sets
`body{overflow:hidden}`). Each has its own accent theme.

- **`ajo.html`** — "full design image" format: 12 stacked WebP slices (`works/ajo/part-00..11.webp`) on
  `#1a1a1a`. Accent = shared `--primary` (orange). Hero card image `works/ajo.png` (7MB source) →
  optimized `works/ajo-hero.webp` for the home Works card.
- **`kinetyq.html`** — "structured case study": navy `--nv:#010D16`, gold `--gold:#f4b740`. Full-bleed
  hero + intro (Description + facts) + **"View the live site" → `https://kinetyq.com`** + "The designs"
  elevated cards (`works/kinetyq/part-00..05.webp`, `hero.webp`).
- **`edibles.html`** — structured, green theme (`--nv:#020E04`, `--gold:#56d766`). Hero
  `works/edibles/hero.webp` + intro + grouped designs (Vendor / End users). **No live-site button**
  (removed — no live URL).
- **`legalpedia.html`** — structured, navy/gold. **Built out** with: updated **Description** (AI B2B
  legal research platform for law firms/courts/universities in Nigeria); **facts** row with **ALL-CAPS
  labels** CATEGORY / **PERIOD (2026)** / DESIGNER (**Prisca Olatunji, Bisola**) / SERVICES; a
  **"The Challenge" block placed right under the first design (01-home)** in the reference layout (big
  left heading + right paragraph, then an **accordion** "My Goal" / "My Contribution" with a `+`→`×`
  icon — inline `.cs-acc-*` styles + a small accordion IIFE); then grouped designs **The website**
  (`works/legalpedia/site/01..06`), **The user app** (`works/legalpedia/user/01..03`), **Super Admin**
  (`works/legalpedia/admin/01..11`). No live-site button (removed).

### Case-study prev / next project nav (all four, shared)
Each case study's bottom is a **`.cs-nav` prev/next project bar** (replaced the old "Back to all work"
button), patterned on `osasu.vercel.app/pay4it.html`: **Prev Project** (left) + **Next Project** (right)
with the project name, **All Projects** centred (→ `index.html#works`), and **on hover of either side its
project thumbnail fades/scales in centred** (`.cs-nav-thumb`, opacity 0 → 1). Styles live in
`css/style.css` (`.cs-nav*`) using theme vars with fallbacks (`var(--gold, var(--primary))` etc.) so
each page keeps its accent (Ajo orange, Edibles green, Kinetyq/Legalpedia gold). Order loops in Works
order: **Ajo ↔ Legalpedia ↔ Kinetyq ↔ Edibles**. Thumbnails are the case-study hero webps.

## Image pipeline
- **`sharp` is installed** in `node_modules` (`npm install sharp --no-save`) — use it to optimize
  images (PNG/JPEG → WebP, resize, read metadata). Node on Windows wants `C:/...` paths.
- **sharp gotcha:** `.resize()` runs before `.composite()` regardless of chain order → composite at full
  size to a buffer, then resize in a separate pipeline.
- Heavy source PNGs live in the ignored folders (`Design gallery/`, `Legalpedia/`, `Edibles/`,
  `testimonial back image/`, `ajo casestudy/`, `kinetyq-casestudy/`). SOURCE ONLY — never commit.
- Optimized shipped assets live under `works/` (+ `assets/prisca.webp` for the portrait).

## Key files
| Path | Purpose |
|---|---|
| `index.html` | Home (grayscale hero-shrink · Works · I am · Testimonials · FAQ · footer); inline scripts |
| `about.html` | About (split-name hero · philosophy · story · sticky value cards · footer) |
| `contact.html` | Contact ("Let's talk" · cards · stub form · name marquee); holds the input-field style |
| `gallery.html` | Design Gallery page (placeholder tiles — needs the real projects) |
| `css/style.css` | All shared styles: Montserrat @import, tokens, menu, `.btn`, testimonials, footer, `.cs-nav` |
| `js/main.js` | LEGACY (old card-deck/scroller) — **not loaded by the current home**; can be removed |
| `ajo.html` / `kinetyq.html` / `edibles.html` / `legalpedia.html` | Case studies (+ shared prev/next nav) |
| `works/*` | Optimized WebP assets (card heroes, case-study screens, `testi-bg.webp`) |
| `assets/prisca.webp` | Portrait used by the home hero (grayscaled) + About |
| `dev-server.cjs` | Local static server, port 8090, no-cache (gitignored) |

## Open next steps
- **FAQ answers**: the user will send them; drop each into its `.faq-a-inner`.
- Put the four gallery projects (Toteez, Shelters of Light, Shecluded, Carina) onto `gallery.html`.
- Wire the **contact form** to a real endpoint (Formspree / Netlify Forms).
- Fill real **social URLs** (LinkedIn/Behance/Twitter `#` placeholders) and add `resume.pdf`.
- Optionally supply a proper studio **B&W hero portrait** (currently the colour headshot desaturated).
- **Deploy**: confirm the repo is connected to Netlify/Vercel/Pages (Claude can't do it here); a push
  auto-deploys only if connected.
