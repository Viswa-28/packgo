/**
 * Cuts the site's brand assets out of brand-sheet.png (the Pack & Go Agency
 * identity sheet):
 *
 *   src/assets/logo.png         the "pack&go AGENCY" wordmark, background keyed
 *                               out so it can sit on any surface
 *   public/favicon.png          96x96 browser tab icon, from the app-icon tile
 *   public/apple-touch-icon.png 180x180, same tile
 *   public/og-image.jpg         1200x630 share card — the full lockup on navy
 *
 *   node scripts/make-brand-assets.mjs
 *
 * The og-image is a brand card, not a photo: the client's own trip photos are
 * the only photography that goes on this site, and none are in the repo yet.
 * Replace it with a real trip photo (1200x630, under 200KB) once there is one.
 */
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const SRC = path('../brand-sheet.png');

// Crop boxes into the 986x482 sheet.
const WORDMARK = { left: 40, top: 150, width: 500, height: 150 };
const LOCKUP = { left: 30, top: 150, width: 520, height: 185 }; // + tagline
const APP_ICON = { left: 586, top: 342, width: 80, height: 80 };

// The sheet prints the wordmark white-and-blue on a near-flat navy. Unmultiplying
// against that background recovers a real alpha channel, anti-aliased edges
// included, instead of shipping the mark as a navy rectangle.
const BG = [7, 33, 64];
const ALPHA_FLOOR = 0.06; // below this it's background noise, not ink

const { data, info } = await sharp(SRC)
  .extract(WORDMARK)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: w, height: h } = info;
const keyed = Buffer.alloc(w * h * 4);
let minX = w;
let minY = h;
let maxX = -1;
let maxY = -1;

for (let i = 0; i < w * h; i++) {
  const p = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]];
  let a = 0;
  for (let c = 0; c < 3; c++) a = Math.max(a, (p[c] - BG[c]) / (255 - BG[c]));
  a = Math.min(1, Math.max(0, a));
  if (a < ALPHA_FLOOR) a = 0;

  if (a > 0) {
    for (let c = 0; c < 3; c++) {
      keyed[i * 4 + c] = Math.min(255, Math.max(0, Math.round((p[c] - (1 - a) * BG[c]) / a)));
    }
    // Trim to the solid part of the mark, so faint edge pixels don't pad it.
    if (a > 0.25) {
      const x = i % w;
      const y = (i / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  keyed[i * 4 + 3] = Math.round(a * 255);
}

const pad = 2;
const left = Math.max(0, minX - pad);
const top = Math.max(0, minY - pad);

await sharp(keyed, { raw: { width: w, height: h, channels: 4 } })
  .extract({
    left,
    top,
    width: Math.min(w - 1, maxX + pad) - left + 1,
    height: Math.min(h - 1, maxY + pad) - top + 1,
  })
  .png({ compressionLevel: 9 })
  .toFile(path('../src/assets/logo.png'));

const icon = sharp(SRC).extract(APP_ICON);
await icon.clone().resize(96, 96, { kernel: 'lanczos3' }).sharpen().png().toFile(path('../public/favicon.png'));
await icon
  .clone()
  .resize(180, 180, { kernel: 'lanczos3' })
  .sharpen()
  .png()
  .toFile(path('../public/apple-touch-icon.png'));

const lockup = await sharp(SRC)
  .extract(LOCKUP)
  .resize({ width: 880, kernel: 'lanczos3' })
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 3, background: { r: 6, g: 30, b: 60 } },
})
  .composite([{ input: lockup, gravity: 'center' }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path('../public/og-image.jpg'));

console.log('Wrote logo.png, favicon.png, apple-touch-icon.png, og-image.jpg');
