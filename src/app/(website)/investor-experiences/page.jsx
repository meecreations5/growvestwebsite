import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import { InvestorExperiencesGallery } from "../../components/InvestorExperiencesGallery";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export async function generateMetadata() {
  return getSitePageMetadata("/investor-experiences");
}
export const revalidate = 3600;

export default async function InvestorExperiencesPage() {
  const testimonials = await getPublishedTestimonials();
  const pageSchema = await getSiteWebPageSchema("/investor-experiences", "CollectionPage");
  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Investor Experiences", path: "/investor-experiences" },
  ]);

  return (
    <>
      <StructuredData id="growvest-investor-experiences-schema" data={pageSchema} />
      <StructuredData id="growvest-investor-experiences-breadcrumb" data={breadcrumb} />
      <InvestorExperiencesGallery items={testimonials} />
      <PageContentExtensions pageKey="investor-experiences" />
    </>
  );
}
