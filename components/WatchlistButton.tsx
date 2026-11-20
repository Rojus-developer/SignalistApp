"use client";

import { useState, useTransition } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

type Props = {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  compact?: boolean;
  onChange?: (symbol: string, added: boolean) => void;
};

export default function WatchlistButton({ symbol, company, isInWatchlist, compact, onChange }: Props) {
  const [added, setAdded] = useState(isInWatchlist);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !added;
    setAdded(next); // optimistic
    startTransition(async () => {
      const res = next ? await addToWatchlist(symbol, company) : await removeFromWatchlist(symbol);
      if (!res.success) setAdded(!next); // roll back
      else onChange?.(symbol, next);
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-md font-semibold transition disabled:opacity-60 ${
        compact ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm"
      } ${
        added
          ? "border border-[#30333a] text-gray-300 hover:border-red-400 hover:text-red-400"
          : "bg-[#fdd458] text-black hover:opacity-90"
      }`}
    >
      {added ? "Remove" : "Add to Watchlist"}
    </button>
  );
}
