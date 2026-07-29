import { InvestorExperiencesGallery } from "../../components/InvestorExperiencesGallery";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export const metadata = createPageMetadata("/investor-experiences");
export const revalidate = 3600;

export default async function InvestorExperiencesPage() {
  const testimonials = await getPublishedTestimonials();
  const pageSchema = createWebPageSchema({
    path: "/investor-experiences",
    name: SEO_PAGES["/investor-experiences"].title,
    description: SEO_PAGES["/investor-experiences"].description,
    type: "CollectionPage",
  });
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Investor Experiences", path: "/investor-experiences" },
  ]);

  return (
    <>
      <StructuredData id="growvest-investor-experiences-schema" data={pageSchema} />
      <StructuredData id="growvest-investor-experiences-breadcrumb" data={breadcrumb} />
      <InvestorExperiencesGallery items={testimonials} />
    </>
  );
}
