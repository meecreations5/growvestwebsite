import Link from "next/link";
import { COMPANY, GOLD } from "../lib/brand";
import { GrowVestLogo } from "./GrowVestLogo";
import { CookiePreferencesButton } from "./CookiePreferencesButton";
import { SocialLinks } from "./SocialLinks";

const FOOTER_COLS = [
  {
    heading: "Services",
    links: [
      { label: "Wealth Guidance", path: "/wealth-guidance" },
      { label: "Progress Reviews", path: "/progress-reviews" },
      { label: "The GrowVest Way", path: "/the-growvest-way" },
      { label: "How We Charge", path: "/how-we-charge" },
    ],
  },
  {
    heading: "Goals & Tools",
    links: [
      { label: "Your Goals", path: "/your-goals" },
      { label: "Goal Library", path: "/goal-library" },
      { label: "Bucket List Builder", path: "/bucket-list-builder" },
      { label: "Illustrative Journeys", path: "/client-stories" },
    ],
  },
  {
    heading: "Who We Help",
    links: [
      { label: "Families", path: "/family-wealth" },
      { label: "NRIs", path: "/for-nris" },
      { label: "Investor Experiences", path: "/investor-experiences" },
      { label: "Start Here", path: "/start-here" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About GrowVest", path: "/about" },
      { label: "Insights", path: "/insights" },
      { label: "FAQs", path: "/faqs" },
      { label: "Disclosures", path: "/disclosures" },
    ],
  },
];

export function SiteFooter({ socialLinks = [], settings = null, navigation = null }) {
  const company = { ...COMPANY, ...(settings || {}) };
  const sourceFooterColumns = navigation?.footerColumns?.length ? navigation.footerColumns : FOOTER_COLS;
  const footerColumns = sourceFooterColumns
    .map((column) => ({
      ...column,
      links: (column.links || [])
        .map((item) => ({ ...item, path: item.path || item.href || "" }))
        .filter((item) => item.label && item.path),
    }))
    .filter((column) => column.heading && column.links.length);
  const sourceLegalLinks = navigation?.legalLinks?.length ? navigation.legalLinks : [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Use", path: "/terms-of-use" },
    { label: "Risk Disclaimer", path: "/disclosures#risk" },
    { label: "Regulatory Status", path: "/disclosures#regulatory-status" },
    { label: "Grievances", path: "/disclosures#grievances" },
  ];
  const legalLinks = sourceLegalLinks
    .map((item) => ({ ...item, path: item.path || item.href || "" }))
    .filter((item) => item.label && item.path);
  return (
    <footer data-site-footer className="border-t border-white/10 bg-[#0B0B0F]">
      <div className="mx-auto max-w-[1320px] px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-14 sm:px-6 sm:pb-10 lg:px-8 lg:pt-20">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:mb-14 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Link href="/" className="mb-5 inline-flex" aria-label="GrowVest home">
              <GrowVestLogo className="gv-footer-wordmark" />
            </Link>

            <p className="mb-5 max-w-[320px] text-[13px] leading-relaxed text-white/70">
              {company.footerDescription || "Helping individuals and families connect their financial decisions with the life they truly want to experience."}
            </p>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
              {company.mission}
            </p>

            <div className="space-y-2 text-[12px] leading-relaxed text-white/65">
              <a href={`tel:${company.phoneHref}`} className="block hover:text-white">{company.phoneDisplay}</a>
              <a href={`mailto:${company.email}`} className="block hover:text-white">{company.email}</a>
              <address className="not-italic">
                {(company.addressLines || []).map((line) => <span className="block" key={line}>{line}</span>)}
              </address>
              <span className="block">{company.officeHours || "Meetings by appointment"}</span>
              <a href={company.investorPortalUrl} data-investor-portal="true" data-analytics-event="investor_portal_click" data-analytics-location="footer" className="inline-flex items-center gap-1 font-semibold text-[#F5B301] hover:text-[#FFD35A]">
                Investor Portal <span aria-hidden="true">↗</span>
              </a>
            </div>
            <SocialLinks links={socialLinks} location="footer" theme="dark" className="mt-5" />
          </div>

          {footerColumns.map(({ heading, links }) => (
            <div key={heading}>
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/65">{heading}</p>
              <ul className="space-y-3">
                {links.map(({ label, path }) => (
                  <li key={label}>
                    <Link href={path} className="text-[13px] leading-snug text-white/65 transition-colors hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-8 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}35, transparent)` }} />

        <div className="mb-6 max-w-[980px] space-y-2 text-[11px] leading-relaxed text-white/60">
          <p>
            {company.footerDisclosure1 || `${company.legalName} provides goal-based financial education and planning support. Website content is general and educational.`}
          </p>
          <p>
            {company.footerDisclosure2 || `${company.directAdvisoryFee}. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.`}
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map(({ label, path }) => (
              <Link key={label} href={path} className="text-[11px] text-white/60 transition-colors hover:text-white">
                {label}
              </Link>
            ))}
            <CookiePreferencesButton className="text-[11px] text-white/60 transition-colors hover:text-white" />
          </div>
          <p className="flex-shrink-0 text-[12px] text-white/60">© {new Date().getFullYear()} GrowVest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
