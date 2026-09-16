import { COMPANY, NAV_GROUPS } from "../lib/brand";
import { FAQS } from "./faqs";

export const WEBSITE_PAGE_STATUSES = ["draft", "published", "archived"];

export const WEBSITE_PAGE_DEFAULTS = {
  home: {
    pageKey: "home",
    title: "Homepage",
    status: "published",
    seo: {
      title: "GrowVest | Your Conscious Wealth Partner",
      description: "Connect your financial decisions with the life you truly want to experience through purposeful, goal-based planning.",
      allowIndexing: true,
    },
    content: {
      hero: {
        eyebrow: COMPANY.positioning,
        headlineTop: "Your Bucket List",
        headlineAccent: "Deserves",
        headlineBottom: "a Financial Roadmap.",
        description: "GrowVest helps individuals and families protect what matters today and grow toward what is possible tomorrow through human understanding, disciplined planning and thoughtful financial guidance.",
        primaryCtaLabel: "Begin Your Journey",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Explore Your Goals",
        secondaryCtaHref: "/your-goals",
        footerLine: COMPANY.vision,
      },
      trust: {
        items: [
          { value: COMPANY.clientsSupported, label: "Clients Supported" },
          { value: COMPANY.reviewsCompleted, label: "Structured Reviews" },
          { value: COMPANY.coverage, label: "Service Coverage" },
          { value: "NISM-Series-V-A", label: "Certified Professional Support" },
          { value: "₹0", label: "Direct Advisory Fee Currently Charged" },
        ],
        disclosure: "GrowVest is not registered with SEBI as an Investment Adviser. Certification and compensation details are explained transparently.",
        disclosureLinkLabel: "How GrowVest works",
        disclosureLinkHref: "/how-we-charge",
      },
      brandBelief: {
        eyebrow: "Our Belief",
        headingLine1: "We Do Not Start",
        headingLine2: "With Investments.",
        headingLine3: "We Start With",
        headingAccent: "Your Life.",
        paragraphs: [
          "Before any financial direction, GrowVest understands your responsibilities, aspirations, family priorities, risk comfort and future milestones.",
          "Then we turn those goals into a structured financial roadmap—built with clarity, reviewed with discipline and guided with care.",
        ],
      },
      visionMission: {
        visionLabel: "Our Vision",
        visionTitle: COMPANY.vision,
        visionCopy: "To create a future where people experience wealth not only as financial growth, but also as confidence, freedom, peace of mind and meaningful life opportunities every day.",
        missionLabel: "Our Mission",
        missionTitle: COMPANY.mission,
        missionCopy: "To help individuals and families transform their life aspirations into structured financial journeys through disciplined planning, intelligent decision-making and trusted guidance.",
      },
      finalCta: {
        eyebrow: "Begin Your Journey",
        headingTop: "Start With a",
        headingAccent: "Conversation.",
        description: "Your financial journey does not need to begin with confusion. Share your goals with GrowVest, and we will help you see the next right step with clarity.",
        primaryCtaLabel: "Begin Your Journey",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Explore Your Goals",
        secondaryCtaHref: "/your-goals",
      },
    },
  },
  about: {
    pageKey: "about",
    title: "About GrowVest",
    status: "published",
    seo: {
      title: "About GrowVest | Your Conscious Wealth Partner",
      description: "Discover GrowVest's brand story, mission, vision and human approach to purposeful wealth journeys.",
      allowIndexing: true,
    },
    content: {
      hero: {
        eyebrow: "About GrowVest",
        positioning: COMPANY.positioning,
        headingTop: "Wealth Is More Than Money.",
        headingAccent: "It Is a Life Well Lived.",
        description: "GrowVest exists to make wealth creation feel more human, purposeful and connected to the experiences, security and freedom people truly value.",
        primaryCtaLabel: "Begin Your Journey",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Explore the GrowVest Way",
        secondaryCtaHref: "/the-growvest-way",
      },
      brandStory: {
        eyebrow: "Our Brand Story",
        heading: "Created to Make Wealth Feel More Human.",
        paragraphs: [
          "At GrowVest, we believe wealth is more than numbers, returns or investments.",
          "It is the confidence of knowing your family is secure. It is the freedom to live life on your terms. It is the ability to turn dreams into meaningful experiences.",
          "Every financial decision carries a personal story behind it—a child's future, a dream home, retirement freedom, travel aspirations or the peace of knowing tomorrow is protected.",
          "Yet, for many people, finance often feels complicated, overwhelming and disconnected from real life. GrowVest was created to change that.",
          "We built GrowVest with a simple intention: to make wealth creation feel more human, more purposeful and more aligned with the life people truly want to build.",
          "By combining disciplined goal-based planning, intelligent technology and long-term perspective, we help individuals and families move forward with greater clarity and confidence.",
          "We do not believe in transactional relationships. We believe in guiding people through every stage of their financial journey with understanding, transparency and responsibility.",
          "Because true wealth is not only about growing money. It is about creating a life filled with security, freedom, meaningful experiences and possibilities.",
        ],
      },
      visionMission: {
        visionTitle: COMPANY.vision,
        visionCopy: "To create a future where people experience wealth not only as financial growth, but also as confidence, freedom, peace of mind and meaningful life opportunities every day.",
        missionTitle: COMPANY.mission,
        missionCopy: "To help individuals and families transform their life aspirations into structured financial journeys through disciplined planning, intelligent decision-making and trusted guidance.",
      },
      values: {
        eyebrow: "What We Stand For",
        heading: "The Principles Behind Every Journey.",
        items: [
          { title: "Human Understanding", copy: "Every financial decision carries a personal story. We begin by understanding the life behind the numbers.", iconKey: "heart" },
          { title: "Purpose Before Products", copy: "Goals, priorities and timelines come first. Financial choices should support the life you want to build.", iconKey: "target" },
          { title: "Clarity and Responsibility", copy: "We communicate openly, document important decisions and encourage disciplined, risk-aware progress.", iconKey: "shield" },
          { title: "Long-Term Partnership", copy: "We believe meaningful wealth journeys are built through consistency, review and trusted relationships.", iconKey: "compass" },
        ],
      },
      teamSection: {
        eyebrow: "The People Behind Your Wealth Journey",
        heading: "A Thoughtful Team. One Shared Responsibility.",
        description: "Meet the people committed to bringing clarity, discipline, transparency and human understanding to every GrowVest relationship.",
      },
      finalCta: {
        headingTop: "Protect What Matters Today.",
        headingAccent: "Grow Toward Tomorrow.",
        description: "Begin with a conversation about your goals, priorities and the life you want your financial journey to support.",
        ctaLabel: "Begin Your Journey",
        ctaHref: "/contact",
      },
    },
  },
};

