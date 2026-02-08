import React, { useState, useMemo } from 'react';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const X = () => <Icon d="M18 6 L6 18 M6 6 L18 18" size={24} />;
const TrendingUp = () => <Icon d="M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6" size={20} />;
const DollarSign = () => <Icon d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" size={20} />;
const AlertTriangle = () => <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" size={20} />;
const BarChart3 = () => <Icon d="M12 20V10 M18 20V4 M6 20v-4" size={20} />;
const PieChart = () => <Icon d="M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z" size={20} />;

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
    'Foreign Large Growth': { return: 18.3, expenseRatio: 0.85, risk: 5, morningstar: 4 },
    'Diversified Emerging Mkts': { return: 7.8, expenseRatio: 0.25, risk: 5, morningstar: 3 },
    'Intermediate Core Bond': { return: -1.2, expenseRatio: 0.06, risk: 2, morningstar: 4 },
    'Multisector Bond': { return: 5.8, expenseRatio: 0.65, risk: 3, morningstar: 5 },
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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          background: 'linear-gradient(to right, #0f172a, #334155)',
          color: '#fff',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 700 }}>{product.ticker}</span>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                fontSize: '0.875rem'
              }}>{product.type}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 500, marginBottom: '0.5rem', margin: 0 }}>{product.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
              <span>{product.category}</span>
              <span>•</span>
              <span>{product.region}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {'★'.repeat(product.morningstarRating)}{'☆'.repeat(5 - product.morningstarRating)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X />
          </button>
        </div>

        <div style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', gap: '0.25rem', padding: '0 1.5rem' }}>
            {[
              { id: 'overview', label: 'Overview', Icon: BarChart3 },
              { id: 'performance', label: 'Performance', Icon: TrendingUp },
              { id: 'holdings', label: 'Holdings', Icon: PieChart },
              { id: 'fees', label: 'Fees & Costs', Icon: DollarSign },
              { id: 'risk', label: 'Risk Metrics', Icon: AlertTriangle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 500,
                  borderBottom: activeTab === tab.id ? '2px solid #0f172a' : '2px solid transparent',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderTop: 'none',
                  color: activeTab === tab.id ? '#0f172a' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                <tab.Icon />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>YTD Return</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: product.ytdReturn >= 0 ? '#16a34a' : '#dc2626' }}>
                    {product.ytdReturn >= 0 ? '+' : ''}{product.ytdReturn.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>vs {categoryAvg.return.toFixed(2)}% avg</div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Expense Ratio</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{product.expenseRatio.toFixed(2)}%</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>vs {categoryAvg.expenseRatio.toFixed(2)}% avg</div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Total AUM</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
                    ${(product.aum / 1000000000).toFixed(1)}B
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Assets under mgmt</div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Risk Rating</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{product.riskRating}/5</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>vs {categoryAvg.risk}/5 avg</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.75rem' }}>Fund Description</h3>
                <p style={{ color: '#334155', lineHeight: 1.6 }}>
                  {product.name} is a {product.type.toLowerCase()} that tracks the performance of {product.category.toLowerCase()}
                  securities in the {product.region.toLowerCase()} market. This fund provides investors with diversified exposure to
                  {product.assetClass === 'Fixed Income' ? ' fixed income securities' : ' equity markets'} and is suitable for
                  {product.riskRating <= 2 ? ' conservative' : product.riskRating <= 3 ? ' moderate' : ' aggressive'} investors
                  seeking {product.assetClass === 'Fixed Income' ? 'income generation and capital preservation' : 'long-term capital appreciation'}.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>3-Year Historical Performance</h3>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ position: 'relative', height: '16rem' }}>
                    <svg style={{ width: '100%', height: '100%' }}>
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
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>{historicalData[0].date}</span>
                    <span>{historicalData[Math.floor(historicalData.length / 2)].date}</span>
                    <span>{historicalData[historicalData.length - 1].date}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>Returns by Period</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { label: '1 Year', value: product.ytdReturn * 0.9 },
                    { label: '3 Year', value: product.ytdReturn * 0.7 },
                    { label: '5 Year', value: product.ytdReturn * 0.6 }
                  ].map((period, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>{period.label}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: period.value >= 0 ? '#16a34a' : '#dc2626' }}>
                        {period.value >= 0 ? '+' : ''}{period.value.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'holdings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', margin: 0 }}>Top 10 Holdings</h3>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Total: {holdings.reduce((sum, h) => sum + h.percentage, 0).toFixed(1)}%
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {holdings.map((holding, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, color: '#0f172a' }}>{holding.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{holding.ticker}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{holding.percentage.toFixed(2)}%</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                        ${(holding.value / 1000000).toFixed(1)}M
                      </div>
                    </div>
                    <div style={{ width: '8rem' }}>
                      <div style={{ background: '#cbd5e1', borderRadius: '9999px', height: '0.5rem', overflow: 'hidden' }}>
                        <div
                          style={{
                            background: '#3b82f6',
                            height: '100%',
                            width: `${(holding.percentage / holdings[0].percentage) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>Fee Structure</h3>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Expense Ratio</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#0f172a' }}>{product.expenseRatio.toFixed(3)}%</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>Annual operating expenses</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Category Average</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#64748b' }}>{categoryAvg.expenseRatio.toFixed(3)}%</div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>{product.category} average</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>Fee Impact Calculator</h3>
                <div style={{ background: 'linear-gradient(to bottom right, #0f172a, #334155)', color: '#fff', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>On a $10,000 investment</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {[
                      { label: '1 Year', value: 10000 * product.expenseRatio / 100 },
                      { label: '5 Years', value: 10000 * product.expenseRatio / 100 * 5 },
                      { label: '10 Years', value: 10000 * product.expenseRatio / 100 * 10 }
                    ].map((period, idx) => (
                      <div key={idx}>
                        <div style={{ color: '#cbd5e1', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{period.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>${period.value.toFixed(0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>Risk Metrics</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  {[
                    { label: 'Volatility (σ)', value: `${riskMetrics.volatility}%`, sub: 'Standard deviation' },
                    { label: 'Sharpe Ratio', value: riskMetrics.sharpeRatio, sub: 'Risk-adjusted return' },
                    { label: 'Beta (β)', value: riskMetrics.beta, sub: 'Market sensitivity' },
                    { label: 'Max Drawdown', value: `${riskMetrics.maxDrawdown}%`, sub: 'Peak to trough', color: '#dc2626' },
                    { label: 'Alpha (α)', value: `${parseFloat(riskMetrics.alpha) >= 0 ? '+' : ''}${riskMetrics.alpha}%`, sub: 'Excess return', color: parseFloat(riskMetrics.alpha) >= 0 ? '#16a34a' : '#dc2626' },
                    { label: 'R-Squared', value: `${riskMetrics.rSquared}%`, sub: 'Correlation to index' }
                  ].map((metric, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>{metric.label}</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: metric.color || '#0f172a' }}>{metric.value}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{metric.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>Risk Assessment</h3>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 700, color: '#0f172a' }}>{product.riskRating}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                        {product.riskRating <= 2 ? 'Low Risk' : product.riskRating === 3 ? 'Moderate Risk' : product.riskRating === 4 ? 'Above Average Risk' : 'High Risk'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
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

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(level => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: '0.75rem',
                          borderRadius: '4px',
                          background: level <= product.riskRating
                            ? (level <= 2 ? '#10b981' : level === 3 ? '#eab308' : '#ef4444')
                            : '#cbd5e1'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '0.75rem' }}>
                <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>
                  <AlertTriangle />
                </div>
                <div style={{ fontSize: '0.875rem', color: '#78350f' }}>
                  <strong>Risk Disclosure:</strong> All investments involve risk, including possible loss of principal.
                  Past performance does not guarantee future results. Consider your investment objectives, risks, charges,
                  and expenses carefully before investing.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
