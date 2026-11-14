import { SEO_PAGES } from "./seo";

// Fixed public pages shared by the site and the content workspace.
// Article archives inherit Insights FAQs; article blocks have their own FAQs.
// The transactional Thank You page is an explicit noindex CMS record.
export const SITE_PAGES = Object.entries(SEO_PAGES).map(([path, seo]) => ({
  path,
  key: path === "/" ? "home" : path.slice(1),
  label: path === "/" ? "Homepage" : path.slice(1).split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" "),
  title: seo.title,
})).concat([
  // Confirmation is intentionally noindex; still editable in the page-FAQ CMS.
  { path: "/thank-you", key: "thank-you", label: "Thank You", title: "Thank You", indexable: false },
]);

export const SITE_PAGE_KEYS = SITE_PAGES.map((page) => page.key);
export const SITE_PAGE_PATHS = SITE_PAGES.map((page) => page.path);

export function pageKeyFromPath(path) {
  return SITE_PAGES.find((page) => page.path === path)?.key || null;
}

export function pathFromPageKey(key) {
  return SITE_PAGES.find((page) => page.key === key)?.path || null;
}
