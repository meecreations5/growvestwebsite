import { SEO_PAGES, absoluteUrl } from "./lib/seo";
import { listInsights } from "./lib/server/insightsRepository";

export default async function sitemap() {
  const staticPages = Object.entries(SEO_PAGES).map(([path, page]) => ({
    url: absoluteUrl(path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  try {
    const { items } = await listInsights({ publicOnly: true, pageSize: 300 });
    const insightPages = items
      .filter((post) => post.seo?.allowIndexing !== false)
      .map((post) => ({
        url: absoluteUrl(`/insights/${post.slug}`),
        lastModified: post.updatedAt || post.publishedAt || undefined,
        changeFrequency: "monthly",
        priority: post.isFeatured ? 0.8 : 0.65,
      }));
    return [...staticPages, ...insightPages];
  } catch {
    return staticPages;
  }
}
