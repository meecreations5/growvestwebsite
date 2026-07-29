import Link from "next/link";
import { AlertTriangle, ArrowRight, BadgeCheck, Building2, CircleDollarSign, FileText, LockKeyhole, MessageSquareWarning, Scale, ShieldAlert } from "lucide-react";
import { BLACK, BLUE, GOLD, GRAY, MGRAY, COMPANY, serif, dotGrid } from "../lib/brand";

const SECTIONS = [
  {
    id: "regulatory-status",
    Icon: BadgeCheck,
    title: "Regulatory Status",
    points: [
      `${COMPANY.legalName} is not registered with the Securities and Exchange Board of India as an Investment Adviser.`,
      "A member of the GrowVest team holds a valid NISM-Series-V-A Mutual Fund Distributors Certification. This is different from SEBI Investment Adviser registration and does not by itself establish an AMFI ARN or EUIN for GrowVest.",
      "Nothing on this website should be interpreted as a claim that GrowVest is a SEBI-registered Investment Adviser, Portfolio Manager, Research Analyst or stock broker.",
    ],
  },
  {
    id: "nature-of-service",
    Icon: FileText,
    title: "Nature of Website Information and Services",
    points: [
      "Website content is general, educational and intended to help users think more clearly about goals, priorities, financial habits and long-term planning.",
      "General mutual fund education may be supported by a NISM-Series-V-A certified team member. Any distribution or transaction service should be provided only through an appropriately registered and disclosed arrangement and not as personalised securities advice from a SEBI-registered Investment Adviser.",
      "Users should consider their own circumstances and consult an appropriately registered professional where regulated investment advice, tax advice or legal advice is required.",
    ],
  },
  {
    id: "fees-and-compensation",
    Icon: CircleDollarSign,
    title: "Fees and Compensation",
    points: [
      "GrowVest currently does not charge clients a separate direct advisory fee.",
      "Mutual fund schemes, platforms and third-party service providers may levy their own expenses, charges or taxes.",
      "Where any distribution commission, referral arrangement, platform relationship, partner compensation or other commercial benefit applies, the relevant relationship should be disclosed before the client proceeds.",
    ],
  },
  {
    id: "conflicts",
    Icon: Scale,
    title: "Conflicts of Interest",
    points: [
      "A distribution or referral relationship can create a potential conflict of interest because compensation may be connected to a product, platform or service provider.",
      "GrowVest aims to communicate material commercial relationships transparently and encourages clients to ask how GrowVest or any partner may be compensated.",
      "No website statement should be interpreted as a guarantee that no conflict exists unless the specific arrangement has been reviewed and disclosed in writing.",
    ],
  },
  {
    id: "risk",
    Icon: ShieldAlert,
    title: "Investment and Market Risk",
    points: [
      "Mutual fund and securities investments are subject to market risks. Read all scheme-related and offer documents carefully before investing.",
      "Past performance does not guarantee future performance. Returns, capital values, income and goal outcomes may rise or fall.",
      "Illustrations, calculators, assumed returns and goal estimates on this website are educational estimates and not promises, forecasts or guarantees.",
    ],
  },
  {
    id: "privacy",
    Icon: LockKeyhole,
    title: "Privacy and Data",
    points: [
      "Information submitted through website forms should be used only to respond to the user's request, provide relevant communication and maintain necessary business records.",
      "Users should not submit passwords, OTPs, card details, trading credentials or other highly sensitive account-access information through the website.",
      "Third-party email, CRM, calendar or communication providers may process data when those services are enabled. Their terms and privacy practices may also apply.",
    ],
  },
  {
    id: "terms",
    Icon: AlertTriangle,
    title: "Website Terms",
    points: [
      "Website content may be changed, corrected or withdrawn without prior notice.",
      "GrowVest does not guarantee uninterrupted access, error-free content or the continued availability of any calculator, article, tool or third-party service.",
      "Users remain responsible for verifying information and making their own decisions before entering any financial, tax, legal or investment arrangement.",
    ],
  },
  {
    id: "grievances",
    Icon: MessageSquareWarning,
    title: "Customer Concerns and Grievances",
    points: [
      `Concerns may be sent to ${COMPANY.email}, raised by telephone at ${COMPANY.phoneDisplay}, or delivered to the registered office address shown below.`,
      "GrowVest will acknowledge and review concerns based on their nature and complexity. No unverified fixed resolution timeline is promised on this website.",
      "Because GrowVest is not presented as a SEBI-registered Investment Adviser, the website does not represent the SEBI Investment Adviser grievance or SCORES process as GrowVest's own regulatory grievance channel.",
    ],
  },
];

