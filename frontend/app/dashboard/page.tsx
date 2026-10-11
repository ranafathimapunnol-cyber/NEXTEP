
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { apiRequest } from "@/lib/api";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  due_date: string | null;
  category: number | null;
  category_name: string | null;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const data = await apiRequest<Task[]>("/tasks/");
        setTasks(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your tasks."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const completionPercentage = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const overdueTasks = tasks.filter((task) => {
    if (!task.due_date || task.status === "COMPLETED") {
      return false;
    }

    const dueDate = new Date(task.due_date);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
  }).length;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function formatDueDate(date: string | null) {
    if (!date) return "No due date";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "No due date";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  }

  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  function getPriorityStyles(priority: Task["priority"]) {
    switch (priority) {
      case "HIGH":
        return "bg-rose-50 text-rose-700 ring-rose-100";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 ring-amber-100";
      default:
        return "bg-emerald-50 text-emerald-700 ring-emerald-100";
    }
  }

  function getStatusStyles(status: Task["status"]) {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700";
      case "IN_PROGRESS":
        return "bg-sky-50 text-sky-700";
      default:
        return "bg-stone-100 text-stone-600";
    }
  }

  function getStatusLabel(status: Task["status"]) {
    switch (status) {
      case "TODO":
        return "To do";
      case "IN_PROGRESS":
        return "In progress";
      case "COMPLETED":
        return "Completed";
    }
  }

  const displayName = user?.username || "there";

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#292c25]">
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-7 sm:py-9 lg:px-10">
        {/* Welcome header */}
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#818576]">
              <span className="h-2 w-2 rounded-full bg-[#8b9b73]" />
              Your personal workspace
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {greeting}, {displayName}{" "}
              <span className="inline-block">✳</span>
            </h1>

            <p className="mt-2 text-sm text-[#85877e] sm:text-base">
              {formattedDate} · A little progress goes a long way.
            </p>
          </div>

          <Link
            href="/dashboard/tasks/new"
            className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-2xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#454d3c] hover:shadow-md sm:self-auto"
          >
            <span className="text-lg leading-none">+</span>
            Create a task
          </Link>
        </header>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mt-7 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            <span className="text-lg">!</span>
            <div>
              <p className="font-semibold">We couldn&apos;t load your workspace</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Welcome banner */}
        <section className="relative mt-8 overflow-hidden rounded-[28px] bg-[#e7e9dc] p-6 sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/20" />
          <div className="pointer-events-none absolute -bottom-28 right-28 h-64 w-64 rounded-full border-[35px] border-[#b8c1a4]/30" />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1.5 text-xs font-medium text-[#626b53]">
              <span>✦</span>
              YOUR DAY, YOUR PACE
            </span>

            <h2 className="mt-5 max-w-md text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Make room for what really matters.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#737968]">
              Organize your priorities, keep track of your progress,
              and turn your plans into meaningful accomplishments.
            </p>

            <Link
              href="/dashboard/tasks"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#414a36] transition hover:gap-3"
            >
              Explore your tasks <span>→</span>
            </Link>
          </div>

          <div className="pointer-events-none absolute bottom-7 right-8 hidden h-32 w-32 items-center justify-center rounded-full border border-white/70 bg-white/30 text-5xl text-[#7b8669] backdrop-blur-sm md:flex lg:right-16 lg:h-40 lg:w-40 lg:text-6xl">
            ✳
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight">
              Your overview
            </h2>
            <span className="text-xs text-[#929389]">
              All your tasks
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {/* Total */}
            <article className="rounded-[24px] border border-[#eae8df] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/40 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#82847a]">
                  Total tasks
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0f0e8] text-lg">
                  ◫
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {loading ? "—" : tasks.length.toString().padStart(2, "0")}
              </p>

              <p className="mt-2 text-xs text-[#96978e]">
                Everything on your plate
              </p>
            </article>

            {/* Completed */}
            <article className="rounded-[24px] border border-[#eae8df] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/40 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#82847a]">
                  Completed
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eaf2e5] text-lg text-[#657a53]">
                  ✓
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {loading ? "—" : completedTasks.toString().padStart(2, "0")}
              </p>

              <p className="mt-2 text-xs text-[#96978e]">
                {completionPercentage}% of all tasks
              </p>
            </article>

            {/* In progress */}
            <article className="rounded-[24px] border border-[#eae8df] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/40 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#82847a]">
                  In progress
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f1f5] text-lg text-[#557d8d]">
                  ↗
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {loading ? "—" : inProgressTasks.toString().padStart(2, "0")}
              </p>

              <p className="mt-2 text-xs text-[#96978e]">
                Currently in motion
              </p>
            </article>

            {/* Overdue */}
            <article className="rounded-[24px] border border-[#eae8df] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/40 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#82847a]">
                  Overdue
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fbede5] text-lg text-[#bd795a]">
                  ◷
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold tracking-tight">
                {loading ? "—" : overdueTasks.toString().padStart(2, "0")}
              </p>

              <p className="mt-2 text-xs text-[#96978e]">
                Tasks past their due date
              </p>
            </article>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-9 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Recent tasks */}
          <section className="min-w-0 overflow-hidden rounded-[26px] border border-[#eae8df] bg-white">
            <div className="flex flex-col justify-between gap-3 border-b border-[#f0efe9] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">
                  Recent tasks
                </h2>
                <p className="mt-1 text-sm text-[#929389]">
                  Keep an eye on what you&apos;re working on.
                </p>
              </div>

              <Link
                href="/dashboard/tasks"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#69745b] transition hover:text-[#343b2d]"
              >
                View all <span>→</span>
              </Link>
            </div>

            <div className="divide-y divide-[#f1f0ea]">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex animate-pulse gap-4 py-2">
                      <div className="h-11 w-11 shrink-0 rounded-2xl bg-[#f0efe9]" />
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-3 w-2/3 rounded bg-[#f0efe9]" />
                        <div className="h-3 w-1/3 rounded bg-[#f5f4ef]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f0f0e8] text-3xl text-[#758066]">
                    ✳
                  </div>
                  <h3 className="mt-5 text-base font-semibold">
                    A fresh start
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#929389]">
                    Your task list is waiting for your first idea.
                    Create a task and make it happen.
                  </p>
                  <Link
                    href="/dashboard/tasks/new"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#454d3c]"
                  >
                    + Create your first task
                  </Link>
                </div>
              ) : (
                tasks.slice(0, 6).map((task, index) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="group flex items-start gap-4 px-5 py-5 transition duration-200 hover:bg-[#fafaf6] sm:px-7"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0f0e8] text-sm font-semibold text-[#747c64] transition group-hover:bg-[#e7e9dc]">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`truncate text-sm font-semibold transition ${
                            task.status === "COMPLETED"
                              ? "text-[#9a9b92] line-through"
                              : "text-[#34372f] group-hover:text-[#65744e]"
                          }`}
                        >
                          {task.title}
                        </h3>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {task.category_name && (
                          <span className="rounded-full bg-[#f3f2ec] px-2.5 py-1 text-[11px] font-medium text-[#85867a]">
                            {task.category_name}
                          </span>
                        )}

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyles(task.status)}`}
                        >
                          {getStatusLabel(task.status)}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-2 line-clamp-1 text-xs text-[#929389]">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${getPriorityStyles(task.priority)}`}
                      >
                        {task.priority.charAt(0) +
                          task.priority.slice(1).toLowerCase()}
                      </span>

                      {task.due_date && (
                        <span className="text-[11px] text-[#999a91]">
                          {formatDueDate(task.due_date)}
                        </span>
                      )}

                      <span className="hidden text-sm text-[#b0b1a7] transition group-hover:translate-x-1 group-hover:text-[#69745b] sm:block">
                        →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {!loading && tasks.length > 6 && (
              <div className="border-t border-[#f0efe9] px-6 py-4 text-center">
                <Link
                  href="/dashboard/tasks"
                  className="text-sm font-semibold text-[#737c63] hover:text-[#343b2d]"
                >
                  See all {tasks.length} tasks →
                </Link>
              </div>
            )}
          </section>

          {/* Right column */}
          <aside className="space-y-6">
            {/* Progress card */}
            <section className="rounded-[26px] border border-[#eae8df] bg-white p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#929389]">
                    Your momentum
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">
                    Overall progress
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eaf2e5] text-lg text-[#657a53]">
                  ↗
                </div>
              </div>

              <div className="mt-7 flex items-end justify-between">
                <p className="text-4xl font-semibold tracking-tight">
                  {loading ? "—" : `${completionPercentage}%`}
                </p>
                <p className="pb-1 text-xs text-[#929389]">Completed</p>
              </div>

              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#f0f0e8]"
                role="progressbar"
                aria-label="Task completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercentage}
              >
                <div
                  className="h-full rounded-full bg-[#8c9b76] transition-all duration-700"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-sm text-[#85877e]">
                {loading
                  ? "Calculating your progress..."
                  : `${completedTasks} of ${tasks.length} tasks completed`}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f8f7f2] p-4">
                  <p className="text-xs text-[#929389]">To do</p>
                  <p className="mt-2 text-xl font-semibold">
                    {loading ? "—" : todoTasks}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f8f7f2] p-4">
                  <p className="text-xs text-[#929389]">In progress</p>
                  <p className="mt-2 text-xl font-semibold">
                    {loading ? "—" : inProgressTasks}
                  </p>
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="overflow-hidden rounded-[26px] bg-[#343b2d] p-6 text-white sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">
                  ✳
                </div>
                <div>
                  <h2 className="font-semibold">Quick actions</h2>
                  <p className="mt-1 text-xs text-white/55">
                    Make your next move.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <Link
                  href="/dashboard/tasks/new"
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-[#343b2d] transition hover:bg-[#e7e9dc]"
                >
                  Create a task
                  <span className="text-lg">↗</span>
                </Link>

                <Link
                  href="/dashboard/tasks"
                  className="flex items-center justify-between rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm text-white/90 transition hover:bg-white/[0.13]"
                >
                  Browse all tasks
                  <span>→</span>
                </Link>

                <Link
                  href="/dashboard/categories"
                  className="flex items-center justify-between rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm text-white/90 transition hover:bg-white/[0.13]"
                >
                  Manage categories
                  <span>→</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center justify-between rounded-2xl bg-white/[0.07] px-4 py-3.5 text-sm text-white/90 transition hover:bg-white/[0.13]"
                >
                  Your profile
                  <span>→</span>
                </Link>
              </div>
            </section>

            {/* Profile card */}
            <section className="rounded-[26px] border border-[#eae8df] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e7e9dc] text-sm font-semibold text-[#5e6b4c]">
                  {getInitials(user?.username || "N")}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {user?.username || "Your workspace"}
                  </p>
                  <p className="mt-1 truncate text-xs text-[#929389]">
                    {user?.email || "Stay focused, keep growing"}
                  </p>
                </div>

                <Link
                  href="/dashboard/profile"
                  aria-label="Edit profile"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f4ee] text-[#747c64] transition hover:bg-[#e7e9dc]"
                >
                  ↗
                </Link>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[#eae8df] py-6 text-xs text-[#a0a095] sm:flex-row">
          <p>Nextep · One step at a time.</p>
          <p>Small steps. Meaningful progress. ✳</p>
        </footer>
      </div>
    </main>
  );
}