import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requireText(relativePath, pattern, message) {
  const source = read(relativePath);
  if (!pattern.test(source)) failures.push(`${relativePath}: ${message}`);
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

const websiteRoot = path.join(root, "src/app/(website)");
for (const file of walk(websiteRoot).filter((item) => /\.(jsx|js)$/.test(item))) {
  const source = fs.readFileSync(file, "utf8");
  if (/export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/.test(source)) {
    failures.push(`${path.relative(root, file)}: public route is force-dynamic; cache data or justify the exception.`);
  }
}

requireText(
  "src/app/(website)/layout.jsx",
  /export const revalidate = 3600/,
  "website layout should define the one-hour public route revalidation baseline.",
);
requireText(
  "src/app/(website)/layout.jsx",
  /DeferredWebsiteFeatures/,
  "non-critical website features should be deferred.",
);
requireText(
  "src/app/lib/server/insightsRepository.js",
  /getPublicInsightsPage/,
  "Insights should use server-side pagination rather than sending the full library to the browser.",
);
requireText(
  "src/app/lib/server/insightsRepository.js",
  /unstable_cache/,
  "public Insights queries should use the Next.js data cache.",
);
requireText(
  "next.config.mjs",
  /minimumCacheTTL:\s*86400/,
  "image optimisation cache TTL should be configured.",
);
requireText(
  "next.config.mjs",
  /formats:\s*\["image\/avif",\s*"image\/webp"\]/,
  "AVIF and WebP output should be enabled.",
);
requireText(
  "src/app/components/OptimizedImage.jsx",
  /from "next\/image"/,
  "managed public content images should use the Next.js Image component.",
);

if (failures.length) {
  console.error("Performance baseline check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Performance baseline check passed.");
