# DeepTek website

Marketing website for **DeepTek**, a UAE company offering IT solutions, digital marketing and AI automation.

- **Stack:** Astro (static output), TypeScript, GSAP + ScrollTrigger + SplitText
- **Hosting:** Cloudflare Pages (free tier) with one Pages Function for the contact form
- **Data:** no database. Enquiries are emailed directly to the team.
- **Domain:** `deeptek.ae` is a placeholder until availability and ownership are verified. `deeptek.com` is the alternative (see [Domains](#domains)).

> Nothing has been purchased or deployed. Deployment and any paid services need the owner's approval first.

---

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero, progressive text reveal, horizontal service rail with progress indicator, sticky process story, selected work, principles, call to action |
| `/solutions/` | The three pillars (IT, Marketing, AI) with sticky headings, process, engagement models, FAQ (with FAQ schema) |
| `/work/` | Animated project showcases and sectors. **Projects are illustrative samples**; replace with real case studies |
| `/about/` | Mission (scroll-revealed), sticky story, values, facts |
| `/contact/` | Secure enquiry form with Turnstile spam protection |
| `/contact/thanks/` | Confirmation page (noindex) |
| `/privacy/` | Draft privacy notice (have it reviewed before launch) |
| `/404` | Not found page |

## Project structure

```
deeptek-site/
├── astro.config.mjs        Site URL, sitemap, strict CSS/JS output for the CSP
├── wrangler.toml           Cloudflare Pages config (build dir, compatibility date, vars)
├── functions/api/contact.ts  Pages Function: POST /api/contact
├── public/
│   ├── _headers            Security headers (CSP, HSTS…) and caching
│   ├── _redirects          Friendly redirects
│   ├── js/flags.js         Tiny pre-paint script for motion preferences
│   ├── og.png, favicon.svg, robots.txt, site.webmanifest
└── src/
    ├── data/site.ts        ALL copy, services, projects, contact email — edit here first
    ├── styles/global.css   Design tokens and base styles
    ├── layouts/Base.astro  <head> SEO, Open Graph, JSON-LD, header/footer
    ├── components/         Header, Footer, Hero, ServiceRail, StickyStory, ProjectShowcase…
    ├── scripts/motion.ts   GSAP animations (respect reduced motion)
    └── pages/              Routes
```

## Getting started

Requires **Node 22** (see `.nvmrc`).

```bash
npm install
npm run dev          # http://localhost:4321 (pages only; the form API is not available here)
npm run build        # type-checks, then builds to ./dist
```

To test the full site **including the contact form** locally with the Cloudflare runtime:

```bash
cp .dev.vars.example .dev.vars   # uses Cloudflare's always-pass Turnstile test keys
npm run build
npm run preview                  # http://localhost:8788
```

With the email settings left empty in `.dev.vars`, submissions are printed to the terminal instead of being sent.

## Editing content

Most text lives in `src/data/site.ts`: company details, navigation, services, solution pillars, process steps, projects, values and FAQs. Update the placeholder email `hello@deeptek.ae` and add social links there once they exist.

Project artwork is generated, original SVG (`ProjectArt.astro`). Replace it with real screenshots or photography when case studies are ready (place images in `src/assets/` and use Astro's `<Image />` for automatic optimisation).

## Design system

- **Colour:** monochrome only. Paper `#f3f3f1`, ink `#0c0c0c`, greys for secondary text, all meeting WCAG AA contrast.
- **Type:** Inter Tight (headlines and body) and JetBrains Mono (labels), self-hosted, so no third-party font requests.
- **Layout:** generous white space, thin rules, numbered sections, a 90rem max width with fluid gutters.
- **Motion:** short fades, line-by-line headline reveals, words that brighten as you scroll, a pinned horizontal service rail with a progress bar, sticky storytelling, and project images that open from an inset frame. All motion is off when the visitor prefers reduced motion, and every page works without JavaScript.

## Accessibility

- Semantic landmarks, one `h1` per page, skip link, visible focus styles
- Mobile menu with `aria-expanded`, focus trap and Escape to close
- `prefers-reduced-motion` disables all GSAP animation and CSS transitions; content is never hidden without JS
- Split-text animations keep an accessible label (`aria: auto`)
- Form labels, error messages announced via `role="status"`, and native validation without JS
- The horizontal rail is keyboard scrollable on small screens

## SEO

- Per-page titles, descriptions and canonical URLs
- Open Graph and Twitter cards (`public/og.png`)
- `ProfessionalService` and `FAQPage` JSON-LD
- `sitemap-index.xml` (generated) and `robots.txt`
- Preview deployments on `*.pages.dev` are sent `noindex`

## Security

- **Static site:** no server, no database, no admin panel to attack.
- **Strict Content-Security-Policy** in `public/_headers`: scripts only from the site itself and Cloudflare Turnstile, no inline scripts or styles, no framing (`frame-ancestors 'none'`), forms can only post to the site.
- HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `COOP`.
- **Contact form** (`functions/api/contact.ts`):
  - POST only, form encodings only, 32 KB body limit
  - Origin check rejects cross-site submissions
  - Cloudflare Turnstile verified server-side on every request
  - Honeypot field silently drops basic bots
  - Server-side validation and length limits; control characters stripped (no email header injection)
  - Sent as plain text email (no HTML injection), with `Reply-To` set to the visitor
  - Secrets only in encrypted environment variables, never in the code
- **Recommended in the Cloudflare dashboard (free):** a WAF rate limiting rule on `/api/contact` (for example 5 requests per minute per IP), "Always Use HTTPS", and turn off "Email Address Obfuscation" (it injects an inline script the CSP would block).

## Contact form setup

1. **Turnstile** (free): Cloudflare dashboard → Turnstile → Add site. Add `deeptek.ae` (and `deeptek.com` if used). You get a site key and a secret key.
2. **Email provider:** the function uses [Resend](https://resend.com) as a placeholder (free tier). Verify the sending domain with the DNS records they provide. To use another provider (Postmark, Brevo, SendGrid, Zoho ZeptoMail), replace the `fetch` call in `sendEmail()`.
3. **Environment variables** in Cloudflare Pages → Settings → Variables and Secrets:

| Name | Type | Example |
| --- | --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build variable | `0x4AAAA…` |
| `TURNSTILE_SECRET_KEY` | **Secret** | `0x4AAAA…` |
| `EMAIL_API_KEY` | **Secret** | `re_…` |
| `CONTACT_TO_EMAIL` | Variable | `hello@deeptek.ae` |
| `CONTACT_FROM_EMAIL` | Variable | `DeepTek Website <web@deeptek.ae>` |
| `ENVIRONMENT` | Variable | `production` (already set in `wrangler.toml`) |
| `SITE_URL` | Build variable | `https://deeptek.ae` |

If the email settings are missing in production, the form tells visitors to email directly instead of silently losing messages.

## Deploying to Cloudflare Pages

**Do not deploy until the owner approves.** When ready:

**Option A: Git integration (recommended)**

1. Push this folder to a GitHub repository.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command `npm run build`, output directory `dist`, environment variable `NODE_VERSION=22`.
4. Add the variables above, then deploy. Every push to `main` redeploys; pull requests get preview URLs.

**Option B: Direct upload from your machine**

```bash
npx wrangler login
npm run build
npm run deploy        # wrangler pages deploy ./dist --project-name deeptek-site
```

Cost: Cloudflare Pages, Pages Functions (100,000 requests/day), Turnstile and the WAF rate limit rule are all on the free plan. The only expected cost is the domain itself.

## Domains

`deeptek.ae` is used as a placeholder in `astro.config.mjs`, `src/data/site.ts`, `public/robots.txt` and the email addresses.

1. Check availability and ownership. `.ae` domains are registered through accredited registrars under the TDRA/.aeDA rules, which may require a UAE trade licence or trademark. `.com` can be registered anywhere (Cloudflare Registrar sells at cost).
2. If you use `deeptek.com` instead, set `SITE_URL=https://deeptek.com`, and update `site.url` and `site.email` in `src/data/site.ts` and the sitemap line in `public/robots.txt`.
3. In Cloudflare Pages → Custom domains, add the apex domain and `www`. Redirect `www` to the apex with a Cloudflare Redirect Rule.
4. If you own both, point the second domain at the first with a 301 redirect so search engines see one site.

## Before launch checklist

- [ ] Confirm domain and update placeholders
- [ ] Real contact email, social links and (optionally) phone or WhatsApp in `src/data/site.ts`
- [ ] Replace sample projects on `/work/` with real case studies
- [ ] Have the privacy notice reviewed
- [ ] Turnstile keys, email provider and variables set
- [ ] WAF rate limit rule on `/api/contact`
- [ ] Submit `sitemap-index.xml` in Google Search Console and Bing Webmaster Tools
- [ ] Run Lighthouse on the preview URL
