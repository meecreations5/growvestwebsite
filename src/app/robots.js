import { SITE_URL } from "./lib/seo";

export default function robots() {
  const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allowIndexing
      ? [
          {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/admin/", "/api", "/api/"],
          },
        ]
      : [
          {
            userAgent: "*",
            disallow: "/",
          },
        ],
    sitemap: allowIndexing ? `${SITE_URL}/sitemap.xml` : undefined,
    host: SITE_URL,
  };
}
