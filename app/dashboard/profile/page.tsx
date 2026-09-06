"use client";

import { FormEvent, useEffect, useState } from "react";

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
    async function loadProfile() {
      try {
        setError("");

        const data = await apiRequest<Profile>(
          "/auth/me/"
        );

        setProfile(data);
        setBio(data.bio || "");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedProfile =
        await apiRequest<Profile>(
          "/auth/me/",
          {
            method: "PATCH",
            body: JSON.stringify({
              bio,
            }),
          }
        );

      setProfile(updatedProfile);
      setBio(updatedProfile.bio || "");

      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-8 h-96 animate-pulse rounded-2xl border border-gray-200 bg-white" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-900">
              Unable to load profile
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error || "Something went wrong."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">

      <div className="mx-auto max-w-4xl">

        {/* Header */}

        <div>
          <p className="text-sm font-medium text-gray-500">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-gray-950">
            Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and preferences.
          </p>
        </div>


        {/* Profile Card */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">

          {/* Profile Header */}

          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-xl font-bold text-white">
                {profile.username
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <h2 className="text-lg font-semibold text-gray-950">
                  {profile.username}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.email}
                </p>

              </div>

            </div>

          </div>


          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 sm:px-8"
          >

            <div className="grid gap-6 sm:grid-cols-2">

              {/* Username */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Username
                </label>

                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Username cannot be changed.
                </p>

              </div>


              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-800">
                  Email address
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Email address cannot be changed.
                </p>

              </div>

            </div>


            {/* Bio */}

            <div className="mt-6">

              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Bio
              </label>

              <textarea
                id="bio"
                value={bio}
                onChange={(event) =>
                  setBio(event.target.value)
                }
                placeholder="Tell us a little about yourself..."
                rows={5}
                maxLength={500}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-4 focus:ring-gray-100"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {bio.length}/500
              </p>

            </div>


            {/* Messages */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-700">
                  {success}
                </p>
              </div>
            )}


            {/* Save */}

            <div className="mt-6 flex justify-end">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : "Save changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}