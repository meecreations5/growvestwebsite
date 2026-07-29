"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

function Field({ label, value, onChange, textarea = false, rows = 4, help = "", required = false }) {
  const Input = textarea ? "textarea" : "input";
  return <div><label className="mb-2 block text-sm font-semibold">{label}{required ? " *" : ""}</label><Input required={required} rows={textarea ? rows : undefined} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className={`${textarea ? "min-h-[110px] py-3" : "h-11"} w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#1F4ED8]`} />{help ? <p className="mt-1.5 text-xs leading-5 text-[#6B7280]">{help}</p> : null}</div>;
}

function lines(value) {
  return Array.isArray(value) ? value.join("\n\n") : "";
}

function paragraphs(value) {
  return String(value || "").split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
}

function trustLines(value) {
  return Array.isArray(value) ? value.map((item) => `${item.value} | ${item.label}`).join("\n") : "";
}

function parseTrust(value) {
  return String(value || "").split("\n").map((line) => {
    const [metric, ...label] = line.split("|");
    return { value: metric?.trim(), label: label.join("|").trim() };
  }).filter((item) => item.value && item.label);
}

export function WebsitePageEditor({ pageKey, initialItem }) {
  const [form, setForm] = useState(initialItem);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [trustText, setTrustText] = useState(trustLines(initialItem?.content?.trust?.items));
  const [storyText, setStoryText] = useState(lines(initialItem?.content?.brandStory?.paragraphs));
  const [beliefText, setBeliefText] = useState(lines(initialItem?.content?.brandBelief?.paragraphs));

  const content = form?.content || {};
  const isHome = pageKey === "home";
  const title = useMemo(() => isHome ? "Homepage content" : "About GrowVest content", [isHome]);

  function setRoot(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function setSeo(name, value) {
    setForm((current) => ({ ...current, seo: { ...(current.seo || {}), [name]: value } }));
  }

  function setSection(section, name, value) {
    setForm((current) => ({
      ...current,
      content: {
        ...(current.content || {}),
        [section]: { ...(current.content?.[section] || {}), [name]: value },
      },
    }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        ...form,
        content: {
          ...form.content,
          ...(isHome ? {
            trust: { ...form.content.trust, items: parseTrust(trustText) },
            brandBelief: { ...form.content.brandBelief, paragraphs: paragraphs(beliefText) },
          } : {
            brandStory: { ...form.content.brandStory, paragraphs: paragraphs(storyText) },
          }),
        },
      };
      const response = await fetch(`/api/admin/website/pages/${pageKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save website content.");
      setForm(result.item);
      setMessage("Saved directly to Firestore. Published changes will appear after cache revalidation.");
    } catch (saveError) {
      setError(saveError?.message || "Unable to save website content.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1F4ED8]">Website Content</p><h1 className="mt-2 font-serif text-4xl font-bold">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">Edit approved content and push it directly to the shared GrowVest database.</p></div>
        <div className="flex gap-3"><select value={form.status || "draft"} onChange={(event) => setRoot("status", event.target.value)} className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select><button type="submit" disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-5 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} Save to database</button></div>
      </div>

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div><h2 className="font-serif text-2xl font-bold">Page and SEO</h2><p className="mt-1 text-sm text-[#6B7280]">Control the title, search snippet, canonical URL and social sharing image.</p></div>
          <a href={pageKey === "home" ? "/" : "/about"} target="_blank" rel="noreferrer noopener" className="text-sm font-bold text-[#1F4ED8]">Preview public page →</a>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Admin page title" value={form.title} onChange={(value) => setRoot("title", value)} required />
          <div><Field label="SEO title" value={form.seo?.title} onChange={(value) => setSeo("title", value)} help="Recommended: clear, unique and usually within 50–60 characters including the brand." /><p className="mt-1 text-right text-xs text-[#6B7280]">{String(form.seo?.title || "").length} characters</p></div>
          <div className="sm:col-span-2"><Field label="Meta description" value={form.seo?.description} onChange={(value) => setSeo("description", value)} textarea rows={3} help="Recommended: a useful summary around 140–160 characters. Google may rewrite snippets." /><p className="mt-1 text-right text-xs text-[#6B7280]">{String(form.seo?.description || "").length} characters</p></div>
          <Field label="Canonical URL" value={form.seo?.canonicalUrl} onChange={(value) => setSeo("canonicalUrl", value)} help="Leave blank to use the normal GrowVest page URL." />
          <Field label="Open Graph image URL" value={form.seo?.openGraphImage} onChange={(value) => setSeo("openGraphImage", value)} help="Recommended size: 1200 × 630 px. Leave blank to use the default GrowVest image." />
          <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.seo?.allowIndexing !== false} onChange={(event) => setSeo("allowIndexing", event.target.checked)} className="h-4 w-4 accent-[#1F4ED8]" />Allow public indexing when published</label>
          <div className="sm:col-span-2 rounded-xl border border-gray-200 bg-[#F8FAFC] p-4">
            <p className="text-xs text-emerald-700">growvest.info › {pageKey === "home" ? "" : "about"}</p>
            <p className="mt-1 text-lg text-[#1F4ED8]">{form.seo?.title || form.title || "Page title"}</p>
            <p className="mt-1 text-sm leading-5 text-[#6B7280]">{form.seo?.description || "Your page description will appear here."}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Hero section</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Eyebrow" value={content.hero?.eyebrow} onChange={(value) => setSection("hero", "eyebrow", value)} /><Field label={isHome ? "Supporting footer line" : "Positioning"} value={isHome ? content.hero?.footerLine : content.hero?.positioning} onChange={(value) => setSection("hero", isHome ? "footerLine" : "positioning", value)} /><Field label="Heading line 1" value={isHome ? content.hero?.headlineTop : content.hero?.headingTop} onChange={(value) => setSection("hero", isHome ? "headlineTop" : "headingTop", value)} /><Field label="Highlighted heading" value={isHome ? content.hero?.headlineAccent : content.hero?.headingAccent} onChange={(value) => setSection("hero", isHome ? "headlineAccent" : "headingAccent", value)} />{isHome ? <Field label="Heading line 2" value={content.hero?.headlineBottom} onChange={(value) => setSection("hero", "headlineBottom", value)} /> : null}<div className={isHome ? "sm:col-span-2" : "sm:col-span-2"}><Field label="Description" value={content.hero?.description} onChange={(value) => setSection("hero", "description", value)} textarea rows={4} /></div><Field label="Primary CTA label" value={content.hero?.primaryCtaLabel} onChange={(value) => setSection("hero", "primaryCtaLabel", value)} /><Field label="Primary CTA link" value={content.hero?.primaryCtaHref} onChange={(value) => setSection("hero", "primaryCtaHref", value)} /><Field label="Secondary CTA label" value={content.hero?.secondaryCtaLabel} onChange={(value) => setSection("hero", "secondaryCtaLabel", value)} /><Field label="Secondary CTA link" value={content.hero?.secondaryCtaHref} onChange={(value) => setSection("hero", "secondaryCtaHref", value)} /></div></section>

      {isHome ? <>
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Trust strip</h2><div className="mt-5 space-y-4"><Field label="Metrics" value={trustText} onChange={setTrustText} textarea rows={6} help="One per line: Value | Label" /><Field label="Disclosure" value={content.trust?.disclosure} onChange={(value) => setSection("trust", "disclosure", value)} textarea rows={3} /><div className="grid gap-4 sm:grid-cols-2"><Field label="Disclosure link label" value={content.trust?.disclosureLinkLabel} onChange={(value) => setSection("trust", "disclosureLinkLabel", value)} /><Field label="Disclosure link" value={content.trust?.disclosureLinkHref} onChange={(value) => setSection("trust", "disclosureLinkHref", value)} /></div></div></section>
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Brand belief</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Eyebrow" value={content.brandBelief?.eyebrow} onChange={(value) => setSection("brandBelief", "eyebrow", value)} /><Field label="Heading line 1" value={content.brandBelief?.headingLine1} onChange={(value) => setSection("brandBelief", "headingLine1", value)} /><Field label="Heading line 2" value={content.brandBelief?.headingLine2} onChange={(value) => setSection("brandBelief", "headingLine2", value)} /><Field label="Heading line 3" value={content.brandBelief?.headingLine3} onChange={(value) => setSection("brandBelief", "headingLine3", value)} /><Field label="Highlighted phrase" value={content.brandBelief?.headingAccent} onChange={(value) => setSection("brandBelief", "headingAccent", value)} /><div className="sm:col-span-2"><Field label="Paragraphs" value={beliefText} onChange={setBeliefText} textarea rows={7} help="Separate paragraphs with a blank line." /></div></div></section>
      </> : <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Brand story</h2><div className="mt-5 grid gap-4"><Field label="Eyebrow" value={content.brandStory?.eyebrow} onChange={(value) => setSection("brandStory", "eyebrow", value)} /><Field label="Heading" value={content.brandStory?.heading} onChange={(value) => setSection("brandStory", "heading", value)} /><Field label="Story paragraphs" value={storyText} onChange={setStoryText} textarea rows={18} help="Separate paragraphs with a blank line. The final paragraph is presented with greater emphasis." /></div></section>}

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Vision and mission</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Vision title" value={content.visionMission?.visionTitle} onChange={(value) => setSection("visionMission", "visionTitle", value)} /><Field label="Mission title" value={content.visionMission?.missionTitle} onChange={(value) => setSection("visionMission", "missionTitle", value)} /><Field label="Vision copy" value={content.visionMission?.visionCopy} onChange={(value) => setSection("visionMission", "visionCopy", value)} textarea rows={5} /><Field label="Mission copy" value={content.visionMission?.missionCopy} onChange={(value) => setSection("visionMission", "missionCopy", value)} textarea rows={5} /></div></section>

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-serif text-2xl font-bold">Closing call to action</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{isHome ? <Field label="Eyebrow" value={content.finalCta?.eyebrow} onChange={(value) => setSection("finalCta", "eyebrow", value)} /> : null}<Field label="Heading line 1" value={content.finalCta?.headingTop} onChange={(value) => setSection("finalCta", "headingTop", value)} /><Field label="Highlighted heading" value={content.finalCta?.headingAccent} onChange={(value) => setSection("finalCta", "headingAccent", value)} /><div className="sm:col-span-2"><Field label="Description" value={content.finalCta?.description} onChange={(value) => setSection("finalCta", "description", value)} textarea rows={4} /></div><Field label="Primary CTA label" value={isHome ? content.finalCta?.primaryCtaLabel : content.finalCta?.ctaLabel} onChange={(value) => setSection("finalCta", isHome ? "primaryCtaLabel" : "ctaLabel", value)} /><Field label="Primary CTA link" value={isHome ? content.finalCta?.primaryCtaHref : content.finalCta?.ctaHref} onChange={(value) => setSection("finalCta", isHome ? "primaryCtaHref" : "ctaHref", value)} />{isHome ? <><Field label="Secondary CTA label" value={content.finalCta?.secondaryCtaLabel} onChange={(value) => setSection("finalCta", "secondaryCtaLabel", value)} /><Field label="Secondary CTA link" value={content.finalCta?.secondaryCtaHref} onChange={(value) => setSection("finalCta", "secondaryCtaHref", value)} /></> : null}</div></section>

      {message ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      <div className="sticky bottom-4 flex justify-end"><button type="submit" disabled={busy} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-6 text-sm font-bold text-white shadow-xl disabled:opacity-60">{busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />} Save directly to Firestore</button></div>
    </form>
  );
}
