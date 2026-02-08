import React, { useState, useMemo } from 'react';
import { X, TrendingUp, DollarSign, AlertTriangle, BarChart3, PieChart } from 'lucide-react';

const generateHistoricalData = (ytdReturn) => {
  const baseReturn = ytdReturn / 12;
  const volatility = Math.abs(ytdReturn) * 0.3;

  return Array.from({ length: 36 }, (_, i) => {
    const month = i;
    const randomWalk = (Math.random() - 0.5) * volatility;
    const trend = baseReturn * month;
    const value = 100 + trend + randomWalk * (month / 3);

    const date = new Date();
    date.setMonth(date.getMonth() - (35 - i));

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      value: Math.max(50, value)
    };
  });
};

const generateHoldings = (product) => {
  if (product.type === 'Mutual Fund' || product.category.includes('Allocation') || product.category.includes('Balanced')) {
    return [
      { name: 'Apple Inc.', ticker: 'AAPL', percentage: 6.8, value: product.aum * 0.068 },
      { name: 'Microsoft Corp.', ticker: 'MSFT', percentage: 6.2, value: product.aum * 0.062 },
      { name: 'Amazon.com Inc.', ticker: 'AMZN', percentage: 3.4, value: product.aum * 0.034 },
      { name: 'NVIDIA Corp.', ticker: 'NVDA', percentage: 3.1, value: product.aum * 0.031 },
      { name: 'Alphabet Inc. Class A', ticker: 'GOOGL', percentage: 2.8, value: product.aum * 0.028 },
      { name: 'Meta Platforms Inc.', ticker: 'META', percentage: 2.5, value: product.aum * 0.025 },
      { name: 'Tesla Inc.', ticker: 'TSLA', percentage: 2.1, value: product.aum * 0.021 },
      { name: 'Berkshire Hathaway Inc.', ticker: 'BRK.B', percentage: 1.9, value: product.aum * 0.019 },
      { name: 'JPMorgan Chase & Co.', ticker: 'JPM', percentage: 1.7, value: product.aum * 0.017 },
      { name: 'Visa Inc.', ticker: 'V', percentage: 1.5, value: product.aum * 0.015 },
    ];
  }

  if (product.assetClass === 'Fixed Income') {
    return [
      { name: 'U.S. Treasury Notes', ticker: 'UST', percentage: 45.2, value: product.aum * 0.452 },
      { name: 'Corporate Bonds AAA', ticker: 'CORP-AAA', percentage: 15.8, value: product.aum * 0.158 },
      { name: 'Mortgage-Backed Securities', ticker: 'MBS', percentage: 12.3, value: product.aum * 0.123 },
      { name: 'Corporate Bonds AA', ticker: 'CORP-AA', percentage: 8.9, value: product.aum * 0.089 },
      { name: 'Municipal Bonds', ticker: 'MUNI', percentage: 6.7, value: product.aum * 0.067 },
      { name: 'International Bonds', ticker: 'INTL', percentage: 5.4, value: product.aum * 0.054 },
      { name: 'Corporate Bonds A', ticker: 'CORP-A', percentage: 3.2, value: product.aum * 0.032 },
      { name: 'TIPS', ticker: 'TIPS', percentage: 2.5, value: product.aum * 0.025 },
    ];
  }

  return [
    { name: 'Apple Inc.', ticker: 'AAPL', percentage: 7.2, value: product.aum * 0.072 },
    { name: 'Microsoft Corp.', ticker: 'MSFT', percentage: 6.8, value: product.aum * 0.068 },
    { name: 'Amazon.com Inc.', ticker: 'AMZN', percentage: 4.1, value: product.aum * 0.041 },
    { name: 'NVIDIA Corp.', ticker: 'NVDA', percentage: 3.8, value: product.aum * 0.038 },
    { name: 'Alphabet Inc. Class A', ticker: 'GOOGL', percentage: 3.2, value: product.aum * 0.032 },
    { name: 'Meta Platforms Inc.', ticker: 'META', percentage: 2.9, value: product.aum * 0.029 },
    { name: 'Tesla Inc.', ticker: 'TSLA', percentage: 2.4, value: product.aum * 0.024 },
    { name: 'Broadcom Inc.', ticker: 'AVGO', percentage: 2.1, value: product.aum * 0.021 },
    { name: 'Eli Lilly and Co.', ticker: 'LLY', percentage: 1.9, value: product.aum * 0.019 },
    { name: 'JPMorgan Chase & Co.', ticker: 'JPM', percentage: 1.8, value: product.aum * 0.018 },
  ];
};

