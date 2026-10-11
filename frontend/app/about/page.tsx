
import Link from "next/link";

const principles = [
  {
    number: "01",
    symbol: "◫",
    title: "Simple by design",
    description:
      "Keep your work organized without adding unnecessary complexity to your day.",
  },
  {
    number: "02",
    symbol: "✳",
    title: "Built for progress",
    description:
      "Break your plans into manageable tasks and celebrate every step forward.",
  },
  {
    number: "03",
    symbol: "↗",
    title: "Your own workspace",
    description:
      "Bring your priorities, categories, and daily plans together in one place.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#292c25]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full border-[50px] border-[#e7e9dc]/60" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e5e5d9] bg-white/80 px-4 py-2 text-xs font-medium text-[#78836a]">
              <span className="h-2 w-2 rounded-full bg-[#8c9b76]" />
              ABOUT NEXTEP
            </span>

            <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Make progress feel
              <br />
              <span className="text-[#8c9b76]">a little easier.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#77796e] sm:text-lg">
              Nextep is a personal productivity workspace built around
              one simple idea: when you know what comes next, making
              progress becomes easier.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-3 rounded-2xl bg-[#343b2d] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#454d3c]"
              >
                Start your journey <span>→</span>
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center rounded-2xl border border-[#e5e3d9] bg-white px-6 py-3.5 text-sm font-semibold text-[#505448] transition hover:bg-[#f1f1e9]"
              >
                Sign in
              </Link>
            </div>
          </div>

          {/* Decorative summary card */}
          <div className="mt-16 max-w-4xl rounded-[28px] border border-[#e5e5d9] bg-white p-5 shadow-xl shadow-[#343b2d]/5 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                ["01", "Organize", "Bring your tasks together."],
                ["02", "Prioritize", "Focus on what matters."],
                ["03", "Progress", "Move forward with purpose."],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-2xl bg-[#f8f7f2] p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7e9dc] text-sm font-semibold text-[#667453]">
                    {number}
                  </span>
                  <h2 className="mt-5 font-semibold">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#85877e]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-y border-[#eae8df] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:py-24 md:grid-cols-2 md:items-start lg:px-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#849071]">
              The idea behind Nextep
            </span>

            <h2 className="mt-5 max-w-lg text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              One task. One priority. One next step.
            </h2>
          </div>

          <div className="space-y-5 text-sm leading-7 text-[#77796e] sm:text-base">
            <p>
              Productivity tools can sometimes become more complicated
              than the work itself. Nextep takes a simpler approach.
            </p>
            <p>
              It gives you a focused place to capture tasks, organize
              priorities, and see how far you&apos;ve come.
            </p>
            <p>
              Whether you&apos;re working on a project, studying, or
              planning your day, Nextep helps you focus on what comes next.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#849071]">
              Our approach
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Designed around how you work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#85877e] sm:text-base">
              Less clutter. Clearer priorities. A better way to move forward.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="group rounded-[26px] border border-[#eae8df] bg-white p-7 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#343b2d]/5 sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-widest text-[#a2a496]">
                    {principle.number}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7e9dc] text-xl text-[#657451] transition group-hover:bg-[#343b2d] group-hover:text-white">
                    {principle.symbol}
                  </span>
                </div>

                <h3 className="mt-9 text-xl font-semibold">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#85877e]">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-8 sm:px-6 sm:pb-10">
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
              moving forward at your own pace.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#e7e9dc] px-7 py-4 text-sm font-semibold text-[#343b2d] transition hover:bg-white"
            >
              Get started with Nextep <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}