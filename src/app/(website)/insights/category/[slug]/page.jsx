import { notFound } from "next/navigation";
import { InsightsDirectory } from "../../../../components/InsightsDirectory";
import { getPublicInsightsPage, getPublishedCategories } from "../../../../lib/server/insightsRepository";

export const revalidate = 900;

export default async function CategoryInsightsPage({ params, searchParams }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const categories = await getPublishedCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const result = await getPublicInsightsPage({
    categoryId: category.id,
    search: query?.search || "",
    page: query?.page || 1,
    pageSize: 9,
  });

  return (
    <InsightsDirectory
      posts={result.items}
      categories={categories}
      featured={result.featured}
      showFeatured={false}
      initialCategory={category.id}
      initialSearch={query?.search || ""}
      currentPage={result.page}
      pageCount={result.pageCount}
      total={result.total}
    />
  );
}
