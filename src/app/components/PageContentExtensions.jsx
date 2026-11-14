import Link from "next/link";
import { getPublishedFaqs, getPublishedWebsitePage } from "../lib/server/websiteContentRepository";

// Server-rendered content: accessible without JavaScript and visible to crawlers.
// No FAQPage JSON-LD is emitted: Google retired the FAQ rich-result feature in 2026.
export async function PageContentExtensions({ pageKey, includeFaqs = true }) {
  const [page, faqs] = await Promise.all([
    getPublishedWebsitePage(pageKey),
    includeFaqs ? getPublishedFaqs() : Promise.resolve([]),
  ]);
  const section = page?.content?.seoSection || {};
  const settings = page?.content?.faqSection || {};
  const showSection = section.enabled === true && typeof section.heading === "string" && typeof section.body === "string" && Boolean(section.heading.trim() && section.body.trim());
  const pageFaqs = Array.isArray(page?.content?.pageFaqs) ? page.content.pageFaqs : [];
  const sharedFaqs = faqs.filter((faq) =>
    faq.status === "published" && faq.isVisible !== false && Array.isArray(faq.pageKeys) && faq.pageKeys.includes(pageKey)
  );
  // Page-specific content is displayed first. Shared-library questions are
  // appended only when they are not already answered on this page.
  const unique = new Set();
  const items = settings.enabled === false || !includeFaqs ? [] : [...pageFaqs, ...sharedFaqs]
    .filter((faq) => faq.status === "published" && faq.isVisible !== false && faq.question?.trim() && faq.answer?.trim())
    .filter((faq) => {
      const normalized = faq.question.trim().toLowerCase();
      if (unique.has(normalized)) return false;
      unique.add(normalized);
      return true;
    })
    .slice(0, 10);

  if (!showSection && !items.length) return null;
  return (
    <div className="bg-[#F8FAFC]">
      {showSection ? (
        <section aria-labelledby={`${pageKey}-seo-heading`} className="border-t border-black/5 py-16 sm:py-20">
          <div className="mx-auto max-w-[860px] px-5 sm:px-6 lg:px-8">
            <h2 id={`${pageKey}-seo-heading`} className="font-serif text-3xl font-bold leading-tight text-[#0B0B0F] sm:text-4xl">{section.heading}</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-8 text-[#475569]">
              {section.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{paragraph}</p>)}
            </div>
          </div>
        </section>
      ) : null}
      {items.length ? (
        <section aria-labelledby={`${pageKey}-faq-heading`} className="border-t border-black/5 py-16 sm:py-20">
          <div className="mx-auto max-w-[900px] px-5 sm:px-6 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">GrowVest answers</p>
            <h2 id={`${pageKey}-faq-heading`} className="mt-3 font-serif text-3xl font-bold leading-tight text-[#0B0B0F] sm:text-4xl">{typeof settings.heading === "string" && settings.heading.trim() ? settings.heading : "Questions you may have"}</h2>
            {typeof settings.introduction === "string" && settings.introduction.trim() ? <p className="mt-4 max-w-[760px] text-sm leading-7 text-[#64748B]">{settings.introduction}</p> : null}
            <div className="mt-8 space-y-3">
              {items.map((faq) => <details key={faq.id} className="group rounded-2xl border border-[#E2E8F0] bg-white px-5 py-1 sm:px-6">
                <summary className="cursor-pointer py-4 text-left text-[15px] font-semibold leading-6 text-[#0B0B0F] marker:text-[#1F4ED8]">{faq.question}</summary>
                <p className="whitespace-pre-line border-t border-black/5 pb-5 pt-4 text-sm leading-7 text-[#475569]">{faq.answer}</p>
              </details>)}
            </div>
            <Link href="/faqs" className="mt-7 inline-block text-sm font-semibold text-[#1F4ED8] underline-offset-4 hover:underline">Explore more questions and answers</Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
