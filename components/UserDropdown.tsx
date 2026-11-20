"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth.actions";

export default function UserDropdown({ user }: { user: { name: string; email: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-full focus:outline-none"
        aria-label="Account menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fdd458] text-sm font-bold text-black">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-sm font-medium text-gray-200 md:block">{user.name}</span>
      </button>

      {open && (
        <div className="card absolute right-0 z-50 mt-3 w-64 p-4 shadow-xl">
          <p className="font-semibold text-white">{user.name}</p>
          <p className="mb-3 truncate text-sm text-gray-400">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full rounded-md border border-[#30333a] px-3 py-2 text-left text-sm text-gray-200 transition hover:border-[#fdd458] hover:text-[#fdd458]"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