const calculateRiskMetrics = (product) => {
  const baseVolatility = product.riskRating * 3.5;
  const sharpeRatio = Math.max(0.1, (product.ytdReturn - 5.0) / baseVolatility);

  return {
    volatility: baseVolatility.toFixed(2),
    sharpeRatio: sharpeRatio.toFixed(2),
    beta: product.riskRating === 1 ? '0.05' : (0.7 + (product.riskRating - 2) * 0.2).toFixed(2),
    maxDrawdown: (baseVolatility * -1.5).toFixed(2),
    alpha: (product.ytdReturn - 10).toFixed(2),
    rSquared: (85 + Math.random() * 10).toFixed(0)
  };
};

const getCategoryAverages = (product) => {
  const categoryData = {
    'Large Blend': { return: 12.5, expenseRatio: 0.08, risk: 4, morningstar: 4 },
    'Large Growth': { return: 24.2, expenseRatio: 0.12, risk: 5, morningstar: 4 },
    'Large Value': { return: 15.1, expenseRatio: 0.09, risk: 4, morningstar: 4 },
    'Mid-Cap Blend': { return: 10.8, expenseRatio: 0.11, risk: 5, morningstar: 4 },
    'Small Blend': { return: 9.0, expenseRatio: 0.13, risk: 5, morningstar: 4 },
    'Foreign Large Blend': { return: 10.5, expenseRatio: 0.15, risk: 4, morningstar: 3 },
    'Diversified Emerging Mkts': { return: 7.8, expenseRatio: 0.25, risk: 5, morningstar: 3 },
    'Intermediate Core Bond': { return: 0.2, expenseRatio: 0.06, risk: 2, morningstar: 4 },
    'Short-term Bond': { return: 4.5, expenseRatio: 0.08, risk: 1, morningstar: 3 },
    'High Yield Bond': { return: 6.3, expenseRatio: 0.45, risk: 4, morningstar: 3 },
    'Real Estate': { return: 3.8, expenseRatio: 0.15, risk: 4, morningstar: 4 },
  };

  return categoryData[product.category] || { return: 10.0, expenseRatio: 0.10, risk: 3, morningstar: 3 };
};

