import Link from "next/link";
import { ArrowRight, Check, ListChecks } from "lucide-react";
import { BLACK, BLUE, GOLD, serif, dotGrid } from "../../lib/brand";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata("/thank-you", {
  title: "Thank You | GrowVest",
  description: "Thank you for reaching out to GrowVest. A member of the GrowVest team will connect with you.",
  allowIndexing: false,
});

const NEXT_STEPS = [
  "We understand your request.",
  "A GrowVest team member connects with you.",
  "The conversation begins with what matters to you.",
];

export default function Page() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden py-24" style={{ background: BLACK, ...dotGrid, paddingTop: "132px" }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 60% at 50% 46%, rgba(31,78,216,0.17) 0%, transparent 68%), radial-gradient(ellipse 28% 30% at 82% 20%, rgba(245,179,1,0.07) 0%, transparent 70%)" }} />
      <div className="relative mx-auto max-w-[880px] px-5 text-center sm:px-6 lg:px-8">
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-white/10" style={{ background: `${GOLD}14` }}>
          <Check size={26} style={{ color: GOLD }} />
        </div>
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">GrowVest</p>
        <h1 className="text-[42px] font-bold leading-tight text-white sm:text-[54px]" style={serif}>Thank you for reaching out.</h1>
        <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-7 text-white/60">A member of the GrowVest team will connect with you.</p>

        <div className="mx-auto mt-10 max-w-[720px] rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 text-left backdrop-blur-sm sm:p-7">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">What happens next</p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {NEXT_STEPS.map((step, index) => (
              <div key={step} className="rounded-[1.4rem] border border-white/[0.08] bg-white/[0.035] p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: BLUE }}>{index + 1}</span>
                <p className="mt-4 text-[12px] leading-6 text-white/62">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/insights" className="gv-btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold text-white" style={{ background: BLUE, boxShadow: `0 10px 34px ${BLUE}45` }}>
            Explore GrowVest Insights <ArrowRight size={16} />
          </Link>
          <Link href="/bucket-list-builder" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 px-7 py-4 text-[14px] font-semibold text-white/72 transition-colors hover:border-white/28 hover:text-white">
            <ListChecks size={16} /> Build Your Bucket List
          </Link>
        </div>
      </div>
    </section>
  );
}
