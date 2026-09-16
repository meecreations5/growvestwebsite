# Firestore Rules — GrowVest Guide Intelligence v24

Merge this rule with the existing GrowVest Firestore rules. Do **not** replace rules for the Investor Portal, Report Tool, Insights CMS, Website Content, Team, Testimonials or Enquiries.

The Guide continues to read and write only through protected Next.js server routes using Firebase Admin SDK. Browser clients must not directly access Guide data.

```rules
match /guideKnowledge/{document=**} {
  allow read, write: if false;
}

match /guideSettings/{document=**} {
  allow read, write: if false;
}

match /guideConversations/{document=**} {
  allow read, write: if false;
}

match /guideMessages/{document=**} {
  allow read, write: if false;
}

match /guideUnansweredQuestions/{document=**} {
  allow read, write: if false;
}

match /guideFeedback/{document=**} {
  allow read, write: if false;
}
```

Existing server-only protection must remain for:

```rules
match /websiteLeads/{document=**} {
  allow read, write: if false;
}

match /communicationLogs/{document=**} {
  allow read, write: if false;
}

match /formRateLimits/{document=**} {
  allow read, write: if false;
}

match /websiteAuditLogs/{document=**} {
  allow read, write: if false;
}
```

## New v24 records

`guideConversations` may now include:

- `intentId`
- `intentLabel`
- `journeyStage`
- `timeline`
- `planningStatus`
- `conversationSummary`
- `lastNextAction`
- `lastFeedback`

`guideMessages` may now include:

- `intentId`
- `intentLabel`
- `journeyStage`
- `timeline`
- `planningStatus`
- `conversationSummary`
- `quickReplies`
- `nextAction`

`guideFeedback` stores one feedback record per Guide response and conversation.

## Acceptance tests

1. A signed-out browser cannot directly read or write any Guide collection.
2. The public Guide can continue a goal journey using the same session ID.
3. A short answer such as “after 10 years” is interpreted in the active goal context.
4. WhatsApp handoff is blocked until visitor consent is confirmed.
5. The prepared WhatsApp message includes only the relevant goal context and Guide reference.
6. Helpful or not-helpful feedback creates a server-only `guideFeedback` record.
7. The Guide never provides specific fund, stock, buy/sell or guaranteed-return recommendations.
