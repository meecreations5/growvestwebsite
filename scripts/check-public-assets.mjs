import { access, stat } from "node:fs/promises";
import path from "node:path";

const requiredAssets = [
  "public/growvest-icon.svg",
  "public/growvest-logo-dark.svg",
  "public/growvest-logo-white.svg",
  "public/growvest-wordmark-dark.svg",
  "public/growvest-wordmark-white.svg",
  "public/logo-mark.png",
  "public/icons/icon-192.png",
  "public/icons/icon-512.png",
  "public/icons/maskable-512.png",
  "src/app/favicon.ico",
  "src/app/opengraph-image.png",
  "src/app/twitter-image.png",
];

const missing = [];
for (const asset of requiredAssets) {
  try {
    await access(path.join(process.cwd(), asset));
    const details = await stat(path.join(process.cwd(), asset));
    if (!details.size) missing.push(`${asset} is empty`);
  } catch {
    missing.push(`${asset} is missing`);
  }
}

if (missing.length) {
  console.error("Public asset check failed:\n");
  missing.forEach((item) => console.error(`- ${item}`));
  process.exitCode = 1;
} else {
  console.log(`Public asset check passed: ${requiredAssets.length} required assets are present.`);
}
