import React from 'react';
import { bundles } from '@/lib/bundles';
import { notFound } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import StockCard from '@/components/stocks/StockCard';
import { AssetCard } from '@/components/invest/AssetCard';
import { getMockHolding } from '@/lib/mockHoldings';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function BundlePage({
  params,
  searchParams,
}: {
  params: Promise<{ bundleId: string }>;
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const { bundleId } = await params;
  const sp: SearchParams | undefined = searchParams
    ? (searchParams instanceof Promise ? await searchParams : searchParams)
    : undefined;

  const bundle = bundles.find((b) => b.id === bundleId);

  if (!bundle) {
    notFound();
  }

  const context = (sp?.context as string) || 'for-you';

  // Bundles for You view (marketing/details)
  if (context === 'for-you') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative h-56 w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bundle.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 h-full flex flex-col justify-end pb-4 text-white">
            <h1 className="text-3xl font-bold">{bundle.title}</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm">Risk {bundle.riskLevel}</span>
              <span className="text-sm opacity-90">{bundle.description}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* At a Glance */}
          {Array.isArray((bundle as any).atAGlance) && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">At a Glance</h2>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {(bundle as any).atAGlance.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Past Returns */}
          {(bundle as any).pastReturns && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Past Returns</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg shadow p-3 text-center">
                  <div className="text-xs text-gray-500">YTD</div>
                  <div className="font-semibold text-gray-900">{(bundle as any).pastReturns.ytd || '—'}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                  <div className="text-xs text-gray-500">1Y</div>
                  <div className="font-semibold text-gray-900">{(bundle as any).pastReturns.oneY || '—'}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                  <div className="text-xs text-gray-500">3Y</div>
                  <div className="font-semibold text-gray-900">{(bundle as any).pastReturns.threeY || '—'}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-3 text-center">
                  <div className="text-xs text-gray-500">5Y</div>
                  <div className="font-semibold text-gray-900">{(bundle as any).pastReturns.fiveY || '—'}</div>
                </div>
              </div>
              {(bundle as any).pastReturns.note && (
                <p className="text-xs text-gray-500 mt-2">{(bundle as any).pastReturns.note}</p>
              )}
            </section>
          )}

          {/* What's in the bundle (narrative) */}
          {(bundle as any).whatsInBundle && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">What's in the Bundle</h2>
              <div className="bg-white rounded-lg shadow p-4 text-gray-700">
                <p>{(bundle as any).whatsInBundle}</p>
              </div>
            </section>
          )}

          {/* Assets cards */}
          {(bundle as any).assets && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900">Assets included</h2>
                <span className="text-sm text-gray-500">Price | Target allocation</span>
              </div>
              <div className="bg-white rounded-xl shadow overflow-hidden divide-y divide-gray-100">
                {(bundle as any).assets.map((a: any) => (
                  <AssetCard
                    key={a.symbol}
                    symbol={a.symbol}
                    name={a.name}
                    targetAllocation={a.targetAllocation}
                    price={a.price}
                  />
                ))}
              </div>
            </section>
          )}

          <div className="sticky bottom-20 sm:bottom-0 left-0 right-0 max-w-4xl mx-auto">
            <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow">
              Buy Bundle
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Holdings view (owned)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{bundle.title}</h1>
        <p className="text-lg text-gray-600 mb-4">Risk: {bundle.riskLevel}</p>
        <p className="text-gray-700 mb-8">{bundle.description}</p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Holdings in this Bundle</h2>
        <div className="space-y-3">
          {(bundle as any).assets?.length
            ? (bundle as any).assets.map((a: any) => {
                const m = getMockHolding(a.symbol);
                return (
                  <StockCard
                    key={a.symbol}
                    ticker={a.symbol}
                    name={a.name}
                    quantity={m.quantity}
                    avgBuyPrice={m.avgBuyPrice}
                    currentPrice={m.currentPrice}
                    targetAllocation={a.targetAllocation}
                  />
                );
              })
            : bundle.stocks.map((s: string) => {
                const m = getMockHolding(s);
                return (
                  <StockCard
                    key={s}
                    ticker={s}
                    quantity={m.quantity}
                    avgBuyPrice={m.avgBuyPrice}
                    currentPrice={m.currentPrice}
                  />
                );
              })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}