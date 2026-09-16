import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "src");
const files = [];
const errors = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (/\.(jsx|js)$/.test(entry.name)) files.push(fullPath);
  }
}

await walk(root);

for (const file of files) {
  const source = await readFile(file, "utf8");
  const relative = path.relative(process.cwd(), file);

  for (const match of source.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt\s*=/.test(match[0])) errors.push(`${relative}: image element is missing alt text`);
  }

  for (const match of source.matchAll(/<(?:a|Link)\b[^>]*target=["']_blank["'][^>]*>/g)) {
    if (!/\brel=["'][^"']*(?:noopener|noreferrer)[^"']*["']/.test(match[0])) {
      errors.push(`${relative}: target=_blank link is missing rel=noopener/noreferrer`);
    }
  }

  if (/tabIndex=\{?["']?[1-9]/.test(source)) errors.push(`${relative}: positive tabIndex detected`);
}

const websiteLayout = await readFile(path.join(process.cwd(), "src/app/(website)/layout.jsx"), "utf8");
if (!websiteLayout.includes('href="#main-content"') || !websiteLayout.includes('id="main-content"')) {
  errors.push("src/app/(website)/layout.jsx: skip link or main-content target is missing");
}

const rootLayout = await readFile(path.join(process.cwd(), "src/app/layout.jsx"), "utf8");
if (!rootLayout.includes('<html lang="en-IN"')) errors.push("src/app/layout.jsx: html language must be en-IN");

if (errors.length) {
  console.error("Accessibility baseline check failed:\n");
  errors.forEach((item) => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log(`Accessibility baseline check passed across ${files.length} JavaScript/JSX files.`);
}
