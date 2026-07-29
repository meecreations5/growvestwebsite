import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../lib/server/adminAuth";
import { getInsightById, listInsightVersions } from "../../../../../lib/server/insightsRepository";
import { VersionHistory } from "../../../../_components/VersionHistory";

export const dynamic = "force-dynamic";

export default async function InsightHistoryPage({ params }) {
  await requireAdminPage("insights.versions");
  const { id } = await params;
  const [post, versions] = await Promise.all([getInsightById(id), listInsightVersions(id, 50)]);
  if (!post) notFound();
  return <VersionHistory post={post} versions={versions} />;
}
