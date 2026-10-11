
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";

type Priority = "LOW" | "MEDIUM" | "HIGH";
type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  category: number | null;
  category_name: string | null;
  created_at: string;
  updated_at: string;
};

const priorityStyles: Record<Priority, string> = {
  LOW: "border-[#d9decb] bg-[#e7e9dc] text-[#4d6040]",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-800",
  HIGH: "border-rose-200 bg-rose-50 text-rose-700",
};

const statusStyles: Record<TaskStatus, string> = {
  TODO: "border-stone-200 bg-stone-100 text-stone-700",
  IN_PROGRESS: "border-[#d9decb] bg-[#e7e9dc] text-[#4d6040]",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const priorityLabels: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTask() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest<Task>(`/tasks/${taskId}/`);

        if (active) {
          setTask(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load this task."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (taskId) {
      void loadTask();
    } else {
      setLoading(false);
      setError("Invalid task ID.");
    }

    return () => {
      active = false;
    };
  }, [taskId]);

  async function handleComplete() {
    if (!task || updating) return;

    setUpdating(true);
    setError("");

    try {
      const updatedTask = await apiRequest<Task>(
        `/tasks/${task.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "COMPLETED",
          }),
        }
      );

      setTask(updatedTask);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update this task."
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!task || deleting) return;

    const confirmed = window.confirm(
      `Delete "${task.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");

    try {
      await apiRequest(`/tasks/${task.id}/`, {
        method: "DELETE",
      });

      router.push("/dashboard/tasks");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete this task."
      );
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f7f2] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-8">
            <div className="h-4 w-32 rounded bg-[#eeede5]" />
            <div className="mt-8 h-8 w-2/3 rounded-lg bg-[#eeede5]" />
            <div className="mt-4 h-4 w-full max-w-lg rounded bg-[#eeede5]" />
            <div className="mt-3 h-4 w-3/4 rounded bg-[#eeede5]" />
            <div className="mt-10 h-24 rounded-xl bg-[#f0efe8]" />
          </div>
          <p className="mt-4 text-center text-sm text-[#85877b]">
            Loading your task...
          </p>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-[#f8f7f2] px-4 py-12 text-[#292c25] sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] px-6 py-12 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f0efe8] text-2xl text-[#58664a]">
            !
          </span>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Task not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#77796e]">
            {error || "This task does not exist or is no longer available."}
          </p>

          <Link
            href="/dashboard/tasks"
            className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740]"
          >
            ← Back to tasks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#292c25]">
      {/* Header */}
      <header className="border-b border-[#e7e5d9] bg-[#fdfcf8]">
        <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#85877b]"
          >
            <Link
              href="/dashboard"
              className="transition hover:text-[#343b2d]"
            >
              Workspace
            </Link>

            <span aria-hidden="true">/</span>

            <Link
              href="/dashboard/tasks"
              className="transition hover:text-[#343b2d]"
            >
              Tasks
            </Link>

            <span aria-hidden="true">/</span>

            <span className="max-w-48 truncate text-[#58664a]">
              {task.title}
            </span>
          </nav>

          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7e9dc] text-xl text-[#58664a]">
                  ✓
                </span>

                <span className="text-sm font-semibold text-[#58664a]">
                  Task overview
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#292c25] sm:text-4xl">
                Task details
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#77796e]">
                Review your task, track its progress, and take the next step
                toward getting it done.
              </p>
            </div>

            <Link
              href="/dashboard/tasks"
              className="inline-flex min-h-11 items-center justify-center self-start rounded-xl border border-[#e7e5d9] bg-white px-4 py-2.5 text-sm font-semibold text-[#58664a] transition hover:border-[#cdd4bd] hover:bg-[#f8f7f2] sm:self-auto"
            >
              ← Back to tasks
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-[#e8c9c0] bg-[#fbefeb] px-4 py-3 text-sm text-[#a34f3d]"
          >
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
          {/* Task information */}
          <article className="overflow-hidden rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] shadow-sm shadow-[#343b2d]/[0.03]">
            <div className="px-5 py-6 sm:px-7 sm:py-8">
              {/* Status and priority */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyles[task.status]}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-600"
                        : task.status === "IN_PROGRESS"
                          ? "bg-[#58664a]"
                          : "bg-stone-400"
                    }`}
                  />
                  {statusLabels[task.status]}
                </span>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${priorityStyles[task.priority]}`}
                >
                  {priorityLabels[task.priority]} priority
                </span>

                {task.category_name && (
                  <span className="rounded-full border border-[#e7e5d9] bg-[#f5f4ed] px-3 py-1.5 text-xs font-semibold text-[#68705e]">
                    {task.category_name}
                  </span>
                )}
              </div>

              {/* Title and description */}
              <h2
                className={`mt-7 break-words text-2xl font-semibold tracking-tight sm:text-3xl ${
                  task.status === "COMPLETED"
                    ? "text-[#85877b] line-through"
                    : "text-[#292c25]"
                }`}
              >
                {task.title}
              </h2>

              <p className="mt-2 text-xs text-[#999b8f]">
                Task #{task.id}
              </p>

              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#85877b]">
                  Description
                </h3>

                {task.description?.trim() ? (
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#62665a]">
                    {task.description}
                  </p>
                ) : (
                  <p className="mt-3 text-sm italic text-[#999b8f]">
                    No description has been added to this task.
                  </p>
                )}
              </div>

              {/* Task metadata */}
              <div className="mt-8 border-t border-[#eeede5] pt-7">
                <h3 className="text-sm font-semibold text-[#343b2d]">
                  Task information
                </h3>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#eeede5] bg-[#faf9f4] p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7e9dc] text-lg text-[#58664a]">
                      ◷
                    </span>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#85877b]">
                      Due date
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-[#414638]">
                      {task.due_date
                        ? formatDate(task.due_date)
                        : "No due date"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#eeede5] bg-[#faf9f4] p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e7e9dc] text-lg text-[#58664a]">
                      +
                    </span>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#85877b]">
                      Created on
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-[#414638]">
                      {formatDate(task.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 text-xs text-[#85877b] sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Last updated: {formatDate(task.updated_at)}
                  </span>

                  <span>Task ID: #{task.id}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 border-t border-[#eeede5] bg-[#faf9f4] px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:px-7">
              <Link
                href={`/dashboard/tasks/${task.id}/edit`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e7e5d9] bg-white px-5 py-3 text-sm font-semibold text-[#58664a] transition hover:border-[#cdd4bd] hover:bg-[#f8f7f2]"
              >
                Edit task
              </Link>

              {task.status !== "COMPLETED" && (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={updating || deleting}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    <>✓ Mark as completed</>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || updating}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e8c9c0] bg-white px-5 py-3 text-sm font-semibold text-[#a34f3d] transition hover:bg-[#fbefeb] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete task"}
              </button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Progress card */}
            <div className="rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5">
              <h2 className="text-sm font-semibold text-[#343b2d]">
                Task progress
              </h2>

              <p className="mt-1 text-sm text-[#85877b]">
                Keep moving forward, one step at a time.
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-sm text-[#77796e]">Current status</span>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status]}`}
                >
                  {statusLabels[task.status]}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eeede5]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    task.status === "COMPLETED"
                      ? "w-full bg-emerald-600"
                      : task.status === "IN_PROGRESS"
                        ? "w-1/2 bg-[#899873]"
                        : "w-0 bg-[#899873]"
                  }`}
                />
              </div>

              <p className="mt-2 text-xs text-[#85877b]">
                {task.status === "COMPLETED"
                  ? "100% · Task completed"
                  : task.status === "IN_PROGRESS"
                    ? "50% · Work in progress"
                    : "0% · Ready to get started"}
              </p>
            </div>

            {/* Task summary */}
            <div className="rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5">
              <h2 className="text-sm font-semibold text-[#343b2d]">
                Quick summary
              </h2>

              <div className="mt-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-[#85877b]">Priority</span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}
                  >
                    {priorityLabels[task.priority]}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-[#85877b]">Category</span>

                  <span className="max-w-36 break-words text-right text-sm font-medium text-[#414638]">
                    {task.category_name || "Uncategorized"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm text-[#85877b]">Due date</span>

                  <span className="text-right text-sm font-medium text-[#414638]">
                    {task.due_date ? formatDate(task.due_date) : "Not set"}
                  </span>
                </div>
              </div>
            </div>

            {/* Encouragement card */}
            <div className="rounded-2xl border border-[#dfe3d4] bg-[#e7e9dc]/60 p-5">
              <span className="text-2xl" aria-hidden="true">
                🌱
              </span>

              <h2 className="mt-3 text-sm font-semibold text-[#343b2d]">
                Progress over perfection
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#68735b]">
                Every completed task is a step forward. Stay consistent, focus
                on what matters, and celebrate your progress.
              </p>

              {task.status !== "COMPLETED" && (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={updating || deleting}
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#343b2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4b5740] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? "Updating..." : "Complete this task"}
                </button>
              )}
            </div>

            <Link
              href="/dashboard/tasks"
              className="flex min-h-11 items-center justify-center rounded-xl border border-[#e7e5d9] bg-white px-4 py-3 text-sm font-semibold text-[#58664a] transition hover:bg-[#faf9f4]"
            >
              View all tasks →
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
