# GrowVest Investor Experience Landing Page

Version: v27.0  
Date: 8 September 2026

## Public routes

- `/investor-experience`
- `/thank-you` (noindex)

## Purpose

The new public page supports the GrowVest Investor App launch and awareness campaign while keeping the Investor App positioned as an existing-investor experience, not a public registration or download product.

## Implemented sections

1. The GrowVest Investor Experience hero
2. Portfolio vs Purpose relationship map
3. Bucket List milestone section
4. GrowVest Life Architecture Model: Discover, Define, Design, Track, Celebrate
5. GrowVest Investor App experience preview and feature blocks
6. Why GrowVest: Clarity, Purpose, Connection
7. Trust and brand proof using existing approved website indicators
8. Campaign conversion form and WhatsApp action
9. Mobile sticky Start a Conversation CTA above the existing mobile navigation
10. Thank-you redirect with GrowVest Insights action

## Campaign lead handling

Submissions go to `/api/investor-experience` and are stored in the existing `websiteLeads` collection with:

- `enquiryType: investor_experience_campaign`
- selected clarity area
- source page
- UTM source, medium, campaign, term and content
- consent timestamp
- first-response due time
- email delivery status
- communication log
- enquiry directory sync

The existing enquiry workspace displays these leads as `Investor Experience Campaign`.

## Tracking readiness

The page includes tracking hooks for:

- `landing_page_view`
- `landing_page_50_scroll`
- `investor_app_section_viewed`
- `start_conversation_click`
- `whatsapp_click`
- `lead_form_started`
- `lead_form_submitted`
- `lead_form_error`

Tracking continues to respect the existing GrowVest analytics-consent system.

## SEO

`/investor-experience` is added to the public SEO registry and sitemap with the requested production metadata. The page includes WebPage and BreadcrumbList structured data.

`/thank-you` is explicitly noindex.

## Design continuity

The implementation reuses the existing public website layout, header, footer, mobile navigation, typography variables, brand constants, buttons, card language, section widths, motion classes and responsive conventions. No parallel visual design system has been introduced.

## Investor App visual

The website source did not contain final Investor App screenshot assets. The page therefore uses a code-rendered GrowVest Investor App interface preview built from the existing app experience language and brand system. Final approved app screenshots can replace this preview later without changing the page structure.
