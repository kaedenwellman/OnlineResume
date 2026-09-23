# Kaeden Wellman — Portfolio Site

Personal resume/portfolio site. People reach it by scanning a QR code on Kaeden's business card, so **most visitors are on a phone**. Treat mobile as the primary layout.

## Stack and deploy

- Plain static site: one `index.html` with inline CSS and JS. No framework, no build step, no package.json.
- Hosted on **Vercel**, connected to this GitHub repo. Every push to `main` deploys automatically.
- Vercel settings: Framework Preset "Other", build and output settings blank.
- Only external dependency: the Google Fonts stylesheet for **Archivo** (variable, `wdth` 62–125). Fallback: Helvetica Neue / Arial.

## Files

```
/index.html     the entire site
/resume.pdf     resume served by "View my full resume" and "Download PDF"
/media/         slide photos and videos (create when first needed)
/CLAUDE.md      this file
```

`index.html` must stay at the repo root, not in a subfolder.

## How content works

All content lives in one editable block at the top of the `<script>` in `index.html`, between the `EDIT EVERYTHING HERE` comment and the closing `=====` comment:

- `PROFILE`: phone, email, GitHub, LinkedIn, resume path.
- `SLIDES`: array of slides in display order. Fields:
  - `section`: resume section name. The section tabs above the carousel are generated from the unique values, in order of first appearance.
  - `title`, `role` (gold subtitle line)
  - `body` (paragraph) and/or `points` (array of bullet strings)
  - `link`: `{ label, href }` or `null`. Shows as a gold link under the text.
  - `tint`: hex color for the placeholder art shown when there's no media.
  - `media`: `null`, or `{ type: "image", src: "/media/x.jpg" }`, or `{ type: "video", src: "/media/x.mp4" }`. Videos autoplay muted and looped, only on the current slide. Optional `position` (CSS `object-position`, e.g. `"center 15%"`) picks which part of the image stays in frame when it's cropped.
- `FUTURE`: items in the "Future projects" popup (`title`, `body`).

To change content, edit these data structures. Don't hand-edit rendered HTML.

## Source of truth

**`resume.pdf` is the main source of info.** Slides mirror the resume section by section, in the resume's order and closely following its wording: About (summary), Education, Projects, Teaching & leadership, Work, Skills, Awards. When the resume changes, update the slides to match and replace `resume.pdf`.

The Future projects popup is the one place for things not on the resume (currently Realtor Hub and KW Digital Office).

## Layout (from Kaeden's original sketch — keep it)

- Pure black background (`#000`).
- Name top left, phone and email top right. On phones these become two tap-to-call / tap-to-email buttons.
- Center: carousel with the current slide large and the previous/next slides dimmed and peeking in from the sides, with ‹ › arrows between them. Supports swipe, arrow keys, clicking a side slide, and the section tabs.
- Under the slide: title, role, body/bullets, link, and an "n / total" counter.
- Bottom bar: "Future projects" (left), "View my full resume" button with a "Download PDF" link under it (center), LinkedIn and GitHub (right). On phones the resume button spans the full width on top.

## Design tokens

- `--bg #000000`, `--ink #EDEBE6`, `--muted #8C8A85`, `--line #262626`
- `--gold #CFB87C` (UCCS gold), the only accent color
- Font: Archivo. The name uses a wide stretch (125%) at weight 850. Placeholder art uses a condensed stretch (62%).
- Keep it restrained: one accent color, no gradients on UI, no extra animations. Respect `prefers-reduced-motion`.

## Open to-dos

- [ ] Add photos and videos for each slide (into `/media/`, then set `media` on the slide). Compress images to roughly 1600px wide; keep videos short and small (under about 5 MB) since visitors are on cellular.
- [ ] Add the Link Crew Website URL (GitHub Pages) as that slide's `link`.
- [ ] Add the HOA Website URL, if public, as that slide's `link`.
- [ ] Confirm the Lightsaber Duel repo URL (`https://github.com/kaedenwellman/lightsaber`).
- [ ] Resume PDF fixes: the lightsaber repo line runs into the "Gyftloop" heading; "Graduating May 2026" should be "Graduated"; UCCS "Incoming Fall 2026" should be "Fall 2026 – Present". Then replace `resume.pdf`.
- [ ] Optional: custom domain (for example kaedenwellman.com) via Vercel → Settings → Domains.
- [ ] **Last step:** generate the QR code for the final URL (the custom domain if there is one). The printed code can't change, so the URL it points to must never change either. Never rename or delete the Vercel project after cards are printed.

## Before pushing, check

- Page loads with no console errors.
- Test at about 390px wide (phone) and desktop. No horizontal scroll on the page body.
- Swipe, arrows, section tabs, and the Future projects popup all work.
- Tel and mailto links, resume open and download, and every slide `link` work.
- Commit messages are short and describe the change (for example "Add Gyftloop screenshot").
