# GrowVest: FAQ sections across all public pages

**Updated:** 13 November 2026
**Baseline:** `GrowVest_FAQ_SEO_Admin_Update.zip` (prior reviewed package; not the September baseline).

## What changed

- Every principal GrowVest page now has a populated FAQ area using previously published, existing GrowVest FAQ answers. New financial claims have not been generated.
- The FAQ block renders after the designed page content, before the common site footer, with responsive, accessible native `<details>` accordions. Sections use server-rendered question/answer text, and do not require client-side JavaScript.
- Any missing `websitePages.content.pageFaqs` is filled **at read time** from a page-specific starter mapping, so older Firebase documents and uninitialized environments work without a forced reset or overwriting stored content.
- Save per-page Q&A content directly in **Admin → All Website Pages → select page → FAQs for this page**. Each page supports up to 10 Q&A entries, draft/published status, hide/show, reorder, delete, heading, introduction and disable toggle.
- Shared questions may still be created in **Admin → FAQs** and assigned to one or multiple pages. A shared question does not duplicate an identical page-specific question. Page-specific questions display before shared questions.
- The **SEO Manager** role retains the prior package's `website.page.manage` and `website.faq.manage` permissions. The prior role management UI remains intact.
- The **SEO Centre** counts actual published visible FAQs from both sources, not just shared assignments.
- The **/faqs** page continues to display the full shared FAQ directory; it does not show a redundant extra accordion.
- Published Insight articles display their own FAQ blocks (managed in the Insight editor) plus inherited Insights-page FAQs. Category and author archive pages inherit Insights-page FAQs as well. Tag URLs redirect to Insights, so they do not have an independently rendered page.
- **/thank-you** has its own editable FAQ settings and remains explicitly `noindex` and excluded from the existing static sitemap.

## Public-page coverage

| Page | Starter FAQs |
| --- | ---: |
| `/` | 4 |
| `/about` | 4 |
| `/bucket-list-builder` | 3 |
| `/client-stories` | 3 |
| `/contact` | 3 |
| `/disclosures` | 5 |
| `/family-wealth` | 4 |
| `/faqs` | Full directory |
| `/for-nris` | 3 |
| `/goal-library` | 3 |
| `/how-we-charge` | 3 |
| `/insights` | 3 |
| `/investor-experience` | 3 |
| `/investor-experiences` | 3 |
| `/privacy-policy` | 3 |
| `/progress-reviews` | 3 |
| `/start-here` | 3 |
| `/terms-of-use` | 3 |
| `/the-growvest-way` | 3 |
| `/wealth-guidance` | 3 |
| `/your-goals` | 3 |
| `/thank-you` (noindex) | 2 |
| `/insights/[slug]` | 3 inherited + optional article blocks |
| `/insights/category/[slug]` | 3 inherited |
| `/insights/author/[slug]` | 3 inherited |
| `/insights/tag/[slug]` | Redirect to Insights |

## How the SEO team publishes page FAQs

1. Sign in with an account assigned the **SEO Manager** role by a Super Admin.
2. Open **Admin → All Website Pages**, then choose a page. The directory shows how many page-specific FAQs are currently published.
3. Open **FAQs for this page**. Edit starter Q&A or add an entry; use Draft when waiting for compliance/editorial approval. Move questions up/down to control order, or hide/remove them.
4. Confirm **Display this page's FAQs** is checked. Set an optional heading and introduction; click **Save page settings**.
5. Open the public URL (including mobile) to confirm the section, links, wording and layout. If the content is reused across many pages, edit it in **Admin → FAQs** and assign its target pages instead.
6. For articles, add article-specific FAQ blocks in the Insights editor. Global Insights-page FAQs can also be managed via `/admin/website/pages/insights`.

**Data precautions:** This update does not bulk-write to Firestore. When a site page is opened and no page-specific FAQ field exists, existing approved starter FAQ copy is shown. After the SEO team saves the page, `pageFaqs` is persisted and becomes the source of truth. An intentionally empty array remains empty: it is not repopulated. Disabling the FAQ section also hides both page and shared questions for that page.

**Content review:** Starter copy is recycled from GrowVest's previously existing public FAQ directory. Replace repeated, general questions with genuinely page-relevant content when the SEO team's final copy is ready, and check regulatory, fee and investment-related statements before publication.

## Local validation

- `npm run check:source`: PASS (route collisions, imports, syntax, secrets, assets, accessibility, security, SEO, performance, mobile, CMS, all-page FAQ coverage).
- Independent TypeScript parser: 272 source files, **0 parse errors**.
- `npm run check:faqs`: PASS (21 fixed SEO pages, /thank-you, article and archive paths, admin FAQ editing, fallback wiring).
- **Not performed:** `npm ci`, `npm run lint`, `npm run build`, Firebase-connected session tests, and production deployment. This container has no project dependencies installed and no production Firebase credentials. Run these commands in staging before promotion, and check revalidation/role authorization through actual sign-in.

## Deployment

Preserve your current `.env`/Vercel secrets; do not overwrite them with `.env.example`. Back up Firestore collections `websitePages`, `faqs`, and `websiteAdmins` and take a source rollback snapshot before deployment. Install dependencies using `npm ci`, then run `npm run check:source`, `npm run lint`, `npm run build` and any project staging smoke tests. Verify the SEO team can edit and save a FAQ, that a Draft question stays hidden, and that published changes appear on the intended page only. Test the SEO role's denied access to restricted admin areas.

**Out of scope:** Fully editing every existing page hero, card, layout and CTA is a separate page-template CMS migration. This release completes the shared FAQ sections and per-page FAQ editing while preserving the current page designs and previous SEO/admin work.
