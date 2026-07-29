const args = new Set(process.argv.slice(2));
const production = args.has("--production") || process.env.VERCEL_ENV === "production";

const requiredPublicVariables = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_INVESTOR_PORTAL_URL",
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
  "NEXT_PUBLIC_MICROSOFT_TENANT_ID",
  "NEXT_PUBLIC_APP_VERSION",
];

const requiredServerVariables = [
  "FIREBASE_ADMIN_PROJECT_ID",
  "FIREBASE_ADMIN_CLIENT_EMAIL",
  "FIREBASE_ADMIN_PRIVATE_KEY",
  "FIREBASE_ADMIN_STORAGE_BUCKET",
  "FORM_RATE_LIMIT_SALT",
  "CRON_SECRET",
  "BREVO_API_KEY",
  "BREVO_DEFAULT_SENDER_EMAIL",
  "BREVO_REPLY_TO_EMAIL",
  "GROWVEST_NOTIFICATION_EMAIL",
];

const optionalVariables = [
  "BREVO_NEWSLETTER_LIST_ID",
  "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
  "NEXT_PUBLIC_BING_SITE_VERIFICATION",
  "GROWVEST_OBSERVABILITY_WEBHOOK_URL",
  "GROWVEST_OBSERVABILITY_TOKEN",
];

const errors = [];
const warnings = [];

function value(name) {
  return String(process.env[name] || "").trim();
}

function missingOrPlaceholder(name) {
  const current = value(name);
  return !current || /replace|changeme|placeholder|your_/i.test(current);
}

function requireVariables(names) {
  names.forEach((name) => {
    if (missingOrPlaceholder(name)) errors.push(`${name} is missing or still contains a placeholder.`);
  });
}

function checkUrl(name, { httpsOnly = true, hostname = "" } = {}) {
  try {
    const url = new URL(value(name));
    if (httpsOnly && url.protocol !== "https:") errors.push(`${name} must use HTTPS.`);
    if (hostname && url.hostname !== hostname) errors.push(`${name} must use hostname ${hostname}.`);
  } catch {
    errors.push(`${name} must be a valid absolute URL.`);
  }
}

function checkSecret(name, minimumLength = 32) {
  const current = value(name);
  if (current.length < minimumLength) errors.push(`${name} must contain at least ${minimumLength} characters.`);
  if (/secret123|password|changeme|replace/i.test(current)) errors.push(`${name} contains an unsafe default value.`);
}

requireVariables(requiredPublicVariables);
requireVariables(requiredServerVariables);

checkUrl("NEXT_PUBLIC_SITE_URL", production ? { hostname: "growvest.info" } : {});
checkUrl("NEXT_PUBLIC_INVESTOR_PORTAL_URL");
checkSecret("FORM_RATE_LIMIT_SALT");
checkSecret("CRON_SECRET");

if (value("NEXT_PUBLIC_FIREBASE_PROJECT_ID") !== value("FIREBASE_ADMIN_PROJECT_ID")) {
  errors.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID and FIREBASE_ADMIN_PROJECT_ID must reference the same Firebase project.");
}

if (!value("FIREBASE_ADMIN_PRIVATE_KEY").includes("BEGIN PRIVATE KEY")) {
  errors.push("FIREBASE_ADMIN_PRIVATE_KEY does not contain a valid private-key header.");
}

if (production && process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") {
  errors.push("NEXT_PUBLIC_ALLOW_INDEXING must be true for the approved production release.");
}

if (!production && process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true") {
  warnings.push("Search indexing is enabled outside the production environment.");
}

if (!value("BREVO_NEWSLETTER_LIST_ID")) {
  warnings.push("BREVO_NEWSLETTER_LIST_ID is not configured; newsletter list synchronisation will remain unavailable.");
}

if (!value("GROWVEST_OBSERVABILITY_WEBHOOK_URL")) {
  warnings.push("GROWVEST_OBSERVABILITY_WEBHOOK_URL is not configured; structured errors will remain in platform logs only.");
}

optionalVariables.forEach((name) => {
  if (!value(name) && !warnings.some((warning) => warning.includes(name))) warnings.push(`${name} is optional and is not configured.`);
});

if (errors.length) {
  console.error("GrowVest environment validation failed:\n");
  errors.forEach((message) => console.error(`- ${message}`));
}

if (warnings.length) {
  console.warn("\nGrowVest environment warnings:\n");
  warnings.forEach((message) => console.warn(`- ${message}`));
}

if (!errors.length) {
  console.log(`GrowVest environment validation passed for ${production ? "production" : "development/preview"}.`);
}

process.exitCode = errors.length ? 1 : 0;