export default function ProductDetailView({ product, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  const historicalData = useMemo(() => generateHistoricalData(product.ytdReturn), [product]);
  const holdings = useMemo(() => generateHoldings(product), [product]);
  const riskMetrics = useMemo(() => calculateRiskMetrics(product), [product]);
  const categoryAvg = useMemo(() => getCategoryAverages(product), [product]);

  const maxValue = Math.max(...historicalData.map(d => d.value));
  const minValue = Math.min(...historicalData.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold">{product.ticker}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">{product.type}</span>
            </div>
            <h2 className="text-xl font-medium mb-1">{product.name}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-300">
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.region}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                {'★'.repeat(product.morningstarRating)}{'☆'.repeat(5 - product.morningstarRating)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-slate-200">
          <div className="flex gap-1 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'holdings', label: 'Holdings', icon: PieChart },
              { id: 'fees', label: 'Fees & Costs', icon: DollarSign },
              { id: 'risk', label: 'Risk Metrics', icon: AlertTriangle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">YTD Return</div>
                  <div className={`text-2xl font-bold ${product.ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.ytdReturn >= 0 ? '+' : ''}{product.ytdReturn.toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">vs {categoryAvg.return.toFixed(2)}% avg</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Expense Ratio</div>
                  <div className="text-2xl font-bold text-slate-900">{product.expenseRatio.toFixed(2)}%</div>
                  <div className="text-xs text-slate-500 mt-1">vs {categoryAvg.expenseRatio.toFixed(2)}% avg</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Total AUM</div>
                  <div className="text-2xl font-bold text-slate-900">
                    ${(product.aum / 1000000000).toFixed(1)}B
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Assets under mgmt</div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Risk Rating</div>
                  <div className="text-2xl font-bold text-slate-900">{product.riskRating}/5</div>
                  <div className="text-xs text-slate-500 mt-1">vs {categoryAvg.risk}/5 avg</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Fund Description</h3>
                <p className="text-slate-700 leading-relaxed">
                  {product.name} is a {product.type.toLowerCase()} that tracks the performance of {product.category.toLowerCase()}
                  securities in the {product.region.toLowerCase()} market. This fund provides investors with diversified exposure to
                  {product.assetClass === 'Fixed Income' ? ' fixed income securities' : ' equity markets'} and is suitable for
                  {product.riskRating <= 2 ? ' conservative' : product.riskRating <= 3 ? ' moderate' : ' aggressive'} investors
                  seeking {product.assetClass === 'Fixed Income' ? 'income generation and capital preservation' : 'long-term capital appreciation'}.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Category Comparison</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Return vs Category</span>
                      <span className={product.ytdReturn > categoryAvg.return ? 'text-green-600' : 'text-red-600'}>
                        {product.ytdReturn > categoryAvg.return ? '+' : ''}{(product.ytdReturn - categoryAvg.return).toFixed(2)}%
                      </span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${product.ytdReturn > categoryAvg.return ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, Math.abs((product.ytdReturn - categoryAvg.return) / categoryAvg.return * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">Cost vs Category</span>
                      <span className={product.expenseRatio < categoryAvg.expenseRatio ? 'text-green-600' : 'text-red-600'}>
                        {product.expenseRatio < categoryAvg.expenseRatio ? '-' : '+'}{Math.abs(product.expenseRatio - categoryAvg.expenseRatio).toFixed(3)}%
                      </span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${product.expenseRatio < categoryAvg.expenseRatio ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(100, Math.abs((product.expenseRatio - categoryAvg.expenseRatio) / categoryAvg.expenseRatio * 100) * 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">3-Year Historical Performance</h3>
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="relative h-64">
                    <svg className="w-full h-full">
                      <polyline
                        points={historicalData.map((d, i) =>
                          `${(i / (historicalData.length - 1)) * 100}%,${100 - ((d.value - minValue) / range) * 100}%`
                        ).join(' ')}
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                      />

                      <line x1="0" y1="0" x2="0" y2="100%" stroke="rgb(203, 213, 225)" strokeWidth="1" />
                      <line x1="0" y1="100%" x2="100%" y2="100%" stroke="rgb(203, 213, 225)" strokeWidth="1" />
                    </svg>

                    <div className="absolute -left-12 top-0 text-xs text-slate-500">
                      ${maxValue.toFixed(0)}
                    </div>
                    <div className="absolute -left-12 bottom-0 text-xs text-slate-500">
                      ${minValue.toFixed(0)}
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 text-xs text-slate-500">
                    <span>{historicalData[0].date}</span>
                    <span>{historicalData[Math.floor(historicalData.length / 2)].date}</span>
                    <span>{historicalData[historicalData.length - 1].date}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Returns by Period</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">1 Year</div>
                    <div className={`text-xl font-bold ${product.ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.ytdReturn >= 0 ? '+' : ''}{(product.ytdReturn * 0.9).toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">3 Year</div>
                    <div className={`text-xl font-bold ${product.ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.ytdReturn >= 0 ? '+' : ''}{(product.ytdReturn * 0.7).toFixed(2)}%
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">5 Year</div>
                    <div className={`text-xl font-bold ${product.ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.ytdReturn >= 0 ? '+' : ''}{(product.ytdReturn * 0.6).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'holdings' && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Top 10 Holdings</h3>
                  <span className="text-sm text-slate-600">
                    Total: {holdings.reduce((sum, h) => sum + h.percentage, 0).toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-2">
                  {holdings.map((holding, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="w-8 text-center text-sm font-semibold text-slate-500">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{holding.name}</div>
                        <div className="text-sm text-slate-600">{holding.ticker}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">{holding.percentage.toFixed(2)}%</div>
                        <div className="text-sm text-slate-600">
                          ${(holding.value / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="w-32">
                        <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-blue-500 h-full"
                            style={{ width: `${(holding.percentage / holdings[0].percentage) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-900">
                  <strong>Note:</strong> Holdings data is as of the most recent reporting period and may change daily.
                  The remaining {(100 - holdings.reduce((sum, h) => sum + h.percentage, 0)).toFixed(1)}% consists of other
                  securities, cash equivalents, and derivatives.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Fee Structure</h3>
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-slate-600 mb-2">Expense Ratio</div>
                      <div className="text-3xl font-bold text-slate-900">{product.expenseRatio.toFixed(3)}%</div>
                      <div className="text-sm text-slate-500 mt-1">Annual operating expenses</div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-600 mb-2">Category Average</div>
                      <div className="text-3xl font-bold text-slate-500">{categoryAvg.expenseRatio.toFixed(3)}%</div>
                      <div className="text-sm text-slate-500 mt-1">{product.category} average</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Management Fee</span>
                    <span className="font-semibold">{(product.expenseRatio * 0.85).toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Administrative Costs</span>
                    <span className="font-semibold">{(product.expenseRatio * 0.10).toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-700">Other Expenses</span>
                    <span className="font-semibold">{(product.expenseRatio * 0.05).toFixed(3)}%</span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-100 rounded-lg border-2 border-slate-300">
                    <span className="text-slate-900 font-semibold">Total Annual Fee</span>
                    <span className="font-bold">{product.expenseRatio.toFixed(3)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Fee Impact Calculator</h3>
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-lg p-6">
                  <div className="text-sm mb-4">On a $10,000 investment</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-slate-300 text-xs mb-1">1 Year</div>
                      <div className="text-xl font-bold">${(10000 * product.expenseRatio / 100).toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-slate-300 text-xs mb-1">5 Years</div>
                      <div className="text-xl font-bold">${(10000 * product.expenseRatio / 100 * 5).toFixed(0)}</div>
                    </div>
                    <div>
                      <div className="text-slate-300 text-xs mb-1">10 Years</div>
                      <div className="text-xl font-bold">${(10000 * product.expenseRatio / 100 * 10).toFixed(0)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">Risk Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Volatility (σ)</div>
                    <div className="text-2xl font-bold text-slate-900">{riskMetrics.volatility}%</div>
                    <div className="text-xs text-slate-500 mt-1">Standard deviation</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Sharpe Ratio</div>
                    <div className="text-2xl font-bold text-slate-900">{riskMetrics.sharpeRatio}</div>
                    <div className="text-xs text-slate-500 mt-1">Risk-adjusted return</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Beta (β)</div>
                    <div className="text-2xl font-bold text-slate-900">{riskMetrics.beta}</div>
                    <div className="text-xs text-slate-500 mt-1">Market sensitivity</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Max Drawdown</div>
                    <div className="text-2xl font-bold text-red-600">{riskMetrics.maxDrawdown}%</div>
                    <div className="text-xs text-slate-500 mt-1">Peak to trough</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">Alpha (α)</div>
                    <div className={`text-2xl font-bold ${parseFloat(riskMetrics.alpha) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(riskMetrics.alpha) >= 0 ? '+' : ''}{riskMetrics.alpha}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Excess return</div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-sm text-slate-600 mb-1">R-Squared</div>
                    <div className="text-2xl font-bold text-slate-900">{riskMetrics.rSquared}%</div>
                    <div className="text-xs text-slate-500 mt-1">Correlation to index</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Risk Assessment</h3>
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-bold text-slate-900">{product.riskRating}</div>
                    <div>
                      <div className="font-semibold text-lg">
                        {product.riskRating <= 2 ? 'Low Risk' : product.riskRating === 3 ? 'Moderate Risk' : product.riskRating === 4 ? 'Above Average Risk' : 'High Risk'}
                      </div>
                      <div className="text-sm text-slate-600">
                        {product.riskRating <= 2
                          ? 'Suitable for conservative investors seeking capital preservation'
                          : product.riskRating === 3
                          ? 'Suitable for investors comfortable with moderate volatility'
                          : product.riskRating === 4
                          ? 'Suitable for growth-oriented investors with higher risk tolerance'
                          : 'Suitable for aggressive investors seeking maximum growth potential'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        className={`flex-1 h-3 rounded ${
                          level <= product.riskRating
                            ? level <= 2
                              ? 'bg-green-500'
                              : level === 3
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <strong>Risk Disclosure:</strong> All investments involve risk, including possible loss of principal.
                    Past performance does not guarantee future results. Consider your investment objectives, risks, charges,
                    and expenses carefully before investing.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
