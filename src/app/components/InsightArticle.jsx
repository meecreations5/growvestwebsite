import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, ExternalLink, UserRound } from "lucide-react";
import { BLACK, GOLD, dotGrid } from "../lib/brand";
import { InsightCta, InsightShare, InsightViewTracker } from "./InsightEngagement";

function formatDate(value) {
  return value ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value)) : "";
}

function videoEmbedUrl(value) {
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
    }
    if (url.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${url.pathname.replace("/", "")}`;
    if (url.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${url.pathname.split("/").filter(Boolean).pop()}`;
    return "";
  } catch {
    return "";
  }
}

function Block({ block }) {
  if (block.type === "heading2") return <h2 className="mt-12 font-serif text-3xl font-bold leading-tight text-[#0B0B0F]">{block.text}</h2>;
  if (block.type === "heading3") return <h3 className="mt-9 font-serif text-2xl font-bold leading-tight text-[#0B0B0F]">{block.text}</h3>;
  if (block.type === "lead") return <p className="text-xl leading-9 text-[#333844]">{block.text}</p>;
  if (block.type === "quote") return <blockquote className="my-10 border-l-4 border-[#F5B301] bg-[#F4F6F9] px-6 py-5 font-serif text-2xl italic leading-9 text-[#0B0B0F]">{block.text}</blockquote>;
  if (block.type === "callout") return <aside className="my-9 rounded-2xl border border-[#1F4ED8]/15 bg-[#1F4ED8]/5 p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">{block.title || "GrowVest perspective"}</p><p className="mt-3 leading-7 text-[#3E4653]">{block.text}</p></aside>;
  if (block.type === "list") return <ul className="my-6 space-y-3 pl-5">{(block.items || []).filter(Boolean).map((item, index) => <li key={`${block.id}-${index}`} className="list-disc pl-2 leading-7 text-[#4B5563]">{item}</li>)}</ul>;
  if (block.type === "disclaimer") return <aside className="my-10 rounded-2xl border border-gray-200 bg-[#F4F6F9] p-5 text-xs leading-6 text-[#6B7280]"><strong className="text-[#0B0B0F]">Important:</strong> {block.text}</aside>;
  if (block.type === "divider") return <div className="my-12 h-px bg-gradient-to-r from-transparent via-[#1F4ED8]/30 to-transparent" />;
  if (block.type === "image" && block.url) return <figure className="my-10"><div className="aspect-[16/9] overflow-hidden rounded-2xl bg-[#F4F6F9]"><img src={block.url} alt={block.altText || ""} className="h-full w-full object-cover" style={{ objectPosition: `${block.focalX ?? 50}% ${block.focalY ?? 50}%` }} loading="lazy" /></div>{block.caption && <figcaption className="mt-3 text-center text-xs leading-5 text-[#6B7280]">{block.caption}</figcaption>}</figure>;
  if (block.type === "table" && ((block.headers || []).length || (block.rows || []).length)) return <div className="my-10 overflow-x-auto rounded-2xl border border-gray-200"><table className="min-w-full text-left text-sm"><thead className="bg-[#0B0B0F] text-white"><tr>{(block.headers || []).map((header, index) => <th key={`${block.id}-h-${index}`} className="px-4 py-3 font-semibold">{header}</th>)}</tr></thead><tbody className="divide-y divide-gray-200">{(block.rows || []).map((row, rowIndex) => <tr key={`${block.id}-r-${rowIndex}`} className="even:bg-[#F4F6F9]">{row.map((cell, cellIndex) => <td key={`${block.id}-${rowIndex}-${cellIndex}`} className="px-4 py-3 leading-6 text-[#4B5563]">{cell}</td>)}</tr>)}</tbody></table></div>;
  if (block.type === "cta") {
    const external = /^https?:\/\//i.test(block.buttonHref || "");
    const classes = block.variant === "gold" ? "bg-[#F5B301] text-[#0B0B0F]" : block.variant === "secondary" ? "border border-[#1F4ED8] text-[#1F4ED8]" : "bg-[#1F4ED8] text-white";
    return <aside className="my-10 rounded-3xl bg-[#F4F6F9] p-7 sm:p-8"><h3 className="font-serif text-2xl font-bold text-[#0B0B0F]">{block.title || "Continue the conversation"}</h3>{block.text && <p className="mt-3 leading-7 text-[#6B7280]">{block.text}</p>}{block.buttonHref && <Link href={block.buttonHref} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={`mt-6 inline-flex rounded-full px-5 py-3 text-sm font-bold ${classes}`}>{block.buttonLabel || "Learn more"}</Link>}</aside>;
  }
  if (block.type === "video") {
    const embed = videoEmbedUrl(block.url);
    if (!embed) return null;
    return <figure className="my-10"><div className="aspect-video overflow-hidden rounded-2xl bg-black"><iframe src={embed} title={block.caption || "GrowVest video"} className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>{block.caption && <figcaption className="mt-3 text-center text-xs text-[#6B7280]">{block.caption}</figcaption>}</figure>;
  }
  return <p className="mt-6 text-[17px] leading-8 text-[#4B5563]">{block.text}</p>;
}

