import React from 'react';

export interface StockCardProps {
  ticker: string;
  name?: string;
  quantity: number;
  avgBuyPrice: number; // cost basis per share
  currentPrice: number;
  targetAllocation?: number; // %
  currentAllocationPct?: number; // % of bundle (optional)
}

function formatCurrency(n: number): string {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

function formatPct(n: number): string {
  const sign = n > 0 ? '+' : n < 0 ? '' : '';
  return sign + n.toFixed(1) + '%';
}

const StockCard: React.FC<StockCardProps> = ({
  ticker,
  name,
  quantity,
  avgBuyPrice,
  currentPrice,
  targetAllocation,
  currentAllocationPct,
}) => {
  const totalInvested = quantity * avgBuyPrice;
  const currentValue = quantity * currentPrice;
  const valueChange = currentValue - totalInvested;
  const valueChangePct = totalInvested > 0 ? (valueChange / totalInvested) * 100 : 0;
  const perShareChangePct = avgBuyPrice > 0 ? ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100 : 0;
  const up = valueChange >= 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-base truncate">{ticker}</span>
            {name && <span className="text-sm text-gray-600 truncate">{name}</span>}
          </div>
          <div className="mt-1 text-sm text-gray-600">Qty: {quantity}</div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-900">{formatCurrency(currentValue)}</div>
          <div className={`text-sm ${up ? 'text-green-600' : 'text-red-600'}`}>
            {up ? '+' : ''}{formatCurrency(Math.abs(valueChange))} ({formatPct(valueChangePct)})
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Now: {formatCurrency(currentPrice)}{' '}
          <span className={`${perShareChangePct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({formatPct(perShareChangePct)})
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Bought: {formatCurrency(totalInvested)}
        </div>
      </div>

      {/* Allocation bar */}
      {(typeof targetAllocation === 'number' || typeof currentAllocationPct === 'number') && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Target {typeof targetAllocation === 'number' ? targetAllocation + '%' : '—'}</span>
            {typeof currentAllocationPct === 'number' && <span>Current {currentAllocationPct}%</span>}
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-1.5 bg-blue-600"
              style={{ width: `${Math.max(0, Math.min(100, currentAllocationPct ?? targetAllocation ?? 0))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCard;
