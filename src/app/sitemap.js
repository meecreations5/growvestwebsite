import { SEO_PAGES, absoluteUrl } from "./lib/seo";

export default function sitemap() {
  return Object.entries(SEO_PAGES).map(([path, page]) => ({
    url: absoluteUrl(path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
