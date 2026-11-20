"use client";

import { memo, useEffect, useRef } from "react";

type Props = {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
};

function TradingViewWidget({ title, scriptUrl, config, height = 600, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.width = "100%";
    widget.style.height = `${height}px`;
    container.appendChild(widget);

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
    // config objects are static per render of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptUrl, height, JSON.stringify(config)]);

  return (
    <div className="w-full">
      {title && <h3 className="mb-5 text-xl font-semibold text-gray-100">{title}</h3>}
      <div className={`tradingview-widget-container ${className ?? ""}`} ref={containerRef} />
    </div>
  );
}

export default memo(TradingViewWidget);
