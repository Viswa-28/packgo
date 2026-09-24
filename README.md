# Pack & Go Agency — website

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
| `site.json` | Every section's headings and body copy, nav, contact details, footer |
| `destinations.json` | The categories and the destination cards |
| `offer.json` | The dismissible offer strip under the hero |
| `faqs.json` | The FAQ accordion (also feeds FAQPage structured data) |
| `testimonials.json` | Review cards — **empty on purpose**, see below |
| `gallery.json` | Trip photos — **empty on purpose**, see below |
| `website-content.md` | The original brief, superseded — reference only |

Adding a destination = adding one object to `destinations.json`. Nothing else.

### Destinations, by category

The page is built around destinations grouped by what someone travels *for* — food,
culture, beaches, adventure, nature, pilgrimage — across India and overseas. There are
no fixed itineraries and no prices; every card ends at a WhatsApp message carrying its
own destination name.

**Adding a destination** is one object in `destinations.json` → `places`:

| Field | What it does |
|---|---|
| `name` / `region` | Card title and the line under it. `region` is the country, or the state for Indian places. |
| `scope` | `"international"` or `"india"`. Drives the badge on the card and the split shown in the hero panel. |
| `categories` | One or more ids from the `categories` list. A place can sit in several; the first one picks the card's icon. |
| `tagline` | One line, on the navy card header. |
| `highlights` | Three bullets. Facts about the place — not claims about the business. |
| `bestTime` | e.g. `"Nov – Feb"`. Omit it and the line disappears. |
| `message` | The prefilled WhatsApp text for that card's button. |

The counts look after themselves: the chip counts, the hero category panel and two of
the About stat tiles all read straight out of this file, so they can't drift when you
add or remove a place.

**Adding a category** means one object in `categories` (`id`, `label`, `heading`,
`icon`, `blurb`) and using that `id` on the places that belong to it. The filter rule
for it is generated at build time; nothing else to touch.

#### The filter is CSS, not JavaScript

The category chips are a radio group. `Destinations.astro` generates one rule per
category:

```css
.dest-filter:has(#dest-cat-food:checked) .dest-card:not([data-cat~="food"]) { display: none }
```

Browsers without `:has()` never match the rule, so every card stays on the page and an
`@supports` rule hides the filter bar there instead of leaving dead chips. The active
chip is a plain `input:checked + label` — deliberately *not* a second `:has()` rule,
because Chrome's `:has()` invalidation doesn't reach the changed input's own siblings
and the chip would stay stuck on its initial state after a click.

Two details worth keeping:

- The `<fieldset>` carries `min-w-0`. A fieldset defaults to
  `min-inline-size: min-content`, so without it the chip row's intrinsic width drags
  the whole page past 360px instead of scrolling inside its own container.
- The chip row is a `scroll-snap` scroller, not a wrapping row — per CLAUDE.md, no
  carousel library.

### Brand assets

`brand-sheet.png` is the identity sheet. `node scripts/make-brand-assets.mjs` cuts four
files out of it: the wordmark (`src/assets/logo.png`, background keyed out to real
alpha so it sits on any surface), the favicon, the apple-touch icon, and the OG card.
Re-run the script rather than hand-editing any of them.

### Empty fields hide their element

The build never prints a placeholder. A field left `null` or `""` removes the thing
it belongs to, and filling it in brings the element back:

- `bestTime` omitted on a destination → that line doesn't render.
- `offer.active: false` → the offer strip under the hero disappears entirely.
- `contact.email: ""` → no email row in the footer.
- `contact.streetAddress: ""` → no street line, and it's dropped from the JSON-LD too.
- `contact.hoursDisplay: ""` → the whole Hours column disappears.
- `testimonials.json` empty → the Reviews section shows the Instagram trust block instead.
- `gallery.json` empty → the Gallery section is removed entirely.

---

## Still to fill in

Nothing was invented in place of a missing answer — each one's element is simply absent.

**Highest impact first:**

