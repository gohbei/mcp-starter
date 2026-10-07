import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { TOP_CRYPTO } from '../../data/marketData';
import { Sparkline } from '../widgets/Sparkline';
import { Coins, Flame, ArrowUpDown, Bookmark, BookmarkCheck } from 'lucide-react';

export const CryptoScreen: React.FC = () => {
  const { setSelectedAsset, liveQuotes, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMarket();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'marketCap' | 'changePercent' | 'price'>('marketCap');

  const CATEGORIES = ['All', 'Layer 1', 'Smart Contracts', 'Exchange Token', 'Payments', 'Meme', 'AI & Data'];

  const filteredCoins = TOP_CRYPTO.filter((coin) => {
    return selectedCategory === 'All' || coin.category === selectedCategory;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Global Crypto Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4">
        <div>
          <span className="text-[11px] text-[#787b86] block">Total Market Cap</span>
          <span className="font-mono text-sm font-bold text-white mt-0.5 block">
            $2.68 Trillion <span className="text-[#089981] text-xs">(+2.4%)</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#787b86] block">24h Spot Volume</span>
          <span className="font-mono text-sm font-bold text-white mt-0.5 block">
            $88.4 Billion
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#787b86] block">BTC Dominance</span>
          <span className="font-mono text-sm font-bold text-white mt-0.5 block">
            58.42% <span className="text-[#787b86] text-xs">ETH 13.8%</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#787b86] block">ETH Gas Price</span>
          <span className="font-mono text-sm font-bold text-white mt-0.5 block">
            14 Gwei <span className="text-amber-400 text-xs">(Normal)</span>
          </span>
        </div>
      </div>

      {/* Screen Title & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            Cryptocurrency Market
          </h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            Real-time digital assets, decentralized finance tokens, and blockchain ecosystems.
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

      {/* Crypto Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131722] border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-3"># Symbol & Coin</th>
                <th className="py-3 px-3 font-mono">Price (USD)</th>
                <th className="py-3 px-3 font-mono">24h Change %</th>
                <th className="py-3 px-3 font-mono hidden sm:table-cell">24h Volume</th>
                <th className="py-3 px-3 font-mono hidden md:table-cell">Market Cap</th>
                <th className="py-3 px-3 hidden lg:table-cell">Category</th>
                <th className="py-3 px-4 text-right">7-Day Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredCoins.map((coin, idx) => {
                const live = liveQuotes[coin.symbol] || {
                  price: coin.price,
                  change: coin.change,
                  changePercent: coin.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;
                const inWatchlist = isInWatchlist(coin.symbol);

                return (
                  <tr
                    key={coin.symbol}
                    onClick={() => setSelectedAsset(coin)}
                    className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    {/* Watchlist toggle */}
                    <td
                      className="py-3 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        inWatchlist
                          ? removeFromWatchlist(coin.symbol)
                          : addToWatchlist(coin.symbol);
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

                    {/* Rank, Icon & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[11px] font-mono text-[#787b86] w-4">
                          {idx + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-[#2a2e39] flex items-center justify-center font-bold text-xs text-amber-400 shrink-0">
                          {coin.symbol.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {coin.symbol.replace('USDT', '')}
                          </span>
                          <span className="block text-[11px] text-[#787b86]">
                            {coin.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 font-mono font-medium text-white">
                      ${coin.price > 100
                        ? live.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : live.price}
                    </td>

                    {/* 24h Change */}
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

                    {/* 24h Volume */}
                    <td className="py-3 px-3 font-mono text-[#787b86] hidden sm:table-cell">
                      {coin.volume}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {coin.marketCap}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 text-[#787b86] hidden lg:table-cell">
                      <span className="px-2 py-0.5 rounded bg-[#131722] text-[10px] text-[#787b86]">
                        {coin.category}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-block">
                        <Sparkline
                          data={coin.sparkline}
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
