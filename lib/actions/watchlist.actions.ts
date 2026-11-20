"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import { getSession } from "@/lib/actions/auth.actions";

export async function getWatchlistSymbolsForCurrentUser(): Promise<string[]> {
  try {
    const session = await getSession();
    if (!session?.user) return [];
    await connectToDatabase();
    const items = await Watchlist.find({ userId: session.user.id }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsForCurrentUser error", err);
    return [];
  }
}

export async function getWatchlist() {
  try {
    const session = await getSession();
    if (!session?.user) return [];
    await connectToDatabase();
    const items = await Watchlist.find({ userId: session.user.id }).sort({ addedAt: -1 }).lean();
    return items.map((i) => ({
      symbol: String(i.symbol),
      company: String(i.company),
      addedAt: new Date(i.addedAt).toISOString(),
    }));
  } catch (err) {
    console.error("getWatchlist error", err);
    return [];
  }
}

export async function addToWatchlist(symbol: string, company: string) {
  try {
    const session = await getSession();
    if (!session?.user) return { success: false as const, error: "Not signed in" };
    await connectToDatabase();
    const sym = symbol.trim().toUpperCase();
    await Watchlist.updateOne(
      { userId: session.user.id, symbol: sym },
      { $setOnInsert: { company: company.trim() || sym, addedAt: new Date() } },
      { upsert: true }
    );
    revalidatePath("/watchlist");
    return { success: true as const };
  } catch (err) {
    console.error("addToWatchlist error", err);
    return { success: false as const, error: "Failed to add to watchlist" };
  }
}

export async function removeFromWatchlist(symbol: string) {
  try {
    const session = await getSession();
    if (!session?.user) return { success: false as const, error: "Not signed in" };
    await connectToDatabase();
    await Watchlist.deleteOne({ userId: session.user.id, symbol: symbol.trim().toUpperCase() });
    revalidatePath("/watchlist");
    return { success: true as const };
  } catch (err) {
    console.error("removeFromWatchlist error", err);
    return { success: false as const, error: "Failed to remove from watchlist" };
  }
}

export async function isInWatchlist(symbol: string): Promise<boolean> {
  const symbols = await getWatchlistSymbolsForCurrentUser();
  return symbols.includes(symbol.trim().toUpperCase());
}
