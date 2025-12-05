"use client";

import React from 'react';

// Stock logo colors based on ticker (for visual variety)
const tickerColors: Record<string, { bg: string; text: string }> = {
  // Tech
  NVDA: { bg: 'bg-green-600', text: 'text-white' },
  QCOM: { bg: 'bg-blue-600', text: 'text-white' },
  AMD: { bg: 'bg-red-600', text: 'text-white' },
  TSM: { bg: 'bg-red-700', text: 'text-white' },
  ASML: { bg: 'bg-blue-800', text: 'text-white' },
  ENTG: { bg: 'bg-purple-600', text: 'text-white' },
  
  // EV/Auto
  GM: { bg: 'bg-blue-900', text: 'text-white' },
  TSLA: { bg: 'bg-red-600', text: 'text-white' },
  BIDU: { bg: 'bg-blue-500', text: 'text-white' },
  NIO: { bg: 'bg-blue-400', text: 'text-white' },
  MBLY: { bg: 'bg-teal-600', text: 'text-white' },
  BYDDY: { bg: 'bg-gray-800', text: 'text-white' },
  
  // Cloud/Digital
  GOOGL: { bg: 'bg-blue-500', text: 'text-white' },
  CRM: { bg: 'bg-sky-500', text: 'text-white' },
  MSFT: { bg: 'bg-blue-600', text: 'text-white' },
  AMZN: { bg: 'bg-orange-500', text: 'text-white' },
  NTNX: { bg: 'bg-green-500', text: 'text-white' },
  SNOW: { bg: 'bg-cyan-500', text: 'text-white' },
  
  // Travel
  HLT: { bg: 'bg-blue-800', text: 'text-white' },
  DAL: { bg: 'bg-red-700', text: 'text-white' },
  RYAAY: { bg: 'bg-yellow-500', text: 'text-blue-900' },
  MAR: { bg: 'bg-red-800', text: 'text-white' },
  BKNG: { bg: 'bg-blue-700', text: 'text-white' },
  ABNB: { bg: 'bg-rose-500', text: 'text-white' },
  RCL: { bg: 'bg-blue-600', text: 'text-white' },
  
  // Media
  NFLX: { bg: 'bg-red-600', text: 'text-white' },
  SPOT: { bg: 'bg-green-500', text: 'text-white' },
  DIS: { bg: 'bg-blue-600', text: 'text-white' },
  U: { bg: 'bg-gray-900', text: 'text-white' },
  RBLX: { bg: 'bg-gray-800', text: 'text-white' },
  EA: { bg: 'bg-red-600', text: 'text-white' },
  
  // Gold
  GLD: { bg: 'bg-yellow-500', text: 'text-gray-900' },
  IAU: { bg: 'bg-yellow-600', text: 'text-white' },
  GOLD: { bg: 'bg-yellow-600', text: 'text-white' },
  NEM: { bg: 'bg-yellow-700', text: 'text-white' },
  AEM: { bg: 'bg-blue-700', text: 'text-white' },
  GDX: { bg: 'bg-yellow-500', text: 'text-gray-900' },
  
  // Crypto
  BTC: { bg: 'bg-orange-500', text: 'text-white' },
  ETH: { bg: 'bg-indigo-600', text: 'text-white' },
  SOL: { bg: 'bg-purple-500', text: 'text-white' },
  AVAX: { bg: 'bg-red-500', text: 'text-white' },
  MATIC: { bg: 'bg-purple-600', text: 'text-white' },
  
  // Crypto stocks
  MSTR: { bg: 'bg-red-700', text: 'text-white' },
  CLSK: { bg: 'bg-teal-500', text: 'text-white' },
  COIN: { bg: 'bg-blue-600', text: 'text-white' },
  RIOT: { bg: 'bg-blue-800', text: 'text-white' },
  MARA: { bg: 'bg-gray-900', text: 'text-white' },
  PYPL: { bg: 'bg-blue-800', text: 'text-white' },
  CME: { bg: 'bg-blue-700', text: 'text-white' },
};

const getTickerStyle = (ticker: string) => {
  return tickerColors[ticker] || { bg: 'bg-gray-600', text: 'text-white' };
};

// Generate mock price based on ticker (for demo purposes)
const getMockPrice = (ticker: string): string => {
  const prices: Record<string, number> = {
    // Tech
    NVDA: 875.28, QCOM: 168.45, AMD: 178.92, TSM: 142.67, ASML: 924.15, ENTG: 112.34,
    // EV
    GM: 48.23, TSLA: 248.50, BIDU: 98.76, NIO: 7.82, MBLY: 15.43, BYDDY: 56.78,
    // Cloud
    GOOGL: 175.89, CRM: 312.45, MSFT: 428.76, AMZN: 198.34, NTNX: 67.89, SNOW: 165.23,
    // Travel
    HLT: 234.56, DAL: 52.34, RYAAY: 156.78, MAR: 267.89, BKNG: 4123.45, ABNB: 142.56, RCL: 189.23,
    // Media
    NFLX: 678.90, SPOT: 456.78, DIS: 112.34, U: 23.45, RBLX: 52.67, EA: 145.23,
    // Gold
    GLD: 234.56, IAU: 45.67, GOLD: 18.45, NEM: 42.34, AEM: 78.90, GDX: 34.56,
    // Crypto
    BTC: 98456.78, ETH: 3456.78, SOL: 234.56, AVAX: 42.34, MATIC: 0.89,
    // Crypto stocks
    MSTR: 186.16, CLSK: 15.18, COIN: 275.15, RIOT: 15.68, MARA: 12.58, PYPL: 61.77, CME: 272.38,
  };
  return prices[ticker] ? `US$${prices[ticker].toFixed(2)}` : '—';
};

interface AssetCardProps {
  symbol: string;
  name: string;
  targetAllocation: number;
  price?: string;
}

export function AssetCard({ symbol, name, targetAllocation, price }: AssetCardProps) {
  const style = getTickerStyle(symbol);
  const displayPrice = price && price !== '—' ? price : getMockPrice(symbol);
  
  return (
    <div className="flex items-center justify-between py-4 px-4 bg-white border-b border-gray-100 last:border-b-0">
      {/* Left: Logo + Info */}
      <div className="flex items-center gap-3">
        {/* Logo/Icon */}
        <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-xs font-bold ${style.text}`}>
            {symbol.slice(0, 2)}
          </span>
        </div>
        
        {/* Ticker + Name */}
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900">{symbol}</span>
            <span className="text-xs text-gray-400">US</span>
          </div>
          <p className="text-sm text-gray-500 truncate max-w-[200px]">{name}</p>
        </div>
      </div>
      
      {/* Right: Price + Allocation */}
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-gray-900">{displayPrice}</p>
        <p className="text-sm text-gray-500">{targetAllocation.toFixed(2)}%</p>
      </div>
    </div>
  );
}

export default AssetCard;
