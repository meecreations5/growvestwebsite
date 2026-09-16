# GrowVest Launch Checklist — v14

## Build

- [ ] Install dependencies and commit `package-lock.json`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm start` and perform a production-mode smoke test.
- [ ] Confirm no hydration, console or network errors.

## Environment

- [ ] `NEXT_PUBLIC_SITE_URL=https://growvest.info`
- [ ] Google and Bing verification values configured where required.
- [ ] GA4 ID configured and tested with consent.
- [ ] Brevo variables configured and tested.
- [ ] Preview and staging indexing remains disabled.

## Business and compliance

- [ ] Legal entity spelling verified.
- [ ] NISM certificate wording verified.
- [ ] No SEBI or AMFI registration claim.
- [ ] Compensation model disclosed accurately.
- [ ] Client statistics and service claims approved.
- [ ] Privacy Policy and Terms reviewed.

## Domain and SEO

- [ ] Apex domain resolves to production.
- [ ] `www` redirects to apex.
- [ ] HTTPS works on all required subdomains.
- [ ] Canonical URLs are correct.
- [ ] Sitemap returns every approved page.
- [ ] Robots remains blocked until final sign-off.
- [ ] Open Graph image renders correctly.
- [ ] Search Console property verified.

## Functional QA

- [ ] Contact form sends GrowVest and visitor emails.
- [ ] Newsletter handles new and duplicate subscriptions.
- [ ] Investor Portal transition and redirect work.
- [ ] Cookie banner accept, decline and reopen actions work.
- [ ] Mobile action bar does not conflict with cookie banner.
- [ ] Header menus work with mouse, keyboard and touch.
- [ ] All CTA links and footer links work.

## Go live

- [ ] Set `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- [ ] Rebuild and deploy.
- [ ] Confirm robots/meta tags are indexable.
- [ ] Submit sitemap in Search Console.
- [ ] Request indexing for the homepage.
- [ ] Start uptime and error monitoring.
