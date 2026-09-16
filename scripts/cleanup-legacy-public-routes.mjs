import { access, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const appDir = path.resolve(process.cwd(), "src/app");
const websiteGroupDir = path.join(appDir, "(website)");
const shouldApply = process.argv.includes("--apply");

const legacyRouteDirectories = [
  "about",
  "bucket-list-builder",
  "client-stories",
  "contact",
  "disclosures",
  "family-wealth",
  "faqs",
  "for-nris",
  "goal-library",
  "how-we-charge",
  "insights",
  "privacy-policy",
  "progress-reviews",
  "start-here",
  "terms-of-use",
  "the-growvest-way",
  "wealth-guidance",
  "your-goals",
];

const legacyRootPageFiles = ["page.js", "page.jsx", "page.ts", "page.tsx"];

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(websiteGroupDir))) {
  console.error("No src/app/(website) route group was found. Cleanup was not performed.");
  process.exit(1);
}

const candidates = [];

for (const directory of legacyRouteDirectories) {
  const target = path.join(appDir, directory);
  if (await exists(target)) candidates.push(target);
}

for (const file of legacyRootPageFiles) {
  const target = path.join(appDir, file);
  if (await exists(target)) candidates.push(target);
}

if (candidates.length === 0) {
  console.log("No legacy public route duplicates were found.");
  process.exit(0);
}

console.log("Legacy public routes that conflict with src/app/(website):");
for (const candidate of candidates) {
  console.log(`  - ${path.relative(process.cwd(), candidate)}`);
}

if (!shouldApply) {
  console.log("\nDry run only. Re-run with --apply to remove these legacy copies.");
  process.exit(0);
}

for (const candidate of candidates) {
  await rm(candidate, { recursive: true, force: true });
}

console.log("\nLegacy duplicate routes removed successfully.");
console.log("Next: remove .next and run npm run build.");
