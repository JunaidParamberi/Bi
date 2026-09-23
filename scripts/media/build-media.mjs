// Processes every media file referenced by the site data into CDN-ready output under media-build/out.
//   images -> m/<hash>/full.webp (fits 3840x2160), m/<hash>/thumb.webp (fits 1280x720), originals/<hash>.<ext>
//   videos -> m/<hash>/master.m3u8 with an untouched copy of the source stream (+ a 720p level for heavy files)
// Output keys are content hashes, so re-runs skip finished work and identical files are stored once.
// Writes media-build/content.json: the site data with every media import replaced by its CDN keys.
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile, mkdir, copyFile, readdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '../..');
const buildDir = path.join(root, 'media-build');
const outDir = path.join(buildDir, 'out');
const manifestPath = path.join(buildDir, 'manifest.json');

const VIDEO = /\.(mp4|mov)$/i;
const HLS_SEGMENT_SECONDS = 6;
// Only videos heavier than this get an extra 720p level; lighter ones already stream fine
const LOW_LEVEL_MIN_BITRATE = 4_000_000;
// Bump when processing settings change: output keys include it, so CDN caches never serve stale files
const IMAGE_VERSION = 2;
const VIDEO_VERSION = 2;

const raw = JSON.parse(await readFile(path.join(buildDir, 'data.raw.json'), 'utf8'));
let manifest = {};
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch {
  // first run
}

const hashFile = (file, version) =>
  new Promise((resolve, reject) => {
    const h = createHash('sha256').update(`v${version}:`);
    createReadStream(file).on('data', (d) => h.update(d)).on('end', () => resolve(h.digest('hex').slice(0, 16))).on('error', reject);
  });

async function processImage(src, hash) {
  const dir = path.join(outDir, 'm', hash);
  await mkdir(dir, { recursive: true });
  await mkdir(path.join(outDir, 'originals'), { recursive: true });

  // rotate() applies the camera's EXIF orientation before resizing
  const full = await sharp(src)
    .rotate()
    .resize({ width: 3840, height: 2160, fit: 'inside', withoutEnlargement: true })
    // near-lossless keeps the full view visually identical to the source (SSIM ~0.995)
    .webp({ nearLossless: true, quality: 60, effort: 5 })
    .toFile(path.join(dir, 'full.webp'));
  const thumb = await sharp(src)
    .rotate()
    .resize({ width: 1280, height: 720, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(dir, 'thumb.webp'));
  await copyFile(src, path.join(outDir, 'originals', hash + path.extname(src).toLowerCase()));

  return {
    type: 'image',
    full: `m/${hash}/full.webp`,
    thumb: `m/${hash}/thumb.webp`,
    width: full.width,
    height: full.height,
    bytes: full.size + thumb.size,
    sourceBytes: (await stat(src)).size,
  };
}

async function probe(src) {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', src]);
  const j = JSON.parse(stdout);
  const v = j.streams.find((s) => s.codec_type === 'video');
  const a = j.streams.find((s) => s.codec_type === 'audio');
  const [num, den] = v.r_frame_rate.split('/').map(Number);
  return {
    width: v.width,
    height: v.height,
    fps: num / den,
    duration: Number(j.format.duration),
    bitrate: Number(j.format.bit_rate),
    videoCodec: v.codec_name,
    audioCodec: a?.codec_name ?? null,
  };
}

async function keyframeTimes(src) {
  const { stdout } = await run(
    'ffprobe',
    ['-v', 'error', '-select_streams', 'v:0', '-skip_frame', 'nokey', '-show_entries', 'frame=pts_time', '-of', 'csv=p=0', src],
    { maxBuffer: 64 * 1024 * 1024 }
  );
  return stdout.split('\n').map((l) => l.trim().replace(/,$/, '')).filter(Boolean).map(Number);
}

async function peakBandwidth(dir, playlist) {
  // BANDWIDTH must be the peak segment bitrate, measured from the real segments
  const text = await readFile(path.join(dir, playlist), 'utf8');
  const lines = text.split('\n');
  let peak = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^#EXTINF:([\d.]+)/);
    if (!m) continue;
    const seg = lines[i + 1].trim();
    const { size } = await stat(path.join(dir, seg));
    peak = Math.max(peak, (size * 8) / Number(m[1]));
  }
  return Math.ceil(peak);
}

