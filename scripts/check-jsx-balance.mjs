import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const localRequire = createRequire(import.meta.url);
let ts;
try {
  ts = localRequire("typescript");
} catch {
  const globalRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
  ts = createRequire(path.join(globalRoot, "__growvest_validator__.js"))("typescript");
}

const root = path.join(process.cwd(), "src");
const files = [];
const failures = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (/\.(js|jsx|mjs)$/.test(entry.name)) files.push(fullPath);
  }
}

await walk(root);
for (const file of files) {
  const source = await readFile(file, "utf8");
  const scriptKind = file.endsWith(".jsx") ? ts.ScriptKind.JSX : ts.ScriptKind.JS;
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, scriptKind);
  for (const diagnostic of parsed.parseDiagnostics) {
    const position = parsed.getLineAndCharacterOfPosition(diagnostic.start || 0);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
    failures.push(`${path.relative(process.cwd(), file)}:${position.line + 1}:${position.character + 1} ${message}`);
  }
}

if (failures.length) {
  console.error("JavaScript/JSX syntax check failed:\n");
  failures.forEach((item) => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log(`JavaScript/JSX syntax check passed across ${files.length} source files.`);
}
