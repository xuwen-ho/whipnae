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

const BalanceChart = ({ balance, dailyReturn }: { balance: string, dailyReturn: string }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-500">Net Assets · SGD</h3>
          <p className="text-3xl font-bold text-gray-800">{balance}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Daily Returns</h3>
          <p className="text-xl font-bold text-green-500">{dailyReturn}</p>
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
        <span>Beginning {data[0].value}</span>
        <span>Ending {data[data.length - 1].value}</span>
      </div>
    </div>
  );
};

export default BalanceChart;
