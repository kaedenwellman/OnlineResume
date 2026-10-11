# Wire Lion Engineering Club website: build handoff

**For:** Claude Code
**Owner:** Kaeden Wellman, Director of Marketing & Communications, Wire Lion Engineering Club (UCCS)
**Ship target:** GitHub repo → Vercel
**Prepared:** October 2026

---

## 0. Read this first

You are building the official website for the **Wire Lion Engineering Club**, a student-led electrical & computer engineering club at the University of Colorado Colorado Springs. This handoff package contains everything you need:

```
wirelion-handoff/
├── HANDOFF.md              ← this spec (copy into the repo as /docs/HANDOFF.md)
├── content/                ← ALL site copy and data. Import these; do not retype content.
│   ├── site.json           ← name, mission, join flow, contact, socials
│   ├── projects.json       ← project cards + detail pages
│   ├── team.json           ← officers + advisor
│   └── media.json          ← video + photo gallery
├── public/                 ← web-optimized assets. Copy into the Next.js /public folder as-is.
│   ├── brand/              ← logo-full.png, lion-head.png, logo-pulse.mp4/.webm
│   ├── photos/             ← club activity + museum trip photos (.webp)
│   ├── projects/           ← per-project images
│   ├── video/              ← Arduino explainer (720p mp4) + poster
│   └── docs/               ← project technical documents (PDF)
└── reference/              ← design reference screenshots (NOT for the public site)
    ├── style-ref-shop-grid.png
    └── style-ref-product-page.png
```

### Non-negotiable rules

1. **Never invent content.** No fake events, meeting times, testimonials, stats, member quotes, sponsor logos, or social links. If something is missing, hide that UI or show a designed placeholder. Fields marked `TODO(Kaeden)` or prefixed with `_` are notes for humans: never render them.
2. **Content lives in `/content/*.json`.** Pages read from these files. A non-coder officer should be able to add a project by editing JSON + dropping an image in `/public`, then pushing.
3. **No phone number anywhere on the site.** No meeting schedule on the site (for now, meetings are shared through Mountain Lion Connect).
4. **The name is "Wire Lion"** (two words) in all copy. The logo artwork says "WIRELION"; leave the artwork as-is.
5. **Mobile first.** Most visitors arrive from a QR code or an Instagram link on a phone.
6. Look at both images in `/reference` before writing any CSS. The goal is that visual language, re-skinned for an engineering club.

---

## 1. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router), TypeScript**, latest stable | Every page statically generated (SSG). No server, no database. |
| Styling | **Tailwind CSS** (latest) + CSS custom properties for theme tokens | Tokens in §4 live as CSS variables so the theme toggle is a single attribute flip. |
| Animation | **Motion** (`motion` / framer-motion) for the intro + micro-interactions | SVG stroke animation for wires. No heavy WebGL/three.js. |
| Fonts | `next/font/google`: **JetBrains Mono** (400/500/700/800) | One family, the whole site is monospace like the reference. Optional: **Space Grotesk 700** only if JetBrains Mono 800 doesn't feel heavy enough for the giant H1s; test first. |
| Images | `next/image` | Assets are already compressed .webp. |
| Icons | `lucide-react` | Search, arrows, sun/moon, download, external-link, menu, x. |
| Hosting | **Vercel** (Hobby/free), auto-deploy from `main` | No env vars needed. |
| Analytics | `@vercel/analytics` (optional, off by default) | Ask Kaeden before enabling. |

Keep dependencies minimal. No UI kit (no shadcn, MUI, etc.). The look is custom and simple to build by hand.

---

## 2. Sitemap

| Route | Purpose | Shop-reference analog |
|---|---|---|
| `/` | Home: hero, stats, project grid, what we do, featured video, up next, join CTA | "ALL PRODUCTS" page |
| `/projects` | Full project grid with filter chips + search | Shop grid |
| `/projects/[slug]` | Project detail page | Product page |
| `/learn` | Learning library (one video now, more later) | — |
| `/team` | Officers + faculty advisor | — |
| `/about` | Mission, pillars, photo gallery | — |
| `/join` | How to join via Mountain Lion Connect + FAQ | Checkout |
| `not-found` | Custom 404: **"404: OPEN CIRCUIT"** with a broken-wire illustration and a "Back to home" button | — |

