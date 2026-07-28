import { SITE_URL } from "./lib/seo";

export default function robots() {
  const allowIndexing =
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return {
    rules: allowIndexing
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/"],
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