async function processVideo(src, hash) {
  const dir = path.join(outDir, 'm', hash);
  await mkdir(dir, { recursive: true });
  const info = await probe(src);
  if (info.videoCodec !== 'h264') throw new Error(`${src}: expected h264, got ${info.videoCodec}`);

  const audioArgs = info.audioCodec === 'aac' ? ['-c:a', 'copy'] : info.audioCodec ? ['-c:a', 'aac', '-b:a', '192k'] : [];
  const hlsArgs = (name) => [
    '-f', 'hls', '-hls_time', String(HLS_SEGMENT_SECONDS), '-hls_playlist_type', 'vod',
    '-hls_segment_filename', path.join(dir, `${name}_%04d.ts`), path.join(dir, `${name}.m3u8`),
  ];

  // Top level: the original H.264 stream copied as-is, so picture quality is identical to the source
  await run('ffmpeg', ['-v', 'error', '-y', '-i', src, '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'copy', ...audioArgs, ...hlsArgs('src')]);

  const levels = [{ name: 'src', width: info.width, height: info.height }];

  if (info.bitrate > LOW_LEVEL_MIN_BITRATE && info.height > 720) {
    // Keyframes forced at the source keyframe times so both levels cut segments at the same moments
    // Aim half a frame early: at fractional frame rates a rounded time can otherwise land one frame late
    const kf = (await keyframeTimes(src)).map((t) => Math.max(0, t - 0.5 / info.fps).toFixed(4));
    const width = Math.round((info.width * 720) / info.height / 2) * 2;
    await run(
      'ffmpeg',
      [
        '-v', 'error', '-y', '-i', src, '-map', '0:v:0', '-map', '0:a:0?',
        '-vf', `scale=${width}:720`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-profile:v', 'high',
        '-pix_fmt', 'yuv420p', '-force_key_frames', kf.join(','), '-sc_threshold', '0',
        ...(info.audioCodec ? ['-c:a', 'aac', '-b:a', '128k'] : []),
        ...hlsArgs('720p'),
      ],
      { maxBuffer: 64 * 1024 * 1024 }
    );
    levels.push({ name: '720p', width, height: 720 });
  }

  let master = '#EXTM3U\n#EXT-X-VERSION:3\n';
  for (const level of levels) {
    const bw = await peakBandwidth(dir, `${level.name}.m3u8`);
    master += `#EXT-X-STREAM-INF:BANDWIDTH=${bw},RESOLUTION=${level.width}x${level.height},FRAME-RATE=${info.fps.toFixed(3)}\n${level.name}.m3u8\n`;
  }
  await writeFile(path.join(dir, 'master.m3u8'), master);

  let bytes = 0;
  for (const f of await readdir(dir)) bytes += (await stat(path.join(dir, f))).size;
  return {
    type: 'video',
    hls: `m/${hash}/master.m3u8`,
    width: info.width,
    height: info.height,
    duration: Math.round(info.duration),
    levels: levels.map((l) => l.name),
    bytes,
    sourceBytes: (await stat(src)).size,
  };
}

// Collect every referenced file
const assets = new Set();
const collect = (x) => {
  if (Array.isArray(x)) x.forEach(collect);
  else if (x && typeof x === 'object') (x.__asset ? assets.add(x.__asset) : Object.values(x).forEach(collect));
};
collect(raw);

const results = {};
const list = [...assets];
const images = list.filter((p) => !VIDEO.test(p));
const videos = list.filter((p) => VIDEO.test(p));

async function handle(rel, fn, version) {
  const src = path.join(root, rel);
  const hash = await hashFile(src, version);
  if (manifest[hash]) {
    results[rel] = manifest[hash];
    return;
  }
  const t = Date.now();
  manifest[hash] = await fn(src, hash);
  results[rel] = manifest[hash];
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  ✓ ${rel} (${((Date.now() - t) / 1000).toFixed(1)}s)`);
}

console.log(`Images: ${images.length}`);
const queue = [...images];
await Promise.all(
  Array.from({ length: Math.max(2, os.cpus().length - 2) }, async () => {
    while (queue.length) await handle(queue.shift(), processImage, IMAGE_VERSION);
  })
);

console.log(`Videos: ${videos.length}`);
for (const rel of videos) await handle(rel, processVideo, VIDEO_VERSION);

// Replace every { __asset } with its processed media entry
const replace = (x) => {
  if (Array.isArray(x)) return x.map(replace);
  if (x && typeof x === 'object') {
    if (x.__asset) {
      const { bytes, sourceBytes, ...entry } = results[x.__asset];
      return entry;
    }
    return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, replace(v)]));
  }
  return x;
};
const contentJson = JSON.stringify(replace(raw), null, 2) + '\n';
await writeFile(path.join(buildDir, 'content.json'), contentJson);
// The app imports this file; commit it together with any content change
await writeFile(path.join(root, 'src', 'content', 'content.json'), contentJson);
// Only entries used by this run are kept, so the upload step never sees stale outputs
manifest = Object.fromEntries(Object.entries(manifest).filter(([, m]) => Object.values(results).includes(m)));
await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

const unique = Object.values(manifest).filter((m) => Object.values(results).includes(m));
const sum = (arr, k) => arr.reduce((s, m) => s + m[k], 0) / 1e6;
console.log(
  `\nDone. ${unique.length} unique files. Source ${sum(unique, 'sourceBytes').toFixed(0)} MB -> served ${sum(unique, 'bytes').toFixed(0)} MB`
);
