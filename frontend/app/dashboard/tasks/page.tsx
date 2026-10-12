
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
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

type StatusFilter = "ALL" | Task["status"];
type PriorityFilter = "ALL" | Task["priority"];

const statusConfig = {
  TODO: {
    label: "To do",
    dot: "bg-stone-400",
    badge: "border-stone-200 bg-stone-100 text-stone-700",
  },
  IN_PROGRESS: {
    label: "In progress",
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-emerald-600",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
};

const priorityConfig = {
  HIGH: {
    label: "High",
    dot: "bg-rose-500",
    badge: "border-rose-200 bg-rose-50 text-rose-800",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
  },
  LOW: {
    label: "Low",
    dot: "bg-[#84936b]",
    badge: "border-[#d9decb] bg-[#e7e9dc] text-[#435238]",
  },
};

const primaryButton =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#343b2d] bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:border-[#4b5740] hover:bg-[#4b5740] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84936b] focus-visible:ring-offset-2 active:bg-[#293023] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-[#d9decb] bg-[#fdfcf8] px-4 py-2.5 text-sm font-semibold text-[#435238] transition-colors hover:border-[#aab69a] hover:bg-[#edf0e5] hover:text-[#343b2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84936b] focus-visible:ring-offset-2";

function formatDueDate(date: string | null) {
  if (!date) return null;

  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDueState(date: string | null, status: Task["status"]) {
  if (!date || status === "COMPLETED") return null;

  const due = new Date(`${date.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(due.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const difference = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (difference < 0) return "Overdue";
  if (difference === 0) return "Due today";
  if (difference === 1) return "Due tomorrow";

  return null;
}

function SummaryCard({
  label,
  value,
  detail,
  symbol,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  symbol: string;
  tone: string;
}) {
  return (
    <article className="group min-w-0 rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-4 shadow-sm shadow-[#343b2d]/[0.02] transition duration-200 hover:-translate-y-0.5 hover:border-[#cdd4bd] hover:shadow-md hover:shadow-[#343b2d]/5 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#77796e]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#292c25]">
            {value}
          </p>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg sm:h-11 sm:w-11 ${tone}`}
          aria-hidden="true"
        >
          {symbol}
        </span>
      </div>

      <p className="mt-3 text-xs leading-5 text-[#77796e]">{detail}</p>
    </article>
  );
}

function TaskRow({ task }: { task: Task }) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const dueState = getDueState(task.due_date, task.status);
  const dueDate = formatDueDate(task.due_date);

  return (
    <Link
      href={`/dashboard/tasks/${task.id}`}
      className="group block px-4 py-5 transition-colors duration-200 hover:bg-[#f4f4eb] focus-visible:bg-[#f4f4eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#84936b] sm:px-6"
    >
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
            task.status === "COMPLETED"
              ? "border-[#84936b] bg-[#84936b] text-white"
              : "border-[#d7d9cb] bg-white text-transparent group-hover:border-[#84936b]"
          }`}
          aria-label={
            task.status === "COMPLETED" ? "Completed" : "Not completed"
          }
        >
          ✓
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`break-words text-sm font-semibold transition-colors ${
                task.status === "COMPLETED"
                  ? "text-[#898b80] line-through"
                  : "text-[#343b2d] group-hover:text-[#58664a]"
              }`}
            >
              {task.title}
            </h3>

            {dueState === "Overdue" && (
              <span className="rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-800">
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-1.5 line-clamp-2 break-words text-sm leading-6 text-[#77796e]">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>

            {task.category_name && (
              <span className="inline-flex max-w-full items-center rounded-full border border-[#e7e5d9] bg-white px-2.5 py-1 text-xs font-medium text-[#626458]">
                <span className="truncate">{task.category_name}</span>
              </span>
            )}

            {dueDate && (
              <span
                className={`text-xs ${
                  dueState === "Overdue"
                    ? "font-semibold text-rose-700"
                    : dueState === "Due today"
                      ? "font-semibold text-amber-800"
                      : "text-[#77796e]"
                }`}
              >
                {dueState ? `${dueState} · ${dueDate}` : `Due ${dueDate}`}
              </span>
            )}
          </div>

          <div className="mt-3 sm:hidden">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${priority.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
              {priority.label} priority
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-3 self-center sm:flex">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${priority.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>

          <span
            aria-hidden="true"
            className="text-lg text-[#b9bcad] transition group-hover:translate-x-1 group-hover:text-[#58664a]"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest<Task[]>("/tasks/");
      setTasks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your tasks."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.description ?? "").toLowerCase().includes(query) ||
        (task.category_name ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const summary = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "TODO").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      completed: tasks.filter((task) => task.status === "COMPLETED").length,
      overdue: tasks.filter(
        (task) => getDueState(task.due_date, task.status) === "Overdue"
      ).length,
    }),
    [tasks]
  );

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "ALL" ||
    priorityFilter !== "ALL";

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
  }

  return (
    <main className="min-h-screen min-w-0 overflow-x-clip bg-[#f8f7f2] text-[#292c25]">
      <section className="border-b border-[#e7e5d9] bg-[#fdfcf8]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end sm:gap-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#77796e]">
                <Link
                  href="/dashboard"
                  className="rounded-sm transition-colors hover:text-[#343b2d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84936b]"
                >
                  Workspace
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-[#58664a]">Tasks</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-[#292c25] sm:text-4xl">
                  Your tasks, in focus.
                </h1>

                {!loading && !error && (
                  <span className="rounded-full border border-[#d9decb] bg-[#e7e9dc] px-3 py-1 text-xs font-semibold text-[#435238]">
                    {summary.total} total
                  </span>
                )}
              </div>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#77796e]">
                A little progress each day adds up. Organize your work, focus
                on what matters, and keep moving forward.
              </p>
            </div>

         
<Link
  href="/dashboard/tasks/new"
  style={{
    backgroundColor: "#343b2d",
    color: "#ffffff",
    borderColor: "#343b2d",
  }}
  className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84936b] focus-visible:ring-offset-2 sm:w-auto"
>
  <span aria-hidden="true" className="text-lg leading-none">+</span>
  Create a task
</Link>
          </div>

          {!loading && !error && (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              <SummaryCard
                label="All tasks"
                value={summary.total}
                detail="Everything on your list"
                symbol="▤"
                tone="bg-[#e7e9dc] text-[#435238]"
              />
              <SummaryCard
                label="To do"
                value={summary.todo}
                detail="Ready for your attention"
                symbol="○"
                tone="bg-stone-100 text-stone-700"
              />
              <SummaryCard
                label="In progress"
                value={summary.inProgress}
                detail="Work already underway"
                symbol="◷"
                tone="bg-amber-50 text-amber-800"
              />
              <SummaryCard
                label="Completed"
                value={summary.completed}
                detail={
                  summary.total > 0
                    ? `${Math.round(
                        (summary.completed / summary.total) * 100
                      )}% of all tasks`
                    : "Your next win starts here"
                }
                symbol="✓"
                tone="bg-emerald-50 text-emerald-800"
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#343b2d]">
              Task list
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#77796e]">
              Find a task or narrow the list to what needs your attention.
            </p>
          </div>

          {!loading && !error && summary.overdue > 0 && (
            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-800">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              {summary.overdue} overdue{" "}
              {summary.overdue === 1 ? "task" : "tasks"}
            </div>
          )}
        </div>

        <div className="mb-5 rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-3 shadow-sm shadow-[#343b2d]/[0.03] sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
            <div className="relative min-w-0">
              <label htmlFor="task-search" className="sr-only">
                Search tasks
              </label>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#77796e]"
              >
                ⌕
              </span>

              <input
                id="task-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, description, category..."
                className="min-h-12 w-full min-w-0 rounded-xl border border-[#e1dfd3] bg-[#f8f7f2] py-3 pl-10 pr-3 text-sm text-[#292c25] outline-none transition placeholder:text-[#85877b] focus:border-[#84936b] focus:bg-white focus:ring-2 focus:ring-[#e7e9dc]"
              />
            </div>

            <div className="min-w-0">
              <label htmlFor="task-status" className="sr-only">
                Filter by status
              </label>

              <select
                id="task-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="min-h-12 w-full rounded-xl border border-[#e1dfd3] bg-[#f8f7f2] px-3 text-sm text-[#435238] outline-none transition focus:border-[#84936b] focus:ring-2 focus:ring-[#e7e9dc]"
              >
                <option value="ALL">All statuses</option>
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="min-w-0">
              <label htmlFor="task-priority" className="sr-only">
                Filter by priority
              </label>

              <select
                id="task-priority"
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value as PriorityFilter)
                }
                className="min-h-12 w-full rounded-xl border border-[#e1dfd3] bg-[#f8f7f2] px-3 text-sm text-[#435238] outline-none transition focus:border-[#84936b] focus:ring-2 focus:ring-[#e7e9dc]"
              >
                <option value="ALL">All priorities</option>
                <option value="HIGH">High priority</option>
                <option value="MEDIUM">Medium priority</option>
                <option value="LOW">Low priority</option>
              </select>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className={`${secondaryButton} w-full md:w-auto`}
              >
                Reset filters
              </button>
            )}
          </div>

          {!loading && !error && (
            <div className="mt-3 flex flex-col gap-1.5 border-t border-[#eeede5] pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[#77796e]" aria-live="polite">
                Showing{" "}
                <span className="font-semibold text-[#343b2d]">
                  {filteredTasks.length}
                </span>{" "}
                of {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
              </p>

              {hasFilters && (
                <p className="text-xs text-[#77796e]">Filters are active</p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-[#e8c9c0] bg-[#fbefeb] p-4 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-semibold text-[#a34f3d]">
                !
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-[#873d30]">
                  We couldn&apos;t load your tasks
                </h3>

                <p className="mt-1 break-words text-sm leading-6 text-[#873d30]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => void loadTasks()}
                  disabled={loading}
                  className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#873d30] bg-[#873d30] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#6f3026] hover:bg-[#6f3026] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#873d30] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Trying again..." : "Try again"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] shadow-sm shadow-[#343b2d]/[0.03]">
          <div className="flex items-center justify-between gap-3 border-b border-[#eeede5] px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[#343b2d]">
                {statusFilter === "ALL"
                  ? "All your work"
                  : statusConfig[statusFilter].label}
              </h3>
              <p className="mt-1 text-xs text-[#77796e]">
                Your tasks, all in one place
              </p>
            </div>

            <span className="shrink-0 rounded-lg bg-[#f0efe8] px-2.5 py-1.5 text-xs font-semibold text-[#58664a]">
              {loading ? "…" : filteredTasks.length}
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-[#eeede5]">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-3 px-4 py-6 sm:gap-4 sm:px-6">
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded-md bg-[#e7e9dc]" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-4 w-2/5 animate-pulse rounded-md bg-[#eeede5]" />
                    <div className="h-3 w-3/4 animate-pulse rounded-md bg-[#f0efe8]" />
                    <div className="h-5 w-32 animate-pulse rounded-full bg-[#eeede5]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-10 text-center text-sm leading-6 text-[#77796e] sm:px-6">
              Your task list will appear here once loading succeeds.
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="px-5 py-12 text-center sm:px-6 sm:py-16">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d9decb] bg-[#e7e9dc] text-2xl text-[#435238]">
                {tasks.length === 0 ? "✳" : "⌕"}
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#343b2d]">
                {tasks.length === 0
                  ? "Your next step starts here"
                  : "No tasks match your filters"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#77796e]">
                {tasks.length === 0
                  ? "Create your first task, give it a priority, and start turning plans into progress."
                  : "Try a different keyword or change the status and priority filters."}
              </p>

              {tasks.length === 0 ? (
                <Link
                  href="/dashboard/tasks/new"
                  className={`${primaryButton} mt-5 w-full sm:w-auto`}
                >
                  <span aria-hidden="true">+</span>
                  Create your first task
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`${secondaryButton} mt-5 w-full sm:w-auto`}
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#eeede5]">
              {filteredTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {!loading && !error && tasks.length > 0 && (
          <div className="mt-5 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-5 text-[#77796e]">
              Small steps, steady progress. 🌱
            </p>

            <Link
              href="/dashboard/tasks/new"
              className="rounded-sm text-sm font-semibold text-[#435238] transition-colors hover:text-[#292c25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84936b]"
            >
              Have something new to do? Create a task →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}