"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Nov 5', value: 40000 },
  { date: 'Nov 7', value: 38000 },
  { date: 'Nov 8', value: 37500 },
  { date: 'Nov 12', value: 39000 },
  { date: 'Nov 15', value: 37000 },
  { date: 'Nov 18', value: 36500 },
  { date: 'Nov 22', value: 35000 },
  { date: 'Nov 25', value: 33500 },
  { date: 'Nov 28', value: 34500 },
  { date: 'Dec 1', value: 35000 },
  { date: 'Dec 3', value: 35500 },
  { date: 'Dec 5', value: 36000 },
];

// Calculate actual daily return (change from previous day)
const calculateDailyReturn = () => {
  if (data.length < 2) return { value: 0, formatted: '$0.00' };
  const today = data[data.length - 1].value;
  const yesterday = data[data.length - 2].value;
  const change = today - yesterday;
  const sign = change >= 0 ? '+' : '';
  return {
    value: change,
    formatted: `${sign}$${Math.abs(change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  };
};

// Calculate total return from beginning
const calculateTotalReturn = () => {
  if (data.length < 2) return { value: 0, formatted: '$0.00', percentage: '0%' };
  const beginning = data[0].value;
  const ending = data[data.length - 1].value;
  const change = ending - beginning;
  const percentage = ((change / beginning) * 100).toFixed(2);
  const sign = change >= 0 ? '+' : '';
  return {
    value: change,
    formatted: `${sign}$${Math.abs(change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    percentage: `${sign}${percentage}%`
  };
};

const BalanceChart = ({ balance }: { balance: string }) => {
  const dailyReturn = calculateDailyReturn();
  const totalReturn = calculateTotalReturn();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-500">Net Assets · SGD</h3>
          <p className="text-3xl font-bold text-gray-800">{balance}</p>
        </div>
        <div className="text-right">
          <h3 className="text-sm text-gray-500">Daily Returns</h3>
          <p className={`text-xl font-bold ${dailyReturn.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {dailyReturn.formatted}
          </p>
          <p className={`text-sm ${totalReturn.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            Total: {totalReturn.formatted} ({totalReturn.percentage})
          </p>
        </div>
      </div>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 60, bottom: 20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis domain={[30000, 45000]} />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Beginning {data[0].value.toLocaleString()}</span>
        <span>Ending {data[data.length - 1].value.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default BalanceChart;
