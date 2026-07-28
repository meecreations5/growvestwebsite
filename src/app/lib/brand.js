export const BLUE = "#1F4ED8";
export const CYAN = BLUE; // Backward-compatible alias; official brand accent is Primary Blue.
export const BLACK = "#0B0B0F";
export const GOLD = "#F5B301";
export const WHITE = "#FFFFFF";
export const GRAY = "#F4F6F9";
export const MGRAY = "#6B7280";
export const RED = "#E53935";

export const serif = { fontFamily: "var(--font-libre-baskerville), Georgia, serif" };

export const dotGrid = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.038) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

export const COMPANY = {
  brandName: "GrowVest",
  legalName: "Growvest Advisors PVT LTD",
  positioning: "Your Conscious Wealth Partner",
  mission: "Fulfill Your Bucket List.",
  vision: "Experience the Wealth Every Moment.",
  regulatoryLabel: "A team member holds a valid NISM-Series-V-A Mutual Fund Distributors Certification",
  sebiStatus: "Not registered with SEBI as an Investment Adviser",
  phoneDisplay: "+91 86557 68940",
  phoneHref: "+918655768940",
  email: "connect@growvest.info",
  addressLines: [
    "1053, Eaze Zone Mall, Sundar Nagar,",
    "Goregaon (W), Mumbai - 400062",
  ],
  clientsSupported: "70+",
  reviewsCompleted: "15+",
  coverage: "Pan India",
  directAdvisoryFee: "No direct advisory fee currently charged",
  investorPortalUrl: process.env.NEXT_PUBLIC_INVESTOR_PORTAL_URL || "https://insights.growvest.info/investor-login",
};

export const NAV_GROUPS = [
  {
    label: "Your Goals",
    eyebrow: "Shape what matters",
    children: [
      { label: "Goal Map", path: "/your-goals" },
      { label: "Bucket List", path: "/goal-library" },
      { label: "Bucket List Builder", path: "/bucket-list-builder" },
    ],
  },
  {
    label: "Our Approach",
    eyebrow: "Grow with clarity",
    children: [
      { label: "The GrowVest Way", path: "/the-growvest-way" },
      { label: "Wealth Guidance", path: "/wealth-guidance" },
      { label: "Progress Reviews", path: "/progress-reviews" },
    ],
  },
  {
    label: "Who We Help",
    eyebrow: "Guidance around your life",
    children: [
      { label: "Families", path: "/family-wealth" },
      { label: "NRIs", path: "/for-nris" },
      { label: "Client Journeys", path: "/client-stories" },
    ],
  },
  {
    label: "Insights",
    eyebrow: "Understand with confidence",
    children: [
      { label: "Wealth Insights", path: "/insights" },
      { label: "FAQs", path: "/faqs" },
    ],
  },
  {
    label: "About",
    eyebrow: "Know GrowVest",
    children: [
      { label: "Our Story", path: "/about" },
      { label: "How We Earn", path: "/how-we-charge" },
      { label: "Disclosures", path: "/disclosures" },
      { label: "Contact", path: "/contact" },
    ],
  },
];

export const NAV = [
  { label: "Home", path: "/" },
  { label: "Your Goals", path: "/your-goals" },
  { label: "The GrowVest Way", path: "/the-growvest-way" },
  { label: "Wealth Guidance", path: "/wealth-guidance" },
  { label: "Progress Reviews", path: "/progress-reviews" },
  { label: "Insights", path: "/insights" },
  { label: "About Us", path: "/about" },
  { label: "Illustrative Journeys", path: "/client-stories" },
  { label: "Start Here", path: "/start-here" },
  { label: "Goal Library", path: "/goal-library" },
  { label: "Bucket List Builder", path: "/bucket-list-builder" },
  { label: "For NRIs", path: "/for-nris" },
  { label: "Family Wealth", path: "/family-wealth" },
  { label: "How We Charge", path: "/how-we-charge" },
  { label: "Disclosures", path: "/disclosures" },
  { label: "Contact", path: "/contact" },
  { label: "FAQs", path: "/faqs" },
];
