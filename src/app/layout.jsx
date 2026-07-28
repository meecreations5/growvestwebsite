import "./globals.css";
import { Inter, Libre_Baskerville } from "next/font/google";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { SiteMotionEffects } from "./components/SiteMotionEffects";
import { PageTransition } from "./components/PageTransition";
import { SiteAnalytics } from "./components/SiteAnalytics";
import { ScrollProgress } from "./components/ScrollProgress";
import { InvestorPortalTransition } from "./components/InvestorPortalTransition";
import { MobileActionBar } from "./components/MobileActionBar";
import { CookieConsent } from "./components/CookieConsent";
import { StructuredData } from "./components/StructuredData";
import { COMPANY } from "./lib/brand";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "./lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-libre-baskerville",
});

const allowIndexing =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const verification = {};
if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
  verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
}
if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
  verification.other = {
    "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  };
}

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GrowVest | Your Conscious Wealth Partner",
    template: "%s | GrowVest",
  },
  description:
    "GrowVest helps individuals and families connect financial decisions with security, freedom and meaningful life goals through conscious wealth guidance.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "finance",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  robots: allowIndexing
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: "GrowVest | Your Conscious Wealth Partner",
    description: "Fulfill Your Bucket List. Experience the Wealth Every Moment.",
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "GrowVest — Your Conscious Wealth Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrowVest | Your Conscious Wealth Partner",
    description: "Fulfill Your Bucket List. Experience the Wealth Every Moment.",
    images: [DEFAULT_OG_IMAGE],
  },
  ...(Object.keys(verification).length ? { verification } : {}),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0F" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: COMPANY.brandName,
        legalName: COMPANY.legalName,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo-mark.png"),
          width: 512,
          height: 512,
        },
        slogan: COMPANY.positioning,
        email: COMPANY.email,
        telephone: COMPANY.phoneHref,
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: "1053, Eaze Zone Mall, Sundar Nagar, Goregaon (W)",
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400062",
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: COMPANY.phoneHref,
          email: COMPANY.email,
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
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  return (
    <html lang="en-IN" className={`${inter.variable} ${libreBaskerville.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ScrollProgress />
        <SiteHeader />
        <main id="main-content"><PageTransition>{children}</PageTransition></main>
        <SiteFooter />
        <MobileActionBar />
        <InvestorPortalTransition />
        <SiteMotionEffects />
        <CookieConsent />
        <SiteAnalytics />
        <StructuredData id="growvest-organization-schema" data={structuredData} />
      </body>
    </html>
  );
}
