import Link from "next/link";
import React from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Account request</h1>
        <p className="text-gray-600">
          Authentication is managed with NextAuth credentials in this project.
          Ask an administrator to add your email/password pair in environment
          variables.
        </p>
        <Link
          href="/sign-in"
          className="mt-5 inline-block rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
