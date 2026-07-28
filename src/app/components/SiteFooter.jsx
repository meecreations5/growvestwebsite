import Link from "next/link";
import { COMPANY, GOLD } from "../lib/brand";
import { GrowVestLogo } from "./GrowVestLogo";
import { CookiePreferencesButton } from "./CookiePreferencesButton";

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

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0B0F]">
      <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="mb-14 grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="mb-5 inline-flex" aria-label="GrowVest home">
              <GrowVestLogo className="gv-footer-wordmark" />
            </Link>

            <p className="mb-5 max-w-[320px] text-[13px] leading-relaxed text-white/70">
              Helping individuals and families connect their financial decisions with the life they truly want to experience.
            </p>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
              {COMPANY.mission}
            </p>

            <div className="space-y-2 text-[12px] leading-relaxed text-white/65">
              <a href={`tel:${COMPANY.phoneHref}`} className="block hover:text-white">{COMPANY.phoneDisplay}</a>
              <a href={`mailto:${COMPANY.email}`} className="block hover:text-white">{COMPANY.email}</a>
              <address className="not-italic">
                {COMPANY.addressLines.map((line) => <span className="block" key={line}>{line}</span>)}
              </address>
              <span className="block">Meetings by appointment</span>
              <a href={COMPANY.investorPortalUrl} data-investor-portal="true" data-analytics-event="investor_portal_click" data-analytics-location="footer" className="inline-flex items-center gap-1 font-semibold text-[#F5B301] hover:text-[#FFD35A]">
                Investor Portal <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {FOOTER_COLS.map(({ heading, links }) => (
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
            {COMPANY.legalName} provides goal-based financial education and planning support. A member of the GrowVest team holds a valid NISM-Series-V-A Mutual Fund Distributors Certification. GrowVest is not registered with SEBI as an Investment Adviser. Website content is general and educational and should not be treated as personalised securities or investment advice.
          </p>
          <p>
            {COMPANY.directAdvisoryFee}. Where any distribution, referral, platform or partner compensation applies, the relevant arrangement should be disclosed before the client proceeds. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Privacy Policy", path: "/privacy-policy" },
              { label: "Terms of Use", path: "/terms-of-use" },
              { label: "Risk Disclaimer", path: "/disclosures#risk" },
              { label: "Regulatory Status", path: "/disclosures#regulatory-status" },
              { label: "Grievances", path: "/disclosures#grievances" },
            ].map(({ label, path }) => (
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
