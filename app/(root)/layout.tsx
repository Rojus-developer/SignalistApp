import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { getSession } from "@/lib/actions/auth.actions";

export const dynamic = "force-dynamic";

export default async function RootGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.user) redirect("/sign-in");

  const user = { name: session.user.name, email: session.user.email };

  return (
    <main className="min-h-screen">
      <Header user={user} />
      <div className="mx-auto max-w-7xl px-6 py-10">{children}</div>
    </main>
  );
}
