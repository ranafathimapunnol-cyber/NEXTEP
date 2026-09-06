import Link from "next/link";

const principles = [
  {
    number: "01",
    title: "Simple by design",
    description:
      "Nextep focuses on the essentials so managing your work never feels complicated.",
  },
  {
    number: "02",
    title: "Built for progress",
    description:
      "Every feature is designed to help you understand what needs to happen next.",
  },
  {
    number: "03",
    title: "Your workspace",
    description:
      "Organize your tasks around the way you actually work, not the other way around.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute left-1/2 top-[-200px] -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gray-200/60 blur-3xl" />

        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              About Nextep
            </p>

            <h1 className="mt-5 text-5xl font-bold tracking-[-0.04em] text-gray-950 sm:text-6xl">
              Make progress feel
              <br />
              <span className="text-gray-400">a little easier.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600">
              Nextep is a personal productivity workspace built around one
              simple idea: when you know what comes next, making progress
              becomes easier.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:py-24 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              The idea
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              One task. One priority. One next step.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-7 text-gray-600">
            <p>
              Productivity tools can sometimes become more complicated than
              the work itself. Nextep takes a different approach.
            </p>

            <p>
              Instead of overwhelming you with features, Nextep gives you a
              focused place to capture tasks, organize priorities, and see your
              progress.
            </p>

            <p>
              Whether you&apos;re working on a project, studying, or simply
              trying to get through your day, Nextep helps you focus on what
              comes next.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-gray-200 bg-[#fafafa]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
              Our approach
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Designed around how you work.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.number}
                className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="text-sm font-semibold text-gray-300">
                  {principle.number}
                </span>

                <h3 className="mt-10 text-xl font-semibold">
                  {principle.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-24">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to take your next step?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-400">
            Create your workspace and start turning your plans into progress.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
          >
            Get started
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}