# CLAUDE.md

Project instructions for Claude Code. Read this fully before writing any code.

---

## Project

Single-page marketing website for **Pack & Go Agency**, a travel agency and vehicle rental business based in Madurai, Tamil Nadu.

The page is organised around **destinations, grouped by what people travel for** — food, culture, beaches, adventure, nature, pilgrimage — covering both Indian and overseas places. It is not a package catalogue: there are no fixed itineraries and no prices on the page.

**Goal:** Convert visitors into WhatsApp enquiries. Not e-commerce — there is no online payment, no booking engine, no user accounts. Every path leads to a conversation on WhatsApp or a phone call.

**Audience:** Mostly Tamil Nadu residents on Android phones over mobile data. Families, friend groups, bike riders, pilgrimage travellers. A meaningful share are not fluent English readers.

---

## Non-negotiables

1. **Mobile-first.** Design at 360px width first, then scale up. Desktop is secondary.
2. **Fast on 4G.** Target Lighthouse performance 90+ on mobile. Every image lazy-loaded and compressed.
3. **WhatsApp is the primary CTA.** Link format: `https://wa.me/919342937594?text=<url-encoded prefilled message>`. Prefill context-specific text per section (e.g. from the Goa card: "Hi, I'm interested in the Goa package").
4. **Phone numbers are tappable everywhere.** Two numbers: `tel:+916369153144` (primary) and `tel:+919342937594` (also the WhatsApp line). Never hardcode either — read them from `src/content/site.json` via `src/lib/contact.js`.
5. **No placeholder content ships.** Anything the owner hasn't confirmed must either be filled in or the element removed. Never invent prices, review text, stats, or policies. Facts about a *destination* (what's in Bangkok, when Kashmir is in season) are fine; claims about the *business* are not.
6. **No prices on the page.** Quotes happen on WhatsApp. If prices are ever added they display as `From ₹X,XXX` — always with "From", always with the rupee symbol.
7. **No stock photography.** Only the client's own trip photos. The logo, favicon and OG card are cut from `brand-sheet.png` by `scripts/make-brand-assets.mjs` — re-run that rather than hand-editing them.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro (static output) |
| Styling | Tailwind CSS |
| Content | Markdown / JSON in `src/content/` — no hardcoded copy in components |
| Images | Astro `<Image>` component, WebP, explicit width/height |
| Icons | Lucide (inline SVG only — no icon font, no runtime library) |
| Forms | Netlify Forms (backup path only) |
| Hosting | Netlify or Cloudflare Pages |
| Analytics | Google Analytics 4 or Plausible |

The destination category filter is deliberately **not** JavaScript: it's a radio group plus one generated `:has()` rule per category. Browsers without `:has()` show every card and the filter bar hides itself. Keep it that way.

**Ship zero client-side JavaScript** except for: mobile nav toggle, FAQ accordion, and the offer banner dismiss. Use Astro islands or a few lines of vanilla JS. Do not add React unless something genuinely requires it — nothing here does.

---

## Design Direction

Pull from `brand-sheet.png` — the Pack & Go Agency identity sheet. It's already consistent; match it.

**Colours** (Tailwind theme tokens, defined in `src/styles/global.css`):
```
--navy:      #0B1F3A   /* Deep Navy — dark sections, headings, footer */
--navy-mid:  #1A3A63   /* lifted navy — borders and hover on dark */
--navy-deep: #061529   /* deepest navy */
--blue:      #1677FF   /* Travel Blue — the brand accent */
--blue-deep: #0B5ED7   /* filled buttons + accent text on light (see below) */
--sky:       #55C2FF   /* Sky Blue — accent on navy */
--soft:      #F7FAFC   /* Soft White — light section backgrounds */
--soft-dim:  #EAF1F8   /* the alternating light section */
--ink:       #16243A   /* body text */
--muted:     #5A6B80   /* secondary text */
```

**Contrast rule for the blues.** Brand blue `#1677FF` is 4.10:1 on white and misses AA for body-size text. So: `blue-deep` for filled buttons with white text and for accent text on light surfaces; `sky` for accent text and icons on navy; plain `blue` only for hover states, borders, focus rings and large type.

