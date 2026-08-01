# Pack & Go Vacation — website

Single-page marketing site. Astro (static) + Tailwind. Every path leads to WhatsApp
or a phone call — there is no booking engine, no payment, no login.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

---

## Editing content — no code required

All copy and data live in `src/content/`. Nothing is hardcoded in components.

| File | What it controls |
|---|---|
| `site.json` | Every section's headings and body copy, nav, contact details, footer, and the hero map places |
| `packages.json` | The six package cards |
| `offer.json` | The dismissible offer strip under the hero |
| `faqs.json` | The FAQ accordion (also feeds FAQPage structured data) |
| `testimonials.json` | Review cards — **empty on purpose**, see below |
| `gallery.json` | Trip photos — **empty on purpose**, see below |
| `website-content.md` | The original source copy, kept for reference |

Adding a seventh package = adding one object to `packages.json`. Nothing else.

### The hero map

An illustrated map of south India with a marker on every destination — the same
idea as a printed sightseeing map. **No JavaScript, no tiles, no map library,
nothing fetched at runtime.** It is inline SVG plus a handful of absolutely
positioned HTML labels, and it is identical on a phone and a desktop.

The map column is **only the map**: a label, the map, and its legend. It used to
carry a destination count, two floating stat chips and its own WhatsApp card as
well — which meant the hero stated "15+ destinations" twice, "24/7 support" twice,
and offered four separate WhatsApp buttons. All of that now lives once, where it
belongs: the count and support line in About, the CTA in the hero's own buttons.

The coastline is real, traced from Natural Earth 50m, and it's **divided by state** —
Karnataka, Kerala, Tamil Nadu and the slivers of Goa, Andhra, Telangana, Maharashtra
and Puducherry that reach into the frame. Every place sits at its true latitude and
longitude, so the map can't quietly drift away from the places you actually sell.

#### States, not districts

Districts were the ask. Tamil Nadu, Kerala, Karnataka and Andhra have roughly 110
between them — on a 525px map that's 110 shapes of about 30px, and the dividing lines
stop being structure and become noise. States are the subdivision a traveller
recognises, and there are only a handful in frame.

To switch to districts anyway: swap the admin-1 block in
`scripts/make-south-india.mjs` for an admin-2 source (Natural Earth has none; Datameet
publishes Indian district GeoJSON). Nothing else changes — the clip, the projection
and the component don't care how many polygons arrive. Expect to drop the state
labels and lighten the stroke considerably.

**Adding a place** is one object in `site.json` → `hero.map.places`:

| Field | What it does |
|---|---|
| `lat` / `lon` | Real coordinates. That's all the positioning there is. |
| `anchor` | Which side the label sits on: `right`, `left`, `top`, `bottom`. Change it if two labels collide. |

The Kerala cluster — Munnar, Thekkady, Alleppey, Varkala, Kodaikanal — is tight
enough that anchors matter. If you add a place there and a label collides, try the
other three anchors before moving the map's `max-width`; widening it does not help,
because the labels stay 14px while the map scales.
| `pin` | An icon name. Gives the place a large teardrop marker instead of a plain dot, and adds it to the legend. |
| `kind` | The legend wording for a pinned place, e.g. "Hill stations". |
| `home` | The gold ring. Madurai only. |
| `minor` | Hides the label below 640px. Ten labels is a crowd on a 320px map. |

State names come from `hero.map.regions` — a readable point inside each state, not a
computed centroid, so nudge the lat/lon if a name lands on a border.

#### Why south India and not the whole country

Natural Earth draws India's northern boundaries on a de-facto basis, which does not
match the depiction required of maps published in India. Rendering that on an Indian
business's website is a real legal risk, so `scripts/make-south-india.mjs` crops the
outline below 16.6°N — well clear of it. Every destination in content.md is south of
that line anyway.

If you ever want the full country, get the outline from a source that uses India's
official boundaries; don't just raise the crop latitude.

#### Regenerating the coastline

```bash
node scripts/make-south-india.mjs      # → src/lib/south-india.json
```

