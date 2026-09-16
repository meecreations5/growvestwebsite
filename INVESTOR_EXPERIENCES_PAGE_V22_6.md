# GrowVest v22.6 — Dedicated Investor Experiences Page

## Public route

`/investor-experiences`

The public testimonial experience is now separated from the Insights library. Published, consent-approved testimonials appear on a dedicated editorial page with:

- A premium dark hero and featured investor experience
- Journey-type filters generated from live Firestore content
- Responsive editorial story cards
- Consent and performance-disclaimer treatment
- Mobile-first layouts with horizontally safe filters and full-width cards
- A final discovery-conversation CTA

## Website previews

Homepage, About GrowVest and Insights can continue to show a compact premium preview. Each preview links to the dedicated Investor Experiences page instead of reproducing the complete testimonial library.

## Admin workflow

Every published, consent-approved testimonial automatically appears on the dedicated page. The existing location controls now decide only whether the testimonial is additionally previewed on:

- Homepage
- Insights
- About GrowVest

The Admin testimonial listing includes a direct View public page action.

## Navigation and SEO

- Added Investor Experiences to the default Who We Help navigation group
- Added `/investor-experiences` to SEO metadata and sitemap generation
- Added breadcrumb structured data to the public page

## Data and compliance

No new Firestore collection or rules are required. The page uses the existing `investorTestimonials` collection and retains the existing consent requirement before publication.
