"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, LoaderCircle, MessageSquareQuote, Save, ShieldCheck } from "lucide-react";
import { TESTIMONIAL_JOURNEY_TYPES, TESTIMONIAL_STATUSES } from "../../data/testimonials";
import { MediaUploadField } from "./MediaUploadField";

const emptyForm = {
  displayName: "A GrowVest Investor",
  city: "",
  journeyType: "financial_clarity",
  quote: "",
  shortQuote: "",
  photo: { url: "", altText: "", focalX: 50, focalY: 50 },
  useInitials: true,
  initials: "GV",
  consentConfirmed: false,
  consentReference: "",
  isFeatured: false,
  showOnHomepage: false,
  showOnInsights: true,
  showOnAbout: false,
  displayOrder: 0,
  status: "draft",
};

function normalizeInitialItem(item) {
  if (!item) return emptyForm;
  return {
    ...emptyForm,
    ...item,
    photo: { ...emptyForm.photo, ...(item.photo || {}) },
  };
}

export function TestimonialEditor({ initialItem = null }) {
  const router = useRouter();
  const isEditing = Boolean(initialItem?.id);
  const [form, setForm] = useState(() => normalizeInitialItem(initialItem));
  const [busy, setBusy] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState("");

  const journeyLabel = useMemo(() => TESTIMONIAL_JOURNEY_TYPES.find((item) => item.value === form.journeyType)?.label || "Investor Journey", [form.journeyType]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(isEditing ? `/api/admin/testimonials/${initialItem.id}` : "/api/admin/testimonials", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save the investor testimonial.");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (saveError) {
      setError(saveError?.message || "Unable to save the investor testimonial.");
    } finally {
      setBusy(false);
    }
  }

  async function archive() {
    if (!isEditing || !window.confirm("Archive this testimonial? It will be removed from every public website location.")) return;
    setArchiving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/testimonials/${initialItem.id}`, { method: "DELETE" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to archive the investor testimonial.");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (archiveError) {
      setError(archiveError?.message || "Unable to archive the investor testimonial.");
    } finally {
      setArchiving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Investor Experiences</p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{isEditing ? "Edit testimonial" : "Add investor testimonial"}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">Publish only genuine, approved investor words. Avoid performance claims, guaranteed outcomes and language that could be interpreted as a financial promise.</p>
      </div>

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-bold">Investor and journey</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Public display name</label>
                <input required value={form.displayName} onChange={(event) => setField("displayName", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]" placeholder="A GrowVest Investor or approved name" />
                <p className="mt-1 text-xs text-[#6B7280]">Use an anonymised name unless the investor has approved full-name publication.</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">City</label>
                <input value={form.city} onChange={(event) => setField("city", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#1F4ED8]" placeholder="Optional" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Journey type</label>
                <select value={form.journeyType} onChange={(event) => setField("journeyType", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm">
                  {TESTIMONIAL_JOURNEY_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Display order</label>
                <input type="number" min="0" value={form.displayOrder} onChange={(event) => setField("displayOrder", Number(event.target.value))} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl font-bold">Approved words</h2>
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold">Full testimonial *</label>
              <textarea required rows="8" value={form.quote} onChange={(event) => setField("quote", event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm leading-6 outline-none focus:border-[#1F4ED8]" placeholder="Enter the investor's approved words exactly as agreed." />
              <p className="mt-1 text-xs text-[#6B7280]">Maximum 1,800 characters. Keep the meaning unchanged when editing for clarity.</p>
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold">Short card quote</label>
              <textarea rows="3" value={form.shortQuote} onChange={(event) => setField("shortQuote", event.target.value)} className="w-full rounded-xl border border-gray-200 p-3 text-sm leading-6 outline-none focus:border-[#1F4ED8]" placeholder="Optional shorter excerpt for compact cards." />
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-emerald-700" size={22} />
              <div>
                <h2 className="font-serif text-2xl font-bold">Consent and evidence</h2>
                <p className="mt-2 text-sm leading-6 text-[#4B5563]">Written permission should cover the quote, approved display name, city, photograph and website locations. Keep the evidence in the appropriate secure internal record.</p>
              </div>
            </div>
            <label className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4 text-sm font-semibold">
              <input type="checkbox" checked={form.consentConfirmed} onChange={(event) => setField("consentConfirmed", event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-600" />
              <span>I confirm that written investor consent has been recorded for this public testimonial.</span>
            </label>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold">Consent reference</label>
              <input value={form.consentReference} onChange={(event) => setField("consentReference", event.target.value)} className="h-11 w-full rounded-xl border border-emerald-200 bg-white px-3 text-sm" placeholder="Internal approval reference, email date or document ID" />
              <p className="mt-1 text-xs text-[#6B7280]">Do not paste sensitive documents or private messages into this public-content record.</p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Public preview</h2>
            <div className="mt-4 rounded-3xl border border-black/5 bg-[#F4F6F9] p-5">
              <MessageSquareQuote size={28} className="text-[#F5B301]" />
              <p className="mt-5 font-serif text-xl font-bold leading-7 text-[#0B0B0F]">“{form.shortQuote || form.quote || "The approved investor experience will appear here."}”</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-white shadow-sm">
                  {form.photo?.url && !form.useInitials ? <img src={form.photo.url} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${form.photo.focalX}% ${form.photo.focalY}%` }} /> : <div className="flex h-full items-center justify-center text-sm font-bold text-[#1F4ED8]">{form.initials || "GV"}</div>}
                </div>
                <div><p className="text-sm font-bold">{form.displayName || "A GrowVest Investor"}</p><p className="text-xs text-[#6B7280]">{journeyLabel}{form.city ? ` · ${form.city}` : ""}</p></div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Investor image</h2>
            <div className="mt-4 overflow-hidden rounded-2xl bg-[#E9EDF5]">
              {form.photo?.url ? <img src={form.photo.url} alt={form.photo.altText || "Investor photograph preview"} className="aspect-square w-full object-cover" style={{ objectPosition: `${form.photo.focalX}% ${form.photo.focalY}%` }} /> : <div className="flex aspect-square items-center justify-center text-sm text-[#6B7280]">No photograph uploaded</div>}
            </div>
            <div className="mt-4"><MediaUploadField value={form.photo?.url} altText={form.photo?.altText} onUploaded={(media) => setField("photo", { ...form.photo, url: media.url, altText: media.altText || form.photo.altText })} /></div>
            <label className="mb-2 mt-4 block text-sm font-semibold">Alternative text</label>
            <input value={form.photo?.altText || ""} onChange={(event) => setField("photo", { ...form.photo, altText: event.target.value })} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm" placeholder="Portrait of ..." />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div><label className="mb-1 block text-xs font-semibold">Horizontal focus</label><input type="range" min="0" max="100" value={form.photo?.focalX ?? 50} onChange={(event) => setField("photo", { ...form.photo, focalX: Number(event.target.value) })} className="w-full accent-[#1F4ED8]" /></div>
              <div><label className="mb-1 block text-xs font-semibold">Vertical focus</label><input type="range" min="0" max="100" value={form.photo?.focalY ?? 50} onChange={(event) => setField("photo", { ...form.photo, focalY: Number(event.target.value) })} className="w-full accent-[#1F4ED8]" /></div>
            </div>
            <label className="mt-4 flex items-start gap-3 text-sm font-semibold"><input type="checkbox" checked={form.useInitials} onChange={(event) => setField("useInitials", event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1F4ED8]" /><span>Show initials instead of the photograph</span></label>
            <label className="mb-2 mt-4 block text-sm font-semibold">Initials</label>
            <input maxLength="4" value={form.initials} onChange={(event) => setField("initials", event.target.value.toUpperCase())} className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm uppercase" />
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold">Publishing</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">Status</label>
                <select value={form.status} onChange={(event) => setField("status", event.target.value)} className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm">
                  {TESTIMONIAL_STATUSES.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                </select>
              </div>
              <label className="flex items-start gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => setField("isFeatured", event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#F5B301]" /><span>Featured testimonial</span></label>
              <div className="rounded-xl bg-[#F4F6F9] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#6B7280]">Additional website previews</p>
                <p className="mt-2 text-xs leading-5 text-[#6B7280]">Every published, consent-approved testimonial appears on the dedicated Investor Experiences page. Choose where else it should be previewed.</p>
                <label className="mt-3 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.showOnHomepage} onChange={(event) => setField("showOnHomepage", event.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> Homepage preview</label>
                <label className="mt-3 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.showOnInsights} onChange={(event) => setField("showOnInsights", event.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> Insights preview</label>
                <label className="mt-3 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.showOnAbout} onChange={(event) => setField("showOnAbout", event.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" /> About GrowVest preview</label>
              </div>
              {error ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
              <button type="submit" disabled={busy || archiving} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} {busy ? "Saving..." : "Save testimonial"}</button>
              {isEditing ? <button type="button" onClick={archive} disabled={busy || archiving} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-60">{archiving ? <LoaderCircle size={16} className="animate-spin" /> : <Archive size={16} />} Archive testimonial</button> : null}
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}
