"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: "⌂",
  },
  {
    name: "Tasks",
    href: "/dashboard/tasks",
    icon: "✓",
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: "▦",
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: "○",
  },
];

export default function Sidebar() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    document.cookie =
      "access_token=; path=/; max-age=0; SameSite=Lax";

    router.replace("/login");
  }

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col">

        {/* Logo */}

        <div className="flex h-16 items-center border-b border-gray-100 px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
              N
            </div>

            <span className="text-lg font-bold tracking-tight text-gray-950">
              Nextep
            </span>
          </Link>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 p-4">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>

          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-950"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-sm">
                {item.icon}
              </span>

              {item.name}
            </Link>
          ))}

        </nav>

        {/* Bottom */}

        <div className="border-t border-gray-100 p-4">

          <div className="mb-3 rounded-xl bg-gray-50 p-3">

            <p className="text-sm font-semibold text-gray-900">
              Stay consistent
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Small steps every day lead to meaningful progress.
            </p>

          </div>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-sm">
              ↪
            </span>

            Logout
          </button>

        </div>

      </div>
    </aside>
  );
}