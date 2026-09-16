import { requireAdminPage } from "../../../../lib/server/adminAuth";
import { listCategories } from "../../../../lib/server/insightsRepository";
import { TaxonomyManager } from "../../../_components/TaxonomyManager";
export const dynamic="force-dynamic";
export default async function CategoriesPage(){await requireAdminPage("taxonomy.manage");return <TaxonomyManager type="categories" initialItems={await listCategories()} title="Categories" description="Organise Insights around clear GrowVest editorial themes."/>}
