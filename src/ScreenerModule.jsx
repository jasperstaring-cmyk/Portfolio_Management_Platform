import React, { useState, useMemo } from 'react';
import ProductDetailView from './ProductDetailView';

const Icon = ({ d, size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={d}/></svg>;
const Search = ({ size = 20 }) => <Icon d="M11 19 A8 8 0 1 1 19 11 A8 8 0 0 1 11 19 M21 21 L16.65 16.65" size={size} />;
const Check = () => <Icon d="M20 6 L9 17 L4 12" />;
const ChevronDown = () => <Icon d="M6 9 L12 15 L18 9" />;
const Plus = () => <Icon d="M12 5 L12 19 M5 12 L19 12" />;
const Star = ({ filled = false }) => <Icon d="M12 2 L15.09 10.26 L24 10.26 L17.55 15.57 L19.64 23.83 L12 18.52 L4.36 23.83 L6.45 15.57 L0 10.26 L8.91 10.26 Z" size={16} />;
const Eye = () => <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;

const StarRating = ({ rating }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {Array(5).fill(0).map((_, i) => (
      <Star key={i} filled={i < rating} />
    ))}
  </div>
);

export function ScreenerModule({ allProducts, universeProducts, onAddToUniverse }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({});
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [filters, setFilters] = useState({
    assetClass: [],
    type: [],
    morningstarRating: [],
    region: [],
    expenseRatio: []
  });

  const availableProducts = allProducts.filter(p => !universeProducts.some(u => u.id === p.id));

  const filteredProducts = useMemo(() => {
    return availableProducts.filter(p => {
      const search = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.ticker.toLowerCase().includes(searchTerm.toLowerCase());

      const assetClassMatch = filters.assetClass.length === 0 || filters.assetClass.includes(p.assetClass);
      const typeMatch = filters.type.length === 0 || filters.type.includes(p.type);
      const morningstarMatch = filters.morningstarRating.length === 0 || filters.morningstarRating.includes(p.morningstarRating);
      const regionMatch = filters.region.length === 0 || filters.region.includes(p.region);

      let expenseRatioMatch = filters.expenseRatio.length === 0;
      if (!expenseRatioMatch) {
        expenseRatioMatch = filters.expenseRatio.some(range => {
          if (range === '<0.5') return p.expenseRatio < 0.5;
          if (range === '0.5-1') return p.expenseRatio >= 0.5 && p.expenseRatio <= 1;
          if (range === '>1') return p.expenseRatio > 1;
          return false;
        });
      }

      return search && assetClassMatch && typeMatch && morningstarMatch && regionMatch && expenseRatioMatch;
    });
  }, [availableProducts, searchTerm, filters]);

  const assetClasses = [...new Set(availableProducts.map(p => p.assetClass))].sort();
  const types = [...new Set(availableProducts.map(p => p.type))].sort();
  const regions = [...new Set(availableProducts.map(p => p.region))].sort();
  const ratings = [5, 4, 3, 2, 1];

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const toggleProduct = (productId) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleAddSelected = () => {
    const toAdd = filteredProducts.filter(p => selectedProducts[p.id]);
    if (toAdd.length === 0) {
      alert('Please select products to add');
      return;
    }
    onAddToUniverse(toAdd);
    setSelectedProducts({});
  };

  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;

  const s = {
    input: { width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit' },
    btn: { padding: '0.875rem 1.5rem', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' },
    card: { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '12px', padding: '1.5rem' }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
      <aside style={s.card}>
        <h3 style={{ margin: '0 0 1.5rem', fontSize: '1rem', fontWeight: 700 }}>Filters</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Asset Class</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {assetClasses.map(ac => (
                <label key={ac} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#f1f5f9' }}>
                  <input type="checkbox" checked={filters.assetClass.includes(ac)} onChange={() => toggleFilter('assetClass', ac)} style={{ width: '16px', height: '16px' }} />
                  {ac}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {types.map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#f1f5f9' }}>
                  <input type="checkbox" checked={filters.type.includes(t)} onChange={() => toggleFilter('type', t)} style={{ width: '16px', height: '16px' }} />
                  {t}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Morningstar Rating</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {ratings.map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#f1f5f9' }}>
                  <input type="checkbox" checked={filters.morningstarRating.includes(r)} onChange={() => toggleFilter('morningstarRating', r)} style={{ width: '16px', height: '16px' }} />
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array(r).fill(0).map((_, i) => (
                      <Star key={i} filled={true} />
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Region</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {regions.map(r => (
                <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#f1f5f9' }}>
                  <input type="checkbox" checked={filters.region.includes(r)} onChange={() => toggleFilter('region', r)} style={{ width: '16px', height: '16px' }} />
                  {r}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Expense Ratio</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['<0.5', '0.5-1', '>1'].map(range => (
                <label key={range} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: '#f1f5f9' }}>
                  <input type="checkbox" checked={filters.expenseRatio.includes(range)} onChange={() => toggleFilter('expenseRatio', range)} style={{ width: '16px', height: '16px' }} />
                  {range}%
                </label>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by ticker or name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ ...s.input, paddingLeft: '2.5rem' }}
            />
          </div>
          <button onClick={handleAddSelected} disabled={selectedCount === 0} style={{ ...s.btn, opacity: selectedCount === 0 ? 0.5 : 1 }}>
            <Plus />Add Selected ({selectedCount})
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <p>No products match your filters</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} style={{ ...s.card, cursor: 'pointer', border: selectedProducts[product.id] ? '2px solid #3b82f6' : '1px solid rgba(148,163,184,0.1)', background: selectedProducts[product.id] ? 'rgba(59,130,246,0.05)' : 'rgba(15,23,42,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedProducts[product.id] || false}
                    onChange={() => toggleProduct(product.id)}
                    style={{ width: '20px', height: '20px', marginTop: '0.25rem', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>{product.ticker}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{product.name}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8' }}>Rating:</span>
                    <StarRating rating={product.morningstarRating} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Expense Ratio:</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{product.expenseRatio}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>YTD Return:</span>
                    <span style={{ color: product.ytdReturn > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>{product.ytdReturn > 0 ? '+' : ''}{product.ytdReturn}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Risk:</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{product.riskRating}/5</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Asset Class:</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{product.assetClass}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Type:</span>
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{product.type}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProductDetail(product);
                  }}
                  style={{
                    marginTop: '0.75rem',
                    width: '100%',
                    padding: '0.625rem',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid rgba(59,130,246,0.3)',
                    borderRadius: '6px',
                    color: '#60a5fa',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Eye />
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedProductDetail && (
        <ProductDetailView
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
        />
      )}
    </div>
  );
}