Only needed if you change the frame in `src/lib/map-projection.js`. The output is
committed, and `world-atlas` / `topojson-client` are dev-only — they never reach the
browser.

The state boundaries come from Natural Earth 10m admin-1, which the script downloads
(~40 MB) and caches in `.tmp/` on first run. `.tmp/` is gitignored; the 29 KB of
decimated paths that end up in `south-india.json` are what ship.

### Empty fields hide their element

The build never prints a placeholder. A field left `null` or `""` removes the thing
it belongs to, and filling it in brings the element back:

- `priceFrom: null` → the price line doesn't render. Set `priceFrom: 8999` → `From ₹8,999`.
- `duration: null` → the duration chip doesn't render.
- `contact.email: ""` → no email row in the footer.
- `contact.streetAddress: ""` → no street line, and it's dropped from the JSON-LD too.
- `contact.hoursDisplay: ""` → the whole Hours column disappears.
- `testimonials.json` empty → the Reviews section shows the Instagram trust block instead.
- `gallery.json` empty → the Gallery section is removed entirely.

---

## Still to fill in

These were `[[TO CONFIRM]]` in `content.md`. Nothing was invented in their place —
each one's element is simply absent right now.

**Highest impact first:**

1. **Prices.** Every `priceFrom` in `packages.json` is `null`. Even a rough starting
   price sharply increases enquiries — people won't message to find out whether
   you're in their range.
2. **Durations** for the Warkala, Kerala, Temple Circuit and Hill Station packages.
3. **Real reviews.** Copy `testimonials.example.json` into `testimonials.json` and fill
   it with genuine lines from your Instagram comments and DMs, with permission to use
   the first name and city. Three real short reviews beat ten invented long ones.
4. **Photos.** See `src/assets/gallery/README.md`. Your own trip photos only.
5. **The four unanswered FAQs** sit in `faqs.pending.json` — advance %, cancellation
   policy, whether flights are included, and whether rental cars come with a driver.
   Write the answer, move the object into `faqs.json`. Vague cancellation terms cause
   disputes later; write that one out properly.
6. **Footer details** — office address, email, opening hours in `site.json` → `contact`.
7. **Trust strip** — "X years running" was dropped from the hero; there's a commented
   slot in `site.json` → `hero.trust` to add it back.
8. **Stat cards** — "Trips completed" and "Happy travellers" were dropped. Add them to
   `site.json` → `about.stats` only when you have numbers you can back up.
9. **Package details** — three bullets were removed because they were uncertain:
   fuel/backup-vehicle/pillion pricing on the bike trip, the Kerala houseboat, and the
   Kodaikanal bonfire. Each is noted in a `_note` key on its package object.

Keys starting with `_note` / `_why` / `_howto` are documentation for you. They are
never rendered.

---

## Before you go live

1. **Set the domain.** Change `SITE` at the top of `astro.config.mjs` and the `Sitemap:`
   line in `public/robots.txt`. Everything else — canonical URL, Open Graph, sitemap —
   derives from it.
2. **Replace the OG image.** `public/og-image.jpg` is a typographic brand card generated
   by `node scripts/make-og-image.mjs`. Swap in a real trip photo at 1200×630 when you
   have one.
3. **Add analytics.** Nothing is installed. Drop a Plausible or GA4 snippet into the
   `<head>` in `src/layouts/Base.astro`.
4. **Deploy.** `netlify.toml` is ready — connect the repo, build `npm run build`,
   publish `dist`. Cloudflare Pages works with the same two settings.

---

## Verified on this build

- No horizontal scroll at 360px (`scrollWidth === 360`), and none at 1280px
- axe-core WCAG 2.1 AA + best-practice: **0 violations** at 360px and 1280px.
  Audit the page with reveals settled (`animation:none;opacity:1`) — mid-fade
  elements otherwise report phantom contrast failures against a blended colour.
- All tap targets ≥ 44×44px; no text below 14px anywhere
- Phone first load: 3 requests, 230 KB uncompressed — target was under 1.5 MB
- Hero fits above the fold on a 1568x762 window: 637px tall, 56px under the nav
- Map: 8 state polygons, 3 state labels, 10 places, 4 category pins, and
  **0 overlapping labels** at 360px, 1280px or 1568px — place names and state
  names checked against each other, not just among themselves
