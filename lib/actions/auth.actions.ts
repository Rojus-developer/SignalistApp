"use server";

import { headers } from "next/headers";
import { getAuth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import type { SignInFormData, SignUpFormData } from "@/lib/types";

export const getSession = async () => {
  // Read headers first so any page using this opts into dynamic rendering (never prerendered).
  const h = await headers();
  const auth = await getAuth();
  return auth.api.getSession({ headers: h });
};

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const auth = await getAuth();
    const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } });

    if (response) {
      try {
        await inngest.send({
          name: "app/user.created",
          data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry },
        });
      } catch (err) {
        // Welcome email is best-effort; never block sign-up on it.
        console.error("Failed to queue welcome email", err);
      }
    }

    return { success: true as const };
  } catch (e) {
    console.error("Sign up failed", e);
    return { success: false as const, error: e instanceof Error ? e.message : "Sign up failed" };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const auth = await getAuth();
    await auth.api.signInEmail({ body: { email, password } });
    return { success: true as const };
  } catch (e) {
    console.error("Sign in failed", e);
    return { success: false as const, error: e instanceof Error ? e.message : "Sign in failed" };
  }
};

export const signOut = async () => {
  try {
    const auth = await getAuth();
    await auth.api.signOut({ headers: await headers() });
    return { success: true as const };
  } catch (e) {
    console.error("Sign out failed", e);
    return { success: false as const, error: "Sign out failed" };
  }
};
