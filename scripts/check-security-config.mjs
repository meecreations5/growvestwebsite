import { readFile } from "node:fs/promises";

const config = await readFile("next.config.mjs", "utf8");
const required = [
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Strict-Transport-Security",
  "Cross-Origin-Opener-Policy",
  "X-Robots-Tag",
];

const missing = required.filter((header) => !config.includes(header));
if (!config.includes('value: "same-origin-allow-popups"')) {
  missing.push("OAuth-compatible Cross-Origin-Opener-Policy value");
}
if (!config.includes('source: "/admin/:path*"')) missing.push("Admin no-store policy");
if (!config.includes('source: "/api/:path*"')) missing.push("API no-store policy");

if (missing.length) {
  console.error("Security configuration check failed:\n");
  missing.forEach((item) => console.error(`- Missing ${item}`));
  process.exitCode = 1;
} else {
  console.log("Security configuration check passed.");
}
