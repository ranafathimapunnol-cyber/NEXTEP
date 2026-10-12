
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GetStarted from "@/components/ui/GetStarted";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("access_token")));
  }, []);

  const homeHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e5d9]/90 bg-[#fdfcf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href={homeHref} className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7e9dc] text-sm font-bold text-[#343b2d] shadow-sm transition-colors duration-200 group-hover:bg-[#dce1ce]">
            N
          </div>

          <span className="text-lg font-bold tracking-tight text-[#292c25]">
            Nextep
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 rounded-2xl border border-[#eeede5] bg-white/70 p-1 md:flex">
          <Link
            href={homeHref}
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#555b4b] transition-colors duration-200 hover:bg-[#e7e9dc] hover:text-[#343b2d]"
          >
            Home
          </Link>

          {!isLoggedIn && (
            <Link
              href="/about"
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#555b4b] transition-colors duration-200 hover:bg-[#e7e9dc] hover:text-[#343b2d]"
            >
              About
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#e7e9dc] hover:text-[#343b2d] sm:block"
              >
                Log in
              </Link>

              <GetStarted />
            </>
          )}
        </div>
      </div>
    </header>
  );
}