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

requireText(
  "src/app/(website)/layout.jsx",
  /MobileSiteNavigation/,
  "the website layout must mount the mobile site navigation.",
);
requireText(
  "src/app/components/MobileSiteNavigation.jsx",
  /Mobile primary navigation/,
  "the phone navigation needs an accessible navigation label.",
);
for (const destination of ["Home", "Goals", "Start", "Insights", "More"]) {
  requireText(
    "src/app/components/MobileSiteNavigation.jsx",
    new RegExp(`\\b${destination}\\b`),
    `the ${destination} phone destination is missing.`,
  );
}
requireText(
  "src/app/components/MobileSiteNavigation.jsx",
  /role="dialog"/,
  "the More navigation sheet must expose dialog semantics.",
);
requireText(
  "src/app/components/MobileSiteNavigation.jsx",
  /aria-current=\{secondaryRouteActive \? "location" : undefined\}/,
  "the More destination must expose the current secondary-route location to assistive technology.",
);
requireText(
  "src/app/components/MobileSiteNavigation.jsx",
  /aria-pressed=\{menuOpen\}/,
  "the More control must expose its open state to assistive technology.",
);
requireText(
  "src/app/components/MobileSiteNavigation.jsx",
  /growvest-guide-state/,
  "mobile navigation must coordinate with the GrowVest Guide.",
);
requireText(
  "src/app/components/MobileSiteNavigation.jsx",
  /element\.inert = true/,
  "background content should be removed from keyboard navigation while the sheet is open.",
);
requireText(
  "src/app/components/SiteHeader.jsx",
  /data-analytics-location="mobile_header"/,
  "the phone header must retain direct Investor Portal access.",
);
requireText(
  "src/app/components/SiteHeader.jsx",
  /md:inline-flex xl:hidden/,
  "the existing menu should remain available for tablet widths only.",
);
requireText(
  "src/app/components/CookieConsent.jsx",
  /gv-cookie-consent/,
  "the consent surface must participate in mobile fixed-surface spacing.",
);
requireText(
  "src/app/globals.css",
  /--gv-mobile-nav-total/,
  "mobile navigation height and safe-area spacing must share one calculated token.",
);
requireText(
  "src/app/globals.css",
  /env\(safe-area-inset-bottom\)/,
  "bottom safe-area handling is missing.",
);
requireText(
  "src/app/globals.css",
  /body\.gv-mobile-nav-open \.gv-guide-launcher/,
  "the Guide launcher must not overlap the open navigation sheet.",
);
requireText(
  "src/app/globals.css",
  /body\.gv-guide-open \.gv-cookie-consent/,
  "cookie consent must yield while the full-screen phone Guide is open.",
);
requireText(
  "src/app/globals.css",
  /orientation: landscape/,
  "compact mobile landscape behavior is missing.",
);

const layout = read("src/app/(website)/layout.jsx");
if (/MobileActionBar/.test(layout)) {
  failures.push("src/app/(website)/layout.jsx: legacy MobileActionBar is still mounted.");
}
if (fs.existsSync(path.join(root, "src/app/components/MobileActionBar.jsx"))) {
  failures.push("src/app/components/MobileActionBar.jsx: remove the retired floating action bar component.");
}

if (failures.length) {
  console.error("Mobile UI baseline check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Mobile UI and navigation baseline check passed.");
