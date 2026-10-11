
import Link from "next/link";

const features = [
  {
    number: "01",
    symbol: "◫",
    title: "Organize everything",
    description:
      "Keep your tasks, priorities, and daily work organized in one focused workspace.",
  },
  {
    number: "02",
    symbol: "✳",
    title: "Know what matters",
    description:
      "Use priorities and categories to understand where your attention should go.",
  },
  {
    number: "03",
    symbol: "↗",
    title: "Keep moving",
    description:
      "Track your progress, complete tasks, and build momentum one step at a time.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#292c25]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full border-[55px] border-[#e7e9dc]/60" />
        <div className="pointer-events-none absolute -left-32 top-72 h-80 w-80 rounded-full border-[45px] border-[#e7e9dc]/40" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pb-24 sm:pt-24 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e5e5d9] bg-white/80 px-4 py-2 text-xs font-medium text-[#6f795f] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#8c9b76]" />
              Your productivity, one step ahead
            </div>

            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Plan your work.
              <br />
              <span className="text-[#8c9b76]">Take your next step.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#77796e] sm:text-lg">
              Nextep gives you a simple, focused workspace to organize
              tasks, prioritize what matters, and keep making progress.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-[#343b2d] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#343b2d]/10 transition hover:-translate-y-0.5 hover:bg-[#454d3c] sm:w-auto"
              >
                Start using Nextep <span>→</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex h-13 w-full items-center justify-center rounded-2xl border border-[#e5e3d9] bg-white px-7 py-4 text-sm font-semibold text-[#505448] transition hover:bg-[#f1f1e9] sm:w-auto"
              >
                Discover Nextep
              </Link>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="rounded-[28px] border border-[#e5e3d9] bg-white p-2 shadow-2xl shadow-[#343b2d]/10 sm:p-3">
              <div className="overflow-hidden rounded-[21px] border border-[#eeede6] bg-[#f8f7f2]">
                {/* Browser header */}
                <div className="flex items-center gap-2 border-b border-[#eae8df] bg-white px-4 py-4 sm:px-6">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d7d7ca]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d7d7ca]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d7d7ca]" />
                  <div className="ml-3 flex-1 rounded-lg bg-[#f8f7f2] px-4 py-2 text-center text-[10px] text-[#a1a195]">
                    nextep / dashboard
                  </div>
                </div>

                <div className="grid min-h-[400px] md:grid-cols-[170px_minmax(0,1fr)]">
                  {/* Preview sidebar */}
                  <aside className="hidden border-r border-[#eae8df] bg-white p-5 md:block">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#343b2d] text-sm text-white">
                        N
                      </span>
                      Nextep
                    </div>

                    <p className="mb-3 mt-8 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#aaa99e]">
                      Workspace
                    </p>

                    <div className="space-y-2 text-xs">
                      <div className="rounded-xl bg-[#e7e9dc] px-3 py-3 font-semibold text-[#4e5b40]">
                        ◫ &nbsp; Overview
                      </div>
                      <div className="rounded-xl px-3 py-3 text-[#85877e]">
                        ≡ &nbsp; My tasks
                      </div>
                      <div className="rounded-xl px-3 py-3 text-[#85877e]">
                        ◷ &nbsp; In progress
                      </div>
                      <div className="rounded-xl px-3 py-3 text-[#85877e]">
                        ✓ &nbsp; Completed
                      </div>
                    </div>

                    <div className="mt-8 rounded-2xl bg-[#f8f7f2] p-3">
                      <span className="text-lg text-[#7b8967]">✳</span>
                      <p className="mt-2 text-xs font-semibold">Stay focused</p>
                      <p className="mt-1 text-[10px] leading-4 text-[#929389]">
                        One step at a time.
                      </p>
                    </div>
                  </aside>

                  {/* Preview dashboard */}
                  <div className="min-w-0 p-4 sm:p-7">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#929389]">
                          YOUR WORKSPACE
                        </p>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                          Good morning ✳
                        </h2>
                        <p className="mt-2 text-xs text-[#85877e] sm:text-sm">
                          A little progress goes a long way.
                        </p>
                      </div>
                      <span className="hidden rounded-xl bg-[#343b2d] px-3 py-2 text-[10px] font-semibold text-white sm:inline-block">
                        + New task
                      </span>
                    </div>

                    {/* Illustrative statistics */}
                    <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
                      {[
                        ["Tasks", "24"],
                        ["Completed", "18"],
                        ["Progress", "75%"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-[#eae8df] bg-white p-3 sm:p-4"
                        >
                          <p className="text-[10px] text-[#929389] sm:text-xs">
                            {label}
                          </p>
                          <p className="mt-2 text-xl font-semibold sm:text-2xl">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Illustrative tasks */}
                    <div className="mt-5 rounded-2xl border border-[#eae8df] bg-white p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold">
                          Today&apos;s tasks
                        </h3>
                        <span className="text-[10px] text-[#929389]">
                          4 remaining
                        </span>
                      </div>

                      <div className="mt-4 space-y-2.5">
                        {[
                          {
                            title: "Finish project documentation",
                            category: "Work",
                            priority: "High",
                            color: "bg-rose-50 text-rose-700",
                            done: false,
                          },
                          {
                            title: "Review weekly goals",
                            category: "Personal",
                            priority: "Medium",
                            color: "bg-amber-50 text-amber-700",
                            done: false,
                          },
                          {
                            title: "Plan tomorrow's schedule",
                            category: "Personal",
                            priority: "Done",
                            color: "bg-[#eaf2e5] text-[#657a53]",
                            done: true,
                          },
                        ].map((task) => (
                          <div
                            key={task.title}
                            className="flex min-w-0 items-center gap-3 rounded-xl bg-[#fafaf7] p-3"
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                task.done
                                  ? "border-[#8c9b76] bg-[#8c9b76] text-[9px] text-white"
                                  : "border-[#d6d6c9]"
                              }`}
                            >
                              {task.done ? "✓" : ""}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p
                                className={`truncate text-xs font-medium sm:text-sm ${
                                  task.done
                                    ? "text-[#a1a195] line-through"
                                    : "text-[#41443b]"
                                }`}
                              >
                                {task.title}
                              </p>
                              <p className="mt-1 text-[10px] text-[#929389]">
                                {task.category}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-medium ${task.color}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-[#a1a195]">
              A little preview of your Nextep workspace ✳
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#eae8df] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#849071]">
              Why Nextep
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to stay focused.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#85877e] sm:text-base">
              A calmer way to manage your work, one meaningful step at a time.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-[26px] border border-[#eae8df] bg-[#fdfdfa] p-7 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-[#343b2d]/5 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-[#a2a496]">
                    {feature.number}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7e9dc] text-xl text-[#657451] transition group-hover:bg-[#343b2d] group-hover:text-white">
                    {feature.symbol}
                  </span>
                </div>

                <h3 className="mt-9 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#85877e]">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#343b2d] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border-[40px] border-white/[0.05]" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full border-[40px] border-white/[0.05]" />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c4cfb3]">
              Your next step starts here
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">
              Turn your plans into progress.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Create your workspace, organize your tasks, and start
              moving forward with Nextep.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#e7e9dc] px-7 py-4 text-sm font-semibold text-[#343b2d] transition hover:bg-white"
            >
              Get started <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}