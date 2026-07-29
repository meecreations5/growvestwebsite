import { GrowVestMark } from "./components/GrowVestMark";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0F] text-white" role="status" aria-live="polite">
      <div className="text-center">
        <GrowVestMark animated ambient decorative className="mx-auto mb-5 h-auto w-24 text-[#1F4ED8]" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">Preparing your journey</p>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
