import React from 'react';
import { MarketTab, useMarket } from '../context/MarketContext';
import { Globe } from 'lucide-react';

const TABS: { id: MarketTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
  { id: 'futures', label: 'Futures' },
  { id: 'bonds', label: 'Bonds' },
];

const REGIONS = ['All', 'Americas', 'Europe', 'Asia'];

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, selectedRegion, setSelectedRegion } = useMarket();

  return (
    <div className="w-full bg-[#131722] border-b border-[#2a2e39] sticky top-14 z-30">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2.5">
        {/* Horizontal Market Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2a2e39] text-white shadow-sm font-semibold'
                    : 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Region Filter & Live Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-[#1e222d] border border-[#2a2e39] rounded-lg p-0.5">
            <Globe className="w-3.5 h-3.5 text-[#787b86] ml-2" />
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedRegion === region
                    ? 'bg-[#2962ff] text-white'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#787b86]">
            <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
            <span>NYSE / NASDAQ Open</span>
          </div>
        </div>
      </div>
    </div>
  );
};
