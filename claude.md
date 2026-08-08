# CLAUDE.md

Project instructions for Claude Code. Read this fully before writing any code.

---

## Project

Single-page marketing website for **Pack & Go Vacation**, a tour operator and vehicle rental business based in Madurai, Tamil Nadu.

**Goal:** Convert visitors into WhatsApp enquiries. Not e-commerce — there is no online payment, no booking engine, no user accounts. Every path leads to a conversation on WhatsApp or a phone call.

**Audience:** Mostly Tamil Nadu residents on Android phones over mobile data. Families, friend groups, bike riders, pilgrimage travellers. A meaningful share are not fluent English readers.

---

## Non-negotiables

1. **Mobile-first.** Design at 360px width first, then scale up. Desktop is secondary.
2. **Fast on 4G.** Target Lighthouse performance 90+ on mobile. Every image lazy-loaded and compressed.
3. **WhatsApp is the primary CTA.** Link format: `https://wa.me/919342937594?text=<url-encoded prefilled message>`. Prefill context-specific text per section (e.g. from the Goa card: "Hi, I'm interested in the Goa package").
4. **Phone numbers are tappable everywhere.** Two numbers: `tel:+916369153144` (primary) and `tel:+919342937594` (also the WhatsApp line). Never hardcode either — read them from `src/content/site.json` via `src/lib/contact.js`.
5. **No placeholder content ships.** Anything marked `[[TO CONFIRM]]` in `content/website-content.md` must either be filled by the owner or the element removed. Never invent prices, review text, stats, or policies.
6. **No stock photography.** Only the client's own trip photos.

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

**Ship zero client-side JavaScript** except for: mobile nav toggle, FAQ accordion, and the offer banner dismiss. Use Astro islands or a few lines of vanilla JS. Do not add React unless something genuinely requires it — nothing here does.

---

## Design Direction

Pull from the existing Instagram creative. It's already consistent — match it.

**Colours:**
```
--forest:    #1B3A26   /* deep green — headings, dark sections, footer */
--forest-mid:#2E5E3E   /* secondary green */
--gold:      #E8A317   /* accent, buttons, highlights */
--gold-soft: #F5C542   /* hover states */
--cream:     #F7F4EC   /* light section backgrounds */
--ink:       #1A1A1A   /* body text */
--muted:     #6B6B6B   /* secondary text */
```

**Typography:**
- Headings: a bold condensed sans or a display face with weight — the posters use heavy brush/script lettering. Something like Anton, Bebas Neue, or Archivo Black for H1/H2.
- Body: Inter or Plus Jakarta Sans, 16px minimum, generous line height (1.65).
- Never smaller than 14px anywhere.

**Feel:** outdoorsy, warm, confident. Rounded corners (12–16px), soft shadows, generous whitespace. Alternate section backgrounds between cream and deep green so the page has rhythm.

**Avoid:** gradient meshes, glassmorphism, purple/blue SaaS palettes, generic hero with a centered rounded search bar. This is a travel business in Tamil Nadu, not a startup landing page.

---

## Structure

Sections in order (all one page, anchor-linked):

1. Sticky header + nav
2. Hero
3. Live offer banner (dismissible)
4. About
5. Packages grid (6 cards)
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
    │   ├── website-content.md    # source copy — edit here, not in components
    │   ├── packages.json         # package cards data
    │   ├── faqs.json
    │   └── testimonials.json
    ├── components/
    │   ├── Header.astro
    │   ├── Hero.astro
    │   ├── OfferBanner.astro
    │   ├── PackageCard.astro
    │   ├── ...
    │   └── WhatsAppFloat.astro
    ├── layouts/
    │   └── Base.astro
    ├── pages/
    │   └── index.astro
    └── styles/
        └── global.css
```

**Rule:** package data, FAQs, and testimonials live in JSON. The owner should be able to add a new package by editing one JSON object, without touching a component.

---

## Content Rules

- Copy lives in `src/content/`. Never hardcode marketing text into `.astro` files.
- Short sentences. Plain English. No "unlock your wanderlust," no "embark on a journey," no travel-brochure filler.
- The tagline **"Pack your bags, we'll handle the rest."** is fixed brand copy — do not reword it.
- Prices display as `From ₹X,XXX` — always with "From," always with the rupee symbol.
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

- Colour contrast 4.5:1 minimum for body text. Check gold-on-cream carefully — it usually fails; darken the gold or put it on dark green instead.
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