import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const appDir = path.resolve(process.cwd(), "src/app");
const pageNames = new Set([
  "page.js",
  "page.jsx",
  "page.ts",
  "page.tsx",
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && pageNames.has(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function toRoute(pageFile) {
  const relativeDirectory = path.relative(appDir, path.dirname(pageFile));
  const segments = relativeDirectory
    .split(path.sep)
    .filter(Boolean)
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")))
    .filter((segment) => !segment.startsWith("@"));

  return `/${segments.join("/")}`.replace(/\/$/, "") || "/";
}

try {
  const appStats = await stat(appDir);
  if (!appStats.isDirectory()) {
    throw new Error(`${appDir} is not a directory.`);
  }

  const pages = await walk(appDir);
  const routeMap = new Map();

  for (const page of pages) {
    const route = toRoute(page);
    const existing = routeMap.get(route) ?? [];
    existing.push(path.relative(process.cwd(), page));
    routeMap.set(route, existing);
  }

  const collisions = [...routeMap.entries()].filter(([, files]) => files.length > 1);

  if (collisions.length > 0) {
    console.error("\nRoute collisions detected:\n");

    for (const [route, files] of collisions) {
      console.error(`  ${route}`);
      for (const file of files) {
        console.error(`    - ${file}`);
      }
    }

    console.error(
      "\nThis usually happens when a new route-group version is copied over an older project without deleting the legacy public route folders."
    );
    console.error("Run: npm run cleanup:legacy-routes\n");
    process.exit(1);
  }

  console.log(`Route check passed: ${pages.length} pages, no duplicate URL paths.`);
} catch (error) {
  console.error("Route check failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
