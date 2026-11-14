import fs from "node:fs";
import path from "node:path";
import { SEO_PAGES } from "../src/app/lib/seo.js";

const root = process.cwd();
const errors = [];
const expected = Object.keys(SEO_PAGES);
for (const route of expected) {
  const location = route === "/" ? "src/app/(website)/page.jsx" : `src/app/(website)${route}/page.jsx`;
  const full = path.join(root, location);
  if (!fs.existsSync(full)) { errors.push(`${route}: route file missing`); continue; }
  const source = fs.readFileSync(full, "utf8");
  if (!source.includes("PageContentExtensions")) errors.push(`${route}: no page FAQ/content extension`);
  if (!source.includes("generateMetadata")) errors.push(`${route}: dynamic metadata missing`);
  if (!route.match(/^\/(about)?$/) && !source.includes("getSitePageMetadata")) errors.push(`${route}: managed metadata lookup missing`);
}
const required = [
  "src/app/admin/(protected)/website/pages/page.jsx",
  "src/app/admin/(protected)/website/pages/[key]/page.jsx",
  "src/app/admin/(protected)/users/page.jsx",
  "src/app/api/admin/users/route.js",
  "src/app/api/admin/users/[uid]/route.js",
  "src/app/components/PageContentExtensions.jsx",
  "src/app/lib/server/adminUsersRepository.js",
  "src/app/lib/server/sitePageSeo.js",
  "src/app/admin/(protected)/seo/insights/[id]/page.jsx",
  "src/app/admin/_components/InsightSeoEditor.jsx",
  "src/app/api/admin/insights/[id]/seo/route.js",
];
for (const file of required) if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required CMS file: ${file}`);
const roles = fs.readFileSync(path.join(root, "src/app/lib/server/adminAuth.js"), "utf8");
const seo = roles.split("seo_manager:")[1]?.split("\n")[0] || "";
for (const perm of ["website.page.manage", "website.faq.manage", "seo.manage"]) if (!seo.includes(perm)) errors.push(`SEO role lacks ${perm}`);
for (const perm of ["enquiries.read", "system.manage", "admins.manage", "website.manage", "website.publish"]) if (seo.includes(perm)) errors.push(`SEO role overprivileged with ${perm}`);
const articleEditor = fs.readFileSync(path.join(root, "src/app/admin/_components/InsightEditor.jsx"), "utf8");
const articleRenderer = fs.readFileSync(path.join(root, "src/app/components/InsightArticle.jsx"), "utf8");
const articleRepository = fs.readFileSync(path.join(root, "src/app/lib/server/insightsRepository.js"), "utf8");
const seoApi = fs.readFileSync(path.join(root, "src/app/api/admin/insights/[id]/seo/route.js"), "utf8");
if (!articleEditor.includes('"faq", "FAQ question & answer"') || !articleRenderer.includes('block.type === "faq"') || !articleRepository.includes('"divider", "faq"')) errors.push("Insight FAQ block support is missing");
if (!seoApi.includes('"seo.manage"') || !articleRepository.includes('export async function updateInsightSeo')) errors.push("SEO-only Insight edit authorization is missing");
if (errors.length) {
  console.error("Page CMS validation failed:\n" + errors.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`CMS validation passed: ${expected.length} public routes, FAQ components, admin editors and SEO role boundaries.`);
