# 4. Media guide — adding photos and videos

Photos and videos are **not** stored in the repository. The media tool processes them on your computer, uploads them to **Cloudflare R2**, and prints the JSON you paste into `content.json`. The site then loads them from the media Worker.

## One-time setup

1. **Node 24** and `npm install` (see README).
2. **ffmpeg + ffprobe** on your PATH (videos only):
   - macOS: `brew install ffmpeg`
   - Windows: `winget install ffmpeg` (or download from ffmpeg.org and add `bin/` to PATH)
   - Check: `ffmpeg -version` and `ffprobe -version`
3. **R2 credentials** in a file named **`.env.local`** in the project root (never commit it — it is git-ignored):
   ```
   R2_ACCOUNT_ID=<Cloudflare account ID>
   R2_ACCESS_KEY_ID=<R2 API token access key>
   R2_SECRET_ACCESS_KEY=<R2 API token secret>
   R2_BUCKET=bi-media
   ```
   Create the token in Cloudflare → **R2** → **Manage R2 API Tokens** → *Object Read & Write*, scoped to the `bi-media` bucket. The script refuses to run if any value is missing.

## Adding media

```bash
npm run media:add -- "path/to/photo 1.jpg" "path/to/photo 2.jpg" path/to/film.mp4
```

For each file the tool:
1. Computes a content hash (same file → same key, never uploaded twice).
2. **Photos:** rotates by camera orientation, creates `full.webp` (up to 3840×2160, visually identical) and `thumb.webp` (up to 1280×720), keeps the original as a private backup.
3. **Videos:** repackages the original H.264 stream into HLS (6-second segments) **without re-encoding** (no quality loss). Heavy videos (> 4 Mbps and taller than 720p) also get a lighter 720p level for slower connections.
4. Uploads only what isn't already in the bucket.
5. Prints the JSON entry, e.g.:
   ```json
   { "type": "image", "full": "m/…/full.webp", "thumb": "m/…/thumb.webp", "width": 2048, "height": 1536 }
   ```

Paste each entry into the right place in `content.json` ([content guide](03-content-guide.md)).

### Videos need a poster image

Each video entry has a `thumb` (poster shown before playback and in the media row). Export a frame and upload it too:

```bash
ffmpeg -ss 1 -i film.mp4 -frames:v 1 -q:v 2 film-poster.jpg   # frame at 1 second
npm run media:add -- film-poster.jpg
```

Then combine the two outputs:

```json
{ "src": <video entry>, "thumb": <poster image entry>, "caption": "Short title" }
```

If second 1 is black (fade-in), use a later time, e.g. `-ss 5`.

## Video requirements

| Requirement | Why | Fix |
|---|---|---|
| **H.264** codec | HLS in browsers; the tool copies the stream as-is | Non-H.264 (HEVC/H.265, ProRes…) is rejected on purpose — convert first (below) |
| **Upright pixels** | HLS drops rotation metadata, so phone clips recorded with a rotation flag play **sideways** | Convert first (below) |
| MP4 or MOV | Accepted extensions | — |

Check a file:
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height:stream_side_data=rotation -of default=nw=1 clip.mov
```
- `codec_name=hevc` → convert.
- A `rotation=-90` / `90` line → convert.

**Convert** (makes H.264, applies rotation, max 1080×1920 for portrait / use `1920:1080` for landscape):
```bash
ffmpeg -i clip.mov -map 0:v:0 -map 0:a:0? \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease" \
  -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart -metadata:s:v rotate=0 clip-upright.mp4
npm run media:add -- clip-upright.mp4
```

## Photo tips

- JPG, JPEG, PNG and WebP work; phone orientation is applied automatically. iPhone **HEIC** photos: export/convert to JPG first (e.g. macOS Preview → Export, or `sips -s format jpeg in.heic --out out.jpg`).
- Very large files are fine; output is resized to 4K max.
- Exact duplicates (same file twice) produce the same key — only include it once in `content.json`.
- Portraits vs landscapes: both work everywhere; the lightbox keeps the exact shape.

## Where media is stored and served

| | |
|---|---|
| Bucket | Cloudflare R2 **`bi-media`** |
| Public URL base | `VITE_MEDIA_BASE_URL` in `.env` (the `bi-media` Worker) |
| Public keys | `m/<hash>/…` |
| Private keys | `originals/<hash>.<ext>` — backup of original photos; the Worker never serves them. **Never** reference `originals/` in `content.json`. |
| Caching | Files are immutable (`max-age=1 year`); keys change when content changes |

The Worker source is [`workers/media/worker.js`](../workers/media/worker.js) (Cloudflare Worker **`bi-media`**, R2 binding `MEDIA → bi-media`). It supports range requests (video seeking) and CORS.

## Changing processing settings

Settings live in [`scripts/media/lib.mjs`](../scripts/media/lib.mjs) (sizes, quality, HLS segment length, 720p threshold). If you change them, **bump** `IMAGE_VERSION` / `VIDEO_VERSION` in the same file — the version is part of the key, otherwise the CDN would keep serving the old outputs. Re-run `media:add` for affected files and update their keys in `content.json`.

## Local output

Processed files are written to `media-build/out/` (git-ignored) before upload. You can delete that folder any time.

## Verifying uploads

Open a key in the browser: `<VITE_MEDIA_BASE_URL>/m/<hash>/thumb.webp`. It should show the image (a `404` means it was not uploaded or the key is wrong).
