import { InsightsDirectory } from "../../components/InsightsDirectory";
import { StructuredData } from "../../components/StructuredData";
import {
  getPublicInsightsPage,
  getPublishedCategories,
} from "../../lib/server/insightsRepository";
import {
  SEO_PAGES,
  createBreadcrumbSchema,
  createItemListSchema,
  createPageMetadata,
  createWebPageSchema,
} from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export const metadata = createPageMetadata("/insights", { rssUrl: "/insights/feed.xml" });
export const revalidate = 900;

export default async function InsightsPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || "all";
  const search = params?.search || "";
  const page = Math.max(1, Number(params?.page) || 1);

  const [result, categories, testimonials] = await Promise.all([
    getPublicInsightsPage({ categoryId: category, search, page, pageSize: 9 }),
    getPublishedCategories(),
    getPublishedTestimonials("showOnInsights"),
  ]);

  const pageSchema = createWebPageSchema({
    path: "/insights",
    name: SEO_PAGES["/insights"].title,
    description: SEO_PAGES["/insights"].description,
    type: "CollectionPage",
  });
  const itemListSchema = createItemListSchema({
    path: "/insights",
    name: "GrowVest Wealth Insights",
    items: result.items.map((post) => ({
      name: post.title,
      description: post.excerpt,
      url: `/insights/${post.slug}`,
    })),
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
  ]);

  return (
    <>
      <StructuredData id="growvest-insights-collection" data={pageSchema} />
      <StructuredData id="growvest-insights-list" data={itemListSchema} />
      <StructuredData id="growvest-insights-breadcrumb" data={breadcrumbs} />
      <InsightsDirectory
        posts={result.items}
        categories={categories}
        testimonials={testimonials}
        featured={result.featured}
        showFeatured={result.showFeatured}
        initialCategory={category}
        initialSearch={search}
        currentPage={result.page}
        pageCount={result.pageCount}
        total={result.total}
      />
    </>
  );
}
