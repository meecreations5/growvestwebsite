import { InvestorExperiencesGallery } from "../../components/InvestorExperiencesGallery";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export const metadata = createPageMetadata("/investor-experiences");
export const dynamic = "force-dynamic";

export default async function InvestorExperiencesPage() {
  const testimonials = await getPublishedTestimonials();
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Investor Experiences", path: "/investor-experiences" },
  ]);

  return (
    <>
      <StructuredData id="growvest-investor-experiences-breadcrumb" data={breadcrumb} />
      <InvestorExperiencesGallery items={testimonials} />
    </>
  );
}
