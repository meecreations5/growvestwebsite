"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Archive, Check, Clipboard, ImagePlus, LoaderCircle, Search, Upload } from "lucide-react";

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ initialItems = [], initialSearch = "", total = 0 }) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState(initialSearch);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  async function upload(file) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("altText", altText);
      body.append("caption", caption);
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to upload image.");
      setItems((current) => [result.media, ...current]);
      setAltText("");
      setCaption("");
      router.refresh();
    } catch (uploadError) {
      setError(uploadError?.message || "Unable to upload image.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function archive(id) {
    if (!window.confirm("Archive this media item? Existing published articles will continue to use its URL.")) return;
    const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return window.alert(result.error || "Unable to archive media.");
    setItems((current) => current.filter((item) => item.id !== id));
  }

  async function copy(item) {
    await navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(""), 1600);
  }

  function submitSearch(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    router.push(`/admin/media${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1F4ED8]/8 text-[#1F4ED8]"><ImagePlus size={24} /></div>
            <h2 className="mt-4 font-serif text-2xl font-bold">Upload an Insight image</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6B7280]">JPG, PNG, WebP or GIF. Maximum 4 MB. Add meaningful alternative text before using the image in a published Insight.</p>
          </div>
          <div className="space-y-3">
            <input value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={250} placeholder="Alternative text" className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#1F4ED8]" />
            <input value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} placeholder="Caption (optional)" className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#1F4ED8]" />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => upload(event.target.files?.[0])} />
            <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{busy ? <LoaderCircle size={17} className="animate-spin" /> : <Upload size={17} />} {busy ? "Uploading…" : "Choose and upload image"}</button>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-black/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-serif text-2xl font-bold">Media library</h2><p className="mt-1 text-xs text-[#6B7280]">{total || items.length} active media item{(total || items.length) === 1 ? "" : "s"}</p></div>
          <form onSubmit={submitSearch} className="relative w-full max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search media" className="h-10 w-full rounded-xl border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-[#1F4ED8]" /></form>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F8FAFC]">
              <div className="aspect-[16/10] bg-white"><img src={item.url} alt={item.altText || ""} className="h-full w-full object-cover" loading="lazy" /></div>
              <div className="p-4"><p className="truncate text-sm font-semibold">{item.originalFileName || item.fileName}</p><p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-[#6B7280]">{item.altText || "No alternative text added"}</p><p className="mt-2 text-[11px] text-[#6B7280]">{formatBytes(item.size)} · {item.contentType?.replace("image/", "").toUpperCase()}</p><div className="mt-4 flex gap-2"><button type="button" onClick={() => copy(item)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-[#1F4ED8]">{copiedId === item.id ? <Check size={14} /> : <Clipboard size={14} />} {copiedId === item.id ? "Copied" : "Copy URL"}</button><button type="button" onClick={() => archive(item.id)} aria-label={`Archive ${item.fileName}`} className="rounded-lg border border-gray-200 bg-white p-2 text-[#E53935]"><Archive size={15} /></button></div></div>
            </article>
          ))}
          {!items.length && <div className="col-span-full py-16 text-center text-sm text-[#6B7280]">No media items found.</div>}
        </div>
      </section>
    </div>
  );
}
