"use client";

import React from 'react';
import Link from 'next/link';
import BundleCard, { HoldingsData } from '@/components/invest/BundleCard';
import { bundles } from '@/lib/bundles';

// Extended bundle type with optional holdings data and past returns
export interface BundleWithHoldings {
  id: string;
  title: string;
  riskLevel: string;
  description: string;
  imageUrl: string;
  holdingsData?: HoldingsData;
  pastReturns?: {
    ytd: string;
    oneY: string;
    threeY: string;
    fiveY: string;
    note: string;
  };
}

interface BundleCarouselProps {
  bundles: BundleWithHoldings[] | typeof bundles;
  context?: 'holdings' | 'for-you';
}

// Left-aligned, swipeable horizontal list with scroll-snap
const BundleCarousel: React.FC<BundleCarouselProps> = ({ bundles, context = 'for-you' }) => {
  const isHoldingsContext = context === 'holdings';

  return (
    <div className="mb-8 overflow-x-auto no-scrollbar">
      <div className="flex gap-4 pr-4 snap-x snap-mandatory">
        {bundles.map((bundle) => {
          const bundleWithHoldings = bundle as BundleWithHoldings;
          // Extract expected return from pastReturns.oneY (e.g., "+45% (placeholder)" -> "+45%")
          const expectedReturn = bundleWithHoldings.pastReturns?.oneY?.split(' ')[0];
          return (
            <div key={bundle.id} className="snap-start shrink-0">
              <Link href={`/invest/${bundle.id}${context ? `?context=${context}` : ''}`}>
                <BundleCard
                  title={bundle.title}
                  riskLevel={bundle.riskLevel}
                  description={bundle.description}
                  imageUrl={bundle.imageUrl}
                  variant={isHoldingsContext ? 'holdings' : 'purchase'}
                  holdingsData={bundleWithHoldings.holdingsData}
                  expectedReturn={!isHoldingsContext ? expectedReturn : undefined}
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BundleCarousel;
