import { InsightsDirectory } from "../../../../components/InsightsDirectory";
import { listAuthors, listCategories, listInsights } from "../../../../lib/server/insightsRepository";
export const dynamic='force-dynamic';
export default async function AuthorPage({params}){const {slug}=await params;const [{items},categories,authors]=await Promise.all([listInsights({publicOnly:true,pageSize:300}),listCategories(),listAuthors()]);const author=authors.find(item=>item.slug===slug);return <InsightsDirectory posts={author?items.filter(post=>post.authorId===author.id):[]} categories={categories}/>}
