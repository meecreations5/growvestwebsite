import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[#F4F6F9] px-5 py-20">
      <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E53935]">Access restricted</p>
        <h1 className="mt-4 font-serif text-4xl font-bold text-[#0B0B0F]">This workspace is not available to your role.</h1>
        <p className="mt-4 text-sm leading-6 text-[#6B7280]">Please contact the GrowVest Website Super Admin if you believe your access should be updated.</p>
        <Link href="/admin" className="mt-8 inline-flex rounded-full bg-[#1F4ED8] px-6 py-3 text-sm font-semibold text-white">Return to Admin</Link>
      </div>
    </main>
  );
}
