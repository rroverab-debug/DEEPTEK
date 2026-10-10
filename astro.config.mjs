// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Placeholder production domain. Change to https://deeptek.com (or the final
// domain) once ownership is verified. Used for canonical URLs and the sitemap.
const SITE = process.env.SITE_URL ?? 'https://deeptek.ae';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    // Keep all CSS in external files so the Content-Security-Policy can stay
    // strict (no 'unsafe-inline' for styles).
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never inline scripts or assets as data: URIs; keeps CSP strict.
      assetsInlineLimit: 0,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/contact/thanks') && !page.includes('/404'),
    }),
  ],
});
