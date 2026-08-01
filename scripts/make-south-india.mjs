/**
 * Traces the south Indian coastline for the hero map.
 *
 *   node scripts/make-south-india.mjs
 *
 * Source: Natural Earth 50m country outlines via the `world-atlas` dev
 * dependency. India's mainland ring is clipped to the southern peninsula and
 * projected with lib/map-projection.js.
 *
 * Deliberately south-only. Natural Earth draws India's northern boundaries on a
 * de-facto basis, which does not match the depiction required of maps published
 * in India. Cropping below that line sidesteps the issue entirely, and every
 * destination in content.md is south anyway.
 *
 * The output is committed; a normal build never runs this.
 */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { FRAME, project } from '../src/lib/map-projection.js';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-50m.json');

const CUT_LAT = 16.6; // top of the frame

const india = feature(topo, topo.objects.countries).features.find(
  (f) => f.properties?.name === 'India'
);
if (!india) throw new Error('India not found in world-atlas');

const rings =
  india.geometry.type === 'Polygon'
    ? [india.geometry.coordinates[0]]
    : india.geometry.coordinates.map((poly) => poly[0]);

// Mainland is the biggest ring.
const mainland = rings.sort((a, b) => b.length - a.length)[0];

/* Keep the run of coast below the cut. Rotate the ring so it starts on a point
   that is above the cut, then the southern portion is one contiguous slice. */
const startAbove = mainland.findIndex(([, lat]) => lat > CUT_LAT);
if (startAbove === -1) throw new Error('ring never crosses the cut latitude');
const rotated = [...mainland.slice(startAbove), ...mainland.slice(0, startAbove)];

const south = [];
let seen = false;
for (const [lon, lat] of rotated) {
  if (lat <= CUT_LAT) {
    south.push([lon, lat]);
    seen = true;
  } else if (seen) {
    break; // came back up over the cut — the peninsula is complete
  }
}

if (south.length < 20) throw new Error(`only ${south.length} coastal points found`);

// Close the shape along the top edge of the frame.
const first = south[0];
const last = south[south.length - 1];
south.unshift([first[0], CUT_LAT]);
south.push([last[0], CUT_LAT]);

const path =
  'M ' +
  south
    .map(([lon, lat]) => {
      const p = project(lat, lon);
      return `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    })
    .join(' L ') +
  ' Z';

const lats = south.map((p) => p[1]);
const lons = south.map((p) => p[0]);

/* ---------------------------------------------------------------------------
   State boundaries.

   Districts were the ask, but Tamil Nadu, Kerala, Karnataka and Andhra have
   about 110 between them — at this size that is 110 shapes of roughly 30px and
   the internal lines turn into noise. States are the subdivision a traveller
   actually recognises, and there are six of them in frame.

   To switch to districts: replace this block with an admin-2 source (Natural
   Earth has none; Datameet publishes Indian district GeoJSON) and keep the rest
   as-is — the clip and projection don't care how many polygons arrive.

   Source: Natural Earth 10m admin-1, fetched to .tmp on first run.
--------------------------------------------------------------------------- */

const ADMIN1_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';
const ADMIN1_CACHE = new URL('../.tmp/admin1.json', import.meta.url);

async function admin1() {
  const { existsSync, mkdirSync } = await import('node:fs');
  const { readFile, writeFile } = await import('node:fs/promises');
  if (existsSync(ADMIN1_CACHE)) return JSON.parse(await readFile(ADMIN1_CACHE, 'utf8'));

  console.log('downloading Natural Earth admin-1 (~40 MB, cached in .tmp)…');
  const res = await fetch(ADMIN1_URL);
  if (!res.ok) throw new Error(`admin-1 download failed: ${res.status}`);
  const text = await res.text();
  mkdirSync(new URL('../.tmp/', import.meta.url), { recursive: true });
  await writeFile(ADMIN1_CACHE, text);
  return JSON.parse(text);
}

// Anything that reaches into the frame. The top few are slivers along the cut.
const IN_FRAME = new Set([
  'Kerala',
  'Tamil Nadu',
  'Karnataka',
  'Goa',
  'Andhra Pradesh',
  'Puducherry',
  'Telangana',
  'Maharashtra',
]);

/** Drop points closer together than `min` frame units — 10m data is far finer
    than a 525px map can show. */
function decimate(points, min) {
  const out = [points[0]];
  for (const p of points) {
    const last = out[out.length - 1];
    if (Math.hypot(p.x - last.x, p.y - last.y) >= min) out.push(p);
  }
  return out.length > 3 ? out : points;
}

const states = [];
for (const f of (await admin1()).features) {
  if (f.properties.admin !== 'India' || !IN_FRAME.has(f.properties.name)) continue;

  const groups =
    f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;

  const subPaths = [];
  for (const rings of groups) {
    const projected = rings[0].map(([lon, lat]) => project(lat, lon));
    // Skip rings entirely below the frame's top or off its sides.
    if (projected.every((p) => p.y < -40)) continue;
    const thinned = decimate(projected, 3.2);
    if (thinned.length < 6) continue;
    // Skip specks: offshore islands and enclaves smaller than a pin.
    const xs = thinned.map((q) => q.x), ys = thinned.map((q) => q.y);
    if (Math.max(...xs) - Math.min(...xs) < 10 && Math.max(...ys) - Math.min(...ys) < 10) continue;
    subPaths.push(
      'M ' + thinned.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ') + ' Z'
    );
  }

  if (subPaths.length) states.push({ name: f.properties.name, path: subPaths.join(' ') });
}

writeFileSync(
  new URL('../src/lib/south-india.json', import.meta.url),
  JSON.stringify({ frame: FRAME, cutLat: CUT_LAT, coast: path, states }, null, 0)
);

console.log(
  `states in frame: ${states.map((s) => s.name).join(', ')}\n` +
    `state paths ${states.reduce((n, s) => n + s.path.length, 0)} bytes`
);

console.log(
  `${south.length} coastal points, lat ${Math.min(...lats).toFixed(1)}–${Math.max(...lats).toFixed(1)}, ` +
    `lon ${Math.min(...lons).toFixed(1)}–${Math.max(...lons).toFixed(1)}\n` +
    `path ${path.length} bytes → src/lib/south-india.json`
);
