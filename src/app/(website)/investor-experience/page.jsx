import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import InvestorExperience from "../../_views/InvestorExperience";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export async function generateMetadata() {
  return getSitePageMetadata("/investor-experience");
}

export default async function Page() {
  const testimonials = await getPublishedTestimonials();
  const testimonial = testimonials?.[0] || null;
  const pageSchema = await getSiteWebPageSchema("/investor-experience", "WebPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Investor Experience", path: "/investor-experience" },
  ]);

  return (
    <>
      <StructuredData id="growvest-investor-experience-webpage-schema" data={pageSchema} />
      <StructuredData id="growvest-investor-experience-breadcrumb-schema" data={breadcrumbs} />
      <InvestorExperience testimonial={testimonial} />
      <PageContentExtensions pageKey="investor-experience" />
    </>
  );
}
