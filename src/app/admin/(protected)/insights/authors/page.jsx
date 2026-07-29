import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listAuthors } from "../../../../lib/server/insightsRepository";
import { TaxonomyManager } from "../../../_components/TaxonomyManager";
export const dynamic="force-dynamic";
export default async function AuthorsPage(){await requireAdminPage("authors.manage");return <TaxonomyManager type="authors" initialItems={await listAuthors()} title="Authors" description="Manage verified author identities and editorial profiles shown on published Insights."/>}
