import { InsightsDirectory } from "../../../../components/InsightsDirectory";
import { listCategories, listInsights } from "../../../../lib/server/insightsRepository";
export const dynamic='force-dynamic';
export default async function CategoryInsightsPage({params}){const {slug}=await params;const [{items},categories]=await Promise.all([listInsights({publicOnly:true,pageSize:300}),listCategories()]);const category=categories.find(item=>item.slug===slug);return <InsightsDirectory posts={items} categories={categories} initialCategory={category?.id||'all'}/>}
