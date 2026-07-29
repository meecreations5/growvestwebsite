# GrowVest v24 — Guide Intelligence & Conversion Upgrade

## Purpose

v24 makes GrowVest Guide more conversational and conversion-ready while preserving strict educational and privacy boundaries. It remains a deterministic approved-content system and does not use an external generative-AI provider.

## Visitor experience

### Session memory

The Guide remembers the current conversation for the configured retention window. It preserves:

- detected goal or intent
- journey stage
- goal timeline
- whether planning has started
- concise conversation summary
- recent messages in local browser storage

A visitor can minimise and reopen the Guide without losing the current conversation. **Start again** creates a new session.

### Intent-based journeys

Supported intents include:

- Child education
- Retirement planning
- Dream home
- Travel or bucket-list goal
- Family protection
- NRI wealth journey
- Portfolio review
- Existing investor support
- Start a GrowVest conversation
- General financial clarity

The Guide asks one progressive question at a time:

1. Which goal matters?
2. When should it be achieved?
3. Has planning already started?
4. What is the sensible next step?

The journey produces a concise context summary without recommending a product.

### Confidence handling

- High confidence: answer directly from approved content.
- Medium confidence: provide related information with source links.
- Low confidence: avoid guessing and ask the visitor to clarify the intent.
- Personalised recommendation request: show the approved educational boundary.

### Existing investor support

The Guide does not expose investor data. It offers safe actions:

- Open Investor Portal
- Monthly-report support
- Document-related help
- Contact the assigned GrowVest team member

### Contextual WhatsApp handoff

The visitor must consent before handoff. The prepared message may include:

- goal or intent
- timeline
- current planning position
- latest question
- conversation summary
- Guide reference

A Website Lead and Communication Log are created with status `prepared`. The system does not claim that the WhatsApp message was sent, delivered or read.

### Answer feedback

Visitors can mark approved answers as helpful or not helpful. Feedback is stored in `guideFeedback` and shown in Guide Admin summary metrics.

## Admin improvements

`/admin/growvest-guide/settings` now controls:

- guided journeys
- session memory
- session retention hours
- answer feedback
- source visibility
- low-confidence threshold
- WhatsApp handoff

`/admin/growvest-guide` now shows:

- answered rate
- WhatsApp handoffs
- helpful responses
- most common detected intent
- conversations requiring follow-up

Conversation review includes intent, journey summary and feedback status.

## Public API changes

- `POST /api/growvest-guide/chat`
  - accepts `conversationContext`
  - returns `conversationContext`, `intent`, `quickReplies`, `nextAction`, `confidenceLevel`, `messageId`
- `POST /api/growvest-guide/whatsapp`
  - requires `consentAccepted: true`
  - carries forward approved conversation context
- `POST /api/growvest-guide/feedback`
  - records `helpful` or `not_helpful`

## Guardrails

The Guide must not provide:

- specific fund or stock recommendations
- buy, sell, switch, exit or redemption instructions
- personalised portfolio decisions
- guaranteed returns or target-return promises
- tax or legal conclusions
- investor-specific data without authentication

## Acceptance flow

1. Open the Guide in an Incognito window.
2. Select **I want to plan a specific goal**.
3. Choose **Child education**.
4. Reply **After 10 years**.
5. Select **Yes, already started**.
6. Confirm the summary contains goal, timeline and current position.
7. Minimise and reopen the Guide; the conversation should remain.
8. Mark the answer helpful.
9. Select **Continue on WhatsApp**.
10. Confirm the consent checkbox is mandatory.
11. Open WhatsApp and verify the prepared context.
12. In Firestore, verify `guideConversations`, `guideMessages`, `guideFeedback`, `websiteLeads` and `communicationLogs`.
13. Open `/admin/growvest-guide` and confirm updated metrics.
14. Select **Start again** and confirm a fresh session begins.