export function InsightArticle({ post, author, categories, relatedPosts = [], previewMode = false }) {
  const categoryMap = Object.fromEntries((categories || []).map((item) => [item.id, item]));
  return <article>
    {!previewMode && <InsightViewTracker postId={post.id} slug={post.slug} />}
    {previewMode && <div className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-[#F5B301] px-5 py-3 text-sm font-bold text-[#0B0B0F]"><span>Draft preview — this page is visible only to authorised website admins.</span><Link href={`/admin/insights/${post.id}/edit`} className="rounded-full bg-[#0B0B0F] px-4 py-2 text-xs text-white">Return to editor</Link></div>}
    <header className="relative overflow-hidden" style={{ background: BLACK, ...dotGrid, paddingTop: previewMode ? "0" : "72px" }}><div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 65% at 72% 28%, rgba(31,78,216,.18), transparent 68%)" }} /><div className="relative mx-auto max-w-[1080px] px-5 py-20 sm:px-6 lg:px-8 lg:py-28"><Link href={previewMode ? `/admin/insights/${post.id}/edit` : "/insights"} className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-white"><ArrowLeft size={16} /> {previewMode ? "Back to editor" : "Back to Insights"}</Link><div className="mt-10 flex flex-wrap gap-2">{(post.categoryIds || []).map((id) => <span key={id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white/70">{categoryMap[id]?.name || id}</span>)}</div><h1 className="mt-7 max-w-4xl font-serif text-[40px] font-bold leading-[1.08] text-white sm:text-[52px] lg:text-[64px]">{post.title}</h1><p className="mt-7 max-w-3xl text-lg leading-8 text-white/60">{post.excerpt}</p><div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-white/50"><span className="inline-flex items-center gap-2"><Calendar size={15} />{formatDate(post.publishedAt || post.scheduledAt || post.updatedAt)}</span><span className="inline-flex items-center gap-2"><Clock size={15} />{post.readingTime || 5} min read</span><span className="inline-flex items-center gap-2"><UserRound size={15} />{author?.name || post.authorName || "GrowVest Editorial Team"}</span></div></div></header>
    {post.featuredImage?.url && <div className="bg-white"><figure className="mx-auto max-w-[1080px] px-5 pt-12 sm:px-6 lg:px-8"><div className="aspect-[16/9] overflow-hidden rounded-3xl bg-[#F4F6F9]"><img src={post.featuredImage.url} alt={post.featuredImage.altText || ""} className="h-full w-full object-cover" style={{ objectPosition: `${post.featuredImage.focalX ?? 50}% ${post.featuredImage.focalY ?? 50}%` }} /></div>{post.featuredImage.caption && <figcaption className="mt-3 text-center text-xs text-[#6B7280]">{post.featuredImage.caption}</figcaption>}</figure></div>}
    <div className="bg-white py-16 lg:py-24"><div className="mx-auto grid max-w-[1080px] gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:px-8"><div>{(post.blocks || []).map((block) => <Block key={block.id} block={block} />)}</div><aside className="h-fit rounded-2xl border border-gray-200 bg-[#F4F6F9] p-5 lg:sticky lg:top-24"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1F4ED8]">About this Insight</p><p className="mt-4 text-sm leading-6 text-[#6B7280]">Published for general educational awareness. It does not replace personalised advice from an appropriately qualified professional.</p>{!previewMode && <div className="mt-5"><InsightShare postId={post.id} title={post.title} /></div>}{(post.sourceReferences || []).length > 0 && <div className="mt-6 border-t border-gray-200 pt-5"><p className="text-sm font-bold">Sources</p><div className="mt-3 space-y-3">{post.sourceReferences.map((source, index) => <a key={`${source.url}-${index}`} href={source.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-xs leading-5 text-[#1F4ED8]">{source.label || source.url}<ExternalLink size={12} className="mt-1 shrink-0" /></a>)}</div></div>}</aside></div></div>
    {!previewMode && relatedPosts.length > 0 && <section className="bg-[#F4F6F9] py-16 lg:py-20"><div className="mx-auto max-w-[1080px] px-5 sm:px-6 lg:px-8"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Continue exploring</p><h2 className="mt-3 font-serif text-3xl font-bold">Related GrowVest Insights</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{relatedPosts.map((related) => <article key={related.id} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-serif text-xl font-bold leading-tight">{related.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6B7280]">{related.excerpt}</p><Link href={`/insights/${related.slug}`} className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#1F4ED8]">Read Insight <ArrowRight size={15} /></Link></article>)}</div></div></section>}
    <section className="bg-[#F4F6F9] py-16 text-center"><div className="mx-auto max-w-2xl px-5"><p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Your Conscious Wealth Partner</p><h2 className="mt-4 font-serif text-4xl font-bold">Bring your goals into a clearer conversation.</h2>{previewMode ? <Link href={`/admin/insights/${post.id}/edit`} className="mt-7 inline-flex rounded-full bg-[#1F4ED8] px-6 py-3 text-sm font-bold text-white">Return to Editor</Link> : <InsightCta postId={post.id} />}</div></section>
  </article>;
}
