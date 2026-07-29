# GrowVest v23.2 — SEO Optimisation

## What changed

### Technical SEO
- Centralised, unique search titles and meta descriptions for all 20 public routes.
- Canonical URL generation for every public page and published Insight.
- Production-only index controls through `NEXT_PUBLIC_ALLOW_INDEXING`.
- Improved `robots.txt` and dynamic `sitemap.xml` behaviour.
- Added an Insights RSS feed at `/insights/feed.xml`.
- Added explicit favicon and Apple icon metadata.
- Preserved the production redirect from `www.growvest.info` to `growvest.info`.

### Structured data
- Organization + FinancialService + WebSite structured data.
- WebPage, AboutPage, ContactPage and CollectionPage structured data.
- FAQPage structured data using only published FAQs.
- ItemList structured data for the Goal Library and Insights directory.
- Article structured data for every published Insight, including publisher logo, author, dates, categories, tags, word count and absolute image URLs.
- Breadcrumb structured data for key public pages and each Insight article.
- Testimonial content is intentionally not marked up as ratings or aggregate reviews.

### Content-management SEO
Homepage and About editors now support:
- SEO title
- Meta description
- Canonical URL
- Open Graph image URL
- Index/noindex control
- Search-result preview
- Character-count guidance

### SEO Centre
New route:

`/admin/seo`

The SEO Centre shows:
- Production indexing status
- Canonical base URL
- Google Search Console verification readiness
- Sitemap, robots and RSS links
- Search title and description checks for all public pages
- Published Insight SEO checks
- Missing featured-image alternative text
- Noindex warnings

### Automated SEO validation
New command:

```bash
npm run check:seo
```

It validates:
- Route coverage
- Missing or duplicate titles and descriptions
- Title and description length guidance
- Required metadata files
- Sitemap, robots and RSS availability
- Canonical and Googlebot preview controls

`npm run check:source` now includes the SEO validation.

## Production setup

Set these values only in the production environment:

```env
NEXT_PUBLIC_SITE_URL=https://growvest.info
NEXT_PUBLIC_ALLOW_INDEXING=true
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` for local, preview and staging environments.

After deployment:
1. Open `/robots.txt` and confirm the public site is allowed.
2. Open `/sitemap.xml` and verify all public pages and published Insights appear.
3. Open `/insights/feed.xml` and verify the RSS feed.
4. Add the production domain to Google Search Console.
5. Submit `https://growvest.info/sitemap.xml`.
6. Inspect the homepage, Insights directory and several Insight article URLs.
7. Validate structured data using Google's Rich Results Test and Schema Markup Validator.
8. Monitor Core Web Vitals and indexing reports after launch.

## No database migration required
The existing website page records can be saved again to add optional `canonicalUrl` and `openGraphImage` fields. Existing records continue to work without them.