export const WEBSITE_SETTINGS_DEFAULT = {
  key: "global",
  status: "published",
  brandName: COMPANY.brandName,
  legalName: COMPANY.legalName,
  positioning: COMPANY.positioning,
  mission: COMPANY.mission,
  vision: COMPANY.vision,
  phoneDisplay: COMPANY.phoneDisplay,
  phoneHref: COMPANY.phoneHref,
  email: COMPANY.email,
  addressLines: COMPANY.addressLines,
  officeHours: "Meetings by appointment",
  clientsSupported: COMPANY.clientsSupported,
  reviewsCompleted: COMPANY.reviewsCompleted,
  coverage: COMPANY.coverage,
  regulatoryLabel: COMPANY.regulatoryLabel,
  sebiStatus: COMPANY.sebiStatus,
  directAdvisoryFee: COMPANY.directAdvisoryFee,
  investorPortalUrl: COMPANY.investorPortalUrl,
  footerDescription: "Helping individuals and families connect their financial decisions with the life they truly want to experience.",
  footerDisclosure1: `${COMPANY.legalName} provides goal-based financial education and planning support. A member of the GrowVest team holds a valid NISM-Series-V-A Mutual Fund Distributors Certification. GrowVest is not registered with SEBI as an Investment Adviser. Website content is general and educational and should not be treated as personalised securities or investment advice.`,
  footerDisclosure2: `${COMPANY.directAdvisoryFee}. Where any distribution, referral, platform or partner compensation applies, the relevant arrangement should be disclosed before the client proceeds. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.`,
};

