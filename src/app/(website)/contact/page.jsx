import Contact from "../../_views/Contact";
import { StructuredData } from "../../components/StructuredData";
import { createBreadcrumbSchema, createPageMetadata } from "../../lib/seo";
import { getPublishedSocialLinks } from "../../lib/server/teamSocialRepository";

export const metadata = createPageMetadata("/contact");

export default async function Page() {
  const socialLinks = await getPublishedSocialLinks();
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact GrowVest", path: "/contact" },
  ]);

  return (
    <>
      <StructuredData id="breadcrumb-schema" data={breadcrumbs} />
      <Contact socialLinks={socialLinks} />
    </>
  );
}
