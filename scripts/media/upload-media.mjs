// Uploads media-build/out to the R2 bucket. Keys are content hashes, so existing keys are skipped
// and every object can be cached by browsers and CDNs forever.
// Needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET in .env.local
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '../..');
const outDir = path.join(root, 'media-build', 'out');

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

const s3 = new S3Client({
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

async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else yield full;
  }
}

const exists = async (Key) => {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET, Key }));
    return true;
  } catch (e) {
    if (e.$metadata?.httpStatusCode === 404) return false;
    throw e;
  }
};

const all = [];
for await (const f of files(outDir)) all.push(f);
let uploaded = 0, skipped = 0, bytes = 0;
const queue = [...all];

await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const file = queue.shift();
      const Key = path.relative(outDir, file).split(path.sep).join('/');
      if (await exists(Key)) {
        skipped++;
        continue;
      }
      const { size } = await stat(file);
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
      bytes += size;
      if (uploaded % 50 === 0) console.log(`  ${uploaded} uploaded (${(bytes / 1e6).toFixed(0)} MB)...`);
    }
  })
);

console.log(`Done: ${uploaded} uploaded (${(bytes / 1e6).toFixed(0)} MB), ${skipped} already in the bucket, ${all.length} total.`);