1. **Trim `destinations.json` to what you actually sell.** Twenty-one places ship as a
   starter list. Every one of them appears on the site, so delete the ones you don't
   handle rather than leaving them up. This is the one item that must be done before
   launch.
2. **Real reviews.** Copy `testimonials.example.json` into `testimonials.json` and fill
   it with genuine lines from your Instagram comments and DMs, with permission to use
   the first name and city. Three real short reviews beat ten invented long ones.
3. **Photos.** See `src/assets/gallery/README.md`. Your own trip photos only.
4. **The unanswered FAQs** sit in `faqs.pending.json` — advance %, cancellation policy,
   whether flights are included, and whether rental cars come with a driver. Write the
   answer, move the object into `faqs.json`. Vague cancellation terms cause disputes
   later; write that one out properly.
5. **Footer details** — office address, email, opening hours in `site.json` → `contact`.
6. **The offer strip** is inactive and empty. Set `offer.active: true` and fill in
   `lead` / `text` / `cta` when a real departure or offer is live.
7. **Trust strip** — "X years running" was dropped from the hero; there's a commented
   slot in `site.json` → `hero.trust` to add it back.
8. **Stat cards** — two of the four About tiles count `destinations.json` live. The
   other two are fixed strings; only put a number there you can back up.

Keys starting with `_note` / `_why` / `_howto` are documentation for you. They are
never rendered.

---

## Before you go live

1. **Set the domain.** Change `SITE` at the top of `astro.config.mjs` and the `Sitemap:`
   line in `public/robots.txt`. Everything else — canonical URL, Open Graph, sitemap —
   derives from it.
2. **Replace the OG image.** `public/og-image.jpg` is a brand card generated by
   `node scripts/make-brand-assets.mjs`. Swap in a real trip photo at 1200×630 when
   you have one.
3. **Add analytics.** Nothing is installed. Drop a Plausible or GA4 snippet into the
   `<head>` in `src/layouts/Base.astro`.
4. **Deploy.** `netlify.toml` is ready — connect the repo, build `npm run build`,
   publish `dist`. Cloudflare Pages works with the same two settings.

---

## Verified on this build

Measured in headless Chrome against `dist/`, at a 360px layout viewport:

- **No horizontal scroll.** `body.scrollWidth === 360`, and `scrollTo(400, 0)` leaves
  `scrollX` at 0. (The `<fieldset>` bug above was caught here — it pushed the page out
  to 998px before `min-w-0`.)
- **All tap targets ≥ 44×44px** — 0 elements under the bar. No text below 14px.
- **The category filter works end to end** from a real click: selecting Pilgrimage
  leaves exactly the 4 pilgrimage cards, its chip fills navy and All clears.
- One `<h1>`; `TravelAgency` and `FAQPage` JSON-LD both emitted.
- 27 WhatsApp links, every one carrying its own prefilled message; 4 `tel:` links.
- Zero `[[TO CONFIRM]]` strings and zero HTML comments in the built output. Astro emits
  `<!-- -->` but not `{/* */}` — developer notes in templates use the latter, or they
  ship to the browser.

Not yet done: Lighthouse has not been run, and the site has not been opened on a real
Android handset. Both are on the CLAUDE.md checklist. The axe-core accessibility sweep
predates the rebrand and should be re-run against the new palette.

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
  dismiss, and the scroll-reveal fallback. Nothing else — the destination filter is
  pure CSS.

**Deviations from CLAUDE.md, all deliberate and all requested:**

| Rule | What was done | Why |
|---|---|---|
| "Ship zero client-side JS except three things" | One more: the scroll-reveal fallback (~600 B) | Without it, Safari/Firefox get no scroll animation at all |
| "CSS transitions only, no animation libraries" | CSS `@keyframes` and scroll-driven animations | No library added, but well past transitions |

Any of these can be backed out independently — see each section above.
- No UI library, no carousel library, no animation library, no chatbot, no icon font.
  Icons are hand-inlined Lucide paths in `Icon.astro`.
- One page. Marketing copy never lives in a `.astro` file.
