import { SEO_PAGES, absoluteUrl } from "./lib/seo";
import { listInsights } from "./lib/server/insightsRepository";

export default async function sitemap() {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") return [];

  const staticPages = Object.entries(SEO_PAGES).map(([path, page]) => ({
    url: absoluteUrl(path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  try {
    const { items } = await listInsights({ publicOnly: true, pageSize: 1000 });
    const insightPages = items
      .filter((post) => post.slug && post.seo?.allowIndexing !== false)
      .map((post) => ({
        url: absoluteUrl(`/insights/${post.slug}`),
        lastModified: post.updatedAt || post.publishedAt || undefined,
        changeFrequency: "monthly",
        priority: post.isFeatured ? 0.8 : 0.65,
      }));
    return [...staticPages, ...insightPages];
  } catch (error) {
    console.warn("[GrowVest SEO] Unable to include dynamic Insights in sitemap.", error?.message || error);
    return staticPages;
  }
}
