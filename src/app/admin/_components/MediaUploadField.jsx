"use client";

import { useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Upload } from "lucide-react";

export function MediaUploadField({ label = "Upload image", value = "", altText = "", onUploaded, compact = false }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("altText", altText || "");
      const response = await fetch("/api/admin/media", { method: "POST", body });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to upload image.");
      onUploaded?.(result.media);
    } catch (uploadError) {
      setError(uploadError?.message || "Unable to upload image.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => upload(event.target.files?.[0])} />
      <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className={`inline-flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#1F4ED8]/35 bg-[#1F4ED8]/5 font-bold text-[#1F4ED8] hover:bg-[#1F4ED8]/10 disabled:opacity-60 ${compact ? "px-3 py-2 text-xs" : "w-full px-4 py-3 text-sm"}`}>
        {busy ? <LoaderCircle size={16} className="animate-spin" /> : value ? <Upload size={16} /> : <ImagePlus size={16} />}
        {busy ? "Uploading…" : value ? "Replace image" : label}
      </button>
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
