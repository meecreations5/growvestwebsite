import Home from "../_views/Home";
import { createPageMetadata } from "../lib/seo";
import { getPublishedWebsitePage } from "../lib/server/websiteContentRepository";
import { getPublishedTestimonials } from "../lib/server/testimonialsRepository";

export async function generateMetadata() {
  const page = await getPublishedWebsitePage("home");
  const fallback = createPageMetadata("/");
  return {
    ...fallback,
    title: page?.seo?.title || fallback.title,
    description: page?.seo?.description || fallback.description,
    robots: page?.seo?.allowIndexing === false ? { index: false, follow: false } : fallback.robots,
  };
}

export default async function Page() {
  const [page, testimonials] = await Promise.all([
    getPublishedWebsitePage("home"),
    getPublishedTestimonials("showOnHomepage"),
  ]);
  return <Home content={page?.content || {}} testimonials={testimonials} />;
}
