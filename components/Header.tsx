import Link from "next/link";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";

export default function Header({ user }: { user: { name: string; email: string } }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#30333a] bg-[#0f0f0f]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#fdd458]">
          Signalist
        </Link>
        <nav className="hidden sm:block">
          <NavItems />
        </nav>
        <UserDropdown user={user} />
      </div>
      <nav className="border-t border-[#30333a] px-6 py-2 sm:hidden">
        <NavItems />
      </nav>
    </header>
  );
}
