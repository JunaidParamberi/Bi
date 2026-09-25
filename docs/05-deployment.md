# 5. Deployment

The site is hosted on **Cloudflare Pages**. Publishing = merging into the `main` branch on GitHub. Cloudflare builds and goes live automatically in about 1 minute.

## Environments

| | Branch | URL |
|---|---|---|
| **Production** | `main` | https://bi-imeta.pages.dev · https://bi.moonframestudio.com |
| Preview | branches matching `upgrade/*` | `https://<hash>.bi-imeta.pages.dev` (shown in the Cloudflare dashboard / PR) |
| Local | any | `npm run dev` (live reload) or `npm run build && npm run preview` (exact production build) |

## Branch workflow

```
feature work ──► dev ──► Pull Request (dev → main) ──► merge ──► Cloudflare builds main ──► live
```

1. Work on `dev` (or a feature branch merged into `dev`).
2. `npm run build` must pass locally.
3. Push `dev`, open a PR **`dev → main`**, review the changes, **merge** (merge commit).
4. Watch the build in Cloudflare → **Workers & Pages** → **bi-imeta** → **Deployments**. It turns *Success* in ~1 min.
5. Hard-refresh the live site (<kbd>Ctrl/Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>). Screens that were already open reload themselves on the next navigation if their old files are gone.

Using the GitHub CLI:
```bash
git checkout dev && git pull
# …edit, npm run build…
git commit -am "content: …" && git push
gh pr create --base main --head dev --title "…" --body "…"
gh pr merge --merge
```

## Cloudflare Pages settings (project `bi-imeta`)

| Setting | Value |
|---|---|
| Git repository | GitHub, this repo |
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION=24` (production and preview) — Vite 8 needs Node ≥ 20.19 |
| Preview branches | custom: `upgrade/*` |
| Custom domain | `bi.moonframestudio.com` (CNAME at GoDaddy → `bi-imeta.pages.dev`) |

`VITE_MEDIA_BASE_URL` comes from the committed `.env` file, so no secret is needed on Pages.

### Headers — `public/_headers`
- `X-Robots-Tag: noindex, nofollow` on everything: the site is **hidden from search engines**. Remove that line if it should become public.
- `/assets/*` cached for a year (file names contain a content hash, so new builds always get new URLs).

### Routing
Real URLs (`/world/Kenya`) are served by Cloudflare Pages' single-page-app fallback (unknown paths return `index.html`). **Do not** add a `public/_redirects` file with `/* /index.html 200` — Cloudflare rejects it as an infinite loop.

## Rolling back

Fastest: Cloudflare → bi-imeta → **Deployments** → pick the last good deployment → **⋯ → Rollback to this deployment**. Live instantly.

Permanent: revert on GitHub and merge again:
```bash
git checkout main && git pull
git revert -m 1 <merge-commit-sha>
git push   # or via PR
```

## Media Worker deployment

The media Worker (`workers/media/worker.js`) is deployed separately and rarely changes. To update it:
- Cloudflare dashboard → **Workers & Pages** → **bi-media** → **Edit code** → paste `worker.js` → **Deploy**, or
- with Wrangler: `npx wrangler deploy workers/media/worker.js --name bi-media` (the R2 binding `MEDIA → bi-media` must stay configured on the Worker).

## Previewing a branch that is not `upgrade/*`

Either name it `upgrade/<something>`, add its pattern in Pages → **Settings → Builds → Branch control**, or test locally with `npm run build && npm run preview`.