**Header nav (desktop):** PROJECTS · LEARN · TEAM · ABOUT · **[JOIN]** (filled primary button) · theme toggle.
**Mobile:** wordmark + JOIN button + hamburger → full-screen menu overlay (big monospace links, each with a hard border, theme toggle at the bottom).

---

## 3. Visual language (study `/reference`)

The reference is a "brutalist digital shop": **BRUTAL SHOP**. Re-skin it for Wire Lion. Exact traits to reproduce:

**Surface & texture**
- Warm off-white "paper" background with a **very faint horizontal scanline pattern + fine noise grain** across the whole page (CSS `repeating-linear-gradient` at ~3px pitch, ~3–4% opacity, plus an SVG `feTurbulence` noise layer at ~4–6% opacity, `position: fixed`, `pointer-events: none`). Subtle; it should read as texture, not stripes.
- The site sits in a large rounded "screen" container in the reference (slight radius, dark frame peeking at the edges). Optional: a 12px dark bezel around the viewport on desktop ≥1280px only. Skip on mobile.

**Type**
- Everything monospace, almost everything **UPPERCASE**.
- Giant, heavy, tight H1s (`ALL PRODUCTS`): clamp ~56px (mobile) → ~120px (desktop), weight 800, letter-spacing −0.02em, line-height 0.95.
- Small eyebrow labels (`BROWSE`, `T-SHIRT`): ~12–13px, weight 500, letter-spacing 0.12em, muted ink.
- Body copy (product description): ~15–17px, normal case, line-height 1.7, muted ink.

**Wordmark**
- Reference: `BRUTAL` plain + `SHOP` on a mint highlight block.
- Ours: **`WIRE`** plain + **`LION`** on a mint highlight block (`--accent-mint`), preceded by the small `lion-head.png` mark (28–32px, in a 2px-bordered square). Small eyebrow under it on the home hero: `UCCS // ECE`.

**Borders, shadows, shapes**
- 2px solid ink borders on everything interactive and every card. Square corners (radius 0).
- **Hard offset shadows**, no blur: `box-shadow: 4px 4px 0 var(--ink)`. Chips and buttons in the reference have this.
- A 2px full-width horizontal rule separates the filter row from the grid.
- The one rounded element in the reference is the quantity pill. We don't have a stepper (see §6.3); use pill shapes nowhere except the skip-intro button.

**Interaction feel**
- Hover on cards/buttons: `translate(-2px,-2px)` + shadow grows to `6px 6px`. Active/press: `translate(2px,2px)` + shadow `0 0`. 120ms ease-out.
- Card image: subtle `scale(1.03)` on hover inside an `overflow:hidden` frame.
- Active filter chip = ink fill, paper text (like `ALL` in the reference).

**Sticker**
- The reference has a yellow **starburst sticker** half off-screen top-right. Ours: a yellow starburst (`--accent-butter`, 2px ink border) reading **"40+ MEMBERS"**, rotated −12°, slowly rotating ±4° on a 6s loop. Disable the motion under `prefers-reduced-motion`.

**Payment-badge row → tech badges**
- Reference shows VISA / Mastercard / AMEX / Apple Pay / GPay / PayPal in pastel bordered boxes. Ours: the project's `tech` array rendered as pastel bordered boxes, cycling mint → peach → lavender → butter.

---

## 4. Design tokens + theme toggle

Two themes: **CREAM** (default, matches reference) and **BLACK** (Tron). Toggle in the header; label it clearly (e.g., a 2-segment switch `CREAM | BLACK`, or a sun/moon icon button with `aria-label`).

