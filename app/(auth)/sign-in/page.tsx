"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/actions/auth.actions";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const f = new FormData(e.currentTarget);
    const res = await signInWithEmail({
      email: String(f.get("email") ?? "").trim(),
      password: String(f.get("password") ?? ""),
    });
    setSubmitting(false);

    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">Welcome back</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm text-gray-300">Email</span>
          <input name="email" type="email" required placeholder="you@example.com" className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-gray-300">Password</span>
          <input name="password" type="password" required placeholder="Your password" className="input" />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-[#fdd458] hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </>
  );
}
