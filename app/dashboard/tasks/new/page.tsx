"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";

type Category = {
  id: number;
  name: string;
  description: string;
};

type TaskResponse = {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date: string | null;
  category: number | null;
  category_name: string | null;
};

export default function NewTaskPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiRequest<Category[]>("/categories/");
        setCategories(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setCreating(true);

      const task = await apiRequest<TaskResponse>("/tasks/", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category: category ? Number(category) : null,
          priority,
          status,
          due_date: dueDate || null,
        }),
      });

      router.push(`/dashboard/tasks/${task.id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create task."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/dashboard/tasks"
          className="text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          ← Back to tasks
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500">
            Workspace
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
            Create a task
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add a task and organize it into a category.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 lg:p-8"
        >
          <div className="space-y-6">

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Task title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Finish authentication"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe what needs to be done..."
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                disabled={loadingCategories}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "No category"}
                </option>

                {categories.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

              {!loadingCategories &&
                categories.length === 0 && (
                  <p className="mt-2 text-xs text-gray-400">
                    Create a category first from the Categories page.
                  </p>
                )}
            </div>

            {/* Priority + Status */}
            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="priority"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Priority
                </label>

                <select
                  id="priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">
                    In Progress
                  </option>
                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>

            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Due date
              </label>

              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

            <Link
              href="/dashboard/tasks"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create task"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}