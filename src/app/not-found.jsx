import Link from "next/link";

export const metadata = { title: "Page Not Found | GrowVest" };

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 pt-28 pb-20 bg-[#F4F6F9]">
      <div className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1F4ED8] mb-4">404</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#0B0B0F] mb-5">This page is not on the roadmap.</h1>
        <p className="text-[#6B7280] mb-8">The page may have moved or the address may be incorrect.</p>
        <Link href="/" className="inline-flex rounded-full bg-[#1F4ED8] px-7 py-3.5 font-semibold text-white">Return Home</Link>
      </div>
    </section>
  );
}
