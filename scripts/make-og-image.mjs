/**
 * Generates public/og-image.jpg (1200x630) — the brand badge plus the headline.
 * Not a photo: the client's own trip photos are the only images that go on the
 * site, and none are in the repo yet. Replace this with a real trip photo
 * (1200x630, under 200KB) whenever one is available.
 *
 * Run scripts/make-logo.mjs first — this composites src/assets/logo.png.
 *
 *   node scripts/make-og-image.mjs
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="2" fill="#F5C542" opacity="0.16"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#1B3A26"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="1120" cy="70" r="220" fill="#2E5E3E" opacity="0.45"/>

  <text x="230" y="106" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700"
        fill="#F7F4EC">Pack &amp; Go Vacation</text>
  <text x="232" y="148" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700"
        letter-spacing="5" fill="#E8A317">ALL INDIA TOUR PACKAGES · MADURAI</text>

  <text x="80" y="312" font-family="Arial Narrow, Arial, sans-serif" font-size="92" font-weight="700"
        letter-spacing="1" fill="#F7F4EC">Pack Your Bags.</text>
  <text x="80" y="402" font-family="Arial Narrow, Arial, sans-serif" font-size="92" font-weight="700"
        letter-spacing="1" fill="#E8A317">We'll Handle the Rest.</text>

  <text x="80" y="464" font-family="Arial, Helvetica, sans-serif" font-size="29" fill="#F7F4EC" opacity="0.85">
    Holiday packages · Bike trips · Car &amp; bike rentals
  </text>

  <rect x="80" y="508" width="360" height="66" rx="33" fill="#E8A317"/>
  <text x="260" y="551" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="30" font-weight="700" fill="#12271A">63691 53144</text>

  <text x="472" y="551" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#F7F4EC" opacity="0.7">
    WhatsApp or call
  </text>
</svg>`;

const badge = await sharp(path('../src/assets/logo.png')).resize(128, 128).toBuffer();

const buf = await sharp(Buffer.from(svg))
  .composite([{ input: badge, top: 46, left: 80 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();

await writeFile(path('../public/og-image.jpg'), buf);
console.log(`public/og-image.jpg written — ${(buf.length / 1024).toFixed(0)} KB`);
