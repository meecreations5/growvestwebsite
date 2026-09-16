"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DownloadCloud, LoaderCircle } from "lucide-react";

export function SeedContentButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function seed() {
    if (!window.confirm("Import missing approved GrowVest Insight previews, articles, categories, tags and author records into Firestore? Existing matching records will be preserved.")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/seed", { method: "POST" });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Import failed.");
      const data = result.result || {};
      window.alert(`Approved Insights import completed: ${data.posts || 0} posts, ${data.categories || 0} categories, ${data.tags || 0} tags and ${data.authors || 0} authors added. ${data.skipped || 0} existing records were preserved.`);
      router.refresh();
    } catch (error) {
      window.alert(error?.message || "Import failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" onClick={seed} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-[#0B0B0F] hover:bg-gray-50 disabled:opacity-60">
      {busy ? <LoaderCircle size={17} className="animate-spin" /> : <DownloadCloud size={17} />}
      Import approved static Insights
    </button>
  );
}
