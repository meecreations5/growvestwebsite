import { SEO_PAGES, absoluteUrl } from "./lib/seo";

// Keep the public sitemap independent of Firebase, Firestore, or any other
// runtime data source. Google Search Console must be able to fetch this route
// quickly and reliably on every request/deployment.
export const dynamic = "force-static";

export default function sitemap() {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") return [];

  return Object.entries(SEO_PAGES).map(([path, page]) => ({
    url: absoluteUrl(path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
