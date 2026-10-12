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

const statusStyles = {
TODO: "bg-[#eee9dc] text-[#796b4d] ring-[#ded5c3]",
IN_PROGRESS: "bg-[#e1e8d6] text-[#526744] ring-[#cbd7bd]",
COMPLETED: "bg-[#dce9df] text-[#3f7150] ring-[#c6ddcb]",
};

const priorityStyles = {
LOW: "bg-[#e2e8dc] text-[#5e7350]",
MEDIUM: "bg-[#f2e6ce] text-[#8b6a31]",
HIGH: "bg-[#f2ddd5] text-[#a4513f]",
};

function formatDate(value: string | null) {
if (!value) return null;

const date = new Date(value);
if (Number.isNaN(date.getTime())) return null;

return date.toLocaleDateString("en-IN", {
day: "numeric",
month: "short",
year: "numeric",
});
}

export default function TaskDetailPage() {
const params = useParams();
const router = useRouter();
const rawId = params.id;
const taskId = Array.isArray(rawId) ? rawId[0] : rawId;

const [task, setTask] = useState<Task | null>(null);
const [loading, setLoading] = useState(true);
const [deleting, setDeleting] = useState(false);
const [updating, setUpdating] = useState(false);
const [error, setError] = useState("");

useEffect(() => {
let cancelled = false;


async function loadTask() {
  setLoading(true);
  setError("");

  try {
    const data = await apiRequest<Task>(`/tasks/${taskId}/`);
    if (!cancelled) setTask(data);
  } catch (err) {
    if (!cancelled) {
      setError(
        err instanceof Error ? err.message : "Unable to load task."
      );
    }
  } finally {
    if (!cancelled) setLoading(false);
  }
}

if (taskId) {
  loadTask();
} else {
  setLoading(false);
  setError("Invalid task ID.");
}

return () => {
  cancelled = true;
};

}, [taskId]);

async function handleComplete() {
if (!task || updating || deleting || task.status === "COMPLETED") return;


setUpdating(true);
setError("");

try {
  const updatedTask = await apiRequest<Task>(`/tasks/${task.id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status: "COMPLETED" }),
  });

  setTask(updatedTask);
} catch (err) {
  setError(
    err instanceof Error ? err.message : "Unable to update task."
  );
} finally {
  setUpdating(false);
}


}

async function handleDelete() {
if (!task || deleting || updating) return;


if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
  return;
}

setDeleting(true);
setError("");

try {
  await apiRequest(`/tasks/${task.id}/`, { method: "DELETE" });
  router.push("/dashboard/tasks");
} catch (err) {
  setError(
    err instanceof Error ? err.message : "Unable to delete task."
  );
  setDeleting(false);
}


}

if (loading) {
return ( <main className="min-h-screen bg-[#f1efe5] p-4 sm:p-8"> <div className="mx-auto max-w-5xl animate-pulse space-y-5"> <div className="h-5 w-40 rounded-lg bg-[#dedecf]" /> <div className="h-12 w-64 rounded-xl bg-[#dedecf]" /> <div className="h-72 rounded-[28px] bg-[#e2e4d7]" /> <div className="grid gap-4 sm:grid-cols-3"> <div className="h-24 rounded-2xl bg-[#e2e4d7]" /> <div className="h-24 rounded-2xl bg-[#e2e4d7]" /> <div className="h-24 rounded-2xl bg-[#e2e4d7]" /> </div> </div> </main>
);
}

if (!task) {
return ( <main className="min-h-screen bg-[#f1efe5] px-4 py-10 sm:px-8"> <div className="mx-auto max-w-3xl rounded-[28px] border border-[#dedbcb] bg-[#e8e6d9] p-7 sm:p-10"> <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a8468]">
Task unavailable </span> <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#34412e] sm:text-3xl">
We couldn't find this task. </h1> <p className="mt-3 text-sm leading-6 text-[#737666]">
{error || "This task may have been deleted or no longer exists."} </p> <Link
         href="/dashboard/tasks"
         className="mt-6 inline-flex rounded-xl bg-[#405337] px-5 py-3 text-sm font-semibold text-[#faf8ef] transition hover:bg-[#33452b]"
       >
← Back to tasks </Link> </div> </main>
);
}

const completed = task.status === "COMPLETED";
const dueDate = formatDate(task.due_date);
const createdDate = formatDate(task.created_at);

const statusLabel = {
TODO: "Not started",
IN_PROGRESS: "In progress",
COMPLETED: "Completed",
};

const priorityLabel = {
LOW: "Low",
MEDIUM: "Medium",
HIGH: "High",
};

return ( <main className="min-h-screen bg-[#f1efe5] px-4 pb-12 pt-5 sm:px-7 sm:pb-16 sm:pt-8 lg:px-10"> <div className="mx-auto max-w-5xl">
{/* Navigation */} <div className="flex items-center justify-between gap-3"> <div className="flex min-w-0 items-center gap-2 text-xs sm:text-sm"> <Link
           href="/dashboard/tasks"
           className="shrink-0 font-medium text-[#858675] transition hover:text-[#405337]"
         >
My tasks </Link> <span className="text-[#b7b7a8]">/</span> <span className="truncate font-semibold text-[#405337]">
Task details </span> </div>


      <Link
        href="/dashboard/tasks"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#dcd9ca] bg-[#e9e6da] px-3.5 py-2.5 text-xs font-semibold text-[#4b5940] transition hover:bg-[#dfdfd0] sm:px-4 sm:text-sm"
      >
        <span aria-hidden="true">←</span>
        <span>All tasks</span>
      </Link>
    </div>

    {/* Page heading */}
    <header className="mb-6 mt-8 sm:mb-8 sm:mt-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7c8769] sm:text-xs">
        YOUR WORKSPACE / TASK OVERVIEW
      </p>
      <h1 className="mt-2.5 text-3xl font-semibold tracking-[-0.045em] text-[#343d2d] sm:text-4xl">
        Task details
      </h1>
      <p className="mt-2 text-sm leading-6 text-[#777968]">
        Everything about this task, all in one place.
      </p>
    </header>

    {error && (
      <div
        role="alert"
        className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-[#e4c9bc] bg-[#f5e4dc] px-4 py-3 text-sm text-[#944d3b]"
      >
        <p>{error}</p>
        <button
          type="button"
          aria-label="Dismiss error"
          onClick={() => setError("")}
          className="shrink-0 text-lg leading-5"
        >
          ×
        </button>
      </div>
    )}

    {/* Main task card */}
    <section className="overflow-hidden rounded-[26px] border border-[#dcdaca] bg-[#e8e6d9] shadow-[0_12px_35px_rgba(59,66,43,0.06)] sm:rounded-[32px]">
      {/* Card top bar */}
      <div className="flex items-center justify-between border-b border-[#d8d7c8] px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#405337] text-sm font-bold text-[#f5f1e6]">
            N
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-[#3b4631]">
              Nextep
            </p>
            <p className="mt-0.5 text-[11px] text-[#818372]">
              Task workspace
            </p>
          </div>
        </div>

        <span className="rounded-lg bg-[#dedecf] px-3 py-2 text-xs font-semibold tabular-nums text-[#68705a]">
          #{task.id}
        </span>
      </div>

      {/* Card content */}
      <div className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[task.status]}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                completed ? "bg-[#47825b]" : "bg-current"
              }`}
            />
            {statusLabel[task.status]}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${priorityStyles[task.priority]}`}
          >
            {priorityLabel[task.priority]} priority
          </span>

          {task.category_name && (
            <span className="rounded-full bg-[#dcded0] px-3 py-1.5 text-xs font-medium text-[#626c53]">
              {task.category_name}
            </span>
          )}
        </div>

        <div className="mt-7 sm:mt-9">
          <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#858875]">
            TASK TITLE
          </p>
          <h2
            className={`mt-3 max-w-3xl break-words text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl lg:text-[40px] ${
              completed
                ? "text-[#777e6d] line-through decoration-[#929b83]"
                : "text-[#343d2d]"
            }`}
          >
            {task.title}
          </h2>
        </div>

        <div className="mt-7 border-t border-[#d5d5c6] pt-6 sm:mt-8 sm:pt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#858875]">
            DESCRIPTION
          </p>
          <p className="mt-3 max-w-3xl whitespace-pre-wrap break-words text-sm leading-7 text-[#666b5b] sm:text-base sm:leading-8">
            {task.description?.trim() ||
              "No description has been added to this task yet."}
          </p>
        </div>

        {completed && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#c9d8c3] bg-[#dce8d5] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#405c3c] text-lg text-white">
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold text-[#405337]">
                Nicely done!
              </p>
              <p className="mt-1 text-xs leading-5 text-[#697760]">
                This task has been marked as completed.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-[#d7d6c6] bg-[#e1dfd1] px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#797d6d]">
            {completed
              ? "Ready for your next task?"
              : "A little progress goes a long way."}
          </p>

          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Link
              href={`/dashboard/tasks/${task.id}/edit`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d0d0c0] bg-[#efede2] px-4 py-3 text-sm font-semibold text-[#4a5940] transition hover:bg-[#f5f3e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#718460]"
            >
              <span aria-hidden="true">↗</span>
              Edit task
            </Link>

            {!completed && (
              <button
                type="button"
                onClick={handleComplete}
                disabled={updating || deleting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#405337] px-4 py-3 text-sm font-semibold text-[#faf8ef] transition hover:bg-[#33452b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#718460] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {updating ? "Updating…" : "✓ Mark completed"}
              </button>
            )}

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || updating}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e0c6bb] bg-[#f0dfd7] px-4 py-3 text-sm font-semibold text-[#995443] transition hover:bg-[#ead1c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b86b57] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "⌫ Delete task"}
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Compact information cards */}
    <section className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-[#dedbcb] bg-[#e8e6d9] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d8ddca] text-lg text-[#4b5c3e]">
            ◷
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#858675]">Due date</p>
            <p className="mt-1 break-words text-sm font-semibold text-[#424a36]">
              {dueDate || "No deadline"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dedbcb] bg-[#e8e6d9] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ded8c8] text-lg text-[#79684b]">
            +
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#858675]">Created on</p>
            <p className="mt-1 break-words text-sm font-semibold text-[#424a36]">
              {createdDate || "Date unavailable"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#dedbcb] bg-[#e8e6d9] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d8ddca] text-lg text-[#4b5c3e]">
            ✓
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#858675]">Current status</p>
            <p className="mt-1 break-words text-sm font-semibold text-[#424a36]">
              {statusLabel[task.status]}
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer className="mt-7 flex flex-wrap items-center justify-between gap-3 px-1">
      <p className="text-xs text-[#858675]">
        Small steps. Meaningful progress.
      </p>
      <Link
        href="/dashboard/tasks"
        className="text-xs font-semibold text-[#526447] transition hover:text-[#34442d]"
      >
        Back to tasks →
      </Link>
    </footer>
  </div>
</main>


);
}
