"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";
import { BLACK, BLUE, GOLD, MGRAY, serif, dotGrid } from "../lib/brand";
import { FAQS } from "../data/faqs";

export default function FAQs({ items = [] }) {
  const faqs = (items.length ? items : FAQS).map((item) => ({ ...item, q: item.q || item.question, a: item.a || item.answer }));
  const categories = ["All", ...Array.from(new Set(faqs.map((item) => item.category).filter(Boolean)))];
  const [category, setCategory] = useState("All");
  const [openQuestion, setOpenQuestion] = useState(null);
  const filtered = faqs.filter((item) => category === "All" || item.category === category);

  return (
    <>
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: BLACK, ...dotGrid, paddingTop: "112px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(31,78,216,0.12) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-[860px] px-5 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${BLUE}20` }}>
            <HelpCircle size={20} style={{ color: BLUE }} />
          </div>
          <h1 className="mb-5 text-[44px] font-bold leading-[1.04] text-white sm:text-[54px] xl:text-[64px]" style={serif}>
            Frequently Asked<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Questions.</em>
          </h1>
          <p className="mx-auto max-w-[560px] text-[16px] leading-relaxed text-white/70">
            Clear answers about GrowVest, our current regulatory status, fees, mutual fund context and goal-based process.
          </p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-16 lg:py-24">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap gap-2" aria-label="FAQ categories">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  setOpenQuestion(null);
                }}
                className="rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
                style={{ background: category === item ? BLUE : "white", color: category === item ? "white" : "#6B7280", borderColor: category === item ? BLUE : "rgba(0,0,0,0.08)" }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <div className="rounded-3xl border border-gray-100 bg-white p-6">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: MGRAY }}>Showing</p>
                <p className="text-[36px] font-bold text-[#0B0B0F]" style={serif}>{filtered.length}</p>
                <p className="text-[13px] text-[#6B7280]">questions in {category === "All" ? "all categories" : category}</p>
              </div>
              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5">
                <p className="mb-2 text-[13px] font-semibold text-[#0B0B0F]" style={serif}>Still have a question?</p>
                <p className="mb-4 text-[12px] leading-relaxed text-[#6B7280]">Speak with the GrowVest team about your goals or our service context.</p>
                <Link href="/contact" className="block w-full rounded-full py-2.5 text-center text-[13px] font-semibold text-white" style={{ background: BLUE }}>Contact Us</Link>
              </div>
            </aside>

            <div className="space-y-2">
              {filtered.map((faq, index) => {
                const open = openQuestion === faq.q;
                const answerId = `faq-answer-${index}`;
                return (
                  <article key={faq.q} className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: open ? `${BLUE}35` : "rgba(0,0,0,0.06)" }}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={answerId}
                      className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-500"
                      onClick={() => setOpenQuestion(open ? null : faq.q)}
                    >
                      <span className="flex min-w-0 items-start gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: open ? BLUE : "#D1D5DB" }} />
                        <span className="text-[14px] font-semibold leading-snug text-[#0B0B0F]">{faq.q}</span>
                      </span>
                      <ChevronDown size={16} className={`flex-shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && (
                      <div id={answerId} className="border-t border-gray-100 px-6 pb-5 pt-4">
                        <p className="text-[14px] leading-relaxed text-[#4B5563]">{faq.a}</p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-28" style={{ background: BLACK, ...dotGrid }}>
        <div className="relative mx-auto max-w-[680px] px-5 text-center sm:px-6 lg:px-8">
          <h2 className="mb-5 text-[40px] font-bold leading-[1.04] text-white lg:text-[54px]" style={serif}>
            Start with Your<br /><em style={{ color: GOLD, fontStyle: "italic" }}>Bucket List.</em>
          </h2>
          <p className="mx-auto mb-10 max-w-[480px] text-[16px] leading-relaxed text-white/70">
            Share the goals you want your financial journey to support and request a discovery conversation.
          </p>
          <Link href="/contact" className="gv-btn-primary inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-[15px] font-semibold text-white" style={{ background: BLUE }}>
            Begin Your Journey <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
