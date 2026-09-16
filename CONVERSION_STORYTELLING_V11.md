> Superseded for analytics setup by `FIREBASE_ANALYTICS_V15.md`. The v11 GA variable notes are retained only as release history.

# GrowVest Conversion & Storytelling Upgrade — v11

This release strengthens the website’s conversion journey without making the experience feel aggressive or overly animated.

## What changed

### 1. Mobile conversion bar
- Appears after the visitor moves beyond the opening content.
- Offers **Investor Portal** and **Begin Your Journey** actions.
- Hides on the Contact page and as the footer enters view.
- Supports mobile safe-area spacing and keyboard focus.

### 2. Interactive Bucket List preview
- Visitors can select up to three aspirations on the homepage.
- Selected goals continue into the full Bucket List Builder through the URL.
- The builder automatically preloads matching goal cards.
- The preview is clearly labelled as educational rather than personalised advice.

### 3. Scroll-led GrowVest journey
- Replaces the old click-only process accordion on the homepage.
- Five stages become active as the visitor scrolls.
- A GrowVest icon travels along the progress line on desktop.
- All content remains visible and readable without interaction.

### 4. Branded Investor Portal handoff
- Normal Investor Portal clicks show a brief GrowVest transition before opening the secure subdomain.
- Modified clicks such as Ctrl/Cmd-click retain normal browser behaviour.
- Reduced-motion users are redirected immediately.

### 5. Consistent CTA language
- Primary conversion: **Begin Your Journey**
- Secondary exploration: **Explore Your Goals**
- Secure client access: **Investor Portal**
- Contact-page context: **Request a Discovery Conversation**

### 6. Analytics foundation
- Optional Google Analytics support through `NEXT_PUBLIC_GA_ID`.
- Works without Google Analytics by continuing to push events to `window.dataLayer`.
- Tracks page views, scroll depth, primary/secondary CTA clicks, portal clicks, Bucket List interactions, contact submissions and newsletter outcomes.
- No names, emails or telephone numbers are sent through the event helper.

### 7. Performance and accessibility
- The homepage is now a Server Component.
- Only the rotating hero message, Bucket List preview and scroll journey hydrate as Client Components.
- Appointment slots are generated after hydration using the Asia/Kolkata calendar date.
- Native buttons, `aria-pressed`, reduced-motion handling and visible focus states are retained.
- A thin brand-colour reading-progress line is available across pages.

## Optional analytics setup

Add to `.env.local`:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

If the variable is empty, the website does not load the Google Analytics script.

## QA priorities

1. Test the mobile action bar on iPhone Safari and Android Chrome.
2. Test Investor Portal handoff with normal click, Ctrl/Cmd-click and reduced-motion enabled.
3. Select goals on the homepage and confirm they preload in `/bucket-list-builder`.
4. Test the scroll journey at 390px, 768px, 1024px and 1440px widths.
5. Verify events in `window.dataLayer` and, when configured, GA DebugView.
6. Confirm the sticky bar never covers the footer or the Contact form.
