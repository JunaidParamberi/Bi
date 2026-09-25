# 9. Handover & accounts

Everything needed to take full ownership of the project.

## What exists

| Resource | Where | Purpose |
|---|---|---|
| Source code | GitHub repository (this repo) | All code, content, docs |
| Site hosting | Cloudflare Pages project **`bi-imeta`** | Builds `main` → https://bi-imeta.pages.dev |
| Custom domain | `bi.moonframestudio.com` (DNS at GoDaddy, CNAME → `bi-imeta.pages.dev`) | Optional branded URL |
| Media storage | Cloudflare R2 bucket **`bi-media`** | All photos & videos (`m/…` public, `originals/…` private) |
| Media delivery | Cloudflare Worker **`bi-media`** (binding `MEDIA → bi-media`) | Public media URL = `VITE_MEDIA_BASE_URL` in `.env` |
| Upload credentials | R2 API token (in each editor's `.env.local`) | Needed only to add media |
| Brand assets | `src/fonts`, `src/assets` | Boehringer Ingelheim fonts, logo, artwork (client-licensed) |

## Transfer checklist

**GitHub**
- [ ] Transfer the repository to the client's GitHub organisation (Settings → *Transfer ownership*) **or** add the client as admin.
- [ ] Consider making the repository **private** (Settings → *Danger zone → Change visibility*) — it contains client content.
- [ ] After a transfer, reconnect Cloudflare Pages to the new location (Pages → bi-imeta → Settings → *Builds → Git repository*), then merge a small change to confirm auto-deploy works.

**Cloudflare**
Either invite the client to the current account (Manage account → *Members*, role *Administrator*) or move resources to their account:
- [ ] **Pages:** create a project in their account from the (transferred) repo with: build `npm run build`, output `dist`, env `NODE_VERSION=24`, production branch `main`.
- [ ] **R2:** create bucket `bi-media` and copy all objects (e.g. `rclone sync` between the two R2 accounts), keeping keys identical.
- [ ] **Worker:** deploy `workers/media/worker.js` as `bi-media` with R2 binding `MEDIA → bi-media`.
- [ ] Update `VITE_MEDIA_BASE_URL` in `.env` to the new Worker URL (or a custom media domain) and deploy.
- [ ] Create a new **R2 API token** (Object Read & Write on `bi-media`) for content editors; revoke the old one.

**Domain**
- [ ] Decide the final URL. Add it in Pages → *Custom domains* and point DNS as instructed. Remove `bi.moonframestudio.com` if no longer wanted.

**Secrets**
- [ ] `.env.local` is never committed. Share new R2 credentials only with people who add media, via a password manager.

## Running costs

At this project's scale Cloudflare's free tiers typically cover Pages hosting and Worker requests; R2 bills storage beyond the free allowance (media is a few GB) with **no egress fees**. Check the Cloudflare billing page after transfer.

## Who does what (suggested)

| Task | Skills needed | Guide |
|---|---|---|
| Edit text, reorder media, add articles | JSON editing, GitHub PR | [Content](03-content-guide.md), [Deployment](05-deployment.md) |
| Add photos/videos | Command line, ffmpeg | [Media](04-media-guide.md) |
| Design/behaviour changes | React, TypeScript, Tailwind | [UI](06-ui-design-system.md), [Recipes](07-making-changes.md) |
| Hosting/domains | Cloudflare dashboard | [Deployment](05-deployment.md) |
