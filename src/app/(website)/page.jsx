import Home from "../_views/Home";
import { StructuredData } from "../components/StructuredData";
import { SEO_PAGES, createPageMetadata, createWebPageSchema } from "../lib/seo";
import { getPublishedWebsitePage } from "../lib/server/websiteContentRepository";
import { getPublishedTestimonials } from "../lib/server/testimonialsRepository";

export async function generateMetadata() {
  const page = await getPublishedWebsitePage("home");
  return createPageMetadata("/", {
    title: page?.seo?.title,
    description: page?.seo?.description,
    canonicalUrl: page?.seo?.canonicalUrl,
    image: page?.seo?.openGraphImage,
    allowIndexing: page?.seo?.allowIndexing !== false,
  });
}

export default async function Page() {
  const [page, testimonials] = await Promise.all([
    getPublishedWebsitePage("home"),
    getPublishedTestimonials("showOnHomepage"),
  ]);
  const title = page?.seo?.title || SEO_PAGES["/"].title;
  const description = page?.seo?.description || SEO_PAGES["/"].description;
  const webPageSchema = createWebPageSchema({
    path: "/",
    name: title,
    description,
    type: "WebPage",
    datePublished: page?.publishedAt,
    dateModified: page?.updatedAt,
    primaryImage: page?.seo?.openGraphImage,
  });

  return (
    <>
      <StructuredData id="growvest-homepage-schema" data={webPageSchema} />
      <Home content={page?.content || {}} testimonials={testimonials} />
    </>
  );
}
