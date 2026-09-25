# 2. Architecture & tech stack

## At a glance

```
                    ┌──────────────────────── Cloudflare ────────────────────────┐
 GitHub repo        │                                                            │
 (main branch) ───► │  Pages project "bi-imeta"                                  │
   push/merge       │    npm run build → dist/  →  https://bi-imeta.pages.dev    │
                    │                              https://bi.moonframestudio.com│
                    │                                                            │
                    │  R2 bucket "bi-media"  ◄── npm run media:add (uploads)     │
                    │     m/<hash>/…  (public, via Worker)                       │
                    │     originals/… (private backup)                           │
                    │           ▲                                                │
                    │  Worker "bi-media" → https://bi-media.<subdomain>.workers.dev
                    └───────────┼────────────────────────────────────────────────┘
                                │ images (webp) + videos (HLS)
 Browser ── loads app from Pages ──► reads content.json (bundled) ──► fetches media from Worker
```

- **The site** (HTML/JS/CSS, fonts, map artwork, icons) is a static build hosted on **Cloudflare Pages**. Every merge to `main` rebuilds and publishes it automatically.
- **Photos and videos** are *not* in the repository. They live in a **Cloudflare R2** bucket and are served by a small **Cloudflare Worker**. `content.json` only stores their keys (e.g. `m/3631d748bc982056/full.webp`).
- **Content** (all text, lists, team, which media belong where) is one JSON file bundled into the build.

## Tech stack

| Layer | Technology | Why / where |
|---|---|---|
| UI framework | **React 19** | Components in `src/` |
| Language | **TypeScript 7** | Type-checked on every build (`tsc`) |
| Build tool | **Vite 8** | Dev server, production bundling, code-splitting |
| Styling | **Tailwind CSS 4** + `src/App.css` | Utility classes; theme in `tailwind.config.js` (loaded via `@config`) |
| Routing | **React Router 7** (`BrowserRouter`) | Real URLs like `/world/Kenya` |
| Animation | **Framer Motion 13** | Page, tab, popup, pin, modal animations |
| Background | **tsParticles 4** | Floating green particles (`ParticlesBackground.tsx`) |
| 3D globe | **react-globe.gl** (three.js) | Home page, loaded only on that page |
| Video | **hls.js** + custom player | Adaptive streaming, branded controls (`BrandVideoPlayer.tsx`) |
| Media processing | **sharp** (images), **ffmpeg/ffprobe** (videos) | `scripts/media/` (runs on your computer) |
| Media upload | **AWS SDK S3 client** → R2 | R2 is S3-compatible |
| Hosting | **Cloudflare Pages**, **Workers**, **R2** | See [deployment](05-deployment.md) |
| Runtime | **Node 24 LTS** | Pinned in `.nvmrc` and in Pages (`NODE_VERSION=24`) |

Package manager: **npm** only (`package-lock.json`).

## Source layout

