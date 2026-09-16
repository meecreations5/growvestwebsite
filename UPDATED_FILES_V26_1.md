# GrowVest v26.1 Updated Files

## Configuration and validation

- `next.config.mjs`
- `package.json`
- `scripts/check-performance-basics.mjs`
- `README.md`
- `PERFORMANCE_CACHE_FOUNDATION_V26_1.md`
- `VALIDATION_REPORT_V26_1.md`

## Public routes and views

- `src/app/(website)/layout.jsx`
- `src/app/(website)/insights/page.jsx`
- `src/app/(website)/insights/[slug]/page.jsx`
- `src/app/(website)/insights/category/[slug]/page.jsx`
- `src/app/(website)/insights/author/[slug]/page.jsx`
- `src/app/(website)/insights/feed.xml/route.js`
- `src/app/(website)/investor-experiences/page.jsx`
- `src/app/_views/Home.jsx`
- `src/app/sitemap.js`

## Public components

- `src/app/components/DeferredWebsiteFeatures.jsx`
- `src/app/components/OptimizedImage.jsx`
- `src/app/components/PageTransition.jsx`
- `src/app/components/GrowVestLogo.jsx`
- `src/app/components/InsightsDirectory.jsx`
- `src/app/components/InsightArticle.jsx`
- `src/app/components/TeamHierarchy.jsx`
- `src/app/components/InvestorTestimonials.jsx`
- `src/app/components/InvestorExperiencesGallery.jsx`

## Cache repositories and security

- `src/app/lib/server/cacheConfig.js`
- `src/app/lib/server/websiteContentRepository.js`
- `src/app/lib/server/insightsRepository.js`
- `src/app/lib/server/teamSocialRepository.js`
- `src/app/lib/server/testimonialsRepository.js`
- `src/app/lib/server/growvestGuideRepository.js`
- `src/app/lib/server/requestSecurity.js`
- `src/app/lib/server/adminAuth.js`

## Admin cache management

- `src/app/admin/(protected)/cache-management/page.jsx`
- `src/app/admin/_components/CacheManagementPanel.jsx`
- `src/app/admin/_components/AdminShell.jsx`
- `src/app/api/admin/cache/revalidate/route.js`

## Admin automatic invalidation

- `src/app/api/admin/growvest-guide/settings/route.js`
- `src/app/api/admin/team/route.js`
- `src/app/api/admin/team/[id]/route.js`
- `src/app/api/admin/social-media/route.js`
- `src/app/api/admin/social-media/[id]/route.js`
- `src/app/api/admin/testimonials/route.js`
- `src/app/api/admin/testimonials/[id]/route.js`
