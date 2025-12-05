import React from 'react';

// Holdings data for purchased bundles
export interface HoldingsData {
  costPrice: number;       // Total cost when purchased
  currentValue: number;    // Current market value
  profitLoss: number;      // P&L amount
  profitLossPercent: number; // P&L percentage
}

// Risk level icon component - circular ring with number inside
const RiskIcon: React.FC<{ level: number }> = ({ level }) => {
  // Color based on risk level
  const borderColor = level >= 7 ? 'border-red-500' : level >= 4 ? 'border-yellow-500' : 'border-green-500';
  const textColor = level >= 7 ? 'text-red-500' : level >= 4 ? 'text-yellow-500' : 'text-green-500';
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`w-8 h-8 rounded-full border-2 ${borderColor} flex items-center justify-center ${textColor} text-sm font-bold bg-black/30`}
        title={`Risk: ${level}/10`}
      >
        {level}
      </div>
      <span className="text-[10px] text-white/80 mt-0.5">Risk</span>
    </div>
  );
};

interface BundleCardProps {
  title: string;
  riskLevel: string;
  description: string;
  imageUrl: string;
  variant?: 'holdings' | 'purchase'; // Card display variant
  holdingsData?: HoldingsData;       // Holdings info (only for 'holdings' variant)
  expectedReturn?: string;           // Annual expected return (only for 'purchase' variant)
}

const BundleCard: React.FC<BundleCardProps> = ({ 
  title, 
  riskLevel, 
  description, 
  imageUrl,
  variant = 'purchase',
  holdingsData,
  expectedReturn
}) => {
  const isHoldings = variant === 'holdings' && holdingsData;
  const isProfitPositive = holdingsData && holdingsData.profitLoss >= 0;

  // Holdings cards are half height with center-cropped images
  const cardHeight = isHoldings ? 'h-32' : 'h-64';

  // Parse risk level number from string like "7/10"
  const riskNumber = parseInt(riskLevel.split('/')[0]) || 5;

  // Shorten description for purchase cards (max ~120 chars to fit card)
  const shortDescription = description.length > 120 
    ? description.substring(0, 120).trim() + '...'
    : description;

  return (
    <div
      className={`relative overflow-hidden bg-cover bg-center ${cardHeight} w-48 p-4 rounded-lg shadow-md flex flex-col justify-between text-white`}
      style={{ backgroundImage: `url(${imageUrl})`, backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/45" />
      
      {isHoldings ? (
        // Holdings view: title at top, cost and P&L at bottom right
        <>
          <div className="relative z-10">
            <h4 className="font-bold text-sm drop-shadow-sm leading-tight">{title}</h4>
          </div>
          <div className="relative z-10 flex flex-col items-end">
            <p className="text-xs opacity-95">
              Cost: ${holdingsData.costPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <p className={`text-xs font-semibold ${isProfitPositive ? 'text-green-400' : 'text-red-400'}`}>
              P&L: {isProfitPositive ? '+' : ''}{holdingsData.profitLossPercent.toFixed(2)}%
            </p>
          </div>
        </>
      ) : (
        // Purchase view: title top left, risk icon bottom left, expected return bottom right
        <>
          <div className="relative z-10">
            <h4 className="font-bold text-lg drop-shadow-sm break-words">{title}</h4>
            <p className="text-xs mt-1 opacity-90 break-words">{shortDescription}</p>
          </div>
          <div className="relative z-10 flex justify-between items-end">
            <RiskIcon level={riskNumber} />
            {expectedReturn && (
              <div className="flex flex-col items-end">
                <p className="text-lg font-bold text-green-400">
                  {expectedReturn}
                </p>
                <span className="text-[10px] text-white/80">Expected Annual Returns</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BundleCard;
