import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { SEO_PAGES } from "../src/app/lib/seo.js";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const errors = [];
const defaultsSource = read("src/app/data/pageFaqDefaults.js");
const sourceMatch = defaultsSource.match(/const STARTER_QUESTIONS_BY_PAGE\s*=\s*(\{[\s\S]*?\n\});/);
if (!sourceMatch) throw new Error("Cannot locate the starter FAQ page mapping.");
const mapping = vm.runInNewContext(`(${sourceMatch[1]})`, {}, { timeout: 500 });
const pageKey = (url) => url === "/" ? "home" : url.slice(1);
const fixedKeys = Object.keys(SEO_PAGES).map(pageKey);
for (const key of [...fixedKeys, "thank-you"]) {
  if (!Object.hasOwn(mapping, key)) errors.push(`FAQ starter mapping missing: ${key}`);
  if (key !== "faqs" && (!Array.isArray(mapping[key]) || mapping[key].length < 2)) errors.push(`Need at least two starter FAQs for: ${key}`);
  const filename = key === "home" ? "src/app/(website)/page.jsx" : `src/app/(website)/${key}/page.jsx`;
  if (!read(filename).includes("PageContentExtensions")) errors.push(`Missing FAQ renderer in ${filename}`);
}
for (const filename of [
  "src/app/(website)/insights/[slug]/page.jsx",
  "src/app/(website)/insights/category/[slug]/page.jsx",
  "src/app/(website)/insights/author/[slug]/page.jsx",
]) {
  if (!read(filename).includes('PageContentExtensions pageKey="insights"')) errors.push(`Missing inherited FAQs in ${filename}`);
}
const faqDirectory = read("src/app/(website)/faqs/page.jsx");
if (!faqDirectory.includes("<FAQs items={items} />")) errors.push("Dedicated FAQ directory no longer renders.");
const rendered = read("src/app/components/PageContentExtensions.jsx");
if (!["pageFaqs", "sharedFaqs", "items.map", "settings.enabled === false"].every((str) => rendered.includes(str))) errors.push("FAQ component lacks page FAQs, shared FAQs or disable logic.");
const admin = read("src/app/admin/_components/SitePageSettingsEditor.jsx");
if (!admin.includes("PageFaqItemsEditor")) errors.push("Page editor does not expose FAQ CRUD.");
const repo = read("src/app/lib/server/websiteContentRepository.js");
if (!repo.includes("withPageFaqDefaults") || !repo.includes("incompletePublished") || !repo.includes("revalidateTag(pageCacheTag(pageKey))")) errors.push("FAQ migration/validation/cache invalidation missing.");
if (!read("src/app/(website)/thank-you/page.jsx").includes("allowIndexing: false")) errors.push("Thank-you page must remain noindex.");
const indexMax = Math.max(...Object.values(mapping).flat());
const globalFaqCount = (read("src/app/data/faqs.js").match(/    q: "/g) || []).length;
if (indexMax >= globalFaqCount) errors.push(`FAQ mapping exceeds the ${globalFaqCount} existing approved FAQ questions.`);
if (errors.length) {
  console.error("All-page FAQ check failed:\n" + errors.map((s) => `- ${s}`).join("\n"));
  process.exit(1);
}
console.log(`All-page FAQ check passed: ${fixedKeys.length} fixed pages, noindex Thank You, Insight articles and archives, and editable starter copy.`);
