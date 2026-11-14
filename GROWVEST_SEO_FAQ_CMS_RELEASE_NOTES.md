# GrowVest website: SEO, FAQ, CMS and role-management enhancement

**Date:** 13 November 2026  
**Source baseline:** Uploaded `growvestwebsite (2).zip`  
**Implementation:** Compatible in-place enhancement; no replatforming or Firebase schema migration required.

## Executive assessment

The uploaded Next.js 15.5.21 App Router website already contained Firebase-admin-backed content repositories, administration, an editorial Insights CMS, an FAQ directory, and an SEO Centre. The major gap was that detailed page-level content editing covered only the **Homepage** and **About** page, whereas the website's other fixed public routes were predominantly coded directly in JSX. Also, FAQ questions were global rather than assignable to individual pages, and there was no on-screen management of administrator roles.

This package closes the FAQ, SEO-metadata and access-control gaps for **21 primary public pages**, and improves Insight SEO. It deliberately **does not replace every existing page section with a block-based CMS**. That larger template migration must be planned and verified page by page.

## What is implemented

1. **Page-specific FAQs:** Existing FAQ content is retained. Each FAQ now has a `pageKeys` list, selected from the supported public routes. Only published, visible, assigned FAQs render on a particular public page. Native accessible accordions render server-side, with no dependency on client JavaScript. The general `/faqs` directory retains its own collection view. Maximum 10 assigned FAQs are displayed on each page (ordered by `displayOrder`).
2. **21 public-page records in CMS:** Each page can manage SEO title, description, canonical, Open Graph image and index/noindex toggle. Each also offers a new optional server-rendered supporting text section and FAQ section settings. The designed page bodies remain intact. The Homepage and About maintain their previous additional hero/section editors.
3. **SEO Centre:** Analyses all 21 pages using current published CMS values, lists assigned FAQ counts and allows direct editing. Insight SEO checks remain available.
4. **Insight article FAQs:** Added an article editor `FAQ question & answer` content block. Published articles render those Q&A blocks as visible accordions.
5. **Published Insight metadata:** Added separate SEO-only editor and restricted API, allowing the SEO Manager to change only the article's SEO object (title, description, canonical, social image and indexability). Article text, slug, publication approval and status are unchanged by this endpoint.
6. **Super Admin role management:** Add an existing, email-verified Firebase Authentication user to `websiteAdmins`, set a role, deactivate users and change roles. Only Super Admins may use this feature. There are audit logs and a prohibition on self-demotion or removing the last active Super Admin. Updates clear older custom permission grants. The SEO Manager cannot access sensitive enquiries, admin-user management or system controls.
7. **Least-privilege authorization:** SEO Manager has `website.page.manage`, `website.faq.manage`, `seo.read/manage`, `insights.read/create/update/analytics` and `media.manage`, but cannot publish Insights, manage system settings, view enquiries, edit navigation or manage users. Legacy custom grants cannot override those SEO constraints or grant admin-management privileges to other roles.
8. **Stability:** Preserved homepage visuals, static sitemap.xml, Vercel/Firebase configuration and other existing systems. Removed one unreferenced legacy mobile file that failed the repository's own mobile check.

## Where the SEO team works

| Task | Admin path |
| --- | --- |
| Review SEO health | `/admin/seo` |
| Manage each main page's SEO + section | `/admin/website/pages` |
| Assign FAQ questions to pages | `/admin/faqs` |
| Edit SEO of a published Insight | `/admin/seo/insights/[id]` |
| Draft Insights + article FAQ blocks | `/admin/insights` |
| Grant SEO access (Super Admin only) | `/admin/users` |

**Onboarding:** A prospective SEO user must exist in Firebase Authentication and have a verified email. Their first Microsoft sign-in attempt may be necessary to create the account; then a Super Admin can grant `seo_manager` access from Role Management. No direct Firestore edits are necessary for normal administration.

