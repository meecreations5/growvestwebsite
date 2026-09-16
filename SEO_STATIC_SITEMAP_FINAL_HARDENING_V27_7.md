# GrowVest Website V27.7 — Static Sitemap Final Hardening

## Purpose
Google Search Console continued to show **Couldn't fetch / Sitemap could not be read** even after the V27.6 sitemap passed Google's Live URL test and returned HTTP 200 with `Content-Type: application/xml`.

V27.7 removes the remaining Next.js metadata-route dependency from `/sitemap.xml`.

## Changes
- Removed `src/app/sitemap.js`.
- Added a literal static file at `public/sitemap.xml`.
- Normalised the homepage sitemap URL to `https://growvest.info/`.
- Kept the sitemap minimal: only canonical `<loc>` entries; no `priority` or `changefreq` fields.
- Added explicit response headers for `/sitemap.xml` in `next.config.mjs`.
- Updated the SEO validation script to require and validate `public/sitemap.xml` against all configured public SEO routes.
- Removed obsolete sitemap revalidation calls from the Insights cache workflow because a static file does not require runtime revalidation.
- Updated the admin cache description accordingly.

## Production behaviour
After deployment, `/sitemap.xml` is served as a static public asset rather than a Next.js metadata route.

Expected checks:

```text
curl.exe -I https://growvest.info/sitemap.xml
```

Expected essentials:

```text
HTTP/1.1 200 OK
Content-Type: application/xml; charset=utf-8
```

`https://growvest.info/robots.txt` should continue to advertise:

```text
Sitemap: https://growvest.info/sitemap.xml
```

## Search Console sequence
1. Deploy V27.7 to Production.
2. Confirm `/sitemap.xml` opens normally.
3. Run the `curl.exe -I` check.
4. Run Search Console **Test Live URL** for `/sitemap.xml`.
5. If successful, remove the existing failed sitemap entry once and submit `sitemap.xml` again.
6. Do not repeatedly delete/re-submit after that.
