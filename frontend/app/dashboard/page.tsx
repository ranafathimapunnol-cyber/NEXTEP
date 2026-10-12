
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

const primaryButton =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#cbd3bc] bg-white px-5 py-3 text-sm font-semibold text-[#303b27] shadow-sm transition-colors duration-200 hover:border-[#a6b398] hover:bg-[#e7e9dc] hover:text-[#303b27] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71845d] active:bg-[#dce2cf] sm:w-auto";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dcded0] bg-white px-4 py-2.5 text-sm font-semibold text-[#343b2d] transition-colors duration-200 hover:border-[#a6b398] hover:bg-[#f1f3e9] hover:text-[#343b2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71845d]";

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
          try {
            setUser(JSON.parse(storedUser) as User);
          } catch {
            localStorage.removeItem("user");
          }
        }

        const data = await apiRequest<Task[]>("/tasks/");
        setTasks(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load your tasks."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
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
    if (!task.due_date || task.status === "COMPLETED") return false;

    const dueDate = new Date(task.due_date);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return !Number.isNaN(dueDate.getTime()) && dueDate < today;
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
    if (Number.isNaN(parsed.getTime())) return "No due date";

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
        return "bg-stone-100 text-stone-700";
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
    <main className="min-h-screen w-full overflow-x-clip bg-[#f8f7f2] text-[#292c25]">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-7 sm:py-9 lg:px-10">
        {/* Welcome header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#626b53] sm:text-xs sm:tracking-[0.2em]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#71845d]" />
              Your personal workspace
            </div>

            <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight sm:text-4xl">
              {greeting}, {displayName}{" "}
              <span className="inline-block">✳</span>
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#686b60] sm:text-base">
              {formattedDate} · A little progress goes a long way.
            </p>
          </div>

          {/* Primary action: readable in normal, hover and active states */}
          <Link
            href="/dashboard/tasks/new"
            className={`${primaryButton} shrink-0 sm:self-auto`}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              +
            </span>
            Create a task
          </Link>
        </header>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mt-7 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-800"
          >
            <span aria-hidden="true" className="text-lg">!</span>
            <div className="min-w-0">
              <p className="font-semibold">We couldn&apos;t load your workspace</p>
              <p className="mt-1 break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Welcome banner */}
        <section className="relative mt-7 overflow-hidden rounded-[24px] bg-[#e7e9dc] p-5 sm:mt-8 sm:rounded-[28px] sm:p-9 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[36px] border-white/20" />
          <div className="pointer-events-none absolute -bottom-28 right-28 h-64 w-64 rounded-full border-[35px] border-[#b8c1a4]/30" />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[#4c5840] sm:text-xs">
              <span aria-hidden="true">✦</span>
              YOUR DAY, YOUR PACE
            </span>

            <h2 className="mt-5 max-w-md text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              Make room for what really matters.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#555d4b]">
              Organize your priorities, keep track of your progress,
              and turn your plans into meaningful accomplishments.
            </p>

            <Link
              href="/dashboard/tasks"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#343b2d] transition-colors hover:text-[#596b43] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#71845d]"
            >
              Explore your tasks <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-7 right-8 hidden h-32 w-32 items-center justify-center rounded-full border border-white/70 bg-white/30 text-5xl text-[#7b8669] backdrop-blur-sm md:flex lg:right-16 lg:h-40 lg:w-40 lg:text-6xl"
          >
            ✳
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8 sm:mt-9">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold tracking-tight">Your overview</h2>
            <span className="text-xs text-[#686b60]">All your tasks</span>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {[
              {
                label: "Total tasks",
                value: tasks.length,
                description: "Everything on your plate",
                icon: "◫",
                iconClass: "bg-[#f0f0e8] text-[#343b2d]",
              },
              {
                label: "Completed",
                value: completedTasks,
                description: `${completionPercentage}% of all tasks`,
                icon: "✓",
                iconClass: "bg-[#eaf2e5] text-[#526b40]",
              },
              {
                label: "In progress",
                value: inProgressTasks,
                description: "Currently in motion",
                icon: "↗",
                iconClass: "bg-[#e8f1f5] text-[#416b7d]",
              },
              {
                label: "Overdue",
                value: overdueTasks,
                description: "Tasks past their due date",
                icon: "◷",
                iconClass: "bg-[#fbede5] text-[#a85d40]",
              },
            ].map((stat) => (
              <article
                key={stat.label}
                className="rounded-[22px] border border-[#e5e3d9] bg-white p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/40 sm:rounded-[24px] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#62655b]">{stat.label}</span>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg ${stat.iconClass}`}>
                    {stat.icon}
                  </span>
                </div>
                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {loading ? "—" : stat.value.toString().padStart(2, "0")}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#686b60]">
                  {loading ? "Loading your tasks..." : stat.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Main content */}
        <div className="mt-8 grid min-w-0 items-start gap-5 sm:mt-9 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Recent tasks */}
          <section className="min-w-0 overflow-hidden rounded-[24px] border border-[#e5e3d9] bg-white sm:rounded-[26px]">
            <div className="flex flex-col justify-between gap-3 border-b border-[#eae8df] px-4 py-5 sm:flex-row sm:items-center sm:px-7">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold tracking-tight">Recent tasks</h2>
                <p className="mt-1 text-sm leading-5 text-[#686b60]">
                  Keep an eye on what you&apos;re working on.
                </p>
              </div>
              <Link
                href="/dashboard/tasks"
                className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-[#4f6040] transition-colors hover:text-[#343b2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71845d]"
              >
                View all <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="divide-y divide-[#eae8df]">
              {loading ? (
                <div className="space-y-4 p-5 sm:p-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex animate-pulse gap-4 py-2">
                      <div className="h-11 w-11 shrink-0 rounded-2xl bg-[#f0efe9]" />
                      <div className="min-w-0 flex-1 space-y-3 py-1">
                        <div className="h-3 w-2/3 rounded bg-[#f0efe9]" />
                        <div className="h-3 w-1/3 rounded bg-[#f5f4ef]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : tasks.length === 0 ? (
                <div className="px-5 py-12 text-center sm:px-6 sm:py-16">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f0f0e8] text-3xl text-[#5c6d48]">
                    ✳
                  </div>
                  <h3 className="mt-5 text-base font-semibold">A fresh start</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#686b60]">
                    Your task list is waiting for your first idea. Create a task and make it happen.
                  </p>
                  <Link
                    href="/dashboard/tasks/new"
                    className={`${primaryButton} mt-6`}
                  >
                    <span aria-hidden="true" className="text-xl leading-none">+</span>
                    Create your first task
                  </Link>
                </div>
              ) : (
                tasks.slice(0, 6).map((task, index) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="group flex min-w-0 items-start gap-3 px-4 py-4 transition-colors duration-200 hover:bg-[#fafaf6] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#71845d] sm:gap-4 sm:px-7 sm:py-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f0e8] text-sm font-semibold text-[#596447] transition-colors group-hover:bg-[#e7e9dc] sm:h-11 sm:w-11 sm:rounded-2xl">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className={`break-words text-sm font-semibold ${task.status === "COMPLETED" ? "text-[#77796e] line-through" : "text-[#34372f] group-hover:text-[#52633f]"}`}>
                        {task.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {task.category_name && (
                          <span className="max-w-full break-words rounded-full bg-[#f3f2ec] px-2.5 py-1 text-[11px] font-medium text-[#62655b]">
                            {task.category_name}
                          </span>
                        )}
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyles(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-[#686b60]">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex max-w-[86px] shrink-0 flex-col items-end gap-2 sm:max-w-none">
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset sm:px-2.5 sm:text-[11px] ${getPriorityStyles(task.priority)}`}>
                        {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                      </span>
                      {task.due_date && (
                        <span className="text-right text-[10px] leading-4 text-[#686b60] sm:text-[11px]">
                          {formatDueDate(task.due_date)}
                        </span>
                      )}
                      <span aria-hidden="true" className="hidden text-sm text-[#69745b] transition-transform group-hover:translate-x-1 sm:block">
                        →
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {!loading && tasks.length > 6 && (
              <div className="border-t border-[#eae8df] px-5 py-4 text-center">
                <Link
                  href="/dashboard/tasks"
                  className="inline-flex min-h-10 items-center justify-center text-sm font-semibold text-[#52633f] hover:text-[#343b2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71845d]"
                >
                  See all {tasks.length} tasks →
                </Link>
              </div>
            )}
          </section>

          {/* Right column */}
          <aside className="min-w-0 space-y-5 sm:space-y-6">
            <section className="rounded-[24px] border border-[#e5e3d9] bg-white p-5 sm:rounded-[26px] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#686b60]">
                    Your momentum
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">Overall progress</h2>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eaf2e5] text-lg text-[#526b40]">
                  ↗
                </div>
              </div>

              <div className="mt-7 flex items-end justify-between gap-3">
                <p className="text-4xl font-semibold tracking-tight">
                  {loading ? "—" : `${completionPercentage}%`}
                </p>
                <p className="pb-1 text-xs text-[#686b60]">Completed</p>
              </div>

              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#f0f0e8]"
                role="progressbar"
                aria-label="Task completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercentage}
              >
                <div className="h-full rounded-full bg-[#71845d] transition-all duration-700" style={{ width: `${completionPercentage}%` }} />
              </div>

              <p className="mt-4 text-sm leading-6 text-[#686b60]">
                {loading ? "Calculating your progress..." : `${completedTasks} of ${tasks.length} tasks completed`}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f5f4ee] p-3 sm:p-4">
                  <p className="text-xs text-[#62655b]">To do</p>
                  <p className="mt-2 text-xl font-semibold">{loading ? "—" : todoTasks}</p>
                </div>
                <div className="rounded-2xl bg-[#f5f4ee] p-3 sm:p-4">
                  <p className="text-xs text-[#62655b]">In progress</p>
                  <p className="mt-2 text-xl font-semibold">{loading ? "—" : inProgressTasks}</p>
                </div>
              </div>
            </section>

{/* Quick actions */}
<section className="rounded-[24px] border border-[#e5e3d9] bg-white p-5 sm:rounded-[26px] sm:p-7">
  <div className="flex items-center gap-3">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7e9dc] text-xl text-[#52633f]">
      ✳
    </div>

    <div>
      <h2 className="font-semibold text-[#292c25]">Quick actions</h2>
      <p className="mt-1 text-xs text-[#686b60]">
        Make your next move.
      </p>
    </div>
  </div>

  <div className="mt-6 space-y-3">
    {[
      {
        href: "/dashboard/tasks/new",
        label: "Create a task",
        icon: "+",
      },
      {
        href: "/dashboard/tasks",
        label: "Browse all tasks",
        icon: "↗",
      },
      {
        href: "/dashboard/categories",
        label: "Manage categories",
        icon: "↗",
      },
      {
        href: "/dashboard/profile",
        label: "Your profile",
        icon: "↗",
      },
    ].map((action) => (
      <Link
        key={action.href}
        href={action.href}
        className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-[#dcded0] bg-[#f8f7f2] px-4 py-3.5 text-sm font-semibold text-[#343b2d] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#cbd3bc] hover:bg-[#e7e9dc] hover:text-[#293023] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71845d] active:translate-y-0 active:bg-[#dce2cf]"
      >
        <span>{action.label}</span>
        <span
          aria-hidden="true"
          className="text-lg text-[#69745b] transition-transform duration-200 group-hover:translate-x-1"
        >
          {action.icon}
        </span>
      </Link>
    ))}
  </div>
</section>



          
{/* Profile */}
<section className="rounded-[24px] border border-[#e5e3d9] bg-white p-5 transition-shadow duration-200 hover:shadow-md hover:shadow-stone-200/30 sm:rounded-[26px] sm:p-6">
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-sm font-semibold text-[#292c25]">
      Your profile
    </h2>
    <span className="text-xs text-[#686b60]">Account</span>
  </div>

  <div className="flex min-w-0 items-center gap-3">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e7e9dc] text-sm font-semibold text-[#4c5c3f]">
      {getInitials(user?.username || "N")}
    </div>

    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-semibold text-[#292c25]">
        {user?.username || "Your workspace"}
      </p>
      <p className="mt-1 truncate text-xs text-[#686b60]">
        {user?.email || "Stay focused, keep growing"}
      </p>
    </div>

    <Link
      href="/dashboard/profile"
      aria-label="Edit profile"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#dcded0] bg-[#f8f7f2] text-[#52633f] transition-colors hover:bg-[#e7e9dc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#71845d]"
    >
      ↗
    </Link>
  </div>
</section>


          </aside>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-[#e5e3d9] py-6 text-center text-xs text-[#686b60] sm:mt-10 sm:flex-row sm:text-left">
          <p>Nextep · One step at a time.</p>
          <p>Small steps. Meaningful progress. ✳</p>
        </footer>
      </div>
    </main>
  );
}