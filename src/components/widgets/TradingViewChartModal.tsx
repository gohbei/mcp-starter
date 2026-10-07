import React, { useState, useMemo } from 'react';
import { X, Bookmark, BookmarkCheck, BarChart2, TrendingUp, Maximize2, Check } from 'lucide-react';
import { Asset, CandleData } from '../../types/market';
import { generateCandleSeries } from '../../data/marketData';
import { useMarket } from '../../context/MarketContext';

interface ChartModalProps {
  asset: Asset;
  onClose: () => void;
}

type ChartType = 'candlestick' | 'line' | 'area';
type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y';

export const TradingViewChartModal: React.FC<ChartModalProps> = ({ asset, onClose }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, liveQuotes } = useMarket();
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [showSMA, setShowSMA] = useState<boolean>(true);
  const [showEMA, setShowEMA] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [showRSI, setShowRSI] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  const inWatchlist = isInWatchlist(asset.symbol);

  // Dynamic live price from context
  const live = liveQuotes[asset.symbol] || {
    price: asset.price,
    change: asset.change,
    changePercent: asset.changePercent,
    lastTickUp: null,
  };
  const isPos = live.changePercent >= 0;

  // Generate realistic candlestick data
  const candleCount = timeframe === '1D' ? 24 : timeframe === '5D' ? 35 : timeframe === '1M' ? 30 : 45;
  const rawCandles = useMemo(() => {
    return generateCandleSeries(live.price, candleCount);
  }, [asset.symbol, timeframe, candleCount]);

  // Compute 20-period Simple Moving Average
  const smaPoints = useMemo(() => {
    const period = 10;
    return rawCandles.map((c, idx) => {
      if (idx < period - 1) return null;
      const slice = rawCandles.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / period;
      return avg;
    });
  }, [rawCandles]);

  // Compute 50-period Exponential Moving Average simulation
  const emaPoints = useMemo(() => {
    const k = 2 / (15 + 1);
    let ema = rawCandles[0].close;
    return rawCandles.map((c) => {
      ema = c.close * k + ema * (1 - k);
      return ema;
    });
  }, [rawCandles]);

  // Active hover candle or latest candle
  const activeCandle: CandleData =
    hoverIndex !== null && rawCandles[hoverIndex]
      ? rawCandles[hoverIndex]
      : rawCandles[rawCandles.length - 1];

  // Chart coordinates calculation
  const chartHeight = 360;
  const chartWidth = 740;
  const paddingX = 40;
  const paddingY = 30;
  const volumeHeight = 60;
  const mainPlotHeight = chartHeight - paddingY * 2 - (showVolume ? volumeHeight : 0);

  const minPrice = Math.min(...rawCandles.map((c) => c.low));
  const maxPrice = Math.max(...rawCandles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...rawCandles.map((c) => c.volume));

  const getY = (val: number) => {
    return paddingY + mainPlotHeight - ((val - minPrice) / priceRange) * mainPlotHeight;
  };

  const getVolY = (vol: number) => {
    const topOfVolume = chartHeight - volumeHeight - 10;
    return chartHeight - 10 - (vol / (maxVolume || 1)) * (volumeHeight - 10);
  };

  const stepX = (chartWidth - paddingX * 2) / (rawCandles.length - 1);

  // Line / Area path string
  const linePathD = rawCandles.reduce((acc, c, idx) => {
    const x = paddingX + idx * stepX;
    const y = getY(c.close);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaPathD = `${linePathD} L ${paddingX + (rawCandles.length - 1) * stepX} ${paddingY + mainPlotHeight} L ${paddingX} ${paddingY + mainPlotHeight} Z`;

  // SMA path
  const smaPathD = smaPoints.reduce((acc, pt, idx) => {
    if (pt === null) return '';
    const x = paddingX + idx * stepX;
    const y = getY(pt);
    return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // EMA path
  const emaPathD = emaPoints.reduce((acc, pt, idx) => {
    const x = paddingX + idx * stepX;
    const y = getY(pt);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const handleOrder = (type: 'Buy' | 'Sell') => {
    setOrderNotice(`Simulated ${type} 100 shares of ${asset.symbol} @ $${live.price.toFixed(2)}`);
    setTimeout(() => setOrderNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-[#2a2e39] flex items-center justify-between gap-4 bg-[#131722]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a2e39] flex items-center justify-center font-bold text-white text-sm">
              {asset.symbol.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {asset.symbol}
                </h2>
                <span className="text-xs text-[#787b86] font-medium">
                  {asset.name}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#2a2e39] text-[#787b86]">
                  {asset.exchange}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold font-mono text-white">
                  {asset.type === 'bond'
                    ? `${live.price.toFixed(2)}%`
                    : `$${live.price.toLocaleString('en-US', {
                        minimumFractionDigits: live.price > 100 ? 2 : 4,
                        maximumFractionDigits: live.price > 100 ? 2 : 4,
                      })}`}
                </span>
                <span
                  className={`font-mono text-xs font-semibold ${
                    isPos ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {live.change.toFixed(2)} ({isPos ? '+' : ''}
                  {live.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => (inWatchlist ? removeFromWatchlist(asset.symbol) : addToWatchlist(asset.symbol))}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                inWatchlist
                  ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]/40'
                  : 'bg-[#1e222d] text-[#787b86] border-[#2a2e39] hover:text-white hover:bg-[#2a2e39]'
              }`}
            >
              {inWatchlist ? <BookmarkCheck className="w-4 h-4 text-[#2962ff]" /> : <Bookmark className="w-4 h-4" />}
              <span>{inWatchlist ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] border border-[#2a2e39] flex items-center justify-center text-[#787b86] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chart Controls Bar */}
        <div className="px-5 py-2.5 bg-[#1e222d] border-b border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Timeframes */}
          <div className="flex items-center gap-1">
            {(['1D', '5D', '1M', '6M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Toggles */}
          <div className="flex items-center gap-1 bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39]">
            {(['candlestick', 'area', 'line'] as ChartType[]).map((style) => (
              <button
                key={style}
                onClick={() => setChartType(style)}
                className={`px-2 py-1 rounded capitalize font-medium transition-colors cursor-pointer ${
                  chartType === style
                    ? 'bg-[#2a2e39] text-white font-semibold'
                    : 'text-[#787b86] hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Indicators toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                showSMA
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'text-[#787b86] border-[#2a2e39] hover:text-white'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                showEMA
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : 'text-[#787b86] border-[#2a2e39] hover:text-white'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                showVolume
                  ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]/40'
                  : 'text-[#787b86] border-[#2a2e39] hover:text-white'
              }`}
            >
              Volume
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-1 rounded text-[11px] font-mono border transition-colors cursor-pointer ${
                showRSI
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                  : 'text-[#787b86] border-[#2a2e39] hover:text-white'
              }`}
            >
              RSI 14
            </button>
          </div>
        </div>

        {/* OHLCV Crosshair HUD Display */}
        <div className="px-5 py-2 bg-[#131722]/80 border-b border-[#2a2e39] flex flex-wrap items-center gap-4 text-xs font-mono text-[#787b86]">
          <div>
            <span>Date: </span>
            <span className="text-white font-medium">{activeCandle.time}</span>
          </div>
          <div>
            <span>Open: </span>
            <span className="text-white">${activeCandle.open.toFixed(2)}</span>
          </div>
          <div>
            <span>High: </span>
            <span className="text-[#089981]">${activeCandle.high.toFixed(2)}</span>
          </div>
          <div>
            <span>Low: </span>
            <span className="text-[#f23645]">${activeCandle.low.toFixed(2)}</span>
          </div>
          <div>
            <span>Close: </span>
            <span className="text-white">${activeCandle.close.toFixed(2)}</span>
          </div>
          <div>
            <span>Vol: </span>
            <span className="text-white">{(activeCandle.volume / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        {/* Interactive Chart Canvas Viewport */}
        <div className="relative p-2 bg-[#131722] flex-1 flex flex-col items-center justify-center overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-[360px] select-none"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = paddingY + pct * mainPlotHeight;
              const priceVal = maxPrice - pct * priceRange;
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#2a2e39"
                    strokeDasharray="3 3"
                    strokeWidth="0.75"
                  />
                  <text
                    x={chartWidth - paddingX + 6}
                    y={y + 3}
                    fill="#787b86"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                  >
                    ${priceVal.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Volume Histogram */}
            {showVolume &&
              rawCandles.map((c, idx) => {
                const x = paddingX + idx * stepX;
                const volY = getVolY(c.volume);
                const isBull = c.close >= c.open;
                const barWidth = Math.max(stepX * 0.7, 3);
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x - barWidth / 2}
                    y={volY}
                    width={barWidth}
                    height={chartHeight - 10 - volY}
                    fill={isBull ? '#089981' : '#f23645'}
                    opacity="0.35"
                  />
                );
              })}

            {/* Area or Line Chart */}
            {chartType === 'area' && (
              <>
                <defs>
                  <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaPathD} fill="url(#chartAreaGrad)" />
                <path d={linePathD} fill="none" stroke="#2962ff" strokeWidth="2" />
              </>
            )}

            {chartType === 'line' && (
              <path d={linePathD} fill="none" stroke="#2962ff" strokeWidth="2" />
            )}

            {/* Candlestick Chart */}
            {chartType === 'candlestick' &&
              rawCandles.map((c, idx) => {
                const x = paddingX + idx * stepX;
                const isBull = c.close >= c.open;
                const candleColor = isBull ? '#089981' : '#f23645';
                const yHigh = getY(c.high);
                const yLow = getY(c.low);
                const yOpen = getY(c.open);
                const yClose = getY(c.close);
                const candleTop = Math.min(yOpen, yClose);
                const candleBodyHeight = Math.max(Math.abs(yOpen - yClose), 2);
                const candleWidth = Math.max(stepX * 0.7, 4);

                return (
                  <g key={`candle-${idx}`}>
                    {/* Wick */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={candleColor}
                      strokeWidth="1.25"
                    />
                    {/* Body */}
                    <rect
                      x={x - candleWidth / 2}
                      y={candleTop}
                      width={candleWidth}
                      height={candleBodyHeight}
                      fill={candleColor}
                      rx="1"
                    />
                  </g>
                );
              })}

            {/* SMA Line */}
            {showSMA && smaPathD && (
              <path
                d={smaPathD}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            )}

            {/* EMA Line */}
            {showEMA && emaPathD && (
              <path
                d={emaPathD}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            )}

            {/* Hover detection overlay columns */}
            {rawCandles.map((_, idx) => {
              const x = paddingX + idx * stepX;
              return (
                <rect
                  key={`hover-detect-${idx}`}
                  x={x - stepX / 2}
                  y={0}
                  width={stepX}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoverIndex(idx)}
                  className="cursor-crosshair"
                />
              );
            })}

            {/* Interactive Crosshair Indicator */}
            {hoverIndex !== null && (
              <g>
                <line
                  x1={paddingX + hoverIndex * stepX}
                  y1={paddingY}
                  x2={paddingX + hoverIndex * stepX}
                  y2={chartHeight - 10}
                  stroke="#787b86"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
                <circle
                  cx={paddingX + hoverIndex * stepX}
                  cy={getY(rawCandles[hoverIndex].close)}
                  r="4"
                  fill="#ffffff"
                  stroke="#2962ff"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          {/* RSI Gauge (when toggled) */}
          {showRSI && (
            <div className="w-full px-8 py-2 bg-[#1e222d] border-t border-[#2a2e39] flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-semibold">RSI (14): 58.4</span>
              <div className="flex items-center gap-3 text-[11px] text-[#787b86]">
                <span>Overbought (70)</span>
                <div className="w-32 h-2 bg-[#131722] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[58%]"></div>
                </div>
                <span>Oversold (30)</span>
              </div>
            </div>
          )}
        </div>

        {/* Key Statistics & Financial Metrics Bar */}
        <div className="p-4 bg-[#1e222d] border-t border-[#2a2e39] grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-[#787b86] block text-[11px]">52-Week Range</span>
            <div className="mt-1 flex items-center gap-1.5 font-mono">
              <span className="text-[11px] text-[#787b86]">${asset.low52w || 120}</span>
              <div className="flex-1 h-1.5 bg-[#2a2e39] rounded-full relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-[#2962ff] w-3/4 rounded-full"></div>
              </div>
              <span className="text-[11px] text-[#787b86]">${asset.high52w || 240}</span>
            </div>
          </div>

          <div>
            <span className="text-[#787b86] block text-[11px]">Market Cap</span>
            <span className="font-mono font-medium text-white text-xs mt-1 block">
              {asset.marketCap || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[#787b86] block text-[11px]">P/E Ratio</span>
            <span className="font-mono font-medium text-white text-xs mt-1 block">
              {asset.peRatio ? asset.peRatio.toFixed(1) : 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[#787b86] block text-[11px]">Volume</span>
            <span className="font-mono font-medium text-white text-xs mt-1 block">
              {asset.volume}
            </span>
          </div>

          <div>
            <span className="text-[#787b86] block text-[11px]">Sector</span>
            <span className="font-medium text-white text-xs mt-1 block truncate">
              {asset.sector || asset.type.toUpperCase()}
            </span>
          </div>

          {/* Quick Trade Simulation Button */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => handleOrder('Buy')}
              className="flex-1 py-1.5 bg-[#089981] hover:bg-[#07806c] text-white font-bold rounded-lg transition-colors cursor-pointer text-center text-xs"
            >
              Buy
            </button>
            <button
              onClick={() => handleOrder('Sell')}
              className="flex-1 py-1.5 bg-[#f23645] hover:bg-[#d42d3b] text-white font-bold rounded-lg transition-colors cursor-pointer text-center text-xs"
            >
              Sell
            </button>
          </div>
        </div>

        {/* Order execution toast */}
        {orderNotice && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#089981] text-white text-xs font-semibold rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{orderNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
