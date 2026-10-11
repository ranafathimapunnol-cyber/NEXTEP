
import Link from "next/link";
import GetStarted from "@/components/ui/GetStarted";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e7e5d9]/90 bg-[#fdfcf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#343b2d] text-sm font-bold text-[#f8f7f2] shadow-sm transition-colors group-hover:bg-[#4b5740]">
            N
          </div>

          <span className="text-lg font-bold tracking-tight text-[#292c25]">
            Nextep
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 rounded-2xl border border-[#eeede5] bg-white/60 p-1 md:flex">
          <Link
            href="/"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#77796e] transition hover:bg-[#e7e9dc] hover:text-[#343b2d]"
          >
            Home
          </Link>

          <Link
            href="/about"
            className="rounded-xl px-4 py-2 text-sm font-medium text-[#77796e] transition hover:bg-[#e7e9dc] hover:text-[#343b2d]"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#555b4b] transition hover:bg-[#e7e9dc] hover:text-[#343b2d] sm:block"
          >
            Log in
          </Link>

          <GetStarted />
        </div>
      </div>
    </header>
  );
}