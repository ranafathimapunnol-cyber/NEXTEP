
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

type Category = {
  id: number;
  name: string;
  description: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  due_date: string | null;
  category: number | null;
  category_name: string | null;
  created_at: string;
  updated_at: string;
};

const categoryIcons = ["💼", "🌱", "🚀", "📚", "🎯", "💡"];

const priorityStyles: Record<Task["priority"], string> = {
  LOW: "border-[#e7e5d9] bg-[#f4f3ed] text-[#77796e]",
  MEDIUM: "border-[#e9dfbd] bg-[#f7f1df] text-[#8b7136]",
  HIGH: "border-[#ead4c9] bg-[#f8ece6] text-[#a35d43]",
};

const statusStyles: Record<Task["status"], string> = {
  TODO: "border-[#e7e5d9] bg-[#f4f3ed] text-[#77796e]",
  IN_PROGRESS: "border-[#dce3ce] bg-[#edf0e5] text-[#596b46]",
  COMPLETED: "border-[#d7e5d4] bg-[#edf4e9] text-[#52734b]",
};

function formatDueDate(dateString: string) {
  const date = new Date(`${dateString.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDueDateState(dateString: string | null, status: Task["status"]) {
  if (!dateString || status === "COMPLETED") {
    return null;
  }

  const dueDate = new Date(`${dateString.slice(0, 10)}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(dueDate.getTime())) {
    return null;
  }

  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return "Overdue";
  }

  if (dueDate.getTime() === today.getTime()) {
    return "Due today";
  }

  return null;
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#77796e]">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e7e9dc] text-base">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-[#292c25]">
        {value}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="h-4 w-32 rounded bg-[#e7e5d9]" />

      <div className="mt-7 rounded-3xl border border-[#e7e5d9] bg-[#fdfcf8] p-6 sm:p-8">
        <div className="flex gap-4">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-[#e7e9dc]" />

          <div className="flex-1 space-y-3">
            <div className="h-3 w-20 rounded bg-[#e7e5d9]" />
            <div className="h-8 w-56 max-w-full rounded bg-[#e7e5d9]" />
            <div className="h-4 w-full max-w-md rounded bg-[#e7e5d9]" />
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8]"
          />
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8]"
          />
        ))}
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: Task }) {
  const dueState = getDueDateState(task.due_date, task.status);

  return (
    <Link
      href={`/dashboard/tasks/${task.id}`}
      className="group block rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#cbd1bb] hover:shadow-[0_8px_24px_rgba(52,59,45,0.06)]"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                task.status === "COMPLETED"
                  ? "bg-[#8c9b76]"
                  : task.status === "IN_PROGRESS"
                    ? "bg-[#b2a36d]"
                    : "bg-[#c8c8ba]"
              }`}
            />

            <div className="min-w-0 flex-1">
              <h3
                className={`truncate text-base font-semibold transition ${
                  task.status === "COMPLETED"
                    ? "text-[#8a8b80] line-through"
                    : "text-[#292c25] group-hover:text-[#596b46]"
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[#77796e]">
                  {task.description}
                </p>
              )}

              {task.due_date && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    dueState === "Overdue"
                      ? "text-[#a35d43]"
                      : dueState === "Due today"
                        ? "text-[#8b7136]"
                        : "text-[#8a8b80]"
                  }`}
                >
                  {dueState && <span>{dueState} · </span>}
                  Due {formatDueDate(task.due_date)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pl-5 sm:max-w-56 sm:justify-end sm:pl-0">
          <span
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${statusStyles[task.status]}`}
          >
            {task.status.replace("_", " ")}
          </span>

          <span
            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>

          <span
            aria-hidden="true"
            className="ml-1 text-lg text-[#b5b6a9] transition group-hover:translate-x-0.5 group-hover:text-[#596b46]"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryDetailPage() {
  const params = useParams<{ id: string }>();
  const categoryId = params.id;

  const [category, setCategory] = useState<Category | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategoryData = useCallback(async () => {
    if (!categoryId || !/^\d+$/.test(categoryId)) {
      setCategory(null);
      setTasks([]);
      setError("The category ID is invalid.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [categoryData, taskData] = await Promise.all([
        apiRequest<Category>(`/categories/${categoryId}/`),
        apiRequest<Task[]>(`/tasks/?category=${categoryId}`),
      ]);

      setCategory(categoryData);
      setTasks(Array.isArray(taskData) ? taskData : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading this category."
      );
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    void loadCategoryData();
  }, [loadCategoryData]);

  if (loading) {
    return (
      <main className="min-h-full p-5 sm:p-7 lg:p-10">
        <LoadingSkeleton />
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="min-h-full p-5 sm:p-7 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#77796e] transition hover:text-[#343b2d]"
          >
            <span aria-hidden="true">←</span>
            Back to categories
          </Link>

          <section
            role="alert"
            className="mt-8 rounded-3xl border border-[#e7e5d9] bg-[#fdfcf8] p-7 sm:p-10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8ece6] text-xl text-[#a35d43]">
              !
            </div>

            <h1 className="mt-5 text-xl font-semibold text-[#292c25]">
              Unable to load category
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-[#77796e]">
              {error || "This category could not be found."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void loadCategoryData()}
                className="rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740]"
              >
                Try again
              </button>

              <Link
                href="/dashboard/categories"
                className="rounded-xl border border-[#e7e5d9] px-5 py-3 text-sm font-semibold text-[#555b4b] transition hover:bg-[#e7e9dc]"
              >
                All categories
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const iconIndex = category.id % categoryIcons.length;

  return (
    <main className="min-h-full p-5 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#77796e] transition hover:text-[#343b2d]"
        >
          <span aria-hidden="true">←</span>
          Back to categories
        </Link>

        {/* Category header */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#e7e5d9] bg-[#fdfcf8]">
          <div className="h-1.5 bg-gradient-to-r from-[#343b2d] via-[#8c9b76] to-[#d8dcc8]" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#e7e5d9] bg-[#e7e9dc] text-2xl">
                  {categoryIcons[iconIndex]}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8c9b76]">
                    Category overview
                  </p>

                  <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight text-[#292c25] sm:text-3xl">
                    {category.name}
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#77796e]">
                    {category.description?.trim() ||
                      "No description has been added for this category yet."}
                  </p>
                </div>
              </div>

              <div className="shrink-0 rounded-2xl border border-[#e7e5d9] bg-[#f8f7f2] p-4 sm:min-w-32">
                <p className="text-xs font-medium text-[#77796e]">
                  Completion
                </p>

                <p className="mt-1 text-2xl font-semibold text-[#343b2d]">
                  {completionPercentage}%
                </p>

                <div
                  className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#e7e5d9]"
                  role="progressbar"
                  aria-label="Task completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={completionPercentage}
                >
                  <div
                    className="h-full rounded-full bg-[#8c9b76] transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#77796e]">
                  {completedTasks} of {totalTasks} completed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section
          aria-label="Task summary"
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <SummaryCard label="Total tasks" value={totalTasks} icon="📋" />
          <SummaryCard label="To do" value={pendingTasks} icon="◷" />
          <SummaryCard label="In progress" value={inProgressTasks} icon="↗" />
          <SummaryCard label="Completed" value={completedTasks} icon="✓" />
        </section>

        {/* Task list heading */}
        <section className="mt-9">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[#292c25]">
                Tasks
              </h2>

              <p className="mt-1.5 text-sm text-[#77796e]">
                Everything assigned to {category.name}.
              </p>
            </div>

            <Link
              href={`/dashboard/tasks/new?category=${category.id}`}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#343b2d] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b5740] sm:self-auto"
            >
              <span aria-hidden="true" className="text-base">
                +
              </span>
              New task
            </Link>
          </div>

          {/* Task list */}
          <div className="mt-5">
            {tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#d9dacd] bg-[#fdfcf8] px-6 py-12 text-center sm:px-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7e9dc] text-2xl text-[#596b46]">
                  ✓
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#292c25]">
                  A fresh start
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#77796e]">
                  There are no tasks in this category yet. Create one to start
                  organizing your work.
                </p>

                <Link
                  href={`/dashboard/tasks/new?category=${category.id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740]"
                >
                  <span aria-hidden="true">+</span>
                  Create your first task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer note */}
        {tasks.length > 0 && (
          <p className="mt-5 text-center text-xs text-[#929386]">
            Showing {tasks.length} {tasks.length === 1 ? "task" : "tasks"} in
            this category.
          </p>
        )}
      </div>
    </main>
  );
}
