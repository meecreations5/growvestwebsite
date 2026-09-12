# GrowVest Website V27.6 - Sitemap Fetch Hardening

## Purpose
Google Search Console was reporting `Couldn't fetch`, `Type: Unknown`, and `0 discovered pages` for `https://growvest.info/sitemap.xml`.

## Change made
`src/app/sitemap.js` has been changed so the core public sitemap is generated only from the static `SEO_PAGES` registry.

The sitemap no longer imports or waits for `getPublishedInsights()` / Firestore before returning XML.

## Why
A sitemap should remain available even if Firebase/Firestore is slow, cold-starting, temporarily unavailable, or misconfigured. The core sitemap is now deterministic and can be generated statically by Next.js.

## Indexing gate retained
Production indexing still requires:

```env
NEXT_PUBLIC_ALLOW_INDEXING=true
NEXT_PUBLIC_SITE_URL=https://growvest.info
```

## Expected production checks
After deployment:

1. `https://growvest.info/robots.txt` should allow `/` and advertise `https://growvest.info/sitemap.xml`.
2. `https://growvest.info/sitemap.xml` should return HTTP 200 with XML immediately.
3. Google Search Console Live Test for the sitemap should show a successful page fetch.
4. Google Search Console Live Test for the homepage should show crawl allowed and indexing allowed.
5. Leave the sitemap submitted; do not repeatedly delete and resubmit it.

## Dynamic Insight URLs
Individual Insight article URLs are temporarily omitted from the sitemap to remove the Firestore dependency. They remain discoverable through `/insights` and internal links. A separate resilient dynamic insight sitemap can be added later after the core sitemap is successfully processed by Google.
