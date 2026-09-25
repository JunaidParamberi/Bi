# 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Build fails with a JSON error | Typo in `content.json` (missing/extra comma, unescaped `"`) | Read the line number in the error; fix quotes/commas. VS Code highlights it. |
| Build fails on Cloudflare but works locally | Wrong Node version | Pages env var `NODE_VERSION=24` (Vite 8 needs ≥ 20.19) |
| Change merged but live site unchanged | Build still running or browser cache | Check Pages → Deployments; hard-refresh (<kbd>Ctrl/Cmd</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) |
| Photo/video shows empty or loading forever | Key typo or file not uploaded | Open `<VITE_MEDIA_BASE_URL>/<key>` in the browser; re-run `media:add` |
| Photo URL returns 404 and key starts with `originals/` | Private backup key used | Use the `m/<hash>/full.webp` / `thumb.webp` keys only |
| Video plays **sideways** | Phone clip with rotation metadata | Convert to upright H.264 ([media guide](04-media-guide.md#video-requirements)) and re-upload |
| `media:add` says "expected h264, got hevc" | HEVC/H.265 video | Convert with the ffmpeg command in the media guide |
| `media:add` says "Missing R2_… in .env.local" | No credentials | Create `.env.local` ([media guide](04-media-guide.md#one-time-setup)) |
| `media:add` fails with `ffprobe` not found | ffmpeg not installed / not on PATH | Install ffmpeg |
| New tab doesn't highlight / two tabs highlight | Duplicate `heading` in one country | Make headings unique |
| Pin click shows nothing | `country` in `markers` doesn't match `content.json` | Make the names identical |
| Country page 404 / blank | URL name mismatch | URLs use the exact `country` value (`/world/South%20Africa`) |
| Particles look white/grey | Colour set with old `particles.color` key | Use `particles.paint.fill.color` (tsParticles v4) |
| Things look tiny or lines hair-thin in DevTools at 4K | DevTools "Fit to window" scaling | Set zoom to 100 % or test on the real screen |
| Layout has empty bands at the sides/top | Screen isn't 16:9 | Expected: the 16:9 stage is centred, background fills the rest |
| Something sticks out on some screens | New code used `vw`/`vh` or fixed px | Use `cqw`/`cqh` and `--line-*` tokens |
| Open tab shows an error/loader after a deploy | Old page chunks were replaced | The app reloads itself once automatically (`ChunkErrorBoundary`); otherwise refresh |
| `npx eslint` fails | ESLint isn't installed (config file is a leftover) | Not part of the workflow; ignore or install eslint deliberately |
| `_redirects` breaks deploy ("infinite loop") | `/* /index.html 200` rule added | Delete it — Pages handles SPA routes by default |

## Useful commands

```bash
npm run dev                         # local dev server
npm run build && npm run preview    # test the exact production build
npx tsc --noEmit                    # type-check only
ffprobe -hide_banner file.mp4       # inspect a video
git log --oneline -20               # recent changes
```

## Getting logs

- **Site builds:** Cloudflare → Workers & Pages → bi-imeta → Deployments → click a deployment → build log.
- **Media Worker:** Cloudflare → Workers & Pages → bi-media → Logs (enable *Real-time logs*).
- **Browser:** DevTools → Console / Network (filter by the media host to see image/video requests).
