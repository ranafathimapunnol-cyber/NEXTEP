
"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
};

type Priority = Task["priority"];
type TaskStatus = Task["status"];

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

function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-[#414638]"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-2 text-xs leading-5 text-[#85877b]">{hint}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#e7e5d9] bg-[#f8f7f2] px-4 py-3 text-sm text-[#292c25] outline-none transition placeholder:text-[#a0a194] focus:border-[#8c9b76] focus:bg-white focus:ring-4 focus:ring-[#e7e9dc]/70 disabled:cursor-not-allowed disabled:opacity-60";

export default function EditTaskPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [taskData, categoryData] = await Promise.all([
          apiRequest<Task>(`/tasks/${taskId}/`),
          apiRequest<Category[]>("/categories/"),
        ]);

        if (!active) return;

        setTask(taskData);
        setCategories(categoryData);
        setTitle(taskData.title);
        setDescription(taskData.description || "");
        setCategory(
          taskData.category !== null ? String(taskData.category) : ""
        );
        setPriority(taskData.priority);
        setStatus(taskData.status);
        setDueDate(taskData.due_date?.slice(0, 10) || "");
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load this task."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (taskId) void loadData();

    return () => {
      active = false;
    };
  }, [taskId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updatedTask = await apiRequest<Task>(`/tasks/${taskId}/`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category ? Number(category) : null,
          priority,
          status,
          due_date: dueDate || null,
        }),
      });

      setTask(updatedTask);
      router.push(`/dashboard/tasks/${taskId}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update this task."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f7f2] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-3 w-36 rounded bg-[#e7e5d9]" />
          <div className="mt-6 h-9 w-64 rounded-lg bg-[#e7e5d9]" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-[#eeede5]" />
          <div className="mt-8 rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-6 sm:p-8">
            <div className="h-5 w-40 rounded bg-[#e7e5d9]" />
            <div className="mt-6 h-12 rounded-xl bg-[#eeede5]" />
            <div className="mt-6 h-28 rounded-xl bg-[#eeede5]" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="h-12 rounded-xl bg-[#eeede5]" />
              <div className="h-12 rounded-xl bg-[#eeede5]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !task) {
    return (
      <main className="min-h-screen bg-[#f8f7f2] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard/tasks"
            className="text-sm font-medium text-[#58664a] transition hover:text-[#343b2d]"
          >
            ← Back to tasks
          </Link>

          <div
            role="alert"
            className="mt-8 rounded-2xl border border-[#e8c9c0] bg-[#fbefeb] p-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-lg font-semibold text-[#a34f3d]">
              !
            </div>
            <h1 className="mt-4 text-lg font-semibold text-[#873d30]">
              Unable to open this task
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#a34f3d]">{error}</p>
            <Link
              href="/dashboard/tasks"
              className="mt-5 inline-flex items-center rounded-xl bg-[#343b2d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4b5740]"
            >
              Return to tasks
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!task) return null;

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#292c25]">
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
            <Link
              href={`/dashboard/tasks/${taskId}`}
              className="max-w-40 truncate transition hover:text-[#343b2d]"
            >
              {task.title}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#58664a]">Edit</span>
          </nav>

          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7e9dc] text-lg text-[#58664a]">
                  ✎
                </span>
                <span className="text-sm font-semibold text-[#58664a]">
                  Task details
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#292c25] sm:text-4xl">
                Edit your task
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#77796e]">
                Make adjustments, set priorities, and keep your next steps
                clear.
              </p>
            </div>

            <Link
              href={`/dashboard/tasks/${taskId}`}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[#e7e5d9] bg-white px-4 py-2.5 text-sm font-semibold text-[#58664a] transition hover:border-[#cdd4bd] hover:bg-[#f8f7f2]"
            >
              Cancel editing
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] shadow-sm shadow-[#343b2d]/[0.03]"
          >
            <div className="border-b border-[#eeede5] px-5 py-5 sm:px-7">
              <h2 className="text-base font-semibold text-[#343b2d]">
                Edit task information
              </h2>
              <p className="mt-1 text-sm text-[#85877b]">
                Fields marked with * are required.
              </p>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-7 sm:py-7">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#e8c9c0] bg-[#fbefeb] px-4 py-3 text-sm text-[#a34f3d]"
                >
                  <p className="font-semibold">Please check your changes</p>
                  <p className="mt-1">{error}</p>
                </div>
              )}

              <FormField
                label="Task title *"
                htmlFor="title"
                hint="Keep it short and clear so you can recognize it at a glance."
              >
                <input
                  id="title"
                  type="text"
                  required
                  maxLength={200}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Finish project documentation"
                  className={inputClass}
                />
                <p className="mt-1.5 text-right text-xs text-[#999b8f]">
                  {title.length}/200
                </p>
              </FormField>

              <FormField
                label="Description"
                htmlFor="description"
                hint="Add context, notes, or the steps needed to complete this task."
              >
                <textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  placeholder="What needs to be done?"
                  className={`${inputClass} resize-y`}
                />
              </FormField>

              <div className="border-t border-[#eeede5]" />

              <div>
                <h3 className="text-sm font-semibold text-[#343b2d]">
                  Organization
                </h3>
                <p className="mt-1 text-sm text-[#85877b]">
                  Group your task and decide what deserves attention first.
                </p>
              </div>

              <FormField label="Category" htmlFor="category">
                <select
                  id="category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClass}
                >
                  <option value="">No category</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Priority" htmlFor="priority">
                  <select
                    id="priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value as Priority)
                    }
                    className={inputClass}
                  >
                    <option value="LOW">Low priority</option>
                    <option value="MEDIUM">Medium priority</option>
                    <option value="HIGH">High priority</option>
                  </select>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[priority]}`}
                  >
                    {priority} priority
                  </span>
                </FormField>

                <FormField label="Status" htmlFor="status">
                  <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value as TaskStatus)
                    }
                    className={inputClass}
                  >
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
                  >
                    {statusLabels[status]}
                  </span>
                </FormField>
              </div>

              <div className="border-t border-[#eeede5]" />

              <div>
                <h3 className="text-sm font-semibold text-[#343b2d]">
                  Schedule
                </h3>
                <p className="mt-1 text-sm text-[#85877b]">
                  Give yourself a target date to work toward.
                </p>
              </div>

              <FormField
                label="Due date"
                htmlFor="dueDate"
                hint="Leave this empty if the task has no deadline."
              >
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#eeede5] bg-[#faf9f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs text-[#85877b]">
                Your changes are saved when you select Save changes.
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                  href={`/dashboard/tasks/${taskId}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e7e5d9] bg-white px-5 py-3 text-sm font-semibold text-[#58664a] transition hover:bg-[#f8f7f2]"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving || !title.trim()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4b5740] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving changes...
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">✓</span>
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5">
              <h2 className="text-sm font-semibold text-[#343b2d]">
                Current task
              </h2>
              <p className="mt-3 break-words text-base font-semibold text-[#343b2d]">
                {title || "Untitled task"}
              </p>
              <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-[#77796e]">
                {description || "No description added yet."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[priority]}`}
                >
                  {priority} priority
                </span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
                >
                  {statusLabels[status]}
                </span>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#eeede5] pt-4 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#85877b]">Category</span>
                  <span className="text-right font-medium text-[#414638]">
                    {categories.find((item) => String(item.id) === category)
                      ?.name ||
                      task.category_name ||
                      "Uncategorized"}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#85877b]">Due date</span>
                  <span className="text-right font-medium text-[#414638]">
                    {dueDate || "Not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#dfe3d4] bg-[#e7e9dc]/60 p-5">
              <span className="text-xl" aria-hidden="true">🌱</span>
              <h2 className="mt-3 text-sm font-semibold text-[#343b2d]">
                Keep it manageable
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#68735b]">
                Break larger goals into small, actionable tasks. A clear next
                step makes it easier to keep moving.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}