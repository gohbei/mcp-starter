import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { GLOBAL_INDICES } from '../../data/marketData';
import { Sparkline } from '../widgets/Sparkline';
import { Activity, Globe, TrendingUp } from 'lucide-react';

export const IndicesScreen: React.FC = () => {
  const { setSelectedAsset, liveQuotes } = useMarket();
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const filteredIndices =
    selectedRegion === 'All'
      ? GLOBAL_INDICES
      : GLOBAL_INDICES.filter((idx) => idx.region === selectedRegion);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2962ff]" />
            Major World Indices
          </h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            Real-time equity market benchmarks, composite indexes, and global volatility.
          </p>
        </div>

        {/* Region filter */}
        <div className="flex items-center gap-1.5 bg-[#1e222d] border border-[#2a2e39] p-1 rounded-lg">
          {['All', 'Americas', 'Europe', 'Asia'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedRegion === r
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Index Cards with sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredIndices.map((idx) => {
          const live = liveQuotes[idx.symbol] || {
            price: idx.price,
            change: idx.change,
            changePercent: idx.changePercent,
            lastTickUp: null,
          };
          const isPos = live.changePercent >= 0;

          return (
            <div
              key={idx.symbol}
              onClick={() => setSelectedAsset(idx)}
              className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff] rounded-xl p-4 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-white group-hover:text-[#2962ff] transition-colors">
                    {idx.symbol}
                  </span>
                  <span className="text-[11px] font-mono text-[#787b86]">
                    {idx.region}
                  </span>
                </div>
                <p className="text-xs text-[#787b86] mt-0.5 truncate">
                  {idx.name}
                </p>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xl font-bold font-mono text-white">
                    {live.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  Vol: {idx.volume}
                </span>
                <Sparkline
                  data={idx.sparkline}
                  isPositive={isPos}
                  width={85}
                  height={26}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Indices Performance Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5">
        <h3 className="text-base font-bold text-white tracking-tight mb-4 pb-2 border-b border-[#2a2e39]">
          Global Benchmark Performance
        </h3>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] pb-2 font-medium">
                <th className="py-2.5 px-3">Index</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Change %</th>
                <th className="py-2.5 px-3">Change Points</th>
                <th className="py-2.5 px-3">Day Range</th>
                <th className="py-2.5 px-3">52W High</th>
                <th className="py-2.5 px-3 text-right">Chart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredIndices.map((idx) => {
                const live = liveQuotes[idx.symbol] || {
                  price: idx.price,
                  change: idx.change,
                  changePercent: idx.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;

                return (
                  <tr
                    key={idx.symbol}
                    onClick={() => setSelectedAsset(idx)}
                    className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                          {idx.symbol}
                        </span>
                        <span className="block text-[11px] text-[#787b86]">
                          {idx.name} · {idx.exchange}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-white">
                      {live.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

                    <td className="py-3 px-3 font-mono text-[#787b86]">
                      {isPos ? '+' : ''}
                      {live.change.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86]">
                      {idx.dayLow?.toFixed(1)} - {idx.dayHigh?.toFixed(1)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86]">
                      {idx.high52w?.toFixed(1)}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-block">
                        <Sparkline
                          data={idx.sparkline}
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
