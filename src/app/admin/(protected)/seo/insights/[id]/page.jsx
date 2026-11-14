import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../lib/server/adminAuth";
import { getInsightById } from "../../../../../lib/server/insightsRepository";
import { InsightSeoEditor } from "../../../../_components/InsightSeoEditor";

export const dynamic = "force-dynamic";

export default async function ManageInsightSeo({ params }) {
  await requireAdminPage("seo.manage");
  const { id } = await params;
  const post = await getInsightById(id);
  if (!post) notFound();
  return <InsightSeoEditor post={post} />;
}
