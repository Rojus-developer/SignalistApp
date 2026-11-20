import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { isInWatchlist } from "@/lib/actions/watchlist.actions";
import {
  baselineChartConfig,
  candleChartConfig,
  companyFinancialsConfig,
  companyProfileConfig,
  symbolInfoConfig,
  technicalAnalysisConfig,
  tvScript,
} from "@/lib/constants";

export default async function StockDetails({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol: raw } = await params;
  const symbol = decodeURIComponent(raw).toUpperCase();
  const watched = await isInWatchlist(symbol);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-8">
        <div className="card p-5">
          <TradingViewWidget
            scriptUrl={tvScript("symbol-info")}
            config={symbolInfoConfig(symbol)}
            height={170}
          />
        </div>
        <div className="card p-5">
          <TradingViewWidget
            scriptUrl={tvScript("advanced-chart")}
            config={candleChartConfig(symbol)}
            height={600}
          />
        </div>
        <div className="card p-5">
          <TradingViewWidget
            scriptUrl={tvScript("advanced-chart")}
            config={baselineChartConfig(symbol)}
            height={600}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{symbol}</h1>
          <WatchlistButton symbol={symbol} company={symbol} isInWatchlist={watched} />
        </div>
        <div className="card p-5">
          <TradingViewWidget
            scriptUrl={tvScript("technical-analysis")}
            config={technicalAnalysisConfig(symbol)}
            height={400}
          />
        </div>
        <div className="card p-5">
          <TradingViewWidget
            scriptUrl={tvScript("company-profile")}
            config={companyProfileConfig(symbol)}
            height={440}
          />
        </div>
        <div className="card p-5">
          <TradingViewWidget
            scriptUrl={tvScript("financials")}
            config={companyFinancialsConfig(symbol)}
            height={464}
          />
        </div>
      </div>
    </div>
  );
}
