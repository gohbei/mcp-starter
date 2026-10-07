import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { TOP_FOREX } from '../../data/marketData';
import { Sparkline } from '../widgets/Sparkline';
import { Globe2, ArrowRightLeft, Bookmark, BookmarkCheck } from 'lucide-react';

export const ForexScreen: React.FC = () => {
  const { setSelectedAsset, liveQuotes, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMarket();
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'majors' | 'minors'>('all');

  const CROSS_MATRIX = [
    { base: 'EUR', USD: 1.0824, JPY: 165.04, GBP: 0.8338, CHF: 0.9379, AUD: 1.6445 },
    { base: 'USD', EUR: 0.9239, JPY: 152.48, GBP: 0.7703, CHF: 0.8665, AUD: 1.5192 },
    { base: 'GBP', EUR: 1.1993, USD: 1.2982, JPY: 197.95, CHF: 1.1249, AUD: 1.9723 },
    { base: 'JPY', EUR: 0.0061, USD: 0.0066, GBP: 0.0051, CHF: 0.0057, AUD: 0.0099 },
    { base: 'AUD', EUR: 0.6081, USD: 0.6582, JPY: 100.36, GBP: 0.5070, CHF: 0.5704 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#2962ff]" />
            Forex & Currencies
          </h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            Global foreign exchange spot market, cross rates matrix, and currency strength indicators.
          </p>
        </div>

        {/* Currency Pair Group Filter */}
        <div className="flex items-center gap-1.5 bg-[#1e222d] border border-[#2a2e39] p-1 rounded-lg">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedGroup === 'all'
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'text-[#787b86] hover:text-white'
            }`}
          >
            All Pairs
          </button>
          <button
            onClick={() => setSelectedGroup('majors')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedGroup === 'majors'
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'text-[#787b86] hover:text-white'
            }`}
          >
            Majors
          </button>
          <button
            onClick={() => setSelectedGroup('minors')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedGroup === 'minors'
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'text-[#787b86] hover:text-white'
            }`}
          >
            Minors & Crosses
          </button>
        </div>
      </div>

      {/* Interactive Forex Cross Rates Matrix */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2a2e39]">
          <ArrowRightLeft className="w-4 h-4 text-[#2962ff]" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Forex Cross Rates Matrix
          </h3>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-[#131722] text-[#787b86] font-medium border-b border-[#2a2e39]">
                <th className="py-2.5 px-3 text-left">Base</th>
                <th className="py-2.5 px-3 font-mono">USD</th>
                <th className="py-2.5 px-3 font-mono">EUR</th>
                <th className="py-2.5 px-3 font-mono">GBP</th>
                <th className="py-2.5 px-3 font-mono">JPY</th>
                <th className="py-2.5 px-3 font-mono">CHF</th>
                <th className="py-2.5 px-3 font-mono">AUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50 font-mono">
              {CROSS_MATRIX.map((row) => (
                <tr key={row.base} className="hover:bg-[#2a2e39]/40 transition-colors">
                  <td className="py-3 px-3 text-left font-bold text-white font-sans">
                    1 {row.base}
                  </td>
                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {row.base === 'USD' ? '-' : row.USD}
                  </td>
                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {row.base === 'EUR' ? '-' : row.EUR}
                  </td>
                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {row.base === 'GBP' ? '-' : row.GBP}
                  </td>
                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {row.base === 'JPY' ? '-' : row.JPY}
                  </td>
                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {row.base === 'CHF' ? '-' : row.CHF}
                  </td>
                  <td className="py-3 px-3 text-[#d1d4dc]">
                    {row.base === 'AUD' ? '-' : row.AUD}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forex Pairs Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131722] border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-3">Currency Pair</th>
                <th className="py-3 px-3 font-mono">Bid Price</th>
                <th className="py-3 px-3 font-mono">Change %</th>
                <th className="py-3 px-3 font-mono hidden sm:table-cell">Change Pips</th>
                <th className="py-3 px-3 font-mono hidden md:table-cell">Day High</th>
                <th className="py-3 px-3 font-mono hidden md:table-cell">Day Low</th>
                <th className="py-3 px-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {TOP_FOREX.map((pair) => {
                const live = liveQuotes[pair.symbol] || {
                  price: pair.price,
                  change: pair.change,
                  changePercent: pair.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;
                const inWatchlist = isInWatchlist(pair.symbol);

                return (
                  <tr
                    key={pair.symbol}
                    onClick={() => setSelectedAsset(pair)}
                    className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td
                      className="py-3 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        inWatchlist
                          ? removeFromWatchlist(pair.symbol)
                          : addToWatchlist(pair.symbol);
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
                          {pair.symbol.slice(0, 3)}/{pair.symbol.slice(3)}
                        </span>
                        <span className="block text-[11px] text-[#787b86]">
                          {pair.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-white">
                      {live.price}
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
                      {(live.change * 10000).toFixed(1)} pips
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {pair.dayHigh}
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {pair.dayLow}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-block">
                        <Sparkline
                          data={pair.sparkline}
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