**Typography:**
- Headings: a bold condensed sans or a display face with weight — the posters use heavy brush/script lettering. Something like Anton, Bebas Neue, or Archivo Black for H1/H2.
- Body: Inter or Plus Jakarta Sans, 16px minimum, generous line height (1.65).
- Never smaller than 14px anywhere.

**Feel:** confident, clean, well-travelled. Rounded corners (12–16px), soft shadows, generous whitespace. Alternate section backgrounds between soft white and deep navy so the page has rhythm.

**Avoid:** gradient meshes, glassmorphism, generic hero with a centered rounded search bar. The palette is blue, but this is a travel business in Tamil Nadu — not a SaaS landing page.

---

## Structure

Sections in order (all one page, anchor-linked):

1. Sticky header + nav
2. Hero
3. Live offer banner (dismissible)
4. About
5. Destinations — category filter + destination cards
6. Rentals
7. Why Choose Us (6 items)
8. How It Works (3 steps)
9. Testimonials
10. Gallery
11. FAQ (accordion)
12. Final CTA
13. Footer
14. Floating WhatsApp button (mobile only)

---

## File Layout

```
/
├── CLAUDE.md
├── astro.config.mjs
├── tailwind.config.mjs
├── public/
│   ├── favicon.png
│   └── og-image.jpg
└── src/
    ├── content/
    │   ├── website-content.md    # the original brief, kept for reference only
    │   ├── destinations.json     # categories + destination cards
    │   ├── faqs.json
    │   └── testimonials.json
    ├── components/
    │   ├── Header.astro
    │   ├── Hero.astro
    │   ├── OfferBanner.astro
    │   ├── DestinationCard.astro
    │   ├── ...
    │   └── WhatsAppFloat.astro
    ├── layouts/
    │   └── Base.astro
    ├── pages/
    │   └── index.astro
    └── styles/
        └── global.css
```

**Rule:** destinations, FAQs, and testimonials live in JSON. The owner should be able to add a destination by appending one object to `destinations.json` — its category chips, its counts in the hero panel and the About stats all follow automatically, with no component touched.

---

## Content Rules

- Copy lives in `src/content/`. Never hardcode marketing text into `.astro` files.
- Short sentences. Plain English. No "unlock your wanderlust," no "embark on a journey," no travel-brochure filler.
- The tagline **"Pack your bags, we'll handle the rest."** is fixed brand copy — do not reword it.
- No prices on the page. If that ever changes, see non-negotiable 6.
- Phones display spaced — `63691 53144`, `93429 37594` — but link as `+916369153144` / `+919342937594`.

---

## SEO

- One `<h1>` on the page only.
- Meta title, description, and Open Graph tags in `Base.astro`.
- JSON-LD structured data: `TravelAgency` schema with name, telephone, address, areaServed, and `FAQPage` schema for the FAQ section.
- Descriptive `alt` text on every image — real descriptions, not "image1".
- `sitemap.xml` and `robots.txt` generated at build.
- Target local intent: mention Madurai in the H1 region, meta, and footer address.

---

## Accessibility

- Colour contrast 4.5:1 minimum for body text. Check the blues carefully — brand blue on white fails at body size; use `blue-deep` on light and `sky` on navy (see Design Direction).
- Every interactive element keyboard-reachable with a visible focus ring.
- FAQ accordion uses proper `aria-expanded` and `aria-controls`.
- Tap targets 44×44px minimum.

---

## Before Marking Anything Done

- [ ] Runs at 360px with no horizontal scroll
- [ ] Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100
- [ ] Every WhatsApp link opens with correct prefilled text
- [ ] Every `[[TO CONFIRM]]` resolved or its element removed
- [ ] No stock images, no lorem ipsum, no invented reviews or stats
- [ ] Total page weight under 1.5MB
- [ ] Tested in Chrome mobile on actual Android, not just DevTools

---

## Things Not To Do

- Don't add a booking calendar, payment gateway, or login. Out of scope.
- Don't add a chatbot widget.
- Don't add carousel/slider libraries — use CSS scroll-snap if a horizontal scroller is needed.
- Don't pull in a UI component library. Tailwind utilities are enough for a single page.
- Don't add animation libraries. CSS transitions only.
- Don't create multiple pages. If Terms and Privacy are needed later, they can be separate minimal pages — but the marketing site is one page.