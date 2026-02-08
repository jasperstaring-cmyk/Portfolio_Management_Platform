import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Filter, TrendingUp, BarChart3, Database, Users, Settings } from 'lucide-react';

// Mock Morningstar data - we'll replace this with real API calls next week
const MOCK_PRODUCTS = [
  {
    id: 'MF001',
    name: 'Vanguard Total Stock Market Index Fund',
    ticker: 'VTSAX',
    type: 'Mutual Fund',
    assetClass: 'Equity',
    category: 'Large Blend',
    region: 'US',
    riskRating: 4,
    expenseRatio: 0.04,
    aum: 1250000000000,
    morningstarRating: 5,
    ytdReturn: 12.5
  },
  {
    id: 'ETF001',
    name: 'iShares Core U.S. Aggregate Bond ETF',
    ticker: 'AGG',
    type: 'ETF',
    assetClass: 'Fixed Income',
    category: 'Intermediate Core Bond',
    region: 'US',
    riskRating: 2,
    expenseRatio: 0.03,
    aum: 94000000000,
    morningstarRating: 4,
    ytdReturn: -1.2
  },
  {
    id: 'MF002',
    name: 'Fidelity International Growth Fund',
    ticker: 'FIGFX',
    type: 'Mutual Fund',
    assetClass: 'Equity',
    category: 'Foreign Large Growth',
    region: 'International',
    riskRating: 5,
    expenseRatio: 0.89,
    aum: 12500000000,
    morningstarRating: 4,
    ytdReturn: 18.3
  },
  {
    id: 'ETF002',
    name: 'Invesco QQQ Trust',
    ticker: 'QQQ',
    type: 'ETF',
    assetClass: 'Equity',
    category: 'Large Growth',
    region: 'US',
    riskRating: 5,
    expenseRatio: 0.20,
    aum: 245000000000,
    morningstarRating: 5,
    ytdReturn: 25.7
  },
  {
    id: 'MF003',
    name: 'PIMCO Income Fund',
    ticker: 'PONDX',
    type: 'Mutual Fund',
    assetClass: 'Fixed Income',
    category: 'Multisector Bond',
    region: 'Global',
    riskRating: 3,
    expenseRatio: 0.75,
    aum: 98000000000,
    morningstarRating: 5,
    ytdReturn: 5.8
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAssetClass, setFilterAssetClass] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Load mock data on mount
  useEffect(() => {
    setProducts(MOCK_PRODUCTS);
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.ticker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAssetClass === 'all' || product.assetClass === filterAssetClass;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const getRiskColor = (rating) => {
    const colors = ['#10b981', '#84cc16', '#eab308', '#f97316', '#ef4444'];
    return colors[rating - 1] || '#6b7280';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
      color: '#f1f5f9'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '1.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '-0.02em'
            }}>
              FF
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                FinFiles Portfolio Builder
              </h1>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Corporate Admin Dashboard
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              padding: '0.5rem 1rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#60a5fa'
            }}>
              🟢 Mock Data Mode
            </div>
            <button style={{
              padding: '0.75rem 1rem',
              background: 'rgba(148, 163, 184, 0.1)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '8px',
              color: '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        padding: '0 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
          {[
            { id: 'products', label: 'Product Universe', icon: Database },
            { id: 'portfolios', label: 'Model Portfolios', icon: BarChart3 },
            { id: 'risk', label: 'Risk Profiles', icon: TrendingUp },
            { id: 'advisors', label: 'Advisors', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                  color: activeTab === tab.id ? '#60a5fa' : '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {activeTab === 'products' && (
          <div>
            {/* Controls Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search products by name or ticker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: '#f1f5f9',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>
              <select
                value={filterAssetClass}
                onChange={(e) => setFilterAssetClass(e.target.value)}
                style={{
                  padding: '0.875rem 1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: '#f1f5f9',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">All Asset Classes</option>
                <option value="Equity">Equity</option>
                <option value="Fixed Income">Fixed Income</option>
                <option value="Alternatives">Alternatives</option>
              </select>
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                <PlusCircle size={18} />
                Add Product
              </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Total Products', value: products.length, color: '#3b82f6' },
                { label: 'Equity Funds', value: products.filter(p => p.assetClass === 'Equity').length, color: '#10b981' },
                { label: 'Fixed Income', value: products.filter(p => p.assetClass === 'Fixed Income').length, color: '#8b5cf6' },
                { label: 'Avg Expense Ratio', value: `${(products.reduce((sum, p) => sum + p.expenseRatio, 0) / products.length).toFixed(2)}%`, color: '#f59e0b' }
              ].map((stat, idx) => (
                <div key={idx} style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  borderLeft: `4px solid ${stat.color}`
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{stat.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Products Table */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Class</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>YTD Return</th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AUM</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <tr 
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      style={{
                        borderBottom: idx < filteredProducts.length - 1 ? '1px solid rgba(148, 163, 184, 0.05)' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{product.ticker}</div>
                      </td>
                      <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.875rem' }}>{product.type}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: product.assetClass === 'Equity' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                          border: `1px solid ${product.assetClass === 'Equity' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          color: product.assetClass === 'Equity' ? '#10b981' : '#8b5cf6',
                          fontWeight: 500
                        }}>
                          {product.assetClass}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} style={{
                              width: '8px',
                              height: '24px',
                              background: i <= product.riskRating ? getRiskColor(product.riskRating) : 'rgba(148, 163, 184, 0.1)',
                              borderRadius: '2px'
                            }} />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: product.ytdReturn >= 0 ? '#10b981' : '#ef4444' }}>
                        {product.ytdReturn >= 0 ? '+' : ''}{product.ytdReturn.toFixed(1)}%
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#94a3b8', fontSize: '0.875rem' }}>
                        {formatCurrency(product.aum)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.25rem' }}>
                          {'⭐'.repeat(product.morningstarRating)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
              <div
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '2rem'
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '16px',
                    padding: '2rem',
                    maxWidth: '600px',
                    width: '100%',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', fontWeight: 700 }}>{selectedProduct.name}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Ticker</div>
                      <div style={{ fontWeight: 600 }}>{selectedProduct.ticker}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Type</div>
                      <div style={{ fontWeight: 600 }}>{selectedProduct.type}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Asset Class</div>
                      <div style={{ fontWeight: 600 }}>{selectedProduct.assetClass}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Category</div>
                      <div style={{ fontWeight: 600 }}>{selectedProduct.category}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Expense Ratio</div>
                      <div style={{ fontWeight: 600 }}>{selectedProduct.expenseRatio}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>AUM</div>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(selectedProduct.aum)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    style={{
                      marginTop: '2rem',
                      width: '100%',
                      padding: '0.875rem',
                      background: 'rgba(148, 163, 184, 0.1)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'portfolios' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <BarChart3 size={48} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Model Portfolios</h2>
            <p style={{ color: '#94a3b8', margin: 0 }}>Coming in next session - we'll build the portfolio constructor here</p>
          </div>
        )}

        {activeTab === 'risk' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <TrendingUp size={48} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Risk Profile Builder</h2>
            <p style={{ color: '#94a3b8', margin: 0 }}>Coming soon - questionnaire builder and scoring rules</p>
          </div>
        )}

        {activeTab === 'advisors' && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <Users size={48} style={{ color: '#64748b', margin: '0 auto 1rem' }} />
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>Advisor Management</h2>
            <p style={{ color: '#94a3b8', margin: 0 }}>Coming soon - advisor onboarding and permissions</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
