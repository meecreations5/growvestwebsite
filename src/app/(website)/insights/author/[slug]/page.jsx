import { notFound } from "next/navigation";
import { InsightsDirectory } from "../../../../components/InsightsDirectory";
import {
  getPublicInsightsPage,
  getPublishedAuthors,
  getPublishedCategories,
} from "../../../../lib/server/insightsRepository";

export const revalidate = 900;

export default async function AuthorInsightsPage({ params, searchParams }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const [categories, authors] = await Promise.all([
    getPublishedCategories(),
    getPublishedAuthors(),
  ]);
  const author = authors.find((item) => item.slug === slug);
  if (!author) notFound();

  const result = await getPublicInsightsPage({
    authorId: author.id,
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
      initialSearch={query?.search || ""}
      currentPage={result.page}
      pageCount={result.pageCount}
      total={result.total}
    />
  );
}
