# Firestore Rules — GrowVest Guide & WhatsApp v22

Merge these collection rules into the existing GrowVest Firestore rules. Do **not** replace the Report Tool, Investor Portal, Insights CMS, Website Content, Team, Social Media, or Enquiries rules.

GrowVest Guide reads approved content and writes conversations only through protected Next.js server routes using the Firebase Admin SDK. Browser clients must not directly read or write Guide data.

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
```

The existing server-only rules must remain in place for:

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

## Access control

Firebase Admin SDK operations bypass Firestore Security Rules. GrowVest v22 therefore enforces access through:

- Firebase Admin credentials stored only in the server environment
- HTTP-only Website Admin session cookie
- same-origin validation for every mutation route
- public Guide rate limits
- input length and payload limits
- role permissions in `websiteAdmins/{uid}`
- server-side audit records

## Role permissions

`super_admin` and `website_admin` receive:

```text
guide.read
guide.manage
guide.conversations
```

`content_editor` receives `guide.read` and `guide.manage` for approved-answer drafting. `content_reviewer` receives `guide.read` and `guide.conversations`. Individual permissions can also be added to `websiteAdmins/{uid}.permissions`.

## Acceptance tests

1. A signed-out browser cannot directly read Guide collections.
2. An Investor Portal user cannot access `/admin/growvest-guide` or its APIs.
3. The public Guide can answer through `/api/growvest-guide/chat` without exposing Firebase Admin credentials.
4. Repeated public requests are rate limited.
5. An unanswered question creates a server-only `guideUnansweredQuestions` record.
6. WhatsApp handoff creates a `websiteLeads` record and a `communicationLogs` record with status `prepared`.
7. Opening WhatsApp does not claim that a message was sent, delivered or read.
