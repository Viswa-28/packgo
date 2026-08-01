/**
 * Generates public/og-image.jpg (1200x630) — a typographic brand card.
 * Not a photo: the client's own trip photos are the only images that go on the
 * site, and none are in the repo yet. Replace this with a real trip photo
 * (1200x630, under 200KB) whenever one is available.
 *
 *   node scripts/make-og-image.mjs
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="2" fill="#F5C542" opacity="0.16"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="#1B3A26"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="1120" cy="70" r="220" fill="#2E5E3E" opacity="0.45"/>

  <text x="80" y="150" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700"
        letter-spacing="6" fill="#E8A317">ALL INDIA TOUR PACKAGES · MADURAI</text>

  <text x="80" y="270" font-family="Arial Narrow, Arial, sans-serif" font-size="96" font-weight="700"
        letter-spacing="1" fill="#F7F4EC">Pack Your Bags.</text>
  <text x="80" y="370" font-family="Arial Narrow, Arial, sans-serif" font-size="96" font-weight="700"
        letter-spacing="1" fill="#E8A317">We'll Handle the Rest.</text>

  <text x="80" y="440" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#F7F4EC" opacity="0.85">
    Holiday packages · Bike trips · Car &amp; bike rentals
  </text>

  <rect x="80" y="496" width="360" height="66" rx="33" fill="#E8A317"/>
  <text x="260" y="539" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="30" font-weight="700" fill="#12271A">93429 37594</text>

  <text x="472" y="539" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#F7F4EC" opacity="0.7">
    Pack &amp; Go Vacation
  </text>
</svg>`;

const buf = await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
await writeFile(new URL('../public/og-image.jpg', import.meta.url), buf);
console.log(`public/og-image.jpg written — ${(buf.length / 1024).toFixed(0)} KB`);
