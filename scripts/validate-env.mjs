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
  "GROWVEST_NOTIFICATION_EMAIL",
];

const optionalVariables = [
  "BREVO_NEWSLETTER_LIST_ID",
  "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION",
  "NEXT_PUBLIC_BING_SITE_VERIFICATION",
  "NEXT_PUBLIC_MICROSOFT_TENANT_ID",
];

const missingPublic = requiredPublicVariables.filter((name) => !process.env[name]);
const missingServer = requiredServerVariables.filter((name) => !process.env[name]);
const optionalMissing = optionalVariables.filter((name) => !process.env[name]);

if (missingPublic.length || missingServer.length) {
  console.error("Missing required GrowVest production environment variables:");
  [...missingPublic, ...missingServer].forEach((name) => console.error(`- ${name}`));
  process.exitCode = 1;
} else {
  console.log("Required GrowVest public and server environment variables are present.");
}

if (optionalMissing.length) {
  console.log("Optional or feature-specific variables not currently configured:");
  optionalMissing.forEach((name) => console.log(`- ${name}`));
}
