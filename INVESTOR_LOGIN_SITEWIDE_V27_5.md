# Investor Login Sitewide V27.5

## Objective
Enable the existing GrowVest Investor Portal access across the public website now that the investor experience is ready for launch.

## Behaviour
- Desktop header: Investor Portal button shown beside the primary Begin Your Journey CTA.
- Tablet/mobile header: secure lock action shown.
- Mobile navigation sheet: Investor Portal quick action shown.
- Footer: Investor Portal link shown.
- Existing secure transition screen and analytics hooks remain unchanged.
- Destination remains `NEXT_PUBLIC_INVESTOR_PORTAL_URL` with the current fallback `https://insights.growvest.info/investor-login`.

## Feature flag
The portal is now visible by default. To temporarily hide it again, explicitly set:

`NEXT_PUBLIC_SHOW_INVESTOR_PORTAL=false`

The example production configuration now uses:

`NEXT_PUBLIC_SHOW_INVESTOR_PORTAL=true`

## Files changed
- `.env.example`
- `src/app/components/SiteHeader.jsx`
- `src/app/components/SiteFooter.jsx`
- `src/app/components/MobileSiteNavigation.jsx`
