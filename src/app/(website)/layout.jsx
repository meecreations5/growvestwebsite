import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { SiteMotionEffects } from "../components/SiteMotionEffects";
import { PageTransition } from "../components/PageTransition";
import { SiteAnalytics } from "../components/SiteAnalytics";
import { ScrollProgress } from "../components/ScrollProgress";
import { InvestorPortalTransition } from "../components/InvestorPortalTransition";
import { MobileActionBar } from "../components/MobileActionBar";
import { CookieConsent } from "../components/CookieConsent";
import { StructuredData } from "../components/StructuredData";
import { COMPANY } from "../lib/brand";
import { SITE_NAME, SITE_URL, absoluteUrl } from "../lib/seo";
import { getPublishedSocialLinks } from "../lib/server/teamSocialRepository";
import { getPublishedWebsiteNavigation, getPublishedWebsiteSettings } from "../lib/server/websiteContentRepository";
import { getGuideSettings } from "../lib/server/growvestGuideRepository";
import { GrowVestGuide } from "../components/GrowVestGuide";

export default async function WebsiteLayout({ children }) {
  const [socialLinks, settings, navigation, guideSettings] = await Promise.all([
    getPublishedSocialLinks(),
    getPublishedWebsiteSettings(),
    getPublishedWebsiteNavigation(),
    getGuideSettings({ publicOnly: true }),
  ]);
  const company = { ...COMPANY, ...(settings || {}) };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: company.brandName,
        legalName: company.legalName,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo-mark.png"),
          width: 512,
          height: 512,
        },
        slogan: company.positioning,
        email: company.email,
        telephone: company.phoneHref,
        areaServed: { "@type": "Country", name: "India" },
        address: {
          "@type": "PostalAddress",
          streetAddress: "1053, Eaze Zone Mall, Sundar Nagar, Goregaon (W)",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400062",
          addressCountry: "IN",
        },
        sameAs: socialLinks.map((item) => item.url),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: company.phoneHref,
          email: company.email,
          areaServed: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: "Your Conscious Wealth Partner",
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
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
      <MobileActionBar investorPortalUrl={settings?.investorPortalUrl} primaryCta={navigation?.headerPrimaryCta} />
      <InvestorPortalTransition defaultDestination={settings?.investorPortalUrl} />
      <SiteMotionEffects />
      <GrowVestGuide settings={guideSettings} />
      <CookieConsent />
      <SiteAnalytics />
      <StructuredData id="growvest-organization-schema" data={structuredData} />
    </>
  );
}
