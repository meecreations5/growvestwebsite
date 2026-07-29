import "./globals.css";
import { Inter, Libre_Baskerville } from "next/font/google";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "./lib/seo";

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

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

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
  category: "Finance",
  referrer: "origin-when-cross-origin",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/growvest-icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
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
        googleBot: { index: false, follow: false, noimageindex: true },
      },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: "GrowVest | Your Conscious Wealth Partner",
    description: "Fulfill Your Bucket List. Experience the Wealth Every Moment.",
    url: SITE_URL,
    images: [{
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: "GrowVest — Your Conscious Wealth Partner",
    }],
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
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0F" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${libreBaskerville.variable}`}>
      <body>{children}</body>
    </html>
  );
}