```
src/
├── main.tsx                 Entry: starts the boot screen, blocks drag/context menu, mounts <App/> in BrowserRouter
├── App.tsx                  Shell: background image, particles, the 16:9 stage, routes, lazy pages + idle prefetch
├── App.css                  Global styles: fonts, colours, stage & line tokens, navbar, animations, scrollbars
├── boot.ts                  Startup screen: hides when 'fonts', 'background' and 'page' report ready (15 s max)
├── content/
│   ├── content.json         ALL content (countries, stories, team)
│   └── index.ts             Types for content.json + mediaUrl() + exports (countries, stories, team1, team2)
├── pages/
│   ├── GlobePage.tsx        /            3D globe
│   ├── MapPage.tsx          /world       map page, IMETA card + modal, disclaimer, buttons
│   ├── CountryPage.tsx      /world/:country   tabs, article, media row, lightbox
│   ├── MoreStories.tsx      /more        story cards
│   ├── StoryPage.tsx        /more/:title story detail + lightbox
│   └── TeamPage.tsx         /team        team cards + detail pop-ups
├── components/
│   ├── GenerelLeyout.tsx    Page frame: content area, navbar, BI logo (name is misspelled on purpose — keep it)
│   ├── Navbar.tsx           Bottom navigation with gliding active ring
│   ├── Map.tsx              Map image, pins (positions defined here), country card
│   ├── LightboxMedia.tsx    Media frame in the lightbox (keeps exact aspect ratio, loading state)
│   ├── BrandVideoPlayer.tsx HLS video player with branded controls, quality menu, full screen
│   ├── SmartImage.tsx       <img> with shimmer while loading + fade-in
│   ├── StoryCard.tsx        Card on the More Stories page
│   ├── ParticlesBackground.tsx  tsParticles config
│   ├── RadarWave.tsx        Radar rings on the globe page
│   ├── BrandLoader.tsx / PageLoader.tsx   Loading indicators
│   ├── ChunkErrorBoundary.tsx  Recovers if a page chunk fails to download (e.g. after a deploy)
│   └── Button.tsx           Pill button (More Stories / Team)
├── hooks/
│   ├── useFitInViewport.ts  Keeps pop-ups on screen (flip/nudge) — map card, team pop-up
│   ├── useLightbox.ts       Lightbox state, navigation, keyboard, focus return
│   └── useKeyboard.ts       Page keyboard shortcuts + arrow-key navigation in media rows
├── assets/                  Bundled images/icons (map, pins, backgrounds, arrows)
└── fonts/                   Boehringer Forward Head/Text (woff2)
```

## How a page renders

1. `index.html` paints the startup screen immediately (pure CSS).
2. `main.tsx` → `startBoot()`, mounts `<App/>`.
3. `App.tsx` renders the background + particles, then the **stage** (`.app-stage`) that holds all pages at 16:9.
4. The route's page is loaded on demand (`React.lazy`). When it mounts, `GenerelLeyout` reports `bootReady('page')` (the globe reports itself once its 3D scene is built).
5. Pages read content from `src/content` and build media URLs with `mediaUrl(key)` = `VITE_MEDIA_BASE_URL + "/" + key`.
6. Photos load as WebP (`thumb.webp` in rows, `full.webp` in the lightbox); videos stream from `master.m3u8`.

## Media storage model

| Key | Contents | Public? |
|---|---|---|
| `m/<hash>/full.webp` | Image, max 3840×2160, near-lossless | ✅ |
| `m/<hash>/thumb.webp` | Image, max 1280×720 | ✅ |
| `m/<hash>/master.m3u8`, `src.m3u8`, `src_0000.ts…` | Video (HLS) — original H.264 stream, untouched quality | ✅ |
| `m/<hash>/720p.m3u8`, `720p_…ts` | Extra lighter level for heavy videos | ✅ |
| `originals/<hash>.<ext>` | Original uploaded photo (backup) | ❌ (Worker refuses) |

`<hash>` is derived from the file's content plus a settings version, so the same file is only ever stored once and everything can be cached for a year. See the [media guide](04-media-guide.md).

## Environment variables

| File | Committed | Contents |
|---|---|---|
| `.env` | yes | `VITE_MEDIA_BASE_URL` — the media Worker URL used by the app |
| `.env.local` | **no** (git-ignored) | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` — only needed to upload media |

## Design decisions worth knowing

- **Content in JSON, not a CMS** — simple, versioned in git, no server to run. Trade-off: edits need a build/deploy (about a minute).
- **Media outside git** — keeps the repo small and lets the CDN cache aggressively.
- **Everything sized relative to a 16:9 stage** — one design works on every screen. See [UI & design system](06-ui-design-system.md).
- **Code-split pages + idle prefetch** — the 3D globe and map don't slow down other pages; navigation stays instant after load.
- **`BrowserRouter` with `useTransitions={false}`** — route changes swap immediately (animations are done by Framer Motion instead).
