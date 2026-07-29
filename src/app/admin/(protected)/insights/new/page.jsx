import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listAuthors, listCategories, listTags } from "../../../../lib/server/insightsRepository";
import { InsightEditor } from "../../../_components/InsightEditor";

export const dynamic = "force-dynamic";
export default async function NewInsightPage(){const admin=await requireAdminPage("insights.create");const [categories,tags,authors]=await Promise.all([listCategories(),listTags(),listAuthors()]);return <InsightEditor categories={categories} tags={tags} authors={authors} canPublish={admin.permissions.includes("insights.publish")}/>}
