# GrowVest Production Checklist

## Business verification

- [ ] Confirm exact legal entity capitalization and suffix.
- [ ] Add verified AMFI ARN/EUIN and validity details before any AMFI-registered claim.
- [ ] Confirm who holds the relevant certificate/registration.
- [ ] Approve revenue and compensation disclosure.
- [ ] Approve service scope and client communication commitments.

## Integrations

- [ ] Configure Brevo API key and verified sender.
- [ ] Configure GrowVest notification recipient.
- [ ] Configure Brevo newsletter list ID.
- [ ] Test acknowledgement and internal notification emails.
- [ ] Add CRM/Firestore storage if enquiry history is required.

## Content

- [ ] Compliance-review all mutual fund, risk, insurance, tax and estate-planning content.
- [ ] Approve insights and educational assumptions.
- [ ] Replace article previews with final content and article-detail routes.
- [ ] Add approved team profiles only after verification.
- [ ] Add real client stories only with consent and evidence.

## QA

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Test at 320, 375, 390, 768, 1024 and 1440 px.
- [ ] Test Chrome, Safari, Firefox and Edge.
- [ ] Complete keyboard and screen-reader testing.
- [ ] Test form errors, rate limiting and Brevo downtime.
- [ ] Run Lighthouse performance, accessibility and SEO checks.
- [ ] Set `NEXT_PUBLIC_ALLOW_INDEXING=true` after final approval.

## v11 Conversion & Storytelling QA

- [ ] Mobile sticky actions appear only after the opening section and hide at the footer.
- [ ] Investor Portal transition appears on normal clicks and preserves Ctrl/Cmd-click behaviour.
- [ ] Homepage Bucket List selections preload correctly in the full builder.
- [ ] A maximum of three homepage goals can be selected and active goals remain removable.
- [ ] Scroll-led journey activates the correct stage on desktop and remains readable on mobile.
- [ ] Primary CTA copy is “Begin Your Journey”; secondary exploration copy is “Explore Your Goals”.
- [ ] Contact appointment dates reflect the Asia/Kolkata calendar date and show IST context.
- [ ] `window.dataLayer` receives page, scroll, CTA, portal, builder, contact and newsletter events without PII.
- [ ] Firebase Analytics initializes only after accepted consent and uses the dedicated website App ID and measurement ID.
- [ ] Reduced-motion mode disables parallax, transition overlays and continuous movement appropriately.
