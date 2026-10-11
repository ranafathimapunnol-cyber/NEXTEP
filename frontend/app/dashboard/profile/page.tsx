
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api";

type Profile = {
  id: number;
  username: string;
  email: string;
  bio: string;
  profile_picture: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await apiRequest<Profile>("/auth/me/");

        if (active) {
          setProfile(data);
          setBio(data.bio || "");
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your profile."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || saving) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedProfile = await apiRequest<Profile>("/auth/me/", {
        method: "PATCH",
        body: JSON.stringify({ bio: bio.trim() }),
      });

      setProfile(updatedProfile);
      setBio(updatedProfile.bio || "");
      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f7f2] p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-[#e7e9dc]" />
          <div className="mt-8 h-96 animate-pulse rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8]" />
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#f8f7f2] p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <div
            role="alert"
            className="rounded-2xl border border-[#e8c9c0] bg-[#fbefeb] p-6"
          >
            <h1 className="text-lg font-semibold text-[#843f32]">
              Unable to load profile
            </h1>
            <p className="mt-2 text-sm text-[#a34f3d]">
              {error || "Something went wrong."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-[#e8c9c0] px-4 py-2 text-sm font-semibold text-[#843f32] transition hover:bg-white/60"
            >
              Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const initial = profile.username?.charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-[#f8f7f2] p-6 text-[#292c25] lg:p-10">
      <div className="mx-auto max-w-4xl">
        {/* Page heading */}
        <div>
          <p className="text-sm font-medium text-[#77796e]">
            Account / Profile
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#292c25]">
            Your profile
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#77796e]">
            Manage your personal information and tell your workspace a little
            about yourself.
          </p>
        </div>

        {/* Profile card */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#e7e5d9] bg-[#fdfcf8] shadow-sm">
          <div className="border-b border-[#eeede5] bg-gradient-to-r from-[#f0f0e6] to-[#fdfcf8] px-6 py-7 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#343b2d] text-xl font-bold text-white shadow-sm">
                {initial}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-[#343b2d]">
                  {profile.username}
                </h2>
                <p className="mt-1 break-all text-sm text-[#77796e]">
                  {profile.email}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-[#e7e9dc] px-2.5 py-1 text-xs font-medium text-[#58664a]">
                  Workspace member
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-7 sm:px-8">
            <div>
              <h3 className="text-base font-semibold text-[#343b2d]">
                Personal information
              </h3>
              <p className="mt-1 text-sm text-[#77796e]">
                Your username and email are managed by your account.
              </p>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="profile-username"
                  className="mb-2 block text-sm font-medium text-[#343b2d]"
                >
                  Username
                </label>
                <input
                  id="profile-username"
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full rounded-xl border border-[#e7e5d9] bg-[#f0efe8] px-4 py-3 text-sm text-[#77796e] outline-none"
                />
                <p className="mt-2 text-xs text-[#999b8f]">
                  Username cannot be changed here.
                </p>
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-[#343b2d]"
                >
                  Email address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-[#e7e5d9] bg-[#f0efe8] px-4 py-3 text-sm text-[#77796e] outline-none"
                />
                <p className="mt-2 text-xs text-[#999b8f]">
                  Email cannot be changed here.
                </p>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="profile-bio"
                  className="block text-sm font-medium text-[#343b2d]"
                >
                  About you
                </label>
                <span className="text-xs text-[#999b8f]">
                  {bio.length}/500
                </span>
              </div>

              <textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell us a little about yourself..."
                rows={5}
                maxLength={500}
                className="mt-2 w-full resize-y rounded-xl border border-[#e7e5d9] bg-[#f8f7f2] px-4 py-3 text-sm leading-6 text-[#292c25] outline-none transition placeholder:text-[#a0a194] focus:border-[#8c9b76] focus:bg-white focus:ring-2 focus:ring-[#e7e9dc]"
              />
              <p className="mt-2 text-xs text-[#999b8f]">
                Share a short introduction with your workspace.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-[#e8c9c0] bg-[#fbefeb] px-4 py-3 text-sm text-[#a34f3d]"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-[#d5dfcb] bg-[#edf2e8] px-4 py-3 text-sm text-[#4d6949]"
              >
                {success}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#eeede5] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[#999b8f]">
                Changes apply to your account profile.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-xl bg-[#343b2d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4b5740] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving changes..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}