```css
:root, [data-theme="cream"] {
  --bg:            #ECE9E2;  /* paper */
  --bg-elevated:   #F4F2EC;  /* cards */
  --ink:           #141414;  /* text, borders, shadows */
  --ink-muted:     #4A4A47;
  --rule:          #141414;
  --accent-mint:   #BFE6D3;
  --accent-lav:    #D8C9F0;
  --accent-peach:  #F2CDB5;
  --accent-butter: #F3E9A0;
  --accent-blue:   #1C8CFF;  /* links, focus ring, small highlights */
  --shadow:        4px 4px 0 var(--ink);
  --scanline-opacity: .035;
}

[data-theme="black"] {
  --bg:            #07090D;
  --bg-elevated:   #0E1218;
  --ink:           #E6EEF7;
  --ink-muted:     #9AA7B6;
  --rule:          #E6EEF7;
  --accent-mint:   #0F3B33;  /* darkened pastels: text on them stays light */
  --accent-lav:    #2A2248;
  --accent-peach:  #3E2519;
  --accent-butter: #3A3410;
  --accent-blue:   #2EA8FF;  /* Tron blue */
  --glow:          0 0 12px rgba(46,168,255,.55);
  --shadow:        4px 4px 0 var(--accent-blue);  /* hard shadows turn Tron blue */
  --scanline-opacity: .06;
}
```

Rules:
- In BLACK mode, borders stay `--ink` (light), offset shadows become **Tron blue**, and the active chip/primary button gets a faint `--glow`. Keep it restrained; no neon everywhere.
- The wordmark's `LION` highlight in BLACK mode = Tron-blue block with `#07090D` text.
- **No flash of wrong theme:** inline a tiny blocking script in `<head>` that reads `localStorage['wl-theme']` (wrapped in try/catch) and sets `data-theme` on `<html>` before paint. Default `cream`. Persist on toggle.
- Verify WCAG AA contrast for text on every accent in both themes. Adjust token values if needed and note any changes in the README.
- Focus ring: `outline: 3px solid var(--accent-blue); outline-offset: 3px` on all interactive elements.

---

## 5. The boot intro (signature piece, give it the most care)

### 5.1 Concept
Black screen → glowing **Tron-blue wires** race in from the edges along circuit-board-style routes → they converge and trace the **lion's outline** → outline completes, **the real logo ignites** (eyes flash, using the pulse loop) → the logo **floats up and shrinks into the header's lion mark** → black fades away and the site is revealed underneath, already loaded.

### 5.2 Assets
- `public/brand/logo-full.png`: 512×512 full logo (lion + circuit icons + "WIRELION ENGINEERING CLUB" text) on black.
- `public/brand/logo-pulse.mp4` / `.webm`: the same logo as a 3.4s seamless loop with the eye-lightning pulse (converted from the original 9 MB GIF; ~100 KB). Muted, `playsInline`, `autoPlay`, `loop`.
- `public/brand/lion-head.png`: square crop of just the lion head, used as the header mark.
- **You must create** `public/brand/lion-outline.svg` (see 5.4).

### 5.3 Timeline (total ≈ 3.6s; tune by feel, but stay ≤ 4s)

| t (s) | Phase | What happens |
|---|---|---|
| 0.00–0.35 | **Power on** | Pure `#000`. A single cyan pixel/cursor blinks center screen. Optional micro boot text bottom-left in 11px mono, typed fast: `WIRE LION // SYS BOOT … OK`. A faint Tron perspective grid fades in on the bottom 35% of the screen (≤8% opacity). |
| 0.35–1.90 | **Wires in** | 10–14 wires enter from all four screen edges, staggered 0–0.6s. Each follows an **orthogonal/45° PCB-trace route** (straight runs, 45° bends, never curves) and terminates at a point on the lion outline. Each wire = a bright core line + blurred glow underlay, drawn with `stroke-dashoffset`. A bright **"light-cycle" spark** rides the leading tip of each wire. Tiny solder-pad circles pop (scale 0→1) where wires land. |
| 1.20–2.30 | **Lion trace** | As wires land, the lion outline paths draw themselves outward from each landing point (overlapping with the end of phase 2, so it feels continuous). Ends with all outline strokes complete. |
| 2.30–2.70 | **Ignite** | Quick white-blue flash on the outline (stroke brightens, glow radius spikes, then settles). Cross-fade outline → `logo-pulse` video positioned **pixel-aligned** underneath, timed so the eye-lightning flash lands right at ignition. The wires dim to 25% and retract/fade. |
| 2.70–3.60 | **Float + reveal** | The logo shrinks and translates (FLIP) to the exact bounding box of the header lion mark. During flight it cross-fades from full logo (with text) → `lion-head.png`. Simultaneously the black overlay fades out with a quick **top-to-bottom scanline wipe** (a 2px bright line sweeping down as the black recedes). The header mark becomes visible exactly when the flying logo arrives; the overlay is removed. Hero text staggers in (30ms per line, 8px slide-up). |

