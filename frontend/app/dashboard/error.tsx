
"use client";

export default function DashboardError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7f2] px-6 text-[#292c25]">
      <div className="w-full max-w-md rounded-3xl border border-[#e7e5d9] bg-[#fdfcf8] p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e7e9dc] text-3xl text-[#58664a]">
          ✳
        </div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#85877e]">
          Something unexpected happened
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#343b2d]">
          Something went wrong
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#77796e]">
          We couldn&apos;t load this page. Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-7 w-full rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8c9b76]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}