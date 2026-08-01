// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// CHANGE THIS to the real domain before launch — it is used for sitemap.xml,
// robots.txt and the canonical / Open Graph URLs.
const SITE = 'https://packandgovacation.in';

export default defineConfig({
  site: SITE,
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    // Gallery photos are local assets processed at build time.
    responsiveStyles: true,
  },
});
