import React from 'react';
import { X, Trash2, TrendingUp, Plus, ExternalLink } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { ALL_ASSETS } from '../../data/marketData';
import { Sparkline } from './Sparkline';

export const WatchlistDrawer: React.FC = () => {
  const {
    isWatchlistDrawerOpen,
    setIsWatchlistDrawerOpen,
    watchlist,
    removeFromWatchlist,
    setSelectedAsset,
    liveQuotes,
    setSearchOpen,
  } = useMarket();

  if (!isWatchlistDrawerOpen) return null;

  const watchlistAssets = watchlist
    .map((sym) => ALL_ASSETS.find((a) => a.symbol === sym))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#1e222d] border-l border-[#2a2e39] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-[#2a2e39] flex items-center justify-between bg-[#131722]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Watchlist
            </h2>
            <span className="text-xs text-[#787b86] font-mono">
              ({watchlist.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-[#2962ff] text-white hover:bg-[#1e53e5] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Symbol</span>
            </button>

            <button
              onClick={() => setIsWatchlistDrawerOpen(false)}
              className="w-7 h-7 rounded-lg bg-[#2a2e39] text-[#787b86] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Watchlist Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/60">
          {watchlistAssets.length === 0 ? (
            <div className="p-8 text-center text-[#787b86]">
              <p className="text-sm font-medium text-white mb-1">Your watchlist is empty</p>
              <p className="text-xs mb-4">Click "Add Symbol" or bookmark assets while exploring markets.</p>
              <button
                onClick={() => setSearchOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#2962ff] text-white hover:bg-[#1e53e5] transition-colors"
              >
                Browse Markets
              </button>
            </div>
          ) : (
            watchlistAssets.map((asset) => {
              if (!asset) return null;
              const live = liveQuotes[asset.symbol] || {
                price: asset.price,
                change: asset.change,
                changePercent: asset.changePercent,
                lastTickUp: null,
              };
              const isPos = live.changePercent >= 0;

              return (
                <div
                  key={asset.symbol}
                  className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#2a2e39]/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedAsset(asset)}
                >
                  {/* Left: Symbol & Name */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] text-[#787b86] uppercase">
                        {asset.exchange}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#787b86] truncate">
                      {asset.name}
                    </p>
                  </div>

                  {/* Center: Sparkline */}
                  <div className="hidden sm:block shrink-0">
                    <Sparkline
                      data={asset.sparkline}
                      isPositive={isPos}
                      width={64}
                      height={24}
                    />
                  </div>

                  {/* Right: Price & Percent */}
                  <div className="text-right shrink-0">
                    <span
                      className={`block font-mono text-xs font-semibold text-white transition-colors ${
                        live.lastTickUp === true
                          ? 'text-[#089981]'
                          : live.lastTickUp === false
                          ? 'text-[#f23645]'
                          : ''
                      }`}
                    >
                      {asset.type === 'bond'
                        ? `${live.price.toFixed(2)}%`
                        : `$${live.price.toLocaleString('en-US', {
                            minimumFractionDigits: live.price > 100 ? 2 : 4,
                            maximumFractionDigits: live.price > 100 ? 2 : 4,
                          })}`}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-medium flex items-center justify-end ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {live.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(asset.symbol);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#f23645]/20 text-[#787b86] hover:text-[#f23645] transition-all cursor-pointer"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#131722] border-t border-[#2a2e39] text-center text-[11px] text-[#787b86]">
          Real-time quotes with live micro-ticks. Click any symbol to inspect charts.
        </div>
      </div>
    </div>
  );
};
