"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Calendar, ChevronLeft, ChevronRight, Clock, Search, Sparkles } from "lucide-react";
import { BLACK, GOLD, MGRAY, serif, dotGrid } from "../lib/brand";
import { InvestorTestimonials } from "./InvestorTestimonials";

const PAGE_SIZE = 9;

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function InsightsDirectory({ posts, categories, testimonials = [], initialCategory = "all", initialSearch = "", initialPage = 1 }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialSearch || "");
  const [category, setCategory] = useState(initialCategory || "all");
  const [page, setPage] = useState(Math.max(1, Number(initialPage) || 1));

  useEffect(() => {
    setQuery(initialSearch || "");
    setCategory(initialCategory || "all");
    setPage(Math.max(1, Number(initialPage) || 1));
  }, [initialCategory, initialSearch, initialPage]);

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((item) => [item.id, item])), [categories]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "all" || (post.categoryIds || []).includes(category);
      const matchesSearch = !term || `${post.title} ${post.excerpt} ${(post.tagIds || []).join(" ")}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [posts, category, query]);

  const featured = posts.find((post) => post.isFeatured) || posts[0];
  const showFeatured = category === "all" && !query.trim() && page === 1;
  const libraryPosts = filtered.filter((post) => !showFeatured || post.id !== featured?.id);
  const pageCount = Math.max(1, Math.ceil(libraryPosts.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = libraryPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function updateUrl(nextCategory, nextQuery, nextPage) {
    const params = new URLSearchParams();
    if (nextCategory && nextCategory !== "all") params.set("category", nextCategory);
    if (nextQuery.trim()) params.set("search", nextQuery.trim());
    if (nextPage > 1) params.set("page", String(nextPage));
    router.replace(`/insights${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    setPage(1);
    updateUrl(nextCategory, query, 1);
  }

  function submitSearch(event) {
    event.preventDefault();
    setPage(1);
    updateUrl(category, query, 1);
  }

  function goToPage(nextPage) {
    const resolved = Math.max(1, Math.min(pageCount, nextPage));
    setPage(resolved);
    updateUrl(category, query, resolved);
    document.getElementById("insights-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="relative flex min-h-[66vh] items-end overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: "72px" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 65% at 78% 28%, rgba(31,78,216,.18), transparent 68%), radial-gradient(ellipse 35% 45% at 14% 80%, rgba(245,179,1,.07), transparent 65%)" }} />
        <div className="relative mx-auto w-full max-w-[1320px] px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl"><div className="mb-8 flex items-center gap-3"><span className="h-px w-8" style={{ background: GOLD }} /><span className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>GrowVest Insights</span></div><h1 className="text-[42px] font-bold leading-[1.04] text-white sm:text-[54px] xl:text-[72px]" style={serif}>Clarity for the life<br />you want to <em className="italic" style={{ color: GOLD }}>experience.</em></h1><p className="mt-7 max-w-2xl text-[17px] leading-8 text-white/60">Educational perspectives on goals, financial habits, protection thinking and the meaningful decisions that shape long-term wealth.</p></div>
        </div>
      </section>

      {showFeatured && featured && <section className="bg-white py-20 lg:py-24"><div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8"><p className="mb-8 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: MGRAY }}>Featured Insight</p><article className="grid overflow-hidden rounded-[28px] border border-gray-100 shadow-[0_18px_60px_rgba(11,11,15,.08)] lg:grid-cols-[0.9fr_1.1fr]"><div className="relative min-h-[320px] overflow-hidden p-8 sm:p-10" style={{ background: "linear-gradient(135deg,#0B0B0F,#171B35)", ...dotGrid }}>{featured.featuredImage?.url ? <img src={featured.featuredImage.url} alt={featured.featuredImage.altText || ""} className="absolute inset-0 h-full w-full object-cover opacity-45" style={{ objectPosition: `${featured.featuredImage.focalX ?? 50}% ${featured.featuredImage.focalY ?? 50}%` }} /> : null}<div className="absolute inset-0" style={{ background: "radial-gradient(circle at 28% 42%, rgba(31,78,216,.25), transparent 46%)" }} /><div className="relative flex h-full flex-col justify-between"><div className="flex flex-wrap gap-2">{(featured.categoryIds || []).map((id) => <span key={id} className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[11px] font-bold text-white/80">{categoryMap[id]?.name || id}</span>)}</div><BookOpen size={54} style={{ color: GOLD }} /></div></div><div className="flex flex-col justify-between p-8 sm:p-10 lg:p-12"><div><div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-[#6B7280]"><span className="inline-flex items-center gap-1.5"><Calendar size={14} />{formatDate(featured.publishedAt)}</span><span className="inline-flex items-center gap-1.5"><Clock size={14} />{featured.readingTime || 5} min read</span></div><h2 className="font-serif text-3xl font-bold leading-tight text-[#0B0B0F] lg:text-4xl">{featured.title}</h2><p className="mt-5 text-[15px] leading-7 text-[#6B7280]">{featured.excerpt}</p></div><Link href={`/insights/${featured.slug}`} className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#1F4ED8]">Read the Insight <ArrowRight size={16} /></Link></div></article></div></section>}

      {showFeatured && testimonials.length ? <InvestorTestimonials items={testimonials} location="insights" /> : null}

      <section id="insights-library" className="scroll-mt-24 bg-[#F4F6F9] py-20 lg:py-24"><div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8"><div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Explore the library</p><h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">Insights for clearer decisions.</h2></div><form onSubmit={submitSearch} className="relative w-full max-w-md"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" /><input aria-label="Search GrowVest Insights" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic or keyword" className="h-12 w-full rounded-full border border-gray-200 bg-white pl-12 pr-24 text-sm outline-none focus:border-[#1F4ED8]" /><button type="submit" className="absolute right-1.5 top-1.5 h-9 rounded-full bg-[#1F4ED8] px-4 text-xs font-bold text-white">Search</button></form></div><div className="mb-8 flex flex-wrap gap-2"><button type="button" onClick={() => selectCategory("all")} className={`rounded-full px-4 py-2 text-xs font-bold ${category === "all" ? "bg-[#1F4ED8] text-white" : "border border-gray-200 bg-white text-[#6B7280]"}`}>All</button>{categories.filter((item) => item.isActive !== false).map((item) => <button type="button" key={item.id} onClick={() => selectCategory(item.id)} className={`rounded-full px-4 py-2 text-xs font-bold ${category === item.id ? "bg-[#1F4ED8] text-white" : "border border-gray-200 bg-white text-[#6B7280]"}`}>{item.name}</button>)}</div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{visible.map((post) => <article key={post.id} className="group flex min-h-[350px] flex-col overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(11,11,15,.08)]">{post.featuredImage?.url && <div className="aspect-[16/8] overflow-hidden bg-[#E9EDF5]"><img src={post.featuredImage.url} alt={post.featuredImage.altText || ""} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" style={{ objectPosition: `${post.featuredImage.focalX ?? 50}% ${post.featuredImage.focalY ?? 50}%` }} loading="lazy" /></div>}<div className="flex flex-1 flex-col p-7"><div className="flex flex-wrap gap-2">{(post.categoryIds || []).slice(0, 2).map((id) => <span key={id} className="rounded-full bg-[#1F4ED8]/8 px-3 py-1 text-[10px] font-bold text-[#1F4ED8]">{categoryMap[id]?.name || id}</span>)}</div><h3 className="mt-6 font-serif text-2xl font-bold leading-tight text-[#0B0B0F]">{post.title}</h3><p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6B7280]">{post.excerpt}</p><div className="mt-auto pt-7"><div className="mb-4 flex items-center gap-4 text-[11px] text-[#6B7280]"><span>{formatDate(post.publishedAt)}</span><span>{post.readingTime || 5} min read</span></div><Link href={`/insights/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#1F4ED8]">Read Insight <ArrowRight size={15} className="transition group-hover:translate-x-1" /></Link></div></div></article>)}</div>{!visible.length && <div className="rounded-3xl bg-white px-6 py-16 text-center"><Sparkles size={28} className="mx-auto text-[#F5B301]" /><h3 className="mt-4 font-serif text-2xl font-bold">No matching Insights yet.</h3><p className="mt-2 text-sm text-[#6B7280]">Try another keyword or category.</p></div>}{pageCount > 1 && <nav aria-label="Insights pagination" className="mt-10 flex items-center justify-center gap-3"><button type="button" disabled={safePage <= 1} onClick={() => goToPage(safePage - 1)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-[#1F4ED8] disabled:opacity-40"><ChevronLeft size={16} /> Previous</button><span className="text-sm text-[#6B7280]">Page {safePage} of {pageCount}</span><button type="button" disabled={safePage >= pageCount} onClick={() => goToPage(safePage + 1)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-[#1F4ED8] disabled:opacity-40">Next <ChevronRight size={16} /></button></nav>}</div></section>
    </>
  );
}
