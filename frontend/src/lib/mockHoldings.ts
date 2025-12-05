// Simple deterministic mock holdings generator per symbol
export type MockHolding = {
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
};

function hashSymbol(sym: string): number {
  let h = 0;
  for (let i = 0; i < sym.length; i++) h = (h * 31 + sym.charCodeAt(i)) >>> 0;
  return h;
}

export function getMockHolding(symbol: string): MockHolding {
  const h = hashSymbol(symbol);
  // quantity between 5 and 50
  const quantity = 5 + (h % 46);
  // base price range by symbol hash
  const base = 10 + ((h >>> 3) % 490); // $10 .. ~$500
  // price drift between -25% and +40%
  const driftPct = ((h >>> 7) % 65) - 25; // -25 .. +39
  const avgBuyPrice = Math.max(2, base);
  const currentPrice = Math.max(1, +(avgBuyPrice * (1 + driftPct / 100)).toFixed(2));
  return { quantity, avgBuyPrice: +avgBuyPrice.toFixed(2), currentPrice };
}

// Mock bundle holdings data for the invest page
export interface BundleHoldingsData {
  costPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

function hashBundleId(bundleId: string): number {
  let h = 0;
  for (let i = 0; i < bundleId.length; i++) h = (h * 31 + bundleId.charCodeAt(i)) >>> 0;
  return h;
}

export function getMockBundleHoldings(bundleId: string): BundleHoldingsData {
  const h = hashBundleId(bundleId);
  // Cost price between $500 and $5000
  const costPrice = 500 + (h % 4501);
  // Price change between -20% and +35%
  const changePct = ((h >>> 5) % 56) - 20;
  const currentValue = +(costPrice * (1 + changePct / 100)).toFixed(2);
  const profitLoss = +(currentValue - costPrice).toFixed(2);
  const profitLossPercent = +((profitLoss / costPrice) * 100).toFixed(2);
  
  return { costPrice, currentValue, profitLoss, profitLossPercent };
}

// List of bundle IDs that the user "owns" (mock data)
export const userOwnedBundleIds = ['tech-bundle', 'travel-bundle', 'digital-bundle'];

