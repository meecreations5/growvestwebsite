import Link from "next/link";
import { AlertCircle, ArrowRight, DollarSign, FileText, Globe, Shield, Users } from "lucide-react";
import { BLACK, BLUE, GOLD, MGRAY, serif, dotGrid } from "../lib/brand";

const CHALLENGES = [
  { Icon: Globe, title: "Goals Across Countries", copy: "India-linked family, property and retirement goals often need to be considered alongside commitments in the country of residence." },
  { Icon: FileText, title: "Account and Documentation Questions", copy: "NRE, NRO, banking and investment documentation can feel complex and may require coordinated support from banks and qualified professionals." },
  { Icon: AlertCircle, title: "India-Side Priorities", copy: "Parents' care, property, education and a possible return to India can remain financially important even when income is earned overseas." },
  { Icon: Shield, title: "Protection Across Locations", copy: "Insurance and emergency arrangements may need to reflect dependants, liabilities and healthcare needs in more than one country." },
  { Icon: Users, title: "Family Decisions Across Time Zones", copy: "A clear point of contact and documented next steps can make joint financial decisions easier for families living in different locations." },
  { Icon: DollarSign, title: "Tax and Regulatory Coordination", copy: "Tax, FEMA and jurisdiction-specific matters may require coordination with a Chartered Accountant, bank or appropriately qualified legal professional." },
];

const SUPPORT_AREAS = [
  { n: "01", title: "NRI Goal Mapping", copy: "Bring India-linked and overseas life goals into one clear view with priorities, indicative amounts and timelines." },
  { n: "02", title: "Account Information Checklist", copy: "Identify the bank, KYC and account information that may be needed, while referring regulated or technical questions to the relevant provider." },
  { n: "03", title: "Professional Coordination", copy: "Help organise questions for your CA, lawyer, bank or other qualified professional when tax, FEMA or legal guidance is required." },
  { n: "04", title: "Family Protection Overview", copy: "Review the responsibilities and protection questions that should be discussed for India-based dependants and future return plans." },
  { n: "05", title: "Estate and Nomination Checklist", copy: "Create a practical checklist for nominations, wills, powers of attorney and India-side documents, with legal drafting handled by a qualified professional." },
  { n: "06", title: "Remote Progress Conversations", copy: "Schedule remote conversations based on availability and maintain documented actions for important India-linked goals." },
];

const REGIONS = ["North America", "United Kingdom", "UAE and Gulf", "Singapore", "Australia", "Europe", "Other Regions"];

export default function ForNRIs() {
  return (
    <>
      <section className="relative flex min-h-[78vh] items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 60% at 75% 45%, rgba(31,78,216,0.14) 0%, transparent 65%), radial-gradient(ellipse 35% 40% at 10% 70%, rgba(245,179,1,0.07) 0%, transparent 60%)" }} />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_440px]">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="h-px w-8" style={{ background: GOLD }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>NRI Wealth Guidance</span>
              </div>
              <h1 className="mb-7 text-[44px] font-bold leading-[1.04] text-white sm:text-[54px] xl:text-[70px]" style={serif}>
                Your India Goals<br />Deserve the Same<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Attention as Your Global Ones.</em>
              </h1>
              <p className="mb-10 max-w-[560px] text-[17px] leading-relaxed text-white/70">
                GrowVest helps NRIs organise India-linked goals, family priorities and next steps through remote, goal-based conversations. Tax, FEMA and legal matters may require separate qualified advice.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="gv-btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-semibold text-white" style={{ background: BLUE }}>
                  Begin Your Journey <ArrowRight size={17} />
                </Link>
                <Link href="/goal-library" className="inline-flex items-center justify-center rounded-full border px-8 py-4 text-[15px] font-semibold" style={{ borderColor: `${GOLD}45`, color: GOLD }}>
                  Explore Goal Library
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Common NRI Contexts</p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3">
                {REGIONS.map((region) => (
                  <div key={region} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center">
                    <Globe size={13} className="mx-auto mb-1.5 text-white/65" />
                    <p className="text-[10px] leading-tight text-white/70">{region}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 px-6 py-4">
                <p className="text-[11px] text-white/65">Remote scheduling is subject to team availability and time-zone coordination.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-[400px_1fr]">
            <div className="lg:sticky lg:top-24">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: MGRAY }}>The NRI Context</p>
              <h2 className="mb-5 text-[38px] font-bold leading-tight text-[#0B0B0F] lg:text-[50px]" style={serif}>Six Areas That Often Need More Clarity.</h2>
              <p className="text-[15px] leading-relaxed text-[#6B7280]">Cross-border financial decisions can involve multiple institutions, documents and professional responsibilities. The first step is knowing which questions need to be addressed.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {CHALLENGES.map(({ Icon, title, copy }) => (
                <article key={title} className="rounded-3xl border border-gray-100 bg-[#F4F6F9] p-6">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${BLUE}10` }}><Icon size={16} style={{ color: BLUE }} /></div>
                  <h3 className="mb-2 text-[14px] font-bold text-[#0B0B0F]" style={serif}>{title}</h3>
                  <p className="text-[13px] leading-relaxed text-[#6B7280]">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32" style={{ background: BLACK, ...dotGrid }}>
        <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>How GrowVest Can Support</p>
            <h2 className="text-[36px] font-bold leading-tight text-white lg:text-[50px]" style={serif}>Six Areas. One<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Organised Conversation.</em></h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_AREAS.map(({ n, title, copy }) => (
              <article key={n} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                <span className="mb-4 block text-[38px] font-bold leading-none opacity-20" style={{ ...serif, color: GOLD }}>{n}</span>
                <h3 className="mb-2.5 text-[15px] font-bold text-white" style={serif}>{title}</h3>
                <p className="text-[13px] leading-relaxed text-white/65">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-20">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { value: "Remote", label: "Conversation Format", color: BLUE },
              { value: "India", label: "Goal Context", color: GOLD },
              { value: "Coordinated", label: "Professional Questions", color: "#10B981" },
              { value: "Pan India", label: "GrowVest Coverage", color: "#8B5CF6" },
            ].map(({ value, label, color }) => (
              <div key={label} className="rounded-3xl border border-gray-100 bg-white p-6 text-center">
                <p className="mb-1 text-[26px] font-bold" style={{ ...serif, color }}>{value}</p>
                <p className="text-[12px] text-[#6B7280]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-28">
        <div className="mx-auto max-w-[720px] px-5 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-[40px] font-bold leading-tight text-[#0B0B0F] lg:text-[54px]" style={serif}>Bring Your India Goals<br /><em style={{ color: BLUE, fontStyle: "italic" }}>into One Clear View.</em></h2>
          <p className="mb-10 text-[16px] leading-relaxed text-[#6B7280]">Request a remote discovery conversation about the goals, family priorities and professional questions connected to India.</p>
          <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-[15px] font-semibold text-white" style={{ background: BLUE }}>
            Begin Your Journey <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
