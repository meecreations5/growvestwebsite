const DEFAULT_SITE_URL = "https://growvest.info";

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return value.replace(/\/$/, "");
}

export const SITE_URL = getSiteUrl();
export const SITE_NAME = "GrowVest";
export const SITE_LANGUAGE = "en-IN";
export const DEFAULT_OG_IMAGE = "/opengraph-image.png";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const SEO_PAGES = {
  "/": {
    title: "Goal-Based Wealth Planning for Life Goals",
    description:
      "Connect your financial decisions with family security, meaningful goals and long-term progress through GrowVest's conscious wealth-planning approach.",
    priority: 1,
    changeFrequency: "weekly",
  },
  "/your-goals": {
    title: "Goal-Based Financial Planning for Life Goals",
    description:
      "Turn retirement, education, travel, home and family priorities into a structured financial roadmap with thoughtful goal-based planning.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/the-growvest-way": {
    title: "The GrowVest Way: A Structured Wealth Journey",
    description:
      "Explore GrowVest's disciplined process for understanding goals, building a financial roadmap and reviewing progress with clarity and accountability.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/wealth-guidance": {
    title: "Wealth Guidance for Goals, Protection and Progress",
    description:
      "Explore goal-linked wealth guidance covering planning, protection, diversification, cash flow and long-term financial progress.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/progress-reviews": {
    title: "Financial Progress Reviews and Goal Tracking",
    description:
      "Understand GrowVest's structured review framework for tracking goals, changing priorities, protection needs and financial progress over time.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/insights": {
    title: "Wealth Planning Insights and Financial Education",
    description:
      "Read practical GrowVest perspectives on financial planning, family wealth, protection, portfolio discipline and goal-led progress.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  "/about": {
    title: "About GrowVest and Our Conscious Wealth Philosophy",
    description:
      "Discover GrowVest's story, mission, values and human approach to helping individuals and families build purposeful financial journeys.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/client-stories": {
    title: "Illustrative Goal-Based Financial Journeys",
    description:
      "Explore educational, illustrative financial journeys showing how life goals can be organised into clearer planning priorities and milestones.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/investor-experiences": {
    title: "Investor Experiences with GrowVest",
    description:
      "Read genuine, consent-approved investor experiences about gaining clarity, structure and confidence across personal financial journeys.",
    priority: 0.72,
    changeFrequency: "monthly",
  },
  "/start-here": {
    title: "Start Your Financial Planning Journey",
    description:
      "Begin with a structured conversation about your responsibilities, priorities, life goals and the financial roadmap needed to support them.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/goal-library": {
    title: "Financial Goal Library for Life Planning",
    description:
      "Explore common financial goals including retirement, education, home, travel, protection and family security, with practical planning context.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/bucket-list-builder": {
    title: "Bucket List Builder for Life and Financial Goals",
    description:
      "Create a personal bucket list, organise the experiences that matter and connect your aspirations with an educational financial estimate.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/for-nris": {
    title: "NRI Wealth Planning for India-Linked Goals",
    description:
      "Explore goal-linked wealth guidance for NRIs managing family responsibilities, assets and long-term financial priorities connected to India.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/family-wealth": {
    title: "Family Wealth Planning and Financial Continuity",
    description:
      "Bring greater clarity to family protection, education, retirement, shared goals and long-term financial continuity through structured planning.",
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/how-we-charge": {
    title: "GrowVest Fees and Compensation Explained",
    description:
      "Understand GrowVest's current fee and compensation approach, including important disclosures to review before beginning your journey.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/disclosures": {
    title: "GrowVest Regulatory and Service Disclosures",
    description:
      "Review GrowVest's regulatory status, service context, compensation approach, investment-risk disclosures and communication information.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/contact": {
    title: "Contact GrowVest for a Discovery Conversation",
    description:
      "Connect with GrowVest in Mumbai or online across India to discuss your life goals, planning priorities and next steps in a financial roadmap.",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/faqs": {
    title: "GrowVest Frequently Asked Questions",
    description:
      "Find clear answers about GrowVest's planning approach, fees, certification, regulatory status, service process and investor journey.",
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/privacy-policy": {
    title: "GrowVest Privacy Policy",
    description:
      "Learn how GrowVest collects, uses, stores and protects information submitted through the website, forms and communication channels.",
    priority: 0.35,
    changeFrequency: "yearly",
  },
  "/terms-of-use": {
    title: "GrowVest Website Terms of Use",
    description:
      "Read the terms that apply when accessing and using the GrowVest website, educational content, tools, forms and communication features.",
    priority: 0.35,
    changeFrequency: "yearly",
  },
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function normalizeSeoImage(image = DEFAULT_OG_IMAGE) {
  return absoluteUrl(image || DEFAULT_OG_IMAGE);
}

export function createPageMetadata(path, overrides = {}) {
  const page = SEO_PAGES[path] || {};
  const title = overrides.title || page.title || SITE_NAME;
  const description = overrides.description || page.description || "GrowVest — Your Conscious Wealth Partner.";
  const canonical = overrides.canonicalUrl || absoluteUrl(path);
  const image = normalizeSeoImage(overrides.image || DEFAULT_OG_IMAGE);
  const titleIncludesBrand = new RegExp(`\\b${SITE_NAME}\\b`, "i").test(title);
  const fullTitle = titleIncludesBrand ? title : path === "/" ? `${SITE_NAME} | ${title}` : `${title} | ${SITE_NAME}`;
  const metadataTitle = titleIncludesBrand || path === "/" ? { absolute: fullTitle } : title;
  const allowIndexing = overrides.allowIndexing !== false;

  return {
    title: metadataTitle,
    description,
    category: "Finance",
    alternates: {
      canonical,
      ...(overrides.rssUrl ? { types: { "application/rss+xml": absoluteUrl(overrides.rssUrl) } } : {}),
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
          googleBot: { index: false, follow: false, noimageindex: true },
        },
    openGraph: {
      type: overrides.type || "website",
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
      images: [{ url: image, alt: overrides.imageAlt || "GrowVest — Your Conscious Wealth Partner" }],
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

export function createWebPageSchema({
  path,
  name,
  description,
  type = "WebPage",
  datePublished,
  dateModified,
  primaryImage,
} = {}) {
  const url = absoluteUrl(path || "/");
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(primaryImage ? { primaryImageOfPage: { "@type": "ImageObject", url: normalizeSeoImage(primaryImage) } } : {}),
  };
}

export function createFaqPageSchema(items = []) {
  const questions = items
    .filter((item) => item?.question && item?.answer)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (!questions.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/faqs")}#faqpage`,
    url: absoluteUrl("/faqs"),
    name: SEO_PAGES["/faqs"].title,
    inLanguage: SITE_LANGUAGE,
    mainEntity: questions,
  };
}

export function createItemListSchema({ path, name, items = [] } = {}) {
  const validItems = items.filter((item) => item?.name);
  if (!validItems.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl(path)}#itemlist`,
    name,
    numberOfItems: validItems.length,
    itemListElement: validItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { url: absoluteUrl(item.url) } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}
