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

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await apiRequest<Task[]>("/tasks/");
        setTasks(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load tasks."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        task.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [tasks, search, statusFilter, priorityFilter]);

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

  return (
    <main className="min-h-screen bg-[#f7f7f8]">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="text-sm font-medium text-gray-400">
                Workspace
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
                Tasks
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage everything you need to accomplish.
              </p>
            </div>

            <Link
              href="/dashboard/tasks/new"
              className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + New task
            </Link>

          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">

          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">

            {/* Search */}
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 focus:bg-white"
            >
              <option value="ALL">All statuses</option>
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="COMPLETED">
                Completed
              </option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-400 focus:bg-white"
            >
              <option value="ALL">All priorities</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Task count */}
        {!loading && !error && (
          <p className="mb-4 text-sm text-gray-500">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1
              ? "task"
              : "tasks"}
          </p>
        )}

        {/* Tasks */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

          {loading ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-gray-400">
                Loading tasks...
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                ✓
              </div>

              <h2 className="mt-4 text-sm font-semibold text-gray-900">
                {tasks.length === 0
                  ? "No tasks yet"
                  : "No matching tasks"}
              </h2>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">
                {tasks.length === 0
                  ? "Create your first task and start making progress."
                  : "Try changing your search or filters."}
              </p>

              {tasks.length === 0 && (
                <Link
                  href="/dashboard/tasks/new"
                  className="mt-5 inline-flex rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Create task
                </Link>
              )}

            </div>
          ) : (
            <div className="divide-y divide-gray-100">

              {filteredTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/dashboard/tasks/${task.id}`}
                  className="block px-6 py-5 transition hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    {/* Task information */}
                    <div className="min-w-0">

                      <div className="flex items-center gap-3">

                        <h2
                          className={`truncate text-sm font-semibold ${
                            task.status === "COMPLETED"
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h2>

                      </div>

                      {task.description && (
                        <p className="mt-1 max-w-2xl truncate text-sm text-gray-400">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        {task.category_name && (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                            {task.category_name}
                          </span>
                        )}

                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                          {getStatusLabel(task.status)}
                        </span>

                        {task.due_date && (
                          <span className="text-xs text-gray-400">
                            Due {task.due_date}
                          </span>
                        )}

                      </div>

                    </div>

                    {/* Priority */}
                    <span
                      className={`self-start rounded-full px-3 py-1 text-xs font-medium sm:self-auto ${
                        task.priority === "HIGH"
                          ? "bg-red-50 text-red-600"
                          : task.priority === "MEDIUM"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>

                  </div>
                </Link>
              ))}

            </div>
          )}

        </div>
      </div>
    </main>
  );
}