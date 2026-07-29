# GrowVest v26.1 — Performance and Cache Foundation

## Release objective

v26.1 reduces the amount of work performed on every public request while keeping Admin-published content fresh. It establishes the rendering, cache, image and JavaScript-loading foundation required before multilingual Guide and appointment-booking work.

## Public cache matrix

| Content | Revalidation window | Invalidation trigger |
|---|---:|---|
| Website settings and navigation | 60 minutes | Admin save or manual cache refresh |
| Homepage and About content | 60 minutes | Admin page publish/save or manual refresh |
| FAQs and Goal Library | 60 minutes | Admin save or manual refresh |
| Team, social links and testimonials | 60 minutes | Admin create/update/archive or manual refresh |
| Insights listing | 15 minutes | Insight create/update/publish/archive or manual refresh |
| Individual Insight | 60 minutes | Insight update, slug change, publish/archive or manual refresh |
| Insight taxonomy | 60 minutes | Category, tag or author update |
| GrowVest Guide settings and approved knowledge | 15 minutes | Guide/content update or manual refresh |
| RSS feed | 15 minutes | Insight update or timed revalidation |
| Sitemap | 60 minutes | Managed public-content update or timed revalidation |

Admin pages, form submissions, session APIs, webhooks and health routes remain uncached.

## Implemented changes

### 1. Central cache configuration

`src/app/lib/server/cacheConfig.js` defines reusable cache lifetimes and tags. Repositories no longer rely on unrelated hard-coded cache values.

### 2. Tagged Firestore repository caching

Public website, Insight, team, social, testimonial and Guide reads use Next.js server cache wrappers. Mutations invalidate only the affected cache tags and public paths.

Important tags include:

```text
website-settings
website-navigation
website-page-{slug}
website-faqs
website-goal-library
team-members
website-social-links
investor-testimonials
insights
insight-{slug}
insight-taxonomy
guide-settings
guide-sources
```

### 3. Automatic publish invalidation

Admin actions now invalidate the relevant public paths immediately. Examples:

- Homepage or About save: corresponding public page and shared website content
- Insight publish/update: `/insights`, the article route, RSS feed and sitemap
- Team update: `/about`
- Testimonial update: Homepage, About, Insights and Investor Experiences
- Social update: shared website layout, About and Contact
- Guide setting update: shared website layout

### 4. Manual cache management

New Super Admin route:

```text
/admin/cache-management
```

It provides controlled presets for:

- Website content
- Insights and SEO feeds
- Team and investor experiences
- GrowVest Guide knowledge
- Entire public website

Every manual refresh is recorded in `websiteAuditLogs`. The page requires `system.manage` permission.

### 5. Server-driven Insights pagination

The public Insights library no longer sends the full Insight archive to the browser. Filtering and pagination are resolved on the server, and only the current page is passed to the interactive directory.

Category and author routes also use paginated cached public data.

### 6. Reduced initial JavaScript

The shared website layout now defers non-critical interactive features:

- GrowVest Guide
- Motion effects
- Analytics
- Web Vitals reporting

These features are loaded after user interaction or during an idle window rather than blocking the initial render.

`PageTransition` is now a server-safe static wrapper instead of an unnecessary client component.

### 7. Image delivery foundation

`OptimizedImage.jsx` uses `next/image` for trusted local, Firebase and Google image sources while preserving a safe fallback for unknown remote URLs.

The release also:

- Enables AVIF and WebP output
- Sets a one-day optimized-image cache minimum
- Defines trusted remote image patterns
- Supplies responsive `sizes`
- Keeps non-critical content images lazy-loaded
- Adds intrinsic logo dimensions to reduce layout movement

### 8. Public route caching

The following public route groups no longer force dynamic rendering:

- Insights listing
- Insight articles
- Insight category and author pages
- Investor Experiences
- Website layout content
- RSS feed
- Sitemap

Each uses a route-appropriate revalidation interval.

### 9. Security compatibility retained

The production CSP retains Firebase, Microsoft, Google identity and Google API requirements. OAuth popup support remains enabled through `same-origin-allow-popups`.

Origin verification now normalizes configured domains and supports the current Vercel deployment origin without disabling CSRF-style request-origin validation.

## Performance acceptance checklist

Test on the deployed production or preview URL, not only through the development server.

1. Open Homepage, About, Insights and an Insight article twice and compare first and repeat response timings.
2. Publish an Insight and confirm the article, listing, feed and sitemap update without waiting for the TTL.
3. Update Homepage content and confirm the public page refreshes.
4. Use `/admin/cache-management` and confirm an audit-log record is created.
5. Confirm the Guide is not part of the initial route JavaScript request and loads when interaction begins.
6. Inspect Network requests to confirm below-the-fold images are lazy-loaded.
7. Test 320px, 360px, 390px, 430px, 768px and desktop widths.
8. Verify no hydration warnings, horizontal overflow or layout shifts are visible.
9. Review Vercel Speed Insights by route and mobile/desktop device class.
10. Run Lighthouse against a production build with browser extensions disabled.

## Commands

```powershell
Remove-Item -Recurse -Force .next
npm install
npm run check:source
npm run lint
npm run build
npm run start
```

For a deployment smoke test:

```bash
npm run smoke -- https://your-deployment-domain
```

## Deferred to later v26 phases

This release does not add multilingual content, appointment booking or calendar APIs. Those features should be built on top of this foundation in v26.2–v26.4.
