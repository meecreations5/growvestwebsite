import { notFound, permanentRedirect } from "next/navigation";
import { InsightArticle } from "../../../components/InsightArticle";
import { StructuredData } from "../../../components/StructuredData";
import {
  getPublishedInsightBySlug,
  getRelatedInsights,
  getPublishedAuthors,
  getPublishedCategories,
  getPublishedInsights,
  getPublishedTags,
  resolveInsightRedirect,
} from "../../../lib/server/insightsRepository";
import {
  DEFAULT_OG_IMAGE,
  ORGANIZATION_ID,
  SITE_LANGUAGE,
  absoluteUrl,
  createBreadcrumbSchema,
  createPageMetadata,
  normalizeSeoImage,
} from "../../../lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getPublishedInsights();
  return posts.slice(0, 100).map((post) => ({ slug: post.slug }));
}

function countArticleWords(blocks = []) {
  return blocks.reduce((total, block) => {
    const tableText = (block?.rows || []).flat().join(" ");
    const text = `${block?.title || ""} ${block?.text || ""} ${(block?.items || []).join(" ")} ${tableText}`;
    return total + text.trim().split(/\s+/).filter(Boolean).length;
  }, 0);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedInsightBySlug(slug);
  if (!post) return { title: "Insight Not Found", robots: { index: false, follow: false } };

  const path = `/insights/${post.slug}`;
  const base = createPageMetadata(path, {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    canonicalUrl: post.seo?.canonicalUrl || absoluteUrl(path),
    image: post.seo?.openGraphImage || post.featuredImage?.url || DEFAULT_OG_IMAGE,
    imageAlt: post.featuredImage?.altText || post.title,
    allowIndexing: post.seo?.allowIndexing !== false,
    type: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || post.publishedAt || undefined,
      authors: [post.authorName || "GrowVest Editorial Team"],
      section: post.categoryIds?.[0] || "Wealth Insights",
      tags: post.tagIds || [],
    },
  };
}

export default async function InsightPage({ params }) {
  const { slug } = await params;
  const [post, categories, tags, authors] = await Promise.all([
    getPublishedInsightBySlug(slug),
    getPublishedCategories(),
    getPublishedTags(),
    getPublishedAuthors(),
  ]);

  if (!post) {
    const redirectPath = await resolveInsightRedirect(slug);
    if (redirectPath) permanentRedirect(redirectPath);
    notFound();
  }

  const relatedPosts = await getRelatedInsights(post, 3);
  const author = authors.find((item) => item.id === post.authorId);
  const categoryNames = categories.filter((item) => post.categoryIds?.includes(item.id)).map((item) => item.name);
  const tagNames = tags.filter((item) => post.tagIds?.includes(item.id)).map((item) => item.name);
  const articleUrl = absoluteUrl(`/insights/${post.slug}`);
  const imageUrl = normalizeSeoImage(post.seo?.openGraphImage || post.featuredImage?.url || DEFAULT_OG_IMAGE);
  const authorName = author?.name || post.authorName || "GrowVest Editorial Team";
  const authorType = /team|editorial/i.test(authorName) ? "Organization" : "Person";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${articleUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${articleUrl}#webpage` },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: SITE_LANGUAGE,
    isAccessibleForFree: true,
    articleSection: categoryNames.length ? categoryNames : ["Wealth Insights"],
    ...(tagNames.length ? { keywords: tagNames.join(", ") } : {}),
    wordCount: countArticleWords(post.blocks),
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      ...(post.featuredImage?.altText ? { caption: post.featuredImage.altText } : {}),
    },
    author: {
      "@type": authorType,
      name: authorName,
      ...(author?.bio ? { description: author.bio } : {}),
      ...(author?.imageUrl ? { image: normalizeSeoImage(author.imageUrl) } : {}),
    },
    publisher: {
      "@id": ORGANIZATION_ID,
      "@type": "Organization",
      name: "GrowVest",
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-mark.png"),
        width: 512,
        height: 512,
      },
    },
  };
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    { name: post.title, path: `/insights/${post.slug}` },
  ]);

  return (
    <>
      <StructuredData id={`insight-${post.id}`} data={articleSchema} />
      <StructuredData id={`insight-breadcrumb-${post.id}`} data={breadcrumbs} />
      <InsightArticle post={post} author={author} categories={categories} relatedPosts={relatedPosts} />
    </>
  );
}
