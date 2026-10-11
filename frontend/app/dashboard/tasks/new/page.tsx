
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { apiRequest } from "@/lib/api";

type Priority = "LOW" | "MEDIUM" | "HIGH";
type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

type Category = {
  id: number;
  name: string;
};

type TaskForm = {
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string;
  category: string;
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

const inputClass =
  "mt-2 w-full rounded-xl border border-[#e7e5d9] bg-white px-4 py-3 text-sm text-[#292c25] outline-none transition placeholder:text-[#a2a397] focus:border-[#899873] focus:ring-2 focus:ring-[#e7e9dc] disabled:cursor-not-allowed disabled:bg-[#f5f4ed]";

const labelClass =
  "text-sm font-semibold text-[#414638]";

const initialForm: TaskForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "TODO",
  due_date: "",
  category: "",
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function CreateTaskPage() {
  const router = useRouter();

  const [form, setForm] = useState<TaskForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        // Assumes GET /categories/ returns either an array
        // or a Django REST Framework paginated response.
        const response = await apiRequest<
          Category[] | { results: Category[] }
        >("/categories/");

        const items = Array.isArray(response)
          ? response
          : response.results;

        if (active) {
          setCategories(items);
        }
      } catch {
        if (active) {
          setCategoryError(
            "Categories could not be loaded. You can still create a task without one."
          );
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  function handleChange(
    field: keyof TaskForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (saving) return;

    setError("");

    const title = form.title.trim();

    if (!title) {
      setError("Please enter a task title.");
      return;
    }

    if (form.category && !categories.some(
      (category) => category.id === Number(form.category)
    )) {
      setError(
        "Please select a valid category or choose No category."
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        title,
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        due_date: form.due_date || null,
        category: form.category
          ? Number(form.category)
          : null,
      };

      await apiRequest("/tasks/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push("/dashboard/tasks");
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f7f2] text-[#292c25]">
      {/* Page header */}
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

            <span className="text-[#58664a]">
              Create task
            </span>
          </nav>

          <div className="mt-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7e9dc] text-xl text-[#58664a]">
                  +
                </span>

                <span className="text-sm font-semibold text-[#58664a]">
                  Task management
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create a new task
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#77796e]">
                Turn your next goal into an actionable task.
                Add the details, choose a priority, and get started.
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
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_270px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] shadow-sm shadow-[#343b2d]/[0.03]"
          >
            <div className="border-b border-[#eeede5] px-5 py-6 sm:px-7">
              <h2 className="text-lg font-semibold text-[#343b2d]">
                Task information
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
                  <p className="font-semibold">
                    Unable to create task
                  </p>

                  <p className="mt-1 break-words">
                    {error}
                  </p>
                </div>
              )}

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className={labelClass}
                >
                  Task title *
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  autoFocus
                  maxLength={255}
                  value={form.title}
                  onChange={(event) =>
                    handleChange("title", event.target.value)
                  }
                  placeholder="e.g. Complete project documentation"
                  className={inputClass}
                />

                <div className="mt-2 flex justify-between gap-3">
                  <p className="text-xs text-[#999b8f]">
                    Keep your title short and descriptive.
                  </p>

                  <span
                    className={`shrink-0 text-xs ${
                      form.title.length >= 240
                        ? "text-rose-600"
                        : "text-[#999b8f]"
                    }`}
                  >
                    {form.title.length}/255
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className={labelClass}
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  maxLength={5000}
                  value={form.description}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Describe the work, important details, or expected outcome..."
                  className={`${inputClass} resize-y`}
                />

                <p className="mt-2 text-xs text-[#999b8f]">
                  {form.description.length}/5000 characters
                </p>
              </div>

              {/* Priority */}
              <fieldset>
                <legend className={labelClass}>
                  Priority
                </legend>

                <p className="mt-1 text-xs text-[#85877b]">
                  How important is this task?
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(
                    ["LOW", "MEDIUM", "HIGH"] as Priority[]
                  ).map((priority) => (
                    <label
                      key={priority}
                      className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                        form.priority === priority
                          ? `${priorityStyles[priority]} ring-2 ring-[#899873]/30`
                          : "border-[#e7e5d9] bg-white text-[#77796e] hover:bg-[#faf9f4]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={form.priority === priority}
                        onChange={() =>
                          handleChange("priority", priority)
                        }
                        className="accent-[#58664a]"
                      />

                      {priority === "LOW"
                        ? "Low"
                        : priority === "MEDIUM"
                          ? "Medium"
                          : "High"}
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Status and category */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="status"
                    className={labelClass}
                  >
                    Initial status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={(event) =>
                      handleChange("status", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="TODO">To do</option>
                    <option value="IN_PROGRESS">
                      In progress
                    </option>
                    <option value="COMPLETED">
                      Completed
                    </option>
                  </select>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[form.status]}`}
                  >
                    {form.status === "TODO"
                      ? "To do"
                      : form.status === "IN_PROGRESS"
                        ? "In progress"
                        : "Completed"}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className={labelClass}
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={(event) =>
                      handleChange("category", event.target.value)
                    }
                    disabled={categoriesLoading}
                    className={inputClass}
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "No category"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={String(category.id)}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {categoryError && (
                    <p
                      role="status"
                      className="mt-2 text-xs leading-5 text-[#a34f3d]"
                    >
                      {categoryError}
                    </p>
                  )}
                </div>
              </div>

              {/* Due date */}
              <div>
                <label
                  htmlFor="due_date"
                  className={labelClass}
                >
                  Due date
                </label>

                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={(event) =>
                    handleChange("due_date", event.target.value)
                  }
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-[#999b8f]">
                  Leave empty if this task has no deadline.
                </p>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#eeede5] bg-[#faf9f4] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <p className="text-xs leading-5 text-[#85877b]">
                You can update these details later.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard/tasks"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#e7e5d9] bg-white px-5 py-3 text-sm font-semibold text-[#58664a] transition hover:bg-[#f5f4ed]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating task...
                    </>
                  ) : (
                    <>+ Create task</>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Live preview */}
            <div className="rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[#343b2d]">
                  Live preview
                </h2>

                <span className="rounded-full bg-[#e7e9dc] px-2.5 py-1 text-xs font-semibold text-[#58664a]">
                  Preview
                </span>
              </div>

              <p className="mt-1 text-sm text-[#85877b]">
                See how your task is shaping up.
              </p>

              <div className="mt-5 rounded-xl border border-[#eeede5] bg-[#faf9f4] p-4">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[form.status]}`}
                  >
                    {form.status === "TODO"
                      ? "To do"
                      : form.status === "IN_PROGRESS"
                        ? "In progress"
                        : "Completed"}
                  </span>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[form.priority]}`}
                  >
                    {form.priority === "LOW"
                      ? "Low"
                      : form.priority === "MEDIUM"
                        ? "Medium"
                        : "High"}
                  </span>
                </div>

                <h3 className="mt-4 break-words text-base font-semibold text-[#343b2d]">
                  {form.title.trim() || "Your task title"}
                </h3>

                <p className="mt-2 line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-[#77796e]">
                  {form.description.trim() ||
                    "Your task description will appear here."}
                </p>

                <div className="mt-4 border-t border-[#e7e5d9] pt-3 text-xs text-[#85877b]">
                  <p>
                    Category:{" "}
                    {categories.find(
                      (category) =>
                        String(category.id) === form.category
                    )?.name || "None"}
                  </p>

                  <p className="mt-2">
                    Due date: {form.due_date || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-[#dfe3d4] bg-[#e7e9dc]/60 p-5">
              <span className="text-2xl" aria-hidden="true">
                🌱
              </span>

              <h2 className="mt-3 text-sm font-semibold text-[#343b2d]">
                Make it actionable
              </h2>

              <ul className="mt-3 space-y-3 text-sm leading-6 text-[#68735b]">
                <li className="flex gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>Use a clear, specific task title.</span>
                </li>

                <li className="flex gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>Break complicated work into smaller tasks.</span>
                </li>

                <li className="flex gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>Choose a realistic priority and deadline.</span>
                </li>
              </ul>
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
