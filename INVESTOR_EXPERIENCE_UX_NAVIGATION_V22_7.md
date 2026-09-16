# GrowVest v22.7 — Investor Experience UX & Navigation Editor

## Public Investor Experiences page

The dedicated `/investor-experiences` page has been redesigned to remove the narrow, over-tall testimonial layout and excessive empty space.

### Improvements

- Balanced, contained hero layout with a premium dark editorial card.
- Long testimonials use a controlled excerpt by default.
- Visitors can expand a testimonial to read the complete approved wording.
- The featured testimonial is no longer repeated in the story grid.
- Consistent story-card widths and typography across desktop, tablet and mobile.
- Added an editorial GrowVest experience-principles section so the page remains complete when only one testimonial is published.
- Improved consent, compliance and CTA presentation.
- Better responsive behaviour at 320px through wide desktop screens.

## Website testimonial preview

The testimonial preview used on Homepage, Insights and About has been redesigned with:

- A lighter premium surface rather than an oversized black block.
- Better balance between the section introduction and investor quote.
- Controlled quote length so one long testimonial cannot distort the layout.
- Clear investor identity, journey and consent treatment.
- A direct link to the dedicated Investor Experiences page.

## Admin navigation management

The `/admin/website/navigation` editor now provides a visual nested-link editor.

### Admin improvements

- Edit menu labels and paths in separate fields.
- Add, remove and reorder header groups.
- Add, remove and reorder dropdown links.
- Edit footer columns and legal links visually.
- Unsaved-changes indicator.
- Website preview link.
- Quick action to add `/investor-experiences` to both header and footer.
- Direct **Edit website navigation** action from `/admin/testimonials`.
- Backward compatibility for older navigation records that used `href` instead of `path`.

## Database behaviour

Navigation continues to save directly to:

`websiteNavigation/primary`

No new Firestore collection or security rule is required.
