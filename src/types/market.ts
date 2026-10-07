export type AssetType = 'stock' | 'crypto' | 'forex' | 'future' | 'index' | 'bond';

export interface SparklinePoint {
  time: string;
  value: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  exchange: string;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  high52w?: number;
  low52w?: number;
  dayHigh?: number;
  dayLow?: number;
  sector?: string;
  region?: 'Americas' | 'Europe' | 'Asia' | 'Global';
  description?: string;
  sparkline: number[];
  category?: string; // e.g. "Layer 1", "Energy", "Metals"
}

export interface SectorHeatmap {
  name: string;
  marketCapShare: number;
  stocks: {
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
    marketCap: string;
    weight: number;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  relatedSymbols: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
}

export interface ForexCrossRate {
  base: string;
  rates: Record<string, number>;
}

export interface BondYield {
  maturity: string;
  yieldValue: number;
  change: number;
  changePercent: number;
  country: string;
}
