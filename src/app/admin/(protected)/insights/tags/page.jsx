import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listTags } from "../../../../lib/server/insightsRepository";
import { TaxonomyManager } from "../../../_components/TaxonomyManager";
export const dynamic="force-dynamic";
export default async function TagsPage(){await requireAdminPage("taxonomy.manage");return <TaxonomyManager type="tags" initialItems={await listTags()} title="Tags" description="Create precise labels that improve discovery and related-content connections."/>}