export default function Disclosures() {
  return (
    <>
      <section className="relative overflow-hidden py-24 lg:py-32" style={{ background: BLACK, ...dotGrid, paddingTop: "112px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(31,78,216,0.13) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Important Information</span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <h1 className="mb-6 text-[44px] font-bold leading-[1.04] text-white sm:text-[56px] xl:text-[68px]" style={serif}>
            Clear Disclosures.<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Conscious Decisions.</em>
          </h1>
          <p className="mx-auto max-w-[650px] text-[16px] leading-relaxed text-white/70">
            These disclosures explain GrowVest's current regulatory position, service context, fee approach, risks and communication channels.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-5 rounded-3xl border border-gray-100 p-7 sm:grid-cols-2 lg:grid-cols-4" style={{ background: GRAY }}>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: MGRAY }}>Legal Entity</p>
              <p className="text-[14px] font-semibold text-[#0B0B0F]">{COMPANY.legalName}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: MGRAY }}>Team Certification</p>
              <p className="text-[14px] font-semibold text-[#0B0B0F]">NISM-Series-V-A</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: MGRAY }}>SEBI IA Status</p>
              <p className="text-[14px] font-semibold text-[#0B0B0F]">Not Registered</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: MGRAY }}>Current Direct Fee</p>
              <p className="text-[14px] font-semibold text-[#0B0B0F]">₹0</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-20 lg:py-28">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8">
          <div className="space-y-5">
            {SECTIONS.map(({ id, Icon, title, points }) => (
              <article id={id} key={id} className="scroll-mt-28 rounded-3xl border border-gray-100 bg-white p-7 lg:p-9">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: `${BLUE}10` }}>
                    <Icon size={18} style={{ color: BLUE }} />
                  </div>
                  <h2 className="text-[20px] font-bold text-[#0B0B0F]" style={serif}>{title}</h2>
                </div>
                <div className="space-y-3">
                  {points.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: GOLD }} />
                      <p className="text-[14px] leading-relaxed text-[#4B5563]">{point}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Building2 size={19} style={{ color: BLUE }} />
              <h2 className="text-[24px] font-bold text-[#0B0B0F]" style={serif}>Company and Contact Details</h2>
            </div>
            <p className="text-[14px] leading-relaxed text-[#4B5563]">{COMPANY.legalName}</p>
            <address className="mt-3 not-italic text-[14px] leading-relaxed text-[#4B5563]">
              {COMPANY.addressLines.map((line) => <span key={line} className="block">{line}</span>)}
            </address>
            <div className="mt-4 space-y-1 text-[14px]">
              <a className="block font-medium hover:underline" style={{ color: BLUE }} href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phoneDisplay}</a>
              <a className="block font-medium hover:underline" style={{ color: BLUE }} href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </div>
          </div>
          <div className="rounded-3xl p-7" style={{ background: GRAY }}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: MGRAY }}>Need Clarification?</p>
            <p className="mb-6 text-[14px] leading-relaxed text-[#4B5563]">Ask about GrowVest's regulatory status, service scope, fees, compensation or any website statement before proceeding.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold text-white" style={{ background: BLUE }}>
              Contact GrowVest <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
