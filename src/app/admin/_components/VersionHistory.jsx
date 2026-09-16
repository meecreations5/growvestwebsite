"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, History, LoaderCircle, RotateCcw } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

function formatDate(value) {
  if (!value) return "Unknown date";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(value));
}

export function VersionHistory({ post, versions }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  async function restore(version) {
    if (!window.confirm(`Restore the version saved on ${formatDate(version.createdAt)}? The current version will be preserved and the restored Insight will return to Draft.`)) return;
    setBusyId(version.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/insights/${post.id}/versions/${version.id}`, { method: "POST" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to restore this version.");
      router.push(`/admin/insights/${post.id}/edit`);
      router.refresh();
    } catch (restoreError) {
      setError(restoreError?.message || "Unable to restore this version.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={`/admin/insights/${post.id}/edit`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#1F4ED8]"><ArrowLeft size={17} /> Back to editor</Link>
      </div>
      <section className="rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="border-b border-black/5 p-5 sm:p-6"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F4ED8]/8 text-[#1F4ED8]"><History size={21} /></span><div><h1 className="font-serif text-2xl font-bold">Version history</h1><p className="mt-1 text-sm text-[#6B7280]">{post.title}</p></div></div></div>
        {error && <p role="alert" className="m-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="divide-y divide-black/5">
          {versions.map((version, index) => (
            <div key={version.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{index === 0 ? "Most recent saved version" : `Saved version ${versions.length - index}`}</p><StatusBadge status={version.status} /></div><p className="mt-1 text-xs text-[#6B7280]">{formatDate(version.createdAt)} · {version.createdByName || "GrowVest Admin"} · {String(version.reason || "update").replaceAll("_", " ")}</p></div>
              <button type="button" disabled={Boolean(busyId)} onClick={() => restore(version)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1F4ED8]/25 bg-[#1F4ED8]/5 px-4 py-2.5 text-sm font-bold text-[#1F4ED8] disabled:opacity-50">{busyId === version.id ? <LoaderCircle size={16} className="animate-spin" /> : <RotateCcw size={16} />} Restore as draft</button>
            </div>
          ))}
          {!versions.length && <div className="px-6 py-16 text-center text-sm text-[#6B7280]">Version history will appear after the first update.</div>}
        </div>
      </section>
    </div>
  );
}
