import React from 'react';
import BalanceChart from '@/components/invest/BalanceChart';
import SectionHeader from '@/components/invest/SectionHeader';
import { bundles } from '@/lib/bundles';
import { BottomNav } from '@/components/layout/BottomNav';
import BundleCarousel, { BundleWithHoldings } from '@/components/invest/BundleCarousel';
import { getMockBundleHoldings, userOwnedBundleIds } from '@/lib/mockHoldings';

// Get user holdings with purchase data (cost price, P&L)
const holdings: BundleWithHoldings[] = bundles
  .filter((bundle) => userOwnedBundleIds.includes(bundle.id))
  .map((bundle) => ({
    ...bundle,
    holdingsData: getMockBundleHoldings(bundle.id),
  }));

// Get bundles available for purchase (all bundles not in holdings)
const bundlesForPurchase = bundles.filter(
  (bundle) => !userOwnedBundleIds.includes(bundle.id)
);

const InvestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BalanceChart balance="$40,000" dailyReturn="+5.69" />

        <SectionHeader title="HOLDINGS" />
        <BundleCarousel bundles={holdings} context="holdings" />

        <SectionHeader title="BUNDLES FOR YOU" />
        <BundleCarousel bundles={bundlesForPurchase} context="for-you" />
      </div>
      <BottomNav />
    </div>
  );
};

export default InvestPage;
