import AboutUs from "../../_views/AboutUs";
import { StructuredData } from "../../components/StructuredData";
import { SEO_PAGES, createBreadcrumbSchema, createPageMetadata, createWebPageSchema } from "../../lib/seo";
import { getPublishedTeamMembers, getPublishedSocialLinks } from "../../lib/server/teamSocialRepository";
import { getPublishedWebsitePage, getPublishedWebsiteSettings } from "../../lib/server/websiteContentRepository";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export async function generateMetadata() {
  const page = await getPublishedWebsitePage("about");
  return createPageMetadata("/about", {
    title: page?.seo?.title,
    description: page?.seo?.description,
    canonicalUrl: page?.seo?.canonicalUrl,
    image: page?.seo?.openGraphImage,
    allowIndexing: page?.seo?.allowIndexing !== false,
  });
}

export default async function Page() {
  const [teamMembers, socialLinks, page, settings, testimonials] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedSocialLinks(),
    getPublishedWebsitePage("about"),
    getPublishedWebsiteSettings(),
    getPublishedTestimonials("showOnAbout"),
  ]);
  const title = page?.seo?.title || SEO_PAGES["/about"].title;
  const description = page?.seo?.description || SEO_PAGES["/about"].description;
  const pageSchema = createWebPageSchema({
    path: "/about",
    name: title,
    description,
    type: "AboutPage",
    datePublished: page?.publishedAt,
    dateModified: page?.updatedAt,
    primaryImage: page?.seo?.openGraphImage,
  });
  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About GrowVest", path: "/about" },
  ]);

  return (
    <>
      <StructuredData id="growvest-about-schema" data={pageSchema} />
      <StructuredData id="growvest-about-breadcrumb" data={breadcrumbs} />
      <AboutUs teamMembers={teamMembers} socialLinks={socialLinks} content={page?.content || {}} settings={settings} testimonials={testimonials} />
    </>
  );
}
