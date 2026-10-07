import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import {
  GLOBAL_INDICES,
  TOP_STOCKS,
  TOP_CRYPTO,
  TOP_FOREX,
  TOP_FUTURES,
  GLOBAL_10Y_BONDS,
  NEWS_FEED,
} from '../../data/marketData';
import { Sparkline } from '../widgets/Sparkline';
import { HeatmapTreemap } from '../widgets/HeatmapTreemap';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  Flame,
  Award,
  Clock,
  ExternalLink,
} from 'lucide-react';

type MoverTab = 'gainers' | 'losers' | 'active' | 'ath';

export const OverviewScreen: React.FC = () => {
  const { setSelectedAsset, liveQuotes } = useMarket();
  const [moverTab, setMoverTab] = useState<MoverTab>('gainers');

  // Market movers logic
  const allTradable = [...TOP_STOCKS, ...TOP_CRYPTO];

  const movers = React.useMemo(() => {
    if (moverTab === 'gainers') {
      return [...allTradable].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6);
    }
    if (moverTab === 'losers') {
      return [...allTradable].sort((a, b) => a.changePercent - b.changePercent).slice(0, 6);
    }
    if (moverTab === 'active') {
      return [...TOP_STOCKS].slice(0, 6);
    }
    // All-time highs / strong momentum
    return [...TOP_STOCKS, ...TOP_FUTURES].filter((a) => a.price > 100).slice(0, 6);
  }, [moverTab, allTradable]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. World Indices Hero Banner Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2962ff]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              World Markets Overview
            </h2>
          </div>
          <span className="text-xs text-[#787b86]">Americas · Europe · Asia-Pacific</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {GLOBAL_INDICES.slice(0, 4).map((idx) => {
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
                className="bg-[#1e222d] border border-[#2a2e39] hover:border-[#2962ff]/50 rounded-xl p-4 transition-all duration-150 hover:shadow-lg cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-[#2962ff] transition-colors">
                      {idx.symbol}
                    </span>
                    <span className="text-[11px] text-[#787b86]">
                      {idx.region}
                    </span>
                  </div>
                  <p className="text-xs text-[#787b86] mt-0.5 truncate">
                    {idx.name}
                  </p>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xl font-bold font-mono text-white tracking-tight">
                      {live.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`text-xs font-mono font-semibold flex items-center gap-0.5 ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {live.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-[#2a2e39]/60 flex items-center justify-between">
                  <div className="text-[10px] text-[#787b86] font-mono">
                    H: {idx.dayHigh?.toFixed(1)} · L: {idx.dayLow?.toFixed(1)}
                  </div>
                  <Sparkline
                    data={idx.sparkline}
                    isPositive={isPos}
                    width={80}
                    height={26}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Interactive S&P 500 Stock Treemap Heatmap */}
      <section>
        <HeatmapTreemap />
      </section>

      {/* 3. Market Movers Multi-Tab Table */}
      <section className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Market Movers
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-[#131722] p-1 rounded-lg border border-[#2a2e39]">
            <button
              onClick={() => setMoverTab('gainers')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                moverTab === 'gainers'
                  ? 'bg-[#089981] text-white font-semibold'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Top Gainers
            </button>
            <button
              onClick={() => setMoverTab('losers')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                moverTab === 'losers'
                  ? 'bg-[#f23645] text-white font-semibold'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Top Losers
            </button>
            <button
              onClick={() => setMoverTab('active')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                moverTab === 'active'
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              Most Active
            </button>
            <button
              onClick={() => setMoverTab('ath')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                moverTab === 'ath'
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'text-[#787b86] hover:text-white'
              }`}
            >
              52W Highs
            </button>
          </div>
        </div>

        {/* Tabular List */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] pb-2 font-medium">
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Price</th>
                <th className="py-2.5 px-3">Change %</th>
                <th className="py-2.5 px-3 hidden md:table-cell">Change $</th>
                <th className="py-2.5 px-3 hidden lg:table-cell">Volume</th>
                <th className="py-2.5 px-3 hidden sm:table-cell">Market Cap</th>
                <th className="py-2.5 px-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {movers.map((asset) => {
                const live = liveQuotes[asset.symbol] || {
                  price: asset.price,
                  change: asset.change,
                  changePercent: asset.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-[#2a2e39] flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {asset.symbol}
                          </span>
                          <span className="block text-[11px] text-[#787b86] truncate max-w-[140px]">
                            {asset.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-white">
                      ${live.price > 100 ? live.price.toFixed(2) : live.price}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] ${
                          isPos
                            ? 'bg-[#089981]/15 text-[#089981]'
                            : 'bg-[#f23645]/15 text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {live.changePercent.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {isPos ? '+' : ''}
                      ${live.change.toFixed(2)}
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden lg:table-cell">
                      {asset.volume}
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden sm:table-cell">
                      {asset.marketCap || 'N/A'}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="inline-block">
                        <Sparkline
                          data={asset.sparkline}
                          isPositive={isPos}
                          width={75}
                          height={22}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Asset Class Snapshot Cards: Crypto & Forex & Commodities */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Crypto Highlights */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2e39]">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Cryptocurrency
              </h3>
              <span className="text-[11px] text-[#787b86] font-mono">24h Volume</span>
            </div>

            <div className="space-y-3">
              {TOP_CRYPTO.slice(0, 4).map((coin) => {
                const live = liveQuotes[coin.symbol] || {
                  price: coin.price,
                  change: coin.change,
                  changePercent: coin.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;

                return (
                  <div
                    key={coin.symbol}
                    onClick={() => setSelectedAsset(coin)}
                    className="flex items-center justify-between py-1.5 hover:bg-[#2a2e39]/40 px-2 rounded transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                        {coin.symbol}
                      </span>
                      <span className="block text-[10px] text-[#787b86]">
                        {coin.name}
                      </span>
                    </div>

                    <Sparkline
                      data={coin.sparkline}
                      isPositive={isPos}
                      width={55}
                      height={20}
                    />

                    <div className="text-right font-mono">
                      <span className="block text-xs font-semibold text-white">
                        ${coin.price > 100 ? live.price.toLocaleString('en-US') : live.price}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {live.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Forex Cross Rates */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2e39]">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2962ff]"></span>
                Currencies & Forex
              </h3>
              <span className="text-[11px] text-[#787b86] font-mono">Major Pairs</span>
            </div>

            <div className="space-y-3">
              {TOP_FOREX.slice(0, 4).map((pair) => {
                const live = liveQuotes[pair.symbol] || {
                  price: pair.price,
                  change: pair.change,
                  changePercent: pair.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;

                return (
                  <div
                    key={pair.symbol}
                    onClick={() => setSelectedAsset(pair)}
                    className="flex items-center justify-between py-1.5 hover:bg-[#2a2e39]/40 px-2 rounded transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                        {pair.symbol}
                      </span>
                      <span className="block text-[10px] text-[#787b86]">
                        {pair.name}
                      </span>
                    </div>

                    <Sparkline
                      data={pair.sparkline}
                      isPositive={isPos}
                      width={55}
                      height={20}
                    />

                    <div className="text-right font-mono">
                      <span className="block text-xs font-semibold text-white">
                        {live.price}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {live.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Commodities & Futures */}
        <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2e39]">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Commodities & Futures
              </h3>
              <span className="text-[11px] text-[#787b86] font-mono">NYMEX · COMEX</span>
            </div>

            <div className="space-y-3">
              {TOP_FUTURES.slice(0, 4).map((fut) => {
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
                    className="flex items-center justify-between py-1.5 hover:bg-[#2a2e39]/40 px-2 rounded transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-xs text-white group-hover:text-[#2962ff] transition-colors">
                        {fut.symbol}
                      </span>
                      <span className="block text-[10px] text-[#787b86]">
                        {fut.name}
                      </span>
                    </div>

                    <Sparkline
                      data={fut.sparkline}
                      isPositive={isPos}
                      width={55}
                      height={20}
                    />

                    <div className="text-right font-mono">
                      <span className="block text-xs font-semibold text-white">
                        ${live.price > 100 ? live.price.toLocaleString('en-US') : live.price}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {live.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live News & Insights Feed */}
      <section className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Market News & Top Stories
            </h3>
          </div>
          <span className="text-xs text-[#787b86]">Updated in real-time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NEWS_FEED.map((news) => (
            <div
              key={news.id}
              className="bg-[#131722] border border-[#2a2e39] hover:border-[#2962ff]/40 rounded-lg p-3.5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#787b86] mb-2">
                  <span>{news.source}</span>
                  <span className="font-mono">{news.timeAgo}</span>
                </div>
                <h4 className="text-xs font-semibold text-[#d1d4dc] group-hover:text-white group-hover:underline transition-colors line-clamp-3 leading-relaxed">
                  {news.title}
                </h4>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[#2a2e39]/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {news.relatedSymbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => {
                        const asset = [...GLOBAL_INDICES, ...TOP_STOCKS, ...TOP_CRYPTO, ...TOP_FUTURES].find(
                          (a) => a.symbol === sym
                        );
                        if (asset) setSelectedAsset(asset);
                      }}
                      className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-[#2a2e39] text-[#2962ff] hover:bg-[#2962ff] hover:text-white transition-colors cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-[#787b86]">
                  {news.readTime}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
