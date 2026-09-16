# GrowVest v22.1 - Guide Launcher Alignment and Footer Visibility

## Correction

The public GrowVest Guide launcher has been corrected so that it stays aligned with the viewport, remains clear above the mobile action bar, and stays visible when the dark website footer enters the viewport.

## Behaviour

- Uses a dedicated launcher layout instead of the shared rounded-button animation selector.
- Maintains a consistent 50 px minimum height and aligned icon/label spacing.
- Uses safe-area-aware right and bottom spacing.
- Stays above the mobile sticky action bar.
- Detects the public website footer with IntersectionObserver.
- Changes to a white high-contrast footer style over the dark footer.
- Moves down when the mobile action bar hides at the footer.
- Keeps the open Guide panel above the mobile action bar.
- Collapses to an icon-only launcher on extremely narrow screens.

## Updated files

- `src/app/components/GrowVestGuide.jsx`
- `src/app/components/SiteFooter.jsx`
- `src/app/globals.css`
