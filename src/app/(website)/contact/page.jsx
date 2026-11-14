import { PageContentExtensions } from "../../components/PageContentExtensions";
import { getSitePageMetadata, getSiteWebPageSchema } from "../../lib/server/sitePageSeo";
import Contact from "../../_views/Contact";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema } from "../../lib/seo";
import { getPublishedSocialLinks } from "../../lib/server/teamSocialRepository";

export async function generateMetadata() {
  return getSitePageMetadata("/contact");
}

export default async function Page() {
  const socialLinks = await getPublishedSocialLinks();
  const pageSchema = await getSiteWebPageSchema("/contact", "ContactPage");
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact GrowVest", path: "/contact" },
  ]);

  return (
    <>
      <StructuredData id="growvest-contact-schema" data={pageSchema} />
      <StructuredData id="growvest-contact-breadcrumb" data={breadcrumbs} />
      <Contact socialLinks={socialLinks} />
      <PageContentExtensions pageKey="contact" />
    </>
  );
}
