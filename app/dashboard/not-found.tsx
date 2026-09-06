import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-400">
          404
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-950">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}