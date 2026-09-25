# Boehringer Ingelheim · IMETA · SD4G Interactive Screen

An interactive, touch-friendly showcase of Boehringer Ingelheim's **Sustainable Development for Generations (SD4G)** work across the **IMETA** region (India, Middle East, Turkey and Africa). It runs full-screen on large displays (1080p to 4K) and in any modern browser.

| | |
|---|---|
| **Live site** | https://bi-imeta.pages.dev (custom domain: https://bi.moonframestudio.com) |
| **Hosting** | Cloudflare Pages (site) · Cloudflare R2 + Worker (photos & videos) |
| **Stack** | React 19 · TypeScript 7 · Vite 8 · Tailwind CSS 4 · Framer Motion · react-globe.gl · hls.js |
| **Content** | One file: [`src/content/content.json`](src/content/content.json) |

---

## Quick start

```bash
nvm use            # Node 24 (pinned in .nvmrc)
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/ (run before every commit)
npm run preview    # serve dist/ locally
```

There is no test suite; `npm run build` is the check (TypeScript + build). A green build is required before merging.

## Documentation

Start with the overview, then jump to what you need.

| # | Guide | Read it when you want to… |
|---|---|---|
| 1 | [Project overview](docs/01-overview.md) | understand what the screen does, page by page |
| 2 | [Architecture & tech stack](docs/02-architecture.md) | understand how the code, hosting and media fit together |
| 3 | [Content guide](docs/03-content-guide.md) | edit text, add an article, a country, a story or a team member |
| 4 | [Media guide](docs/04-media-guide.md) | add photos or videos |
| 5 | [Deployment](docs/05-deployment.md) | publish changes, preview them, roll back |
| 6 | [UI & design system](docs/06-ui-design-system.md) | change colours, fonts, sizes, animations; understand screen scaling |
| 7 | [Making code changes](docs/07-making-changes.md) | step-by-step recipes for common changes |
| 8 | [Troubleshooting](docs/08-troubleshooting.md) | something looks wrong or a build fails |
| 9 | [Handover & accounts](docs/09-handover.md) | take over ownership: accounts, access, secrets |

## Most common task: update content

1. Edit [`src/content/content.json`](src/content/content.json) (text) — see the [content guide](docs/03-content-guide.md).
2. For new photos/videos run `npm run media:add -- <files>` and paste the printed entries — see the [media guide](docs/04-media-guide.md).
3. `npm run build`, commit on `dev`, open a PR `dev → main`, merge. The live site updates in about a minute — see [deployment](docs/05-deployment.md).

## Repository layout

```
├── src/
│   ├── content/          content.json (all text + media keys) and its TypeScript types
│   ├── pages/            one file per screen (globe, map, country, stories, story, team)
│   ├── components/       shared UI (navbar, map, video player, lightbox, loaders…)
│   ├── hooks/            keyboard, lightbox and popup-positioning logic
│   ├── assets/           icons, map artwork, backgrounds bundled with the app
│   ├── fonts/            Boehringer Forward brand fonts
│   ├── App.tsx / App.css app shell, routes, global styles
│   ├── main.tsx          entry point
│   └── boot.ts           startup (loading) screen control
├── scripts/media/        photo/video processing + upload tool (npm run media:add)
├── workers/media/        Cloudflare Worker that serves media from R2
├── public/_headers       Cloudflare Pages headers (noindex, caching)
├── docs/                 this documentation
└── AGENTS.md             short notes for AI coding assistants
```
