"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

const inputClass = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#1F4ED8]";
const MAX_FAQS = 10;

export function PageFaqItemsEditor({ items = [], onChange }) {
  const publishedCount = items.filter((item) => item.status === "published" && item.isVisible !== false && item.question?.trim() && item.answer?.trim()).length;
  const update = (index, key, value) => onChange(items.map((item, position) => position === index ? { ...item, [key]: value } : item));
  const remove = (index) => onChange(items.filter((_, position) => position !== index));
  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => {
    if (items.length >= MAX_FAQS) return;
    onChange([...items, { id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, question: "", answer: "", status: "draft", isVisible: true }]);
  };
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-sm font-semibold text-[#111827]">Page-specific questions</p><p className="mt-1 text-xs text-[#64748B]">{publishedCount} published and visible · {items.length} of {MAX_FAQS} questions</p></div>
      <button type="button" onClick={add} disabled={items.length >= MAX_FAQS} className="inline-flex items-center gap-2 rounded-xl border border-[#1F4ED8]/20 bg-[#1F4ED8]/5 px-4 py-2.5 text-sm font-semibold text-[#1F4ED8] disabled:cursor-not-allowed disabled:opacity-40"><Plus size={16} /> Add question</button>
    </div>
    {items.map((item, index) => <fieldset key={item.id || index} className="rounded-2xl border border-[#E2E8F0] bg-[#FAFBFD] p-4 sm:p-5">
      <legend className="px-1 text-xs font-bold uppercase tracking-widest text-[#64748B]">Question {index + 1}</legend>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move question ${index + 1} up`} className="rounded-lg border border-gray-200 bg-white p-2 disabled:opacity-40"><ArrowUp size={15} /></button>
          <button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label={`Move question ${index + 1} down`} className="rounded-lg border border-gray-200 bg-white p-2 disabled:opacity-40"><ArrowDown size={15} /></button>
        </div>
        <button type="button" onClick={() => remove(index)} className="inline-flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-700"><Trash2 size={14} /> Remove</button>
      </div>
      <label className="block text-sm font-semibold text-[#111827]">Question
        <textarea rows={2} maxLength={280} value={item.question || ""} onChange={(event) => update(index, "question", event.target.value)} className={inputClass} placeholder="What would a visitor ask about this page?" />
      </label>
      <label className="mt-4 block text-sm font-semibold text-[#111827]">Answer
        <textarea rows={4} maxLength={5000} value={item.answer || ""} onChange={(event) => update(index, "answer", event.target.value)} className={inputClass} placeholder="Write a clear, factual, visitor-first answer." />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-5">
        <label className="text-xs font-semibold">Publication
          <select value={item.status === "draft" ? "draft" : "published"} onChange={(event) => update(index, "status", event.target.value)} className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs"><option value="draft">Draft</option><option value="published">Published</option></select>
        </label>
        <label className="inline-flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={item.isVisible !== false} onChange={(event) => update(index, "isVisible", event.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> Show on website</label>
      </div>
      {item.status === "published" && (!item.question?.trim() || !item.answer?.trim()) ? <p role="alert" className="mt-3 text-xs font-medium text-amber-700">Add both a question and an answer before publication.</p> : null}
    </fieldset>)}
    {!items.length ? <p className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-6 text-sm text-[#64748B]">No page-specific questions yet. Use Add question, or assign shared questions in FAQ Management.</p> : null}
    <p className="text-xs leading-5 text-[#64748B]">Order here controls on-page display. Published answers render below the page content. You can save new questions as Draft and publish them after editorial/compliance review.</p>
  </div>;
}
