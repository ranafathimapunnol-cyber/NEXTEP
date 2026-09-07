"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";

type LoginResponse = {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await apiRequest<LoginResponse>(
        "/auth/login/",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      localStorage.setItem(
        "access_token",
        data.access
      );

      localStorage.setItem(
        "refresh_token",
        data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      document.cookie =
        `access_token=${data.access}; path=/; SameSite=Lax`;

      router.replace("/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f7f8]">

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center px-6 py-12">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:grid-cols-2">

          {/* LEFT SIDE */}

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
                  WELCOME BACK
                </p>

                <h1 className="mt-4 text-5xl font-semibold leading-tight tracking-tight">
                  Keep moving forward.
                </h1>

                <p className="mt-6 text-base leading-7 text-gray-400">
                  Organize your tasks, focus on what matters,
                  and keep making progress one step at a time.
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


          {/* RIGHT SIDE */}

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
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in to continue to your Nextep workspace.
                </p>

              </div>


              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >

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

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-800"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-gray-500 transition hover:text-gray-950"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

                    <p className="mt-1 text-xs text-red-500">
                      Please check your email and password and try again.
                    </p>

                  </div>

                )}


                {/* LOGIN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing you in..."
                    : "Sign in"}
                </button>

              </form>


              {/* DIVIDER */}

              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-gray-200" />

             

                <div className="h-px flex-1 bg-gray-200" />

              </div>




              {/* REGISTER */}

              <p className="mt-8 text-center text-sm text-gray-500">

                Don't have an account?{" "}

                <Link
                  href="/register"
                  className="font-semibold text-gray-950 hover:underline"
                >
                  Create an account
                </Link>

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}