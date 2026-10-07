import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { TOP_FUTURES } from '../../data/marketData';
import { Sparkline } from '../widgets/Sparkline';
import { Flame, Bookmark, BookmarkCheck } from 'lucide-react';

export const FuturesScreen: React.FC = () => {
  const { setSelectedAsset, liveQuotes, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const CATEGORIES = ['All', 'Energy', 'Metals', 'Agriculture'];

  const filteredFutures = TOP_FUTURES.filter((fut) => {
    return selectedCategory === 'All' || fut.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            Commodities & Futures Contracts
          </h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            Energy benchmarks, precious & base metals, agricultural commodities, and index derivatives.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-white bg-[#1e222d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Futures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredFutures.slice(0, 3).map((fut) => {
          const live = liveQuotes[fut.symbol] || {
            price: fut.price,
            change: fut.change,
            changePercent: fut.changePercent,
            lastTickUp: null,
          };
          const isPos = live.changePercent >= 0;

          return (
            <div
              key={fut.symbol}
              onClick={() => setSelectedAsset(fut)}
              className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff] rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-white group-hover:text-[#2962ff] transition-colors">
                    {fut.symbol}
                  </span>
                  <span className="text-[10px] font-mono rounded bg-[#131722] px-2 py-0.5 text-[#787b86]">
                    {fut.category}
                  </span>
                </div>
                <p className="text-xs text-[#787b86] mt-0.5">
                  {fut.name} · {fut.exchange}
                </p>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-white">
                    ${live.price > 100 ? live.price.toLocaleString('en-US') : live.price}
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {live.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2a2e39]/60 flex items-center justify-between">
                <span className="text-[10px] text-[#787b86] font-mono">
                  Vol: {fut.volume}
                </span>
                <Sparkline
                  data={fut.sparkline}
                  isPositive={isPos}
                  width={80}
                  height={24}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Futures Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131722] border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-3">Contract & Symbol</th>
                <th className="py-3 px-3 font-mono">Price (USD)</th>
                <th className="py-3 px-3 font-mono">Change %</th>
                <th className="py-3 px-3 font-mono hidden sm:table-cell">Change $</th>
                <th className="py-3 px-3 font-mono hidden md:table-cell">Volume</th>
                <th className="py-3 px-3 hidden lg:table-cell">Sector</th>
                <th className="py-3 px-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredFutures.map((fut) => {
                const live = liveQuotes[fut.symbol] || {
                  price: fut.price,
                  change: fut.change,
                  changePercent: fut.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;
                const inWatchlist = isInWatchlist(fut.symbol);

                return (
                  <tr
                    key={fut.symbol}
                    onClick={() => setSelectedAsset(fut)}
                    className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td
                      className="py-3 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        inWatchlist
                          ? removeFromWatchlist(fut.symbol)
                          : addToWatchlist(fut.symbol);
                      }}
                    >
                      <button className="text-[#787b86] hover:text-[#2962ff] transition-colors">
                        {inWatchlist ? (
                          <BookmarkCheck className="w-4 h-4 text-[#2962ff]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                          {fut.symbol}
                        </span>
                        <span className="block text-[11px] text-[#787b86]">
                          {fut.name} · {fut.exchange}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-white">
                      ${live.price > 100 ? live.price.toLocaleString('en-US') : live.price}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          isPos
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#f23645]/15 text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {live.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden sm:table-cell">
                      {isPos ? '+' : ''}${live.change.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {fut.volume}
                    </td>

                    <td className="py-3 px-3 text-[#787b86] hidden lg:table-cell">
                      <span className="px-2 py-0.5 rounded bg-[#131722] text-[10px]">
                        {fut.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-block">
                        <Sparkline
                          data={fut.sparkline}
                          isPositive={isPos}
                          width={75}
                          height={20}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
