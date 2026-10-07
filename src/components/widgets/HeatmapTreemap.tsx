import React, { useState } from 'react';
import { SECTOR_HEATMAP_DATA, TOP_STOCKS } from '../../data/marketData';
import { useMarket } from '../../context/MarketContext';
import { Layers } from 'lucide-react';

export const HeatmapTreemap: React.FC = () => {
  const { setSelectedAsset } = useMarket();
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const filteredSectors =
    selectedSector === 'All'
      ? SECTOR_HEATMAP_DATA
      : SECTOR_HEATMAP_DATA.filter((s) => s.name === selectedSector);

  // Helper for background color based on % change
  const getColor = (pct: number) => {
    if (pct >= 3.0) return 'bg-[#089981] hover:brightness-110';
    if (pct >= 1.5) return 'bg-[#0b826f] hover:brightness-110';
    if (pct >= 0.5) return 'bg-[#106255] hover:brightness-110';
    if (pct >= 0) return 'bg-[#164d44] hover:brightness-110';
    if (pct > -0.5) return 'bg-[#4f2025] hover:brightness-110';
    if (pct > -1.5) return 'bg-[#7a242c] hover:brightness-110';
    if (pct > -3.0) return 'bg-[#b82936] hover:brightness-110';
    return 'bg-[#f23645] hover:brightness-110';
  };

  const handleStockClick = (symbol: string) => {
    const asset = TOP_STOCKS.find((s) => s.symbol === symbol);
    if (asset) setSelectedAsset(asset);
  };

  return (
    <div className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5">
      {/* Header with sector filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2a2e39]">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              S&P 500 Stock Heatmap
            </h3>
          </div>
          <p className="text-xs text-[#787b86] mt-0.5">
            Performance sized by market capitalization. Click any stock to view interactive charts.
          </p>
        </div>

        {/* Sector filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedSector('All')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedSector === 'All'
                ? 'bg-[#2962ff] text-white'
                : 'text-[#787b86] hover:text-white bg-[#131722]'
            }`}
          >
            All Sectors
          </button>
          {SECTOR_HEATMAP_DATA.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelectedSector(s.name)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedSector === s.name
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-white bg-[#131722]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 min-h-[380px]">
        {filteredSectors.map((sector) => (
          <div
            key={sector.name}
            className="flex flex-col border border-[#2a2e39] rounded-lg bg-[#131722]/60 overflow-hidden"
          >
            {/* Sector header */}
            <div className="px-3 py-1.5 bg-[#1e222d] border-b border-[#2a2e39] flex items-center justify-between text-xs font-semibold text-[#d1d4dc]">
              <span>{sector.name}</span>
              <span className="text-[#787b86] text-[11px] font-mono">
                {sector.marketCapShare}% weight
              </span>
            </div>

            {/* Sector stocks inner treemap layout */}
            <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 flex-1 content-start">
              {sector.stocks.map((stock) => {
                const isPos = stock.changePercent >= 0;
                // High weight stocks span 2 columns if in large sectors
                const isMega = stock.weight >= 25;
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => handleStockClick(stock.symbol)}
                    className={`${getColor(
                      stock.changePercent
                    )} ${isMega ? 'col-span-2 sm:col-span-1' : ''} p-2.5 rounded-md flex flex-col justify-between transition-all cursor-pointer text-left text-white shadow-xs group`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs tracking-tight group-hover:underline">
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] opacity-80 font-mono">
                        {stock.marketCap}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between gap-1">
                      <span className="text-[11px] font-mono font-medium">
                        ${stock.price.toFixed(2)}
                      </span>
                      <span className="text-[11px] font-mono font-bold tracking-tight">
                        {isPos ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap Legend */}
      <div className="mt-4 pt-3 border-t border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-xs text-[#787b86]">
        <div className="flex items-center gap-1.5 font-mono">
          <span>-3%</span>
          <div className="w-4 h-3 bg-[#f23645] rounded-xs"></div>
          <div className="w-4 h-3 bg-[#b82936] rounded-xs"></div>
          <div className="w-4 h-3 bg-[#7a242c] rounded-xs"></div>
          <div className="w-4 h-3 bg-[#131722] rounded-xs"></div>
          <div className="w-4 h-3 bg-[#106255] rounded-xs"></div>
          <div className="w-4 h-3 bg-[#0b826f] rounded-xs"></div>
          <div className="w-4 h-3 bg-[#089981] rounded-xs"></div>
          <span>+3%</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Volume Weighted Treemap</span>
          <span aria-hidden="true">·</span>
          <span>Updated Real-Time</span>
        </div>
      </div>
    </div>
  );
};
