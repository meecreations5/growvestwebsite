# GrowVest SEO & Launch Setup — v14

## Implemented

### Search and sharing metadata

- Central SEO configuration in `src/app/lib/seo.js`.
- Unique title and description for every public route.
- Canonical URL on every indexable page.
- Open Graph and X/Twitter large-image metadata.
- Branded 1200 × 630 social-sharing image.
- File-based favicon, app icon, Apple icon and web manifest.
- `Organization`, `WebSite`, `BreadcrumbList` and `FAQPage` structured data.
- `en-IN` language and locale configuration.

### Crawl and indexing controls

- Generated `/robots.txt`.
- Generated `/sitemap.xml` from the central route registry.
- `/api/` is excluded from production crawling.
- Every non-approved environment sends `noindex, nofollow` in both metadata and `X-Robots-Tag`.
- Indexing is enabled only when `NEXT_PUBLIC_ALLOW_INDEXING=true` and the deployment is rebuilt.
- Canonical `www.growvest.info` requests redirect permanently to `https://growvest.info`.

### Launch trust and legal foundation

- Dedicated `/privacy-policy` page.
- Dedicated `/terms-of-use` page.
- Cookie/analytics preference banner.
- Analytics does not load or queue events before acceptance.
- Footer links to Privacy Policy, Terms of Use, disclosures and cookie preferences.
- Health endpoint at `/api/health` for uptime monitoring.

### Performance and security

- Google Fonts moved from CSS `@import` to `next/font`.
- Next.js upgraded from `15.5.2` to security-patched `15.5.21`.
- Added HSTS, referrer, MIME-sniffing, frame, permissions and DNS-prefetch headers.
- Added manifest icons including a maskable icon.

## Required production environment variables

```env
NEXT_PUBLIC_SITE_URL=https://growvest.info
NEXT_PUBLIC_ALLOW_INDEXING=false
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDWXqIeasc3hpqep50tpRFlXxc5kh8uzc4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=growvest-reporttool.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=growvest-reporttool
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=growvest-reporttool.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=712836553685
NEXT_PUBLIC_FIREBASE_APP_ID=1:712836553685:web:eea8940bdc609156d1bb5c
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-EB8M6Z12Q5

BREVO_API_KEY=
BREVO_SENDER_EMAIL=connect@growvest.info
BREVO_SENDER_NAME=GrowVest
GROWVEST_NOTIFICATION_EMAIL=connect@growvest.info
BREVO_NEWSLETTER_LIST_ID=
```

Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` during final review. Change it to `true` only after all launch approvals are complete, then rebuild and redeploy.

## Vercel and domain setup

1. Add `growvest.info` as the primary production domain.
2. Add `www.growvest.info` and confirm it redirects to the apex domain.
3. Confirm SSL is active for the apex, `www`, and `insights` subdomain.
4. Set all production environment variables in Vercel.
5. Keep Preview environment indexing disabled.
6. Deploy and check `/api/health` returns `status: ok`.

## Google Search Console setup

1. Add a **Domain property** for `growvest.info`.
2. Complete DNS verification.
3. Copy the verification token into `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` only if HTML-tag verification is also desired.
4. Test these URLs with URL Inspection:
   - `https://growvest.info/`
   - `https://growvest.info/about`
   - `https://growvest.info/your-goals`
   - `https://growvest.info/the-growvest-way`
   - `https://growvest.info/contact`
5. Submit `https://growvest.info/sitemap.xml` in the Sitemaps report.
6. Confirm the sitemap status becomes **Success**.
7. Request indexing for the homepage after launch approval.

## Firebase Analytics setup

1. Use the dedicated GrowVest website Firebase web app in the `growvest-reporttool` project.
2. Confirm its production web data stream points to `https://growvest.info`.
3. Configure all `NEXT_PUBLIC_FIREBASE_*` variables shown above.
4. Redeploy.
5. Accept analytics in the website banner and verify Realtime events.
6. Confirm these events appear:
   - `page_view`
   - `scroll_depth`
   - `primary_cta_click`
   - `secondary_cta_click`
   - `investor_portal_click`
   - `contact_request_submitted`
   - `newsletter_subscription_submitted`
   - Bucket List interaction events

## Pre-launch checks

- [ ] Exact legal entity spelling approved.
- [ ] NISM wording approved and no SEBI/AMFI registration claim remains.
- [ ] Actual compensation model approved and disclosed.
- [ ] Privacy Policy and Terms of Use reviewed by qualified counsel.
- [ ] Brevo sender domain authenticated.
- [ ] Contact and newsletter flows tested end to end.
- [ ] Investor Portal link tested on desktop and mobile.
- [ ] No console errors or hydration warnings.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Production server smoke-tested with `npm start`.
- [ ] Lighthouse mobile and desktop checks completed.
- [ ] Chrome, Edge, Firefox, Safari, Android Chrome and iPhone Safari checked.
- [ ] Social preview tested in WhatsApp, LinkedIn and X/Twitter.
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true` set only after final sign-off.

## Launch sequence

1. Deploy with indexing disabled.
2. Complete functional, compliance, browser and content sign-off.
3. Take a deployment backup/reference.
4. Set `NEXT_PUBLIC_ALLOW_INDEXING=true`.
5. Rebuild and deploy production.
6. Verify:
   - `/robots.txt` allows `/` and blocks `/api/`.
   - `/sitemap.xml` returns all approved routes.
   - Page source contains `index, follow`.
   - Canonical URLs use `https://growvest.info`.
7. Submit the sitemap and request homepage indexing.
8. Monitor Search Console, analytics, forms and uptime for the first 72 hours.

## Post-launch monitoring

### First 24 hours

- Check contact and newsletter delivery.
- Check `/api/health` using an uptime monitor.
- Check 404s, server errors and Vercel function logs.
- Confirm GA4 Realtime receives consented visits.

### First 7 days

- Review Search Console Page Indexing and Core Web Vitals.
- Review top landing pages and CTA events.
- Check mobile usability and social-sharing previews.
- Correct any duplicate titles, crawl failures or broken links.

### Monthly

- Review sitemap status and indexed-page coverage.
- Refresh Insights content and real modification dates when article routes are introduced.
- Review regulatory, compensation, privacy and business information for accuracy.
- Install the latest patched Next.js maintenance release after testing.
