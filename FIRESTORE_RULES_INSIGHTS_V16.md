# Firestore rules — GrowVest Insights & Blog

The Website Admin and public Insights pages use Firebase Admin through protected Next.js server routes. The browser does not require direct access to CMS, admin or audit collections.

Merge these blocks into the existing `match /databases/{database}/documents` section. Do not replace the Investor Portal rules.

```rules
match /websiteAdmins/{adminId} {
  allow read, write: if false;
}

match /insightsPosts/{postId} {
  allow read, write: if false;
}

match /insightCategories/{categoryId} {
  allow read, write: if false;
}

match /insightTags/{tagId} {
  allow read, write: if false;
}

match /insightAuthors/{authorId} {
  allow read, write: if false;
}

match /websiteRedirects/{redirectId} {
  allow read, write: if false;
}

match /websiteAuditLogs/{logId} {
  allow read, write: if false;
}
```

Firebase Admin bypasses Firestore Security Rules. Access is enforced by the Next.js server session, role and permission checks.