**FAQ publishing process:** In Admin → FAQs by Page, create or edit the question, approved answer, category, display order, target page(s), visibility and `Published` status. A record left in Draft/Archived is not shown. Currently, published FAQ and page records are live after cache revalidation; there is **no mandatory two-person review** for these changes. Consider adding one for regulated financial disclosures.

## Public route coverage (21 fixed pages)

/, /about, /bucket-list-builder, /client-stories, /contact, /disclosures, /family-wealth, /faqs, /for-nris, /goal-library, /how-we-charge, /insights, /investor-experience, /investor-experiences, /privacy-policy, /progress-reviews, /start-here, /terms-of-use, /the-growvest-way, /wealth-guidance, /your-goals

Additional dynamic Insight articles use the existing Insights CMS and newly added article FAQ blocks and published Insight SEO-only metadata editor. Dynamic category/tag/author archives and the transactional Thank You page were not converted into individual page-settings CMS records. Thank You stays noindex by design.

## What remains to reach a true full-page CMS

- **All original page sections:** Their existing copy, hero media, visual components and CTAs are largely still authored in React. The new generic editor changes SEO metadata and adds optional content below a page; it does **not** edit every existing header, card, pricing/fee disclosure or brand statement. Only Home/About already have their respective detailed template editors. For full control, create typed section schemas for each template, connect existing JSX to the CMS, add preview/versioning and run visual regression per page.
- **Compliance approvals:** For financial education, investment/distribution claims, NRI content, fees and disclosures, define reviewer and publisher roles, immutable history and a two-step approval process for FAQ and page records.
- **Indexing and sitemap:** The existing **static** `/sitemap.xml` is intentionally preserved. Turning off indexing on a page changes the live robots metadata, but does not automatically remove the URL from the sitemap. Keep the sitemap synchronized manually or implement a carefully tested generator in a separate change.
- **Search ranking:** Clear, relevant answers help users. Google retired FAQ rich-result display on 7 May 2026; adding FAQ structured data should not be presented as a guarantee of rich snippets, additional rankings or traffic.
- **Actual SEO copy:** No new financial claims, FAQs or marketing copy were invented. Await supplied, business-approved FAQ content before publishing questions across pages.

## QA completed locally

- `npm run check:source` — PASS: routes, local imports, JS/JSX source checks, secrets scan, public assets, baseline accessibility/security/SEO/performance/mobile and CMS coverage.
- Source checks verified 76 page routes with no duplicate URL paths and covered all 21 main public pages.
- Independent TypeScript parser validated all JS/JSX/TS source scripts with **0 parse errors** (repeat after final packaging).
- Firestore-backed permission, publication, validation and edit paths were reviewed at source level; changes use server-only Firebase Admin and existing cookie-based admin authorization.

**Not yet verified:** A full `npm ci`, `npm run lint`, `npm run build`, live Firebase acceptance, and Vercel production deployment. The environment's npm registry DNS lookup failed (`EAI_AGAIN`), preventing installation of dependencies and therefore a valid production build. All acceptance checks must be run in an environment with registry access and configured Firebase credentials before deployment.

## Deployment and acceptance steps

1. Back up the existing deployed code and the Firebase collections `websitePages`, `faqs`, `websiteAdmins`, `insightsPosts` and audit/version collections.
2. Extract this ZIP as the project root, preserving your `.env`/Vercel environment settings. Do not overwrite them with `.env.example`.
3. Run `npm ci`, `npm run check:source`, `npm run lint`, `npm run build`. Validate configuration with `npm run check:env -- --production` in the production environment.
4. Deploy to staging first. Log in as Super Admin and verify `/admin/users` and `/admin/website/pages`. Create a test SEO user through existing Firebase Authentication and assign the SEO Manager role.
5. Publish two approved test FAQs assigned to two **different** pages. Confirm visible display only on assigned pages; test FAQ directory, draft/archived behavior, mobile, page indexing metadata, canonical/social tags and cache invalidation.
6. Test an existing **published** Insight's SEO-only editor. Confirm changes are reflected in `<head>` without editing the published article body, status or slug; use an independent Content Reviewer to approve test article FAQs in draft workflow.
7. Verify unauthorized SEO-manager access fails to `/admin/users`, enquiries and system settings, including direct API calls. Verify disabling a user revokes their session on the next request.
8. Validate Search Console indexing, sitemap, Lighthouse/mobile, broken links, accessibility, analytics and content accuracy before production rollout.

