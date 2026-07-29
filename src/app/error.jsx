"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#F4F6F9] px-5 pt-24 text-center">
      <div className="max-w-[560px] rounded-3xl border border-gray-100 bg-white p-9 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-blue-700">Something went wrong</p>
        <h1 className="mb-4 text-3xl font-bold text-[#0B0B0F]">We could not load this page.</h1>
        <p className="mb-7 text-sm leading-relaxed text-gray-600">
          Please try again. You can also return to the homepage or contact GrowVest directly if the issue continues.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white">Try Again</button>
          <Link href="/" className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700">Go Home</Link>
        </div>
      </div>
    </section>
  );
}
