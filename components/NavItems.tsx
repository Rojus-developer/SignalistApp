"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import SearchCommand from "@/components/SearchCommand";

export default function NavItems() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <ul className="flex items-center gap-6 text-sm font-medium">
      {NAV_ITEMS.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={`transition-colors hover:text-[#fdd458] ${isActive(href) ? "text-white" : "text-gray-400"}`}
          >
            {label}
          </Link>
        </li>
      ))}
      <li>
        <SearchCommand />
      </li>
    </ul>
  );
}
