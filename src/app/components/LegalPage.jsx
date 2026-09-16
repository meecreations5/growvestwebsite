import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BLACK, BLUE, GOLD, COMPANY, serif, dotGrid } from "../lib/brand";

export function LegalPage({ eyebrow, title, introduction, sections, updated = "27 July 2026" }) {
  return (
    <>
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: BLACK, ...dotGrid, paddingTop: "112px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(31,78,216,0.14) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-6 lg:px-8">
          <div className="mb-7 flex items-center justify-center gap-3">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>{eyebrow}</span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <h1 className="mb-5 text-[42px] font-bold leading-[1.05] text-white sm:text-[54px] xl:text-[64px]" style={serif}>{title}</h1>
          <p className="mx-auto max-w-[650px] text-[15px] leading-relaxed text-white/70">{introduction}</p>
          <p className="mt-5 text-[11px] uppercase tracking-[0.15em] text-white/50">Last updated: {updated}</p>
        </div>
      </section>

      <section className="bg-[#F4F6F9] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-5 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
          <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">On this page</p>
            <nav aria-label={`${title} sections`}>
              <ul className="space-y-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a className="text-[13px] leading-snug text-[#6B7280] transition-colors hover:text-[#1F4ED8]" href={`#${section.id}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="space-y-5">
            {sections.map((section) => (
              <article id={section.id} key={section.id} className="scroll-mt-28 rounded-3xl border border-gray-100 bg-white p-7 lg:p-9">
                <h2 className="mb-4 text-[22px] font-bold text-[#0B0B0F]" style={serif}>{section.title}</h2>
                <div className="space-y-3 text-[14px] leading-relaxed text-[#4B5563]">
                  {section.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.items?.length ? (
                    <ul className="space-y-2 pl-1">
                      {section.items.map((item) => (
                        <li className="flex items-start gap-3" key={item}>
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: GOLD }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-[900px] flex-col items-start justify-between gap-6 px-5 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="mb-1 text-[18px] font-bold text-[#0B0B0F]" style={serif}>Questions about this page?</p>
            <p className="text-[13px] text-[#6B7280]">Contact {COMPANY.legalName} at {COMPANY.email}.</p>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#1F4ED8] px-6 py-3 text-[13px] font-semibold text-white">
            Contact GrowVest <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
