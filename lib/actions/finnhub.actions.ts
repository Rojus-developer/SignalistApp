"use server";

import { POPULAR_STOCKS } from "@/lib/constants";
import { getDateRange } from "@/lib/utils";
import { getWatchlistSymbolsForCurrentUser } from "@/lib/actions/watchlist.actions";
import type { MarketNewsArticle, StockSearchResult } from "@/lib/types";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

const token = () => process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

async function fetchJSON<T>(url: string, revalidateSeconds: number): Promise<T> {
  const res = await fetch(url, { next: { revalidate: revalidateSeconds } });
  if (!res.ok) throw new Error(`Finnhub request failed: ${res.status}`);
  return (await res.json()) as T;
}

type FinnhubSearchResponse = {
  result?: { symbol: string; description: string; displaySymbol?: string; type: string }[];
};

export async function searchStocks(query?: string): Promise<StockSearchResult[]> {
  const q = query?.trim() ?? "";
  const watched = new Set(await getWatchlistSymbolsForCurrentUser());

  // No query -> show popular stocks (no API call needed)
  if (!q) {
    return POPULAR_STOCKS.map((s) => ({
      symbol: s.symbol,
      name: s.name,
      exchange: "US",
      type: "Common Stock",
      isInWatchlist: watched.has(s.symbol),
    }));
  }

  const key = token();
  if (!key) {
    console.error("FINNHUB_API_KEY is not set");
    return [];
  }

  try {
    const data = await fetchJSON<FinnhubSearchResponse>(
      `${FINNHUB_BASE}/search?q=${encodeURIComponent(q)}&token=${key}`,
      1800
    );
    return (data.result ?? [])
      .filter((r) => r.symbol && r.type === "Common Stock" && !r.symbol.includes("."))
      .slice(0, 15)
      .map((r) => ({
        symbol: r.symbol.toUpperCase(),
        name: r.description,
        exchange: "US",
        type: r.type,
        isInWatchlist: watched.has(r.symbol.toUpperCase()),
      }));
  } catch (err) {
    console.error("Stock search failed", err);
    return [];
  }
}

type RawNews = {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  related?: string;
};

const valid = (a: RawNews) => a && a.headline && a.url && a.summary && a.datetime;
const toArticle = (a: RawNews): MarketNewsArticle => ({
  id: a.id,
  headline: a.headline,
  summary: a.summary,
  source: a.source,
  url: a.url,
  datetime: a.datetime,
  related: a.related,
});

/**
 * Company news for the given symbols (round-robin so every symbol is represented,
 * max 6 articles), falling back to general market news.
 */
export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  const key = token();
  if (!key) throw new Error("FINNHUB_API_KEY is not set");

  try {
    const clean = (symbols ?? []).map((s) => s.trim().toUpperCase()).filter(Boolean);

    if (clean.length > 0) {
      const { from, to } = getDateRange(5);
      const perSymbol = await Promise.all(
        clean.slice(0, 6).map(async (sym) => {
          try {
            const items = await fetchJSON<RawNews[]>(
              `${FINNHUB_BASE}/company-news?symbol=${sym}&from=${from}&to=${to}&token=${key}`,
              300
            );
            return items.filter(valid);
          } catch {
            return [] as RawNews[];
          }
        })
      );

      const picked: MarketNewsArticle[] = [];
      const seen = new Set<string>();
      for (let round = 0; round < 6 && picked.length < 6; round++) {
        for (const list of perSymbol) {
          const a = list[round];
          if (!a || seen.has(a.url)) continue;
          seen.add(a.url);
          picked.push(toArticle(a));
          if (picked.length >= 6) break;
        }
      }
      if (picked.length > 0) {
        return picked.sort((a, b) => b.datetime - a.datetime);
      }
    }

    const general = await fetchJSON<RawNews[]>(`${FINNHUB_BASE}/news?category=general&token=${key}`, 300);
    const seen = new Set<string>();
    return general
      .filter(valid)
      .filter((a) => (seen.has(a.url) ? false : (seen.add(a.url), true)))
      .slice(0, 6)
      .map(toArticle);
  } catch (err) {
    console.error("Failed to fetch news", err);
    throw new Error("Failed to fetch news");
  }
}
