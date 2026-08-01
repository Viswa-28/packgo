# Gallery photos

Drop your own trip photos in this folder — **your** photos only, no stock imagery.

Then list them in `src/content/gallery.json`:

```json
[
  { "file": "warkala-cliff-beach.jpg", "alt": "Riders parked above the cliff beach at Warkala at sunset" },
  { "file": "munnar-tea-estate.jpg", "alt": "Group standing among the tea estate rows in Munnar" }
]
```

Rules the build enforces:

- An entry only renders if the file actually exists here **and** `alt` is non-empty.
- The whole Gallery section stays hidden while `gallery.json` is empty.
- Astro converts everything to WebP, generates 300px/600px variants, and lazy-loads
  them — so upload the original, don't pre-resize.

Write real `alt` text: describe what's in the photo, not `"image1"`.
Aim for 8–12 photos. Keep each source file under ~2MB.
