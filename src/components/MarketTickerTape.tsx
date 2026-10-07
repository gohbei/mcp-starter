import React from 'react';
import { useMarket } from '../context/MarketContext';
import { ALL_ASSETS } from '../data/marketData';

const TICKER_SYMBOLS = ['SPX', 'NDX', 'DJI', 'BTCUSDT', 'ETHUSDT', 'NVDA', 'AAPL', 'CL1!', 'GC1!', 'US10Y', 'EURUSD'];

export const MarketTickerTape: React.FC = () => {
  const { liveQuotes, setSelectedAsset } = useMarket();

  const tickerAssets = TICKER_SYMBOLS.map((sym) =>
    ALL_ASSETS.find((a) => a.symbol === sym)
  ).filter(Boolean);

  return (
    <div className="w-full bg-[#1e222d] border-b border-[#2a2e39] overflow-x-auto no-scrollbar py-2 px-4 select-none">
      <div className="flex items-center gap-6 min-w-max">
        <div className="flex items-center gap-2 pr-2 border-r border-[#2a2e39] text-[11px] font-semibold text-[#787b86] uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
          Live Markets
        </div>

        {tickerAssets.map((asset) => {
          if (!asset) return null;
          const live = liveQuotes[asset.symbol] || {
            price: asset.price,
            change: asset.change,
            changePercent: asset.changePercent,
            lastTickUp: null,
          };
          const isPos = live.changePercent >= 0;

          return (
            <button
              key={asset.symbol}
              onClick={() => setSelectedAsset(asset)}
              className="flex items-center gap-2.5 text-xs hover:bg-[#2a2e39]/60 px-2 py-1 rounded transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-white group-hover:text-[#2962ff] transition-colors">
                  {asset.symbol}
                </span>
                <span className="text-[11px] text-[#787b86] max-w-[80px] truncate">
                  {asset.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`font-mono text-xs font-medium text-white transition-colors ${
                    live.lastTickUp === true
                      ? 'text-[#089981]'
                      : live.lastTickUp === false
                      ? 'text-[#f23645]'
                      : ''
                  }`}
                >
                  {asset.price > 1000
                    ? live.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : live.price}
                </span>
                <span
                  className={`font-mono text-[11px] font-medium flex items-center ${
                    isPos ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {live.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