export const WEBSITE_NAVIGATION_DEFAULT = {
  key: "primary",
  status: "published",
  homeLabel: "Home",
  groups: NAV_GROUPS.map((group, index) => ({ ...group, displayOrder: index })),
  headerPrimaryCta: { label: "Begin Your Journey", href: "/contact" },
  investorPortalLabel: "Investor Portal",
  footerColumns: [
    { heading: "Services", links: [
      { label: "Wealth Guidance", path: "/wealth-guidance" },
      { label: "Progress Reviews", path: "/progress-reviews" },
      { label: "The GrowVest Way", path: "/the-growvest-way" },
      { label: "How We Charge", path: "/how-we-charge" },
    ] },
    { heading: "Goals & Tools", links: [
      { label: "Your Goals", path: "/your-goals" },
      { label: "Goal Library", path: "/goal-library" },
      { label: "Bucket List Builder", path: "/bucket-list-builder" },
      { label: "Illustrative Journeys", path: "/client-stories" },
    ] },
    { heading: "Who We Help", links: [
      { label: "Families", path: "/family-wealth" },
      { label: "NRIs", path: "/for-nris" },
      { label: "Investor Experiences", path: "/investor-experiences" },
      { label: "Start Here", path: "/start-here" },
      { label: "Contact", path: "/contact" },
    ] },
    { heading: "Company", links: [
      { label: "About GrowVest", path: "/about" },
      { label: "Insights", path: "/insights" },
      { label: "FAQs", path: "/faqs" },
      { label: "Disclosures", path: "/disclosures" },
    ] },
  ],
  legalLinks: [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Use", path: "/terms-of-use" },
    { label: "Risk Disclaimer", path: "/disclosures#risk" },
    { label: "Regulatory Status", path: "/disclosures#regulatory-status" },
    { label: "Grievances", path: "/disclosures#grievances" },
  ],
};

export const FAQ_SEED = FAQS.map((item, index) => ({
  question: item.q,
  answer: item.a,
  category: item.category,
  displayOrder: index,
  status: "published",
  isVisible: true,
}));

