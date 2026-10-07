import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { US_BOND_YIELDS, GLOBAL_10Y_BONDS } from '../../data/marketData';
import { Sparkline } from '../widgets/Sparkline';
import { Landmark, TrendingUp, Info } from 'lucide-react';

export const BondsScreen: React.FC = () => {
  const { setSelectedAsset, liveQuotes } = useMarket();

  // Compute 2Y vs 10Y spread
  const y2 = US_BOND_YIELDS.find((b) => b.maturity === '2Y')?.yieldValue || 4.12;
  const y10 = US_BOND_YIELDS.find((b) => b.maturity === '10Y')?.yieldValue || 4.24;
  const spread = (y10 - y2).toFixed(2);
  const isInverted = y2 > y10;

  // Chart coordinates for US Yield Curve
  const chartWidth = 680;
  const chartHeight = 220;
  const paddingX = 45;
  const paddingY = 25;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;

  const minY = 3.8;
  const maxY = 4.8;
  const rangeY = maxY - minY;

  const points = US_BOND_YIELDS.map((item, idx) => {
    const x = paddingX + (idx / (US_BOND_YIELDS.length - 1)) * plotWidth;
    const y = paddingY + plotHeight - ((item.yieldValue - minY) / rangeY) * plotHeight;
    return { x, y, ...item };
  });

  const curvePathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${curvePathD} L ${paddingX + plotWidth} ${paddingY + plotHeight} L ${paddingX} ${paddingY + plotHeight} Z`;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2a2e39]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-[#2962ff]" />
            Bonds & Treasury Yields
          </h2>
          <p className="text-xs text-[#787b86] mt-0.5">
            US Treasury sovereign yield curve, global 10-year benchmark rates, and fixed income spreads.
          </p>
        </div>

        {/* 2Y-10Y Spread Widget */}
        <div className="flex items-center gap-3 bg-[#1e222d] border border-[#2a2e39] px-3.5 py-1.5 rounded-lg text-xs font-mono">
          <span className="text-[#787b86]">2Y-10Y Spread:</span>
          <span className={`font-bold ${Number(spread) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
            {spread}% ({isInverted ? 'Inverted' : 'Normal Curve'})
          </span>
        </div>
      </div>

      {/* Interactive US Yield Curve Visualizer */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2a2e39]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2962ff]" />
            <h3 className="text-base font-bold text-white tracking-tight">
              US Treasury Yield Curve
            </h3>
          </div>
          <span className="text-xs text-[#787b86] font-mono">Maturity vs Yield (%)</span>
        </div>

        <div className="relative overflow-x-auto no-scrollbar">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[220px]">
            {/* Grid lines */}
            {[4.0, 4.2, 4.4, 4.6].map((gridVal) => {
              const y = paddingY + plotHeight - ((gridVal - minY) / rangeY) * plotHeight;
              return (
                <g key={gridVal}>
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
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    fill="#787b86"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                  >
                    {gridVal.toFixed(1)}%
                  </text>
                </g>
              );
            })}

            {/* Gradient fill */}
            <defs>
              <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#yieldGrad)" />
            <path d={curvePathD} fill="none" stroke="#2962ff" strokeWidth="2.5" />

            {/* Yield Points and Labels */}
            {points.map((pt, idx) => (
              <g key={idx}>
                <circle cx={pt.x} cy={pt.y} r="4.5" fill="#131722" stroke="#2962ff" strokeWidth="2.5" />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                >
                  {pt.yieldValue}%
                </text>
                <text
                  x={pt.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill="#787b86"
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                >
                  {pt.maturity}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Global 10-Year Benchmark Bonds */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden">
        <div className="p-4 bg-[#131722] border-b border-[#2a2e39] flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-tight">
            Global 10-Year Sovereign Debt Benchmarks
          </h3>
          <span className="text-xs text-[#787b86]">National Borrowing Rates</span>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2a2e39] text-[#787b86] font-medium">
                <th className="py-3 px-4">Sovereign Benchmark</th>
                <th className="py-3 px-3 font-mono">Yield (%)</th>
                <th className="py-3 px-3 font-mono">Change %</th>
                <th className="py-3 px-3 font-mono hidden sm:table-cell">Change bps</th>
                <th className="py-3 px-3 font-mono hidden md:table-cell">Day High</th>
                <th className="py-3 px-3 font-mono hidden md:table-cell">Day Low</th>
                <th className="py-3 px-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {GLOBAL_10Y_BONDS.map((bond) => {
                const live = liveQuotes[bond.symbol] || {
                  price: bond.price,
                  change: bond.change,
                  changePercent: bond.changePercent,
                  lastTickUp: null,
                };
                const isPos = live.changePercent >= 0;

                return (
                  <tr
                    key={bond.symbol}
                    onClick={() => setSelectedAsset(bond)}
                    className="hover:bg-[#2a2e39]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-white group-hover:text-[#2962ff] transition-colors">
                          {bond.symbol}
                        </span>
                        <span className="block text-[11px] text-[#787b86]">
                          {bond.name} · {bond.exchange}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-white">
                      {live.price.toFixed(2)}%
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
                      {isPos ? '+' : ''}
                      {(live.change * 100).toFixed(1)} bps
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {bond.dayHigh?.toFixed(2)}%
                    </td>

                    <td className="py-3 px-3 font-mono text-[#787b86] hidden md:table-cell">
                      {bond.dayLow?.toFixed(2)}%
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-block">
                        <Sparkline
                          data={bond.sparkline}
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
