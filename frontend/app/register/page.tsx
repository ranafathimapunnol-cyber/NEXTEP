
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      await apiRequest<RegisterResponse>("/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      router.replace("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border border-[#e7e5dc] bg-[#fafaf7] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#b1b1a7] focus:border-[#8c9b76] focus:bg-white focus:ring-4 focus:ring-[#8c9b76]/10";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8f7f2] px-4 py-8 text-[#292c25] sm:px-6 sm:py-12">
      <div className="mx-auto grid min-h-[720px] max-w-5xl overflow-hidden rounded-[30px] border border-[#eae8df] bg-white shadow-xl shadow-[#343b2d]/5 lg:grid-cols-2">
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
              ✳ A FRESH START
            </span>

            <h1 className="mt-7 text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
              Make your
              <br />
              <span className="text-[#b8c4a5]">next step</span>
              <br />
              count.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">
              Create your own space to organize ideas, set priorities,
              and turn plans into progress.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-3">
              {[
                ["01", "Organize"],
                ["02", "Focus"],
                ["03", "Progress"],
              ].map(([number, label]) => (
                <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="text-xs text-[#b8c4a5]">{number}</p>
                  <p className="mt-2 text-xs font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs tracking-wide text-white/40">
            YOUR JOURNEY STARTS HERE.
          </p>
        </section>

        {/* Registration form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 inline-flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#343b2d] font-bold text-white">
                N
              </span>
              <span className="text-lg font-semibold">Nextep</span>
            </Link>

            <div className="mb-7">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#849071]">
                Get started
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create your space.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#85877e]">
                A little structure can make a big difference.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700"
              >
                <p className="font-semibold">We couldn&apos;t create your account</p>
                <p className="mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-[#41443b]">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                  className={inputClass}
                />
              </div>

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
                  className={inputClass}
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
                    className="text-xs font-medium text-[#78836a] hover:text-[#343b2d]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#41443b]">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className={inputClass}
                />
                {confirmPassword && (
                  <p className={`mt-2 text-xs ${
                    password === confirmPassword ? "text-[#71865d]" : "text-rose-600"
                  }`}>
                    {password === confirmPassword
                      ? "✓ Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#343b2d] px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#454d3c] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating your account...
                  </>
                ) : (
                  <>Create your account <span>→</span></>
                )}
              </button>

              <p className="pt-1 text-center text-xs leading-5 text-[#a1a195]">
                By creating an account, you can start organizing your
                tasks in your own workspace.
              </p>
            </form>

            <p className="mt-7 text-center text-sm text-[#85877e]">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#5d6d4b] hover:text-[#343b2d]">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}