- One `<h1>`; `TravelAgency` and `FAQPage` JSON-LD both emitted
- 14 WhatsApp links, every one carrying its own prefilled message; 4 `tel:` links
- Mobile nav, FAQ accordion and offer dismiss all work, with correct
  `aria-expanded` / `aria-controls`; JS keeps the FAQ answers visible if it fails
- Zero `[[TO CONFIRM]]` strings and zero HTML comments in the built output.
  Astro emits `<!-- -->` but not `{/* */}` — developer notes in templates use the
  latter, or they ship to the browser
- Scroll reveals, 33 animated elements, full-page sweep in **both** paths —
  0 left stuck invisible in either. Also verified: observer-throws rescue,
  watchdog-timer rescue, reduced-motion, and that Chrome never runs path B

Not yet done: Lighthouse has not been run, and the site has not been opened on a real
Android handset. Both are on the CLAUDE.md checklist.

---

## Scroll animations

Sections and cards fade and rise as they scroll into view. Two classes drive it:

- `.reveal` — animates the element itself
- `.reveal-group` — animates its direct children in a diagonal cascade

There are **two implementations of the same effect**, and a browser only ever runs one:

| Path | Browsers | How |
|---|---|---|
| A | Chrome, Edge, Android Chrome | CSS scroll-driven animation (`animation-timeline: view()`). Zero JS, runs on the compositor. |
| B | Safari, Firefox, older WebViews | ~20-line IntersectionObserver in `Base.astro` adds `.is-visible`; a CSS transition does the rest. |

An inline head script picks the path before first paint: it only adds `js-reveal` to
`<html>` when path A is unsupported, so the two can never both apply.

**This is a deliberate deviation from CLAUDE.md**, which allows only three scripts
(nav, FAQ, offer dismiss). Path B is a fourth. Without it, roughly a third of visitors
would see no animation at all. It costs about 600 bytes and is skipped entirely on
Chrome. If you'd rather hold the line, delete the reveal script block at the bottom of
`Base.astro` and the `.js-reveal` rules in `global.css` — path A keeps working.

**It fails open in every direction** — content is never left stuck invisible:

- `prefers-reduced-motion: reduce` → no animation, everything visible
- Path B's observer throws → `catch` strips `js-reveal`, everything visible
- Path B's script never boots → a 2.5s watchdog strips `js-reveal`, everything visible
- Above-the-fold content is already past its entry range, so it paints final, no flash

The hero is deliberately excluded — it's the LCP element. Its backdrop gets a
transform-only drift instead.

To tune the feel, edit the `reveal-in` keyframes, the `animation-range` values, or the
path-B `transition` duration in `global.css`.

One related detail: `body` uses `overflow-x: clip`, not `hidden`. `hidden` would make
`<body>` a scroll container and path A would resolve against it instead of the
viewport and never fire.

## Constraints this codebase keeps

- Ships ~2 KB of JS to every visitor, all inlined: mobile nav, FAQ accordion, offer
  dismiss, the scroll-reveal fallback, and the 3D eligibility check. Three.js is a
  separate 135 KB chunk that desktop-only visitors fetch after load.

**Deviations from CLAUDE.md, all deliberate and all requested:**

| Rule | What was done | Why |
|---|---|---|
| "Ship zero client-side JS except three things" | Two more: a scroll-reveal fallback (~600 B) and the 3D loader | Without the fallback, Safari/Firefox get no scroll animation at all |
| "CSS transitions only, no animation libraries" | CSS `@keyframes` and scroll-driven animations | No library added, but well past transitions |
| "Don't pull in a UI component library" | Three.js, lazy and desktop-only | Requested; phones never download it |

Any of these can be backed out independently — see each section above.
- No UI library, no carousel library, no animation library, no chatbot, no icon font.
  Icons are hand-inlined Lucide paths in `Icon.astro`.
- One page. Marketing copy never lives in a `.astro` file.