export const GOAL_LIBRARY_SEED = [
  {
    label: "Child Education", iconKey: "graduation-cap", color: "#8B5CF6", horizon: "8–18 years", typical: "₹25L – ₹1.2Cr", monthlySip: "₹8,000 – ₹35,000",
    description: "Education costs can rise meaningfully over time. A dedicated goal plan helps families connect future education aspirations with a clear timeline and review process.",
    why: "Starting early and keeping the goal separate from general savings can improve visibility, discipline and decision-making.",
    keySteps: ["Estimate the target corpus using the chosen institution and timeline", "Create a dedicated goal-linked contribution plan", "Review progress annually against updated cost estimates", "Reduce risk progressively as the goal date approaches"],
    watchOuts: ["Mixing education savings with general-purpose money", "Ignoring living, technology and coaching expenses", "Treating market-linked estimates as guaranteed outcomes"],
  },
  {
    label: "Dream Home", iconKey: "home", color: "#1F4ED8", horizon: "3–8 years", typical: "₹20L – ₹1.5Cr (down payment)", monthlySip: "₹15,000 – ₹60,000",
    description: "A home goal can include the down payment, transaction expenses, furnishing and an EMI safety reserve.",
    why: "Planning the complete cost—not only the property price—creates a more realistic and responsible roadmap.",
    keySteps: ["Define the property budget and down-payment target", "Add stamp duty, registration and furnishing costs", "Choose an accumulation approach suited to the time horizon", "Build a separate EMI safety reserve"],
    watchOuts: ["Using volatile assets for a very short timeline", "Ignoring post-purchase cash-flow pressure", "Allowing the home goal to displace essential protection goals"],
  },
  {
    label: "Retirement", iconKey: "star", color: "#10B981", horizon: "15–30 years", typical: "₹1.5Cr – ₹10Cr+", monthlySip: "₹10,000 – ₹80,000",
    description: "Retirement planning connects future lifestyle needs with a long-term accumulation and income strategy.",
    why: "Starting earlier generally provides more time for disciplined contributions and periodic course correction.",
    keySteps: ["Define the desired retirement age and lifestyle", "Estimate inflation-adjusted future expenses", "Review contributions and asset mix regularly", "Plan the transition from accumulation to income"],
    watchOuts: ["Using retirement money for unrelated goals", "Ignoring healthcare and longevity", "Assuming a fixed return without reviewing risk"],
  },
  {
    label: "Family Protection", iconKey: "shield", color: "#E53935", horizon: "Active / Ongoing", typical: "₹50L – ₹5Cr (cover)", monthlySip: "₹1,500 – ₹8,000 (premium)",
    description: "Protection planning helps preserve family priorities when an unexpected event affects income or responsibilities.",
    why: "Appropriate protection can prevent other goals from collapsing during a difficult period.",
    keySteps: ["Estimate income replacement and outstanding liabilities", "Review existing protection and exclusions", "Keep emergency savings separate from long-term goals", "Revisit protection after major life changes"],
    watchOuts: ["Using investment-return promises as a substitute for adequate protection", "Ignoring loan obligations", "Failing to update nominees and documents"],
  },
  {
    label: "Travel & Experiences", iconKey: "plane", color: "#EC4899", horizon: "1–5 years", typical: "₹3L – ₹25L", monthlySip: "₹5,000 – ₹20,000",
    description: "A dedicated experience fund helps turn meaningful travel aspirations into planned, affordable milestones.",
    why: "Ring-fencing the goal can prevent it from being repeatedly postponed or funded through debt.",
    keySteps: ["Define the destination, year and estimated cost", "Choose an approach suitable for the short timeline", "Keep travel savings separate from emergency funds", "Review the estimate for inflation and currency changes"],
    watchOuts: ["Using high-cost debt", "Keeping the goal vague", "Using emergency reserves for discretionary travel"],
  },
  {
    label: "Wealth & Legacy", iconKey: "trending-up", color: "#F5B301", horizon: "20–40 years", typical: "₹2Cr – ₹20Cr+", monthlySip: "₹20,000+",
    description: "Legacy planning can combine long-term wealth creation with nomination, succession and family communication.",
    why: "A clear structure helps families preserve intent and reduce avoidable confusion across generations.",
    keySteps: ["Define the purpose of the legacy corpus", "Review nominations and ownership", "Create or review a will with a qualified professional", "Revisit the plan after major family changes"],
    watchOuts: ["Treating legacy as whatever remains", "Missing or outdated nominations", "Making legal or tax assumptions without professional advice"],
  },
  {
    label: "Health & Care", iconKey: "heart", color: "#F97316", horizon: "Active / Ongoing", typical: "₹15L – ₹1Cr+ (corpus)", monthlySip: "₹5,000 – ₹15,000",
    description: "A health-care reserve can support costs that are not fully covered by insurance and reduce pressure on other goals.",
    why: "Health needs can arise unexpectedly and may affect both expenses and income continuity.",
    keySteps: ["Review health insurance adequacy", "Understand exclusions and waiting periods", "Build a liquid health-care reserve", "Review cover after family or employment changes"],
    watchOuts: ["Relying only on employer cover", "Assuming all treatment costs are covered", "Ignoring recovery-period income needs"],
  },
  {
    label: "NRI & Global Goals", iconKey: "globe", color: "#14B8A6", horizon: "Varies", typical: "Varies", monthlySip: "Varies",
    description: "NRI families may need to coordinate India-linked goals with currency, account, tax and regulatory considerations.",
    why: "A connected roadmap can clarify which goals are funded in India and where specialist advice is required.",
    keySteps: ["Map India-linked and global goals separately", "Review account and repatriation requirements", "Consider currency movement in estimates", "Coordinate tax and legal questions with qualified professionals"],
    watchOuts: ["Mixing resident and non-resident assumptions", "Missing KYC or account-status updates", "Treating general content as cross-border tax or legal advice"],
  },
].map((item, index) => ({ ...item, displayOrder: index, status: "published", isVisible: true }));
