import React, { useState, useMemo } from 'react';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const PlusCircle = () => <Icon d="M12 2 A10 10 0 1 1 2 12 A10 10 0 0 1 12 2 M12 8 L12 16 M8 12 L16 12" />;
const Trash = () => <Icon d="M3 6 L21 6 M19 6 L19 20 A2 2 0 0 1 17 22 L7 22 A2 2 0 0 1 5 20 L5 6 M8 6 L8 4 A2 2 0 0 1 10 2 L14 2 A2 2 0 0 1 16 4 L16 6" />;
const AlertTriangle = () => <Icon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />;
const CheckCircle = () => <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />;
const Filter = () => <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />;
const TrendingUp = () => <Icon d="M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6" />;

const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#eab308'];

export function PortfolioBuilder({ portfolios, universeProducts, onSave, onCancel, getProductLabels }) {
  const [portfolio, setPortfolio] = useState({ name: '', description: '', riskLevel: 'Moderate', holdings: [] });
  const [selectedAssetClass, setSelectedAssetClass] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);

  const availableProducts = useMemo(() => {
    return universeProducts.filter(product => {
      const labels = getProductLabels(product.id);
      return labels.available;
    });
  }, [universeProducts, getProductLabels]);

  const groupedProducts = useMemo(() => {
    const groups = {};
    availableProducts.forEach(product => {
      if (!groups[product.assetClass]) {
        groups[product.assetClass] = [];
      }
      groups[product.assetClass].push(product);
    });
    return groups;
  }, [availableProducts]);

  const allTags = useMemo(() => {
    const tags = new Set();
    availableProducts.forEach(product => {
      const labels = getProductLabels(product.id);
      labels.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [availableProducts, getProductLabels]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(product => {
      const labels = getProductLabels(product.id);

      const assetClassMatch = selectedAssetClass === 'all' || product.assetClass === selectedAssetClass;
      const tagMatch = selectedTag === 'all' || labels.tags.includes(selectedTag);

      return assetClassMatch && tagMatch;
    });
  }, [availableProducts, selectedAssetClass, selectedTag, getProductLabels]);

  const validatePortfolio = () => {
    const errors = [];
    const warnings = [];

    if (!portfolio.name) {
      errors.push('Portfolio name is required');
    }

    if (!portfolio.holdings.length) {
      errors.push('At least one holding is required');
    }

    const totalWeight = portfolio.holdings.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0);
    if (Math.abs(totalWeight - 100) > 0.01) {
      errors.push(`Total weight must equal 100%. Current: ${totalWeight.toFixed(2)}%`);
    }

    portfolio.holdings.forEach((holding, idx) => {
      if (!holding.productId) {
        errors.push(`Holding ${idx + 1}: Product is required`);
      } else {
        const inUniverse = universeProducts.some(p => p.id === holding.productId);
        if (!inUniverse) {
          warnings.push(`Holding ${idx + 1}: Product is not in your universe`);
        }
      }

      if (!holding.weight || holding.weight <= 0) {
        errors.push(`Holding ${idx + 1}: Weight must be greater than 0`);
      }
    });

    const assetAllocation = {};
    portfolio.holdings.forEach(holding => {
      const product = universeProducts.find(p => p.id === holding.productId);
      if (product) {
        assetAllocation[product.assetClass] = (assetAllocation[product.assetClass] || 0) + (parseFloat(holding.weight) || 0);
      }
    });

    if (assetAllocation['Equity'] > 70) {
      warnings.push(`Equity allocation (${assetAllocation['Equity'].toFixed(1)}%) exceeds recommended maximum of 70%`);
    }

    if (assetAllocation['Alternatives'] && assetAllocation['Alternatives'] > 20) {
      warnings.push(`Alternatives allocation (${assetAllocation['Alternatives'].toFixed(1)}%) exceeds recommended maximum of 20%`);
    }

    setValidationErrors(errors);
    setValidationWarnings(warnings);

    return errors.length === 0;
  };

  const calculateAnalytics = () => {
    let weightedExpenseRatio = 0;
    let weightedRisk = 0;
    const assetBreakdown = {};

    portfolio.holdings.forEach(holding => {
      const product = universeProducts.find(p => p.id === holding.productId);
      if (product) {
        const weight = parseFloat(holding.weight) || 0;
        weightedExpenseRatio += product.expenseRatio * (weight / 100);
        weightedRisk += product.riskRating * (weight / 100);

        assetBreakdown[product.assetClass] = (assetBreakdown[product.assetClass] || 0) + weight;
      }
    });

    return {
      weightedExpenseRatio: weightedExpenseRatio.toFixed(3),
      weightedRisk: weightedRisk.toFixed(2),
      assetBreakdown
    };
  };

  const addHolding = () => {
    setPortfolio({ ...portfolio, holdings: [...portfolio.holdings, { productId: '', weight: 0 }] });
  };

  const updateHolding = (index, key, value) => {
    const holdings = [...portfolio.holdings];
    holdings[index][key] = value;
    setPortfolio({ ...portfolio, holdings });
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  const removeHolding = (index) => {
    setPortfolio({
      ...portfolio,
      holdings: portfolio.holdings.filter((_, i) => i !== index)
    });
  };

  const handleSave = () => {
    if (validatePortfolio()) {
      portfolio.holdings.forEach(holding => {
        if (holding.productId) {
          localStorage.setItem(`product_last_used_${holding.productId}`, Date.now().toString());
        }
      });
      onSave({ ...portfolio, id: `P${portfolios.length + 1}` });
    }
  };

  const analytics = portfolio.holdings.length > 0 ? calculateAnalytics() : null;
  const totalWeight = portfolio.holdings.reduce((sum, h) => sum + (parseFloat(h.weight) || 0), 0);

  const s = {
    input: { width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit' },
    btn: { padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
    card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '1.5rem' }
  };

  return (
    <div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Create New Portfolio</h3>

        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
              Portfolio Name
            </label>
            <input
              type="text"
              value={portfolio.name}
              onChange={e => setPortfolio({ ...portfolio, name: e.target.value })}
              placeholder="e.g., Conservative Growth"
              style={s.input}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
              Description
            </label>
            <input
              type="text"
              value={portfolio.description}
              onChange={e => setPortfolio({ ...portfolio, description: e.target.value })}
              placeholder="Brief description"
              style={s.input}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: '#94a3b8' }}>
              Risk Level
            </label>
            <select
              value={portfolio.riskLevel}
              onChange={e => setPortfolio({ ...portfolio, riskLevel: e.target.value })}
              style={{ ...s.input, cursor: 'pointer' }}
            >
              <option>Conservative</option>
              <option>Moderate</option>
              <option>Aggressive</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
              Holdings ({totalWeight.toFixed(1)}% allocated)
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={selectedAssetClass}
                onChange={e => setSelectedAssetClass(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  borderRadius: '8px',
                  color: '#60a5fa',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                <option value="all">All Asset Classes</option>
                {Object.keys(groupedProducts).map(assetClass => (
                  <option key={assetClass} value={assetClass}>{assetClass}</option>
                ))}
              </select>

              {allTags.length > 0 && (
                <select
                  value={selectedTag}
                  onChange={e => setSelectedTag(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(139,92,246,0.1)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    borderRadius: '8px',
                    color: '#a78bfa',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  <option value="all">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              )}

              <button onClick={addHolding} style={{
                padding: '0.5rem 1rem',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '8px',
                color: '#10b981',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <PlusCircle />Add Holding
              </button>
            </div>
          </div>

          {!portfolio.holdings.length ? (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              background: 'rgba(15,23,42,0.4)',
              border: '2px dashed rgba(148,163,184,0.2)',
              borderRadius: '8px',
              color: '#64748b'
            }}>
              No holdings yet. Click "Add Holding" to start building your portfolio.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {portfolio.holdings.map((holding, i) => {
                const product = universeProducts.find(p => p.id === holding.productId);
                const labels = product ? getProductLabels(product.id) : null;

                return (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr auto',
                    gap: '1rem',
                    alignItems: 'start',
                    padding: '1rem',
                    background: 'rgba(15,23,42,0.4)',
                    border: '1px solid rgba(148,163,184,0.1)',
                    borderRadius: '8px'
                  }}>
                    <div>
                      <select
                        value={holding.productId}
                        onChange={e => updateHolding(i, 'productId', e.target.value)}
                        style={{ ...s.input, cursor: 'pointer', marginBottom: product ? '0.5rem' : 0 }}
                      >
                        <option value="">Select Product</option>
                        {Object.keys(groupedProducts).map(assetClass => {
                          const products = groupedProducts[assetClass].filter(p => {
                            if (selectedTag === 'all') return true;
                            const labels = getProductLabels(p.id);
                            return labels.tags.includes(selectedTag);
                          });

                          if (products.length === 0) return null;

                          return (
                            <optgroup key={assetClass} label={assetClass}>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.ticker} - {p.name}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      </select>

                      {product && labels && labels.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {labels.tags.map((tag, idx) => (
                            <span
                              key={tag}
                              style={{
                                padding: '0.125rem 0.5rem',
                                background: colors[idx % colors.length],
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: '#fff'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {product && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                          ER: {product.expenseRatio}% • Risk: {product.riskRating}/5 • YTD: {product.ytdReturn > 0 ? '+' : ''}{product.ytdReturn}%
                        </div>
                      )}
                    </div>

                    <input
                      type="number"
                      value={holding.weight}
                      onChange={e => updateHolding(i, 'weight', parseFloat(e.target.value))}
                      placeholder="Weight %"
                      min="0"
                      max="100"
                      step="0.1"
                      style={s.input}
                    />

                    <button
                      onClick={() => removeHolding(i)}
                      style={{
                        padding: '0.5rem',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {(validationErrors.length > 0 || validationWarnings.length > 0) && (
          <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {validationErrors.map((error, idx) => (
              <div key={`error-${idx}`} style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={16} />
                {error}
              </div>
            ))}

            {validationWarnings.map((warning, idx) => (
              <div key={`warning-${idx}`} style={{
                padding: '0.75rem 1rem',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '8px',
                color: '#f59e0b',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={16} />
                {warning}
              </div>
            ))}
          </div>
        )}

        {analytics && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <TrendingUp size={18} className="text-blue-400" />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Portfolio Analytics</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))',
                border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginBottom: '0.25rem', fontWeight: 600 }}>
                  WEIGHTED EXPENSE RATIO
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{analytics.weightedExpenseRatio}%</div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))',
                border: '1px solid rgba(139,92,246,0.3)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginBottom: '0.25rem', fontWeight: 600 }}>
                  WEIGHTED RISK SCORE
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{analytics.weightedRisk}/5</div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))',
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.25rem', fontWeight: 600 }}>
                  TOTAL ALLOCATION
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{totalWeight.toFixed(1)}%</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#94a3b8' }}>
                Asset Class Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(analytics.assetBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([assetClass, weight]) => (
                    <div key={assetClass} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '140px', fontSize: '0.875rem', color: '#f1f5f9', fontWeight: 500 }}>
                        {assetClass}
                      </div>
                      <div style={{ flex: 1, background: 'rgba(148,163,184,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${weight}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <div style={{ width: '60px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600 }}>
                        {weight.toFixed(1)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '0.875rem',
              background: 'rgba(148,163,184,0.1)',
              border: '1px solid rgba(148,163,184,0.2)',
              borderRadius: '8px',
              color: '#f1f5f9',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Cancel
          </button>
          <button onClick={handleSave} style={{ flex: 1, ...s.btn }}>
            <CheckCircle />
            Save Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
