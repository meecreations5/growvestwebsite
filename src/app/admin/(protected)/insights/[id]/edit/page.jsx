import { notFound } from "next/navigation";
import { requireAdminPage } from "../../../../../lib/server/adminAuth";
import { getInsightById, listAuthors, listCategories, listTags } from "../../../../../lib/server/insightsRepository";
import { InsightEditor } from "../../../../_components/InsightEditor";

export const dynamic = "force-dynamic";
export default async function EditInsightPage({params}){const admin=await requireAdminPage("insights.update");const {id}=await params;const [post,categories,tags,authors]=await Promise.all([getInsightById(id),listCategories(),listTags(),listAuthors()]);if(!post)notFound();return <InsightEditor post={post} categories={categories} tags={tags} authors={authors} canPublish={admin.permissions.includes("insights.publish")}/>}
