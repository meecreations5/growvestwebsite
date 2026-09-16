import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "node_modules", ".vercel", "coverage"]);
const ignoredFiles = new Set([".env.example", "check-secrets.mjs"]);
const extensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".json", ".yml", ".yaml", ".toml"]);
const findings = [];

const patterns = [
  { name: "private key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: "Brevo API key", regex: /xkeysib-[A-Za-z0-9_-]{20,}/ },
  { name: "AWS access key", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "Google service-account key", regex: /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/ },
  { name: "hard-coded password", regex: /(?:password|smtp_pass|admin_password)\s*[:=]\s*["'][^"']{8,}["']/i },
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (ignoredFiles.has(entry.name) || !extensions.has(path.extname(entry.name))) continue;
    if ((await stat(fullPath)).size > 2_000_000) continue;
    const content = await readFile(fullPath, "utf8");
    patterns.forEach(({ name, regex }) => {
      if (regex.test(content)) findings.push(`${path.relative(root, fullPath)}: possible ${name}`);
    });
  }
}

await walk(root);

for (const envFile of [".env", ".env.local", ".env.production", ".env.production.local"]) {
  try {
    await stat(path.join(root, envFile));
    findings.push(`${envFile}: environment file must not be included in a release archive`);
  } catch {}
}

if (findings.length) {
  console.error("Secret scan failed:\n");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exitCode = 1;
} else {
  console.log("Secret scan passed: no server credentials or local environment files detected.");
}
