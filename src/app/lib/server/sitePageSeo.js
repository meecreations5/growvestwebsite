import { createPageMetadata, createWebPageSchema, SEO_PAGES } from "../seo";
import { pageKeyFromPath } from "../sitePages";
import { getPublishedWebsitePage } from "./websiteContentRepository";

export async function getSitePageMetadata(path, extra = {}) {
  const key = pageKeyFromPath(path);
  if (!key) return createPageMetadata(path, extra);
  const page = await getPublishedWebsitePage(key);
  return createPageMetadata(path, {
    title: page?.seo?.title,
    description: page?.seo?.description,
    canonicalUrl: page?.seo?.canonicalUrl,
    image: page?.seo?.openGraphImage,
    allowIndexing: page?.seo?.allowIndexing !== false,
    ...extra,
  });
}

export async function getSiteWebPageSchema(path, type = "WebPage") {
  const key = pageKeyFromPath(path);
  const page = key ? await getPublishedWebsitePage(key) : null;
  return createWebPageSchema({
    path,
    name: page?.seo?.title || SEO_PAGES[path]?.title || "GrowVest",
    description: page?.seo?.description || SEO_PAGES[path]?.description || "",
    type,
    datePublished: page?.publishedAt,
    dateModified: page?.updatedAt,
    primaryImage: page?.seo?.openGraphImage,
  });
}
