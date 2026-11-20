import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/auth.actions";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  let signedIn = false;
  try {
    signedIn = !!(await getSession())?.user;
  } catch {
    // DB not configured yet - still show the form so setup problems are visible on submit
  }
  if (signedIn) redirect("/");

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex flex-col justify-center px-6 py-12 sm:px-16">
        <Link href="/" className="mb-10 text-2xl font-bold text-[#fdd458]">
          Signalist
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </section>
      <aside className="hidden flex-col justify-center border-l border-[#30333a] bg-[#141414] px-16 lg:flex">
        <blockquote className="max-w-md text-xl leading-relaxed text-gray-200">
          Signalist turned my watchlist into a routine. The daily summary alone saves me an hour every morning.
        </blockquote>
        <p className="mt-6 text-sm text-gray-400">A sample testimonial for the demo UI</p>
      </aside>
    </main>
  );
}
