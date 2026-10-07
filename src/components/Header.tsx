import React from 'react';
import { Search, Moon, Sun, Bookmark, TrendingUp } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme, setSearchOpen, setIsWatchlistDrawerOpen, watchlist, activeTab, setActiveTab } = useMarket();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2a2e39] dark:border-[#2a2e39] bg-[#131722] dark:bg-[#131722] text-[#d1d4dc] transition-colors">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center font-bold text-white text-base shadow-sm group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 7H21V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-[#2962ff] transition-colors">
              TradingView
            </span>
          </button>
        </div>

        {/* Zone 2: Primary Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#787b86]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors hover:text-white ${activeTab === 'overview' ? 'text-white font-semibold' : ''}`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={`transition-colors hover:text-white ${activeTab === 'stocks' ? 'text-white font-semibold' : ''}`}
          >
            Screeners
          </button>
          <button
            onClick={() => setActiveTab('crypto')}
            className={`transition-colors hover:text-white ${activeTab === 'crypto' ? 'text-white font-semibold' : ''}`}
          >
            Crypto
          </button>
          <button
            onClick={() => setActiveTab('forex')}
            className={`transition-colors hover:text-white ${activeTab === 'forex' ? 'text-white font-semibold' : ''}`}
          >
            Currencies
          </button>
          <button
            onClick={() => setActiveTab('futures')}
            className={`transition-colors hover:text-white ${activeTab === 'futures' ? 'text-white font-semibold' : ''}`}
          >
            Futures & Macro
          </button>
        </nav>

        {/* Zone 3: Actions & Affordances */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#787b86] bg-[#1e222d] hover:bg-[#2a2e39] hover:text-[#d1d4dc] border border-[#2a2e39] rounded-lg transition-colors cursor-pointer"
            title="Search markets (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-[#787b86]" />
            <span className="hidden sm:inline">Search markets</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-[#131722] border border-[#2a2e39] rounded text-[#787b86]">
              ⌘K
            </kbd>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={() => setIsWatchlistDrawerOpen(true)}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#787b86] hover:text-white transition-colors"
            title="Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2962ff] text-white text-[10px] font-bold flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] text-[#787b86] hover:text-white transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => setActiveTab('stocks')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e53e5] rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Launch Screener
          </button>
        </div>
      </div>
    </header>
  );
};
