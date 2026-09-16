# GrowVest Logo Motion Update v10

## Final logo behaviour

- The full GrowVest wordmark remains visually stable.
- Only the central GrowVest symbol transitions continuously through the approved brand colours.
- The colour sequence remains Primary Blue, Insight Gold, White, a brief Strategic Red accent, and back to Primary Blue.
- The compact scrolled-header icon continues the same symbol-only animation.
- The footer follows the same rule: static wordmark, animated symbol.
- The upward-arrow progress motion remains subtle and continuous.
- Reduced-motion users receive a static Primary Blue symbol.

## Technical implementation

- Added `GrowVestLogo.jsx` to compose a stable wordmark with the existing animated inline icon.
- Added separate wordmark-only SVG assets for dark and light contexts.
- Removed the full-logo colour mask animation so the wordmark text no longer changes colour.