### 5.4 Building the lion outline (`lion-outline.svg`)
The provided logo is a glowing raster, not line art, so wires can't trace it directly. Create a **simplified vector outline of the lion head** in a `viewBox="0 0 512 512"` that sits exactly on top of `logo-full.png`:
- 15–30 paths: outer head silhouette, ears, brow lines, eye shapes, nose, muzzle, and the circuit "whisker" traces with their round terminal pads. Line-art only, `fill="none"`.
- Suggested method: threshold the bright strokes of `logo-full.png` (or a frame of the pulse video), auto-trace with `potrace` (installable via npm `potrace` or system package), then hand-simplify and clean. Or hand-author paths.
- Build a debug mode: visiting `/?introDebug=1` shows the outline SVG at 60% opacity over the logo, paused, so alignment can be checked. Remove nothing; just keep it behind the query param.
- Wire endpoints should be defined in data (`intro/wires.ts`: array of point lists in the same 512 coordinate space, scaled to viewport), so routes are tweakable.

### 5.5 Glow recipe (SVG)
- Each wire is two strokes on the same path: underlay `stroke-width: 6; stroke: #2EA8FF; opacity: .55; filter: blur(6px)` (`feGaussianBlur stdDeviation 3–4`), core `stroke-width: 1.75; stroke: #CFF0FF`. Wrap in a group with `mix-blend-mode: screen`.
- Spark: 4px circle `#FFFFFF` with a 12px blue glow, positioned along the path via `getPointAtLength` driven by the same progress value as the dash offset.
- Keep filters on a single `<g>` rather than per path for performance.

