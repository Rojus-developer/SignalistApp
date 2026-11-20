"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import type { StockSearchResult } from "@/lib/types";
import WatchlistButton from "@/components/WatchlistButton";

export default function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockSearchResult[]>([]);
  const requestId = useRef(0);

  // Cmd/Ctrl + K opens the palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runSearch = useCallback(async (q: string) => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const results = await searchStocks(q);
      if (id === requestId.current) setStocks(results);
    } catch {
      if (id === requestId.current) setStocks([]);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Debounced search; empty query shows popular stocks
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => runSearch(query), query ? 300 : 0);
    return () => clearTimeout(t);
  }, [query, open, runSearch]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-gray-400 transition-colors hover:text-[#fdd458]">
        Search
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-24"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div className="card w-full max-w-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stocks (e.g. AAPL, Tesla)..."
              className="w-full border-b border-[#30333a] bg-transparent px-4 py-4 text-white outline-none placeholder:text-gray-500"
            />
            <div className="max-h-96 overflow-y-auto">
              <p className="px-4 pt-3 text-xs uppercase tracking-wide text-gray-500">
                {query ? `Search results (${stocks.length})` : "Popular stocks"}
              </p>
              {loading && <p className="px-4 py-6 text-center text-gray-400">Loading...</p>}
              {!loading && stocks.length === 0 && (
                <p className="px-4 py-6 text-center text-gray-400">No results found</p>
              )}
              {!loading && (
                <ul>
                  {stocks.map((s) => (
                    <li
                      key={s.symbol}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#1c1c1f]"
                    >
                      <Link href={`/stocks/${s.symbol}`} onClick={close} className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{s.name}</p>
                        <p className="text-sm text-gray-400">
                          {s.symbol} - {s.exchange} - {s.type}
                        </p>
                      </Link>
                      <WatchlistButton
                        compact
                        symbol={s.symbol}
                        company={s.name}
                        isInWatchlist={s.isInWatchlist}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="border-t border-[#30333a] px-4 py-2 text-xs text-gray-500">
              Press Esc to close - Ctrl/Cmd + K to toggle
            </p>
          </div>
        </div>
      )}
    </>
  );
}
