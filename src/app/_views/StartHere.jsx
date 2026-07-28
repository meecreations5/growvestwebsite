import Link from "next/link";
import { ArrowRight, Check, Target, FileText, RefreshCw, ChevronRight, Shield } from "lucide-react";
import { BLUE, BLACK, GOLD, MGRAY, serif, dotGrid } from "../lib/brand";
const FOR_WHOM = [
    { yes: true, text: "You have financial goals but no clear plan connecting money to life." },
    { yes: true, text: "You are investing but not sure if your SIPs are aligned to anything meaningful." },
    { yes: true, text: "You want a consistent GrowVest point of contact — not a rotating call centre experience." },
    { yes: true, text: "You believe wealth should be reviewed regularly, not just when markets crash." },
    { yes: false, text: "You are looking for stock tips or short-term trading opportunities." },
    { yes: false, text: "You want a fully automated portfolio-management or stock-trading service." },
];
const STEPS = [
    { n: "01", Icon: Target, title: "Map Your Bucket List", copy: "Your first session is entirely about your life goals — not your current portfolio. What do you want to achieve? When? What would it mean to you?", link: "/your-goals", cta: "See Goal Categories" },
    { n: "02", Icon: FileText, title: "Build Your Roadmap", copy: "We organise your priorities into an illustrative, goal-linked roadmap covering target amounts, timelines, monthly commitments and important planning gaps.", link: "/the-growvest-way", cta: "How Planning Works" },
    { n: "03", Icon: Shield, title: "Review the Foundation", copy: "Before focusing on growth, we help you identify important protection, liability, nomination and documentation questions that may need qualified professional support.", link: "/wealth-guidance", cta: "Wealth Guidance" },
    { n: "04", Icon: RefreshCw, title: "Review Your Progress", copy: "A structured review can cover goal progress, contribution discipline, pending documents, important observations and clear next actions based on the agreed cadence.", link: "/progress-reviews", cta: "Progress Reviews" },
];
const EXPECTATIONS = [
    { label: "First conversation", desc: "A focused discussion about your goals, priorities and current financial picture." },
    { label: "After discovery", desc: "A structured summary of goals, assumptions, timelines and information still required." },
    { label: "Roadmap stage", desc: "Illustrative funding estimates, priority actions and relevant planning questions are organised." },
    { label: "First review", desc: "Progress, documents, open questions and next actions are reviewed together." },
    { label: "Ongoing journey", desc: "Goal information and progress can be updated as circumstances and priorities change." },
    { label: "Agreed cadence", desc: "Regular progress conversations and documented next actions based on the engagement." },
];
export default function StartHere() {
    return (<>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 65% at 30% 50%, rgba(31,78,216,0.15) 0%, transparent 65%)` }}/>
        <div className="max-w-[1100px] mx-auto px-8 w-full py-20 lg:py-28 relative">
          <div className="max-w-[680px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: GOLD }}/>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase" style={{ color: GOLD }}>New to GrowVest</span>
            </div>
            <h1 className="text-[52px] xl:text-[70px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
              Not Sure Where<br />to{" "}
              <em style={{ color: GOLD, fontStyle: "italic" }}>Start?</em>
            </h1>
            <p className="text-white/45 text-[17px] leading-relaxed mb-10 max-w-[520px]">
              This page is your orientation. Understand what GrowVest is, who it is for, and exactly what happens after you take your first step.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/contact" data-analytics-event="primary_cta_click" data-analytics-location="start_here_hero" className="gv-btn-primary inline-flex items-center justify-center gap-2.5">
                Begin Your Journey <ArrowRight size={17}/>
              </Link>
              <Link href="/your-goals" data-analytics-event="secondary_cta_click" data-analytics-location="start_here_hero" className="gv-btn-secondary gv-btn-secondary--dark inline-flex items-center justify-center">
                Explore Your Goals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Is GrowVest for you */}
      <section className="py-28 lg:py-36 bg-white">
        <div className="max-w-[1000px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>Is This for You?</p>
              <h2 className="text-[36px] lg:text-[46px] font-bold text-[#0B0B0F] leading-tight mb-5" style={serif}>
                GrowVest is Built for<br />Specific Investors.
              </h2>
              <p className="text-[#6B7280] text-[15px] leading-relaxed">
                We are not the right fit for everyone — and we say that honestly. Here is the clearest way to know whether GrowVest is what you are looking for.
              </p>
            </div>
            <div className="space-y-3">
              {FOR_WHOM.map(({ yes, text }) => (<div key={text} className={`flex items-start gap-3.5 p-4 rounded-2xl ${yes ? "bg-blue-50" : "bg-gray-50"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${yes ? "" : ""}`} style={{ background: yes ? BLUE : "#D1D5DB" }}>
                    {yes
                ? <Check size={11} className="text-white"/>
                : <span className="text-white text-[10px] font-bold">✕</span>}
                  </div>
                  <p className={`text-[14px] leading-relaxed ${yes ? "text-[#1E3A8A]" : "text-[#6B7280]"}`}>{text}</p>
                </div>))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-28 lg:py-36 bg-[#F4F6F9]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>How It Works</p>
            <h2 className="text-[36px] lg:text-[50px] font-bold text-[#0B0B0F] leading-tight" style={serif}>Four Steps to a<br />Goal-Linked Financial Life.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {STEPS.map(({ n, Icon, title, copy, link, cta }) => (<div key={n} className="p-8 bg-white rounded-3xl border border-gray-100 hover:-translate-y-1 transition-all group" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[42px] font-bold opacity-[0.07] leading-none" style={{ ...serif, color: BLUE }}>{n}</span>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${BLUE}10` }}>
                    <Icon size={18} style={{ color: BLUE }}/>
                  </div>
                </div>
                <h3 className="font-bold text-[#0B0B0F] text-[18px] mb-3" style={serif}>{title}</h3>
                <p className="text-[#6B7280] text-[14px] leading-relaxed mb-6">{copy}</p>
                <Link href={link} className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all" style={{ color: BLUE }}>
                  {cta} <ChevronRight size={13}/>
                </Link>
              </div>))}
          </div>
        </div>
      </section>

      {/* What to expect timeline */}
      <section className="py-28 lg:py-36 bg-white">
        <div className="max-w-[820px] mx-auto px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase mb-5" style={{ color: MGRAY }}>What to Expect</p>
            <h2 className="text-[36px] lg:text-[48px] font-bold text-[#0B0B0F] leading-tight" style={serif}>From First Call to<br />Fully On Track.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px" style={{ background: `linear-gradient(to bottom, ${BLUE}, ${GOLD})` }}/>
            <div className="space-y-4">
              {EXPECTATIONS.map(({ label, desc }, i) => (<div key={label} className="flex gap-6 pl-16 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-[11px] font-bold" style={{ background: i < 3 ? BLUE : i < 5 ? GOLD : "#10B981", color: "white", boxShadow: `0 0 0 4px white` }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 p-5 bg-[#F4F6F9] rounded-2xl">
                    <p className="text-[11px] font-bold tracking-widest uppercase mb-1.5" style={{ color: BLUE }}>{label}</p>
                    <p className="text-[#374151] text-[14px] leading-relaxed">{desc}</p>
                  </div>
                </div>))}
            </div>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="py-20 bg-[#F4F6F9]">
        <div className="max-w-[820px] mx-auto px-8">
          <h3 className="text-[24px] font-bold text-[#0B0B0F] mb-8 text-center" style={serif}>Common First Questions</h3>
          <div className="space-y-3">
            {[
            { q: "Do I need to have a lot of money to start?", a: "No. GrowVest works with investors at various income and asset levels. What matters is that you have goals and the discipline to build towards them consistently." },
            { q: "Is this only about mutual funds?", a: "No. The conversation begins with goals, cash-flow priorities, protection questions, documentation and progress tracking. Mutual fund-related support is offered in a distribution context; regulated investment, tax, insurance or legal advice may require an appropriately authorised professional." },
            { q: "What if I already have investments elsewhere?", a: "That is completely fine. Existing holdings can be documented and viewed alongside your goals so you can identify questions, gaps and decisions that may need further review by an appropriately authorised professional." },
            { q: "How is GrowVest different?", a: "Every conversation begins with a life goal. Important actions are documented, progress is reviewed, and clients have a clear point of contact rather than an anonymous ticket number." },
        ].map(({ q, a }) => (<div key={q} className="p-6 bg-white rounded-2xl border border-gray-100">
                <p className="font-semibold text-[#0B0B0F] text-[14px] mb-2" style={serif}>{q}</p>
                <p className="text-[#6B7280] text-[13px] leading-relaxed">{a}</p>
              </div>))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faqs" className="text-[13px] font-semibold inline-flex items-center gap-1.5" style={{ color: BLUE }}>
              See All FAQs <ChevronRight size={13}/>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-36 overflow-hidden" style={{ background: BLACK, ...dotGrid }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(31,78,216,0.12) 0%, transparent 70%)` }}/>
        <div className="max-w-[680px] mx-auto px-8 text-center relative">
          <h2 className="text-[44px] lg:text-[60px] font-bold text-white mb-6 leading-[1.04]" style={serif}>
            The First Step is<br />
            <em style={{ color: GOLD, fontStyle: "italic" }}>Always the Goals.</em>
          </h2>
          <p className="text-white/40 text-[16px] leading-relaxed mb-10 max-w-[460px] mx-auto">
            Not the portfolio. Not the SIP. Start by telling us what you want your life to look like — and we will build the plan from there.
          </p>
          <Link href="/your-goals" className="inline-flex items-center gap-2.5 px-10 py-5 rounded-full text-white font-semibold text-[16px] transition-all hover:opacity-90 hover:-translate-y-1" style={{ background: BLUE, boxShadow: `0 12px 40px ${BLUE}55` }}>
            Map Your Bucket List Goals <ArrowRight size={19}/>
          </Link>
        </div>
      </section>
    </>);
}
