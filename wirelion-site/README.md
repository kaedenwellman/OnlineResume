# Wire Lion Engineering Club website

The official site for the **Wire Lion Engineering Club**, a student-led electrical & computer engineering club at UCCS.
Next.js (App Router, TypeScript) + Tailwind CSS. Every page is statically generated: no server, no database, no environment variables.

The full build spec is in [`docs/HANDOFF.md`](docs/HANDOFF.md); design references are in `docs/reference/` (not used on the public site).

---

## How to update the site (no coding needed)

All words, links and lists on the site come from four files in **`/content`**. Images, videos and PDFs live in **`/public`**.
Edit on GitHub (pencil icon → "Commit changes" on `main`) and Vercel redeploys in about a minute.

If a JSON file has a typo (a missing comma, a misspelled status), the deploy **fails instead of breaking the live site**, and the Vercel build log says exactly which file and field is wrong. The live site keeps running the last good version until it's fixed.

Fields that start with `_` (like `_note`) are notes for humans. They are never shown on the site.

### Add a project
1. Make a folder `/public/projects/<slug>/` (slug = lowercase-with-dashes, e.g. `line-follower-robot`) and drop in `.webp` or `.jpg` images (about 1000–1600px wide).
2. In `/content/projects.json`, copy an existing project block, paste it where you want it in the list (order = display order), and change the fields:
   - `status`: `COMPLETE`, `IN PROGRESS` or `UPCOMING` (an `IN PROGRESS` filter chip appears automatically when one exists)
   - `images`: each `{ "src": "/projects/<slug>/photo.webp", "alt": "describe the photo" }`. Leave `[]` for a designed "COMING SOON" card.
   - Optional detail tabs only appear if they have data: `specs`, `build`, `troubleshooting`, `contributors` (or `contributorsFallback`), `concepts`.
3. Commit & push.

### Add a tech doc
Put the PDF in `/public/docs/` and set the project's `doc` to `{ "src": "/docs/<file>.pdf", "label": "DOWNLOAD TECH DOC (PDF)" }`.
While `doc` is `null`, the button shows `docPendingLabel` (e.g. `TECH DOC COMING SOON`), or the project's `cta` button if it has one.

### Mark a project complete
Change its `status` to `"COMPLETE"`. The home page "builds shipped" count updates itself.

### Update officers
Edit `/content/team.json`. To add a photo, save a square image as `/public/team/<slug>.webp` and set `"photo": "/team/<slug>.webp"`. An empty `photo` shows a letter avatar.

### Add social links
Fill in `/content/site.json → social` (full URLs). Empty values are hidden, never shown as dead links.

### Add a video
Add an entry to `/content/media.json → videos` (mp4 in `/public/video/`, plus a poster `.jpg`). Optional `captions`: a `.vtt` file path, rendered as a `<track>`.

---

## Developing

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also validates /content)
npm run lint
npm run typecheck
npm run outline    # regenerate public/brand/lion-outline.svg from src/components/intro/lionOutline.ts
```

### Structure
```
content/                  site copy + data (the only files most people need to touch)
public/                   brand, photos, project images, video, PDFs, icons
src/app/                  routes: /, /projects, /projects/[slug], /learn, /team, /about, /join, 404
                          plus opengraph-image, sitemap, robots, manifest, icons
src/components/intro/     BootIntro.tsx, lionOutline.ts (vector lion), wires.ts (wire routes)
src/components/ui/        cards, chips, carousel, lightbox, tabs, video player, sticker, marquee…
src/components/layout/    header, footer, theme toggle, wordmark
src/lib/content.ts        zod schemas + typed loaders for /content
```

### Boot intro
- Plays once per browser session (`sessionStorage['wl-intro-seen']`), skippable by button, Esc/Enter/Space, or a tap.
- `/?intro=1` replays it. `/?introDebug=1` shows the vector outline (magenta) over the logo, paused, for alignment checks.
- Wire routes are data in `src/components/intro/wires.ts` (512×512 logo coordinates); timings are the `T` table at the top of `BootIntro.tsx`.
- `prefers-reduced-motion`: no wires or flight; the static logo shows for 400ms, then fades.
- If it ever stutters on phones, reduce the wire count in `wires.ts` first.
- The intro logo is drawn through `<canvas>` so the decorative animation isn't counted as the page's Largest Contentful Paint.

### Themes
CREAM (default) and BLACK, switched in the header and saved in `localStorage['wl-theme']`. An inline script in `<head>` applies the saved theme before first paint, so there's no flash.

**Token changes from the handoff (for WCAG AA):**
- CREAM `--accent-blue` is `#0A66C2` instead of `#1C8CFF`. `#1C8CFF` on the paper background is 2.8:1, below the 4.5:1 needed for text; `#0A66C2` is 4.7:1. BLACK keeps Tron blue `#2EA8FF` (7.7:1 on `#07090D`).
- All other text/accent pairs already pass AA in both themes (lowest: muted ink on BLACK mint, 5.1:1).

### Other implementation notes
- **Font:** JetBrains Mono is self-hosted with `next/font/local` (files in `src/assets/fonts`, SIL Open Font License) rather than `next/font/google`, so builds never depend on reaching Google Fonts. The result in the browser is the same.
- The footer email is assembled in the browser, so it isn't plain text in the HTML.
- Analytics are **off**. To enable: `npm i @vercel/analytics`, add `<Analytics />` to `src/app/layout.tsx`, and turn on Web Analytics in the Vercel project (ask Kaeden first).

---

## Deploying (Vercel)

1. Push this folder to its own GitHub repo (planned name: `kaedenwellman/wirelion-site`). See "Moving to its own repo" below if it's still inside another repo.
2. In Vercel: **Add New → Project → Import** the repo. Framework is detected as Next.js. No environment variables. Deploy.
3. `main` is production; every pull request gets a preview URL.

The site uses the `*.vercel.app` URL for now. **To add a custom domain later:** Vercel project → Settings → Domains → add the domain and follow the DNS instructions. Canonical URLs, the sitemap and Open Graph tags pick up the production domain automatically (from `VERCEL_PROJECT_PRODUCTION_URL`); set `NEXT_PUBLIC_SITE_URL` to override.

### Moving to its own repo
This app was first built in the `wirelion-site/` folder of another repository. To give it its own history:
```bash
# from the parent repo
git subtree split --prefix=wirelion-site -b wirelion-site-only
# create an empty GitHub repo "wirelion-site", then:
git push git@github.com:kaedenwellman/wirelion-site.git wirelion-site-only:main
```

---

## Open items (waiting on Kaeden / officers)
Everything below is hidden cleanly until it's supplied:
- Social links (Instagram, Discord, LinkedIn, GitHub, YouTube) → `site.json → social`
- Traffic light tech doc, contributor list and skill level (cycle timing stays off the site until the doc confirms it)
- Jack-o'-lantern competition date/rules, and photos afterward
- Officer photos (optional)
- Confirm Daniel Bustos is OK with his email being public (or swap a club inbox / set `showEmail: false`)
- Confirm the video creator's name (Matthew Barker vs. "Matthew Smith Baker" in the HU-001C doc)
- Confirm the museum's full name for the gallery caption
- Confirm everyone pictured is OK being on a public site
- Higher-resolution or vector logo, if one exists (then regenerate `lion-outline.svg` from it)
