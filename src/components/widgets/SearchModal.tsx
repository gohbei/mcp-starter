import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Layers, Hash } from 'lucide-react';
import { useMarket } from '../../context/MarketContext';
import { ALL_ASSETS } from '../../data/marketData';
import { Asset, AssetType } from '../../types/market';
import { Sparkline } from './Sparkline';

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, setSelectedAsset, liveQuotes } = useMarket();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const filteredAssets = ALL_ASSETS.filter((a) => {
    const matchesQuery =
      a.symbol.toLowerCase().includes(query.toLowerCase()) ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      (a.sector && a.sector.toLowerCase().includes(query.toLowerCase()));

    const matchesType = filterType === 'all' || a.type === filterType;
    return matchesQuery && matchesType;
  });

  const handleSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setSearchOpen(false);
  };

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'stock', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'index', label: 'Indices' },
    { id: 'future', label: 'Futures' },
    { id: 'bond', label: 'Bonds' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#2a2e39] flex items-center gap-3 bg-[#131722]">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets, stocks, crypto, currencies, indices..."
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-[#787b86]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#787b86] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="text-xs text-[#787b86] hover:text-white px-2 py-1 rounded bg-[#2a2e39]"
          >
            Esc
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-[#1e222d] border-b border-[#2a2e39] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                filterType === f.id
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-white bg-[#131722]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#2a2e39]/50">
          {filteredAssets.length === 0 ? (
            <div className="p-8 text-center text-[#787b86] text-xs">
              No matching assets found for "{query}". Try searching for AAPL, BTC, S&P 500, Gold, or EUR.
            </div>
          ) : (
            filteredAssets.map((asset) => {
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
                  onClick={() => handleSelect(asset)}
                  className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#2a2e39] flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-[#787b86] uppercase font-mono">
                          {asset.exchange}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#131722] text-[#787b86] uppercase">
                          {asset.type}
                        </span>
                      </div>
                      <p className="text-xs text-[#787b86] truncate">
                        {asset.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block">
                      <Sparkline
                        data={asset.sparkline}
                        isPositive={isPos}
                        width={60}
                        height={20}
                      />
                    </div>
                    <div className="text-right font-mono">
                      <span className="block text-xs font-semibold text-white">
                        {asset.type === 'bond'
                          ? `${live.price.toFixed(2)}%`
                          : `$${live.price.toLocaleString('en-US', {
                              minimumFractionDigits: live.price > 100 ? 2 : 4,
                              maximumFractionDigits: live.price > 100 ? 2 : 4,
                            })}`}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {live.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#131722] border-t border-[#2a2e39] flex items-center justify-between text-[11px] text-[#787b86]">
          <span>Tip: Press ESC to close</span>
          <span>Showing {filteredAssets.length} symbols</span>
        </div>
      </div>
    </div>
  );
};
