# nebo.music

Single-page landing site for Jane Stark.

## What's here

```
site/
├── index.html          ← the page
├── styles.css          ← single stylesheet
├── script.js           ← mobile menu, fade-in, painting lightbox
├── data/
│   ├── albums.json     ← Spotify catalogue (used by build for embed list)
│   └── paintings.json  ← gallery items (used to refresh §10 without HTML edits)
└── images/
    ├── kirtan/         ← hero, retreat photos
    ├── paintings/      ← 8 selected paintings + /thumbs/ for the grid
    └── homestead/      ← (currently empty — Homestead photo is hot-linked from telegra.ph)
```

## To preview locally

Any static server works. From this folder:

```sh
# Python (built in on most systems)
python3 -m http.server 8080

# or Node
npx http-server -p 8080
```

Then open http://localhost:8080.

> Note: Spotify's embed iframe and Google Fonts will not load if you open `index.html` via `file://` — always use a local server.

## To deploy

Any static host. Recommended (all free, all support `.music` TLD, all give automatic SSL):

### Cloudflare Pages
1. Create a new project, connect a Git repo containing this folder, or drag-and-drop the `site/` folder.
2. Build settings: leave blank (no build step).
3. Output directory: `/` (root of what you upload).
4. Add custom domain: `nebo.music`. Cloudflare will guide DNS.

### Netlify
1. `netlify deploy --dir site --prod` from the project root, or drag-and-drop on the dashboard.
2. Site → Domain management → Add custom domain → `nebo.music`. Netlify provides DNS records.

### Vercel
1. `vercel deploy site` (or import the Git repo).
2. Settings → Domains → Add `nebo.music`.

### DNS (whichever host)
Point the apex `nebo.music` and `www.nebo.music` records as the host instructs. Most ask for an A record on apex and a CNAME on www. Cloudflare Pages and Netlify also support full nameserver delegation if you'd rather hand them the whole zone.

## Editing later

**Copy edits:** `index.html` is plain HTML. Find the section by its `id` (e.g. `#kirtan`, `#painting`) and edit in place.

**New painting in the gallery:**
1. Drop the original at `images/paintings/NN_some_title.jpg`.
2. Make a thumbnail at `images/paintings/thumbs/NN_some_title.jpg` (~900 px wide, ~80 % JPEG).
3. Add a new `.painting` block in §10 of `index.html`, copying an existing one, and change the `src`, `data-full`, `data-title`, `data-meta`, and `alt`.
4. Also update `data/paintings.json` for completeness.

**Update kirtan retreat dates:**
Search `index.html` for `14 – 21 February 2027` and replace.

**Change contact channels:**
Telegram and WhatsApp links appear in §4, §5, §6, §7, §8, §9, §10, and footer. Find with your editor and replace.

**Spotify catalogue:**
Each `<a class="album">` tag has a Spotify URL. Album IDs are in `data/albums.json`. To swap a release, copy the album ID from Spotify (it's the last segment of the share URL) and update both files.

## Phase 2 — booking concierge

The contact CTAs all point to a single Telegram (`@JaneStarck`) and WhatsApp (`+506 6009 7884`). When the AI booking concierge is ready (Phase 2), no HTML changes will be required: the same endpoint stays, but the recipient becomes a bot that triages by intent (kirtan retreat, voice session, constellation, painting, systemic mapping, homestead) and offers Jane a calendar overlay.

## Performance & accessibility notes

- Cormorant Garamond + Inter loaded from Google Fonts with `display=swap` (no FOIT).
- All images below the fold are `loading="lazy"`.
- `prefers-reduced-motion` respected on hero drift and section fade-in.
- Skip-to-content link for screen readers.
- Lightbox keyboard-accessible (Enter/Space to open, Esc to close, focus restored).
- Logical heading order; one `<h1>`, sections as `<h2>`, sub-cards as `<h3>`.
- All accent colors used decoratively only; body text contrast ≈ 16:1 (WCAG AAA).

## Known follow-ups

- **Hero image** — currently uses the Press-Kit photo. If a higher-resolution version exists, swap in at `images/kirtan/hero-kirtan.jpg`.
- **Album covers** — currently CSS gradients in the palette. Real Spotify cover art can be wired in by adding `<img>` tags inside each `.cover` div, or by fetching from the Spotify Web API at build time.
- **Homestead photos** — currently one photo hot-linked from telegra.ph. To migrate to local hosting, save the image into `images/homestead/` and update the `background-image` URL in `styles.css` (`.homestead-grid .photo`).
- **Painting titles, dimensions, prices** — working titles in place; Jane to confirm and replace with her own.
- **AI booking concierge** — Phase 2 project; out of scope here.
