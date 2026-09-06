"use client";

export default function DashboardError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-950">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't load this page.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}