
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: "⌂" },
  { name: "Tasks", href: "/dashboard/tasks", icon: "✓" },
  { name: "Categories", href: "/dashboard/categories", icon: "▦" },
  { name: "Profile", href: "/dashboard/profile", icon: "○" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string) {
    return href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      document.cookie =
        "access_token=; path=/; max-age=0; SameSite=Lax";
      document.cookie =
        "refresh_token=; path=/; max-age=0; SameSite=Lax";

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  return (
    <>
      {/* Desktop sidebar — light beige and olive */}
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-[#e8e7dc] bg-[#fdfcf7] text-[#30382a] lg:flex">
        {/* Brand */}
        <Link
          href="/dashboard"
          aria-label="Nextep dashboard"
          className="flex h-[82px] items-center gap-3 border-b border-[#eeede4] px-6"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e5e9d9] text-lg font-bold text-[#4b5b3c]">
            N
          </span>

          <span>
            <span className="block text-lg font-bold tracking-tight text-[#30382a]">
              Nextep
            </span>
            <span className="mt-0.5 block text-[10px] tracking-wide text-[#898d7d]">
              Work with purpose
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex-1 px-4 py-8"
        >
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#969987]">
            Workspace
          </p>

          <div className="space-y-2">
            {navigation.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex min-h-[48px] items-center gap-3 rounded-xl border px-3.5 text-sm transition-all duration-200 ${
                    active
                      ? "border-[#dfe4d2] bg-[#e9ecdf] font-semibold text-[#39452e]"
                      : "border-transparent text-[#737866] hover:border-[#eeede4] hover:bg-[#f4f3ec] hover:text-[#39452e]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors ${
                      active
                        ? "bg-[#d7dfc8] text-[#435238]"
                        : "bg-transparent text-[#858a77] group-hover:bg-[#e9ecdf] group-hover:text-[#435238]"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#71845d]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Small workspace note */}
          <div className="mt-10 rounded-2xl border border-[#e9e8dd] bg-[#f7f6ef] p-4">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#e5e9d9] text-[#586747]">
              ✳
            </div>
            <p className="text-xs font-semibold text-[#46513b]">
              One step at a time
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#898d7d]">
              Small progress adds up to meaningful results.
            </p>
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-[#eeede4] p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-[#747968] transition-colors hover:bg-[#f2eee7] hover:text-[#6d5140] disabled:opacity-50"
          >
            <span aria-hidden="true" className="text-lg">
              ↪
            </span>
            {loggingOut ? "Logging out…" : "Log out"}
          </button>

          <p className="px-3 pb-1 pt-3 text-[10px] text-[#a0a18f]">
            Made for steady progress
          </p>
        </div>
      </aside>

      {/* Mobile bottom navigation — unchanged */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e5e5da] bg-[#fffefb]/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(48,58,41,0.07)] backdrop-blur-lg lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
          {navigation.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition ${
                  active
                    ? "bg-[#e9ecdf] text-[#303a29]"
                    : "text-[#858879] hover:bg-[#f1f1e9] hover:text-[#303a29]"
                }`}
              >
                <span aria-hidden="true" className="text-lg leading-5">
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold leading-4">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
