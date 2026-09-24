// Adds new photos/videos to the site's media bucket.
//   npm run media:add -- path/to/photo.jpg path/to/film.mp4
// Processes each file, uploads it to R2, and prints the JSON entry to paste into src/content/content.json
// (e.g. into an article's "images" array, or as a video's "src"/"thumb").
import path from 'node:path';
import { hashFile, processImage, processVideo, uploadFiles, filesIn, outDir, VIDEO, IMAGE_VERSION, VIDEO_VERSION } from './lib.mjs';

const inputs = process.argv.slice(2);
if (inputs.length === 0) {
  console.error('Usage: npm run media:add -- <file> [file...]');
  process.exit(1);
}

for (const input of inputs) {
  const src = path.resolve(input);
  const isVideo = VIDEO.test(src);
  const hash = await hashFile(src, isVideo ? VIDEO_VERSION : IMAGE_VERSION);
  console.log(`\n${path.basename(src)}: processing...`);
  const entry = isVideo ? await processVideo(src, hash) : await processImage(src, hash);

  const produced = (await filesIn(path.join(outDir, 'm', hash))).concat(
    isVideo ? [] : (await filesIn(path.join(outDir, 'originals'))).filter((f) => path.basename(f).startsWith(hash))
  );
  const uploaded = await uploadFiles(produced);
  console.log(`uploaded ${uploaded} file(s) (${produced.length - uploaded} already in the bucket)`);

  const { bytes, sourceBytes, ...json } = entry;
  console.log(JSON.stringify(json, null, 2));
}

console.log(
  '\nPaste each entry into src/content/content.json. Videos also need a poster image: add it with this command and use it as "thumb".'
);
