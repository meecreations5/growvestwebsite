# GrowVest v22 — GrowVest Guide & WhatsApp

## Purpose

GrowVest Guide is a controlled website assistant that searches only approved GrowVest content. It helps visitors find clear educational information, captures unanswered questions for Admin review, and provides a transparent click-to-chat WhatsApp handoff.

It does not generate personalised recommendations, promise returns, select products or claim that a WhatsApp message has been sent before the visitor taps **Send** in WhatsApp.

## Public experience

The Guide launcher appears across the public website and includes:

- GrowVest-branded chat panel
- approved quick questions
- natural-language matching across published content
- source links to relevant pages
- clear educational disclaimer
- personalised-advice boundary message
- unanswered-question capture
- optional name and mobile fields before WhatsApp handoff
- mobile and desktop layouts

Public APIs:

```text
POST /api/growvest-guide/chat
POST /api/growvest-guide/whatsapp
```

Both routes enforce same-origin validation, payload limits and public rate limits. Firebase Admin credentials stay server-side.

## Approved information sources

GrowVest Guide matches questions against:

```text
guideKnowledge
faqs
goalLibrary
insightsPosts
```

Only published and visible records are eligible. Six approved starter answers are included for GrowVest purpose, Bucket List approach, first conversation, regulatory status, fees and progress reviews.

The matching engine uses normalized phrases, keywords and weighted token overlap. It does not call an external generative-AI provider.

## Financial-information guardrails

Requests that ask for specific products, buy/sell decisions, guaranteed returns, personalised contribution amounts or trading signals receive the configured educational boundary message instead of a recommendation.

The public disclaimer states that Guide content is general and educational and is not personalised investment, securities, tax or legal advice.

## WhatsApp handoff

When a visitor chooses **Continue on WhatsApp**:

1. The server prepares a `wa.me` URL with the question and Guide reference.
2. A `websiteLeads` record is created with `enquiryType: whatsapp` and source `growvest_guide`.
3. A `communicationLogs` record is created with status `prepared`.
4. The related Guide conversation is marked `handed_off`.
5. WhatsApp opens in a new tab.
6. The visitor must review and send the message inside WhatsApp.

No sent, delivered or read status is claimed by the click-to-chat flow.

## Admin routes

```text
/admin/growvest-guide
/admin/growvest-guide/knowledge
/admin/growvest-guide/conversations
/admin/growvest-guide/settings
```

Admin capabilities include:

- Guide status dashboard
- approved-answer CRUD and archive
- push approved starter answers
- configurable welcome copy and quick prompts
- configurable WhatsApp number and button label
- configurable fallback, boundary and disclaimer copy
- recent conversation review
- unanswered-question queue
- conversation status changes
- WhatsApp handoff and lead references

## Firestore collections

```text
guideKnowledge
guideSettings
guideConversations
guideMessages
guideUnansweredQuestions
```

The module also writes compatible records to:

```text
websiteLeads
communicationLogs
websiteAuditLogs
formRateLimits
```

## Permissions

```text
guide.read
guide.manage
guide.conversations
```

`super_admin` and `website_admin` have all Guide permissions. `content_editor` can manage approved answers. `content_reviewer` can review conversations.

## Required deployment work

1. Merge `FIRESTORE_RULES_GROWVEST_GUIDE_V22.md` into the existing Firestore rules.
2. Deploy the updated `firestore.indexes.json`.
3. Sign in as Super Admin and open `/admin/growvest-guide/knowledge`.
4. Select **Push approved defaults**.
5. Review `/admin/growvest-guide/settings`, especially the WhatsApp number and public disclaimer.
6. Test the public Guide in an Incognito window.

## Acceptance test

1. Ask “What is GrowVest?” and verify an approved answer and source link appear.
2. Ask “Does GrowVest charge an advisory fee?” and verify the approved fee wording.
3. Ask for a specific best mutual fund and verify the personalised-advice boundary appears.
4. Ask an unrelated question and verify it enters `guideUnansweredQuestions`.
5. Open Admin → GrowVest Guide → Conversations and verify the exchange.
6. Choose Continue on WhatsApp and confirm a lead appears under Admin → Enquiries → WhatsApp.
7. Confirm the communication status is `prepared`, not `sent`.
8. Disable the Guide in settings and verify the public launcher disappears.
9. Re-enable the Guide and change a quick prompt; verify the updated prompt appears publicly.
10. Confirm signed-out browsers cannot directly read any Guide collection.
