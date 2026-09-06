"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

type User = {
  id: number;
  username: string;
  email: string;
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const data = await apiRequest<Task[]>("/tasks/");

        setTasks(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completionPercentage =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "High";
      case "MEDIUM":
        return "Medium";
      case "LOW":
        return "Low";
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "TODO":
        return "Todo";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8]">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>
              <p className="text-sm font-medium text-gray-400">
                {formattedDate}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">
                Good morning{user ? `, ${user.username}` : ""} 👋
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Here&apos;s what needs your attention today.
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

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Total tasks
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : tasks.length}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              All your tasks
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : completedTasks}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {completionPercentage}% completion
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">
              In progress
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : inProgressTasks}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              Currently active
            </p>
          </div>

        </div>

        {/* Main grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">

          {/* Tasks */}
          <section className="rounded-2xl border border-gray-200 bg-white">

            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

              <div>
                <h2 className="font-semibold text-gray-950">
                  Recent tasks
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Your latest tasks from Nextep
                </p>
              </div>

              <Link
                href="/dashboard/tasks"
                className="text-sm font-medium text-gray-500 hover:text-gray-950"
              >
                View all →
              </Link>

            </div>

            <div className="divide-y divide-gray-100">

              {loading ? (
                <div className="px-6 py-12 text-center text-sm text-gray-400">
                  Loading your tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="px-6 py-12 text-center">

                  <p className="text-sm font-medium text-gray-900">
                    No tasks yet
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Create your first task and start making progress.
                  </p>

                  <Link
                    href="/dashboard/tasks/new"
                    className="mt-5 inline-flex rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    Create task
                  </Link>

                </div>
              ) : (
                tasks.slice(0, 5).map((task) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/tasks/${task.id}`}
                    className="block px-6 py-5 transition hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <h3
                          className={`truncate text-sm font-semibold ${
                            task.status === "COMPLETED"
                              ? "text-gray-400 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">

                          {task.category_name && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                              {task.category_name}
                            </span>
                          )}

                          <span className="text-xs text-gray-400">
                            {getStatusLabel(task.status)}
                          </span>

                        </div>

                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
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
                ))
              )}

            </div>
          </section>

          {/* Progress */}
          <aside className="space-y-6">

            <div className="rounded-2xl border border-gray-200 bg-white p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-gray-950">
                    Weekly progress
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Keep moving forward
                  </p>
                </div>

                <span className="text-2xl font-semibold text-gray-950">
                  {loading ? "—" : `${completionPercentage}%`}
                </span>

              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-950 transition-all"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-gray-400">
                {completedTasks} of {tasks.length} tasks completed
              </p>

            </div>

            <div className="rounded-2xl bg-gray-950 p-6 text-white">

              <p className="text-sm font-semibold">
                Quick actions
              </p>

              <div className="mt-5 space-y-2">

                <Link
                  href="/dashboard/tasks/new"
                  className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
                >
                  Create a task
                  <span>→</span>
                </Link>

                <Link
                  href="/dashboard/categories"
                  className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
                >
                  Manage categories
                  <span>→</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm transition hover:bg-white/15"
                >
                  Edit profile
                  <span>→</span>
                </Link>

              </div>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}