### 5.6 Behavior rules
- **Plays once per browser session.** `sessionStorage['wl-intro-seen']`, wrapped in try/catch. If storage throws, play it (don't crash).
- **Skip:** a small pill button bottom-right, `SKIP ▸▸`, visible from t=0.3s. Also skip on `Esc`, `Enter`, `Space`, or a tap anywhere. Skipping jumps straight to the end state (logo in header, overlay gone) with a 200ms fade.
- **`prefers-reduced-motion: reduce`** → no wires, no flight. Show the static logo centered on black for 400ms, then fade to the site.
- `/?intro=1` forces a replay (for testing and demoing).
- **No flash of the site before the intro:** the overlay is in the server-rendered HTML (fixed, full-screen, `#000`, `z-index` top). A tiny inline script removes it before first paint if the session has seen it or reduced motion is on. The real page content renders underneath at the same time, so SEO, LCP, and no-JS users are unaffected (with JS disabled, a `<noscript>` style hides the overlay).
- Lock body scroll while the overlay is up; restore after.
- Overlay is `aria-hidden="true"`; screen readers go straight to the page. Keyboard focus starts on the skip link/button, then moves to `<main>` after the intro.
- Intro must stay smooth (no dropped frames) on a mid-range phone. Test with 4× CPU throttling in DevTools. If it stutters, reduce wire count before cutting anything else.
- Only intro-critical assets may load before the animation starts (≤ 300 KB total: the outline SVG is inline, plus `logo-pulse.webm` (~90 KB) and `lion-head.png` (~180 KB)). Preload them.

### 5.7 Header logo after the intro
The header lion mark uses `lion-head.png` in a 2px-bordered square. On hover in BLACK mode, swap to a tiny muted `logo-pulse` loop (cropped via `object-position`) for a subtle eye flash. In CREAM mode, just the static image.

---

## 6. Page specs

### 6.1 Home `/`
Top to bottom:

1. **Hero**
   - Eyebrow: `UCCS // ELECTRICAL & COMPUTER ENGINEERING`
   - H1 from `site.heroHeadline`: **WE BUILD THINGS THAT LIGHT UP.** (giant, like `ALL PRODUCTS`)
   - Subhead from `site.heroSubhead`.
   - Buttons: **`JOIN ON MOUNTAIN LION CONNECT ↗`** (primary, ink fill, opens MLC in a new tab) and **`SEE PROJECTS`** (secondary, outlined).
   - Starburst sticker "40+ MEMBERS" top-right.
   - Right side on desktop (where the reference has the search box): a bordered "spec sheet" mini-panel: `FOUNDED 2025 / MEMBERS 40+ / BUILDS SHIPPED 3 / NEXT: HALLOWEEN COMPETITION`. Derive "builds shipped" by counting `status === "COMPLETE"` in projects.json.
2. **Marquee strip:** full-width ink band, paper text, infinitely scrolling `site.focusAreas` separated by ` ✦ `. Pause on hover; static under reduced motion.
3. **Projects** (the shop grid): eyebrow `BROWSE`, H2 `ALL PROJECTS`, filter chips + search, 2px rule, card grid. Same component as `/projects` (§6.2) but capped at 8 cards, with a `VIEW ALL PROJECTS →` link.
4. **What we do:** eyebrow `IN THE LAB`, H2 `WHAT WE DO`. Asymmetric bordered photo grid from `media.gallery` (first 4 photos), each with a pastel label tag pinned to a corner (`SOLDERING`, `INSPECTION`, …). Alongside: the four `about.pillars` as bordered boxes.
5. **Featured video:** eyebrow `LEARN`, H2 `HOW DOES AN ARDUINO READ A BUTTON?`, bordered video player (§6.5), credit line, `MORE IN LEARN →`.
6. **Up next:** a wide butter-yellow bordered callout for the upcoming project(s) (`status === "UPCOMING"`): `UP NEXT: HALLOWEEN COMPETITION`, project title + summary + `JOIN TO COMPETE →`.
7. **Join band:** full-width ink block, H2 `JOIN THE PRIDE.`, one line of copy, the MLC button.
8. **Footer** (§6.8).

### 6.2 Projects `/projects` (the shop grid)
- Header row: eyebrow `BROWSE`, H1 `ALL PROJECTS`, search input on the right exactly like the reference (2px border, search icon, placeholder `SEARCH PROJECTS...`).
- Filter chips: `ALL` · `COMPLETE` · `UPCOMING` (add `IN PROGRESS` automatically only if any project has that status). Chips filter instantly; search matches title, category, summary, and tech tags (case-insensitive). Reflect the filter + query in the URL (`?status=complete&q=arduino`) so it's shareable.
- Grid: 4 columns ≥1280px, 3 at ≥1024, 2 at ≥640, 1 below. 24–32px gaps.
- **Project card** (mirrors the product card):
  - Image area, square-ish (aspect 1/1 or 4/3), 2px bottom border. Upcoming projects without images get the placeholder from §6.4.
  - Eyebrow = `category` (where the reference shows `T-SHIRT`).
  - Title = `title`, uppercase, bold.
  - Bottom line (where price sits) = **status** in bold (`● COMPLETE` / `◐ IN PROGRESS` / `○ UPCOMING`), plus a small bordered `level` tag right-aligned (`BEGINNER`, `INTERMEDIATE`, `ALL LEVELS`).
  - Whole card is one link to `/projects/[slug]`.
- Empty state for no results: bordered box, `NO MATCHES. TRY "ARDUINO" OR "SOLDERING".`

### 6.3 Project detail `/projects/[slug]` (the product page)
Two columns on desktop (image left ~45%, info right), stacked on mobile. Map from the reference:

| Reference element | Wire Lion version |
|---|---|
| Breadcrumb `HOME > SHOP > COBALT CLASSIC TEE` | `HOME > PROJECTS > {TITLE}` |
| Bordered image with ← → circle buttons | Same: carousel through `images[]`, arrow buttons, swipe on touch, arrow-key support, dot/index indicator `1 / 4`. Click to open a lightbox. Hide arrows when there's only one image. |
| Lavender price block `$32.00` | Lavender bordered **status block**: `COMPLETE` / `UPCOMING` |
| Giant 2-line title | Same, from `title` |
| Description paragraph | `description` |
| `SIZE` selector XS–XL | **`DETAILS` tab selector** with the same square chips: `OVERVIEW` · `SPECS` · `BUILD` · `DEBUG` · `TEAM`. Only show tabs whose data exists. Overview = description + concepts as tags; Specs = `specs` table; Build = numbered `build` steps; Debug = `troubleshooting` list; Team = `contributors` grouped by role (or `contributorsFallback`). |
| `T-SHIRT` small label | `category` + `level` |
| Quantity stepper | **Remove.** Do not fake a stepper. |
| Black `ADD TO CART` bar | Black full-width bar: **`↓ DOWNLOAD TECH DOC (PDF)`** linking to `doc.src` (opens in a new tab). If `doc` is null: show it disabled and dashed with `docPendingLabel` (e.g. `TECH DOC COMING SOON`), or the project's `cta` button if one exists (`JOIN TO COMPETE`). |
| Payment badges row | **Tech badges** from `tech[]` in cycling pastel boxes |

Below the fold: `MORE PROJECTS` row (3 other cards). Add `generateStaticParams` + per-project metadata (title, description, OG image = first project image).

### 6.4 "Coming soon" placeholder (projects with no image)
A designed card image, not a gray box: black/ink background with a dim Tron grid, a dashed 2px border inset, and centered mono text `COMING SOON` + the category. For the jack-o'-lantern, add a simple inline-SVG pumpkin drawn in **Tron-blue circuit lines** (outline + a few trace "veins" + two LED dots for eyes that blink slowly). Original artwork, keep it simple.

### 6.5 Learn `/learn`
- H1 `LEARN`, subhead: "Short explainers from Wire Lion members."
- Featured video player for `media.videos[0]`:
  - Bordered 16:9 frame, `poster` image, `preload="metadata"`, native `controls`, **no autoplay**, `playsInline`.
  - Custom big play button overlay in the brutalist style (square, ink fill) that hides on play.
  - Under it: title, subtitle, description, chapter list (as static labels), tags, level, credit `Created by Matthew Barker`.
- Below: a grid ready for future videos/tutorial cards (render only what exists; no fake cards).
- TODO hook: support an optional `captions` (.vtt) field per video and render a `<track>` if present.

### 6.6 Team `/team`
- H1 `THE CREW`. Sections: `OFFICERS` and `FACULTY ADVISOR`.
- Officer cards: bordered, offset shadow. Photo area = image if `photo` is set, otherwise a **letter avatar**: big monospace initials on a pastel block (cycle mint/lav/peach/butter), with a 2px border. Then role (eyebrow style) and name (bold).
- Daniel Bustos's card shows a small `PRIMARY CONTACT` badge.
- No emails or personal links on officer cards.

### 6.7 About `/about`
- H1 `ABOUT THE PRIDE` (or `ABOUT WIRE LION`).
- Render `about.intro`, `about.mission`, `about.beyond`, `about.closing` as a readable column (max ~68ch), with a pull quote: *"From logic circuits and Arduino to digital systems and Verilog."*
- Pillars as 4 bordered boxes.
- Full gallery from `media.gallery`: masonry/brutal grid, click → lightbox with caption. The museum photo uses its `caption`.
- Fact strip: `FOUNDED 2025 · 40+ MEMBERS · UCCS`.

### 6.8 Join `/join`
- H1 `JOIN THE PRIDE.` + `join.body`.
- Three numbered step blocks (`join.steps`), big `01 / 02 / 03` numerals, connected by a drawn "wire" line between them (CSS/SVG, a Tron-blue trace in BLACK mode).
- Huge primary button: **`JOIN ON MOUNTAIN LION CONNECT ↗`** → `join.mountainLionConnectUrl`, new tab, `rel="noopener noreferrer"`.
- Note under the button: "Discord, meeting times, and announcements are shared with members through Mountain Lion Connect."
- FAQ accordion from `join.faq` (native `<details>`, styled).

### 6.9 Footer (all pages)
- Ink band. Left: wordmark + "Wire Lion Engineering Club · University of Colorado Colorado Springs". Middle: page links. Right: contact. `site.contact.address`; email (if `showEmail`) as a `mailto:` link assembled client-side from parts so it isn't plain text in the HTML; social icons only for non-empty `site.social` values.
- Bottom line: `© {year} Wire Lion Engineering Club. Student organization at UCCS.`
- Do not use official UCCS logos or imply this is a university-run page.

---

## 7. Content facts (for reference; the JSON is the source of truth)

- **Club:** Wire Lion Engineering Club, UCCS. Founded 2025. 40+ members. Student-led. Focus: circuit design, microcontrollers, programming, applied engineering; logic circuits → Arduino → digital systems → Verilog. All skill levels.
- **Join:** Mountain Lion Connect, https://mlc.uccs.edu/organization/ecestudentsclub (Discord + meetings shared there after joining).
- **Officers:** Daniel Bustos (President, Primary Contact) · Michael Smith (VP) · Lerry Lara (Secretary) · Kaeden Wellman (Director of Marketing & Communications) · William McGinley, Jake Marlett, Ben Foronda (Club Officers). **Advisor:** Leslie Tekamp.
- **Projects:**
  1. 4-Way Traffic Light Intersection: Arduino, team build, COMPLETE (tech doc pending).
  2. HU-001C Handheld Game Machine: soldering kit, COMPLETE, PDF included.
  3. Light-Activated LED & Buzzer Alarm: sensor circuit, COMPLETE, PDF included.
  4. Sound-Reactive LED Jack-o'-Lantern: Halloween competition, UPCOMING.
- **Video:** "How does an Arduino read a button?" (Engineering 201, pull-up resistor), 50s, created by Matthew Barker.
- **Photos:** soldering sessions, inspection under magnifier, design review at whiteboard, club trip to the World War II museum (P-38 Lightning).

---

## 8. SEO, metadata, sharing

- `<title>`: `Wire Lion Engineering Club · UCCS`; per-page titles `Projects · Wire Lion`, etc.
- Meta description: "Wire Lion is a student-led electrical & computer engineering club at UCCS. Hands-on circuits, Arduino, soldering, digital systems and Verilog, for every skill level."
- **Open Graph image** (1200×630): generate with Next's `opengraph-image.tsx`: black background, Tron grid, `logo-full.png` left, "WIRE LION ENGINEERING CLUB / UCCS" right in JetBrains Mono. Projects get their own OG image from their cover photo + title.
- Favicon/app icons from `lion-head.png` (32, 180 apple-touch, 192/512 manifest). `theme-color` `#07090D`.
- `sitemap.ts` + `robots.ts`. JSON-LD `Organization` on the home page (name, url, address, sameAs = non-empty socials).
- Semantic HTML: one `<h1>` per page, landmarks (`header`, `nav`, `main`, `footer`), every image has the `alt` from the JSON.

---

## 9. Accessibility + performance budgets

- WCAG 2.1 AA: contrast in both themes, visible focus, full keyboard nav (carousel, tabs, lightbox with focus trap + `Esc`, mobile menu), tabs use proper `role="tablist"` semantics, `prefers-reduced-motion` respected everywhere (intro, marquee, sticker, hovers).
- Tap targets ≥ 44×44px.
- Lighthouse (mobile) targets: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- No layout shift from the intro, fonts (`next/font` handles this), or images (always pass dimensions).
- Video and PDFs are never preloaded (only the poster).

---

## 10. Repo + deploy

1. Create the Next.js app (TypeScript, Tailwind, App Router, ESLint, `src/` dir).
2. Copy `content/` → `/content`, `public/` → `/public`, `HANDOFF.md` → `/docs/HANDOFF.md`, `reference/` → `/docs/reference/`.
3. Suggested structure:
   ```
   src/app/(site)/page.tsx, projects/page.tsx, projects/[slug]/page.tsx, learn/, team/, about/, join/
   src/app/layout.tsx           ← theme script, fonts, Header, Footer, <BootIntro/>
   src/components/intro/        ← BootIntro.tsx, wires.ts, LionOutline.tsx
   src/components/ui/           ← Button, Chip, Card, Badge, Sticker, Marquee, Tabs, Carousel, Lightbox, VideoPlayer
   src/lib/content.ts           ← typed loaders + TypeScript types for each JSON file
   ```
4. Type every JSON file (`Project`, `Officer`, `Video`, …) and validate at build time (a small zod schema is fine) so a typo in JSON fails the build with a clear message instead of breaking the site.
5. Git: repo **`wirelion-site`** under GitHub user `kaedenwellman` (unless Kaeden says a club org). Commit in logical steps. `main` = production.
6. Vercel: import the repo, framework auto-detected, no env vars, deploy. Preview deployments on every PR.
7. Custom domain: none yet. Use the `*.vercel.app` URL; leave a README note on adding one.

### README must include: "How to update the site (no coding needed)"
- **Add a project:** drop images in `/public/projects/<slug>/`, add an entry to `/content/projects.json` (copy an existing one), commit & push → Vercel redeploys in ~1 minute.
- **Add a tech doc:** put the PDF in `/public/docs/`, set `doc.src`.
- **Update officers:** edit `/content/team.json`; add photos to `/public/team/<slug>.webp`.
- **Add socials:** fill in `/content/site.json → social`.
- **Mark a project complete:** change `status`.

---

## 11. Build order + acceptance checklist

Build in this order and check in with Kaeden after milestones 2 and 4:

1. **Scaffold + tokens + theme toggle** (no-flash script works, persists, both themes look right).
2. **Static pages with real content** (Home, Projects grid w/ filters + search, Project detail, Learn, Team, About, Join, 404, Footer). ✅ Check-in: deploy a Vercel preview.
3. **Polish:** hover/press states, marquee, sticker, carousel, lightbox, tabs, mobile menu, coming-soon placeholder + pumpkin.
4. **Boot intro** (outline SVG, wires, ignite, FLIP to header, skip, session logic, reduced motion, debug mode). ✅ Check-in: preview link + a screen recording.
5. **SEO/OG/icons, accessibility pass, Lighthouse pass, README.**

**Done means all of these are true:**
- [ ] Intro plays once per session, ≤ 4s, smooth on a throttled phone, skippable by button/key/tap, lands precisely in the header mark, and is fully skipped under reduced motion.
- [ ] `/?intro=1` replays; `/?introDebug=1` shows outline alignment.
- [ ] CREAM/BLACK toggle works on every page, persists, no flash.
- [ ] Projects filter + search work and sync to the URL.
- [ ] Every project page renders all available tabs; PDFs download; pending doc state shows correctly.
- [ ] Video plays inline on iOS Safari and Android Chrome, no autoplay.
- [ ] No phone number, no meeting times, no fake content, no empty social links anywhere.
- [ ] All images have alt text; keyboard-only navigation works everywhere.
- [ ] Lighthouse mobile targets met.
- [ ] README "How to update the site" section exists.

---

## 12. Open items (Kaeden will supply; build placeholders that hide cleanly)

- Social links (Instagram, Discord, LinkedIn, GitHub, YouTube).
- Traffic light tech doc (PDF) + contributor list + confirm skill level; cycle timing is not stated on the site until the doc confirms it.
- Jack-o'-lantern competition date/rules + photos afterward.
- Officer photos/bios (optional).
- Confirm Daniel Bustos is OK with his email being public (else swap a club inbox or hide via `showEmail: false`).
- Confirm the video creator's name spelling (Matthew Barker vs. "Matthew Smith Baker" in the HU-001C doc).
- Confirm the museum's full name for the gallery caption.
- Everyone pictured is OK with being on a public site.
- Higher-resolution logo / original vector file if one exists (current: 512px). If an SVG appears later, replace `lion-outline.svg` with paths derived from it.
