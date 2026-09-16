# Investor Experience V27.4 - App Showcase Overlap Fix

## Observation resolved
The "One connected journey" supporting copy was absolutely positioned inside the phone mockup stage and could sit behind the primary/secondary screenshots, making the copy partially hidden.

## Change
- Removed the supporting copy card from the absolute phone layer.
- Kept the phone composition inside its own controlled-height stage.
- Moved "One connected journey" into normal document flow directly below the phone showcase.
- Added a clear z-index and a centered max-width so the copy remains readable at desktop, tablet, and mobile sizes.
- No changes to app screenshot clarity, crop, status-bar removal, feature switching, or section content.

## Result
The Investor App screens remain visually dominant while all explanatory copy stays fully visible and cannot be covered by the phone mockups.
