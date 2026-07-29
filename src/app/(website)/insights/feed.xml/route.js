import { getPublishedInsights } from "../../../lib/server/insightsRepository";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../../../lib/seo";

export const revalidate = 900;

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const items = (await getPublishedInsights()).slice(0, 100);
  const newestDate = items.find((post) => post.updatedAt || post.publishedAt)?.updatedAt
    || items.find((post) => post.publishedAt)?.publishedAt;
  const buildDate = new Date(newestDate || 0).toUTCString();
  const entries = items
    .filter((post) => post.seo?.allowIndexing !== false)
    .map((post) => {
      const url = absoluteUrl(`/insights/${post.slug}`);
      const published = new Date(post.publishedAt || post.updatedAt || Date.now()).toUTCString();
      return `\n    <item>\n      <title>${escapeXml(post.title)}</title>\n      <link>${escapeXml(url)}</link>\n      <guid isPermaLink="true">${escapeXml(url)}</guid>\n      <description>${escapeXml(post.excerpt || "")}</description>\n      <pubDate>${published}</pubDate>\n    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(`${SITE_NAME} Wealth Insights`)}</title>\n    <link>${escapeXml(SITE_URL)}</link>\n    <description>${escapeXml("Practical perspectives on financial planning, family wealth and goal-led progress.")}</description>\n    <language>en-IN</language>\n    <lastBuildDate>${buildDate}</lastBuildDate>\n    <ttl>60</ttl>${entries}\n  </channel>\n</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
