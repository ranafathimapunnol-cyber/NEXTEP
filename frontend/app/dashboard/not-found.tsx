
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7f2] px-6 text-[#292c25]">
      <div className="w-full max-w-md rounded-3xl border border-[#e7e5d9] bg-[#fdfcf8] p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e7e9dc] text-2xl font-semibold text-[#58664a]">
          404
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#85877e]">
          Wrong turn?
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#343b2d]">
          Page not found
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#77796e]">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>

        <Link
          href="/dashboard"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8c9b76]"
        >
          <span aria-hidden="true">←</span>
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}