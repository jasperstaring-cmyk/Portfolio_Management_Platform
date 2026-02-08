import React, { useMemo } from 'react';
import { TrendingUp, Package, Clock, AlertCircle } from 'lucide-react';

const PieChart = ({ data, size = 300 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          currentAngle = endAngle;

          const startRad = (startAngle - 90) * (Math.PI / 180);
          const endRad = (endAngle - 90) * (Math.PI / 180);

          const radius = size / 2 - 40;
          const x1 = radius * Math.cos(startRad);
          const y1 = radius * Math.sin(startRad);
          const x2 = radius * Math.cos(endRad);
          const y2 = radius * Math.sin(endRad);

          const largeArc = angle > 180 ? 1 : 0;

          const path = [
            `M 0 0`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');

          return (
            <g key={index}>
              <path d={path} fill={item.color} opacity="0.9" />
              {percentage > 5 && (
                <text
                  x={radius * 0.7 * Math.cos((startAngle + angle / 2 - 90) * (Math.PI / 180))}
                  y={radius * 0.7 * Math.sin((startAngle + angle / 2 - 90) * (Math.PI / 180))}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="600"
                >
                  {percentage.toFixed(0)}%
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

const BarChart = ({ data, height = 300 }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 100 / data.length;

  return (
    <svg width="100%" height={height} style={{ overflow: 'visible' }}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * (height - 60);
        const x = index * barWidth + '%';

        return (
          <g key={index}>
            <rect
              x={`calc(${x} + 10%)`}
              y={height - 40 - barHeight}
              width={`${barWidth * 0.6}%`}
              height={barHeight}
              fill={item.color}
              rx="4"
            />
            <text
              x={`calc(${x} + ${barWidth * 0.45}%)`}
              y={height - 20}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="11"
              fontWeight="500"
            >
              {item.label}
            </text>
            <text
              x={`calc(${x} + ${barWidth * 0.45}%)`}
              y={height - 45 - barHeight}
              textAnchor="middle"
              fill="#f1f5f9"
              fontSize="14"
              fontWeight="600"
            >
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default function UniverseAnalytics({ universeProducts, portfolios, getProductLabels, getPortfolioUsage }) {
  const analytics = useMemo(() => {
    const assetClassBreakdown = {};
    const categoryBreakdown = {};
    const productUsage = {};

    universeProducts.forEach(product => {
      assetClassBreakdown[product.assetClass] = (assetClassBreakdown[product.assetClass] || 0) + 1;
      categoryBreakdown[product.category] = (categoryBreakdown[product.category] || 0) + 1;

      const usageCount = getPortfolioUsage(product.id).length;
      productUsage[product.id] = {
        product,
        count: usageCount
      };
    });

    const sortedByUsage = Object.values(productUsage)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const unused90Days = universeProducts.filter(p => {
      const lastUsed = localStorage.getItem(`product_last_used_${p.id}`);
      if (!lastUsed) return true;
      const daysSince = (Date.now() - parseInt(lastUsed)) / (1000 * 60 * 60 * 24);
      return daysSince > 90;
    });

    const recentlyAdded = universeProducts
      .map(p => ({
        ...p,
        addedDate: localStorage.getItem(`product_added_${p.id}`) || Date.now()
      }))
      .sort((a, b) => b.addedDate - a.addedDate)
      .slice(0, 5);

    const totalExpenseRatio = universeProducts.reduce((sum, p) => sum + p.expenseRatio, 0);
    const avgExpenseRatio = totalExpenseRatio / universeProducts.length;

    const totalAUM = universeProducts.reduce((sum, p) => sum + p.aum, 0);

    return {
      assetClassBreakdown,
      categoryBreakdown,
      sortedByUsage,
      unused90Days,
      recentlyAdded,
      avgExpenseRatio,
      totalAUM
    };
  }, [universeProducts, portfolios]);

  const assetClassColors = {
    'Equity': '#3b82f6',
    'Fixed Income': '#10b981',
    'Alternatives': '#f59e0b',
    'Cash': '#8b5cf6'
  };

  const pieData = Object.entries(analytics.assetClassBreakdown).map(([name, value]) => ({
    name,
    value,
    color: assetClassColors[name] || '#64748b'
  }));

  const usageBarData = analytics.sortedByUsage.map((item, idx) => ({
    label: item.product.ticker,
    value: item.count,
    color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#eab308', '#6366f1', '#8b5cf6'][idx]
  }));

  const s = {
    card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '1.5rem' },
    statCard: { background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', padding: '1.5rem' }
  };

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={s.statCard}>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.5rem', fontWeight: 600 }}>AVG EXPENSE RATIO</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{analytics.avgExpenseRatio.toFixed(3)}%</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Across {universeProducts.length} products</div>
        </div>

        <div style={{ ...s.statCard, background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', fontWeight: 600 }}>TOTAL AUM</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>${(analytics.totalAUM / 1000000000000).toFixed(2)}T</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Combined assets</div>
        </div>

        <div style={{ ...s.statCard, background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)' }}>
          <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginBottom: '0.5rem', fontWeight: 600 }}>NEEDS REVIEW</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{analytics.unused90Days.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Not used in 90+ days</div>
        </div>

        <div style={{ ...s.statCard, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)' }}>
          <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.5rem', fontWeight: 600 }}>CATEGORIES</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{Object.keys(analytics.categoryBreakdown).length}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Unique categories</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Package className="w-5 h-5 text-blue-400" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Asset Allocation</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <PieChart data={pieData} size={280} />
            </div>

            <div style={{ flex: 1, display: 'grid', gap: '0.75rem' }}>
              {pieData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: item.color }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {item.value} products ({((item.value / universeProducts.length) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Most Used Products</h3>
          </div>

          <BarChart data={usageBarData} height={280} />

          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
            Usage count across all portfolios
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Clock className="w-5 h-5 text-purple-400" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Recently Added</h3>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {analytics.recentlyAdded.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                No recent additions
              </div>
            ) : (
              analytics.recentlyAdded.map(product => {
                const usageCount = getPortfolioUsage(product.id).length;
                return (
                  <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(15,23,42,0.4)', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.1)' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9' }}>{product.ticker}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{product.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Used in</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: usageCount > 0 ? '#10b981' : '#64748b' }}>
                        {usageCount}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Products Needing Review</h3>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto' }}>
            {analytics.unused90Days.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                All products are actively used
              </div>
            ) : (
              analytics.unused90Days.map(product => (
                <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(245,158,11,0.1)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9' }}>{product.ticker}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{product.name}</div>
                  </div>
                  <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(245,158,11,0.2)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b' }}>
                    Unused
                  </div>
                </div>
              ))
            )}
          </div>

          {analytics.unused90Days.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', fontSize: '0.75rem', color: '#f59e0b' }}>
              Consider reviewing these products for removal or portfolio inclusion
            </div>
          )}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Category Breakdown</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {Object.entries(analytics.categoryBreakdown)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => {
              const percentage = (count / universeProducts.length) * 100;
              return (
                <div key={category} style={{ padding: '1rem', background: 'rgba(15,23,42,0.4)', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{category}</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#60a5fa' }}>{count}</div>
                  </div>
                  <div style={{ background: 'rgba(148,163,184,0.2)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {percentage.toFixed(1)}% of universe
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
