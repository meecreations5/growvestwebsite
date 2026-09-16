const baseUrl = String(process.env.SMOKE_TEST_BASE_URL || process.argv[2] || "").replace(/\/$/, "");
if (!baseUrl) {
  console.error("Set SMOKE_TEST_BASE_URL or pass the deployment URL: npm run smoke -- https://preview.example.com");
  process.exit(1);
}

const routes = [
  "/",
  "/about",
  "/your-goals",
  "/wealth-guidance",
  "/insights",
  "/investor-experiences",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/disclosures",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/api/health/live",
  "/api/health/ready",
];

const failures = [];
for (const route of routes) {
  try {
    const response = await fetch(`${baseUrl}${route}`, {
      redirect: "follow",
      headers: { "User-Agent": "GrowVest-Production-Smoke-Test/23.0" },
      signal: AbortSignal.timeout(15_000),
    });
    const expectedReadyFailure = route === "/api/health/ready" && response.status === 503;
    if (!response.ok && !expectedReadyFailure) failures.push(`${route}: HTTP ${response.status}`);

    if (route === "/") {
      for (const header of ["content-security-policy", "x-content-type-options", "x-frame-options", "referrer-policy"]) {
        if (!response.headers.get(header)) failures.push(`${route}: missing ${header}`);
      }
    }

    console.log(`${response.ok ? "PASS" : expectedReadyFailure ? "BLOCKED" : "FAIL"} ${route} ${response.status}`);
  } catch (error) {
    failures.push(`${route}: ${error?.message || error}`);
  }
}

if (failures.length) {
  console.error("\nSmoke test failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`\nSmoke test passed across ${routes.length} routes.`);
}
