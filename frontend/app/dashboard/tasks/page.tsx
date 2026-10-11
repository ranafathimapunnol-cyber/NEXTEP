
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
    badge: "bg-stone-100 text-stone-600 border-stone-200",
  },
  IN_PROGRESS: {
    label: "In progress",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-emerald-600",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
};

const priorityConfig = {
  HIGH: {
    label: "High",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  MEDIUM: {
    label: "Medium",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
  },
  LOW: {
    label: "Low",
    dot: "bg-[#8c9b76]",
    badge: "bg-[#e7e9dc] text-[#4d6040] border-[#d9decb]",
  },
};

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
    <div className="group rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#cdd4bd] hover:shadow-md hover:shadow-[#343b2d]/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#77796e]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[#292c25]">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${tone}`}
          aria-hidden="true"
        >
          {symbol}
        </span>
      </div>
      <p className="mt-4 text-xs text-[#85877b]">{detail}</p>
    </div>
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
      className="group block px-4 py-5 transition hover:bg-[#f8f8f2] sm:px-6"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${
            task.status === "COMPLETED"
              ? "border-[#8c9b76] bg-[#8c9b76] text-white"
              : "border-[#d7d9cb] bg-white text-transparent group-hover:border-[#8c9b76]"
          }`}
          aria-label={task.status === "COMPLETED" ? "Completed" : "Not completed"}
        >
          ✓
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              className={`break-words text-sm font-semibold transition ${
                task.status === "COMPLETED"
                  ? "text-[#999b8f] line-through"
                  : "text-[#343b2d] group-hover:text-[#58664a]"
              }`}
            >
              {task.title}
            </h2>

            {dueState === "Overdue" && (
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
                Overdue
              </span>
            )}
          </div>

          {task.description && (
            <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-6 text-[#85877b]">
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
              <span className="inline-flex items-center rounded-full border border-[#e7e5d9] bg-white px-2.5 py-1 text-xs font-medium text-[#77796e]">
                {task.category_name}
              </span>
            )}

            {dueDate && (
              <span
                className={`text-xs ${
                  dueState === "Overdue"
                    ? "font-medium text-rose-700"
                    : dueState === "Due today"
                      ? "font-medium text-amber-800"
                      : "text-[#85877b]"
                }`}
              >
                {dueState ? `${dueState} · ${dueDate}` : `Due ${dueDate}`}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-center">
          <span
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold sm:inline-flex ${priority.badge}`}
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

      <div className="mt-3 pl-8 sm:hidden">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${priority.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
          {priority.label} priority
        </span>
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
    let active = true;

    async function fetchTasks() {
      try {
        const data = await apiRequest<Task[]>("/tasks/");
        if (active) setTasks(data);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load your tasks."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchTasks();

    return () => {
      active = false;
    };
  }, []);

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
    <main className="min-h-screen bg-[#f8f7f2] text-[#292c25]">
      <section className="border-b border-[#e7e5d9] bg-[#fdfcf8]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#85877b]">
                <Link
                  href="/dashboard"
                  className="transition hover:text-[#343b2d]"
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
                  <span className="rounded-full border border-[#dfe3d4] bg-[#e7e9dc] px-3 py-1 text-xs font-semibold text-[#58664a]">
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
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#4b5740] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8c9b76] sm:self-auto"
            >
              <span aria-hidden="true" className="text-lg leading-none">+</span>
              Create a task
            </Link>
          </div>

          {!loading && !error && (
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="All tasks"
                value={summary.total}
                detail="Everything on your list"
                symbol="▤"
                tone="bg-[#e7e9dc] text-[#58664a]"
              />
              <SummaryCard
                label="To do"
                value={summary.todo}
                detail="Ready for your attention"
                symbol="○"
                tone="bg-stone-100 text-stone-600"
              />
              <SummaryCard
                label="In progress"
                value={summary.inProgress}
                detail="Work already underway"
                symbol="◷"
                tone="bg-amber-50 text-amber-700"
              />
              <SummaryCard
                label="Completed"
                value={summary.completed}
                detail={
                  summary.total > 0
                    ? `${Math.round((summary.completed / summary.total) * 100)}% of all tasks`
                    : "Your next win starts here"
                }
                symbol="✓"
                tone="bg-emerald-50 text-emerald-700"
              />
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[#343b2d]">
              Task list
            </h2>
            <p className="mt-1 text-sm text-[#85877b]">
              Find a task or narrow the list to what needs your attention.
            </p>
          </div>

          {!loading && !error && summary.overdue > 0 && (
            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-700">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              {summary.overdue} overdue{" "}
              {summary.overdue === 1 ? "task" : "tasks"}
            </div>
          )}
        </div>

        <div className="mb-5 rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-3 shadow-sm sm:p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
            <div className="relative">
              <label htmlFor="task-search" className="sr-only">
                Search tasks
              </label>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[#999b8f]"
              >
                ⌕
              </span>
              <input
                id="task-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, description, category..."
                className="min-h-11 w-full rounded-xl border border-[#e7e5d9] bg-[#f8f7f2] py-3 pl-10 pr-3 text-sm text-[#292c25] outline-none transition placeholder:text-[#a0a194] focus:border-[#8c9b76] focus:bg-white focus:ring-2 focus:ring-[#e7e9dc]"
              />
            </div>

            <div>
              <label htmlFor="task-status" className="sr-only">
                Filter by status
              </label>
              <select
                id="task-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="min-h-11 w-full rounded-xl border border-[#e7e5d9] bg-[#f8f7f2] px-3 text-sm text-[#555b4b] outline-none transition focus:border-[#8c9b76] focus:ring-2 focus:ring-[#e7e9dc]"
              >
                <option value="ALL">All statuses</option>
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className="sr-only">
                Filter by priority
              </label>
              <select
                id="task-priority"
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value as PriorityFilter)
                }
                className="min-h-11 w-full rounded-xl border border-[#e7e5d9] bg-[#f8f7f2] px-3 text-sm text-[#555b4b] outline-none transition focus:border-[#8c9b76] focus:ring-2 focus:ring-[#e7e9dc]"
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
                className="min-h-11 rounded-xl border border-[#e7e5d9] px-4 text-sm font-semibold text-[#58664a] transition hover:border-[#cdd4bd] hover:bg-[#e7e9dc]"
              >
                Reset
              </button>
            )}
          </div>

          {!loading && !error && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#eeede5] pt-3">
              <p className="text-xs text-[#85877b]" aria-live="polite">
                Showing{" "}
                <span className="font-semibold text-[#343b2d]">
                  {filteredTasks.length}
                </span>{" "}
                of {tasks.length}{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </p>

              {hasFilters && (
                <p className="text-xs text-[#85877b]">
                  Filters are active
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-[#e8c9c0] bg-[#fbefeb] p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-lg text-[#a34f3d]">
                !
              </span>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#873d30]">
                  We couldn&apos;t load your tasks
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#a34f3d]">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => void loadTasks()}
                  disabled={loading}
                  className="mt-3 rounded-lg bg-[#873d30] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#6f3026] disabled:opacity-60"
                >
                  {loading ? "Trying again..." : "Try again"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] shadow-sm shadow-[#343b2d]/[0.03]">
          <div className="flex items-center justify-between border-b border-[#eeede5] px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-sm font-semibold text-[#343b2d]">
                {statusFilter === "ALL"
                  ? "All your work"
                  : statusConfig[statusFilter].label}
              </h3>
              <p className="mt-1 text-xs text-[#85877b]">
                Your tasks, all in one place
              </p>
            </div>
            <span className="rounded-lg bg-[#f0efe8] px-2.5 py-1.5 text-xs font-semibold text-[#77796e]">
              {loading ? "…" : filteredTasks.length}
            </span>
          </div>

          {loading ? (
            <div className="space-y-0 divide-y divide-[#eeede5]">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-4 px-5 py-6 sm:px-6">
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded-md bg-[#e7e9dc]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-2/5 animate-pulse rounded-md bg-[#eeede5]" />
                    <div className="h-3 w-3/4 animate-pulse rounded-md bg-[#f0efe8]" />
                    <div className="h-5 w-32 animate-pulse rounded-full bg-[#eeede5]" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-6 py-10 text-center text-sm text-[#85877b]">
              Your task list will appear here once loading succeeds.
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#dfe3d4] bg-[#e7e9dc] text-2xl text-[#58664a]">
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
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740]"
                >
                  <span aria-hidden="true">+</span>
                  Create your first task
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl border border-[#dfe3d4] px-4 py-2.5 text-sm font-semibold text-[#58664a] transition hover:bg-[#e7e9dc]"
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
            <p className="text-xs text-[#999b8f]">
              Small steps, steady progress. 🌱
            </p>
            <Link
              href="/dashboard/tasks/new"
              className="text-sm font-semibold text-[#58664a] transition hover:text-[#343b2d]"
            >
              Have something new to do? Create a task →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}