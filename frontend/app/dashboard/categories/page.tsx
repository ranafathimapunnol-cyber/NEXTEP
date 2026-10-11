
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api";

type Category = {
  id: number;
  name: string;
  description: string;
};

const categoryIcons = ["💼", "🌱", "🚀", "📚", "🎯", "💡"];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    try {
      setError("");
      const data = await apiRequest<Category[]>("/categories/");
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const newCategory = await apiRequest<Category>("/categories/", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      setCategories((current) => [...current, newCategory]);
      setName("");
      setDescription("");
      setSuccess("Category created successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create category."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await apiRequest(`/categories/${id}/`, { method: "DELETE" });

      setCategories((current) =>
        current.filter((category) => category.id !== id)
      );
      setSuccess("Category deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete category."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f7f2] p-6 text-[#292c25] lg:p-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[#77796e]">
              Workspace / Categories
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#292c25]">
              Categories
            </h1>
            <p className="mt-2 text-sm text-[#77796e]">
              Organize your tasks into meaningful groups.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] px-5 py-3">
            <p className="text-xs font-medium text-[#77796e]">
              Total categories
            </p>
            <p className="mt-1 text-2xl font-semibold text-[#343b2d]">
              {categories.length}
            </p>
          </div>
        </div>

        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-[#e8c9c0] bg-[#fbefeb] px-4 py-3 text-sm text-[#a34f3d]"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-[#d5dfcb] bg-[#edf2e8] px-4 py-3 text-sm text-[#4d6949]"
          >
            {success}
          </div>
        )}

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          {/* Category list */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#343b2d]">
                Your categories
              </h2>
              <p className="mt-1 text-sm text-[#77796e]">
                Categories created in your workspace.
              </p>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-40 animate-pulse rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8]"
                  />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#cbd2bd] bg-[#fdfcf8] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7e9dc] text-2xl text-[#58664a]">
                  ▦
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#343b2d]">
                  No categories yet
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#77796e]">
                  Create your first category to start organizing your tasks.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {categories.map((category, index) => (
                  <article
                    key={category.id}
                    className="group rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-5 transition hover:-translate-y-0.5 hover:border-[#cbd2bd] hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7e9dc] text-xl">
                        {categoryIcons[index % categoryIcons.length]}
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleDelete(category.id)}
                        disabled={deletingId !== null}
                        aria-label={`Delete ${category.name}`}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-[#999b8f] transition hover:bg-[#fbefeb] hover:text-[#a34f3d] disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                      >
                        {deletingId === category.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>

                    <h3 className="mt-5 break-words text-base font-semibold text-[#343b2d]">
                      {category.name}
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#77796e]">
                      {category.description || "No description provided."}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Create category form */}
          <aside className="rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7e9dc] text-xl text-[#58664a]">
              +
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#77796e]">
              New category
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#343b2d]">
              Create a category
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#77796e]">
              Give your tasks a simple structure that makes sense for you.
            </p>

            <form onSubmit={handleCreate} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-medium text-[#343b2d]"
                >
                  Name <span className="text-[#a34f3d]">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Work"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-[#e7e5d9] bg-[#f8f7f2] px-4 py-3 text-sm text-[#292c25] outline-none transition placeholder:text-[#a0a194] focus:border-[#8c9b76] focus:bg-white focus:ring-2 focus:ring-[#e7e9dc]"
                />
              </div>

              <div>
                <label
                  htmlFor="category-description"
                  className="mb-2 block text-sm font-medium text-[#343b2d]"
                >
                  Description
                </label>
                <textarea
                  id="category-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this category for?"
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-[#e7e5d9] bg-[#f8f7f2] px-4 py-3 text-sm text-[#292c25] outline-none transition placeholder:text-[#a0a194] focus:border-[#8c9b76] focus:bg-white focus:ring-2 focus:ring-[#e7e9dc]"
                />
                <p className="mt-1 text-right text-xs text-[#999b8f]">
                  {description.length}/500
                </p>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full rounded-xl bg-[#343b2d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create category"}
              </button>
            </form>
          </aside>
        </div>
      </div>
    </main>
  );
}