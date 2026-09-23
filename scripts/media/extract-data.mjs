// Turns src/data/*.ts into plain JSON. Every media import becomes { "__asset": "<path from repo root>" }
// so the media pipeline knows exactly which files the site uses.
import { build } from 'esbuild';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '../..');
const outDir = path.join(root, 'media-build');
const MEDIA = /\.(jpe?g|png|webp|heic|gif|mp4|mov)$/i;

const assetPlugin = {
  name: 'asset-refs',
  setup(b) {
    b.onResolve({ filter: MEDIA }, (args) => ({
      path: path.resolve(args.resolveDir, args.path),
      namespace: 'asset',
    }));
    b.onLoad({ filter: /.*/, namespace: 'asset' }, (args) => ({
      contents: `export default ${JSON.stringify({ __asset: path.relative(root, args.path) })};`,
      loader: 'js',
    }));
  },
};

await mkdir(outDir, { recursive: true });
const bundle = path.join(outDir, 'data.bundle.mjs');
await build({
  stdin: {
    contents: `
      export { imetaData as countries } from './src/data/IMETA';
      export { storyData as stories } from './src/data/MoreStories';
      export { team1, team2 } from './src/data/teamData';
    `,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: bundle,
  plugins: [assetPlugin],
  logLevel: 'error',
});

const data = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`);
const json = { countries: data.countries, stories: data.stories, team1: data.team1, team2: data.team2 };
await writeFile(path.join(outDir, 'data.raw.json'), JSON.stringify(json, null, 2));

const assets = new Set();
const walk = (x) => {
  if (Array.isArray(x)) x.forEach(walk);
  else if (x && typeof x === 'object') (x.__asset ? assets.add(x.__asset) : Object.values(x).forEach(walk));
};
walk(json);
console.log(`countries ${json.countries.length}, stories ${json.stories.length}, team1 ${json.team1.length}, team2 ${json.team2.length}, media files ${assets.size}`);
