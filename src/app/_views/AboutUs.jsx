import Link from "next/link";
import { ArrowRight, Check, Compass, Heart, Shield, Sparkles, Target, Users, Globe2 } from "lucide-react";
import { BLACK, BLUE, CYAN, GOLD, GRAY, MGRAY, COMPANY, serif, dotGrid } from "../lib/brand";

const VALUES = [
  {
    Icon: Heart,
    title: "Human Understanding",
    copy: "Every financial decision carries a personal story. We begin by understanding the life behind the numbers.",
  },
  {
    Icon: Target,
    title: "Purpose Before Products",
    copy: "Goals, priorities and timelines come first. Financial choices should support the life you want to build.",
  },
  {
    Icon: Shield,
    title: "Clarity and Responsibility",
    copy: "We communicate openly, document important decisions and encourage disciplined, risk-aware progress.",
  },
  {
    Icon: Compass,
    title: "Long-Term Partnership",
    copy: "We believe meaningful wealth journeys are built through consistency, review and trusted relationships.",
  },
];

const STATS = [
  { value: COMPANY.clientsSupported, label: "Clients Supported", Icon: Users },
  { value: COMPANY.reviewsCompleted, label: "Structured Reviews Completed", Icon: Check },
  { value: COMPANY.coverage, label: "Service Coverage", Icon: Globe2 },
  { value: "NISM V-A", label: "Certified Team Expertise", Icon: Sparkles },
];

export default function AboutUs() {
  return (
    <>
      <section className="relative flex min-h-[78vh] items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 60% at 20% 55%, rgba(24,183,211,0.16) 0%, transparent 65%)" }} />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-[820px]">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>About GrowVest</span>
            </div>
            <p className="mb-5 text-[13px] font-semibold uppercase tracking-[0.16em]" style={{ color: CYAN }}>{COMPANY.positioning}</p>
            <h1 className="mb-7 text-[44px] font-bold leading-[1.04] text-white sm:text-[56px] xl:text-[72px]" style={serif}>
              Wealth Is More Than<br />Money. It Is a <em style={{ color: GOLD, fontStyle: "italic" }}>Life Well Lived.</em>
            </h1>
            <p className="mb-10 max-w-[650px] text-[17px] leading-relaxed text-white/70">
              GrowVest exists to make wealth creation feel more human, purposeful and connected to the experiences, security and freedom people truly value.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" className="gv-btn-primary inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5" style={{ background: BLUE }}>
                Begin Your Journey <ArrowRight size={17} />
              </Link>
              <Link href="/the-growvest-way" className="inline-flex items-center justify-center gap-2 rounded-full border px-8 py-4 text-[15px] font-semibold transition-colors hover:bg-white/5" style={{ borderColor: `${GOLD}55`, color: GOLD }}>
                Explore the GrowVest Way
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[330px_1fr] lg:gap-20">
            <div>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: MGRAY }}>Our Brand Story</p>
              <h2 className="text-[38px] font-bold leading-tight text-[#0B0B0F] lg:text-[50px]" style={serif}>
                Created to Make Wealth Feel More Human.
              </h2>
            </div>
            <div className="space-y-5 text-[16px] leading-relaxed text-[#4B5563]">
              <p>At GrowVest, we believe wealth is more than numbers, returns or investments.</p>
              <p>It is the confidence of knowing your family is secure. It is the freedom to live life on your terms. It is the ability to turn dreams into meaningful experiences.</p>
              <p>Every financial decision carries a personal story behind it: a child's future, a dream home, retirement freedom, travel aspirations or the peace of knowing tomorrow is protected.</p>
              <p>Yet, for many people, finance often feels complicated, overwhelming and disconnected from real life. GrowVest was created to change that.</p>
              <p>We built GrowVest with a simple intention: to make wealth creation feel more human, more purposeful and more aligned with the life people truly want to build.</p>
              <p>By combining disciplined goal-based planning, intelligent technology and long-term perspective, we help individuals and families move forward with greater clarity and confidence.</p>
              <p>We do not believe in transactional relationships. We believe in guiding people through every stage of their financial journey with understanding, transparency and responsibility.</p>
              <p className="font-semibold text-[#0B0B0F]">Because true wealth is not only about growing money. It is about creating a life filled with security, freedom, meaningful experiences and possibilities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-24 lg:py-32">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-gray-200 bg-white p-8 lg:p-10">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: BLUE }}>Our Vision</p>
              <h2 className="mb-5 text-[32px] font-bold leading-tight text-[#0B0B0F] sm:text-[40px]" style={serif}>{COMPANY.vision}</h2>
              <p className="leading-7 text-[#5B6472]">
                To create a future where people experience wealth not only as financial growth, but also as confidence, freedom, peace of mind and meaningful life opportunities every day.
              </p>
            </article>

            <article className="rounded-3xl border border-white/10 p-8 text-white lg:p-10" style={{ background: `linear-gradient(135deg, ${BLACK}, #142044)` }}>
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>Our Mission</p>
              <h2 className="mb-5 text-[32px] font-bold leading-tight sm:text-[40px]" style={serif}>{COMPANY.mission}</h2>
              <p className="leading-7 text-white/70">
                To help individuals and families transform their life aspirations into structured financial journeys through disciplined planning, intelligent decision-making and trusted guidance.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: MGRAY }}>What We Stand For</p>
            <h2 className="text-[38px] font-bold leading-tight text-[#0B0B0F] lg:text-[50px]" style={serif}>The Principles Behind Every Journey.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-gray-100 p-7 transition-transform hover:-translate-y-1" style={{ background: GRAY }}>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${BLUE}12` }}>
                  <Icon size={19} style={{ color: BLUE }} />
                </div>
                <h3 className="mb-3 text-[16px] font-bold text-[#0B0B0F]" style={serif}>{title}</h3>
                <p className="text-[13px] leading-relaxed text-[#6B7280]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20" style={{ background: BLACK, ...dotGrid }}>
        <div className="relative mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map(({ value, label, Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-center">
                <Icon size={17} className="mx-auto mb-3 text-white/65" />
                <p className="mb-1 text-[24px] font-bold text-white" style={serif}>{value}</p>
                <p className="text-[11px] leading-snug text-white/65">{label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-[820px] text-center text-[11px] leading-relaxed text-white/60">
            GrowVest is not registered with SEBI as an Investment Adviser. A member of the GrowVest team holds a valid NISM-Series-V-A Mutual Fund Distributors Certification. Website information is general and educational.
          </p>
        </div>
      </section>

      <section className="bg-white py-28 lg:py-36">
        <div className="mx-auto max-w-[760px] px-5 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-[40px] font-bold leading-tight text-[#0B0B0F] lg:text-[56px]" style={serif}>
            Protect What Matters Today.<br /><em style={{ color: BLUE, fontStyle: "italic" }}>Grow Toward Tomorrow.</em>
          </h2>
          <p className="mb-10 text-[16px] leading-relaxed text-[#6B7280]">
            Begin with a conversation about your goals, priorities and the life you want your financial journey to support.
          </p>
          <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-[15px] font-semibold text-white" style={{ background: BLUE }}>
            Begin Your Journey <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
