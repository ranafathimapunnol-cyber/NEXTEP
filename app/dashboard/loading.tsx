export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-950" />

        <p className="mt-4 text-sm text-gray-500">
          Loading your workspace...
        </p>
      </div>
    </div>
  );
}