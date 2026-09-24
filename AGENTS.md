# AGENTS.md

React 18 + TypeScript + Vite 8 + Tailwind 3 single-page app (Boehringer Ingelheim IMETA SD4G site). Not a monorepo; npm only (`package-lock.json` — don't introduce pnpm/yarn).

## Commands

- Node 24 (LTS) is pinned via `.nvmrc` (Cloudflare Pages also sets `NODE_VERSION=24`; Vite 8 requires ≥20.19/22.12 — Node 18 will fail the build)
- `npm run dev` — dev server
- `npm run build` — **this is also the typecheck**: `tsc && vite build`. Run it before considering work done.
- Typecheck only: `npx tsc --noEmit`
- `npm run preview` — serve `dist/` locally
- `npm run media:add -- <file...>` — process + upload media (see below)
- No test suite and no lint script exist. `.eslintrc.cjs` is present but ESLint is **not** in `devDependencies`, so `npx eslint` will fail without installing it first. Don't invent `npm test` / `npm run lint`.

## Routing / hosting gotchas

- Routing is `BrowserRouter` (history API), **not** hash routing, and `vite.config.ts` sets `base: '/'` explicitly so deep links like `/world/Kenya` resolve assets. The README's claim of "relative asset paths and hash routing" is stale — trust the config.
- Production hosting is **Cloudflare Pages** (project `bi-imeta`, builds `main` → `dist/`, live at https://bi.moonframestudio.com via a GoDaddy CNAME to `bi-imeta.pages.dev`). Pages serves `index.html` for unknown routes by default; `public/_headers` sets noindex and long-lived asset caching.
- Don't add `public/_redirects` with `/* /index.html 200`: Cloudflare rejects it as an infinite loop. Netlify and Vercel hosting have been removed; Cloudflare Pages is the only host.

## Content & media pipeline

- All page content lives in `src/content/content.json` (large, hand-edited). Types and the `mediaUrl()` helper are in `src/content/index.ts`. The comment there referencing `scripts/media/build-media.mjs` is stale — that script doesn't exist; content entries are pasted manually.
- Media is **not** committed. `npm run media:add` processes a file (sharp for images, ffmpeg/ffprobe for h264 videos → HLS), uploads to Cloudflare R2, and prints a JSON entry you paste into `content.json`. Output goes to `media-build/out/` (gitignored).
  - Requires `ffmpeg`/`ffprobe` on PATH and R2 creds in `.env.local`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`. The script reads `.env.local` itself; missing vars throw.
  - Keys are content hashes + a version (`IMAGE_VERSION` / `VIDEO_VERSION` in `scripts/media/lib.mjs`). Bump the version when processing settings change, or the CDN will keep serving stale outputs.
  - `originals/` stays private; only `m/` keys are served publicly (`workers/media/worker.js`, Cloudflare Worker "bi-media"). Never reference `originals/` from the app.
  - Videos must be h264; non-h264 input fails by design.
- Env split: `.env` holds public build settings (`VITE_MEDIA_BASE_URL`), `.env.local` holds secrets and is gitignored (as is the whole `media-build/` dir).

## App structure

- Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. Routes are declared centrally in `App.tsx`; each page is `React.lazy` and prefetched on idle — new pages must be added to both the `lazy` list and the prefetch array.
- Startup overlay logic is in `src/boot.ts`: `bootReady()` must be called for `'fonts'`, `'background'`, and `'page'` or the loader never hides (15s max fallback). New page types should report `'page'`.
- `BrowserRouter useTransitions={false}` is intentional (instant route swaps).
- Layout component is spelled `GenerelLeyout` (sic) in `src/components/GenerelLeyout.tsx` — match the existing name, don't "fix" imports.
- `vite.config.ts` has `assetsInclude: ['**/*.JPG']` (uppercase) — unusual extension casing matters for how those assets are bundled.
- Heavy deps (globe, map pages) are lazy-loaded on purpose; keep route-level code splitting intact.
