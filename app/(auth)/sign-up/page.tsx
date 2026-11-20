"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";

const COUNTRIES = ["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Singapore", "Other"];

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const f = new FormData(e.currentTarget);
    const password = String(f.get("password") ?? "");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    const res = await signUpWithEmail({
      fullName: String(f.get("fullName") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      password,
      country: String(f.get("country")),
      investmentGoals: String(f.get("investmentGoals")),
      riskTolerance: String(f.get("riskTolerance")),
      preferredIndustry: String(f.get("preferredIndustry")),
    });
    setSubmitting(false);

    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(res.error);
    }
  };

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">Sign Up &amp; Personalize</h1>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Full name">
          <input name="fullName" required minLength={2} placeholder="John Doe" className="input" />
        </Field>
        <Field label="Email">
          <input name="email" type="email" required placeholder="you@example.com" className="input" />
        </Field>
        <Field label="Password">
          <input name="password" type="password" required placeholder="At least 8 characters" className="input" />
        </Field>
        <Field label="Country">
          <select name="country" className="input" defaultValue="India">
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Investment goals">
          <Select name="investmentGoals" options={INVESTMENT_GOALS} defaultValue="Growth" />
        </Field>
        <Field label="Risk tolerance">
          <Select name="riskTolerance" options={RISK_TOLERANCE_OPTIONS} defaultValue="Medium" />
        </Field>
        <Field label="Preferred industry">
          <Select name="preferredIndustry" options={PREFERRED_INDUSTRIES} defaultValue="Technology" />
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Creating account..." : "Start Your Investing Journey"}
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-[#fdd458] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-gray-300">{label}</span>
      {children}
    </label>
  );
}

function Select({
  name,
  options,
  defaultValue,
}: {
  name: string;
  options: { value: string; label: string }[];
  defaultValue: string;
}) {
  return (
    <select name={name} defaultValue={defaultValue} className="input">
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
