# GrowVest v23.1 — Investor Experience Reference Design

This release redesigns the Investor Experiences presentation to follow the supplied reference while preserving GrowVest's brand system.

## Design direction

- Light editorial section instead of a dark oversized feature block
- Centered section label, title and supporting copy
- Simple three-column testimonial card grid on desktop
- Two-column tablet and single-column mobile layouts
- White cards, soft borders, restrained shadows and rounded corners
- Small quote icon, readable body copy and a simple identity footer
- Consent verification presented quietly instead of as a dominant badge
- Subtle GrowVest blue and gold background accents
- Equal-height cards in their default state
- Journey filters retained on the dedicated page
- Long quotes can be expanded without forcing every card to be oversized

## Public pages affected

- `/investor-experiences`
- `/insights`
- `/about`
- Homepage testimonial preview

## Data and Admin

No Firestore schema, rules, API or Admin workflow changes are required. Existing published and consent-approved records continue to power the redesigned components.
