import Link from "next/link";
import { ArrowRight, BadgeIndianRupee, Check, FileText, Handshake, Info, ShieldCheck } from "lucide-react";
import { BLACK, BLUE, GOLD, GRAY, MGRAY, COMPANY, serif, dotGrid } from "../lib/brand";

const PRINCIPLES = [
  {
    Icon: BadgeIndianRupee,
    title: "No Direct Advisory Fee Currently",
    copy: "GrowVest currently does not charge clients a separate direct advisory fee for its guidance and planning support.",
  },
  {
    Icon: FileText,
    title: "Costs Explained Before You Proceed",
    copy: "Any scheme-level expense, platform charge, transaction cost or other applicable cost should be explained before a client proceeds.",
  },
  {
    Icon: Handshake,
    title: "Commercial Relationships Disclosed",
    copy: "Where a distribution, referral, platform or partner arrangement applies, the nature of that relationship should be disclosed transparently.",
  },
];

const INCLUDED = [
  "Initial goal and bucket-list conversation",
  "Structured understanding of priorities and timelines",
  "General financial education and planning support",
  "Financial education supported by a NISM-Series-V-A certified team member",
  "Periodic progress conversations based on the agreed engagement",
  "Clear communication of next steps and required documents",
];

export default function HowWeCharge() {
  return (
    <>
      <section className="relative overflow-hidden py-24 lg:py-36" style={{ background: BLACK, ...dotGrid, paddingTop: "112px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(31,78,216,0.14) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Transparent by Design</span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <h1 className="mb-6 text-[44px] font-bold leading-[1.04] text-white sm:text-[56px] xl:text-[70px]" style={serif}>
            Clear About What You Pay.<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Clear About How We Work.</em>
          </h1>
          <p className="mx-auto max-w-[650px] text-[17px] leading-relaxed text-white/70">
            GrowVest currently charges no separate direct advisory fee to clients. Transparency also means explaining any external cost or commercial relationship that may apply.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-20 lg:py-28">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
          <div className="mb-10 rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-[0_10px_40px_rgba(31,78,216,0.08)] lg:p-12">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: BLUE }}>Current GrowVest Fee</p>
            <p className="mb-3 text-[54px] font-bold leading-none" style={{ ...serif, color: BLUE }}>₹0</p>
            <p className="text-[16px] font-semibold text-[#0B0B0F]">No direct advisory fee currently charged to clients</p>
            <p className="mx-auto mt-3 max-w-[620px] text-[13px] leading-relaxed text-[#6B7280]">
              This statement relates only to GrowVest's current direct fee. Mutual fund schemes, platforms or third-party services may have their own applicable costs.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {PRINCIPLES.map(({ Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-gray-100 bg-white p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${BLUE}10` }}>
                  <Icon size={19} style={{ color: BLUE }} />
                </div>
                <h2 className="mb-3 text-[17px] font-bold text-[#0B0B0F]" style={serif}>{title}</h2>
                <p className="text-[13px] leading-relaxed text-[#6B7280]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1040px] gap-14 px-5 sm:px-6 lg:grid-cols-[400px_1fr] lg:px-8">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: MGRAY }}>What the Journey Can Include</p>
            <h2 className="mb-5 text-[38px] font-bold leading-tight text-[#0B0B0F] lg:text-[48px]" style={serif}>
              Guidance Built Around Your Goals.
            </h2>
            <p className="text-[15px] leading-relaxed text-[#6B7280]">
              The exact scope depends on your needs, the service arrangement and any third-party platform or product involved.
            </p>
          </div>
          <div className="rounded-3xl p-8" style={{ background: GRAY }}>
            <div className="space-y-4">
              {INCLUDED.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: BLUE }}>
                    <Check size={11} className="text-white" />
                  </div>
                  <p className="text-[14px] leading-relaxed text-[#374151]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16" style={{ background: BLACK, ...dotGrid }}>
        <div className="mx-auto max-w-[900px] px-5 text-center sm:px-6 lg:px-8">
          <ShieldCheck size={23} className="mx-auto mb-4" style={{ color: GOLD }} />
          <p className="mb-3 text-[14px] font-semibold text-white">Important Regulatory Distinction</p>
          <p className="text-[14px] leading-relaxed text-white/70">
            {COMPANY.legalName} is not registered with SEBI as an Investment Adviser. A member of the GrowVest team holds a valid NISM-Series-V-A Mutual Fund Distributors Certification. This certification is not the same as SEBI investment-adviser registration or an AMFI ARN. Website content should not be treated as personalised securities advice.
          </p>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[720px] px-5 text-center sm:px-6 lg:px-8">
          <Info size={22} className="mx-auto mb-5" style={{ color: BLUE }} />
          <h2 className="mb-5 text-[38px] font-bold leading-tight text-[#0B0B0F] lg:text-[50px]" style={serif}>Ask Before You Decide.</h2>
          <p className="mb-9 text-[15px] leading-relaxed text-[#6B7280]">
            During your first conversation, ask us about the service scope, applicable third-party costs and any commercial relationship relevant to your journey.
          </p>
          <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-[15px] font-semibold text-white" style={{ background: BLUE }}>
            Begin Your Journey <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
