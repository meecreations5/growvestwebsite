const DEFAULT_SITE_URL = "https://growvest.info";

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return value.replace(/\/$/, "");
}

export const SITE_URL = getSiteUrl();
export const SITE_NAME = "GrowVest";
export const DEFAULT_OG_IMAGE = "/opengraph-image.png";

export const SEO_PAGES = {
  "/": {
    title: "Your Conscious Wealth Partner",
    description:
      "Your bucket list deserves a financial roadmap. Discover conscious, goal-based wealth guidance with GrowVest.",
    priority: 1,
    changeFrequency: "weekly",
  },
  "/your-goals": {
    title: "Your Goals",
    description: "Turn important life goals into a structured financial roadmap with GrowVest.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/the-growvest-way": {
    title: "The GrowVest Way",
    description: "Explore GrowVest's disciplined, transparent and goal-linked guidance process.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/wealth-guidance": {
    title: "Wealth Guidance",
    description: "Structured wealth guidance linked to your goals, protection needs and financial progress.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/progress-reviews": {
    title: "Progress Reviews",
    description: "Understand GrowVest's structured progress-review framework and stay connected to your goals.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/insights": {
    title: "Wealth Insights",
    description: "Practical perspectives on financial planning, wealth strategy and goal-led progress.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  "/about": {
    title: "About GrowVest",
    description: "Discover GrowVest's brand story, mission, vision and conscious wealth philosophy.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/client-stories": {
    title: "Illustrative Journeys",
    description: "Explore illustrative financial journeys and goal-led planning experiences.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/start-here": {
    title: "Start Here",
    description: "Begin your GrowVest journey with a clear and structured planning conversation.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/goal-library": {
    title: "Goal Library",
    description: "Explore common life goals and begin shaping your personal financial roadmap.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/bucket-list-builder": {
    title: "Bucket List Builder",
    description: "Create a personal bucket list and connect your aspirations to an educational financial estimate.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/for-nris": {
    title: "NRI Wealth Guidance",
    description: "Goal-linked wealth guidance for NRIs managing financial priorities connected to India.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/family-wealth": {
    title: "Family Wealth",
    description: "Build clarity, protection and continuity across your family's wealth journey.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/how-we-charge": {
    title: "How GrowVest Is Compensated",
    description: "Understand GrowVest's current fee and compensation approach before you proceed.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/disclosures": {
    title: "Important Disclosures",
    description: "Review GrowVest's regulatory status, service context, fee approach, risks and communication channels.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/contact": {
    title: "Contact GrowVest",
    description: "Request a discovery conversation with GrowVest about your goals and financial roadmap.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/faqs": {
    title: "Frequently Asked Questions",
    description: "Clear answers about GrowVest, goal planning, fees, certification and the guidance journey.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Learn how GrowVest collects, uses, stores and protects information submitted through this website.",
    priority: 0.35,
    changeFrequency: "yearly",
  },
  "/terms-of-use": {
    title: "Terms of Use",
    description: "Read the terms that apply when accessing and using the GrowVest website, content, tools and forms.",
    priority: 0.35,
    changeFrequency: "yearly",
  },
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

export function createPageMetadata(path, overrides = {}) {
  const page = SEO_PAGES[path] || {};
  const title = overrides.title || page.title || SITE_NAME;
  const description = overrides.description || page.description || "GrowVest — Your Conscious Wealth Partner.";
  const canonical = absoluteUrl(path);
  const image = overrides.image || DEFAULT_OG_IMAGE;
  const fullTitle = path === "/" ? `${SITE_NAME} | ${title}` : `${title} | ${SITE_NAME}`;

  return {
    title: path === "/" ? { absolute: fullTitle } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: canonical,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: overrides.imageAlt || "GrowVest — Your Conscious Wealth Partner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export function createBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
