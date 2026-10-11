
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: "⌂" },
  { name: "Tasks", href: "/dashboard/tasks", icon: "✓" },
  { name: "Categories", href: "/dashboard/categories", icon: "▦" },
  { name: "Profile", href: "/dashboard/profile", icon: "○" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    document.cookie =
      "access_token=; path=/; max-age=0; SameSite=Lax";

    router.replace("/login");
  }

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#e7e5d9] bg-[#fdfcf8] lg:block">
      <div className="flex min-h-screen flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center border-b border-[#eeede5] px-6">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#343b2d] text-lg font-bold text-[#f8f7f2] shadow-sm transition group-hover:bg-[#4b5740]">
              N
            </div>

            <div>
              <span className="block text-lg font-bold tracking-tight text-[#292c25]">
                Nextep
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8c9b76]">
                Work with purpose
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-7">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#96988b]">
            Workspace
          </p>

          {navigation.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e7e9dc] text-[#343b2d] shadow-sm"
                    : "text-[#77796e] hover:bg-[#f1f1e9] hover:text-[#343b2d]"
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-[#71845d]" />
                )}

                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-base transition ${
                    isActive
                      ? "bg-[#343b2d] text-white"
                      : "bg-[#f1f0e8] text-[#77796e] group-hover:bg-[#e7e9dc] group-hover:text-[#343b2d]"
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.name}</span>

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#71845d]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Encouragement card and logout */}
        <div className="border-t border-[#eeede5] p-4">
          <div className="mb-4 overflow-hidden rounded-2xl border border-[#e5e7d9] bg-[#f0f1e7] p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#dfe4d3] text-lg text-[#4c5c3f]">
              ✳
            </div>

            <p className="text-sm font-semibold text-[#343b2d]">
              Stay consistent
            </p>

            <p className="mt-1 text-xs leading-5 text-[#77796e]">
              Small steps every day lead to meaningful progress.
            </p>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#dfe2d3]">
              <div className="h-full w-2/3 rounded-full bg-[#8c9b76]" />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#77796e] transition hover:bg-[#f6e9e3] hover:text-[#a44d3f]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1f0e8] text-base transition group-hover:bg-[#f2ddd5]">
              ↪
            </span>
            Logout
          </button>

          <p className="mt-4 text-center text-[10px] tracking-wide text-[#a1a194]">
            Made for steady progress · Nextep
          </p>
        </div>
      </div>
    </aside>
  );
}