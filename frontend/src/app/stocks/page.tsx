import React from 'react';
import BalanceChart from '@/components/invest/BalanceChart';
import SectionHeader from '@/components/invest/SectionHeader';
import { FiSearch } from 'react-icons/fi';
import { BottomNav } from '@/components/layout/BottomNav';
import StockCard from '@/components/stocks/StockCard';
import { getMockHolding } from '@/lib/mockHoldings';

const HOLDINGS_TICKERS = ['AAPL', 'SAP', 'GOOGL'];
const NAMES: Record<string, string> = {
  AAPL: 'Apple Inc.',
  SAP: 'SAP SE',
  GOOGL: 'Alphabet Inc.',
  TSLA: 'Tesla, Inc.',
  AMZN: 'Amazon.com, Inc.',
};

const WATCHLIST = [
  { ticker: 'TSLA', price: '$750.00', change: '+2.5%' },
  { ticker: 'AMZN', price: '$3,400.50', change: '-1.1%' },
];

const StocksPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BalanceChart balance="$120,000" />

        <SectionHeader title="HOLDINGS" />
        <div className="space-y-3 mb-8">
          {HOLDINGS_TICKERS.map((ticker) => {
            const m = getMockHolding(ticker);
            return (
              <StockCard
                key={ticker}
                ticker={ticker}
                name={NAMES[ticker]}
                quantity={m.quantity}
                avgBuyPrice={m.avgBuyPrice}
                currentPrice={m.currentPrice}
              />
            );
          })}
        </div>

        <SectionHeader title="WATCHLIST" />
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="     Search Stocks..."
              className="search-input w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="search-icon absolute top-3 left-3 text-gray-400" />
          </div>
          <div className="space-y-3">
            {WATCHLIST.map((s, idx) => {
              const positive = s.change.startsWith('+');
              return (
                <div key={idx} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">{s.ticker}</div>
                    <div className="text-xs text-gray-500">{NAMES[s.ticker] || '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900">{s.price}</div>
                    <div className={positive ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>{s.change}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default StocksPage;
