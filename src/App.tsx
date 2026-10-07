import React from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Header } from './components/Header';
import { MarketTickerTape } from './components/MarketTickerTape';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { IndicesScreen } from './components/screens/IndicesScreen';
import { StocksScreen } from './components/screens/StocksScreen';
import { CryptoScreen } from './components/screens/CryptoScreen';
import { ForexScreen } from './components/screens/ForexScreen';
import { FuturesScreen } from './components/screens/FuturesScreen';
import { BondsScreen } from './components/screens/BondsScreen';
import { TradingViewChartModal } from './components/widgets/TradingViewChartModal';
import { WatchlistDrawer } from './components/widgets/WatchlistDrawer';
import { SearchModal } from './components/widgets/SearchModal';

const MainContent: React.FC = () => {
  const { activeTab, selectedAsset, setSelectedAsset } = useMarket();

  return (
    <div className="min-h-screen bg-[#131722] text-[#d1d4dc] flex flex-col">
      {/* Top Navigation Bar */}
      <Header />

      {/* Real-time Ticker Tape Ribbon */}
      <MarketTickerTape />

      {/* Markets Category Sub-Navigation */}
      <NavigationTabs />

      {/* Main Screen Body Viewport */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-6 py-6">
        {activeTab === 'overview' && <OverviewScreen />}
        {activeTab === 'indices' && <IndicesScreen />}
        {activeTab === 'stocks' && <StocksScreen />}
        {activeTab === 'crypto' && <CryptoScreen />}
        {activeTab === 'forex' && <ForexScreen />}
        {activeTab === 'futures' && <FuturesScreen />}
        {activeTab === 'bonds' && <BondsScreen />}
      </main>

      {/* Interactive Symbol Chart Modal */}
      {selectedAsset && (
        <TradingViewChartModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}

      {/* Side Watchlist Drawer */}
      <WatchlistDrawer />

      {/* Global Search Palette */}
      <SearchModal />

      {/* Clean Financial Disclaimer & Footer */}
      <footer className="border-t border-[#2a2e39] bg-[#131722] py-8 text-xs text-[#787b86]">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2962ff] flex items-center justify-center font-bold text-white text-[10px]">
              TV
            </div>
            <span className="font-semibold text-white">TradingView Markets</span>
            <span>· Global Financial Intelligence</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Real-time quotes provided by global exchanges</span>
            <span aria-hidden="true">·</span>
            <span>CME Group · NASDAQ · NYSE · ICE</span>
          </div>

          <div className="text-[11px]">
            © {new Date().getFullYear()} TradingView clone. All financial metrics simulated for analysis.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MainContent />
    </MarketProvider>
  );
}
