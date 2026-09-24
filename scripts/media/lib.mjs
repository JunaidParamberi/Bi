// Shared media processing and R2 upload used by scripts/media/add-media.mjs.
//   images -> m/<hash>/full.webp (fits 3840x2160, near-lossless), m/<hash>/thumb.webp (fits 1280x720), originals/<hash>.<ext>
//   videos -> m/<hash>/master.m3u8 with the source H.264 stream copied untouched (+ an aligned 720p level for heavy files)
// Keys are content hashes (plus a settings version), so identical files are stored once and can be cached forever.
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, writeFile, mkdir, copyFile, readdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const run = promisify(execFile);
export const root = path.resolve(import.meta.dirname, '../..');
export const outDir = path.join(root, 'media-build', 'out');

export const VIDEO = /\.(mp4|mov)$/i;
const HLS_SEGMENT_SECONDS = 6;
// Only videos heavier than this get an extra 720p level; lighter ones already stream fine
const LOW_LEVEL_MIN_BITRATE = 4_000_000;
// Bump when processing settings change: output keys include it, so CDN caches never serve stale files
export const IMAGE_VERSION = 2;
export const VIDEO_VERSION = 2;

export const hashFile = (file, version) =>
  new Promise((resolve, reject) => {
    const h = createHash('sha256').update(`v${version}:`);
    createReadStream(file).on('data', (d) => h.update(d)).on('end', () => resolve(h.digest('hex').slice(0, 16))).on('error', reject);
  });

export async function processImage(src, hash) {
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

export async function processVideo(src, hash) {
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

// Minimal .env.local reader so no extra dependency is needed
const env = { ...process.env };
try {
  for (const line of (await readFile(path.join(root, '.env.local'), 'utf8')).split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {
  // fall back to the process environment
}
for (const k of ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET']) {
  if (!env[k]) throw new Error(`Missing ${k} in .env.local`);
}

export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});

const TYPES = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.heic': 'image/heic',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.mp4': 'video/mp4',
};

const exists = async (Key) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET, Key }));
    return true;
  } catch (e) {
    if (e.$metadata?.httpStatusCode === 404) return false;
    throw e;
  }
};

// Uploads the given files from outDir, skipping keys that already exist. Returns the number uploaded.
export async function uploadFiles(files) {
  let uploaded = 0;
  const queue = [...files];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) {
        const file = queue.shift();
        const Key = path.relative(outDir, file).split(path.sep).join('/');
        if (await exists(Key)) continue;
        await new Upload({
          client: s3,
          params: {
            Bucket: env.R2_BUCKET,
            Key,
            Body: createReadStream(file),
            ContentType: TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
            CacheControl: 'public, max-age=31536000, immutable',
          },
        }).done();
        uploaded++;
      }
    })
  );
  return uploaded;
}

export async function filesIn(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await filesIn(full)));
    else out.push(full);
  }
  return out;
}
