"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

const priorityStyles = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-red-50 text-red-600",
};

const statusStyles = {
  TODO: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-green-50 text-green-600",
};

const categoryIcons = [
  "💼",
  "🌱",
  "🚀",
  "📚",
  "🎯",
  "💡",
];

export default function CategoryDetailPage() {
  const params = useParams();

  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategoryData() {
      try {
        setLoading(true);
        setError("");

        const [categoryData, taskData] = await Promise.all([
          apiRequest<Category>(
            `/categories/${categoryId}/`
          ),
          apiRequest<Task[]>(
            `/tasks/?category=${categoryId}`
          ),
        ]);

        setCategory(categoryData);
        setTasks(taskData);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load category."
        );
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      loadCategoryData();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

          <div className="mt-4 h-10 w-64 animate-pulse rounded bg-gray-200" />

          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />

          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/dashboard/categories"
            className="text-sm font-medium text-gray-500 hover:text-gray-950"
          >
            ← Back to categories
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8">
            <h1 className="text-lg font-semibold text-red-700">
              Unable to load category
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error || "Category not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const iconIndex = category.id % categoryIcons.length;

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-gray-950"
        >
          ← Back to categories
        </Link>

        {/* Category Header */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 lg:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                {categoryIcons[iconIndex]}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Category
                </p>

                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
                  {category.name}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  {category.description ||
                    "No description provided for this category."}
                </p>
              </div>
            </div>

            <div className="shrink-0 rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-400">
                Progress
              </p>

              <p className="mt-1 text-lg font-semibold text-gray-950">
                {completedTasks}/{tasks.length}
              </p>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-950">
                Tasks
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tasks assigned to {category.name}.
              </p>
            </div>

            <Link
              href="/dashboard/tasks/new"
              className="rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + New task
            </Link>
          </div>

          <div className="mt-5">
            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  ✓
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-950">
                  No tasks in this category
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Create a task and assign it to this category.
                </p>

                <Link
                  href="/dashboard/tasks/new"
                  className="mt-5 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Create task
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="group block rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                              task.status === "COMPLETED"
                                ? "bg-green-500"
                                : task.status === "IN_PROGRESS"
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                            }`}
                          />

                          <h3
                            className={`truncate text-base font-semibold ${
                              task.status === "COMPLETED"
                                ? "text-gray-400 line-through"
                                : "text-gray-950"
                            }`}
                          >
                            {task.title}
                          </h3>
                        </div>

                        {task.description && (
                          <p className="mt-2 line-clamp-1 pl-5 text-sm text-gray-500">
                            {task.description}
                          </p>
                        )}

                        {task.due_date && (
                          <p className="mt-2 pl-5 text-xs text-gray-400">
                            Due {task.due_date}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2 pl-5 sm:pl-0">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[task.status]
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>

                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="ml-1 text-gray-300 transition group-hover:text-gray-600">
                          →
                        </span>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}