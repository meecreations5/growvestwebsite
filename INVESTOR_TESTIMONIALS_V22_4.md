# GrowVest v22.4 — Investor Testimonials

## Purpose

Add a consent-controlled Investor Experiences module to the GrowVest Website Admin and public website. The module is designed for genuine investor words only and does not seed or publish fictional testimonials.

## Admin routes

- `/admin/testimonials`
- `/admin/testimonials/new`
- `/admin/testimonials/[id]/edit`

## Public placements

A published testimonial can be shown independently on:

- Homepage
- Insights page
- About GrowVest page

The Insights placement appears between the Featured Insight and Explore the Library sections.

## Firestore collection

- `investorTestimonials`

## Publication controls

A testimonial cannot be published unless:

- the full testimonial is present
- written consent is confirmed
- at least one website location is selected
- image alternative text is present when a photograph is used

Archived testimonials are removed from all public placements automatically.

## Privacy and compliance approach

- Use an anonymised display name unless full-name publication is approved.
- Use initials instead of a photograph when requested.
- Store only an internal consent reference, not private messages or sensitive documents.
- Avoid portfolio returns, guaranteed outcomes, performance comparisons, or personalised recommendations.
- Show the public disclosure that individual experiences vary and do not promise financial outcomes.

## First-time use

1. Merge `FIRESTORE_RULES_INVESTOR_TESTIMONIALS_V22_4.md` into the existing Firestore rules.
2. Sign in as `super_admin` or `website_admin`.
3. Open `/admin/testimonials`.
4. Add a genuine approved testimonial.
5. Confirm written consent.
6. Choose the desired website location.
7. Publish and verify the public section.
