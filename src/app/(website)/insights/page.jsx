import { InsightsDirectory } from "../../components/InsightsDirectory";
import { StructuredData } from "../../components/StructuredData";
import { listCategories, listInsights } from "../../lib/server/insightsRepository";
import { SEO_PAGES, createBreadcrumbSchema, createItemListSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export const metadata = createPageMetadata("/insights", { rssUrl: "/insights/feed.xml" });
export const dynamic = "force-dynamic";

export default async function InsightsPage({ searchParams }) {
  const params = await searchParams;
  const [{ items }, categories, testimonials] = await Promise.all([
    listInsights({ publicOnly: true, pageSize: 300 }),
    listCategories(),
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
    items: items.slice(0, 50).map((post) => ({
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
        posts={items}
        categories={categories}
        testimonials={testimonials}
        initialCategory={params?.category || "all"}
        initialSearch={params?.search || ""}
        initialPage={params?.page || 1}
      />
    </>
  );
}
