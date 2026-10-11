
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest<LoginResponse>("/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      document.cookie =
        `access_token=${encodeURIComponent(data.access)}; path=/; SameSite=Lax`;

      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8f7f2] px-4 py-8 text-[#292c25] sm:px-6 sm:py-12">
      <div className="mx-auto grid min-h-[680px] max-w-5xl overflow-hidden rounded-[30px] border border-[#eae8df] bg-white shadow-xl shadow-[#343b2d]/5 lg:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-[#343b2d] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full border-[45px] border-white/[0.04]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full border-[35px] border-white/[0.05]" />

          <Link href="/" className="relative flex w-fit items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7e9dc] text-xl font-bold text-[#343b2d]">
              N
            </span>
            <span className="text-xl font-semibold tracking-tight">Nextep</span>
          </Link>

          <div className="relative max-w-sm">
            <span className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium tracking-wide text-[#d4dcc8]">
              ✳ YOUR SPACE TO GROW
            </span>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
              Keep moving
              <br />
              <span className="text-[#b8c4a5]">forward.</span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Organize your tasks, focus on what matters, and make
              meaningful progress one step at a time.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["N", "✳", "↗"].map((item) => (
                  <span
                    key={item}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#343b2d] bg-[#e7e9dc] text-xs font-semibold text-[#343b2d]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-xs text-white/60">
                Small steps. Meaningful progress.
              </p>
            </div>
          </div>

          <p className="relative text-xs tracking-wide text-white/40">
            PLAN. FOCUS. PROGRESS.
          </p>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-10 inline-flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#343b2d] font-bold text-white">
                N
              </span>
              <span className="text-lg font-semibold">Nextep</span>
            </Link>

            <div className="mb-8">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#849071]">
                Welcome back
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Good to see you.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#85877e]">
                Sign in to pick up right where you left off.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700"
              >
                <p className="font-semibold">Unable to sign in</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#41443b]">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-[#e7e5dc] bg-[#fafaf7] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#b1b1a7] focus:border-[#8c9b76] focus:bg-white focus:ring-4 focus:ring-[#8c9b76]/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-medium text-[#41443b]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-xs font-medium text-[#78836a] transition hover:text-[#343b2d]"
                  >
                    {showPassword ? "Hide password" : "Show password"}
                  </button>
                </div>

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-[#e7e5dc] bg-[#fafaf7] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#b1b1a7] focus:border-[#8c9b76] focus:bg-white focus:ring-4 focus:ring-[#8c9b76]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#343b2d] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#454d3c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing you in...
                  </>
                ) : (
                  <>Sign in to Nextep <span>→</span></>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#eeede6]" />
              <span className="text-xs text-[#a1a195]">YOUR NEXT STEP</span>
              <div className="h-px flex-1 bg-[#eeede6]" />
            </div>

            <p className="text-center text-sm text-[#85877e]">
              New to Nextep?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#5d6d4b] transition hover:text-[#343b2d]"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs text-[#aaa99e]">
              One step at a time. ✳
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}