import InvestorExperience from "../../_views/InvestorExperience";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export const metadata = createPageMetadata("/investor-experience", {
  title: "GrowVest Investor Experience | Your Conscious Wealth Partner",
});

export default async function Page() {
  const testimonials = await getPublishedTestimonials();
  const testimonial = testimonials?.[0] || null;
  const pageSchema = createWebPageSchema({
    path: "/investor-experience",
    name: "GrowVest Investor Experience | Your Conscious Wealth Partner",
    description: SEO_PAGES["/investor-experience"].description,
    type: "WebPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Investor Experience", path: "/investor-experience" },
  ]);

  return (
    <>
      <StructuredData id="growvest-investor-experience-webpage-schema" data={pageSchema} />
      <StructuredData id="growvest-investor-experience-breadcrumb-schema" data={breadcrumbs} />
      <InvestorExperience testimonial={testimonial} />
    </>
  );
}
