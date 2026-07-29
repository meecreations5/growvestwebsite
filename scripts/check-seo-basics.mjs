import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seoFile = path.join(root, "src/app/lib/seo.js");
const source = fs.readFileSync(seoFile, "utf8");
const moduleUrl = new URL(`file://${seoFile}?audit=${Date.now()}`);
const { SEO_PAGES } = await import(moduleUrl.href);
const errors = [];
const warnings = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

function pageFile(route) {
  return route === "/"
    ? path.join(root, "src/app/(website)/page.jsx")
    : path.join(root, `src/app/(website)${route}/page.jsx`);
}

for (const [route, page] of Object.entries(SEO_PAGES)) {
  const file = pageFile(route);
  if (!fs.existsSync(file)) errors.push(`${route}: page file is missing.`);
  if (!page.title?.trim()) errors.push(`${route}: SEO title is missing.`);
  if (!page.description?.trim()) errors.push(`${route}: meta description is missing.`);

  const fullTitle = route === "/" ? `GrowVest | ${page.title}` : `${page.title} | GrowVest`;
  if (fullTitle.length < 30) warnings.push(`${route}: title is short (${fullTitle.length} characters).`);
  if (fullTitle.length > 65) warnings.push(`${route}: title is long (${fullTitle.length} characters).`);
  if (page.description.length < 110) warnings.push(`${route}: description is short (${page.description.length} characters).`);
  if (page.description.length > 175) warnings.push(`${route}: description is long (${page.description.length} characters).`);

  const titleKey = fullTitle.toLowerCase();
  if (seenTitles.has(titleKey)) errors.push(`${route}: duplicate title also used by ${seenTitles.get(titleKey)}.`);
  else seenTitles.set(titleKey, route);

  const descriptionKey = page.description.toLowerCase();
  if (seenDescriptions.has(descriptionKey)) errors.push(`${route}: duplicate description also used by ${seenDescriptions.get(descriptionKey)}.`);
  else seenDescriptions.set(descriptionKey, route);
}

const requiredFiles = [
  "src/app/robots.js",
  "src/app/sitemap.js",
  "src/app/opengraph-image.png",
  "src/app/twitter-image.png",
  "src/app/(website)/insights/feed.xml/route.js",
  "src/app/components/StructuredData.jsx",
];
for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`${relative}: required SEO asset is missing.`);
}

if (!source.includes("alternates")) errors.push("createPageMetadata must define a canonical alternate.");
if (!source.includes("max-image-preview")) errors.push("Googlebot preview controls are missing.");
if (/keywords\s*:/i.test(source)) warnings.push("Meta keywords found. Search engines generally ignore this field; verify it is intentional.");

console.log(`SEO audit: ${Object.keys(SEO_PAGES).length} public routes checked.`);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}
console.log(`SEO audit passed with ${warnings.length} advisory warning(s).`);
