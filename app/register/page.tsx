"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";

type RegisterResponse = {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest<RegisterResponse>(
        "/auth/register/",
        {
          method: "POST",
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      router.replace("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f7f8]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-6 py-12">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">

          {/* LEFT */}

          <div className="hidden bg-gray-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <Link
                href="/"
                className="flex items-center gap-2"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-gray-950">
                  N
                </div>

                <span className="text-lg font-bold">
                  Nextep
                </span>
              </Link>

              <div className="mt-24 max-w-sm">

                <p className="text-sm font-medium text-gray-400">
                  GET STARTED
                </p>

                <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight">
                  Make your next step count.
                </h1>

                <p className="mt-6 text-base leading-7 text-gray-400">
                  Create your workspace, organize your tasks,
                  and build momentum one step at a time.
                </p>

              </div>

            </div>

            <div>

              <div className="mb-6 h-px bg-white/10" />

              <p className="text-sm text-gray-500">
                Plan. Focus. Progress.
              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div className="p-7 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Mobile logo */}

              <Link
                href="/"
                className="mb-10 flex items-center gap-2 lg:hidden"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white">
                  N
                </div>

                <span className="text-lg font-bold text-gray-950">
                  Nextep
                </span>
              </Link>

              {/* Heading */}

              <div>

                <h2 className="text-3xl font-semibold tracking-tight text-gray-950">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Start organizing your work with Nextep.
                </p>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

                {/* USERNAME */}

                <div>

                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  />

                </div>

                {/* CONFIRM PASSWORD */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-800"
                  >
                    Confirm password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
                  />

                </div>

                {/* ERROR */}

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-medium text-red-600">
                      {error}
                    </p>
                  </div>
                )}

                {/* BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Creating your account..."
                    : "Create account"}
                </button>

              </form>

              {/* LOGIN */}

              <p className="mt-8 text-center text-sm text-gray-500">

                Already have an account?{" "}

                <Link
                  href="/login"
                  className="font-semibold text-gray-950 hover:underline"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}