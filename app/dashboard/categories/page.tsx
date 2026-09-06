"use client";

import { FormEvent, useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";

type Category = {
  id: number;
  name: string;
  description: string;
};

const categoryIcons = [
  "💼",
  "🌱",
  "🚀",
  "📚",
  "🎯",
  "💡",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    try {
      setError("");

      const data = await apiRequest<Category[]>(
        "/categories/"
      );

      setCategories(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const newCategory =
        await apiRequest<Category>(
          "/categories/",
          {
            method: "POST",
            body: JSON.stringify({
              name: name.trim(),
              description: description.trim(),
            }),
          }
        );

      setCategories((current) => [
        ...current,
        newCategory,
      ]);

      setName("");
      setDescription("");

      setSuccess("Category created successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create category."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiRequest(
        `/categories/${id}/`,
        {
          method: "DELETE",
        }
      );

      setCategories((current) =>
        current.filter(
          (category) => category.id !== id
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete category."
      );
    }
  }

  return (
    <div className="p-6 lg:p-10">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Workspace
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
              Categories
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Organize your tasks into meaningful groups.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-2">
            <p className="text-xs font-medium text-gray-400">
              Total categories
            </p>

            <p className="mt-0.5 text-lg font-semibold text-gray-950">
              {categories.length}
            </p>
          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-sm font-medium text-green-700">
              {success}
            </p>
          </div>
        )}


        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">


          {/* CATEGORY LIST */}

          <section>

            <div className="mb-4">

              <h2 className="text-lg font-semibold text-gray-950">
                Your categories
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Categories created in your workspace.
              </p>

            </div>


            {loading ? (

              <div className="grid gap-4 sm:grid-cols-2">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-2xl border border-gray-200 bg-white"
                  />
                ))}

              </div>

            ) : categories.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  ▦
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-950">
                  No categories yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Create your first category to start organizing your tasks.
                </p>

              </div>

            ) : (

              <div className="grid gap-4 sm:grid-cols-2">

                {categories.map((category, index) => (

                  <div
                    key={category.id}
                    className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg">
                        {
                          categoryIcons[
                            index %
                              categoryIcons.length
                          ]
                        }
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(category.id)
                        }
                        className="rounded-lg px-2 py-1 text-xs font-medium text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      >
                        Delete
                      </button>

                    </div>


                    <h3 className="mt-5 text-base font-semibold text-gray-950">
                      {category.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                      {category.description ||
                        "No description provided."}
                    </p>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* CREATE CATEGORY */}

          <aside>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  New category
                </p>

                <h2 className="mt-2 text-xl font-semibold text-gray-950">
                  Create a category
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Give your tasks a simple structure that makes sense for you.
                </p>

              </div>


              <form
                onSubmit={handleCreate}
                className="mt-6 space-y-5"
              >

                {/* NAME */}

                <div>

                  <label
                    htmlFor="category-name"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Name
                  </label>

                  <input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="e.g. Work"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  />

                </div>


                {/* DESCRIPTION */}

                <div>

                  <label
                    htmlFor="category-description"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Description
                  </label>

                  <textarea
                    id="category-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(
                        event.target.value
                      )
                    }
                    placeholder="What is this category for?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  />

                </div>


                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? "Creating..."
                    : "Create category"}
                </button>

              </form>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}