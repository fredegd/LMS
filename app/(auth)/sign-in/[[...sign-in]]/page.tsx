"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";
  const authError = searchParams?.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const errorLabel = useMemo(() => {
    if (formError) return formError;
    if (authError === "CredentialsSignin") return "Invalid email or password.";
    if (authError) return "Authentication failed. Please try again.";
    return "";
  }, [authError, formError]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setFormError("Invalid email or password.");
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Sign in</h1>
        <p className="mb-6 text-sm text-gray-500">
          Use your LMS credentials to continue.
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none ring-orange-400 focus:ring-2"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none ring-orange-400 focus:ring-2"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {errorLabel ? (
            <p className="text-sm text-red-600" role="alert">
              {errorLabel}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          Need access?{" "}
          <Link className="text-orange-600 hover:underline" href="/sign-up">
            Request account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
