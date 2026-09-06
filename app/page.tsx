import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Organize everything",
    description:
      "Keep your tasks, priorities, and daily work organized in one focused workspace.",
  },
  {
    number: "02",
    title: "Know what matters",
    description:
      "Use priorities and categories to quickly understand where your attention should go.",
  },
  {
    number: "03",
    title: "Keep moving",
    description:
      "Track your progress, complete tasks, and build momentum one step at a time.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute left-1/2 top-[-180px] -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gray-200/60 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Your productivity, one step ahead
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold tracking-[-0.04em] text-gray-950 sm:text-6xl lg:text-7xl">
              Plan your work.
              <br />
              <span className="text-gray-400">Take your next step.</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Nextep gives you a simple, focused workspace to organize tasks,
              prioritize what matters, and keep making progress.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="flex h-12 w-full items-center justify-center rounded-full bg-gray-950 px-7 text-sm font-semibold text-white shadow-lg shadow-gray-300 transition hover:-translate-y-0.5 hover:bg-gray-800 sm:w-auto"
              >
                Start using Nextep
                <span className="ml-2">→</span>
              </Link>

              <Link
                href="/about"
                className="flex h-12 w-full items-center justify-center rounded-full border border-gray-200 bg-white px-7 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
              >
                Explore Nextep
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/70">
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-[#f7f7f8]">
                {/* Fake browser header */}
                <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-5 py-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />

                  <div className="ml-4 h-7 flex-1 rounded-md bg-gray-100" />
                </div>

                {/* Dashboard preview */}
                <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-[180px_1fr]">
                  {/* Sidebar */}
                  <aside className="hidden border-r border-gray-200 bg-white p-5 md:block">
                    <div className="mb-8 text-lg font-bold">Nextep</div>

                    <div className="space-y-2">
                      <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium">
                        Overview
                      </div>

                      <div className="px-3 py-2 text-sm text-gray-500">
                        My Tasks
                      </div>

                      <div className="px-3 py-2 text-sm text-gray-500">
                        Categories
                      </div>

                      <div className="px-3 py-2 text-sm text-gray-500">
                        Completed
                      </div>
                    </div>
                  </aside>

                  {/* Main dashboard */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                          Monday, September 7
                        </p>

                        <h2 className="mt-2 text-2xl font-bold">
                          Good morning 👋
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Here&apos;s what needs your attention today.
                        </p>
                      </div>

                      <div className="hidden rounded-lg bg-gray-950 px-4 py-2 text-xs font-medium text-white sm:block">
                        + New Task
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs text-gray-400">Tasks</p>
                        <p className="mt-2 text-2xl font-bold">24</p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs text-gray-400">Completed</p>
                        <p className="mt-2 text-2xl font-bold">18</p>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <p className="text-xs text-gray-400">Progress</p>
                        <p className="mt-2 text-2xl font-bold">75%</p>
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Today&apos;s tasks</h3>

                        <span className="text-xs text-gray-400">
                          4 remaining
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Finish project documentation
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              Work
                            </p>
                          </div>

                          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-500">
                            High
                          </span>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Review weekly goals
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              Personal
                            </p>
                          </div>

                          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-500">
                            Medium
                          </span>
                        </div>

                        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-950 text-[9px] text-white">
                            ✓
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-400 line-through">
                              Plan tomorrow&apos;s schedule
                            </p>
                            <p className="mt-1 text-xs text-gray-300">
                              Personal
                            </p>
                          </div>

                          <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-400">
                            Done
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              Why Nextep
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay focused.
            </h2>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.number} className="bg-white p-8">
                <span className="text-sm font-semibold text-gray-300">
                  {feature.number}
                </span>

                <h3 className="mt-12 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Your next step starts here
          </p>

          <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Turn your plans into progress.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-gray-400">
            Create your workspace, organize your tasks, and start moving
            forward with Nextep.
          </p>

          <Link
            href="/login"
            className="mt-9 inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
          >
            Get started
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}