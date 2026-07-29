import Contact from "../../_views/Contact";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { getPublishedSocialLinks } from "../../lib/server/teamSocialRepository";

export const metadata = createPageMetadata("/contact");

export default async function Page() {
  const socialLinks = await getPublishedSocialLinks();
  const pageSchema = createWebPageSchema({
    path: "/contact",
    name: SEO_PAGES["/contact"].title,
    description: SEO_PAGES["/contact"].description,
    type: "ContactPage",
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact GrowVest", path: "/contact" },
  ]);

  return (
    <>
      <StructuredData id="growvest-contact-schema" data={pageSchema} />
      <StructuredData id="growvest-contact-breadcrumb" data={breadcrumbs} />
      <Contact socialLinks={socialLinks} />
    </>
  );
}
