import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset } from '../types/market';
import { ALL_ASSETS } from '../data/marketData';

export type MarketTab = 'overview' | 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

interface MarketContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: MarketTab;
  setActiveTab: (tab: MarketTab) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset | null) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  isWatchlistDrawerOpen: boolean;
  setIsWatchlistDrawerOpen: (open: boolean) => void;
  liveQuotes: Record<string, { price: number; change: number; changePercent: number; lastTickUp: boolean | null }>;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const DEFAULT_WATCHLIST = ['SPX', 'NDX', 'NVDA', 'AAPL', 'BTCUSDT', 'ETHUSDT', 'EURUSD', 'CL1!', 'GC1!'];

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('tv_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTab] = useState<MarketTab>('overview');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [isWatchlistDrawerOpen, setIsWatchlistDrawerOpen] = useState<boolean>(false);

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : DEFAULT_WATCHLIST;
    } catch {
      return DEFAULT_WATCHLIST;
    }
  });

  // Track live quotes with micro-ticks
  const [liveQuotes, setLiveQuotes] = useState<Record<string, { price: number; change: number; changePercent: number; lastTickUp: boolean | null }>>(() => {
    const initial: Record<string, { price: number; change: number; changePercent: number; lastTickUp: boolean | null }> = {};
    ALL_ASSETS.forEach((a) => {
      initial[a.symbol] = {
        price: a.price,
        change: a.change,
        changePercent: a.changePercent,
        lastTickUp: null,
      };
    });
    return initial;
  });

  // Theme update effect
  useEffect(() => {
    localStorage.setItem('tv_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Watchlist persistence effect
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Keyboard shortcut for Cmd/Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live price ticker simulation (gentle random tick every 2.5 seconds to simulate live financial markets)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 2-3 random assets to update
      const sampleIndices = [
        Math.floor(Math.random() * ALL_ASSETS.length),
        Math.floor(Math.random() * ALL_ASSETS.length),
        Math.floor(Math.random() * ALL_ASSETS.length),
      ];

      setLiveQuotes((prev) => {
        const next = { ...prev };
        sampleIndices.forEach((idx) => {
          const asset = ALL_ASSETS[idx];
          if (!asset) return;
          const current = next[asset.symbol] || {
            price: asset.price,
            change: asset.change,
            changePercent: asset.changePercent,
            lastTickUp: null,
          };
          const deltaFactor = (Math.random() - 0.49) * 0.0015; // 0.15% max move
          const newPrice = Number((current.price * (1 + deltaFactor)).toFixed(asset.price > 100 ? 2 : 4));
          const isUp = newPrice >= current.price;
          const changeDelta = newPrice - asset.price;
          const newChangePercent = Number(((changeDelta / asset.price) * 100).toFixed(2));

          next[asset.symbol] = {
            price: newPrice,
            change: Number(changeDelta.toFixed(asset.price > 100 ? 2 : 4)),
            changePercent: newChangePercent,
            lastTickUp: isUp,
          };
        });
        return next;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const isInWatchlist = (symbol: string) => watchlist.includes(symbol);

  return (
    <MarketContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedRegion,
        setSelectedRegion,
        selectedAsset,
        setSelectedAsset,
        searchOpen,
        setSearchOpen,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        isWatchlistDrawerOpen,
        setIsWatchlistDrawerOpen,
        liveQuotes,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
