import { notFound } from "next/navigation";
import { InsightArticle } from "../../../../components/InsightArticle";
import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { getInsightById, listAuthors, listCategories } from "../../../../lib/server/insightsRepository";

export const dynamic = "force-dynamic";

export default async function AdminInsightPreviewPage({ params }) {
  await requireAdminPage("insights.read");
  const { id } = await params;
  const [post, categories, authors] = await Promise.all([getInsightById(id), listCategories(), listAuthors()]);
  if (!post) notFound();
  const author = authors.find((item) => item.id === post.authorId);
  return <InsightArticle post={post} author={author} categories={categories} previewMode />;
}
