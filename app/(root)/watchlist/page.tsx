import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { getWatchlist } from "@/lib/actions/watchlist.actions";

export default async function WatchlistPage() {
  const items = await getWatchlist();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your Watchlist</h1>

      {items.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">
          <p className="mb-2 text-lg text-gray-200">Your watchlist is empty</p>
          <p>Use Search (or Ctrl/Cmd + K) to find stocks and add them here.</p>
        </div>
      ) : (
        <ul className="card divide-y divide-[#30333a]">
          {items.map((item) => (
            <li key={item.symbol} className="flex items-center justify-between gap-4 px-5 py-4">
              <Link href={`/stocks/${item.symbol}`} className="min-w-0 flex-1 hover:text-[#fdd458]">
                <p className="truncate font-medium">{item.company}</p>
                <p className="text-sm text-gray-400">
                  {item.symbol} - added {new Date(item.addedAt).toLocaleDateString("en-US")}
                </p>
              </Link>
              <WatchlistButton symbol={item.symbol} company={item.company} isInWatchlist />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