## File change summary

Compared to the user-provided ZIP excluding git metadata, dependencies and build caches: **40 modified**, **15 added**, **1 removed** source/project files. Intentionally excluded `.git`, `node_modules`, `.next` and `.env` secrets from release ZIP.

### Added
- `scripts/check-page-cms.mjs`
- `src/app/admin/(protected)/seo/insights/[id]/page.jsx`
- `src/app/admin/(protected)/users/page.jsx`
- `src/app/admin/(protected)/website/pages/[key]/page.jsx`
- `src/app/admin/(protected)/website/pages/page.jsx`
- `src/app/admin/_components/AdminUsersManager.jsx`
- `src/app/admin/_components/InsightSeoEditor.jsx`
- `src/app/admin/_components/SitePageSettingsEditor.jsx`
- `src/app/api/admin/insights/[id]/seo/route.js`
- `src/app/api/admin/users/[uid]/route.js`
- `src/app/api/admin/users/route.js`
- `src/app/components/PageContentExtensions.jsx`
- `src/app/lib/server/adminUsersRepository.js`
- `src/app/lib/server/sitePageSeo.js`
- `src/app/lib/sitePages.js`

### Removed
- `src/app/components/MobileActionBar.jsx`

### Modified
- `package.json`
- `src/app/(website)/about/page.jsx`
- `src/app/(website)/bucket-list-builder/page.jsx`
- `src/app/(website)/client-stories/page.jsx`
- `src/app/(website)/contact/page.jsx`
- `src/app/(website)/disclosures/page.jsx`
- `src/app/(website)/family-wealth/page.jsx`
- `src/app/(website)/faqs/page.jsx`
- `src/app/(website)/for-nris/page.jsx`
- `src/app/(website)/goal-library/page.jsx`
- `src/app/(website)/how-we-charge/page.jsx`
- `src/app/(website)/insights/page.jsx`
- `src/app/(website)/investor-experience/page.jsx`
- `src/app/(website)/investor-experiences/page.jsx`
- `src/app/(website)/page.jsx`
- `src/app/(website)/privacy-policy/page.jsx`
- `src/app/(website)/progress-reviews/page.jsx`
- `src/app/(website)/start-here/page.jsx`
- `src/app/(website)/terms-of-use/page.jsx`
- `src/app/(website)/the-growvest-way/page.jsx`
- `src/app/(website)/wealth-guidance/page.jsx`
- `src/app/(website)/your-goals/page.jsx`
- `src/app/_views/FAQs.jsx`
- `src/app/admin/(protected)/faqs/page.jsx`
- `src/app/admin/(protected)/seo/page.jsx`
- `src/app/admin/(protected)/website/about/page.jsx`
- `src/app/admin/(protected)/website/home/page.jsx`
- `src/app/admin/(protected)/website/page.jsx`
- `src/app/admin/_components/AdminShell.jsx`
- `src/app/admin/_components/FaqManager.jsx`
- `src/app/admin/_components/InsightEditor.jsx`
- `src/app/api/admin/faqs/[id]/route.js`
- `src/app/api/admin/faqs/route.js`
- `src/app/api/admin/website/pages/[key]/route.js`
- `src/app/components/InsightArticle.jsx`
- `src/app/data/websiteContentSeed.js`
- `src/app/lib/seo.js`
- `src/app/lib/server/adminAuth.js`
- `src/app/lib/server/insightsRepository.js`
- `src/app/lib/server/websiteContentRepository.js`
