// Prepares property posters for the web. CI only - see .github/workflows/deploy.yml.
//   node tools/optimize-images.mjs assets/img/posters
//
// For every poster in the folder:
//   * a small card preview <name>_t.webp (480px) is created if it does not exist
//     yet - the website derives that name from the poster's own file name
//   * an oversized poster (wider than 1080px, or over 350 KB) is shrunk and
//     recompressed in the published copy, keeping its name and format so the
//     path saved by the CMS keeps working. Posters that are already small are
//     left alone, so nothing is compressed twice.
// The originals in the repository are never touched.
import { readdir, stat, writeFile, access } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const MAX_W = 1080;
const THUMB_W = 480;
const BIG = 350 * 1024;
const dir = process.argv[2] || 'assets/img/posters';

const exists = (p) => access(p).then(() => true, () => false);

let thumbs = 0, shrunk = 0, saved = 0;
for (const name of await readdir(dir)) {
  const ext = extname(name).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
  const stem = basename(name, ext);
  if (stem.endsWith('_t')) continue;                       // a preview, not a poster
  const file = join(dir, name);

  try {
    // 1. the card preview, made from the untouched original
    const thumb = join(dir, stem + '_t.webp');
    if (!(await exists(thumb))) {
      await sharp(file, { failOn: 'none' }).rotate()
        .resize({ width: THUMB_W, withoutEnlargement: true })
        .webp({ quality: 76 }).toFile(thumb);
      thumbs++;
    }

    // 2. shrink the poster itself only if it is clearly too heavy
    const before = (await stat(file)).size;
    const meta = await sharp(file, { failOn: 'none' }).metadata();
    if ((meta.width || 0) > MAX_W || before > BIG) {
      let img = sharp(file, { failOn: 'none' }).rotate();       // apply phone EXIF orientation
      if ((meta.width || 0) > MAX_W) img = img.resize({ width: MAX_W, withoutEnlargement: true });
      img = ext === '.png' ? img.png({ compressionLevel: 9, palette: true })
          : ext === '.webp' ? img.webp({ quality: 80 })
          : img.jpeg({ quality: 80, mozjpeg: true });
      const out = await img.toBuffer();
      if (out.length < before) { await writeFile(file, out); saved += before - out.length; shrunk++; }
    }
  } catch (e) {
    console.warn(`skip ${name}: ${e.message}`);
  }
}
console.log(`previews made: ${thumbs}, posters shrunk: ${shrunk}, saved ${(saved / 1048576).toFixed(1)} MB`);
