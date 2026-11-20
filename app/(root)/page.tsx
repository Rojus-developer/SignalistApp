import TradingViewWidget from "@/components/TradingViewWidget";
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  MARKET_OVERVIEW_WIDGET_CONFIG,
  TOP_STORIES_WIDGET_CONFIG,
  tvScript,
} from "@/lib/constants";

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <section className="card p-5 lg:col-span-1">
        <TradingViewWidget
          title="Market Overview"
          scriptUrl={tvScript("market-overview")}
          config={MARKET_OVERVIEW_WIDGET_CONFIG}
          height={600}
        />
      </section>
      <section className="card p-5 lg:col-span-2">
        <TradingViewWidget
          title="Stock Heatmap"
          scriptUrl={tvScript("stock-heatmap")}
          config={HEATMAP_WIDGET_CONFIG}
          height={600}
        />
      </section>
      <section className="card p-5 lg:col-span-1">
        <TradingViewWidget
          title="Top Stories"
          scriptUrl={tvScript("timeline")}
          config={TOP_STORIES_WIDGET_CONFIG}
          height={600}
        />
      </section>
      <section className="card p-5 lg:col-span-2">
        <TradingViewWidget
          title="Market Data"
          scriptUrl={tvScript("market-quotes")}
          config={MARKET_DATA_WIDGET_CONFIG}
          height={600}
        />
      </section>
    </div>
  );
}
