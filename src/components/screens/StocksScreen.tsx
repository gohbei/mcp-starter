import React, { useState } from 'react';
import { useMarket } from '../../context/MarketContext';
import { TOP_STOCKS } from '../../data/marketData';
import { Sparkline } from '../widgets/Sparkline';
import { Search, Bookmark, BookmarkCheck, ArrowUpDown, Filter, SlidersHorizontal } from 'lucide-react';

export const StocksScreen: React.FC = () => {
  const { setSelectedAsset, liveQuotes, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMarket();
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'marketCap' | 'changePercent' | 'price' | 'volume'>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const SECTORS = ['All', 'Technology', 'Communication Services', 'Consumer Cyclical', 'Financials', 'Healthcare', 'Energy'];

  const filteredStocks = TOP_STOCKS.filter((stock) => {
    const matchesSearch =
      stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
      stock.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  }).sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortBy === 'marketCap') {
      const parseCap = (c?: string) => (c?.endsWith('T') ? parseFloat(c) * 1000 : parseFloat(c || '0'));
      valA = parseCap(a.marketCap);
      valB = parseCap(b.marketCap);
    } else if (sortBy === 'changePercent') {
      valA = liveQuotes[a.symbol]?.changePercent ?? a.changePercent;
      valB = liveQuotes[b.symbol]?.changePercent ?? b.changePercent;
    } else if (sortBy === 'price') {
      valA = liveQuotes[a.symbol]?.price ?? a.price;
      valB = liveQuotes[b.symbol]?.price ?? b.price;
    } else {
      valA = parseFloat(a.volume);
      valB = parseFloat(b.volume);
    }
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Screener Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#2962ff]" />
            Stock Screener
          </h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            Scan US equities across market cap, valuation ratios, sector categorization, and intraday volume.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#787b86]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stocks..."
            className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#787b86] focus:outline-none focus:border-[#2962ff]"
          />
        </div>
      </div>

      {/* Sector filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <Filter className="w-3.5 h-3.5 text-[#787b86] shrink-0 mr-1" />
        {SECTORS.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedSector === sec
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'text-[#787b86] hover:text-white bg-[#1e222d]'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Screener Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#131722] border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-3">Symbol & Company</th>
                <th
                  onClick={() => toggleSort('price')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 font-mono">
                    <span>Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('changePercent')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1 font-mono">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('marketCap')}
                  className="py-3 px-3 cursor-pointer hover:text-white hidden sm:table-cell"
                >
                  <div className="flex items-center gap-1 font-mono">
                    <span>Market Cap</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 hidden md:table-cell font-mono">P/E Ratio</th>
                <th className="py-3 px-3 hidden lg:table-cell">Sector</th>
                <th className="py-3 px-3 hidden md:table-cell font-mono">52W Range</th>
                <th className="py-3 px-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filteredStocks.map((stock) => {
                const live = liveQuotes[stock.symbol] || {
                  price: stock.price,
                  change: stock.change,
                  changePercent: stock.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;
                const inWatchlist = isInWatchlist(stock.symbol);

                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => setSelectedAsset(stock)}
                    className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    {/* Watchlist toggle */}
                    <td
                      className="py-3 px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        inWatchlist
                          ? removeFromWatchlist(stock.symbol)
                          : addToWatchlist(stock.symbol);
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

                    {/* Symbol & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-[#2a2e39] flex items-center justify-center font-bold text-xs text-white uppercase shrink-0">
                          {stock.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                            {stock.symbol}
                          </span>
                          <span className="block text-[11px] text-[#787b86] truncate max-w-[160px]">
                            {stock.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 font-mono font-medium text-white">
                      ${live.price.toFixed(2)}
                    </td>

                    {/* Change % */}
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

                    {/* Market Cap */}
                    <td className="py-3 px-3 font-mono text-[#787b86] hidden sm:table-cell">
                      {stock.marketCap}
                    </td>

                    {/* P/E Ratio */}
                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {stock.peRatio ? stock.peRatio.toFixed(1) : 'N/A'}
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-3 text-[#787b86] hidden lg:table-cell">
                      {stock.sector}
                    </td>

                    {/* 52W Range Bar */}
                    <td className="py-3 px-3 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#787b86] w-28">
                        <span>${stock.low52w?.toFixed(0)}</span>
                        <div className="flex-1 h-1 bg-[#2a2e39] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2962ff] w-3/4"></div>
                        </div>
                        <span>${stock.high52w?.toFixed(0)}</span>
                      </div>
                    </td>

                    {/* Trend Sparkline */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-block">
                        <Sparkline
                          data={stock.sparkline}
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
