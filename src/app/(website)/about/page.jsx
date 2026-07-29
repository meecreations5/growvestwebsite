import AboutUs from "../../_views/AboutUs";
import { createPageMetadata } from "../../lib/seo";
import { getPublishedTeamMembers, getPublishedSocialLinks } from "../../lib/server/teamSocialRepository";
import { getPublishedWebsitePage, getPublishedWebsiteSettings } from "../../lib/server/websiteContentRepository";
import { getPublishedTestimonials } from "../../lib/server/testimonialsRepository";

export async function generateMetadata() {
  const page = await getPublishedWebsitePage("about");
  const fallback = createPageMetadata("/about");
  return {
    ...fallback,
    title: page?.seo?.title || fallback.title,
    description: page?.seo?.description || fallback.description,
    robots: page?.seo?.allowIndexing === false ? { index: false, follow: false } : fallback.robots,
  };
}

export default async function Page() {
  const [teamMembers, socialLinks, page, settings, testimonials] = await Promise.all([
    getPublishedTeamMembers(),
    getPublishedSocialLinks(),
    getPublishedWebsitePage("about"),
    getPublishedWebsiteSettings(),
    getPublishedTestimonials("showOnAbout"),
  ]);
  return <AboutUs teamMembers={teamMembers} socialLinks={socialLinks} content={page?.content || {}} settings={settings} testimonials={testimonials} />;
}
