import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "src");
const files = [];
const missing = [];
const extensions = ["", ".js", ".jsx", ".mjs", ".json"];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (/\.(js|jsx|mjs)$/.test(entry.name)) files.push(fullPath);
  }
}

async function exists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function resolveLocal(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  for (const extension of extensions) {
    if (await exists(`${base}${extension}`)) return true;
  }
  for (const extension of [".js", ".jsx", ".mjs", ".json"]) {
    if (await exists(path.join(base, `index${extension}`))) return true;
  }
  return false;
}

await walk(root);

for (const file of files) {
  const source = await readFile(file, "utf8");
  const patterns = [
    /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["'](\.[^"']+)["']/g,
    /import\(\s*["'](\.[^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (!(await resolveLocal(file, match[1]))) {
        missing.push(`${path.relative(process.cwd(), file)} -> ${match[1]}`);
      }
    }
  }
}

if (missing.length) {
  console.error("Local import check failed:\n");
  missing.forEach((item) => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log(`Local import check passed across ${files.length} source files.`);
}
