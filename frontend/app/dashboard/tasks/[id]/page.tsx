"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  created_at: string;
  updated_at: string;
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();

  const taskId = params.id;

  const [task, setTask] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await apiRequest<Task>(
          `/tasks/${taskId}/`
        );

        setTask(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load task."
        );
      } finally {
        setLoading(false);
      }
    }

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  async function handleComplete() {
    if (!task) return;

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
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update task."
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!task) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      await apiRequest(`/tasks/${task.id}/`, {
        method: "DELETE",
      });

      router.push("/dashboard/tasks");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete task."
      );

      setDeleting(false);
    }
  }

  function getPriorityLabel(
    priority: Task["priority"]
  ) {
    switch (priority) {
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
    }
  }

  function getStatusLabel(
    status: Task["status"]
  ) {
    switch (status) {
      case "TODO":
        return "Todo";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f7f8]">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10">
            <p className="text-sm text-gray-400">
              Loading task...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="min-h-screen bg-[#f7f7f8]">
        <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
              !
            </div>

            <h1 className="mt-5 text-xl font-semibold text-gray-950">
              Task not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {error || "This task does not exist."}
            </p>

            <Link
              href="/dashboard/tasks"
              className="mt-6 inline-flex rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to tasks
            </Link>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f8]">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">

          <Link
            href="/dashboard/tasks"
            className="text-sm font-medium text-gray-500 transition hover:text-gray-950"
          >
            ← Back to tasks
          </Link>

        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Task Card */}
        <article className="rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Main */}
          <div className="p-6 sm:p-8">

            {/* Status + Priority + Category */}
            <div className="flex flex-wrap items-center gap-2">

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  task.status === "COMPLETED"
                    ? "bg-green-50 text-green-600"
                    : task.status === "IN_PROGRESS"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {getStatusLabel(task.status)}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  task.priority === "HIGH"
                    ? "bg-red-50 text-red-600"
                    : task.priority === "MEDIUM"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {getPriorityLabel(task.priority)}
              </span>

              {task.category_name && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                  {task.category_name}
                </span>
              )}

            </div>

            {/* Title */}
            <h1
              className={`mt-6 text-3xl font-semibold tracking-tight ${
                task.status === "COMPLETED"
                  ? "text-gray-400 line-through"
                  : "text-gray-950"
              }`}
            >
              {task.title}
            </h1>

            {/* Description */}
            {task.description && (
              <p className="mt-5 max-w-2xl whitespace-pre-wrap text-base leading-7 text-gray-500">
                {task.description}
              </p>
            )}

            {/* Details */}
            <div className="mt-8 grid gap-4 border-t border-gray-100 pt-8 sm:grid-cols-2">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Due date
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  {task.due_date
                    ? formatDate(task.due_date)
                    : "No due date"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Created
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  {formatDate(task.created_at)}
                </p>
              </div>

            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 p-6 sm:flex-row sm:justify-end">

            {/* Edit */}
            <Link
              href={`/dashboard/tasks/${task.id}/edit`}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Edit task
            </Link>

            {/* Complete */}
            {task.status !== "COMPLETED" && (
              <button
                type="button"
                onClick={handleComplete}
                disabled={updating}
                className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating
                  ? "Updating..."
                  : "✓ Mark as completed"}
              </button>
            )}

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete task"}
            </button>

          </div>

        </article>
      </div>
    </main>
  );
}