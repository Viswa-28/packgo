/**
 * Turns the client's logo.jpg (square badge on a white field) into the assets
 * the site actually uses:
 *
 *   src/assets/logo.png         512x512, white field trimmed, corners cut to
 *                               transparent so the badge sits on deep green
 *   public/favicon.png          96x96 browser tab icon
 *   public/apple-touch-icon.png 180x180, flattened onto cream (iOS ignores alpha)
 *
 *   node scripts/make-logo.mjs
 */
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url));

// The badge is a circle printed on white. Trim the field, square it up, then
// mask to a circle — otherwise the leftover white corners show on dark sections.
const trimmed = await sharp(path('../logo.jpg'))
  .trim({ background: '#ffffff', threshold: 10 })
  .toBuffer({ resolveWithObject: true });

const side = Math.max(trimmed.info.width, trimmed.info.height);

const squared = await sharp(trimmed.data)
  .resize(side, side, { fit: 'contain', background: '#ffffff' })
  .resize(512, 512)
  .toBuffer();

const circle = Buffer.from(
  '<svg width="512" height="512"><circle cx="256" cy="256" r="256" fill="#fff"/></svg>'
);

const logo = await sharp(squared)
  .composite([{ input: circle, blend: 'dest-in' }])
  .png({ compressionLevel: 9 })
  .toBuffer();

const write = async (rel, buf) => {
  await sharp(buf).toFile(path(rel));
  console.log(`${rel.replace('../', '')} — ${(buf.length / 1024).toFixed(0)} KB`);
};

await write('../src/assets/logo.png', logo);

await write(
  '../public/favicon.png',
  await sharp(logo).resize(96, 96).png({ compressionLevel: 9 }).toBuffer()
);

// iOS renders alpha as black, so the touch icon gets the cream field back.
await write(
  '../public/apple-touch-icon.png',
  await sharp(logo)
    .resize(164, 164)
    .extend({ top: 8, bottom: 8, left: 8, right: 8, background: '#F7F4EC' })
    .flatten({ background: '#F7F4EC' })
    .png({ compressionLevel: 9 })
    .toBuffer()
);
