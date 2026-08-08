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
Single page, scroll-snap sections: **Home / Works / About / Contact** (nav + right-side dots).
The hero is the main feature:

- **Stacked card deck** (not the original 3D cylinder, which was replaced). A wide front card with
  the others stacked behind it, peeking at the bottom. Data is the `WORKS` array in `main.js`:
  ```js
  var WORKS = [
    { title: "Ajo",     img: "works/ajo.png",     link: "ajo.html" },
    { title: "Kinetyq", img: "works/kinetyq.webp", link: "kinetyq.html" },
  ];
  ```
  Add a project by appending `{ title, img, link }`. Each card shows the image + a centred caption:
  **title 56px / weight 900**, **"View project" 20px / weight 500**, 24px apart, over a thin
  `rgba(0,0,0,.18)` veil. "View project" does a small shake on hover; the cursor also expands.
- **Card size**: `.stack-stage` width `calc(100% - 2*var(--margin))` (aligns with the nav),
  height `min(68vh, 500px)`. Cards are wide rectangles.
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
Built from separate page screenshots + a mockup, styled uniquely (navy `#011825` frame, **gold
`#f4b740` accent**, Satoshi), synthesising the osasu + fungidube references. Current structure,
top to bottom:
1. **Full-bleed mockup hero** — `works/kinetyq/hero.webp` edge to edge, NO text overlay
   (title/eyebrow/description were removed per the user). An `sr-only` h1 exists for SEO.
2. **Horizontal meta row**: Role / Length / Year.
3. **Horizontal 3 columns**: Description | Problem | Solution (stack to 1 column below 820px).
4. **Dashed-stroke gold "View the live site" button** (transparent, fills on hover) before the designs.
5. **"THE DESIGNS"** label, then the page screenshots as **elevated cards**: each `.cs-screen` has
   rounded corners (14px) + shadow + spacing, floating on the navy (the designs' own navy tops
   blend with the frame). No section numbers.
6. "Back to all work" button.

Design page images: `works/kinetyq/part-00…05.webp` in nav order
**home / features / pricing / tracking / about / contact** (2160px wide). Card mockup:
`works/kinetyq.webp` (1600x707). Hero: `works/kinetyq/hero.webp` (2200x972).

**Still placeholder / TODO on kinetyq:** the copy (Description/Problem/Solution) is placeholder,
marked `[Placeholder: …]`, waiting for the user's real writing. The **live-site link is `#`** and
needs the real URL. Role/Length/Year are guesses. The user will supply these later.

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
- Heavy originals live in `ajo casestudy/` and `kinetyq-casestudy/` (tens of MB each). These are
  SOURCE ONLY — **do not ship them to GitHub** (add to `.gitignore` before pushing).

## Key files
| Path | Purpose |
|---|---|
| `index.html` | Home page (hero card deck, Works/About/Contact) |
| `css/style.css` | All shared styles: tokens, themes, hero deck, cursor, topbar |
| `js/main.js` | Theme toggle, scroll progress, `WORKS` deck carousel, custom cursor |
| `ajo.html` | Ajó case study (12 stacked WebP sections, dark frame) |
| `kinetyq.html` | Kinetyq case study (mockup hero + horizontal sections + elevated designs) |
| `works/ajo.png` | Ajó card image (also the deck thumbnail) |
| `works/kinetyq.webp` | Kinetyq card image (the mockup) |
| `works/ajo/part-*.webp` | Ajó case study sections (12) |
| `works/kinetyq/part-*.webp` + `hero.webp` | Kinetyq case study pages (6) + hero |
| `dev-server.cjs` | Local static server, port 8090, no-cache (gitignored) |
| `ajo casestudy/`, `kinetyq-casestudy/` | Heavy source PNGs (do NOT commit) |

## Open next steps
- Get the real **copy + live URL** for the Kinetyq case study and drop them in.
- Decide whether to give **Ajó** the same structured layout as Kinetyq (currently it is the
  single full-image format).
- **Push to GitHub** (`prisca-ola/prisca-portfolio`), excluding the heavy source folders.
- Then wire up **Netlify/Vercel** for a permanent public link.
