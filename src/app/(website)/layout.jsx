import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { PageTransition } from "../components/PageTransition";
import { ScrollProgress } from "../components/ScrollProgress";
import { InvestorPortalTransition } from "../components/InvestorPortalTransition";
import { MobileSiteNavigation } from "../components/MobileSiteNavigation";
import { CookieConsent } from "../components/CookieConsent";
import { DeferredWebsiteFeatures } from "../components/DeferredWebsiteFeatures";
import { StructuredData } from "../components/StructuredData";
import { COMPANY } from "../lib/brand";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL, WEBSITE_ID, absoluteUrl } from "../lib/seo";
import { getPublishedSocialLinks } from "../lib/server/teamSocialRepository";
import { getPublishedWebsiteNavigation, getPublishedWebsiteSettings } from "../lib/server/websiteContentRepository";
import { getPublishedGuideSettings } from "../lib/server/growvestGuideRepository";

export const revalidate = 3600;

export default async function WebsiteLayout({ children }) {
  const [socialLinks, settings, navigation, guideSettings] = await Promise.all([
    getPublishedSocialLinks(),
    getPublishedWebsiteSettings(),
    getPublishedWebsiteNavigation(),
    getPublishedGuideSettings(),
  ]);
  const company = { ...COMPANY, ...(settings || {}) };
  const socialProfiles = socialLinks.map((item) => item.url).filter(Boolean);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "FinancialService"],
        "@id": ORGANIZATION_ID,
        name: company.brandName,
        alternateName: company.legalName,
        legalName: company.legalName,
        url: SITE_URL,
        description: company.footerDescription || "Goal-based wealth planning and financial guidance for individuals and families.",
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo-mark.png"),
          width: 512,
          height: 512,
        },
        image: absoluteUrl("/opengraph-image.png"),
        slogan: company.positioning,
        email: company.email,
        telephone: company.phoneDisplay || company.phoneHref,
        areaServed: [
          { "@type": "Country", name: "India" },
          { "@type": "AdministrativeArea", name: "Maharashtra" },
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "1053, Eaze Zone Mall, Sundar Nagar, Goregaon (W)",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400062",
          addressCountry: "IN",
        },
        ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: company.phoneDisplay || company.phoneHref,
            email: company.email,
            areaServed: "IN",
          },
        ],
        knowsAbout: [
          "Goal-based financial planning",
          "Family wealth planning",
          "Retirement planning",
          "Financial protection planning",
          "NRI wealth planning",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: "GrowVest — Your Conscious Wealth Partner",
        description: "Goal-based wealth planning and educational financial guidance for individuals and families.",
        inLanguage: "en-IN",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollProgress />
      <SiteHeader socialLinks={socialLinks} settings={settings} navigation={navigation} />
      <main id="main-content" className="min-w-0 overflow-x-clip"><PageTransition>{children}</PageTransition></main>
      <SiteFooter socialLinks={socialLinks} settings={settings} navigation={navigation} />
      <MobileSiteNavigation socialLinks={socialLinks} settings={settings} navigation={navigation} />
      <InvestorPortalTransition defaultDestination={settings?.investorPortalUrl} />
      <CookieConsent />
      <DeferredWebsiteFeatures guideSettings={guideSettings} />
      <StructuredData id="growvest-organization-schema" data={structuredData} />
    </>
  );
}
