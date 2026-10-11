
export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7f2]">
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7e9dc]">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#cbd2bd] border-t-[#343b2d]" />
        </div>

        <h2 className="mt-5 text-base font-semibold text-[#343b2d]">
          Preparing your workspace
        </h2>

        <p className="mt-2 text-sm text-[#77796e]">
          Loading your tasks and getting things ready...
        </p>

        <div className="mx-auto mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-[#e7e9dc]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#8c9b76]" />
        </div>
      </div>
    </div>
  );
}