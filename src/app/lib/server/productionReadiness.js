import { getAdminAuth, getAdminDb, getAdminStorage, isFirebaseAdminConfigured } from "./firebaseAdmin";

const RELEASE = process.env.NEXT_PUBLIC_APP_VERSION || "25.0.0";
const COMMIT_SHA = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT_SHA || "local";

function isPresent(name) {
  const value = String(process.env[name] || "").trim();
  return Boolean(value && !/replace|changeme|example|your_|placeholder/i.test(value));
}

function secretIsStrong(name, minimumLength = 32) {
  const value = String(process.env[name] || "").trim();
  return value.length >= minimumLength && !/replace|changeme|example|secret123|password/i.test(value);
}

function validHttpsUrl(name, expectedHostname = "") {
  try {
    const url = new URL(String(process.env[name] || ""));
    return url.protocol === "https:" && (!expectedHostname || url.hostname === expectedHostname);
  } catch {
    return false;
  }
}

function check(id, label, status, detail, category, action = "") {
  return { id, label, status, detail, category, action };
}

function withTimeout(promise, timeoutMs, label) {
  let timeout;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms.`)), timeoutMs);
    }),
  ]).finally(() => clearTimeout(timeout));
}

export function getStaticProductionChecks() {
  const checks = [];
  const production = process.env.NODE_ENV === "production";
  const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  const publicProject = String(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim();
  const adminProject = String(process.env.FIREBASE_ADMIN_PROJECT_ID || "").trim();

  checks.push(
    check(
      "site-url",
      "Canonical production URL",
      validHttpsUrl("NEXT_PUBLIC_SITE_URL", "growvest.info") ? "pass" : "fail",
      siteUrl || "NEXT_PUBLIC_SITE_URL is not configured.",
      "Environment",
      "Set NEXT_PUBLIC_SITE_URL=https://growvest.info.",
    ),
    check(
      "indexing",
      "Search indexing approval",
      process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true" ? "pass" : production ? "fail" : "warn",
      process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"
        ? "Production indexing is enabled."
        : "Indexing remains disabled. This is correct for local and preview deployments only.",
      "SEO & Discovery",
      "Set NEXT_PUBLIC_ALLOW_INDEXING=true only in the approved production environment.",
    ),
    check(
      "firebase-browser",
      "Firebase browser configuration",
      [
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        "NEXT_PUBLIC_FIREBASE_APP_ID",
      ].every(isPresent) ? "pass" : "fail",
      "Public Firebase web-app identifiers are required for Admin login and consent-based analytics.",
      "Firebase",
    ),
    check(
      "firebase-admin",
      "Firebase Admin credentials",
      isFirebaseAdminConfigured() ? "pass" : "fail",
      isFirebaseAdminConfigured()
        ? "Server-side Firebase Admin credentials are configured."
        : "Firebase Admin credentials are incomplete.",
      "Firebase",
      "Configure FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.",
    ),
    check(
      "firebase-project-match",
      "Firebase project consistency",
      publicProject && adminProject && publicProject === adminProject ? "pass" : "fail",
      publicProject && adminProject
        ? `Browser project: ${publicProject}; Admin project: ${adminProject}.`
        : "Both browser and Admin project IDs must be configured.",
      "Firebase",
      "Use the same Firebase project ID for browser and Admin SDK configuration.",
    ),
    check(
      "storage-bucket",
      "Firebase Storage bucket",
      isPresent("FIREBASE_ADMIN_STORAGE_BUCKET") ? "pass" : "fail",
      process.env.FIREBASE_ADMIN_STORAGE_BUCKET || "FIREBASE_ADMIN_STORAGE_BUCKET is missing.",
      "Firebase",
    ),
    check(
      "rate-limit-salt",
      "Form rate-limit salt",
      secretIsStrong("FORM_RATE_LIMIT_SALT") ? "pass" : "fail",
      secretIsStrong("FORM_RATE_LIMIT_SALT")
        ? "A strong request-identifier salt is configured."
        : "FORM_RATE_LIMIT_SALT must be a unique random value of at least 32 characters.",
      "Security",
    ),
    check(
      "cron-secret",
      "Scheduled-job authentication",
      secretIsStrong("CRON_SECRET") ? "pass" : "fail",
      secretIsStrong("CRON_SECRET")
        ? "Cron endpoints have a strong authentication secret."
        : "CRON_SECRET must be a unique random value of at least 32 characters.",
      "Operations",
    ),
    check(
      "brevo",
      "Transactional email",
      isPresent("BREVO_API_KEY") && isPresent("BREVO_DEFAULT_SENDER_EMAIL") && isPresent("GROWVEST_NOTIFICATION_EMAIL")
        ? "pass"
        : "fail",
      "Brevo is required for enquiry, review and operational notifications.",
      "Communications",
    ),
    check(
      "brevo-webhook",
      "Brevo delivery webhook security",
      secretIsStrong("BREVO_WEBHOOK_TOKEN") ? "pass" : "fail",
      secretIsStrong("BREVO_WEBHOOK_TOKEN")
        ? "Transactional delivery events can be authenticated before communication logs are updated."
        : "BREVO_WEBHOOK_TOKEN must be a unique random value of at least 32 characters.",
      "Communications",
      "Configure the same Bearer token in Brevo and the GrowVest production environment.",
    ),
    check(
      "conversion-notification",
      "Conversion review notifications",
      isPresent("GROWVEST_CONVERSION_NOTIFICATION_EMAIL") ? "pass" : "warn",
      isPresent("GROWVEST_CONVERSION_NOTIFICATION_EMAIL")
        ? "Investor-conversion requests have a dedicated review recipient."
        : "Conversion notifications will fall back to GROWVEST_NOTIFICATION_EMAIL.",
      "Communications",
    ),
    check(
      "newsletter-list",
      "Newsletter list mapping",
      isPresent("BREVO_NEWSLETTER_LIST_ID") ? "pass" : "warn",
      isPresent("BREVO_NEWSLETTER_LIST_ID")
        ? "Newsletter subscriptions are mapped to a Brevo list."
        : "Newsletter form records can be stored, but Brevo list synchronisation is not configured.",
      "Communications",
    ),
    check(
      "microsoft-tenant",
      "Microsoft Admin sign-in",
      isPresent("NEXT_PUBLIC_MICROSOFT_TENANT_ID") ? "pass" : "fail",
      "A tenant-specific Microsoft provider limits Admin sign-in to the approved directory.",
      "Authentication",
    ),
    check(
      "observability",
      "External error-monitoring webhook",
      isPresent("GROWVEST_OBSERVABILITY_WEBHOOK_URL") ? "pass" : "warn",
      isPresent("GROWVEST_OBSERVABILITY_WEBHOOK_URL")
        ? "Server errors can be forwarded to the configured observability endpoint."
        : "Structured errors will remain available in Vercel logs; an external alert destination is optional but recommended.",
      "Monitoring",
    ),
  );

  return checks;
}

async function firebaseRuntimeChecks() {
  if (!isFirebaseAdminConfigured()) {
    return [
      check("firestore-runtime", "Firestore runtime access", "fail", "Firebase Admin is not configured.", "Runtime"),
      check("auth-runtime", "Firebase Auth runtime access", "fail", "Firebase Admin is not configured.", "Runtime"),
      check("storage-runtime", "Firebase Storage runtime access", "fail", "Firebase Admin is not configured.", "Runtime"),
    ];
  }

  const tests = await Promise.allSettled([
    withTimeout(getAdminDb().collection("websiteSettings").limit(1).get(), 4500, "Firestore"),
    withTimeout(getAdminAuth().listUsers(1), 4500, "Firebase Auth"),
    withTimeout(getAdminStorage().bucket().getMetadata(), 4500, "Firebase Storage"),
  ]);

  return [
    check(
      "firestore-runtime",
      "Firestore runtime access",
      tests[0].status === "fulfilled" ? "pass" : "fail",
      tests[0].status === "fulfilled" ? "Firestore responded successfully." : tests[0].reason?.message || "Firestore check failed.",
      "Runtime",
    ),
    check(
      "auth-runtime",
      "Firebase Auth runtime access",
      tests[1].status === "fulfilled" ? "pass" : "fail",
      tests[1].status === "fulfilled" ? "Firebase Authentication responded successfully." : tests[1].reason?.message || "Authentication check failed.",
      "Runtime",
    ),
    check(
      "storage-runtime",
      "Firebase Storage runtime access",
      tests[2].status === "fulfilled" ? "pass" : "fail",
      tests[2].status === "fulfilled" ? "The configured Storage bucket responded successfully." : tests[2].reason?.message || "Storage check failed.",
      "Runtime",
    ),
  ];
}

function summarize(checks) {
  const totals = checks.reduce(
    (result, item) => ({ ...result, [item.status]: (result[item.status] || 0) + 1 }),
    { pass: 0, warn: 0, fail: 0 },
  );
  return {
    totals,
    status: totals.fail > 0 ? "blocked" : totals.warn > 0 ? "degraded" : "ready",
  };
}

export async function getProductionReadiness({ includeRuntime = true } = {}) {
  const staticChecks = getStaticProductionChecks();
  const runtimeChecks = includeRuntime ? await firebaseRuntimeChecks() : [];
  const checks = [...staticChecks, ...runtimeChecks];
  const summary = summarize(checks);

  return {
    service: "growvest-public-website",
    release: RELEASE,
    commit: COMMIT_SHA,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    checkedAt: new Date().toISOString(),
    ...summary,
    checks,
  };
}
