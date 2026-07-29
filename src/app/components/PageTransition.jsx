"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }) {
  const pathname = usePathname() || "/";

  return (
    <div key={pathname} className="gv-page-transition">
      {children}
    </div>
  );
}
