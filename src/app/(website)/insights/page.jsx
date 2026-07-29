import { InsightsDirectory } from "../../components/InsightsDirectory";
import { listCategories, listInsights } from "../../lib/server/insightsRepository";
import { createPageMetadata } from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export const metadata = createPageMetadata("/insights");
export const dynamic = "force-dynamic";

export default async function InsightsPage({searchParams}){
  const params=await searchParams;
  const [{items}, categories, testimonials] = await Promise.all([
    listInsights({ publicOnly: true, pageSize: 300 }),
    listCategories(),
    getPublishedTestimonials("showOnInsights"),
  ]);
  return <InsightsDirectory posts={items} categories={categories} testimonials={testimonials} initialCategory={params?.category || "all"} initialSearch={params?.search || ""} initialPage={params?.page || 1} />;
}
